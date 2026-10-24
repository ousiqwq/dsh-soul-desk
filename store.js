import { readFile, writeFile, mkdir, rename, unlink, readdir, open } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { SoulError, validateMemory, memoryKey } from './memory-policy.js';

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
  if (!input || typeof input !== 'object' || input.version !== 2 || !Array.isArray(input.personas)) throw new SoulError('不是有效的私人灵魂 v2 存档。');
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
  const sessions = Object.create(null);
  if (input.sessions && typeof input.sessions === 'object' && !Array.isArray(input.sessions)) {
    if (Object.keys(input.sessions).length > 10000) throw new SoulError('会话绑定过多。');
    for (const [sessionId, personaId] of Object.entries(input.sessions)) {
      identifier(sessionId);
      if (personaId !== 'none' && !ids.has(personaId)) throw new SoulError('会话绑定指向不存在的人设。');
      sessions[sessionId] = personaId;
    }
  }
  if (input.defaultPersonaId !== null && !ids.has(input.defaultPersonaId)) throw new SoulError('默认人设不存在。');
  if (!['priority','complete'].includes(input.mode) || typeof input.enabled !== 'boolean') throw new SoulError('人格开关或注入方式无效。');
  const value = { version: 2, revision: Number.isSafeInteger(input.revision) && input.revision >= 0 ? input.revision : 0, enabled: input.enabled, mode: input.mode, defaultPersonaId: input.defaultPersonaId, personas, sessions };
  const envelope={format:'private-soul-backup',version:2,exportedAt:timestamp(),data:value};
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
      this.state = validateLibrary(JSON.parse(bytes.toString('utf8')));
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
    if (!this.state.enabled) return null;
    for (const sessionId of sessionIds) if (Object.hasOwn(this.state.sessions,sessionId)) {
      const id = this.state.sessions[sessionId];
      const persona = id === 'none' ? null : this.state.personas.find(row => row.id === id) ?? null;
      return persona?.soul.trim() ? persona : null;
    }
    const persona = this.state.personas.find(row => row.id === this.state.defaultPersonaId) ?? null;
    return persona?.soul.trim() ? persona : null;
  }
  view(sessionId, compact = false) {
    const value = this.snapshot();
    const activePersonaId = this.resolve(sessionId ? [sessionId] : [])?.id ?? null;
    const override = sessionId && Object.hasOwn(value.sessions,sessionId) ? value.sessions[sessionId] : '';
    if (compact) return { revision: value.revision, enabled: value.enabled, mode: value.mode, defaultPersonaId: value.defaultPersonaId, personas: value.personas.map(row => ({ id: row.id, name: row.name, memoryCount: row.memories.length })), activePersonaId, override };
    return { ...value, activePersonaId, override };
  }
  export() { return { format: 'private-soul-backup', version: 2, exportedAt: timestamp(), data: this.snapshot() }; }
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
        if (state.defaultPersonaId === null) state.defaultPersonaId = persona.id;
        if (data.activate) { if (!persona.soul.trim()) throw new SoulError('先填写人格文本再启用。'); state.enabled = true; state.defaultPersonaId = persona.id; }
        return { personaId: persona.id };
      }
      if (action === 'persona-delete') {
        this.persona(data.id,state);
        state.personas = state.personas.filter(row => row.id !== data.id);
        for (const [id,value] of Object.entries(state.sessions)) if (value === data.id) delete state.sessions[id];
        if (state.defaultPersonaId === data.id) state.defaultPersonaId = state.personas[0]?.id ?? null;
        return {};
      }
      if (action === 'settings') {
        if (Object.hasOwn(data,'enabled')) { if (typeof data.enabled !== 'boolean') throw new SoulError('开关格式错误。'); state.enabled=data.enabled; }
        if (Object.hasOwn(data,'mode')) state.mode=data.mode;
        if (Object.hasOwn(data,'defaultPersonaId')) { if (data.defaultPersonaId!==null)this.persona(data.defaultPersonaId,state); state.defaultPersonaId=data.defaultPersonaId; }
        return {};
      }
      if (action === 'session-select') {
        identifier(data.sessionId);
        if (!data.personaId) delete state.sessions[data.sessionId];
        else { if (data.personaId!=='none') this.persona(data.personaId,state); state.sessions[data.sessionId]=data.personaId; }
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
        if (data.archive?.format!=='private-soul-backup' || data.archive.version!==2) throw new SoulError('请选择私人灵魂整体 JSON 存档。');
        const imported=validateLibrary(data.archive.data);
        if (data.strategy==='replace') {
          Object.assign(state,imported,{revision:state.revision});
        } else if (data.strategy==='merge') {
          const mapping=new Map();
          for(const source of imported.personas){ const row=clone(source); if(state.personas.some(item=>item.id===row.id))row.id=randomUUID(); mapping.set(source.id,row.id); state.personas.push(row); }
          if(state.defaultPersonaId===null)state.defaultPersonaId=mapping.get(imported.defaultPersonaId)??null;
          for(const [id,pid] of Object.entries(imported.sessions))if(!Object.hasOwn(state.sessions,id))state.sessions[id]=pid==='none'?'none':mapping.get(pid);
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
