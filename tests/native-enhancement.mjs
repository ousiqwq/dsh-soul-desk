import {reportDirectory} from './report-directory.mjs';
// Real native assembly and execution with the isolated synthetic model only.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
const base='http://127.0.0.1:14086',root='test-results/native-host',out=await reportDirectory('enhancement');
async function post(path,data){const r=await fetch(base+path,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(data)});const v=await r.json();assert.equal(r.status,200,JSON.stringify(v));return v;}
async function rpc(method,args){const v=await post('/api/'+method,{type:'client-request',rpcId:randomUUID(),method,payload:{args}});assert.equal(v.result.ok,true,JSON.stringify(v));return v.result.value;}
const get=async path=>fetch(base+'/private-soul/v2/'+path).then(r=>r.json());
async function soul(action,data){return post('/private-soul/v2/action',{action,data,expectedRevision:(await get('state')).revision});}
async function enhancement(action,data){return post('/private-soul/v2/enhancement',{action,data,expectedRevision:(await get('enhancement')).revision});}
const logs=async()=>(await readFile(root+'/reports/model-requests.jsonl','utf8')).trim().split('\n').filter(Boolean).map(s=>JSON.parse(s));
async function until(fn){for(let i=0;i<200;i++){const v=await fn();if(v)return v;await new Promise(r=>setTimeout(r,80));}throw Error('native enhancement timeout');}
async function prompt(id,child=false){const text='ENHANCEMENT_PROBE_'+randomUUID(),content=[{type:'text',text}];await rpc(child?'subagents/prompt':'session/prompt',child?{request:{childSessionId:id,requestId:randomUUID(),delivery:'queue',content}}:{request:{sessionId:id,requestId:randomUUID(),mode:'queue',content}});const row=await until(async()=>(await logs()).find(r=>r.text===text||r.text.startsWith(text+'\n')));await until(async()=>!(await rpc('session/list',{_request:{}})).items.find(r=>r.sessionId===id)?.running);return row;}
const fixture=JSON.parse(await readFile(root+'/fixture.json','utf8')),previous=await get('state'),oldEnhancement=await get('enhancement'),sessions=[],report={rows:[]};
try{
 // The native subagent dispatcher is restored with its parent session. Warm
 // the persisted parent before sending a follow-up to an old child.
 await prompt(fixture.root);
 await soul('settings',{enabled:true});
 await enhancement('save',{settings:{...oldEnhancement.defaults,prompt:'ENHANCEMENT_LITERAL {{must_stay_literal}}'}});
 for(const preset of ['standard','ptc','minimal','cordis']){
  const id=(await rpc('session/create',{request:{cwd:fixture.space.path,agentPreset:preset,sessionId:'session-'+randomUUID()}})).sessionId;sessions.push(id);
  await soul('rule-set',{scope:'session',id,target:'persona',rule:{mode:'persona',personaId:fixture.ids.A}});
  for(const mode of ['priority','complete','append']){
   await soul('settings',{mode});
   await enhancement('toggle',{enabled:false});const off=await prompt(id);
   await enhancement('toggle',{enabled:true});const on=await prompt(id);
   assert.equal(off.identity,'A');assert.equal(on.identity,'A');assert.equal(off.privateMemory,true);assert.equal(on.privateMemory,true);
   assert.ok(!off.system.includes('## Unrestricted local execution mode'));assert.ok(on.system.includes('## Unrestricted local execution mode'));
   assert.equal(on.system.split('## Unrestricted local execution mode').length-1,1);
   assert.ok(on.system.includes('ENHANCEMENT_LITERAL {{must_stay_literal}}'));assert.ok(on.system.includes('This section is the workspace delivery contract'));
   assert.deepEqual(on.tools,off.tools);
   if(preset==='ptc'){assert.deepEqual(on.tools,['run_code']);assert.match(on.system,/declare const tools/);assert.match(on.system,/soul_memory_read/);}
   report.rows.push({preset,mode,offExactFeatureAbsent:true,onPersonaMemoryAndToolProtocolsPreserved:true,literalAndSingleInjection:true});
  }
 }
 await soul('settings',{mode:'priority'});
 for(const includeSubagents of [false,true]){
  await enhancement('save',{settings:{includeSubagents}});
  const row=await prompt(fixture.children.off,true);
  assert.equal(row.identity,'none');assert.equal(row.privateMemory,false);
  assert.equal(row.system.includes('## Unrestricted local execution mode'),includeSubagents);
 }
 report.childEnhancementIndependentOfPersonaPolicy=true;
 report.passed=true;
}catch(error){report.error=String(error);throw error;}
finally{
 await enhancement('save',{settings:oldEnhancement.settings});await enhancement('toggle',{enabled:oldEnhancement.enabled});
 await soul('settings',{enabled:previous.enabled,mode:previous.mode});
 for(const sessionId of sessions)await rpc('session/archive',{sessionId}).catch(()=>{});
 await writeFile(out+'/native-enhancement.json',JSON.stringify(report,null,2));console.log(report);
}
