# Component Command

Create a new React component with TypeScript and best practices.

## Usage

Run `component <ComponentName>` to create a new React component.

## Arguments

- `<ComponentName>` - The name of the component in PascalCase (required)

## Details

This command will:
- Create a new component file at `frontend/src/components/<ComponentName>.tsx`
- Add proper TypeScript interfaces for props
- Include 'use client' directive if using client-side features (useState, useEffect, etc.)
- Add JSDoc comments for props
- Use modern React patterns and hooks
- Follow Next.js App Router conventions
- Export the component as default and named export

## Options

Add options after the component name:
- `client` - Add 'use client' directive for client components
- `server` - Create a server component (default, no directive needed)

## Examples

- `component UserCard` - Create a server component
- `component SearchForm client` - Create a client component with 'use client'

## Generated Structure

```tsx
interface Props {
  // props types
}

export default function ComponentName({ prop1, prop2 }: Props) {
  return (
    <div>
      {/* component JSX */}
    </div>
  );
}
```

## Best Practices

- Use server components by default for better performance
- Add 'use client' only when needed (interactive features)
- Define clear TypeScript interfaces for props
- Use functional components with hooks
- Keep components focused and single-purpose
- Add proper accessibility attributes
- Use Tailwind CSS classes for styling
