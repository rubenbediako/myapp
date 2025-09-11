/**
 * Automatic Background Detection Utility (JavaScript Version)
 * Use this module to automatically determine if commands should run in background
 */

// Command patterns that should run in background
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

// Command patterns that should definitely run in foreground
const FOREGROUND_PATTERNS = [
  /^npm\s+(run\s+)?(build|test|lint|typecheck)/,  // build, test, lint commands
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
  /^node\s+(?!.*server).*\.js$/,       // node scripts (except servers)
  /^python\s+(?!.*server).*\.py$/,     // python scripts (except servers)
  /^tsc\s+(?!.*--watch)/,              // TypeScript compiler (not watch mode)
  /^eslint\s+/,                        // ESLint
  /^prettier\s+/,                      // Prettier
  /^jest\s+/,                          // Jest tests
  /^cypress\s+/,                       // Cypress tests
];

/**
 * Automatically determine if a command should run in background
 */
export function autoDetectBackground(command) {
  if (!command || typeof command !== 'string') {
    return false; // Default to foreground for invalid input
  }
  
  const cmd = command.trim().toLowerCase();
  
  // First check if it explicitly should be foreground
  for (const pattern of FOREGROUND_PATTERNS) {
    if (pattern.test(cmd)) {
      return false;
    }
  }
  
  // Then check if it should be background
  for (const pattern of BACKGROUND_PATTERNS) {
    if (pattern.test(cmd)) {
      return true;
    }
  }
  
  // Default to foreground for unknown commands (safer)
  return false;
}

/**
 * Generate appropriate explanation for command execution
 */
export function autoGenerateExplanation(command, isBackground = null) {
  if (!command) return 'Executing command';
  
  const bg = isBackground !== null ? isBackground : autoDetectBackground(command);
  const cmd = command.trim().toLowerCase();
  
  if (bg) {
    if (cmd.includes('dev') || cmd.includes('start')) {
      return 'Starting development server in background';
    } else if (cmd.includes('watch')) {
      return 'Starting file watcher in background';
    } else if (cmd.includes('serve')) {
      return 'Starting server in background';
    } else {
      return 'Running long-running process in background';
    }
  } else {
    if (cmd.includes('build')) {
      return 'Building project';
    } else if (cmd.includes('test')) {
      return 'Running tests';
    } else if (cmd.includes('lint')) {
      return 'Linting code';
    } else if (cmd.includes('typecheck')) {
      return 'Type checking code';
    } else if (cmd.startsWith('git')) {
      return 'Executing git command';
    } else if (cmd.startsWith('curl') || cmd.startsWith('wget')) {
      return 'Making HTTP request';
    } else if (cmd.startsWith('npm') || cmd.startsWith('yarn')) {
      return 'Running package manager command';
    } else {
      return 'Executing command';
    }
  }
}

/**
 * Smart wrapper for terminal execution with automatic background detection
 */
export function smartTerminalConfig(command, manualExplanation = null, forceBackground = null) {
  const isBackground = forceBackground !== null ? forceBackground : autoDetectBackground(command);
  const explanation = manualExplanation || autoGenerateExplanation(command, isBackground);
  
  return {
    command,
    explanation,
    isBackground
  };
}

/**
 * Quick helper functions for common scenarios
 */
export const autoCommands = {
  // Development commands (auto-background)
  dev: (port = null) => smartTerminalConfig(port ? `npm run dev -- -p ${port}` : 'npm run dev'),
  start: () => smartTerminalConfig('npm start'),
  serve: (dir = 'build') => smartTerminalConfig(`serve -s ${dir}`),
  
  // Build commands (auto-foreground)
  build: () => smartTerminalConfig('npm run build'),
  test: () => smartTerminalConfig('npm test'),
  lint: () => smartTerminalConfig('npm run lint'),
  typecheck: () => smartTerminalConfig('npm run typecheck'),
  
  // Git commands (auto-foreground)
  gitStatus: () => smartTerminalConfig('git status'),
  gitAdd: () => smartTerminalConfig('git add .'),
  gitCommit: (message) => smartTerminalConfig(`git commit -m "${message}"`),
  gitPush: () => smartTerminalConfig('git push'),
  
  // Custom command with auto-detection
  auto: (command, explanation = null) => smartTerminalConfig(command, explanation)
};
