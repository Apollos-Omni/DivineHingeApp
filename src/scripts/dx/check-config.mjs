#!/usr/bin/env node
import { execSync } from 'node:child_process';


function expoConfig() {
const json = execSync('npx expo config --type public --json', { stdio: ['ignore', 'pipe', 'inherit'] }).toString();
return JSON.parse(json);
}


try {
const cfg = expoConfig();
let ok = true;
const req = [
['ios.bundleIdentifier', cfg.ios?.bundleIdentifier],
['android.package', cfg.android?.package],
['scheme', cfg.scheme],
['updates.url', cfg.updates?.url],
['runtimeVersion.policy', cfg.runtimeVersion?.policy]
];
for (const [k, v] of req) {
if (!v) { console.error(`✗ Missing ${k}`); ok = false; } else { console.log(`✓ ${k} = ${v}`); }
}
if (!ok) process.exit(1);
console.log('Config looks sane.');
} catch (e) {
console.error('Failed to read Expo config. Is expo CLI installed?');
process.exit(2);
}