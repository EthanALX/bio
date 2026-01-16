# Type-Check Command

Run TypeScript compiler to check for type errors without emitting output files.

## Usage

Run `type-check` to verify TypeScript types across the entire project.

## Details

This command will:
- Run TypeScript compiler in check-only mode (`--noEmit`)
- Verify all type annotations are correct
- Check for type mismatches and errors
- Report all type errors found
- Validate type definitions and interfaces

## Context

TypeScript configuration includes:
- **Strict mode enabled** - Catch type errors early
- **Path aliases** - `@/*` mapped to `./src/*`
- **Target ES2017** - Modern JavaScript features
- **React JSX** - JSX transform configured

## What It Checks

- Type mismatches in function arguments and return values
- Missing properties on objects
- Incorrect use of optional chaining
- Type inference issues
- Interface and type definition correctness
- Generic type parameter constraints

## Tips

- Run this before committing to ensure type safety
- Fix all type errors before building for production
- Use strict types for better code quality
- Leverage TypeScript for better IDE support and refactoring
- Add type annotations when TypeScript can't infer types
