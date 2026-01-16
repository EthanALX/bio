---
description: Create a new Next.js page
---
1. **Goal**: Create a new route/page in the application.
2. **Prerequisites**:
   - Route path (e.g., `/dashboard/analysis`).
   - Page content/features.
3. **Standards**:
   - Use `vercel-react-best-practices` (Server Components by default for App Router).
   - Use `web-design-guidelines`.
4. **Implementation Steps**:
   - Create folder structure in `frontend/src/app/`.
   - Create `page.tsx`.
   - If loading data, decide between Server Component fetching (preferred) or Client Component (`useEffect`/SWR).
   - Add proper `metadata` export for SEO (Title, Description).
