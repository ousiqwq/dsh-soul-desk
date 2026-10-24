import test from 'node:test';
import assert from 'node:assert/strict';
import {Context} from '@deepseek-ai/cordis';
import SystemPrompt,{renderPrompt} from '@deepseek-ai/dsh-system-prompt';
import {createScope} from '@deepseek-ai/dsh-scope';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {SoulStore} from '../store.js';
import {createPersonaRuntime} from '../persona-scope.js';
import {attachPersonaPolicy} from '../prompt-policy.js';

test('native scopes inherit a parent persona, preserve in-flight owners, and inject only their own memories',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'soul-scopes-')),store=await new SoulStore(join(dir,'library.json')).init();
 const ctx=new Context(),fiber=ctx.plugin(SystemPrompt);await fiber;
 const a=(await store.action('persona-save',{name:'甲',soul:'# 甲',activate:true},0)).personaId;
 const b=(await store.action('persona-save',{name:'乙',soul:'# 乙'},store.state.revision)).personaId;
 await store.remember(a,{kind:'preference',content:'用户喜欢乌龙茶。'});await store.remember(b,{kind:'story',content:'我们每周日一起读书。'});
 const parent={session:{id:'parent'}},child={session:{id:'child'}},scope=createScope(ctx,child,{parent});
 const runtime=createPersonaRuntime(store),undo=attachPersonaPolicy(ctx.systemPrompt,context=>{const persona=runtime.forPrompt(context.scope);return {enabled:!!persona,text:persona?.soul??'',personaId:persona?.id,memories:persona?.memories,mode:store.state.mode};});
 try{
  await store.action('session-select',{sessionId:'parent',personaId:b},store.state.revision);
  let prompt=renderPrompt(await ctx.systemPrompt.assemble({scope:child}));assert.match(prompt,/^# 乙/);assert.match(prompt,/每周日一起读书/);assert.doesNotMatch(prompt,/乌龙茶/);
  await store.action('session-select',{sessionId:'child',personaId:a},store.state.revision);
  assert.equal(runtime.forExecution(child).id,b,'a previously sent request retains its own persona');
  prompt=renderPrompt(await ctx.systemPrompt.assemble({scope:child}));assert.match(prompt,/^# 甲/);assert.match(prompt,/乌龙茶/);assert.doesNotMatch(prompt,/每周日一起读书/);
  assert.equal(runtime.forExecution(child).id,a,'the next model request captures the new persona');
  await store.action('settings',{enabled:false},store.state.revision);assert.equal(runtime.forExecution(child),null);
 }finally{undo();await scope.dispose();await fiber.dispose();await store.close();await rm(dir,{recursive:true,force:true});}
});
