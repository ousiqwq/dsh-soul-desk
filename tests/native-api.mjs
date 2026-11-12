import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
const base=process.env.DSH_TEST_URL??'http://127.0.0.1:14086';
const dir=resolve('test-results/native-host'),report={};
if(new URL(base).origin!=='http://127.0.0.1:14086')throw new Error('Native fixture must use the isolated test instance');
async function post(path,data){const response=await fetch(base+path,{method:'POST',headers:{Origin:base,'content-type':'application/json'},body:JSON.stringify(data)});const value=await response.json();assert.equal(response.status,200,JSON.stringify(value));return value;}
async function rpc(method,args){const value=await post('/api/'+method,{type:'client-request',rpcId:randomUUID(),method,payload:{args}});assert.equal(value.result?.ok,true,JSON.stringify(value));return value.result.value;}
const state=async(id)=>{const r=await fetch(base+'/private-soul/v2/state'+(id?'?sessionId='+id:''));assert.equal(r.status,200);return r.json();};
async function act(action,data){const s=await state();return post('/private-soul/v2/action',{action,data,expectedRevision:s.revision});}
async function rule(scope,id,target,value){await act('rule-set',{scope,id,target,rule:value});}
async function until(check,label){for(let n=0;n<100;n++){const result=await check();if(result)return result;await new Promise(r=>setTimeout(r,150));}throw Error('Timeout: '+label);}
async function requests(){try{return(await readFile(join(dir,'reports/model-requests.jsonl'),'utf8')).trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));}catch(e){if(e.code==='ENOENT')return[];throw e;}}
async function prompt(id,text){await rpc('session/prompt',{request:{sessionId:id,requestId:randomUUID(),mode:'queue',content:[{type:'text',text}]}});await until(async()=>(await requests()).some(row=>row.text.includes(text)),'model request');await until(async()=>!(await rpc('session/list',{_request:{}})).items.find(row=>row.sessionId===id)?.running,'session idle');}
const call=(name,args)=>'SOUL_CALL:'+JSON.stringify({name,args})+'\n';
const pick=personaId=>({mode:'persona',personaId});
try {
  const ids={};
  for(const name of ['A','B','C'])ids[name]=(await act('persona-save',{name:'验收人设 '+name,soul:'SOUL_PERSONA_'+name,activate:name==='A'})).personaId;
  await act('memory-save',{personaId:ids.A,kind:'preference',content:'用户喜欢 SOUL_PRIVATE_MEMORY 清晨散步。'});
  const space=(await rpc('workspace/create',{request:{path:join(dir,'workspaces/alpha')}})).workspace;
  const beta=(await rpc('workspace/create',{request:{path:join(dir,'workspaces/beta')}})).workspace;
  const root=(await rpc('session/create',{request:{workspaceId:space.workspaceId,sessionId:'session-'+randomUUID()}})).sessionId;
  await rpc('session/rename',{request:{sessionId:root,title:'灵魂三层与子代理验收'}});
  await rule('workspace',space.workspaceId,'persona',pick(ids.B));
  const marker='ROOT_PROBE_'+randomUUID();await prompt(root,marker);
  assert.equal((await requests()).find(row=>row.text.includes(marker)).identity,'B');
  await rule('session',root,'persona',pick(ids.A));
  const bound='SESSION_PROBE_'+randomUUID();await prompt(root,bound);
  assert.equal((await requests()).find(row=>row.text.includes(bound)).identity,'A');
  report.nativeThreeLayers=true;
  const rootRequest=(await requests()).find(row=>row.text.includes(bound));
  assert.ok(rootRequest.tools.includes('subagent'),JSON.stringify(rootRequest.tools));
  async function child(name,tool='subagent',childPrompt='CHILD_PROBE_'+randomUUID()){
    const before=new Set((await state()).catalog.sessions.map(row=>row.id));
    await prompt(root,call(tool,{description:'Soul native persona validation',name,prompt:childPrompt}));
    const entry=await until(async()=>(await state()).catalog.sessions.find(row=>row.kind==='subagent'&&row.parentSessionId===root&&!before.has(row.id)),'child session');
    const matches=row=>row.text===childPrompt.trimEnd()||row.text.startsWith(childPrompt.trimEnd()+'\n');
    await until(async()=>(await requests()).some(matches),'child first model request');
    return{entry,request:(await requests()).find(matches)};
  }
  const off=await child('default-off');assert.equal(off.request.identity,'none');assert.equal(off.request.privateMemory,false);assert.equal((await state(off.entry.id)).activePersonaId,null);
  report.nativeSpawnDefaultOff=true;
  const fork=await child('fork-off','subagent_fork');assert.equal(fork.request.identity,'none');assert.equal(fork.request.privateMemory,false);report.nativeForkDefaultOff=true;
  await rule('global',undefined,'children',{mode:'parent'});
  const inherited=await child('reuse-parent');assert.equal(inherited.request.identity,'A');assert.equal(inherited.request.privateMemory,true);report.nativeParentReuse=true;
  await rule('workspace',space.workspaceId,'children',pick(ids.C));
  const fixed=await child('workspace-fixed');assert.equal(fixed.request.identity,'C');report.nativeWorkspaceChildRule=true;
  await rule('session',root,'children',{mode:'none'});
  const denied=await child('session-off','subagent',call('soul_memory_read',{}));
  assert.equal(denied.request.identity,'none');
  report.nativeSessionChildOverride=true;
  // Read the native raw log from the isolated persistence store to verify that
  // the real tool executor refused memory access, rather than trusting a model.
  const denial=await until(async()=>(await requests()).find(row=>row.identity==='none'&&JSON.stringify(row.toolResult??'').includes('当前会话未启用人设')),'memory tool denial');
  assert.equal(denial.privateMemory,false);report.nativeMemoryToolDenied=true;
  report.memoryDeniedChildId=denied.entry.id;
  await rule('session',inherited.entry.id,'persona',pick(ids.B));
  assert.equal((await state(inherited.entry.id)).activePersonaId,ids.B);
  await rule('session',root,'persona',pick(ids.C));
  assert.equal((await state(fixed.entry.id)).activePersonaId,ids.C);
  assert.equal((await state(inherited.entry.id)).activePersonaId,ids.B);report.childSelectionsIndependent=true;
  const s=await state();assert.ok(s.catalog.workspaces.some(row=>row.id===beta.workspaceId));
  await writeFile(join(dir,'fixture.json'),JSON.stringify({root,space,beta,ids,children:{off:off.entry.id,fork:fork.entry.id,inherited:inherited.entry.id,fixed:fixed.entry.id,denied:denied.entry.id}},null,2));
  report.fixturePersisted=true;
} catch(error){report.error=String(error);throw error;}
finally{await writeFile(join(dir,'reports/native-api.json'),JSON.stringify(report,null,2));console.log(report);}
