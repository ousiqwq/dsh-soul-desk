import {validateRule,validateSessionRule,ruleId,followRule} from './persona-rules.js';
import {SoulError} from './memory-policy.js';
/** Optional host service: metadata and atomic session rules only, never persona text or memories. */
export function createTeamBridge(store){
 const prepared=new WeakMap();
 const rule=(value,key,state)=>{const normalized=validateRule(value,{children:key==='children'});if(normalized.mode==='persona')store.persona(normalized.personaId,state);return normalized;};
 const get=(state,id,key)=>state.sessions[id]?.[key]??followRule();
 return {
  protocol:1,
  prepare(requests){
   if(!Array.isArray(requests)||requests.length>12||new Set(requests.map(r=>r.sessionId)).size!==requests.length)throw new SoulError('人设规则数量或格式无效。');
   const changes=requests.map(r=>{const sessionId=ruleId(r.sessionId),values={};for(const key of ['persona','children'])if(r.rules?.[key]!==undefined)values[key]={next:rule(r.rules[key],key,store.state),before:structuredClone(get(store.state,sessionId,key))};return {sessionId,values};});
   const token=Object.freeze({});prepared.set(token,changes);return token;
  },
  async apply(token){
   const changes=prepared.get(token);if(!changes)throw new SoulError('人设应用请求已失效。','conflict',409);
   const result=await store.mutate(undefined,state=>{
    for(const {sessionId,values}of changes)for(const [key,{before,next}]of Object.entries(values)){
     if(JSON.stringify(get(state,sessionId,key))!==JSON.stringify(before))throw new SoulError('会话人设已在其他位置修改，请重新读取。','conflict',409);
     rule(next,key,state);
    }
    for(const {sessionId,values}of changes){const row=state.sessions[sessionId]??validateSessionRule({});for(const [key,{next}]of Object.entries(values))row[key]=next;state.sessions[sessionId]=row;}
    return {};
   });prepared.delete(token);return result;
  },
 };
}
