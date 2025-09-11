#!/usr/bin/env node

/**
 * Example Usage of Automatic Background Detection
 * This shows how to use the auto-background utility in practice
 */

import { smartTerminalConfig, autoCommands, autoDetectBackground, autoGenerateExplanation } from './src/lib/auto-background.js';

console.log(`
🎯 AUTOMATIC BACKGROUND DETECTION - USAGE EXAMPLES
=================================================

1. SMART TERMINAL CONFIG (Recommended):
`);

// Example 1: Automatic detection
const devConfig = smartTerminalConfig('npm run dev');
console.log('Dev Server:', devConfig);

const buildConfig = smartTerminalConfig('npm run build');
console.log('Build:', buildConfig);

const gitConfig = smartTerminalConfig('git status');
console.log('Git Status:', gitConfig);

console.log(`
2. QUICK HELPER FUNCTIONS:
`);

// Example 2: Quick helpers
console.log('Dev Helper:', autoCommands.dev());
console.log('Build Helper:', autoCommands.build());
console.log('Test Helper:', autoCommands.test());
console.log('Git Status Helper:', autoCommands.gitStatus());

console.log(`
3. MANUAL OVERRIDES:
`);

// Example 3: Force background
const forcedBg = smartTerminalConfig('npm run build', 'Building in background', true);
console.log('Forced Background:', forcedBg);

// Example 4: Custom explanation
const customExpl = smartTerminalConfig('npm run dev', 'Starting the amazing development server');
console.log('Custom Explanation:', customExpl);

console.log(`
4. DIRECT PATTERN TESTING:
`);

// Example 5: Test patterns directly
const testCommands = [
  'npm run dev',
  'npm run build',
  'git push',
  'node server.js',
  'webpack --watch',
  'curl http://localhost:3000'
];

testCommands.forEach(cmd => {
  const bg = autoDetectBackground(cmd);
  const explanation = autoGenerateExplanation(cmd);
  console.log(`${cmd} → ${bg ? 'BACKGROUND' : 'FOREGROUND'} (${explanation})`);
});

console.log(`
5. INTEGRATION WITH RUN_IN_TERMINAL:
`);

console.log(`
// Before (manual):
run_in_terminal({
  command: "npm run dev",
  explanation: "Starting development server",
  isBackground: true
});

// After (automatic):
const config = smartTerminalConfig("npm run dev");
run_in_terminal(config);

// Or even simpler:
run_in_terminal(autoCommands.dev());
`);

console.log(`
✅ AUTOMATIC BACKGROUND DETECTION IS NOW ACTIVE!

🎯 BENEFITS:
  • No more manual isBackground decisions
  • Consistent behavior across all commands
  • Smart pattern recognition
  • Safe defaults (foreground when unsure)
  • Easy manual overrides when needed
  
🚀 READY TO USE - Import from src/lib/auto-background.ts
`);
