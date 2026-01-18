---
description: Create a new React component following the strict MVC architecture (View, Logic, Styles, Export).
---

# Create New Component Workflow

This workflow automates the creation of a new React component that adheres to the project's architecture.

**Prerequisites**:
- Determine the `ComponentName` (PascalCase).
- Determine the `ParentDirectory` (e.g., `src/components/ui` or `src/features/auth/components`).

**Steps**:

1. **Create Directory**
   Create a directory named `[ComponentName]` inside `[ParentDirectory]`.

2. **Create Style File**
   Create `[ParentDirectory]/[ComponentName]/[ComponentName].module.css`.
   - Content: Empty or basic container class.

3. **Create Logic Hook**
   Create `[ParentDirectory]/[ComponentName]/[ComponentName].hook.ts`.
   - Content:
     ```typescript
     import { useState } from 'react';

     export const use[ComponentName] = () => {
         // State and Logic here
         return {};
     };
     ```

4. **Create View Component**
   Create `[ParentDirectory]/[ComponentName]/[ComponentName].tsx`.
   - Content:
     ```tsx
     import React from 'react';
     import styles from './[ComponentName].module.css';
     import { use[ComponentName] } from './[ComponentName].hook';

     export const [ComponentName]: React.FC = () => {
         const logic = use[ComponentName]();

         return (
             <div className={styles.container}>
                 [ComponentName] Component
             </div>
         );
     };
     ```

5. **Create Index Export**
   Create `[ParentDirectory]/[ComponentName]/index.ts`.
   - Content:
     ```typescript
     export * from './[ComponentName]';
     ```

6. **Verify**
   Ensure all 4 files exist and strictly follow the naming conventions.
