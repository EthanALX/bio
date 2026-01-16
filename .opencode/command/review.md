# Review Command

Review code using Vercel React best practices and Next.js guidelines.

## Usage

Run `review [file-path]` to review code for best practices.

## Arguments

- `[file-path]` - Optional path to specific file or directory to review
  - If omitted, reviews all files in `frontend/src/`

## Details

This command will:
- Load the Vercel React best practices skill
- Analyze code against 45 optimization rules
- Check for async/await patterns and waterfall issues
- Review bundle size and dynamic imports
- Examine server-side performance patterns
- Evaluate re-render optimization opportunities
- Check rendering performance issues
- Review JavaScript performance patterns
- Identify advanced pattern opportunities

## Review Categories

### 1. Eliminating Waterfalls (CRITICAL)
- Defer await to branches where actually used
- Use Promise.all() for independent operations
- Use better-all for partial dependencies
- Start promises early, await late in API routes
- Use Suspense to stream content

### 2. Bundle Size Optimization (CRITICAL)
- Import directly, avoid barrel files
- Use next/dynamic for heavy components
- Load analytics/logging after hydration
- Load modules only when feature is activated
- Preload on hover/focus for perceived speed

### 3. Server-Side Performance (HIGH)
- Use React.cache() for per-request deduplication
- Use LRU cache for cross-request caching
- Minimize data passed to client components
- Restructure components to parallelize fetches
- Use after() for non-blocking operations

### 4. Client-Side Data Fetching (MEDIUM-HIGH)
- Use SWR for automatic request deduplication
- Deduplicate global event listeners

### 5. Re-render Optimization (MEDIUM)
- Don't subscribe to state only used in callbacks
- Extract expensive work into memoized components
- Use primitive dependencies in effects
- Subscribe to derived booleans, not raw values
- Use functional setState for stable callbacks
- Pass function to useState for expensive values
- Use startTransition for non-urgent updates

### 6. Rendering Performance (MEDIUM)
- Animate div wrapper, not SVG element
- Use content-visibility for long lists
- Extract static JSX outside components
- Reduce SVG coordinate precision
- Use inline script for client-only data
- Use Activity component for show/hide
- Use ternary, not && for conditionals

### 7. JavaScript Performance (LOW-MEDIUM)
- Group CSS changes via classes or cssText
- Build Map for repeated lookups
- Cache object properties in loops
- Cache function results in module-level Map
- Cache localStorage/sessionStorage reads
- Combine multiple filter/map into one loop
- Check array length before expensive comparison
- Return early from functions
- Hoist RegExp creation outside loops
- Use loop for min/max instead of sort
- Use Set/Map for O(1) lookups
- Use toSorted() for immutability

### 8. Advanced Patterns (LOW)
- Store event handlers in refs
- Use useLatest for stable callback refs

## Output

The review will:
- List found issues by category and priority
- Show before/after code examples
- Provide explanations for each issue
- Suggest specific fixes
- Reference detailed rule documentation

## Best Practices

- Run review before merging PRs
- Focus on CRITICAL and HIGH priority issues first
- Address waterfall issues as they have big impact
- Optimize bundle size for faster initial load
- Review regularly to catch issues early
- Consider performance vs maintainability trade-offs
