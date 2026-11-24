// Regenerates upstream-prompt.js from the vendored dsh-unrestricted source.
// Usage: node scripts/generate-upstream-prompt.mjs <repo-root>
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = process.argv[2];
if (!root) throw new Error('repo root required');
const VERSION = '0.2.15';
const COMMIT = 'c79ce9c11d49925182fa9654d76d7055d6f5b3ac';
const source = `${root}/vendor/dsh-unrestricted/rules-${VERSION}.js`;
const mod = await import(source);
const std = mod.contractAdditions('standard');
const ptc = mod.contractAdditions('ptc');
const block = std.block;
if (block !== ptc.block) throw new Error('block differs per preset');
if ((block.match(/`/g) ?? []).length !== 12) throw new Error('unexpected backtick count');
if (block.includes('${') || block.includes('\\')) throw new Error('unexpected template syntax');

const sha = (text) => createHash('sha256').update(text, 'utf8').digest('hex');
const quoted = (text) => JSON.stringify(text);
const body = block.replaceAll('`', '\\`');

const out = `/**
 * Verbatim prompt text from dsh-unrestricted ${VERSION}, src/rules.js (MIT, yexi-by).
 * Extracted without edits; sha256 values are recorded for verification.
 * Source: tag v${VERSION}, commit ${COMMIT}.
 * The source file is vendored verbatim at vendor/dsh-unrestricted/rules-${VERSION}.js.
 */
export const UPSTREAM = Object.freeze({
  project: 'dsh-unrestricted',
  author: 'yexi-by',
  license: 'MIT',
  version: '${VERSION}',
  frameworkBase: 'v${VERSION}',
  commit: '${COMMIT}',
  sourceFile: 'src/rules.js',
  sectionName: ${quoted(mod.BLOCK_SECTION)},
});

/** sha256 of each verbatim string, as extracted from src/rules.js. */
export const UPSTREAM_SHA256 = Object.freeze({
  executionModeBlock: ${quoted(sha(block))},
  personaPointer: ${quoted(sha(std.pointer))},
  planNote: ${quoted(sha(std.planNote))},
  ptcOnlyNote: ${quoted(sha(ptc.ptcNote))},
  structuredOutputNote: ${quoted(sha(std.structuredNote))},
});

/** The persona pointer appended next to the persona row. */
export const PERSONA_POINTER = ${quoted(std.pointer)};

/** Appended to plan:policy while plan mode is active. */
export const PLAN_NOTE = ${quoted(std.planNote)};

/** Appended to tools:ptc-only. */
export const PTC_ONLY_NOTE = ${quoted(ptc.ptcNote)};

/** Appended to tool:structured_output. */
export const STRUCTURED_OUTPUT_NOTE = ${quoted(std.structuredNote)};

/** The unrestricted execution mode section body. */
export const EXECUTION_MODE_BLOCK = \`${body}\`;

/** Reference texts for the complete minimal persona and structured subagents. */
export const ANCHORS = Object.freeze({
  identity: ${quoted(mod.ANCHORS.identity)},
  personaStandard: ${quoted(mod.ANCHORS.personaStandard)},
  personaMinimal: ${quoted(mod.ANCHORS.personaMinimal)},
  structuredOutputFull: ${quoted(mod.ANCHORS.structuredOutputFull)},
});
`;

writeFileSync(`${root}/upstream-prompt.js`, out);
console.log(JSON.stringify({ version: VERSION, length: block.length, sha256: sha(block) }));
