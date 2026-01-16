# API Route Command

Create a new Next.js API route handler with TypeScript and error handling.

## Usage

Run `api-route <route>` to create a new API route handler.

## Arguments

- `<route>` - The API route path (e.g., `users`, `posts/[id]`, `webhooks/github`)

## Details

This command will:
- Create the API route directory structure in `frontend/src/app/api/`
- Generate a `route.ts` file with proper TypeScript
- Add HTTP method handlers (GET, POST, PUT, DELETE)
- Include error handling and validation
- Add proper TypeScript interfaces for request/response
- Follow Next.js API route best practices
- Add CORS handling if needed
- Include request logging

## Examples

- `api-route users` - Creates `frontend/src/app/api/users/route.ts`
- `api-route posts/[id]` - Creates dynamic route `frontend/src/app/api/posts/[id]/route.ts`
- `api-route webhooks/github` - Creates `frontend/src/app/api/webhooks/github/route.ts`

## HTTP Methods

The generated handler includes:
- **GET** - Fetch data
- **POST** - Create data
- **PUT** - Update data
- **DELETE** - Remove data

## Generated Structure

```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Handle GET request
    return NextResponse.json({ data: 'response' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Handle POST request
    return NextResponse.json({ data: 'created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Best Practices

- Use async functions for all handlers
- Validate request data before processing
- Return appropriate HTTP status codes
- Handle errors gracefully with try/catch
- Use TypeScript interfaces for type safety
- Implement authentication and authorization
- Add request/response logging
- Use Next.js caching headers appropriately
- Keep handlers focused and single-purpose
