import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { SoulStore } from '../store.js';
import { createPersonaRuntime } from '../persona-scope.js';
import { validateRule } from '../persona-rules.js';

async function fixture(run) {
  const dir=await mkdtemp(join(tmpdir(),'soul-rules-')),file=join(dir,'library.json');
  const store=await new SoulStore(file).init();
  try {
    const ids=[];
    for(const name of ['A','B','C'])ids.push((await store.action('persona-save',{name,soul:'# '+name,activate:true},store.state.revision)).personaId);
    await store.action('settings',{defaultPersonaId:ids[0]},store.state.revision);
    await run({store,file,dir,a:ids[0],b:ids[1],c:ids[2]});
  } finally {await store.close();await rm(dir,{recursive:true,force:true});}
}
const set=(store,scope,id,target,rule)=>store.action('rule-set',{scope,id,target,rule},store.state.revision);
const agent=(id,parent)=>({id,session:{id,header:{id,...(parent?{origin:'subagent',parentSession:parent}:{} )}}});

test('session > workspace > global; explicit none and moved workspaces never fall back through a selected rule',()=>fixture(async({store,a,b,c})=>{
  await store.registerSessions([{id:'chat',workspaceId:'w1'}]);
  await set(store,'workspace','w1','persona',{mode:'persona',personaId:b});
  await set(store,'workspace','w2','persona',{mode:'persona',personaId:c});
  assert.equal(store.effective('chat').personaId,b);
  await set(store,'session','chat','persona',{mode:'persona',personaId:c});
  await set(store,'global',null,'persona',{mode:'persona',personaId:a});
  assert.equal(store.effective('chat').personaId,c);
  await store.action('session-select',{sessionId:'chat',personaId:'none'},store.state.revision);
  assert.equal(store.effective('chat').personaId,null);
  await store.action('session-select',{sessionId:'chat',personaId:''},store.state.revision);
  assert.equal(store.state.sessions.chat.persona.mode,'follow');
  assert.equal(store.effective('chat',{workspaceId:'w2'}).personaId,c);
  await set(store,'workspace','w2','persona',{mode:'none'});
  assert.equal(store.effective('chat',{workspaceId:'w2'}).personaId,null);
  assert.equal(store.effective('chat',{workspaceId:null}).personaId,a);
  assert.equal(store.view('chat',true).effective.source.scope,'workspace');
}));

test('v2 migration saves exact original bytes and retains personas, memories and every explicit binding',()=>fixture(async({store,file,a,b})=>{
  await store.remember(a,{kind:'preference',content:'用户喜欢清晨散步。'});
  const saved=store.snapshot();
  const legacy={version:2,revision:14,enabled:true,mode:'append',defaultPersonaId:b,personas:saved.personas,sessions:{one:a,two:'none'}};
  const original=JSON.stringify(legacy,null,3)+'\n';await store.close();await writeFile(file,original);
  const migrated=await new SoulStore(file).init();
  try {
    assert.equal(await readFile(file+'.pre-v3.json','utf8'),original);
    assert.deepEqual(migrated.state.personas,legacy.personas);
    assert.equal(migrated.state.version,3);assert.equal(migrated.state.revision,14);
    assert.equal(migrated.resolve(['one']).id,a);assert.equal(migrated.resolve(['two']),null);
    assert.deepEqual(migrated.state.subagentDefault,{mode:'none'});
    await migrated.registerSessions([{id:'existing-root',kind:'session'},{id:'old-child',kind:'subagent',parentSessionId:'one'}]);
    assert.equal(migrated.state.sessions['existing-root'].persona.mode,'follow');
    assert.equal(migrated.resolve(['old-child']),null);
    const disk=await new SoulStore(file).init();await disk.close();
    assert.equal(await readFile(file+'.pre-v3.json','utf8'),original);
  } finally {await migrated.close();}
}));

test('native subagents default to no persona even when the parent and global are configured',()=>fixture(async({store,a})=>{
  const runtime=createPersonaRuntime(store),parent=agent('parent'),child=agent('child','parent'),nested=agent('nested','child');
  assert.equal((await runtime.forPrompt(parent)).id,a);
  assert.equal(await runtime.forPrompt(child),null);
  assert.equal(await runtime.forPrompt(nested),null);
  assert.equal(runtime.forExecution(child),null);
  assert.equal(store.view('child',true).effective.source.scope,'subagent');
}));

test('dispatch reuses the captured parent request, freezes child choices and preserves cold-resume ownership',()=>fixture(async({store,file,a,b,c})=>{
  const runtime=createPersonaRuntime(store),parent=agent('parent'),child=agent('child','parent');
  // A service lookup models native Agent identity without scope-name guessing.
  const agents=new Map([['parent',parent],['child',child]]);
  const ctx={get:name=>name==='agents'?{get:id=>agents.get(id)}:undefined};
  const bound=createPersonaRuntime(store,ctx);
  await set(store,'global',null,'children',{mode:'parent'});
  await bound.forPrompt(parent);
  await set(store,'session','parent','persona',{mode:'persona',personaId:b});
  assert.equal((await bound.forPrompt(child)).id,a);
  await set(store,'global',null,'children',{mode:'persona',personaId:c});
  assert.equal((await bound.forPrompt(child)).id,a);
  await set(store,'session','child','persona',{mode:'persona',personaId:b});
  assert.equal(bound.forExecution(child).id,a);
  assert.equal((await bound.forPrompt(child)).id,b);
  const restored=await new SoulStore(file).init();
  try {const resumed=createPersonaRuntime(restored,ctx);assert.equal((await resumed.forPrompt(agent('child','parent'))).id,b);}
  finally {await restored.close();}
  assert.equal(await runtime.forPrompt(agent('no-parent-child','unknown')),store.persona(c));
}));

test('child policies use global, workspace and per-session priority, including nested policy overrides',()=>fixture(async({store,a,b,c})=>{
  await store.registerSessions([{id:'root',workspaceId:'w'},{id:'child',workspaceId:'w',kind:'subagent',parentSessionId:'root'}]);
  await set(store,'global',null,'children',{mode:'persona',personaId:a});
  await set(store,'workspace','w','children',{mode:'persona',personaId:b});
  assert.equal(store.view('root',true).children.rule.personaId,b);
  await set(store,'session','root','children',{mode:'persona',personaId:c});
  assert.equal(store.view('child',true).children.rule.personaId,c);
  await set(store,'session','child','children',{mode:'none'});
  assert.equal(store.view('child',true).children.rule.mode,'none');
  await set(store,'session','child','children',{mode:'follow'});
  assert.equal(store.view('child',true).children.rule.personaId,c);
}));

test('reuse without a parent persona stays disabled instead of using the global default',()=>fixture(async({store})=>{
  const parent=agent('parent'),child=agent('child','parent');
  const ctx={get:name=>name==='agents'?{get:id=>id==='parent'?parent:undefined}:undefined};
  const runtime=createPersonaRuntime(store,ctx);
  await set(store,'global',null,'children',{mode:'parent'});
  await store.action('session-select',{sessionId:'parent',personaId:'none'},store.state.revision);
  await runtime.forPrompt(parent);assert.equal(await runtime.forPrompt(child),null);
}));

test('deleting or emptying a selected persona leaves an invalid rule and never changes identity',()=>fixture(async({store,a,b})=>{
  await set(store,'session','chat','persona',{mode:'persona',personaId:a});
  await set(store,'workspace','w','persona',{mode:'persona',personaId:a});
  await set(store,'global',null,'children',{mode:'persona',personaId:a});
  await store.action('persona-delete',{id:a},store.state.revision);
  assert.equal(store.effective('chat').status,'missing');assert.equal(store.state.sessions.chat.persona.personaId,a);
  assert.equal(store.effective('other',{workspaceId:'w'}).status,'missing');
  await store.action('persona-save',{id:b,name:'B',soul:''},store.state.revision);
  await set(store,'session','empty','persona',{mode:'persona',personaId:b});
  assert.equal(store.effective('empty').status,'empty');
}));

test('archive merge remaps session, workspace, child and derived persona references together',()=>fixture(async({store,a})=>{
  await set(store,'session','chat','persona',{mode:'persona',personaId:a});
  await set(store,'session','chat','children',{mode:'persona',personaId:a});
  await set(store,'workspace','w','children',{mode:'persona',personaId:a});
  const archive=store.export();delete store.state.sessions.chat;delete store.state.workspaces.w;
  await store.action('import',{archive,strategy:'merge'},store.state.revision);
  const remapped=store.state.sessions.chat.persona.personaId;
  assert.notEqual(remapped,a);assert.equal(store.state.sessions.chat.children.personaId,remapped);
  assert.equal(store.state.workspaces.w.children.personaId,remapped);
  assert.equal(store.persona(remapped).name,'A');
}));

test('malformed rules and stale revisions cannot overwrite saved choices',()=>fixture(async({store,file,a})=>{
  assert.throws(()=>validateRule({mode:'parent'}));assert.throws(()=>validateRule({mode:'persona',personaId:'__proto__'}));
  const before=await readFile(file,'utf8');
  await assert.rejects(set(store,'session','bad','persona',{mode:'parent'}));
  await assert.rejects(store.action('rule-set',{scope:'workspace',id:'__proto__',target:'children',rule:{mode:'none'}},store.state.revision));
  assert.equal(await readFile(file,'utf8'),before);
  const revision=store.state.revision;await set(store,'session','one','persona',{mode:'persona',personaId:a});
  await assert.rejects(store.action('session-select',{sessionId:'one',personaId:'none'},revision),error=>error.code==='conflict');
  assert.equal(store.resolve(['one']).id,a);
}));

test('explicit global none survives saving and merge imports until activation is requested',()=>fixture(async({store,a})=>{
  const archive=store.export();
  await set(store,'global',null,'persona',{mode:'none'});
  await store.action('persona-save',{name:'New',soul:'New persona'},store.state.revision);
  assert.equal(store.state.defaultPersonaId,null);
  await store.action('import',{archive,strategy:'merge'},store.state.revision);
  assert.equal(store.state.defaultPersonaId,null);assert.equal(store.effective('unbound').personaId,null);
  await store.action('persona-save',{id:a,name:'A',soul:'A',activate:true},store.state.revision);
  assert.equal(store.effective('unbound').personaId,a);
}));
