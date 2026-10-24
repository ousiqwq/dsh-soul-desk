import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, stat, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SoulStore } from '../store.js';
import { validateMemory } from '../memory-policy.js';

async function fixture(fn){const dir=await mkdtemp(join(tmpdir(),'soul-store-'));const file=join(dir,'library.json');const store=await new SoulStore(file).init();try{await fn(store,file,dir);}finally{await store.close();await rm(dir,{recursive:true,force:true});}}
async function create(store,name,soul){return (await store.action('persona-save',{name,soul,activate:true},store.state.revision)).personaId;}

test('only personal relationships, preferences and stories pass the work-artifact filter',()=>{
  for(const [kind,content] of [['relationship','用户喜欢我称呼他小林。'],['preference','用户喜欢耐心的代码讲解。'],['story','那晚我们一起赶项目，用户说我的陪伴让他安心。']])assert.equal(validateMemory(kind,content),content);
  for(const content of ['这段代码应使用双重循环。','项目使用 Python 3.13。','运行 npm install 完成依赖安装。','const value = 7;','文件位于 /home/alice/demo.py','```python\nprint(1)\n```','API_KEY=secret-secret-secret','当前任务是修复登录页。'])assert.throws(()=>validateMemory('story',content));
  assert.throws(()=>validateMemory('work','用户喜欢茶。'));
});
test('persona memories remain separate across sessions, default switches and disk reloads',()=>fixture(async(store,file)=>{
  const a=await create(store,'甲','# 甲 {{literal}}');const b=await create(store,'乙','# 乙');
  await store.remember(a,{kind:'preference',content:'用户喜欢喝乌龙茶。'});
  await store.remember(b,{kind:'relationship',content:'用户给我取名小月。'});
  await store.action('session-select',{sessionId:'chat-a',personaId:a},store.state.revision);
  assert.equal(store.resolve(['chat-a']).id,a);assert.equal(store.resolve(['chat-b']).id,b);
  await store.action('session-select',{sessionId:'chat-none',personaId:'none'},store.state.revision);
  assert.equal(store.resolve(['chat-none']),null);
  const restored=await new SoulStore(file).init({text:'should never replace saved souls'});
  assert.equal(restored.resolve(['chat-a']).memories[0].content,'用户喜欢喝乌龙茶。');
  assert.equal(restored.resolve(['chat-b']).memories[0].content,'用户给我取名小月。');
  assert.equal(restored.persona(a).soul,'# 甲 {{literal}}');await restored.close();
  assert.equal((await stat(file)).mode&0o777,0o600);
}));
test('parallel memory appends survive, duplicates are idempotent, and stale writers are refused',()=>fixture(async(store)=>{
  const id=await create(store,'伙伴','# 伙伴');const old=store.state.revision;
  await Promise.all(['用户喜欢春天。','用户喜欢秋天。'].map(content=>store.remember(id,{kind:'preference',content})));
  assert.equal(store.persona(id).memories.length,2);
  const duplicate=await store.remember(id,{kind:'preference',content:' 用户喜欢春天。 '});assert.equal(duplicate.duplicate,true);assert.equal(store.persona(id).memories.length,2);
  await assert.rejects(store.action('settings',{enabled:false},old),error=>error.code==='conflict');
  const row=store.persona(id).memories[0];await store.remember(id,{id:row.id,expectedVersion:row.version,kind:'preference',content:'用户现在更喜欢夏天。'});
  await assert.rejects(store.remember(id,{id:row.id,expectedVersion:row.version,kind:'preference',content:'用户仍喜欢春天。'}),error=>error.code==='conflict');
}));
test('whole-library backups round-trip, merge conflicts become copies, invalid imports never write',()=>fixture(async(store,file,dir)=>{
  const id=await create(store,'伙伴','# 伙伴');await store.remember(id,{kind:'story',content:'我们在雨夜约定每周分享一本书。'});
  const archive=store.export();await store.action('import',{archive,strategy:'merge'},store.state.revision);
  assert.equal(store.state.personas.length,2);assert.notEqual(store.state.personas[0].id,store.state.personas[1].id);
  await store.action('import',{archive,strategy:'replace'},store.state.revision);
  assert.equal(store.state.personas.length,1);assert.deepEqual(store.persona(id).memories,archive.data.personas[0].memories);
  const before=await readFile(file,'utf8');const invalid=structuredClone(archive);invalid.data.personas[0].memories[0].content='当前任务是实现这个函数。';
  await assert.rejects(store.action('import',{archive:invalid,strategy:'replace'},store.state.revision));assert.equal(await readFile(file,'utf8'),before);
  assert.ok((await readdir(join(dir,'backups'))).length>=2);
}));
test('consolidation requires current revision and real sources, and keeps a recovery backup',()=>fixture(async(store,_file,dir)=>{
  const id=await create(store,'伙伴','# 伙伴');
  await store.remember(id,{kind:'preference',content:'用户喜欢听轻音乐。'});await store.remember(id,{kind:'preference',content:'用户更喜欢安静的钢琴曲。'});
  const ids=store.persona(id).memories.map(row=>row.id);const old=store.state.revision;
  await assert.rejects(store.consolidate(id,[{kind:'story',content:'我们曾一起旅行。',sourceIds:['nonexistent']}],old));
  await store.consolidate(id,[{kind:'preference',content:'用户喜欢安静的钢琴轻音乐。',sourceIds:ids}],old);
  assert.equal(store.persona(id).memories.length,1);
  await assert.rejects(store.consolidate(id,[],old),error=>error.code==='conflict');
  assert.ok((await readdir(join(dir,'backups'))).length);
}));
test('malformed existing storage is not silently overwritten',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'soul-corrupt-'));const file=join(dir,'library.json');await writeFile(file,'not-json');
  try{await assert.rejects(new SoulStore(file).init({text:'new'}));assert.equal(await readFile(file,'utf8'),'not-json');}finally{await rm(dir,{recursive:true,force:true});}
});
