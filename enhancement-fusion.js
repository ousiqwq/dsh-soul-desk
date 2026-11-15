/**
 * Structural fusion adapted from dsh-unrestricted 0.2.8, src/rules.js.
 * Copyright (c) 2026 yexi-by, MIT (see vendor/dsh-unrestricted/LICENSE).
 * Soul additions: literal editable guidance and protected persona/memory rows.
 * The upstream unrestricted content block is deliberately not included.
 */
import {DEFAULT_ENHANCEMENT_SETTINGS,ENHANCEMENT_SECTION,renderEnhancementPrompt} from './prompt-enhancement.js';
export const UPSTREAM={version:'0.2.8',commit:'1383c6c16849a0f05bb8f9d927aa1bb31d772547'};
export const PRESETS=['standard','ptc','cordis','minimal'];
export const PRESET_RULES={standard:{plan:true,ptcOnly:false},ptc:{plan:true,ptcOnly:true},cordis:{plan:true,ptcOnly:false},minimal:{plan:false,ptcOnly:false}};
export const POINTER='\n\n[SOUL delivery guidance] Apply the optional delivery guidance below only where it agrees with the original persona, personal memories and native runtime contracts.';
export const PLAN_NOTE='\n\n[SOUL Plan coordination] This delivery guidance grants no execution permissions. Keep native Plan restrictions and approval transitions; proposed deliverables may be described without claiming they were executed.';
export const PTC_NOTE='\n\n[SOUL PTC coordination] Keep the native run_code/SDK protocol, permitted tools and schemas unchanged. Apply delivery guidance to the final response, never as a reason to bypass tool availability, sandboxing or approvals.';
export const STRUCTURED_NOTE='\n\n[SOUL structured-output coordination] Use the required structured_output final-report tool with its exact schema. Delivery guidance does not replace that required call with plain text.';
export const SHADOW_VARIABLE='soul_response_enhancement';
export const SHADOW_SUFFIX=POINTER+'\n\n{{'+SHADOW_VARIABLE+'}}';
export const PROTECTED_NAMES=new Set(['private-soul:identity','private-soul:memory-policy','private-soul:memories']);
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
 if(existing&&existing.text===block)return{sections};
 if(existing)return{sections:sections.map(s=>s===existing?{...s,text:block,interpolate:false}:s)};
 const byName=new Map(sections.map(s=>[s.name,s]));
 const persona=byName.get('deployment:persona-prefix');
 const hasSoul=sections.some(s=>PROTECTED_NAMES.has(s.name));
 let fusedPersona;
 if(persona?.text.trim())fusedPersona={...persona,text:appendOnce(persona.text,POINTER)};
 else if(!isSubagent&&!hasSoul)return{issues:['missing-persona']};
 const notes=[['plan:policy',rules.plan?PLAN_NOTE:''],['tools:ptc-only',rules.ptcOnly?PTC_NOTE:''],['tool:structured_output',STRUCTURED_NOTE]];
 const replaced=new Map(fusedPersona?[[fusedPersona.name,fusedPersona]]:[]);
 for(const[name,note]of notes){const section=byName.get(name);if(note&&section?.text.trim())replaced.set(name,{...section,text:appendOnce(section.text,note)});}
 const fused=sections.map(s=>replaced.get(s.name)??s);
 const personaIndex=fused.findIndex(s=>s.name==='deployment:persona-prefix');
 const identityIndex=fused.findIndex(s=>s.name==='harness:identity');
 const soulIndex=fused.reduce((last,s,i)=>PROTECTED_NAMES.has(s.name)?i:last,-1);
 const insertAt=soulIndex>=0?soulIndex+1:personaIndex>=0?personaIndex+1:identityIndex>=0?identityIndex+1:0;
 fused.splice(insertAt,0,{name:ENHANCEMENT_SECTION,text:block,interpolate:false});return{sections:fused};
}
export function hasExternalEnhancement(sections){return sections.some(s=>s.name==='unrestricted:execution-mode'||s.name==='deployment:persona-prefix'&&s.text?.includes('## Unrestricted local execution mode'));}
