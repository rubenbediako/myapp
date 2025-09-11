#!/usr/bin/env node

/**
 * Smart Command Executor with Automatic Background Detection
 * This script demonstrates how commands are automatically categorized
 */

import { taskRunner, shouldRunInBackground, generateExplanation } from './auto-task-manager.mjs';

// Test commands to demonstrate automatic background detection
const testCommands = [
  'npm run dev',
  'npm run build', 
  'npm run lint',
  'npm test',
  'git status',
  'git add .',
  'git commit -m "test"',
  'node server.js',
  'python manage.py runserver',
  'webpack --watch',
  'vite',
  'next dev',
  'curl http://localhost:3000',
  'echo "hello world"',
  'tsc --watch',
  'npm run typecheck',
  'docker run -d nginx',
  'serve -s build',
  'live-server'
];

console.log(`
🧠 SMART COMMAND EXECUTION DEMO
==============================

Testing automatic background detection for various commands:
`);

testCommands.forEach(cmd => {
  const isBackground = shouldRunInBackground(cmd);
  const explanation = generateExplanation(cmd, isBackground);
  const mode = isBackground ? '🔄 BACKGROUND' : '⚡ FOREGROUND';
  
  console.log(`${mode} | ${cmd}`);
  console.log(`         └─ ${explanation}`);
  console.log('');
});

console.log(`
📋 AUTOMATIC RULES SUMMARY:
===========================

🔄 BACKGROUND (Long-running processes):
  • Development servers (npm/yarn dev, next dev, vite)
  • File watchers (--watch flags, webpack --watch)
  • Server processes (node server, python runserver)
  • Container services (docker run, docker-compose up)
  • Static file servers (serve, live-server)

⚡ FOREGROUND (Quick tasks):
  • Build processes (npm run build, tsc)
  • Test suites (npm test, jest, cypress)  
  • Linting (eslint, prettier, npm run lint)
  • Git operations (git status, commit, push)
  • HTTP requests (curl, wget)
  • File operations (ls, cat, grep, find)
  • Type checking (tsc --noEmit, npm run typecheck)

🎯 SMART DETECTION FEATURES:
  ✅ Pattern-based command recognition
  ✅ Automatic background/foreground classification
  ✅ Context-aware explanation generation
  ✅ Development server monitoring
  ✅ VS Code task integration
  ✅ Safe defaults (unknown commands → foreground)

🚀 USAGE:
  • Import the task runner functions
  • Commands are automatically categorized
  • VS Code tasks are pre-configured
  • Manual override available when needed

STATUS: ✅ AUTOMATIC BACKGROUND DETECTION ACTIVE
`);

/**
 * Example function showing how to use the smart task runner
 */
async function executeWithAutoDetection(command, manualOverride = null) {
  const result = await taskRunner.executeCommand(command, {
    isBackground: manualOverride
  });
  
  return result;
}

// Example usage
console.log('\n🔥 EXAMPLE EXECUTION:');
executeWithAutoDetection('npm run dev').then(result => {
  console.log('Result:', result);
});

export { executeWithAutoDetection };
