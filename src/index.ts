export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function main(): void {
  console.log(greet("TypeScript"));
  console.log("Welcome to your TypeScript project!");
  console.log("🚀 This TypeScript code has been compiled and is running!");
  console.log("📅 Built on:", new Date().toISOString());
}

// Run main function if this file is executed directly (Node.js environment)
if (typeof window === 'undefined') {
  main();
}