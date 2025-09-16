#!/usr/bin/env node
import process from 'node:process';


const required = [
'EXPO_PUBLIC_SUPABASE_URL',
'EXPO_PUBLIC_SUPABASE_ANON_KEY'
];


let ok = true;
for (const k of required) {
if (!process.env[k] || /<|your-|changeme/i.test(process.env[k])) {
ok = false;
console.error(`✗ ${k} is missing or placeholder`);
} else {
console.log(`✓ ${k}`);
}
}


// basic shape checks
if (process.env.EXPO_PUBLIC_SUPABASE_URL && !/^https:\/\/.+\.supabase\.co/i.test(process.env.EXPO_PUBLIC_SUPABASE_URL)) {
ok = false;
console.error('✗ EXPO_PUBLIC_SUPABASE_URL does not look like a Supabase URL');
}


process.exit(ok ? 0 : 1);