# Dev Command

Start the Next.js development server with hot module replacement.

## Usage

Run `dev` to start the development server.

## Details

This command will:
- Start the Next.js development server on http://localhost:3000
- Enable hot module replacement for instant updates
- Watch for file changes in the `frontend/src/` directory
- Display compilation errors and warnings in real-time
- Support TypeScript and ES6+ features

## Context

The development server uses:
- **Next.js 16.1.2** with App Router
- **React 19.2.3** with TypeScript
- **Tailwind CSS** for styling
- **pnpm** as the package manager

The server runs by default on port 3000. You can customize this by setting the PORT environment variable.
