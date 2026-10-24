import { SoulError, CLASSIFIER_PROMPT, ORGANIZER_PROMPT, validateMemory } from './memory-policy.js';

export function modelSelection(ctx, agent) {
  const header = agent?.session?.requestHeader?.();
  const fallback = ctx.get('agentDefaultModel')?.currentSelection?.();
  const selection = header?.config ?? fallback;
  if (!selection?.provider || !selection?.model) throw new SoulError('没有可用于记忆审核或整理的模型。','model-unavailable',503);
  return { provider:selection.provider, model:selection.model, ...(selection.reasoningEffort?{reasoningEffort:selection.reasoningEffort}:{}) };
}

export async function askJson(ctx, system, input, { agent, signal, maxTokens = 1024 } = {}) {
  const llm=ctx.get('llm');
  if(!llm)throw new SoulError('模型服务尚未就绪。','model-unavailable',503);
  const cancel=signal?AbortSignal.any([signal,AbortSignal.timeout(45000)]):AbortSignal.timeout(45000);
  let text='';
  for await(const chunk of llm.stream({ ...modelSelection(ctx,agent), system, messages:[{role:'user',content:[{type:'text',text:JSON.stringify(input)}]}], maxTokens, signal:cancel })) {
    if(chunk.type==='text-delta')text+=chunk.text;
    if(text.length>100000)throw new SoulError('模型整理结果过长。','model-output',502);
  }
  const cleaned=text.trim().replace(/^```(?:json)?\s*|\s*```$/gu,'');
  try { return JSON.parse(cleaned); } catch { throw new SoulError('模型未返回有效的记忆 JSON；未写入任何内容。','model-output',502); }
}

export async function checkAutomaticMemory(ctx, kind, content, options) {
  const clean=validateMemory(kind,content);
  const decision=await askJson(ctx,CLASSIFIER_PROMPT,{kind,content:clean},options);
  if(decision?.allow!==true)throw new SoulError('个人记忆审核未通过：'+(typeof decision?.reason==='string'?decision.reason.slice(0,200):'不属于关系、稳定喜好或共同故事。'),'memory-rejected',422);
  return clean;
}

export async function organizePreview(ctx, store, personaId, options) {
  const before=store.snapshot();
  const persona=store.persona(personaId,before);
  if(!persona.memories.length)return {revision:before.revision,personaId,memories:[],note:'当前人设没有需要整理的记忆。'};
  if(persona.memories.length>100)throw new SoulError('智能整理预览最多处理 100 条；请先去重或导出后人工精简。不要把一页记忆当作完整库覆盖。','organize-size');
  const proposal=await askJson(ctx,ORGANIZER_PROMPT,{personaName:persona.name,memories:persona.memories},{...options,maxTokens:8192});
  const detached=structuredClone(before);
  store.organizeIn(detached,personaId,proposal?.memories);
  return {revision:before.revision,personaId,memories:proposal.memories,note:typeof proposal.note==='string'?proposal.note.slice(0,1000):''};
}
