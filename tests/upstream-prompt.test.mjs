import test from 'node:test';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
import{EXECUTION_MODE_BLOCK,PERSONA_POINTER,PLAN_NOTE,PTC_ONLY_NOTE,STRUCTURED_OUTPUT_NOTE,ANCHORS,UPSTREAM,UPSTREAM_SHA256}from'../upstream-prompt.js';
import*as vendored from'../vendor/dsh-unrestricted/rules-0.2.15.js';
import{DEFAULT_ENHANCEMENT_SETTINGS,renderEnhancementPrompt}from'../prompt-enhancement.js';
import{fuseSections,POINTER,PLAN_NOTE as FUSED_PLAN_NOTE,PTC_NOTE,STRUCTURED_NOTE}from'../enhancement-fusion.js';
const sha=s=>createHash('sha256').update(s,'utf8').digest('hex');

test('vendored prompt text is byte-identical to the upstream dsh-unrestricted source',()=>{
 assert.equal(EXECUTION_MODE_BLOCK,vendored.EXECUTION_MODE_BLOCK);
 assert.equal(EXECUTION_MODE_BLOCK.length,9712);
 assert.equal(sha(EXECUTION_MODE_BLOCK),UPSTREAM_SHA256.executionModeBlock);
 const upstream=vendored.contractAdditions('ptc'),standard=vendored.contractAdditions('standard');
 assert.equal(PERSONA_POINTER,upstream.pointer);assert.equal(PERSONA_POINTER,standard.pointer);
 assert.equal(PLAN_NOTE,upstream.planNote);assert.equal(PTC_ONLY_NOTE,upstream.ptcNote);assert.equal(STRUCTURED_OUTPUT_NOTE,upstream.structuredNote);
 for(const key of Object.keys(UPSTREAM_SHA256))assert.equal(sha({executionModeBlock:EXECUTION_MODE_BLOCK,personaPointer:PERSONA_POINTER,planNote:PLAN_NOTE,ptcOnlyNote:PTC_ONLY_NOTE,structuredOutputNote:STRUCTURED_OUTPUT_NOTE}[key]),UPSTREAM_SHA256[key],key);
 assert.deepEqual(ANCHORS,vendored.ANCHORS);
 assert.equal(UPSTREAM.sectionName,vendored.BLOCK_SECTION);
});

test('the injected section body equals the upstream block with no wrapper, prefix or rewording',()=>{
 assert.equal(renderEnhancementPrompt(DEFAULT_ENHANCEMENT_SETTINGS),EXECUTION_MODE_BLOCK);
 assert.equal(renderEnhancementPrompt({...DEFAULT_ENHANCEMENT_SETTINGS,prompt:'  '+EXECUTION_MODE_BLOCK+'  '}),EXECUTION_MODE_BLOCK);
 for(const preset of['standard','ptc','cordis','minimal']){
  const rows=['harness:identity','deployment:persona-prefix','plan:policy','tools:ptc-only','tool:structured_output'].map(name=>({name,text:name+' body'}));
  const fused=fuseSections(rows,preset);
  const injected=fused.sections.filter(s=>s.text===EXECUTION_MODE_BLOCK);
  assert.equal(injected.length,1,preset);
  assert.equal(fused.sections.some(s=>s.text.includes('# Optional response enhancement')),false,preset);
 }
});

test('optional extras append after the untouched block and never alter its bytes',()=>{
 const text=renderEnhancementPrompt({...DEFAULT_ENHANCEMENT_SETTINGS,directAnswer:true,preserveNames:true});
 assert.ok(text.startsWith(EXECUTION_MODE_BLOCK));assert.equal(text.slice(0,EXECUTION_MODE_BLOCK.length),EXECUTION_MODE_BLOCK);
 assert.match(text,/preserve names/i);assert.match(text,/Lead with the requested result/);
 const empty=renderEnhancementPrompt({...DEFAULT_ENHANCEMENT_SETTINGS,prompt:'   '});
 assert.equal(empty,'');
});

test('fusion notes reuse the upstream bytes, not reworded variants',()=>{
 assert.equal(POINTER,PERSONA_POINTER);assert.equal(PTC_NOTE,PTC_ONLY_NOTE);assert.equal(STRUCTURED_NOTE,STRUCTURED_OUTPUT_NOTE);
 const rows=[{name:'deployment:persona-prefix',text:'P'},{name:'tools:ptc-only',text:'T'},{name:'tool:structured_output',text:'S'},{name:'plan:policy',text:'L'}];
 const fused=fuseSections(rows,'ptc',{settings:DEFAULT_ENHANCEMENT_SETTINGS});
 // The upstream contractAdditions() payload is the authority for each appended byte.
 const contract=vendored.contractAdditions('ptc');
 assert.equal(fused.sections.find(s=>s.name==='deployment:persona-prefix').text,'P'+contract.pointer);
 assert.equal(fused.sections.find(s=>s.name==='tools:ptc-only').text,'T'+contract.ptcNote);
 assert.equal(fused.sections.find(s=>s.name==='tool:structured_output').text,'S'+contract.structuredNote);
 assert.equal(fused.sections.find(s=>s.name==='plan:policy').text,'L'+contract.planNote);
 // And our own constants are those same bytes.
 assert.equal(POINTER,contract.pointer);assert.equal(PTC_NOTE,contract.ptcNote);assert.equal(STRUCTURED_NOTE,contract.structuredNote);assert.equal(FUSED_PLAN_NOTE,contract.planNote);
});
