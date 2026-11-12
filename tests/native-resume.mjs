import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const base='http://127.0.0.1:14086',dir='test-results/native-host',f=JSON.parse(await readFile(dir+'/fixture.json','utf8')),report={};
async function rpc(method,request){const r=await fetch(base+'/api/'+method,{method:'POST',headers:{Origin:base,'content-type':'application/json'},body:JSON.stringify({type:'client-request',rpcId:randomUUID(),method,payload:{args:{request}}})});const v=await r.json();assert.equal(v.result?.ok,true,JSON.stringify(v));return v.result.value;}
async function state(id){return(await fetch(base+'/private-soul/v2/state'+(id?'?sessionId='+id:''))).json();}
async function rule(id,target,rule,scope='session'){const s=await state();const r=await fetch(base+'/private-soul/v2/action',{method:'POST',headers:{Origin:base,'content-type':'application/json'},body:JSON.stringify({action:'rule-set',expectedRevision:s.revision,data:{scope,id,target,rule}})});assert.equal(r.status,200,await r.text());}
const requests=async()=>JSON.parse('['+(await readFile(dir+'/reports/model-requests.jsonl','utf8')).trim().split('\n').join(',')+']');
async function until(check){for(let i=0;i<150;i++){const v=await check();if(v)return v;await new Promise(r=>setTimeout(r,100));}throw Error('Native resume timeout');}
async function probe(id,wanted){const text='COLD_PROBE_'+randomUUID(),content=[{type:'text',text}];await rpc(id===f.root?'session/prompt':'subagents/prompt',id===f.root?{sessionId:id,requestId:randomUUID(),mode:'queue',content}:{childSessionId:id,requestId:randomUUID(),delivery:'queue',content});const row=await until(async()=>(await requests()).find(r=>r.text===text||r.text.startsWith(text+'\n')));assert.equal(row.identity,wanted);return row;}
try{
  for(const [id,wanted] of [[f.root,'C'],[f.children.inherited,'B'],[f.children.off,'none'],[f.children.fork,'none'],[f.children.fixed,'C']])await probe(id,wanted);
  report.coldResumeFiveSessions=true;
  await rpc('workspace/rename',{workspaceId:f.space.workspaceId,title:'验收工作区 Alpha'});
  assert.equal((await state(f.root)).sessionInfo.workspaceId,f.space.workspaceId);assert.equal((await state()).catalog.workspaces.find(w=>w.id===f.space.workspaceId).title,'验收工作区 Alpha');report.workspaceRenameStable=true;
  const pick=personaId=>({mode:'persona',personaId});
  const before=new Set((await state()).catalog.sessions.map(s=>s.id));
  const marker='NESTED_PROBE_'+randomUUID(),inner='SOUL_CALL:'+JSON.stringify({name:'subagent',args:{description:'Nested persona validation',name:'nested',prompt:marker}})+'\n';
  const outer='SOUL_CALL:'+JSON.stringify({name:'subagent',args:{description:'Nested persona validation',name:'outer-'+randomUUID().slice(0,8),prompt:inner}})+'\n';
  await rpc('session/prompt',{sessionId:f.root,requestId:randomUUID(),mode:'queue',content:[{type:'text',text:outer}]});
  const nested=await until(async()=>(await state()).catalog.sessions.find(s=>!before.has(s.id)&&s.kind==='subagent'&&s.parentSessionId!==f.root));
  const row=await until(async()=>(await requests()).find(r=>r.text.startsWith(marker+'\n')));assert.equal(row.identity,'none');assert.equal(row.privateMemory,false);assert.equal((await state(nested.id)).activePersonaId,null);report.nestedDefaultOff=true;
  const stale=await state(f.root);await rule(f.root,'persona',pick(f.ids.A));
  const conflict=await fetch(base+'/private-soul/v2/action',{method:'POST',headers:{Origin:base,'content-type':'application/json'},body:JSON.stringify({action:'session-select',expectedRevision:stale.revision,data:{sessionId:f.root,personaId:'none'}})});assert.equal(conflict.status,409);assert.equal((await state(f.root)).activePersonaId,f.ids.A);await rule(f.root,'persona',pick(f.ids.C));report.nativeConflictPreservesBinding=true;
  const denied=(await requests()).find(r=>r.identity==='none'&&JSON.stringify(r.toolResult??'').includes('当前会话未启用人设'));assert.ok(denied);report.actualMemoryExecutorDenied=true;
}catch(e){report.error=String(e);throw e;}finally{await writeFile(dir+'/reports/native-resume.json',JSON.stringify(report,null,2));console.log(report);}
