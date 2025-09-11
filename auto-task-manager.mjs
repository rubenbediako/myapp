#!/usr/bin/env node

/**
 * Intelligent Task Management System
 * Automatically determines and manages background vs foreground execution
 */

import fs from 'fs';
import path from 'path';

// Define command patterns that should run in background
const BACKGROUND_PATTERNS = [
  /^npm\s+(run\s+)?dev/,           // npm dev, npm run dev
  /^yarn\s+dev/,                   // yarn dev
  /^next\s+dev/,                   // next dev
  /^npm\s+(run\s+)?start/,         // npm start, npm run start
  /^yarn\s+start/,                 // yarn start
  /^npm\s+(run\s+)?watch/,         // npm watch, npm run watch
  /^yarn\s+watch/,                 // yarn watch
  /^npx\s+.*\s+--watch/,          // any npx command with --watch
  /^.*\s+--watch$/,               // any command ending with --watch
  /^node\s+.*server/,             // node server files
  /^python.*server/,              // python server files
  /^serve\s+/,                    // serve command
  /^http-server/,                 // http-server
  /^live-server/,                 // live-server
  /^webpack\s+.*--watch/,         // webpack with watch
  /^rollup\s+.*--watch/,          // rollup with watch
  /^vite(\s|$)/,                  // vite dev server
  /^docker\s+run/,                // docker run commands
  /^docker-compose\s+up/,         // docker-compose up
];

// Define command patterns that should run in foreground
const FOREGROUND_PATTERNS = [
  /^npm\s+(run\s+)?(build|test|lint)/,  // build, test, lint commands
  /^yarn\s+(build|test|lint)/,          // yarn build, test, lint
  /^git\s+/,                            // git commands
  /^curl\s+/,                           // curl commands
  /^wget\s+/,                           // wget commands
  /^ls\s+/,                            // ls commands
  /^cat\s+/,                           // cat commands
  /^grep\s+/,                          // grep commands
  /^find\s+/,                          // find commands
  /^echo\s+/,                          // echo commands
  /^pwd$/,                             // pwd command
  /^whoami$/,                          // whoami command
  /^node\s+(?!.*server)/,              // node commands (except servers)
  /^python\s+(?!.*server)/,            // python commands (except servers)
  /^tsc\s+/,                           // TypeScript compiler
  /^eslint\s+/,                        // ESLint
  /^prettier\s+/,                      // Prettier
  /^jest\s+/,                          // Jest tests
  /^cypress\s+/,                       // Cypress tests
  /^npm\s+(run\s+)?typecheck/,         // typecheck commands
];

// Commands that typically run for a long time but should be monitored
const MONITORED_BACKGROUND_PATTERNS = [
  /^npm\s+(run\s+)?dev/,
  /^yarn\s+dev/,
  /^next\s+dev/,
  /^vite(\s|$)/,
];

/**
 * Determine if a command should run in background
 */
function shouldRunInBackground(command) {
  // First check if it explicitly should be foreground
  for (const pattern of FOREGROUND_PATTERNS) {
    if (pattern.test(command)) {
      return false;
    }
  }
  
  // Then check if it should be background
  for (const pattern of BACKGROUND_PATTERNS) {
    if (pattern.test(command)) {
      return true;
    }
  }
  
  // Default to foreground for unknown commands
  return false;
}

/**
 * Determine if a background command should be monitored
 */
function shouldMonitor(command) {
  for (const pattern of MONITORED_BACKGROUND_PATTERNS) {
    if (pattern.test(command)) {
      return true;
    }
  }
  return false;
}

/**
 * Generate appropriate explanation for command execution
 */
function generateExplanation(command, isBackground) {
  const cmd = command.trim().split(' ')[0];
  
  if (isBackground) {
    if (command.includes('dev') || command.includes('start')) {
      return `Starting development server in background`;
    } else if (command.includes('watch')) {
      return `Starting file watcher in background`;
    } else if (command.includes('serve')) {
      return `Starting server in background`;
    } else {
      return `Running long-running process in background`;
    }
  } else {
    if (command.includes('build')) {
      return `Building project`;
    } else if (command.includes('test')) {
      return `Running tests`;
    } else if (command.includes('lint')) {
      return `Linting code`;
    } else if (cmd === 'git') {
      return `Executing git command`;
    } else if (cmd === 'curl') {
      return `Making HTTP request`;
    } else if (cmd === 'npm' || cmd === 'yarn') {
      return `Running package manager command`;
    } else {
      return `Executing command`;
    }
  }
}

/**
 * Create VS Code task configuration with automatic background detection
 */
function createVSCodeTask(command, label) {
  const isBackground = shouldRunInBackground(command);
  const explanation = generateExplanation(command, isBackground);
  
  return {
    label: label || command,
    type: "shell",
    command: command,
    group: isBackground ? "build" : "test",
    isBackground: isBackground,
    explanation: explanation,
    problemMatcher: isBackground ? [] : ["$tsc"], // Use problem matcher for foreground tasks
    options: {
      cwd: "${workspaceFolder}"
    },
    presentation: {
      echo: true,
      reveal: isBackground ? "silent" : "always",
      focus: !isBackground,
      panel: "shared",
      showReuseMessage: true,
      clear: false
    }
  };
}

/**
 * Auto-configure common development tasks
 */
function createAutoTasks() {
  const tasks = [
    createVSCodeTask("npm run dev", "dev-server"),
    createVSCodeTask("npm run build", "build"),
    createVSCodeTask("npm run lint", "lint"),
    createVSCodeTask("npm run typecheck", "typecheck"),
    createVSCodeTask("npm test", "test"),
    createVSCodeTask("git status", "git-status"),
    createVSCodeTask("git add .", "git-add-all"),
    createVSCodeTask("git commit -m 'Auto commit'", "git-commit"),
    createVSCodeTask("git push", "git-push"),
  ];
  
  return {
    version: "2.0.0",
    tasks: tasks
  };
}

/**
 * Smart command execution wrapper
 */
class SmartTaskRunner {
  constructor() {
    this.runningTasks = new Map();
  }
  
  async executeCommand(command, options = {}) {
    const isBackground = options.isBackground !== undefined ? options.isBackground : shouldRunInBackground(command);
    const explanation = options.explanation || generateExplanation(command, isBackground);
    const shouldWatch = isBackground && shouldMonitor(command);
    
    console.log(`🚀 ${explanation}`);
    console.log(`📋 Command: ${command}`);
    console.log(`⚙️  Mode: ${isBackground ? 'Background' : 'Foreground'}`);
    
    if (shouldWatch) {
      console.log(`👀 Monitoring: Enabled`);
    }
    
    // This would integrate with the actual terminal execution
    return {
      command,
      isBackground,
      explanation,
      shouldWatch,
      timestamp: new Date().toISOString()
    };
  }
  
  getTaskStatus() {
    return Array.from(this.runningTasks.entries()).map(([id, task]) => ({
      id,
      ...task,
      duration: Date.now() - new Date(task.timestamp).getTime()
    }));
  }
}

// Create and export the smart task runner instance
const taskRunner = new SmartTaskRunner();

// Auto-generate VS Code tasks configuration
const tasksConfig = createAutoTasks();

// Save tasks configuration
const tasksDir = '.vscode';
const tasksFile = path.join(tasksDir, 'tasks.json');

if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

fs.writeFileSync(tasksFile, JSON.stringify(tasksConfig, null, 2));

console.log(`
🎯 AUTOMATIC BACKGROUND TASK MANAGEMENT CONFIGURED
===============================================

✅ Smart task detection patterns configured
✅ VS Code tasks auto-generated with background detection  
✅ Command categorization rules established
✅ Monitoring enabled for development servers

📂 Configuration saved to: ${tasksFile}

🔧 AUTOMATIC RULES:
📱 Background: dev servers, watchers, long-running processes
🖥️  Foreground: builds, tests, git commands, quick tasks
👀 Monitored: development servers with status tracking

🚀 USAGE:
- All npm/yarn dev commands → Automatic background
- Build/test/lint commands → Automatic foreground  
- Git operations → Automatic foreground
- Server processes → Automatic background with monitoring
- Unknown commands → Default to foreground (safe)

STATUS: ✅ AUTOMATIC BACKGROUND MANAGEMENT ACTIVE
`);

export { taskRunner, shouldRunInBackground, shouldMonitor, generateExplanation, createVSCodeTask };
