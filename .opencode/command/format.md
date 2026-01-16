# Format Command

Format code with Prettier for consistent code style.

## Usage

Run `format` to format all TypeScript/TSX files with Prettier.

## Details

This command will:
- Run Prettier on all files in `frontend/src/`
- Apply consistent code formatting
- Fix indentation, spacing, and line breaks
- Organize imports and remove unused ones
- Ensure consistent quote style and semicolons

## Context

Prettier configuration includes:
- **Single quotes** for strings
- **Trailing commas** where valid
- **2-space indentation**
- **Arrow function parens** - always include parentheses
- **Print width** - 100 characters

## Prerequisites

Prettier must be installed in the project. If not installed:
```bash
cd frontend
pnpm add -D prettier
```

## What It Formats

- Indentation (2 spaces)
- Spacing around operators and brackets
- Line length (wrap at 100 characters)
- Quote style (single quotes)
- Semicolons (always)
- Object and array formatting
- Import ordering

## Tips

- Run this before committing for consistent style
- Configure `.prettierignore` to exclude files
- Use Prettier with ESLint for best results
- Most IDEs can format on save with Prettier
- Team commits will have consistent formatting
