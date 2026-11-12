import { scopeChainOf } from '@deepseek-ai/dsh-scope';
import { deriveSelection, resolveChildRule } from './persona-rules.js';

/** Native metadata owns ancestry/workspaces; the store owns persona rules. */
export function createPersonaRuntime(store, ctx) {
  const bindings = new WeakMap(), headers = new Map(), titles = new Map(), pending = new Map();
  const service = name => ctx?.get?.(name);
  const workspaces = () => (service('workspaceRegistry')?.list?.() ?? []).map(row => ({ id: String(row.id), title: row.title, path: row.path, sessionIds: [...row.sessionIds].map(String) }));
  function agentFor(id) { return service('agents')?.get?.(id); }
  function descriptor(id, agent, visited = new Set()) {
    const session = agent?.session ?? service('sessions')?.get?.(id);
    const header = session?.header ?? headers.get(id);
    const saved = store.state.sessions[id];
    const parent = scopeChainOf(agent).slice(1).find(item => item?.session?.id);
    const isChild = header?.origin === 'subagent' || (!header?.origin && !!parent);
    const parentId = isChild ? String(header?.parentSession ?? parent?.session?.id ?? saved?.parentSessionId ?? '') : undefined;
    const spaces = workspaces();
    let workspaceId = spaces.find(row => row.sessionIds.includes(id))?.id;
    if (!workspaceId && parentId && !visited.has(parentId) && visited.size < 64) {
      visited.add(id); workspaceId = descriptor(parentId, agentFor(parentId), visited).workspaceId;
    }
    if (!workspaceId && header?.cwd) workspaceId = spaces.find(row => row.path === header.cwd)?.id;
    if (!ctx) workspaceId = saved?.workspaceId;
    const title = session ? service('sessionTitle')?.get?.(session)?.title : undefined;
    return { id, workspaceId: workspaceId ?? null, kind: isChild ? 'subagent' : header ? 'session' : saved?.kind ?? 'session', parentSessionId: parentId || (header ? null : saved?.parentSessionId ?? null), title: title ?? titles.get(id) ?? header?.title ?? saved?.title ?? id };
  }
  function capture(agent) {
    const id = agent?.session?.id;
    if (!id) return null;
    headers.set(String(id), agent.session.header ?? { id });
    const info = descriptor(String(id), agent);
    if (info.kind === 'subagent' && !store.state.sessions[id]?.derived) {
      const parent = agentFor(info.parentSessionId) ?? scopeChainOf(agent).slice(1).find(item => item?.session?.id === info.parentSessionId);
      const parentId = parent && bindings.has(parent) ? bindings.get(parent) : store.effective(info.parentSessionId, descriptor(info.parentSessionId, parent)).personaId;
      const policy = resolveChildRule(store.state, info.parentSessionId, info.workspaceId);
      info.derived = { selection: deriveSelection(policy.rule, parentId), policy: structuredClone(policy.rule), source: policy.source };
    }
    return info;
  }
  async function registerAgent(agent) {
    // Snapshot before awaiting disk writes, while the dispatcher's request is
    // still the owner. Agent creation is awaited by the native Agent factory.
    const info = capture(agent);
    if (!info) return;
    if (pending.has(info.id)) return pending.get(info.id);
    const operation = store.registerSessions([info]);
    pending.set(info.id, operation);
    try { await operation; } finally { if (pending.get(info.id) === operation) pending.delete(info.id); }
  }
  async function refresh() {
    const query = service('sessionQuery');
    if (query) for (const row of await query.listSessions()) {
      const id=String(row.header.id);headers.set(id,row.header);
      if(!titles.has(id)&&query.inspectSession&&service('sessionTitle')) {
        const title=await query.inspectSession(id,session=>service('sessionTitle').get(session)?.title);
        titles.set(id,title??id);
      }
    }
    for (const session of service('sessions')?.list?.() ?? []) headers.set(String(session.id), session.header);
  }
  function catalog() {
    const ids = new Set([...headers.keys(), ...Object.keys(store.state.sessions), ...(service('sessions')?.list?.()??[]).map(row=>String(row.id))]);
    return { workspaces: workspaces().map(({ sessionIds, ...row }) => row), sessions: [...ids].map(id => descriptor(id, agentFor(id))) };
  }
  return {
    descriptor, catalog, refresh, registerAgent,
    async initialize() {
      await refresh();
      // An old implicit inheritance is not a user-selected child binding.
      await store.registerSessions(catalog().sessions);
    },
    async forPrompt(scope) {
      await registerAgent(scope);
      const id = scope?.session?.id;
      const persona = id ? store.effective(String(id), descriptor(String(id), scope)).persona : store.effective().persona;
      if (scope) bindings.set(scope, persona?.id ?? null);
      return persona;
    },
    forExecution(agent) {
      if (!store.state.enabled) return null;
      if (bindings.has(agent)) { const id = bindings.get(agent); return id ? store.state.personas.find(row => row.id === id) ?? null : null; }
      const id = agent?.session?.id;
      return id ? store.effective(String(id), descriptor(String(id), agent)).persona : null;
    },
  };
}
