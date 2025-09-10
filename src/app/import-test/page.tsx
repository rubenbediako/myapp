// Simple import test
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

console.log('AI SDK imports successful');
console.log('createGoogleGenerativeAI:', typeof createGoogleGenerativeAI);
console.log('generateText:', typeof generateText);

export default function TestPage() {
  return <div>Import test successful</div>;
}
