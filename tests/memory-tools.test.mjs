import test from 'node:test';
import assert from 'node:assert/strict';
import { Context, Service } from '@deepseek-ai/cordis';
import { ToolRuntime } from '@deepseek-ai/dsh-tools';
import SystemPrompt from '@deepseek-ai/dsh-system-prompt';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SoulStore } from '../store.js';
import { registerMemoryTools } from '../memory-tools.js';

async function fixture(fn){
  const ctx=new Context(),dir=await mkdtemp(join(tmpdir(),'soul-tools-'));const store=await new SoulStore(join(dir,'library.json')).init();
  const a=(await store.action('persona-save',{name:'甲',soul:'# 甲',activate:true},0)).personaId;
  const b=(await store.action('persona-save',{name:'乙',soul:'# 乙'},store.state.revision)).personaId;
  const control={mode:'valid',beforeReply:null};
  class LlmStub extends Service {constructor(c){super(c,'llm');}async *stream(options){if(control.beforeReply)await control.beforeReply();if(control.mode==='throw')throw new Error('model unavailable');if(control.mode==='invalid'){yield {type:'text-delta',text:'invalid JSON'};return;}const content=JSON.parse(options.messages[0].content[0].text).content;yield {type:'text-delta',text:JSON.stringify({allow:!content.includes('欢迎按钮改成蓝色'),reason:'非个人事实'})};}}
  class DefaultModelStub extends Service {constructor(c){super(c,'agentDefaultModel');}currentSelection(){return {provider:'test',model:'test'};}}
  const fibers=[ctx.plugin(SystemPrompt),ctx.plugin(ToolRuntime),ctx.plugin(LlmStub),ctx.plugin(DefaultModelStub)];for(const fiber of fibers)await fiber;
  const owner={id:'caller-a'},other={id:'caller-b'};
  const plugin=ctx.plugin({name:'memory-tools-fixture',inject:['tools'],apply(child){registerMemoryTools(child,store,agent=>store.state.enabled?store.persona(agent===owner?a:b):null);}});await plugin;
  let n=0;const execute=(name,args,agent=owner)=>ctx.tools.execute({name,arguments:args,agent,callId:'test-'+(++n),signal:new AbortController().signal});
  try{await fn({ctx,store,a,b,owner,other,execute,control});}finally{await plugin.dispose();for(const fiber of fibers.reverse())await fiber.dispose();await store.close();await rm(dir,{recursive:true,force:true});}
}
test('native tools save only the captured persona and run semantic approval before persistence',()=>fixture(async({store,a,b,execute,other})=>{
  const good=await execute('soul_memory_remember',{kind:'preference',content:'用户喜欢简洁的回答。'});assert.equal(good.isError,false,JSON.stringify(good));assert.equal(store.persona(a).memories.length,1);assert.equal(store.persona(b).memories.length,0);
  const rejected=await execute('soul_memory_remember',{kind:'story',content:'把欢迎按钮改成蓝色。'});assert.equal(rejected.isError,true);assert.equal(store.persona(a).memories.length,1);
  const read=await execute('soul_memory_read',{},other);assert.equal(read.isError,false);const value=JSON.parse(read.content[0].text);assert.equal(value.personaId,b);assert.equal(value.memories.length,0);
  const id=store.persona(a).memories[0].id;const cross=await execute('soul_memory_forget',{id},other);assert.equal(cross.isError,true);assert.equal(store.persona(a).memories.length,1);
}));

test('failed or malformed model audits cannot write, and disabling during an audit cancels persistence',()=>fixture(async({store,a,execute,control})=>{
 for(const mode of ['throw','invalid']){control.mode=mode;const result=await execute('soul_memory_remember',{kind:'preference',content:'用户喜欢清晨散步。'});assert.equal(result.isError,true);assert.equal(store.persona(a).memories.length,0);}
 control.mode='valid';control.beforeReply=()=>store.action('settings',{enabled:false},store.state.revision);
 const result=await execute('soul_memory_remember',{kind:'preference',content:'用户喜欢清晨散步。'});assert.equal(result.isError,true);assert.equal(store.persona(a).memories.length,0);
}));
