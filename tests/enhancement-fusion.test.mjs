import test from'node:test';import assert from'node:assert/strict';
import {Context}from'@deepseek-ai/cordis';import SystemPrompt,{renderPrompt}from'@deepseek-ai/dsh-system-prompt';import{createScope}from'@deepseek-ai/dsh-scope';
import {fuseSections,PRESETS,POINTER,PLAN_NOTE,PTC_NOTE,STRUCTURED_NOTE,PROTECTED_NAMES}from'../enhancement-fusion.js';
import {DEFAULT_ENHANCEMENT_SETTINGS,ENHANCEMENT_SECTION}from'../prompt-enhancement.js';
import {createEnhancementRuntime}from'../enhancement-runtime.js';import{attachPersonaPolicy,applyPersona}from'../prompt-policy.js';
const settings={...DEFAULT_ENHANCEMENT_SETTINGS,prompt:'Literal {{raw}}'};
const source=()=>['harness:identity','deployment:persona-prefix','plan:policy','tools:ptc-only','tool:structured_output','deployment:persona-suffix'].map(name=>({name,text:name+' original'}));

test('upstream structural fusion preserves original text and exactly targets each preset contract',()=>{
 for(const preset of PRESETS){const rows=source(),before=structuredClone(rows),fused=fuseSections(rows,preset,{settings});assert.deepEqual(rows,before);
 assert.equal(fused.sections[2].name,ENHANCEMENT_SECTION);assert.equal(fused.sections.length,rows.length+1);
 for(const row of rows){const next=fused.sections.find(s=>s.name===row.name);assert.ok(next.text.startsWith(row.text));
 const note=row.name==='deployment:persona-prefix'?POINTER:row.name==='plan:policy'&&preset!=='minimal'?PLAN_NOTE:row.name==='tools:ptc-only'&&preset==='ptc'?PTC_NOTE:row.name==='tool:structured_output'?STRUCTURED_NOTE:'';
 assert.equal(next.text,row.text+note);if(!note)assert.equal(next,row);}
 assert.match(fused.sections[2].text,/Literal \{\{raw\}\}/);assert.equal(fused.sections[2].interpolate,false);
 assert.equal(fuseSections(fused.sections,preset,{settings}).sections,fused.sections);
 }
});
test('missing-persona and unsupported modes follow upstream fallback; Soul and delegated agents are explicit exceptions',()=>{
 const rows=[{name:'tools:sdk',text:'native SDK'}];assert.deepEqual(fuseSections(rows,'standard').issues,['missing-persona']);assert.deepEqual(fuseSections(source(),'other').issues,['unsupported-preset']);
 assert.ok(fuseSections(rows,'standard',{isSubagent:true}).sections);const soul={name:'private-soul:identity',text:'{{raw}} persona'};
 const fused=fuseSections([soul,...rows],'standard',{settings});assert.equal(fused.sections[0],soul);assert.equal(fused.sections[1].name,ENHANCEMENT_SECTION);
});
test('three Soul modes exempt original persona and memory rows from the upstream structural adapter',()=>{
 for(const mode of['priority','complete','append'])for(const preset of PRESETS){const native={sections:source(),tools:[{name:'run_code'}],contexts:[],variables:{}};
 const personal=applyPersona(native,{enabled:true,mode,text:'SOUL {{raw}}',personaId:'p',name:'合成',memories:[{id:'m',kind:'preference',content:'合成记忆',updatedAt:'2026-11-15'}]});
 const result=fuseSections(personal.sections,preset,{settings});for(const row of personal.sections.filter(s=>PROTECTED_NAMES.has(s.name)))assert.ok(result.sections.includes(row));}
});
async function fixture(fn){const ctx=new Context();const fiber=ctx.plugin(SystemPrompt,{personaPrefix:'native persona {{raw}}'});await fiber;ctx.systemPrompt.variable('raw',()=> 'native value');
 let state={enabled:false,revision:0,settings:structuredClone(settings)},mode='append';const store={config:()=>structuredClone(state),report:value=>store.last=value};const runtime=createEnhancementRuntime(ctx,store,{descriptor:(_id,agent)=>({kind:agent?.session?.header?.origin==='subagent'?'subagent':'session'})});
 const undo=attachPersonaPolicy(ctx.systemPrompt,()=>({enabled:true,mode,text:'Soul literal {{raw}}',personaId:'p',name:'合成',memories:[]}),runtime);
 try{await fn({ctx,runtime,store,state,setMode:value=>mode=value});}finally{undo();runtime.dispose();await fiber.dispose();}}

test('real Cordis event pipeline, post-complete guard, off equality and unload preserve original protocols',()=>fixture(async({ctx,runtime,state,setMode})=>{
 ctx.systemPrompt.section({name:'plan:policy',order:500,text:'native plan'});ctx.systemPrompt.section({name:'tools:ptc-only',order:800,text:'native PTC protocol'});ctx.systemPrompt.section({name:'tool:structured_output',order:9900,text:'native report'});
 const off=await ctx.systemPrompt.assemble();state.enabled=true;runtime.changed();
 for(const mode of['append','priority','complete']){setMode(mode);const a=await ctx.systemPrompt.assemble();assert.equal(a.sections.filter(s=>s.name===ENHANCEMENT_SECTION).length,1);assert.match(renderPrompt(a),/Soul literal \{\{raw\}\}/);for(const name of['plan:policy','tools:ptc-only','tool:structured_output'])assert.ok(a.sections.some(s=>s.name===name));}
 state.enabled=false;runtime.changed();setMode('append');assert.deepEqual(await ctx.systemPrompt.assemble(),off);runtime.dispose();assert.deepEqual(await ctx.systemPrompt.assemble(),off);
}));

test('Minimal scope shadows are live, literal-safe, removed on mode switch and never replace custom agent personas',()=>fixture(async({ctx,runtime,state})=>{
 let preset='minimal';const agents=[];
 ctx.provide('agentPresets',{composedPreset:()=>preset,acquireScope:async()=>{const key={},scope=createScope(ctx,key);await scope.ctx.inject(['systemPrompt'],child=>child.systemPrompt.section({name:'deployment:persona-prefix',order:0,complete:true,text:'native Minimal {{raw}}'}));return{key,[Symbol.asyncDispose]:()=>scope.dispose()};}});
 ctx.provide('agents',{list:()=>agents,get:id=>agents.find(a=>a.session.id===id)});
 const agent={session:{id:'synthetic-minimal',header:{}}},scope=createScope(ctx,agent);agent.ctx=scope.ctx;agents.push(agent);
 try{
 state.enabled=true;runtime.changed();await runtime.syncMinimalShadow(agent);assert.equal(runtime.status().shadows,1);
 const a=await ctx.systemPrompt.assemble({scope:agent});assert.equal(a.sections.filter(s=>s.name===ENHANCEMENT_SECTION).length,1);const text=renderPrompt(a);assert.match(text,/native Minimal native value/);assert.match(text,/Literal \{\{raw\}\}/);assert.match(text,/Soul literal \{\{raw\}\}/);
 preset='standard';await runtime.syncMinimalShadow(agent);assert.equal(runtime.status().shadows,0);
 preset='minimal';let remove;await agent.ctx.inject(['systemPrompt'],child=>{remove=child.systemPrompt.section({name:'deployment:persona-prefix',order:0,complete:true,text:'CUSTOM CHILD PERSONA {{raw}}',interpolate:false});});await runtime.syncMinimalShadow(agent);assert.equal(runtime.status().shadows,0);assert.match(renderPrompt(await ctx.systemPrompt.assemble({scope:agent})),/CUSTOM CHILD PERSONA \{\{raw\}\}/);remove();
 state.enabled=false;runtime.changed();assert.equal(runtime.status().shadows,0);
 }finally{await scope.dispose();}
}));

test('full prompt preview and recheck are read-only and isolate concurrent preset contexts',()=>fixture(async({ctx,runtime,state})=>{
 const before=structuredClone(state);ctx.provide('agentPresets',{acquireScope:async id=>{const key={},scope=createScope(ctx,key);await scope.ctx.inject(['systemPrompt'],child=>child.systemPrompt.section({name:'deployment:persona-prefix',order:0,text:'MODE '+id}));return{key,[Symbol.asyncDispose]:()=>scope.dispose()};}});
 const previews=await Promise.all(PRESETS.map(id=>runtime.previewFor(id,{settings,preferLive:false})));
 for(const p of previews){assert.equal(p.available,true);assert.match(p.text,new RegExp('MODE '+p.presetId));assert.match(p.text,/Soul literal \{\{raw\}\}/);assert.match(p.text,/Literal \{\{raw\}\}/);assert.ok(p.bytes>=p.text.length);}
 assert.deepEqual(state,before);const status=await runtime.recheck();assert.deepEqual(state,before);assert.equal(Object.values(status.modes).every(m=>m.checked&&m.state==='off'&&!m.issues.length),true);
 await assert.rejects(runtime.previewFor('unknown'),{status:400});
}));


test('an independently installed module added outside our waterfall takes precedence without duplicate delivery rules',()=>fixture(async({ctx,runtime,state})=>{
 const remove=ctx.on('system-prompt/assemble',async(_assembly,_context,next)=>{const a=await next();return{...a,sections:[...a.sections,{name:'unrestricted:execution-mode',text:'Synthetic external-module marker only.'}]};});
 try{state.enabled=true;runtime.changed();const a=await ctx.systemPrompt.assemble();assert.equal(a.sections.some(s=>s.name===ENHANCEMENT_SECTION),false);assert.equal(a.sections.some(s=>s.name==='unrestricted:execution-mode'),true);assert.match(renderPrompt(a),/Soul literal \{\{raw\}\}/);}finally{remove();}
}));


test('empty enabled settings preserve complete-persona output without restoring extra native prose',()=>fixture(async({ctx,runtime,state,setMode})=>{
 ctx.systemPrompt.section({name:'plan:policy',order:500,text:'native plan'});setMode('complete');const before=await ctx.systemPrompt.assemble();state.settings={...state.settings,prompt:'',directAnswer:false,completeArtifacts:false,preserveNames:false};state.enabled=true;runtime.changed();assert.deepEqual(await ctx.systemPrompt.assemble(),before);
}));

test('finalizer failure removes only owned fusion and leaves the original Soul sections intact',()=>fixture(async({ctx,runtime,state})=>{
 const before=await ctx.systemPrompt.assemble();state.enabled=true;runtime.changed();runtime.finalize=async()=>{throw Error('simulated finalizer failure');};const failed=await ctx.systemPrompt.assemble();assert.deepEqual(failed,before);
}));


test('rosterless hosts infer their actual executor and never advertise unavailable presets',()=>fixture(async({ctx,runtime})=>{
 assert.equal((await runtime.previewFor('standard',{preferLive:false})).available,true);assert.equal((await runtime.previewFor('minimal',{preferLive:false})).available,false);
 ctx.systemPrompt.section({name:'tools:ptc-only',order:800,text:'native run_code contract'});assert.equal((await runtime.previewFor('ptc',{preferLive:false})).available,true);assert.equal((await runtime.previewFor('standard',{preferLive:false})).available,false);
 for(const id of['__proto__','constructor','toString'])assert.deepEqual(fuseSections(source(),id).issues,['unsupported-preset']);
}));
