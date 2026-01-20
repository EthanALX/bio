import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from Testing Library
export * from '@testing-library/react'
export { customRender as render, userEvent }

// Mock data generators
export const createMockActivity = (overrides = {}) => ({
  id: '1',
  type: 'run',
  date: '2024-01-15',
  duration: 30,
  distance: 5,
  ...overrides,
})

export const createMockActivities = (count: number) => 
  Array.from({ length: count }, (_, i) => createMockActivity({ id: `${i + 1}` }))

// Test helpers
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

export const createMockRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
})