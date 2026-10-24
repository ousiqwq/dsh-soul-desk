import z from '@deepseek-ai/schemastery';
import { attachPersonaPolicy, MAX_TEXT_LENGTH } from './prompt-policy.js';
import { createPersonaRuntime } from './persona-scope.js';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { SoulStore } from './store.js';
import { registerMemoryTools } from './memory-tools.js';
import { registerSoulApi } from './http-api.js';

export const name = 'private-soul';
export const inject = ['systemPrompt', 'settings'];
export const Config = z.object({
  enabled: z.boolean().default(false).volatile(),
  text: z.string().max(MAX_TEXT_LENGTH).default('').volatile(),
  mode: z.union([z.const('priority'), z.const('complete')]).default('priority').volatile(),
  dataDir: z.string(),
  memoryBudgetChars: z.number().step(1).min(2000).max(50000).default(12000),
});

export async function apply(ctx, config) {
  const read=value=>value?.get?value.get():typeof value==='function'?value():value;
  const root=config.dataDir??join(process.env.DSH_HOME||join(homedir(),'.dsh'),'private-soul');
  const store=await new SoulStore(join(root,'library.json'),()=>ctx.emit('system-prompt/change')).init({enabled:read(config.enabled),text:read(config.text),mode:read(config.mode)});
  ctx.effect(()=>()=>store.close(),'private-soul: persistent library');
  const runtime=createPersonaRuntime(store);
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber), 'private-soul: custom editor');
  ctx.effect(() => attachPersonaPolicy(ctx.systemPrompt, context => {
    const persona=runtime.forPrompt(context.scope);
    return {enabled:!!persona,text:persona?.soul??'',mode:store.state.mode,personaId:persona?.id,name:persona?.name,memories:persona?.memories,memoryBudgetChars:config.memoryBudgetChars};
  }), 'private-soul: persona assembly');
  ctx.inject(['tools'],child=>registerMemoryTools(child,store,runtime.forExecution));
  ctx.inject(['webServer','connection'],child=>registerSoulApi(child,store));
  ctx.emit('system-prompt/change');
}
