#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';


const kill = (p) => { try { execSync(p, { stdio: 'ignore' }); } catch {} };
const rmrf = (p) => { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); };


kill('adb kill-server');
rmrf('.expo');
rmrf('node_modules/.cache');
rmrf('android/.gradle');
rmrf('android/build');
rmrf('ios/build');
rmrf('web-build');
console.log('Caches cleaned. Reinstall deps if needed with npm ci');