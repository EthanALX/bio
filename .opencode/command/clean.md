# Clean Command

Clean all build artifacts and dependencies.

## Usage

Run `clean` to remove build artifacts and optionally reinstall dependencies.

## Details

This command will:
- Remove the `.next/` build directory
- Clear Next.js cache
- Optionally remove `node_modules/`
- Optionally reinstall all dependencies

## Options

This command accepts arguments:
- `clean deps` - Also remove node_modules and reinstall dependencies

## Use Cases

Use `clean` when:
- Build artifacts are corrupted or outdated
- Strange build errors occur
- Need to clear Next.js cache
- Starting fresh after major dependency changes
- Reducing disk space by removing build artifacts
- Fixing module resolution issues

## Notes

After cleaning:
- Run `pnpm install` to reinstall dependencies (if removed)
- Run `build` to create a fresh production build
- Run `dev` to restart the development server
