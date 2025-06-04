export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function main(): void {
  console.log(greet("TypeScript"));
  console.log("Welcome to your TypeScript project!");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}