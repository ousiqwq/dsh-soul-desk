import {createTeamBridge} from './team-bridge.js';
import z from '@deepseek-ai/schemastery';
import { attachPersonaPolicy, MAX_TEXT_LENGTH } from './prompt-policy.js';
import { createPersonaRuntime } from './persona-scope.js';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { SoulStore } from './store.js';
import { registerMemoryTools } from './memory-tools.js';
import { registerEnhancementApi, registerSoulApi } from './http-api.js';
import { EnhancementStore } from './enhancement-store.js';
import { createEnhancementRuntime } from './enhancement-runtime.js';

export const name = 'private-soul';
export const inject = ['systemPrompt', 'settings'];
export const Config = z.object({
  enabled: z.boolean().default(false).volatile(),
  text: z.string().max(MAX_TEXT_LENGTH).default('').volatile(),
  mode: z.union([z.const('priority'), z.const('complete'), z.const('append')]).default('priority').volatile(),
  dataDir: z.string(),
  memoryBudgetChars: z.number().step(1).min(2000).max(50000).default(12000),
  extraPresets: z.array(z.string().min(1).max(100)).max(16).default([]),
});

export async function apply(ctx, config) {
  const read=value=>value?.get?value.get():typeof value==='function'?value():value;
  const root=config.dataDir??join(process.env.DSH_HOME||join(homedir(),'.dsh'),'private-soul');
  const store=await new SoulStore(join(root,'library.json'),()=>ctx.emit('system-prompt/change')).init({enabled:read(config.enabled),text:read(config.text),mode:read(config.mode)});
  ctx.effect(()=>()=>store.close(),'private-soul: persistent library');
  let enhancementRuntime;
  const enhancement=await new EnhancementStore(join(root,'prompt-enhancement.v1.json'),()=>{enhancementRuntime?.changed();ctx.emit('system-prompt/change');}).init();
  ctx.effect(()=>()=>enhancement.close(),'private-soul: optional response enhancement');
  const runtime=createPersonaRuntime(store,ctx);
  enhancementRuntime=createEnhancementRuntime(ctx,enhancement,runtime,{extraPresets:config.extraPresets});
  ctx.effect(()=>()=>enhancementRuntime.dispose(),'private-soul: structural enhancement lifecycle');
  ctx.provide('privateSoulBridge',createTeamBridge(store));
  ctx.on('agent/created',async({agent})=>{await runtime.registerAgent(agent);});
  ctx.inject(['sessionQuery','workspaceRegistry'],async()=>{await runtime.initialize();});
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber), 'private-soul: custom editor');
  ctx.effect(() => attachPersonaPolicy(ctx.systemPrompt, async context => {
    const persona=await runtime.forPrompt(context.scope);
    return {enabled:!!persona,text:persona?.soul??'',mode:store.state.mode,personaId:persona?.id,name:persona?.name,memories:persona?.memories,memoryBudgetChars:config.memoryBudgetChars};
  }, enhancementRuntime), 'private-soul: persona assembly');
  ctx.inject(['tools'],child=>registerMemoryTools(child,store,runtime.forExecution));
  ctx.inject(['connection'],child=>registerEnhancementApi(child,enhancement,enhancementRuntime));
  ctx.inject(['webServer','connection'],child=>registerSoulApi(child,store,runtime,enhancement,enhancementRuntime));
  ctx.emit('system-prompt/change');
}
