---
description: Scaffold a new business feature module with the correct directory structure.
---

# Create New Feature Workflow

This workflow sets up a new feature module in `src/features/`.

**Prerequisites**:
- Determine the `FeatureName` (kebab-case, e.g., `user-profile`).

**Steps**:

1. **Create Directories**
   Run the following command (replace `[FeatureName]`):
   ```bash
   mkdir -p src/features/[FeatureName]/{components,hooks,api,types}
   ```
   // turbo-all

2. **Create Entry Points (Optional)**
   - Create `src/features/[FeatureName]/index.ts` to export public components/hooks from this feature.

3. **Next Steps**
   - Use the `create_component` workflow to add components to `src/features/[FeatureName]/components`.
   - Add API definitions to `src/features/[FeatureName]/api`.
