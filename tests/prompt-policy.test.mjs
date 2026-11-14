import test from 'node:test';
import assert from 'node:assert/strict';
import { Context, Service } from '@deepseek-ai/cordis';
import SystemPrompt, { renderPrompt } from '@deepseek-ai/dsh-system-prompt';
import { createScope } from '@deepseek-ai/dsh-scope';
import { attachPersonaPolicy, applyPersona } from '../prompt-policy.js';
import * as SoulHost from '../index.js';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

async function fixture(fn) {
  const ctx = new Context();
  const fiber = ctx.plugin(SystemPrompt, { personaPrefix: 'default persona', personaSuffix: 'default suffix' });
  await fiber;
  try { await fn(ctx); } finally { await fiber.dispose(); }
}

test('literal SOUL text is first, replacing identities while preserving tools and runtime context', () => fixture(async (ctx) => {
  ctx.systemPrompt.section({ name: 'tool:example', order: 1000, text: 'Use the example tool.' });
  ctx.systemPrompt.context({ name: 'workdir', order: 100, text: 'workspace facts', required: true });
  ctx.systemPrompt.tools(() => ({ schemas: [{ name: 'example', description: 'example', parameters: { type: 'object' } }] }));
  const text = '  # 私人灵魂\n保留 {{literal}}、<tag> 和换行。\n';
  const undo = attachPersonaPolicy(ctx.systemPrompt, () => ({ enabled: true, text, mode: 'priority' }));
  try {
    const assembly = await ctx.systemPrompt.assemble();
    assert.equal(assembly.sections[0].text, text);
    assert.equal(assembly.sections[0].interpolate, false);
    assert.equal(assembly.sections.some(s => s.name === 'harness:identity' || s.name === 'deployment:persona-prefix'), false);
    assert.match(renderPrompt(assembly), /^  # 私人灵魂/);
    assert.match(renderPrompt(assembly), /\{\{literal\}\}/);
    assert.match(renderPrompt(assembly), /Use the example tool/);
    assert.equal(assembly.tools[0].name, 'example');
    assert.equal(assembly.contexts[0].text, 'workspace facts');
  } finally { undo(); }
}));

test('complete mode also replaces a scoped complete persona without a duplicate-complete error', () => fixture(async (ctx) => {
  const key = {};
  const scope = createScope(ctx, key);
  await scope.ctx.inject(['systemPrompt'], (child) => child.systemPrompt.section({ name: 'deployment:persona-prefix', order: 0, text: 'scoped preset identity', complete: true }));
  const config = { enabled: true, text: '# My SOUL\n{{unregistered}}', mode: 'complete' };
  const undo = attachPersonaPolicy(ctx.systemPrompt, () => config);
  try {
    const assembly = await ctx.systemPrompt.assemble({ scope: key });
    assert.equal(assembly.sections.length, 1);
    assert.equal(renderPrompt(assembly), config.text);
  } finally { undo(); await scope.dispose(); }
}));

test('append preserves the original prompt and adds literal persona and memory sections at its end', () => fixture(async (ctx) => {
  ctx.systemPrompt.section({ name: 'tool:example', order: 1000, text: 'Use the example tool.' });
  ctx.systemPrompt.context({ name: 'workdir', order: 100, text: 'workspace facts', required: true });
  const baseline = await ctx.systemPrompt.assemble();
  const config = { enabled: true, mode: 'append', text: '  # 伙伴 {{literal}}\n', personaId: 'test-persona', name: '伙伴', memories: [{ id: 'test-memory', kind: 'preference', content: '用户喜欢乌龙茶。', updatedAt: '2026-11-12T00:00:00.000Z' }] };
  const undo = attachPersonaPolicy(ctx.systemPrompt, () => config);
  try {
    const assembly = await ctx.systemPrompt.assemble();
    assert.deepEqual(assembly.sections.slice(0, baseline.sections.length), baseline.sections);
    assert.deepEqual(assembly.sections.slice(-3).map(s => s.name), ['private-soul:identity', 'private-soul:memory-policy', 'private-soul:memories']);
    assert.equal(assembly.sections.at(-3).text, config.text);
    const prompt = renderPrompt(assembly);
    assert.ok(prompt.startsWith(renderPrompt(baseline) + '\n\n' + config.text));
    assert.match(prompt, /用户喜欢乌龙茶/);
    assert.match(prompt, /default persona/);
    assert.match(prompt, /default suffix/);
    assert.match(prompt, /\{\{literal\}\}/);
    assert.deepEqual(assembly.contexts, baseline.contexts);
    const reapplied = applyPersona(assembly, config);
    assert.deepEqual(reapplied.sections, assembly.sections);
    assert.equal(reapplied.tools, assembly.tools);
    assert.equal(reapplied.contexts, assembly.contexts);
    assert.equal(reapplied.variables, assembly.variables);
  } finally { undo(); }
}));

test('append also preserves a native scoped complete preset', () => fixture(async (ctx) => {
  const key = {}, scope = createScope(ctx, key);
  await scope.ctx.inject(['systemPrompt'], child => child.systemPrompt.section({ name: 'deployment:persona-prefix', order: 0, text: 'Scoped complete prompt', complete: true }));
  const undo = attachPersonaPolicy(ctx.systemPrompt, () => ({ enabled: true, text: 'Appended persona', mode: 'append' }));
  try {
    assert.equal(renderPrompt(await ctx.systemPrompt.assemble({ scope: key })), 'Scoped complete prompt\n\nAppended persona');
  } finally { undo(); await scope.dispose(); }
}));

test('live edits take effect, disabling and unloading restore the original prompt', () => fixture(async (ctx) => {
  const state = { enabled: true, text: 'first soul', mode: 'complete' };
  const config = Object.fromEntries(Object.keys(state).map(k => [k, () => state[k]]));
  const undo = attachPersonaPolicy(ctx.systemPrompt, () => config);
  assert.equal(renderPrompt(await ctx.systemPrompt.assemble()), 'first soul');
  state.text = 'second soul';
  assert.equal(renderPrompt(await ctx.systemPrompt.assemble()), 'second soul');
  state.mode = 'append';
  assert.match(renderPrompt(await ctx.systemPrompt.assemble()), /default persona/);
  assert.ok(renderPrompt(await ctx.systemPrompt.assemble()).endsWith('second soul'));
  state.mode = 'priority';
  assert.ok(renderPrompt(await ctx.systemPrompt.assemble()).startsWith('second soul'));
  assert.doesNotMatch(renderPrompt(await ctx.systemPrompt.assemble()), /default persona/);
  state.mode = 'complete';
  assert.equal(renderPrompt(await ctx.systemPrompt.assemble()), 'second soul');
  state.enabled = false;
  assert.match(renderPrompt(await ctx.systemPrompt.assemble()), /default persona/);
  state.enabled = true;
  state.text = ' \n\t ';
  assert.match(renderPrompt(await ctx.systemPrompt.assemble()), /default persona/);
  undo();
  state.text = 'should be gone';
  assert.match(renderPrompt(await ctx.systemPrompt.assemble()), /default persona/);
}));

test('native plugin configuration accepts append and persists it without replacing the native prompt', () => fixture(async ctx => {
  class SettingsStub extends Service {
    constructor(child) { super(child, 'settings'); }
    configure() { return () => {}; }
  }
  const settings = ctx.plugin(SettingsStub); await settings;
  const dataDir = await mkdtemp(join(tmpdir(), 'soul-append-'));
  const plugin = ctx.plugin(SoulHost, { enabled: true, text: 'Appended persona', mode: 'append', dataDir });
  await plugin;
  try {
    const prompt = renderPrompt(await ctx.systemPrompt.assemble());
    assert.match(prompt, /default persona/);
    assert.ok(prompt.indexOf('default persona') < prompt.indexOf('Appended persona'));
    assert.equal(JSON.parse(await readFile(join(dataDir, 'library.json'), 'utf8')).mode, 'append');
  } finally { await plugin.dispose(); await settings.dispose(); await rm(dataDir, { recursive: true, force: true }); }
}));

test('native Cordis migrates literal legacy cells once and unload restores the registry', () => fixture(async (ctx) => {
  class SettingsStub extends Service {
    constructor(child) { super(child, 'settings'); }
    configure() { return () => {}; }
  }
  const settings = ctx.plugin(SettingsStub);
  await settings;
  const dataDir = await mkdtemp(join(tmpdir(), 'soul-migration-'));
  const plugin = ctx.plugin(SoulHost, { enabled: true, text: 'native first soul', mode: 'complete', dataDir });
  await plugin;
  try {
    const assembly = await ctx.systemPrompt.assemble();
    assert.equal(assembly.sections[0].text, 'native first soul');
    assert.equal(assembly.sections.length, 3);
    const persisted = JSON.parse(await readFile(join(dataDir, 'library.json'), 'utf8'));
    assert.equal(persisted.personas[0].soul, 'native first soul');
    assert.equal(persisted.enabled, true);
  } finally { await plugin.dispose(); await settings.dispose(); await rm(dataDir,{recursive:true,force:true}); }
  assert.match(renderPrompt(await ctx.systemPrompt.assemble()), /default persona/);
}));


test('complete persona replacement preserves executor protocol and generated PTC SDK sections',()=>fixture(async ctx=>{
 ctx.systemPrompt.section({name:'tools:ptc-only',order:200,text:'Only run_code is callable directly.'});
 ctx.systemPrompt.section({name:'tools:sdk',order:300,text:'declare const tools: { soul_memory_read(): void }'});
 ctx.systemPrompt.section({name:'task:old-body',order:100,text:'Old task instructions to replace'});
 ctx.systemPrompt.context({name:'workdir',order:100,text:'native workspace context',required:true});
 const baseline=await ctx.systemPrompt.assemble(),config={enabled:true,text:'Replacement persona',mode:'complete'};
 const undo=attachPersonaPolicy(ctx.systemPrompt,()=>config);
 try{const result=await ctx.systemPrompt.assemble();assert.deepEqual(result.sections.map(s=>s.name),['private-soul:identity','tools:ptc-only','tools:sdk']);assert.match(renderPrompt(result),/Only run_code/);assert.match(renderPrompt(result),/declare const tools/);assert.doesNotMatch(renderPrompt(result),/Old task|default persona/);assert.deepEqual(result.contexts,baseline.contexts);assert.deepEqual(applyPersona(result,config).sections,result.sections);}finally{undo();}
}));
