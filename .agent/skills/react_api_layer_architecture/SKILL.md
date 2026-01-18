---
name: React API Layer Architecture
description: Standards for Data Fetching, API integration, and Asynchronous State Management.
---

# React API Layer Architecture

A consistent API layer is crucial for preventing "spaghetti code" in asynchronous logic. This document outlines the standards for handling data fetching in this project.

## 1. Core Principles

1.  **Centralized Configuration**: Never call `fetch` or `axios.get` directly in a component. Always use the configured HTTP client.
2.  **Typed Responses**: Every API call must return a typed response (or Zod schema validated data).
3.  **Hooks for Data Access**: Components (or their ViewModels) consume *Hooks* (`useGetUser`), not Promises (`api.getUser()`).
4.  **Error Normalization**: Errors should be caught and formatted in the global interceptor before reaching the UI layer.

## 2. Directory Structure

```
src/
├── lib/
│   └── apiClient.ts      # Axios/Fetch instance with interceptors
├── features/
│   └── [feature]/
│       └── api/
│           ├── endpoints.ts  # Raw API call functions (returns Promise<T>)
│           ├── queries.ts    # React Query "read" hooks
│           └── mutations.ts  # React Query "write" hooks
```

## 3. The Three Layers of Data Fetching

### Layer 1: The HTTP Client (`lib/apiClient.ts`)
This is the single source of truth for base URLs, timeouts, and auth headers.

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Global Error Handling (e.g., redirect on 401)
    return Promise.reject(error);
  }
);
```

### Layer 2: The Service Functions (`api/endpoints.ts`)
Raw functions that return Promises. No React logic here.

```typescript
import { apiClient } from '@/lib/apiClient';
import { User } from '../types';

export const fetchUser = (id: string): Promise<User> => {
  return apiClient.get(`/users/${id}`);
};

export const updateUser = (id: string, data: Partial<User>): Promise<User> => {
  return apiClient.put(`/users/${id}`, data);
};
```

### Layer 3: The Data Hooks (`api/queries.ts` / `mutations.ts`)
Wrappers around libraries like React Query (TanStack Query) or SWR.

```typescript
// queries.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from './endpoints';

export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id, // Dependent query pattern
  });
};

// mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from './endpoints';

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }) => updateUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['user', variables.id]);
        }
    });
};
```

## 4. Usage in Components

The Component Logic Layer (`MyComponent.hook.ts`) integrates these hooks patterns.

```typescript
// MyComponent.hook.ts
import { useUserQuery } from '../../api/queries';
import { useUpdateUserMutation } from '../../api/mutations';

export const useMyComponent = (userId: string) => {
    const { data: user, isLoading } = useUserQuery(userId);
    const { mutate, isLoading: isSaving } = useUpdateUserMutation();

    const handleSave = (newName: string) => {
        if (user) {
           mutate({ id: user.id, data: { name: newName } }); 
        }
    };

    return { user, isLoading, isSaving, handleSave };
};
```

## 5. Error Handling Standards

*   **UI Handling**: use the `isError` and `error` flags from hooks to show feedback.
*   **Global Handling**: 500 errors or 401/403 should be handled in the Axios interceptor (e.g., trigger a toast or logout).
