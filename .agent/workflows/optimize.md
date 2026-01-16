---
description: Optimize application performance
---
1. **Goal**: Improve the speed/efficiency of a component or page.
2. **Strategy**:
   - **Identify Bottleck**: Is it rendering (Client) or fetching (Server)?
   - **Consult Skill**: Read `vercel-react-best-practices` specifically for the issue type (Waterfalls, Bundle Size, Re-renders).
3. **Actions**:
   - **Server**: Parallelize fetches, use Cache.
   - **Client**: Memoize heavy computations, use `next/image` for images, lazy load components (`next/dynamic`).
   - **Bundle**: Import specific components instead of full libraries (e.g., `lodash`).
4. **Verification**:
   - Verify that the functionality remains unchanged after optimization.
