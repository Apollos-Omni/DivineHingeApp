#!/usr/bin/env node
/** Predictive triage: feed it a path to a log file or pipe stdin. */
import fs from 'node:fs';
import readline from 'node:readline';


const patterns = [
{
re: /The `npm ci` command can only install with an existing package-lock/i,
why: 'npm ci needs package-lock.json',
do: [
'Create lockfile locally: npm install',
'Commit package-lock.json and push',
],
scripts: ['(no script)']
},
{
re: /ios\.bundleIdentifier.*required.*non-interactive/i,
why: 'EAS requires ios.bundleIdentifier even for Android builds in CI',
do: [
'Set ios.bundleIdentifier in app.config.ts (e.g., com.apollosdesigns.divinehingeapp)'
],
scripts: ['npm run validate:appconfig']
},
{
re: /JAVA_HOME is not set|no \'java\' command/i,
why: 'JDK missing for Android tooling',
do: ['Install Temurin 17 or point JAVA_HOME to Android Studio JBR'],
scripts: ['npm run android:emulator']
},
{
re: /sdkmanager\.bat.*is not recognized|No sdkmanager found/i,
why: 'Android command-line tools not installed or not on PATH',
do: ['Install "Android SDK Command-line Tools (latest)" via Android Studio → SDK Manager'],
scripts: ['npm run android:emulator']
},
{
re: /Failed to load opengl32sw|device offline|Vulkan.*SwiftShader/i,
why: 'Emulator GPU/ADB issues on Windows',
do: ['Use ANGLE/SwiftShader and reset ADB keys'],
scripts: ['npm run android:emulator', 'npm run android:adb:reset']
},
{
re: /TS5095: Option \'bundler\' can only be used when \'module\' is set to/i,
why: 'tsconfig mismatch: moduleResolution=bundler requires ES module',
do: ['Set compilerOptions.module to ES2020 in tsconfig.json'],
scripts: ['npm run typecheck']
},
{
re: /Parsing error: The keyword \'import\' is reserved/i,
why: 'ESLint parsing TS as old JS; wrong parser config',
do: ['Use @typescript-eslint/parser and Expo config in .eslintrc'],
scripts: ['npm run lint']
},
{
re: /Type \'\".+\"\' is not assignable to type \'keyof .*ParamList\'/i,
why: 'React Navigation route name not in param list',
do: ['Add the route to RootStackParamList or rename to existing key'],
scripts: ['npm run typecheck']
}
];