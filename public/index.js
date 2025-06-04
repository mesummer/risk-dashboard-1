function greet(name) {
  return `Hello, ${name}!`;
}

function main() {
  console.log(greet("TypeScript"));
  console.log("Welcome to your TypeScript project!");
  console.log("🚀 This TypeScript code has been compiled and is running!");
  console.log("📅 Built on:", new Date().toISOString());
}

// Run main function if this file is executed directly (Node.js environment)
if (typeof window === 'undefined') {
  main();
}
// Export functions for browser use
window.greet = greet;
window.main = main;
