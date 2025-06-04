# TypeScript Project Boilerplate

A modern TypeScript project setup with essential configurations and tooling.

## Features

- TypeScript 5.x with modern ES2022 target
- ESNext modules with proper module resolution
- Strict type checking enabled
- Source maps for debugging
- Organized project structure

## Project Structure

```
├── src/           # TypeScript source files
├── dist/          # Compiled JavaScript output
├── package.json   # Project dependencies and scripts
├── tsconfig.json  # TypeScript configuration
└── README.md      # Project documentation
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run the compiled application
- `npm run dev` - Run in development mode with ts-node
- `npm run watch` - Run in watch mode with automatic restart

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Development

The main entry point is `src/index.ts`. Add your TypeScript code in the `src/` directory.

## License

MIT