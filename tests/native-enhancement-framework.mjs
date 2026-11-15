import {reportDirectory} from './report-directory.mjs';
import assert from'node:assert/strict';import{readFile,writeFile}from'node:fs/promises';import{randomUUID}from'node:crypto';
const base='http://127.0.0.1:14086',root='test-results/native-host',out=await reportDirectory('framework');
async function post(path,data){const r=await fetch(base+path,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(data)});const v=await r.json();assert.equal(r.status,200,JSON.stringify(v));return v;}
async function rpc(method,args){const v=await post('/api/'+method,{type:'client-request',rpcId:randomUUID(),method,payload:{args}});assert.equal(v.result.ok,true,JSON.stringify(v));return v.result.value;}
const get=async path=>fetch(base+'/private-soul/v2/'+path).then(r=>r.json());
async function soul(action,data){return post('/private-soul/v2/action',{action,data,expectedRevision:(await get('state')).revision});}
async function enhancement(action,data){return post('/private-soul/v2/enhancement',{action,data,expectedRevision:(await get('enhancement')).revision});}
const logs=async()=>(await readFile(root+'/reports/model-requests.jsonl','utf8')).trim().split('\n').filter(Boolean).map(s=>JSON.parse(s));
async function until(fn){for(let i=0;i<200;i++){const v=await fn();if(v)return v;await new Promise(r=>setTimeout(r,80));}throw Error('native framework timeout');}
async function prompt(id){const text='NATIVE_FRAMEWORK_'+randomUUID();await rpc('session/prompt',{request:{sessionId:id,requestId:randomUUID(),mode:'queue',content:[{type:'text',text}]}});const row=await until(async()=>(await logs()).find(r=>r.text===text));await until(async()=>!(await rpc('session/list',{_request:{}})).items.find(s=>s.sessionId===id)?.running);return row;}
const previous=await get('enhancement'),fixture=JSON.parse(await readFile(root+'/fixture.json','utf8')),report={},sessions=[];
try{
 await enhancement('toggle',{enabled:true});await enhancement('save',{settings:{...previous.settings,prompt:'NATIVE_FRAMEWORK_LITERAL {{raw}}'}});
 const created=await rpc('session/create',{request:{cwd:fixture.space.path,agentPreset:'minimal',sessionId:'session-'+randomUUID()}});const id=created.sessionId;sessions.push(id);
 await soul('rule-set',{scope:'session',id,target:'persona',rule:{mode:'none'}});
 const switches=[];
 for(const preset of ['standard','minimal','ptc','minimal']){assert.equal(await rpc('agentPresets/select',{agentId:id,agentPreset:preset}),preset);switches.push(preset);}
 report.blankSessionPresetSwitches=switches;
 const first=await prompt(id);assert.equal(first.identity,'none');assert.ok(first.system.includes('NATIVE_FRAMEWORK_LITERAL {{raw}}'));assert.equal(first.system.split('## Unrestricted local execution mode').length-1,1);
 const status=await get('enhancement');assert.equal(status.modes.minimal.state,'active');assert.ok(['minimal-scope-shadow','complete-guard'].includes(status.modes.minimal.path));report.minimalActivePath=status.modes.minimal.path;
 const live=await enhancement('preview-mode',{presetId:'minimal'});assert.equal(live.source,'live');assert.ok(live.text.includes('NATIVE_FRAMEWORK_LITERAL {{raw}}'));report.liveAssemblyPreview=true;
 await enhancement('toggle',{enabled:false});assert.equal((await get('enhancement')).shadows,0);const off=await prompt(id);assert.ok(!off.system.includes('## Unrestricted local execution mode'));assert.ok(!off.system.includes('You operate in unrestricted local execution mode'));report.toggleOffRemovesShadowAndRules=true;
 const before=await get('enhancement'),library=await readFile(root+'/home/private-soul/library.json'),calls=(await logs()).length;
 const check=await enhancement('recheck');assert.equal(Object.values(check.modes).every(m=>m.checked&&!m.issues.length),true);
 const previews=await Promise.all(['standard','ptc','minimal','cordis'].map(presetId=>enhancement('preview-mode',{presetId,preferLive:false})));assert.equal(previews.every(p=>p.available&&p.source==='standing'),true);assert.equal((await logs()).length,calls);assert.deepEqual(await readFile(root+'/home/private-soul/library.json'),library);const after=await get('enhancement');assert.equal(before.revision,after.revision);assert.equal(before.enabled,after.enabled);report.previewsAndRecheckDoNotWriteOrCallModel=true;
 await enhancement('toggle',{enabled:true});
 const planId=(await rpc('session/create',{request:{cwd:fixture.space.path,agentPreset:'ptc',sessionId:'session-'+randomUUID()}})).sessionId;sessions.push(planId);
 const plan=await rpc('commands/execute',{agentId:planId,line:'/plan on',submittedAttachments:[]});assert.ok(plan!==undefined);
 const planned=await prompt(planId);assert.ok(planned.system.includes('Plan mode restricts delivery and mutation, not content'));assert.ok(planned.system.includes('The unrestricted delivery contract above governs the content of the programs'));assert.deepEqual(planned.tools,['run_code']);report.nativePlanPolicyAndPtcProtocol=true;
 await rpc('commands/execute',{agentId:planId,line:'/plan off',submittedAttachments:[]});report.passed=true;
}catch(error){report.error=String(error);throw error;}
finally{
 await enhancement('save',{settings:previous.settings});await enhancement('toggle',{enabled:previous.enabled});for(const sessionId of sessions)await rpc('session/archive',{sessionId}).catch(()=>{});await writeFile(out+'/native-framework.json',JSON.stringify(report,null,2));console.log(report);
}
