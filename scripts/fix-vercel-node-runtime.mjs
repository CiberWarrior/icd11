/**
 * @astrojs/vercel@7 only knows Node 18/20. On Vercel's Node 24 build image it
 * falls back to writing runtime "nodejs18.x", which Vercel now rejects.
 * Patch generated function configs to nodejs24.x after `astro build`.
 * No-op for local PM2 builds (no .vercel/output).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const functionsDir = join(process.cwd(), '.vercel', 'output', 'functions');
if (!existsSync(functionsDir)) {
  process.exit(0);
}

const TARGET = 'nodejs24.x';
const STALE = new Set(['nodejs18.x', 'nodejs20.x']);
let patched = 0;

for (const entry of readdirSync(functionsDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.endsWith('.func')) continue;
  const configPath = join(functionsDir, entry.name, '.vc-config.json');
  if (!existsSync(configPath)) continue;

  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (!STALE.has(config.runtime)) continue;

  config.runtime = TARGET;
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  patched += 1;
  console.log(`[fix-vercel-node-runtime] ${entry.name}: ${TARGET}`);
}

if (patched === 0) {
  console.log('[fix-vercel-node-runtime] No stale Node runtimes to patch.');
}
