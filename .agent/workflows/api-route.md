---
description: Create a new API route
---
1. **Goal**: Create a Next.js API route or backend endpoint.
2. **Prerequisites**:
   - Method (GET, POST, etc.).
   - Purpose (e.g., "Fetch user gene expressions").
   - Inputs/Outputs definitions.
3. **Standards**:
   - Use `api-integration-patterns` skill.
   - **Performance**: Avoid waterfalls (`await` loops). Use `Promise.all` where possible.
   - **Security**: Validate inputs (Zod/Yup). Ensure appropriate auth checks.
4. **Implementation Steps**:
   - Create the file in `frontend/src/app/api/...` (App Router) or `pages/api/...` (Pages Router) as per project structure.
   - Implement error handling (return 400/500 with JSON errors).
   - Add JSDoc comments describing the endpoint.
