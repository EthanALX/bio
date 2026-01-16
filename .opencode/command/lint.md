# Lint Command

Run ESLint to check code quality and fix auto-fixable issues.

## Usage

Run `lint` to check code quality with ESLint.

## Details

This command will:
- Run ESLint on all TypeScript/TSX files in `frontend/src/`
- Check for React best practices and common errors
- Apply auto-fixes for issues that can be automatically resolved
- Report remaining issues that need manual fixing
- Exit with error code if critical issues are found

## Context

The ESLint configuration uses:
- **eslint-config-next** - Next.js official ESLint config
- **TypeScript ESLint** - Type-aware linting
- **React Hooks rules** - Catch React Hooks mistakes
- **Accessibility rules** - Ensure code is accessible

## What It Checks

- Unused variables and imports
- Unreachable code
- React component best practices
- TypeScript type safety
- Accessibility issues
- Code style and formatting

## Tips

- Run this before committing changes
- Review and fix non-auto-fixable issues
- Configure `.eslintignore` to exclude specific files
- Use `--max-warnings` flag to control warning behavior
