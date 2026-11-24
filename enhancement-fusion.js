/**
 * Structural fusion adapted from dsh-unrestricted, src/rules.js.
 * Copyright (c) 2026 yexi-by, MIT (see vendor/dsh-unrestricted/LICENSE).
 * Soul additions: editable guidance, protected persona/memory rows and a
 * post-assembly guard for complete sections. Prompt text is upstream verbatim,
 * re-exported from ./upstream-prompt.js so the bytes stay auditable.
 */
import {PERSONA_POINTER,PLAN_NOTE as UPSTREAM_PLAN_NOTE,PTC_ONLY_NOTE,STRUCTURED_OUTPUT_NOTE,EXECUTION_MODE_BLOCK} from './upstream-prompt.js';
import {DEFAULT_ENHANCEMENT_SETTINGS,ENHANCEMENT_SECTION,renderEnhancementPrompt} from './prompt-enhancement.js';
export const UPSTREAM={version:'0.2.15',frameworkBase:'0.2.15',commit:'c79ce9c11d49925182fa9654d76d7055d6f5b3ac'};
export const PRESETS=['standard','ptc','cordis','minimal'];
export const PRESET_RULES={standard:{plan:true,ptcOnly:false},ptc:{plan:true,ptcOnly:true},cordis:{plan:true,ptcOnly:false},minimal:{plan:false,ptcOnly:false}};
/** Upstream verbatim pointer appended to deployment:persona-prefix. */
export const POINTER=PERSONA_POINTER;
/** Upstream verbatim note appended to plan:policy. */
export const PLAN_NOTE=UPSTREAM_PLAN_NOTE;
/** Upstream verbatim note appended to tools:ptc-only. */
export const PTC_NOTE=PTC_ONLY_NOTE;
/** Upstream verbatim note appended to tool:structured_output. */
export const STRUCTURED_NOTE=STRUCTURED_OUTPUT_NOTE;
/** Upstream verbatim section body, exposed for diagnostics and tests. */
export const BLOCK=EXECUTION_MODE_BLOCK;
export const SHADOW_VARIABLE='soul_response_enhancement';
export const SHADOW_SUFFIX=POINTER+'\n\n{{'+SHADOW_VARIABLE+'}}';
export const SOUL_IDENTITY='private-soul:identity';
export const PROTECTED_NAMES=new Set([SOUL_IDENTITY,'private-soul:memory-policy','private-soul:memories']);
function appendOnce(text,suffix){return text.includes(suffix)?text:text+suffix;}
export function contractAdditions(presetId,settings=DEFAULT_ENHANCEMENT_SETTINGS){
 if(!Object.hasOwn(PRESET_RULES,presetId))return undefined;const rules=PRESET_RULES[presetId];
 return{pointer:POINTER,block:renderEnhancementPrompt(settings),planNote:rules.plan?PLAN_NOTE:'',ptcNote:rules.ptcOnly?PTC_NOTE:'',structuredNote:STRUCTURED_NOTE};
}
export function renderPreview(assembly,render){const variables={...assembly.variables};for(const[name,value]of Object.entries(variables))if(value===undefined)variables[name]='{{'+name+'}}';return render({...assembly,variables});}
export function fuseSections(sections,presetId,{isSubagent=false,settings=DEFAULT_ENHANCEMENT_SETTINGS}={}){
 if(!Object.hasOwn(PRESET_RULES,presetId))return{issues:['unsupported-preset']};const rules=PRESET_RULES[presetId];
 const block=renderEnhancementPrompt(settings);if(!block)return{sections,status:'empty'};
 const existing=sections.find(s=>s.name===ENHANCEMENT_SECTION);
 // An unchanged block must still fall through to pointer anchoring: a persona
 // mode change can drop the row that carried the pointer while the block stays.
 if(existing&&existing.text!==block)sections=sections.map(s=>s===existing?{...s,text:block,interpolate:false}:s);
 const byName=new Map(sections.map(s=>[s.name,s]));
 const hasSoul=sections.some(s=>PROTECTED_NAMES.has(s.name));
 // Upstream appends its pointer to the persona row. Soul's `priority` and
 // `complete` modes replace that row with private-soul:identity, so the
 // pointer follows whichever row now carries the persona. Only the upstream
 // pointer is ever appended; the persona's own text stays an exact prefix.
 const native=byName.get('deployment:persona-prefix');
 const soulPersona=byName.get(SOUL_IDENTITY);
 const anchor=native?.text.trim()?native:soulPersona?.text.trim()?soulPersona:undefined;
 let fusedPersona;
 if(anchor)fusedPersona={...anchor,text:appendOnce(anchor.text,POINTER)};
 else if(!isSubagent&&!hasSoul)return{issues:['missing-persona']};
 const notes=[['plan:policy',rules.plan?PLAN_NOTE:''],['tools:ptc-only',rules.ptcOnly?PTC_NOTE:''],['tool:structured_output',STRUCTURED_NOTE]];
 const replaced=new Map(fusedPersona?[[fusedPersona.name,fusedPersona]]:[]);
 for(const[name,note]of notes){const section=byName.get(name);if(note&&section?.text.trim())replaced.set(name,{...section,text:appendOnce(section.text,note)});}
 if(existing&&existing.text===block){
  // Block already injected by an earlier pass, and its notes went with it.
  // Only make sure the pointer sits on the row that now carries the persona.
  // Re-entrant calls with the pointer already placed return the original
  // array, so an unchanged assembly keeps its identity.
  if(sections.some(s=>s.text.includes(POINTER)))return{sections};
  const soulRow=sections.find(s=>s.name===SOUL_IDENTITY);
  return{sections:soulRow?sections.map(s=>s===soulRow?{...s,text:appendOnce(s.text,POINTER)}:s):sections};
 }
 const fused=sections.map(s=>replaced.get(s.name)??s);
 const personaIndex=fused.findIndex(s=>s.name==='deployment:persona-prefix');
 const identityIndex=fused.findIndex(s=>s.name==='harness:identity');
 const soulIndex=fused.reduce((last,s,i)=>PROTECTED_NAMES.has(s.name)?i:last,-1);
 const insertAt=soulIndex>=0?soulIndex+1:personaIndex>=0?personaIndex+1:identityIndex>=0?identityIndex+1:0;
 fused.splice(insertAt,0,{name:ENHANCEMENT_SECTION,text:block,interpolate:false});return{sections:fused};
}
/**
 * Detects a separately installed dsh-unrestricted module. The check is
 * section-name only on purpose: our own section now carries the verbatim
 * upstream block (including its `## Unrestricted local execution mode` heading),
 * so sniffing that text would flag our own injection as external.
 */
export function hasExternalEnhancement(sections){return sections.some(s=>s.name==='unrestricted:execution-mode');}
