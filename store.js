import { readFile, writeFile, mkdir, rename, unlink, readdir, open } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { SoulError, validateMemory, memoryKey } from './memory-policy.js';
import { validateRuleMaps, validateRule, validateSessionRule, followRule, noneRule, ruleFromLegacy, legacyFromRule, resolvePersona, resolveChildRule, remapRule, remapSession } from './persona-rules.js';

export const MAX_LIBRARY_BYTES = 8 * 1024 * 1024;
export const MAX_PERSONAS = 100;
export const MAX_MEMORIES = 500;
export const MAX_SOUL_LENGTH = 262144;
const ID = /^[a-zA-Z0-9_-]{1,100}$/;
const clone = value => structuredClone(value);
const timestamp = () => new Date().toISOString();

function string(value, max, label, empty = false) {
  if (typeof value !== 'string' || value.length > max || (!empty && !value.trim())) throw new SoulError(`${label}格式不正确或过长。`);
  return value;
}
function identifier(value) { if (typeof value !== 'string' || !ID.test(value) || ['__proto__','prototype','constructor'].includes(value)) throw new SoulError('无效的标识。'); return value; }
function safeDate(value) { return typeof value === 'string' && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : timestamp(); }

export function validateLibrary(input) {
  if (!input || typeof input !== 'object' || ![2,3].includes(input.version) || !Array.isArray(input.personas)) throw new SoulError('不是有效的私人灵魂 v2/v3 存档。');
  if (input.personas.length > MAX_PERSONAS) throw new SoulError(`最多保存 ${MAX_PERSONAS} 个人设。`);
  const ids = new Set();
  const personas = input.personas.map(item => {
    const id = identifier(item.id);
    if (ids.has(id)) throw new SoulError('存档含重复人设 ID。');
    ids.add(id);
    if (!Array.isArray(item.memories) || item.memories.length > MAX_MEMORIES) throw new SoulError(`每个人设最多 ${MAX_MEMORIES} 条记忆。`);
    const memoryIds = new Set();
    const memories = item.memories.map(row => {
      const memoryId = identifier(row.id);
      if (memoryIds.has(memoryId)) throw new SoulError('同一人设内有重复记忆 ID。');
      memoryIds.add(memoryId);
      return { id: memoryId, kind: row.kind, content: validateMemory(row.kind, row.content), version: Number.isSafeInteger(row.version) && row.version > 0 ? row.version : 1, createdAt: safeDate(row.createdAt), updatedAt: safeDate(row.updatedAt), source: row.source === 'agent' ? 'agent' : 'user' };
    });
    return { id, name: string(item.name, 80, '人设名称').trim(), soul: string(item.soul, MAX_SOUL_LENGTH, '人格文本', true), createdAt: safeDate(item.createdAt), updatedAt: safeDate(item.updatedAt), memories };
  });
  if (input.version === 2) for (const id of Object.values(input.sessions ?? {})) if (id !== 'none' && !ids.has(id)) throw new SoulError('会话绑定指向不存在的人设。');
  const rules = validateRuleMaps(input, input.version === 2);
  if (input.defaultPersonaId !== null) identifier(input.defaultPersonaId);
  if (input.version === 2 && input.defaultPersonaId !== null && !ids.has(input.defaultPersonaId)) throw new SoulError('默认人设不存在。');
  if (!['priority','complete','append'].includes(input.mode) || typeof input.enabled !== 'boolean') throw new SoulError('人格开关或注入方式无效。');
  const value = { version: 3, revision: Number.isSafeInteger(input.revision) && input.revision >= 0 ? input.revision : 0, enabled: input.enabled, mode: input.mode, defaultPersonaId: input.defaultPersonaId, personas, ...rules };
  const envelope={format:'private-soul-backup',version:3,exportedAt:timestamp(),data:value};
  if (Buffer.byteLength(JSON.stringify(envelope,null,2))+32 > MAX_LIBRARY_BYTES) throw new SoulError('整体存档超过 8 MiB，请精简后再保存。');
  return value;
}

export class SoulStore {
  constructor(file, onChange = () => {}) { this.file = file; this.onChange = onChange; this.queue = Promise.resolve(); this.state = null; this.closed = false; }
  async init(legacy = {}) {
    await mkdir(dirname(this.file), { recursive: true, mode: 0o700 });
    try {
      const bytes = await readFile(this.file);
      if (bytes.length > MAX_LIBRARY_BYTES) throw new SoulError('现有存档过大，拒绝覆盖。');
      const original = JSON.parse(bytes.toString('utf8'));
      this.state = validateLibrary(original);
      if (original.version === 2) {
        try { await writeFile(this.file+'.pre-v3.json',bytes,{mode:0o600,flag:'wx'}); } catch (error) { if(error.code!=='EEXIST')throw error; }
        await this.persist(this.state);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const text = typeof legacy.text === 'string' ? legacy.text : '';
      const persona = text.trim() ? this.newPersona('默认人格', text) : null;
      this.state = validateLibrary({ version: 2, revision: 0, enabled: !!legacy.enabled, mode: legacy.mode ?? 'priority', defaultPersonaId: persona?.id ?? null, personas: persona ? [persona] : [], sessions: {} });
      await this.persist(this.state);
    }
    return this;
  }
  newPersona(name, soul = '') { const at = timestamp(); return { id: randomUUID(), name, soul, createdAt: at, updatedAt: at, memories: [] }; }
  snapshot() { return clone(this.state); }
  persona(id, state = this.state) { const found = state.personas.find(row => row.id === id); if (!found) throw new SoulError('人设已不存在，请刷新后重试。','persona-not-found',404); return found; }
  resolve(sessionIds = []) {
    return this.effective(sessionIds[0]).persona;
  }
  effective(sessionId, context = {}) { return resolvePersona(this.state, sessionId, context); }
  view(sessionId, compact = false, context = {}) {
    const value = this.snapshot();
    const { persona, ...effective } = this.effective(sessionId, context);
    const selection = effective.selection, override = legacyFromRule(selection);
    const children = { selection: value.sessions[sessionId]?.children ?? followRule(), ...resolveChildRule(value, sessionId, effective.workspaceId) };
    const extra = { activePersonaId: effective.personaId, effectivePersonaId: effective.personaId, effective, selection, override, children, sessionInfo: sessionId ? { id: sessionId, ...value.sessions[sessionId], ...context } : null };
    if (compact) return { revision: value.revision, enabled: value.enabled, mode: value.mode, defaultPersonaId: value.defaultPersonaId, personas: value.personas.map(row => ({ id: row.id, name: row.name, memoryCount: row.memories.length })), ...extra };
    return { ...value, ...extra };
  }
  export() { return { format: 'private-soul-backup', version: 3, exportedAt: timestamp(), data: this.snapshot() }; }
  registerSessions(descriptors) {
    return this.mutate(undefined, state => {
      for (const descriptor of descriptors) {
        const id = identifier(descriptor.id), previous = state.sessions[id];
        const row = previous ?? { persona: followRule(), children: followRule(), kind: 'session' };
        for (const key of ['workspaceId','parentSessionId','title','kind']) if (Object.hasOwn(descriptor,key)) {
          if (descriptor[key] === null || descriptor[key] === undefined) delete row[key]; else row[key] = descriptor[key];
        }
        if (row.kind === 'subagent' && !row.derived) row.derived = descriptor.derived ?? { selection: noneRule(), policy: noneRule(), source: { scope: 'global' } };
        state.sessions[id] = validateSessionRule(row);
      }
      return {};
    });
  }
  async persist(state) {
    const temporary = `${this.file}.${randomUUID()}.tmp`;
    const bytes = JSON.stringify(state, null, 2) + '\n';
    const handle = await open(temporary, 'wx', 0o600);
    try { await handle.writeFile(bytes); await handle.sync(); } finally { await handle.close(); }
    try { await rename(temporary, this.file); } catch (error) { await unlink(temporary).catch(() => {}); throw error; }
  }
  async backup() {
    const dir = join(dirname(this.file),'backups');
    await mkdir(dir,{recursive:true,mode:0o700});
    await writeFile(join(dir,`${Date.now()}-${randomUUID()}.json`),JSON.stringify(this.export(),null,2)+'\n',{mode:0o600,flag:'wx'});
    const files=(await readdir(dir)).filter(name=>name.endsWith('.json')).sort();
    for (const file of files.slice(0,Math.max(0,files.length-20))) await unlink(join(dir,file));
  }
  mutate(expectedRevision, transform, backup = false) {
    const operation = this.queue.then(async () => {
      if (this.closed) throw new SoulError('存档服务正在退出。','unavailable',503);
      if (expectedRevision !== undefined && expectedRevision !== this.state.revision) throw new SoulError('内容已被其他页面或记忆操作更新。草稿仍保留，请重新读取后合并。','conflict',409);
      const draft = this.snapshot();
      const result = await transform(draft);
      const next = validateLibrary(draft);
      if (JSON.stringify(next) === JSON.stringify(this.state)) return { revision: this.state.revision, ...result };
      next.revision = this.state.revision + 1;
      if (backup) await this.backup();
      await this.persist(next);
      this.state = next;
      this.onChange();
      return { revision: next.revision, ...result };
    });
    this.queue = operation.catch(() => {});
    return operation;
  }
  async action(action, data, expectedRevision) {
    return this.mutate(expectedRevision, state => {
      if (action === 'persona-save') {
        let persona;
        if (data.id) persona = this.persona(data.id,state);
        else { persona = this.newPersona(string(data.name,80,'人设名称').trim()); state.personas.push(persona); }
        persona.name = string(data.name,80,'人设名称').trim();
        persona.soul = string(data.soul,MAX_SOUL_LENGTH,'人格文本',true);
        persona.updatedAt = timestamp();
        if (data.activate) { if (!persona.soul.trim()) throw new SoulError('先填写人格文本再启用。'); state.enabled = true; state.defaultPersonaId = persona.id; }
        return { personaId: persona.id };
      }
      if (action === 'persona-delete') {
        this.persona(data.id,state);
        state.personas = state.personas.filter(row => row.id !== data.id);
        // Keep references as visible invalid rules. Deletion must not silently
        // reassign a conversation, workspace or future child to another persona.
        return {};
      }
      if (action === 'settings') {
        if (Object.hasOwn(data,'enabled')) { if (typeof data.enabled !== 'boolean') throw new SoulError('开关格式错误。'); state.enabled=data.enabled; }
        if (Object.hasOwn(data,'mode')) state.mode=data.mode;
        if (Object.hasOwn(data,'defaultPersonaId')) { if (data.defaultPersonaId!==null)this.persona(data.defaultPersonaId,state); state.defaultPersonaId=data.defaultPersonaId; }
        if (Object.hasOwn(data,'subagentDefault')) { state.subagentDefault=validateRule(data.subagentDefault,{children:true,follow:false});if(state.subagentDefault.mode==='persona')this.persona(state.subagentDefault.personaId,state); }
        return {};
      }
      if (action === 'session-select') {
        identifier(data.sessionId);
        const rule=ruleFromLegacy(data.personaId);if(rule.mode==='persona')this.persona(rule.personaId,state);
        const row=state.sessions[data.sessionId]??validateSessionRule({});row.persona=rule;state.sessions[data.sessionId]=row;
        return {};
      }
      if (action === 'rule-set') {
        if (!['global','workspace','session'].includes(data.scope) || !['persona','children'].includes(data.target)) throw new SoulError('规则范围无效。');
        const rule=validateRule(data.rule,{children:data.target==='children',follow:data.scope!=='global'});
        if(rule.mode==='persona')this.persona(rule.personaId,state);
        if(data.scope==='global'){
          if(data.target==='persona')state.defaultPersonaId=rule.mode==='persona'?rule.personaId:null;else state.subagentDefault=rule;
        }else{
          identifier(data.id);
          const map=data.scope==='workspace'?state.workspaces:state.sessions;
          const row=map[data.id]??(data.scope==='workspace'?{persona:followRule(),children:followRule()}:validateSessionRule({}));
          row[data.target]=rule;map[data.id]=row;
        }
        return {};
      }
      if (action === 'memory-save') return this.putMemoryIn(state,data.personaId,data,'user');
      if (action === 'memory-delete') return this.removeMemoryIn(state,data.personaId,data.id);
      if (action === 'memory-dedupe') {
        const persona=this.persona(data.personaId,state);
        const seen=new Set(); const before=persona.memories.length;
        persona.memories=persona.memories.filter(row=>{const key=memoryKey(row.kind,row.content);if(seen.has(key))return false;seen.add(key);return true;});
        persona.updatedAt=timestamp();
        return { removed:before-persona.memories.length };
      }
      if (action === 'memory-organize') return this.organizeIn(state,data.personaId,data.memories);
      if (action === 'import') {
        if (data.archive?.format!=='private-soul-backup' || ![2,3].includes(data.archive.version)) throw new SoulError('请选择私人灵魂整体 JSON 存档。');
        const imported=validateLibrary(data.archive.data);
        if (data.strategy==='replace') {
          Object.assign(state,imported,{revision:state.revision});
        } else if (data.strategy==='merge') {
          const mapping=new Map();
          for(const source of imported.personas){ const row=clone(source); if(state.personas.some(item=>item.id===row.id))row.id=randomUUID(); mapping.set(source.id,row.id); state.personas.push(row); }
          for(const [id,row] of Object.entries(imported.sessions))if(!Object.hasOwn(state.sessions,id))state.sessions[id]=remapSession(row,mapping);
          for(const [id,row] of Object.entries(imported.workspaces))if(!Object.hasOwn(state.workspaces,id))state.workspaces[id]={persona:remapRule(row.persona,mapping),children:remapRule(row.children,mapping)};
        } else throw new SoulError('导入方式无效。');
        return { imported:imported.personas.length };
      }
      throw new SoulError('不支持的操作。');
    },['persona-delete','memory-delete','memory-dedupe','memory-organize','import'].includes(action));
  }
  putMemoryIn(state,personaId,data,source) {
    const persona=this.persona(personaId,state);
    const content=validateMemory(data.kind,data.content);
    const existing=data.id ? persona.memories.find(row=>row.id===data.id) : null;
    if(data.id&&!existing)throw new SoulError('记忆已不存在。','memory-not-found',404);
    if(existing && data.expectedVersion!==undefined && data.expectedVersion!==existing.version)throw new SoulError('这条记忆已更新，请重新读取。','conflict',409);
    const duplicate=persona.memories.find(row=>row.id!==data.id&&memoryKey(row.kind,row.content)===memoryKey(data.kind,content));
    if(duplicate)return {memory:clone(duplicate),duplicate:true};
    const at=timestamp();
    if(existing){Object.assign(existing,{kind:data.kind,content,updatedAt:at,version:existing.version+1,source});persona.updatedAt=at;return {memory:clone(existing)};}
    const row={id:randomUUID(),kind:data.kind,content,version:1,createdAt:at,updatedAt:at,source};
    persona.memories.push(row);persona.updatedAt=at;return {memory:clone(row)};
  }
  remember(personaId,data,source='agent') { return this.mutate(undefined,state=>this.putMemoryIn(state,personaId,data,source)); }
  removeMemoryIn(state,personaId,id) {const persona=this.persona(personaId,state);if(!persona.memories.some(row=>row.id===id))throw new SoulError('记忆不存在。','memory-not-found',404);persona.memories=persona.memories.filter(row=>row.id!==id);persona.updatedAt=timestamp();return {removed:id};}
  forget(personaId,id) {return this.mutate(undefined,state=>this.removeMemoryIn(state,personaId,id),true);}
  organizeIn(state,personaId,rows) {
    const persona=this.persona(personaId,state);
    if(!Array.isArray(rows)||rows.length>MAX_MEMORIES)throw new SoulError('整理结果无效。');
    const sources=new Map(persona.memories.map(row=>[row.id,row]));
    const seen=new Set();
    persona.memories=rows.map(row=>{
      if(!Array.isArray(row.sourceIds)||!row.sourceIds.length||row.sourceIds.some(id=>!sources.has(id)))throw new SoulError('整理只能引用当前人设已有的记忆。','invalid-sources');
      const content=validateMemory(row.kind,row.content);const key=memoryKey(row.kind,content);
      if(seen.has(key))throw new SoulError('整理结果仍有重复条目。');seen.add(key);
      const first=sources.get(row.sourceIds[0]);
      return {...first,id:randomUUID(),kind:row.kind,content,version:1,updatedAt:timestamp()};
    });
    persona.updatedAt=timestamp();
    return {count:persona.memories.length};
  }
  consolidate(personaId,rows,expectedRevision) {return this.mutate(expectedRevision,state=>this.organizeIn(state,personaId,rows),true);}
  async close() {this.closed=true;await this.queue;}
}
