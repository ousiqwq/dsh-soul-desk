import test from 'node:test';
import assert from 'node:assert/strict';
import { Context, Service } from '@deepseek-ai/cordis';
import SystemPrompt, { renderPrompt } from '@deepseek-ai/dsh-system-prompt';
import { createScope } from '@deepseek-ai/dsh-scope';
import { attachPersonaPolicy } from '../prompt-policy.js';
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

test('live edits take effect, disabling and unloading restore the original prompt', () => fixture(async (ctx) => {
  const state = { enabled: true, text: 'first soul', mode: 'complete' };
  const config = Object.fromEntries(Object.keys(state).map(k => [k, () => state[k]]));
  const undo = attachPersonaPolicy(ctx.systemPrompt, () => config);
  assert.equal(renderPrompt(await ctx.systemPrompt.assemble()), 'first soul');
  state.text = 'second soul';
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
