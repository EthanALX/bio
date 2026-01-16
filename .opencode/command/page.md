# Page Command

Create a new Next.js App Router page with layout.

## Usage

Run `page <route>` to create a new page in the Next.js App Router.

## Arguments

- `<route>` - The route path (e.g., `about`, `blog/[slug]`, `admin/dashboard`)

## Details

This command will:
- Create the page directory structure in `frontend/src/app/`
- Generate a `page.tsx` file with proper TypeScript
- Create a `layout.tsx` file for route-specific layouts
- Add proper metadata for SEO
- Use server components by default (no 'use client' directive)
- Follow Next.js App Router conventions

## Examples

- `page about` - Creates `frontend/src/app/about/page.tsx`
- `page blog/[slug]` - Creates dynamic route `frontend/src/app/blog/[slug]/page.tsx`
- `page admin/dashboard` - Creates nested route `frontend/src/app/admin/dashboard/page.tsx`

## Dynamic Routes

Use square brackets `[param]` for dynamic route segments:
- `blog/[slug]` - Matches `/blog/my-post`
- `users/[id]/profile` - Matches `/users/123/profile`

## Generated Structure

```
app/
  <route>/
    layout.tsx      # Route-specific layout
    page.tsx        # Page component
```

## Page Component

```tsx
export const metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
};

export default function Page() {
  return (
    <div>
      {/* page content */}
    </div>
  );
}
```

## Best Practices

- Use server components by default for performance
- Define metadata for SEO
- Keep pages focused on their content
- Use layouts for shared UI elements
- Leverage data fetching patterns (fetch, async/await)
- Handle loading and error states appropriately
