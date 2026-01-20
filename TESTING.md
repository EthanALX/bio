# Visual Bio Testing Framework

This document outlines the comprehensive testing framework set up for the Visual Bio project.

## Frontend Testing

### Setup
- **Test Runner**: Jest with Next.js configuration
- **Testing Library**: React Testing Library for component testing
- **User Interactions**: Testing Library User Event
- **Environment**: jsdom with Next.js polyfills

### Commands
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### File Structure
```
frontend/
├── src/
│   ├── __tests__/          # Test files
│   ├── test-utils.tsx      # Custom test utilities
│   ├── mocks/             # API mocks (MSW)
│   └── setupTests.ts      # Test setup
├── jest.config.js         # Jest configuration
└── jest.setup.js         # Jest environment setup
```

### Writing Tests

#### Component Tests
```typescript
import { render, screen, userEvent } from '../test-utils'
import Counter from '../Counter'

describe('Counter', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
})
```

#### Test Utilities
- `render()`: Custom render with providers
- `userEvent`: User interaction simulation
- `createMockActivity()`: Generate mock data
- `waitForLoadingToFinish()`: Async test helper

### Configuration
- **Coverage Threshold**: 70% across all metrics
- **Path Aliases**: `@/*` mapped to `src/*`
- **Environment**: `.env.test` for test-specific variables

## Backend Testing

### Setup
- **Test Runner**: pytest with async support
- **HTTP Testing**: TestClient from FastAPI
- **Database**: SQLite in-memory for testing
- **Coverage**: pytest-cov with HTML reports

### Commands
```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_main.py
```

### File Structure
```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py         # Test configuration and fixtures
│   ├── fixtures/           # Test data fixtures
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   ├── test_main.py       # Main application tests
│   └── test_activities.py # API endpoint tests
├── pytest.ini            # pytest configuration
└── .env.test             # Test environment variables
```

### Writing Tests

#### API Endpoint Tests
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    activities = response.json()
    assert isinstance(activities, list)
```

#### Test Fixtures
- `test_client()`: FastAPI test client
- `sample_activity()`: Sample activity data
- `sample_activities()`: Multiple sample activities

### Configuration
- **Coverage Threshold**: 70%
- **Test Database**: SQLite in-memory
- **Async Support**: pytest-asyncio enabled
- **Environment Variables**: Loaded from `.env.test`

## Integration Testing

### API Mocking (MSW)
- **Handlers**: Defined in `src/mocks/handlers.ts`
- **Server**: Configured in `src/mocks/server.ts`
- **Setup**: Global test setup in `src/setupTests.ts`

### Mock Data
- Activities endpoints mocked
- Error scenarios covered
- Realistic data structure

## Best Practices

### Frontend
1. Test user behavior, not implementation details
2. Use semantic queries (`getByRole`, `getByLabelText`)
3. Mock external dependencies
4. Test loading and error states
5. Keep tests focused and maintainable

### Backend
1. Test happy path and error conditions
2. Use descriptive test names
3. Separate unit and integration tests
4. Mock external services
5. Validate response schemas

## Running Tests

### Full Test Suite
```bash
# Frontend
cd frontend && pnpm test:coverage

# Backend  
cd backend && pytest --cov=main --cov-report=html
```

### Continuous Integration
- Frontend: Jest with coverage reporting
- Backend: pytest with HTML coverage reports
- Both configured to fail on coverage threshold drop

## Next Steps

### Frontend
- [ ] Fix MSW polyfills for Node.js environment
- [ ] Add integration tests with API mocking
- [ ] Set up visual regression testing
- [ ] Add E2E tests with Playwright

### Backend
- [ ] Add database integration tests
- [ ] Set up contract testing
- [ ] Add performance tests
- [ ] Configure test data cleanup

## Troubleshooting

### Common Issues

1. **MSW Response not defined**: Ensure `whatwg-fetch` is imported
2. **TextEncoder not defined**: Add polyfill in Jest setup
3. **Import errors**: Check Python path in backend tests
4. **Coverage not working**: Verify source paths in configuration

### Debug Tips

- Use `--verbose` flag for detailed output
- Run specific tests to isolate issues
- Check test environment variables
- Verify mock server status for integration tests