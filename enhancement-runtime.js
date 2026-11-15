/**
 * Lifecycle, preset resolution, scope shadows and preview flow adapted from
 * dsh-unrestricted 0.2.8, src/node.js (MIT, yexi-by). See THIRD_PARTY_NOTICES.md.
 * A final Soul guard is required because native complete sections are restored
 * after the waterfall and Soul may subsequently replace the native persona.
 */
import {AsyncLocalStorage}from'node:async_hooks';
import {renderPrompt}from'@deepseek-ai/dsh-system-prompt';
import {SoulError}from'./memory-policy.js';
import {ENHANCEMENT_SECTION,validateEnhancementSettings,renderEnhancementPrompt}from'./prompt-enhancement.js';
import {UPSTREAM,PRESETS,PROTECTED_NAMES,SOUL_IDENTITY,SHADOW_VARIABLE,SHADOW_SUFFIX,POINTER,PLAN_NOTE,PTC_NOTE,STRUCTURED_NOTE,fuseSections,renderPreview,hasExternalEnhancement}from'./enhancement-fusion.js';

export function createEnhancementRuntime(ctx,store,personaRuntime){
 const rootScope={},local=new AsyncLocalStorage(),raw=new WeakMap(),modes=new Map(),shadows=new Map(),customMinimal=new WeakSet(),live=new Map(),pendingShadows=new Map();
 let active=true,generation=0,minimalBasePromise;
 const agentOf=context=>context?.agent??(context?.scope?.session?context.scope:undefined);
 const scopeOf=context=>context?.scope??context?.agent??rootScope;
 const childOf=agent=>!!agent?.session?.id&&personaRuntime.descriptor(String(agent.session.id),agent).kind==='subagent';
 const config=()=>{const state=store.config(),override=local.getStore();return override?.preview?{...state,enabled:true,settings:override.settings??state.settings}:state;};
 function resolvePreset(context,sections){
  if(local.getStore()?.presetId)return local.getStore().presetId;
  const agent=agentOf(context),presets=ctx.get('agentPresets');
  if(agent?.ctx&&presets?.composedPreset){try{return presets.composedPreset(agent.ctx);}catch{return undefined;}}
  return sections?.some(s=>s.name==='tools:ptc-only'&&s.text.trim())?'ptc':'standard';
 }
 function state(presetId,issues=[],path){
  if(local.getStore()?.preview)return;
  if(presetId)modes.set(presetId,{issues:[...issues],path,checked:true});
 }
 function unshadow(agent){const entry=shadows.get(agent);if(!entry)return;shadows.delete(agent);entry.dispose();}
 function clearShadows(){for(const agent of [...shadows.keys()])unshadow(agent);}
 async function standing(presetId,bypass=false){
  const presets=ctx.get('agentPresets');
  if(!presets){const assembly=await ctx.systemPrompt.assemble({});const actual=assembly.sections.some(s=>s.name==='tools:ptc-only'&&s.text.trim())?'ptc':'standard';if(presetId!==actual)throw new SoulError('当前宿主没有此模式。','unsupported-preset',400);return assembly;}
  if(typeof presets.acquireScope==='function'){
   const lease=await presets.acquireScope(presetId);
   try{return await ctx.systemPrompt.assemble({scope:lease.key});}finally{await lease[Symbol.asyncDispose]();}
  }
  // Older DSH versions expose get() and createScope instead of acquireScope().
  if(typeof presets.get==='function'){
   const {createScope}=await import('@deepseek-ai/dsh-scope');const preset=presets.get(presetId);
   if(!preset)throw new SoulError('当前宿主没有此模式。','unsupported-preset',400);
   const scope=await createScope(ctx,'agent-preset',presetId,preset.plugin,preset.config);
   try{await scope.ctx.loader?.await?.();return await ctx.systemPrompt.assemble({scope:scope.key});}finally{await scope.dispose();}
  }
  throw new SoulError('当前宿主不支持模式预览。','unsupported-preview',503);
 }
 async function minimalBase(){
  if(!minimalBasePromise)minimalBasePromise=local.run({bypass:true,presetId:'minimal'},async()=>{
   const assembly=await standing('minimal',true);const base=assembly.sections.find(s=>s.name==='deployment:persona-prefix');
   if(!base?.text.trim())throw new SoulError('Minimal 原生人设段缺失，已保留原提示词。','missing-persona',503);
   return base;
  }).catch(error=>{minimalBasePromise=undefined;throw error;});
  return minimalBasePromise;
 }
 async function setupMinimalShadow(agent){
  const current=config(),presetId=resolvePreset({scope:agent},[]);
  if(!active||!current.enabled||!renderEnhancementPrompt(current.settings)||presetId!=='minimal'||childOf(agent)&&!current.settings.includeSubagents){unshadow(agent);return;}
  if(shadows.has(agent)||customMinimal.has(agent)||!agent?.ctx?.inject)return;
  const epoch=generation;let base;
  try{base=await minimalBase();}catch{state('minimal',['missing-persona'],'complete-guard');return;}
  if(!active||epoch!==generation||!config().enabled||shadows.has(agent))return;
  let removeVariable,removeSection,lease;
  const cleanup=()=>{removeSection?.();removeVariable?.();void lease?.dispose?.();};
  try{
   lease=agent.ctx.inject(['systemPrompt'],child=>{
    removeVariable=child.systemPrompt.variable(SHADOW_VARIABLE,()=>renderEnhancementPrompt(config().settings));
    removeSection=child.systemPrompt.section({name:'deployment:persona-prefix',order:0,complete:true,
     ...(base.interpolate!==undefined?{interpolate:base.interpolate}:{}),
     text:()=>{const next=config();return next.enabled&&(!childOf(agent)||next.settings.includeSubagents)&&base.interpolate!==false?base.text+SHADOW_SUFFIX:base.text;}});
   });
   await lease;
   if(!active||epoch!==generation||!config().enabled){cleanup();return;}
   shadows.set(agent,{base,dispose:cleanup});
  }catch(error){cleanup();if(String(error.message).includes('already registered'))customMinimal.add(agent);else state('minimal',['shadow-unavailable'],'complete-guard');}
 }
 function syncMinimalShadow(agent){
  if(pendingShadows.has(agent))return pendingShadows.get(agent);
  const pending=setupMinimalShadow(agent).finally(()=>{if(pendingShadows.get(agent)===pending)pendingShadows.delete(agent);});
  pendingShadows.set(agent,pending);return pending;
 }
 async function sweep(){const agents=ctx.get('agents');for(const agent of agents?.list?.()??[])await syncMinimalShadow(agent);}
 function changed(){generation++;modes.clear();live.clear();if(!store.config().enabled)clearShadows();else void Promise.allSettled([...pendingShadows.values()]).then(()=>{if(active&&store.config().enabled)return sweep();}).catch(()=>store.report('unavailable'));}
 const removeWaterfall=ctx.on('system-prompt/assemble',async(_assembly,context,next)=>{
  const original=await next();if(!active||local.getStore()?.bypass)return original;
  const scope=scopeOf(context);if(scope&&typeof scope==='object')raw.set(scope,{sections:original.sections,presetId:resolvePreset(context,original.sections)});
  const current=config();if(!current.enabled)return original;
  const agent=agentOf(context),isSubagent=childOf(agent);if(isSubagent&&!current.settings.includeSubagents)return original;
  if(hasExternalEnhancement(original.sections))return original;
  const presetId=resolvePreset(context,original.sections);
  const fused=fuseSections(original.sections,presetId,{isSubagent,settings:current.settings});
  if(fused.issues){state(presetId,fused.issues,'waterfall');return original;}
  state(presetId,[],'waterfall');return fused.sections===original.sections?original:{...original,sections:fused.sections};
 });
 const removeCreated=ctx.on('agent/created',async({agent})=>{if(!local.getStore()?.preview&&!local.getStore()?.bypass)await syncMinimalShadow(agent);});
 const removeSelected=ctx.on('agent-preset/selected',event=>{
  const id=typeof event==='object'?event?.sessionId:event;const agent=ctx.get('agents')?.get?.(id);if(!agent)return;
  customMinimal.delete(agent);unshadow(agent);void syncMinimalShadow(agent).catch(()=>store.report('unavailable'));
 });
 const removeDisposed=ctx.on('agent/disposed',({agent})=>{customMinimal.delete(agent);unshadow(agent);});
 function normalize(assembly){
  let changed=false;
  const sections=assembly.sections.map(s=>{if(s.name==='deployment:persona-prefix'&&s.text.endsWith(SHADOW_SUFFIX)){changed=true;return{...s,text:s.text.slice(0,-SHADOW_SUFFIX.length)};}return s;});
  if(Object.hasOwn(assembly.variables??{},SHADOW_VARIABLE)){const variables={...assembly.variables};delete variables[SHADOW_VARIABLE];return{...assembly,sections,variables};}
  return changed?{...assembly,sections}:assembly;
 }
 function stripOwnFusion(assembly){
  const notes={'deployment:persona-prefix':POINTER,'plan:policy':PLAN_NOTE,'tools:ptc-only':PTC_NOTE,'tool:structured_output':STRUCTURED_NOTE};
  const sections=assembly.sections.filter(s=>s.name!==ENHANCEMENT_SECTION).map(s=>notes[s.name]&&s.text.includes(notes[s.name])?{...s,text:s.text.replace(notes[s.name],'')}:s);
  return{...assembly,sections};
 }
 async function finalize(personal,native,context){
  if(!active||local.getStore()?.bypass)return personal;
  const current=config(),agent=agentOf(context),isSubagent=childOf(agent);
  let assembly=normalize(personal);
  if(!current.enabled)return assembly;
  if(!renderEnhancementPrompt(current.settings)){if(!local.getStore()?.preview)store.report('empty');return assembly;}
  if(isSubagent&&!current.settings.includeSubagents){if(!local.getStore()?.preview)store.report('subagent-excluded');return assembly;}
  const info=raw.get(scopeOf(context)),presetId=resolvePreset(context,info?.sections??native.sections);
  if(hasExternalEnhancement(native.sections)||hasExternalEnhancement(info?.sections??[])||hasExternalEnhancement(assembly.sections)){if(!local.getStore()?.preview)store.report('external-module');return stripOwnFusion(assembly);}
  // A complete Soul persona intentionally drops native prose. Restore only
  // Plan and reporting contracts, never another persona or its memory.
  let sections=assembly.sections;
  const contracts=info?.sections??native.sections;
  for(const row of contracts)if(['plan:policy','tool:structured_output'].includes(row.name)&&!sections.some(s=>s.name===row.name))sections=[...sections,row];
  const fused=fuseSections(sections,presetId,{isSubagent,settings:current.settings});
  if(fused.issues){state(presetId,fused.issues,'complete-guard');if(!local.getStore()?.preview)store.report('unsupported');return assembly;}
  assembly=sections===assembly.sections&&fused.sections===sections?assembly:{...assembly,sections:fused.sections};
  // Personal instructions are owned exclusively by applyPersona, including
  // literal template text and memory JSON. Fusion may append the upstream
  // pointer to the persona row it anchors on, but must never change the
  // persona's own text. Every other protected row stays object-identical.
  for(const row of personal.sections.filter(s=>PROTECTED_NAMES.has(s.name))){
   const kept=assembly.sections.find(s=>s.name===row.name);
   if(!kept)throw new Error('protected Soul section changed');
   if(kept===row)continue;
   if(row.name!==SOUL_IDENTITY||kept.text!==row.text+POINTER&&kept.text!==row.text)throw new Error('protected Soul section changed');
  }
  const path=shadows.has(agent)?'minimal-scope-shadow':presetId==='minimal'?'complete-guard':info?'waterfall':'post-assembly-guard';
  state(presetId,[],path);
  if(!local.getStore()?.preview){store.report(fused.status??'active');if(!isSubagent){try{const text=renderPreview(assembly,renderPrompt);if(Buffer.byteLength(text,'utf8')<=2*1024*1024)live.set(presetId,{revision:current.revision,text,sessionId:String(agent?.session?.id??'')});}catch{live.delete(presetId);}}}
  return assembly;
 }
 function status(){const enabled=store.config().enabled;return{engine:'upstream-structural-fusion',upstream:UPSTREAM,shadows:shadows.size,modes:Object.fromEntries(PRESETS.map(id=>{const value=modes.get(id);return[id,{state:!enabled?'off':!value?'pending':value.issues.length?'failed':'active',issues:value?.issues??[],checked:!!value?.checked,path:value?.path??null}];}))};}
 async function previewFor(presetId,{settings,preferLive=true}={}){
  if(!PRESETS.includes(presetId))throw new SoulError('不支持此预览模式。','unsupported-preset',400);
  const current=store.config(),draft=settings===undefined?current.settings:validateEnhancementSettings(settings);
  const cached=live.get(presetId);
  if(preferLive&&cached?.revision===current.revision&&JSON.stringify(draft)===JSON.stringify(current.settings))return{presetId,available:true,source:'live',...cached,bytes:Buffer.byteLength(cached.text,'utf8'),lines:cached.text.split('\n').length};
  try{
   return await local.run({preview:true,presetId,settings:draft},async()=>{
    const assembly=await standing(presetId);
    const applied=assembly.sections.some(s=>s.name===ENHANCEMENT_SECTION);
    if(renderEnhancementPrompt(draft)&&!applied)return{presetId,available:false,errorCode:'missing-persona',reason:'缺少可融合的人设段，已保留原提示词。'};
    const text=renderPreview(assembly,renderPrompt);if(Buffer.byteLength(text,'utf8')>2*1024*1024)throw new SoulError('完整提示词预览过大。','preview-size',413);
    return{presetId,available:true,source:'standing',text,bytes:Buffer.byteLength(text,'utf8'),lines:text.split('\n').length};
   });
  }catch(error){return{presetId,available:false,errorCode:error.code??'preview-failed',reason:error instanceof SoulError?error.message:'模式预览暂不可用，原提示词未修改。'};}
 }
 async function recheck(){
  const epoch=++generation;modes.clear();live.clear();minimalBasePromise=undefined;clearShadows();
  await Promise.allSettled([...pendingShadows.values()]);await sweep();
  const results=await Promise.all(PRESETS.map(async id=>[id,await previewFor(id,{preferLive:false})]));
  if(epoch===generation)for(const[id,result]of results)modes.set(id,{checked:true,issues:result.available?[]:[result.errorCode],path:'standing-preview'});
  return status();
 }
 function dispose(){if(!active)return;active=false;generation++;clearShadows();removeWaterfall();removeCreated();removeSelected();removeDisposed();modes.clear();live.clear();}
 return{finalize,fallback:assembly=>stripOwnFusion(normalize(assembly)),failed:()=>store.report('unavailable'),bypassPersona:()=>!!local.getStore()?.bypass,status,previewFor,recheck,changed,dispose,syncMinimalShadow};
}
