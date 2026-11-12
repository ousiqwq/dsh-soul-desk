import { SoulError } from './memory-policy.js';

export const followRule = () => ({ mode: 'follow' });
export const noneRule = () => ({ mode: 'none' });
const own = (value, key) => Object.hasOwn(value ?? {}, key);
export function ruleId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(value) || ['__proto__','constructor','prototype'].includes(value)) throw new SoulError('无效的规则标识。');
  return value;
}
export function validateRule(value, { children = false, follow = true } = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SoulError('人设规则格式无效。');
  const modes = ['none', 'persona', ...(follow ? ['follow'] : []), ...(children ? ['parent'] : [])];
  if (!modes.includes(value.mode)) throw new SoulError('人设规则模式无效。');
  return value.mode === 'persona' ? { mode: 'persona', personaId: ruleId(value.personaId) } : { mode: value.mode };
}
export function ruleFromLegacy(value) {
  return value === 'none' ? noneRule() : value ? { mode: 'persona', personaId: ruleId(value) } : followRule();
}
export function legacyFromRule(rule) { return rule.mode === 'persona' ? rule.personaId : rule.mode === 'none' ? 'none' : ''; }
export function validateSessionRule(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SoulError('会话规则格式无效。');
  const result = { persona: validateRule(value.persona ?? followRule()), children: validateRule(value.children ?? followRule(), { children: true }) };
  for (const key of ['workspaceId','parentSessionId']) if (value[key]) result[key] = ruleId(value[key]);
  result.kind = value.kind === 'subagent' ? 'subagent' : 'session';
  if (value.title !== undefined) {
    if (typeof value.title !== 'string' || value.title.length > 500) throw new SoulError('会话标题无效。');
    result.title = value.title;
  }
  if (value.derived) {
    result.derived = {
      selection: validateRule(value.derived.selection, { follow: false }),
      policy: validateRule(value.derived.policy, { children: true, follow: false }),
      source: validateSource(value.derived.source),
    };
  }
  return result;
}
export function validateSource(value) {
  if (!value || !['global','workspace','session','subagent'].includes(value.scope)) throw new SoulError('人设来源无效。');
  return { scope: value.scope, ...(value.id ? { id: ruleId(value.id) } : {}) };
}
export function validateRuleMaps(input, legacy = false) {
  const sessions = Object.create(null), workspaces = Object.create(null);
  for (const [name, source, target] of [['sessions', own(input,'sessions') ? input.sessions : {}, sessions], ['workspaces', own(input,'workspaces') ? input.workspaces : {}, workspaces]]) {
    if (!source || typeof source !== 'object' || Array.isArray(source) || Object.keys(source).length > 10000) throw new SoulError('人设规则数量或格式无效。');
    for (const [id, value] of Object.entries(source)) {
      ruleId(id);
      if(name==='workspaces'&&(!value||typeof value!=='object'||Array.isArray(value)))throw new SoulError('人设规则格式无效。');
      target[id] = name === 'sessions'
        ? validateSessionRule(legacy ? { persona: ruleFromLegacy(value) } : value)
        : { persona: validateRule(value.persona ?? followRule()), children: validateRule(value.children ?? followRule(), { children: true }) };
    }
  }
  return { sessions, workspaces, subagentDefault: validateRule(own(input,'subagentDefault') ? input.subagentDefault : noneRule(), { children: true, follow: false }) };
}

/** Select the dispatcher's policy, never the eventual child's default persona. */
export function resolveChildRule(state, sessionId, workspaceId) {
  const visited = new Set();
  let id = sessionId;
  while (id) {
    if (visited.has(id) || visited.size >= 64) return { rule: noneRule(), source: { scope: 'global' }, invalid: true };
    visited.add(id);
    const record = state.sessions[id];
    if (!record) break;
    if (record.children.mode !== 'follow') return { rule: record.children, source: { scope: 'session', id } };
    id = record.kind === 'subagent' ? record.parentSessionId : undefined;
  }
  const workspace = state.workspaces[workspaceId];
  if (workspace?.children.mode !== undefined && workspace.children.mode !== 'follow') return { rule: workspace.children, source: { scope: 'workspace', id: workspaceId } };
  return { rule: state.subagentDefault, source: { scope: 'global' } };
}
export function deriveSelection(policy, parentPersonaId) {
  return policy.mode === 'parent' ? (parentPersonaId ? { mode: 'persona', personaId: parentPersonaId } : noneRule()) : structuredClone(policy);
}

/** Pure, shared by the API, prompt assembly and memory ownership checks. */
export function resolvePersona(state, sessionId, context = {}) {
  const record = state.sessions[sessionId];
  const workspaceId = own(context, 'workspaceId') ? context.workspaceId : record?.workspaceId;
  const kind = context.kind ?? record?.kind ?? 'session';
  const selection = record?.persona ?? followRule();
  let rule = selection, source = { scope: 'session', ...(sessionId ? { id: sessionId } : {}) };
  if (rule.mode === 'follow') {
    if (kind === 'subagent') {
      rule = record?.derived?.selection ?? noneRule();
      source = { scope: 'subagent', ...(record?.parentSessionId ? { id: record.parentSessionId } : {}) };
    } else {
      const workspace = state.workspaces[workspaceId];
      if (workspace?.persona && workspace.persona.mode !== 'follow') {
        rule = workspace.persona; source = { scope: 'workspace', id: workspaceId };
      } else {
        rule = state.defaultPersonaId ? { mode: 'persona', personaId: state.defaultPersonaId } : noneRule();
        source = { scope: 'global' };
      }
    }
  }
  const candidate = rule.mode === 'persona' ? state.personas.find(item => item.id === rule.personaId) : null;
  const status = !state.enabled ? 'disabled' : rule.mode === 'none' ? 'none' : !candidate ? 'missing' : !candidate.soul.trim() ? 'empty' : 'active';
  return { selection, rule, source, workspaceId: workspaceId ?? null, kind, status, personaId: status === 'active' ? candidate.id : null, requestedPersonaId: rule.personaId ?? null, persona: status === 'active' ? candidate : null };
}

export function remapRule(rule, ids) {
  return rule.mode === 'persona' ? { ...rule, personaId: ids.get(rule.personaId) ?? rule.personaId } : structuredClone(rule);
}
export function remapSession(record, ids) {
  return { ...structuredClone(record), persona: remapRule(record.persona, ids), children: remapRule(record.children, ids), ...(record.derived ? { derived: { ...record.derived, selection: remapRule(record.derived.selection, ids), policy: remapRule(record.derived.policy, ids) } } : {}) };
}
