# Hook Command

Create a new custom React hook with TypeScript.

## Usage

Run `hook <hookName>` to create a new custom React hook.

## Arguments

- `<hookName>` - The name of the hook in camelCase starting with 'use' (required)

## Details

This command will:
- Create a new hook file at `frontend/src/hooks/use<HookName>.ts`
- Add proper TypeScript interfaces for parameters and return values
- Include JSDoc comments for documentation
- Follow React hooks rules and conventions
- Add proper type definitions
- Include examples in comments
- Handle loading and error states if applicable

## Examples

- `hook useApi` - Creates `frontend/src/hooks/useApi.ts`
- `hook useLocalStorage` - Creates `frontend/src/hooks/useLocalStorage.ts`
- `hook useDebounce` - Creates `frontend/src/hooks/useDebounce.ts`

## Hook Naming

- Must start with 'use' (e.g., `useApi`, `useLocalStorage`)
- Use camelCase for the rest of the name
- File name should match hook name

## Generated Structure

```ts
import { useState, useEffect } from 'react';

interface UseHookParams {
  // parameters
}

interface UseHookReturn {
  // return types
}

export function useHook(params: UseHookParams): UseHookReturn {
  const [state, setState] = useState<ReturnType>();

  useEffect(() => {
    // side effect logic
  }, [dependencies]);

  return {
    // return values
  };
}
```

## Hook Rules

- Only call hooks at the top level
- Don't call hooks inside loops or conditions
- Only call hooks from React functions
- Always return consistent shape
- Clean up side effects in useEffect cleanup

## Best Practices

- Keep hooks focused and reusable
- Use TypeScript for type safety
- Document the hook's purpose and usage
- Handle loading and error states
- Clean up side effects properly
- Return stable values (useMemo, useCallback)
- Test hooks thoroughly
- Follow naming conventions
