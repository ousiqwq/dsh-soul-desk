import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Context } from '@deepseek-ai/cordis';
import { Session, SessionId } from '@deepseek-ai/dsh-session';
import Projections from '@deepseek-ai/dsh-session-projection';
import Prompt, { renderPrompt } from '@deepseek-ai/dsh-system-prompt';
import { EnhancementStore } from '../enhancement-store.js';
import { attachPersonaPolicy } from '../prompt-policy.js';

test('v1 drops locally authored prompt text and survives two restarts', async()=>{
  const dir=await mkdtemp(join(tmpdir(),'soul-upgrade-')), file=join(dir,'prompt-enhancement.v1.json');
  try {
    const legacy={version:1,revision:9,enabled:true,settings:{subagentGuidance:true,preserveNames:true,prompt:'LEGACY-SENTINEL'}};
    await writeFile(file,JSON.stringify(legacy));
    for(let i=0;i<2;i++) {
      const store=await new EnhancementStore(file).init();
      assert.equal(store.config().settings.prompt,'');assert.equal(store.config().enabled,true);
      assert.equal(store.config().revision,9);assert.equal(store.config().settings.preserveNames,true);
      assert.doesNotMatch(store.view().preview,/LEGACY-SENTINEL/);assert.match(store.view().preview,/subagent/);
      await store.close();
    }
    assert.deepEqual(JSON.parse(await readFile(file,'utf8')),legacy);
    const edit=await new EnhancementStore(file).init();
    await edit.action('save',{settings:{prompt:'New local text'}},9);await edit.close();
    const final=await new EnhancementStore(file).init();
    assert.equal(final.config().settings.prompt,'New local text');assert.equal(final.config().revision,10);
    await final.close();
  } finally {await rm(dir,{recursive:true,force:true});}
});

test('v1 holding the previously bundled body upgrades instead of going blank', async()=>{
  const dir=await mkdtemp(join(tmpdir(),'soul-upgrade-body-')), file=join(dir,'prompt-enhancement.v1.json');
  try {
    const { EXECUTION_MODE_BLOCK } = await import('../upstream-prompt.js');
    const previous = await import('../vendor/dsh-unrestricted/rules-0.2.9.js');
    assert.notEqual(previous.EXECUTION_MODE_BLOCK, EXECUTION_MODE_BLOCK);
    await writeFile(file,JSON.stringify({version:1,revision:3,enabled:true,settings:{prompt:previous.EXECUTION_MODE_BLOCK}}));
    const store=await new EnhancementStore(file).init();
    assert.equal(store.config().settings.prompt, EXECUTION_MODE_BLOCK);
    assert.equal(store.config().revision, 3);
    assert.match(store.view().preview, /Unrestricted local execution mode/);
    await store.close();
    await writeFile(file,JSON.stringify({version:1,revision:3,enabled:true,settings:{prompt:'LOCAL EDIT'}}));
    const edited=await new EnhancementStore(file).init();
    assert.equal(edited.config().settings.prompt,'');
    assert.doesNotMatch(edited.view().preview,/LOCAL EDIT/);
    await edited.close();
  } finally {await rm(dir,{recursive:true,force:true});}
});

test('native model admission emits each source only on change, including disable and disposal',async()=>{
 const ctx=new Context();
 try {
   await ctx.plugin(Projections);await ctx.plugin(Prompt,{includeHarnessIdentity:false});
   const session=Session.create(SessionId('soul-sections'));
   session.append('turn/start',{turn:1});session.append('step/start',{turn:1,step:1});
   const config={enabled:true,mode:'priority',text:'First persona'};
   const remove=attachPersonaPolicy(ctx.systemPrompt,()=>config);
   const commit=async()=>{
     const assembly=await ctx.systemPrompt.assemble({session});
     const updates=assembly.systemUpdates(false);
     for(const {message,intent} of updates)session.append('system/message',{turn:1,step:1,message},intent);
     return {count:updates.length, text:renderPrompt(assembly),updates:JSON.stringify(updates)};
   };
   assert.match((await commit()).updates,/First persona/);assert.equal((await commit()).count,0);
   config.text='Updated {{literal}}';assert.match((await commit()).updates,/Updated \{\{literal\}\}/);
   config.enabled=false;assert.ok((await commit()).count>0);assert.equal((await commit()).count,0);
   config.enabled=true;assert.match((await commit()).updates,/Updated/);remove();
   assert.ok((await commit()).count>0);assert.equal((await commit()).count,0);
 }finally{await ctx.fiber.dispose();}
});
