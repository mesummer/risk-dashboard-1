export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function main(): void {
  console.log(greet("TypeScript"));
  console.log("Welcome to your TypeScript project!");
}

// Run main function if this file is executed directly
main();