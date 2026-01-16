# Optimize Command

Analyze and suggest performance optimizations for the codebase.

## Usage

Run `optimize [file-path]` to analyze code and suggest optimizations.

## Arguments

- `[file-path]` - Optional path to specific file or directory to optimize
  - If omitted, analyzes all files in `frontend/src/`

## Details

This command will:
- Use the Vercel React best practices skill
- Analyze code for performance bottlenecks
- Identify optimization opportunities by category
- Prioritize optimizations by impact
- Provide actionable suggestions with code examples
- Consider both client and server-side performance
- Analyze bundle size implications
- Check for common anti-patterns

## Optimization Priorities

### Priority 1: Eliminating Waterfalls (HIGHEST IMPACT)

Waterfalls cause sequential loading and severely impact performance:
- **Sequential async/await** - Chains requests instead of parallelizing
- **Blocking operations** - Waits for data before rendering content
- **Client-side data fetching** - Fetches data on client instead of server

Example fix:
```ts
// Bad - Waterfall
const user = await fetchUser();
const posts = await fetchUserPosts(user.id);

// Good - Parallel
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchUserPosts(), // Start early
]);
```

### Priority 2: Bundle Size Optimization (HIGHEST IMPACT)

Large bundles slow down initial page load:
- **Barrel imports** - Import from index files that re-export everything
- **Heavy components** - Large components loaded when not needed
- **Third-party libraries** - Loading entire libraries for small features
- **Unused code** - Tree shaking not working properly

Example fix:
```tsx
// Bad - Barrel import
import { Button } from '@/components/ui';

// Good - Direct import
import Button from '@/components/ui/Button';

// Bad - Static import
import { Chart } from 'recharts';

// Good - Dynamic import
const Chart = dynamic(() => import('recharts').then(m => m.Chart), {
  ssr: false,
  loading: () => <Skeleton />,
});
```

### Priority 3: Server-Side Performance (HIGH IMPACT)

Inefficient server rendering hurts TTFB:
- **Repeated fetches** - Same data fetched multiple times in request
- **Over-serialization** - Passing too much data to client components
- **Sequential operations** - Not parallelizing independent server work

Example fix:
```tsx
// Bad - Repeated fetch
function User({ id }: { id: string }) {
  const user = fetchUser(id);
  return <UserCard user={user} />;
}
function UserPage({ id }: { id: string }) {
  const user = fetchUser(id); // Duplicate fetch
  return <User id={id} />;
}

// Good - Deduplicated with React.cache
const fetchUser = React.cache((id: string) => fetch(`/api/users/${id}`).then(r => r.json()));
```

### Priority 4: Re-render Optimization (MEDIUM IMPACT)

Unnecessary re-renders waste CPU:
- **Expensive computations** - Running on every render
- **Derived state** - Subscribing to raw values instead of derived
- **State used only in callbacks** - Causing re-renders when changed

Example fix:
```tsx
// Bad - Expensive computation on every render
function List({ items }: { items: Item[] }) {
  const filtered = items.filter(item => item.active);
  const sorted = filtered.sort((a, b) => a.date - b.date);
  return sorted.map(item => <Item key={item.id} item={item} />);
}

// Good - Memoized computation
function List({ items }: { items: Item[] }) {
  const sortedItems = useMemo(
    () => items.filter(item => item.active).sort((a, b) => a.date - b.date),
    [items]
  );
  return sortedItems.map(item => <Item key={item.id} item={item} />);
}
```

## Analysis Approach

1. **Scan codebase** - Identify files with potential issues
2. **Categorize issues** - Group by optimization category
3. **Prioritize** - Sort by impact and ease of implementation
4. **Provide examples** - Show before/after code for each suggestion
5. **Estimate impact** - Give rough estimate of performance improvement

## Output Format

Optimizations will be presented as:

### [Category] [Issue Name] - Priority: HIGH

**Problem:** [Description of the performance issue]

**Impact:** [Explanation of performance impact]

**Location:** `frontend/src/file.ts:line`

**Fix:**
```ts
// Before
[code with issue]

// After
[optimized code]
```

**Expected Improvement:** [Estimated performance gain]

## Best Practices

- Focus on Priority 1 and 2 first (waterfalls and bundle size)
- Measure actual performance before and after changes
- Use Lighthouse to validate improvements
- Consider trade-offs between performance and maintainability
- Run optimize regularly to catch regressions
- Document why certain optimizations were made
