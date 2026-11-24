// Runs only in a disposable CI checkout; resolves each DSH version from scratch.
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const version = process.env.DSH_TEST_VERSION;
if (process.env.CI !== 'true' || existsSync('node_modules')) throw new Error('Use a fresh CI checkout');
// Cordis and schemastery are versioned separately from the harness packages.
const FRAMEWORK = {
  '0.2.1-rc.3': { cordis: '4.0.5', schemastery: '3.18.5' },
  '0.2.1-rc.5': { cordis: '4.0.5', schemastery: '3.18.5' },
  '0.2.2-rc.2': { cordis: '4.1.0', schemastery: '3.19.0' },
  '0.2.2-rc.5': { cordis: '4.1.0', schemastery: '3.19.0' },
  '0.2.3-alpha.2': { cordis: '4.2.0-alpha.1', schemastery: '3.20.0-alpha.1' },
};
const framework = FRAMEWORK[version];
if (framework === undefined) throw new Error('Unsupported test version');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (version.startsWith('0.2.1-')) delete pkg.devDependencies['@deepseek-ai/dsh-tool-executor-native'];
for (const name of Object.keys(pkg.devDependencies)) {
  if (name.startsWith('@deepseek-ai/dsh-')) pkg.devDependencies[name] = version;
  if (name === '@deepseek-ai/cordis') pkg.devDependencies[name] = framework.cordis;
  if (name === '@deepseek-ai/schemastery') pkg.devDependencies[name] = framework.schemastery;
}
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
rmSync('package-lock.json');
const result = spawnSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
