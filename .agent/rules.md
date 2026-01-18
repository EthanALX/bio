# Project Rules

These rules are strict guidelines for the Visual Bio project. All AI agents and developers must adhere to them.

## 1. Architectural Integrity
- **MVC Pattern**: UI Components (`.tsx`) must NEVER contain business logic or side effects (`useEffect`). All logic must be extracted to a custom hook (`.hook.ts`).
- **Feature-First**: New usages must be grouped by feature in `src/features/`. Do not pollute global `src/components` unless the component is truly generic/atomic.
- **API Layer**: Never use `fetch` or `axios` directly in components. Use the hooks defined in `src/lib/api` or `features/*/api`.

## 2. Coding Standards
- **Strict Types**: No `any`. All props and state must be typed via interfaces.
- **Naming**: 
  - Components: `PascalCase`
  - Hooks: `use` + `PascalCase`
  - Files: Match the primary export.
- **Styles**: Use CSS Modules (`*.module.css`) for component styling to avoid global conflicts.

## 3. Tooling
- **Agent Usage**: When asking the Agent to create code, always refer to the specific workflow (e.g., "Run the create component workflow").
