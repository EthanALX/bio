# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visual Bio is a full-stack fitness activity tracking application with a React/Next.js frontend and FastAPI backend. The app tracks running, cycling, and workout activities with GPS route visualization and statistical analysis.

**Tech Stack:**
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, D3.js (for charts/treemaps/sunbursts), pnpm
- **Backend**: FastAPI, SQLAlchemy, Pydantic, PostgreSQL/SQLite, Alembic (migrations)
- **Testing**: Jest + React Testing Library (frontend), pytest + pytest-cov (backend)

## Repository Structure

```
visual-bio/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/ # Shared UI components
│   │   └── features/  # Feature-based modules
│   │       ├── activity-dashboard/  # Main activity tracking feature
│   │       ├── about/               # About page
│   │       └── component-showcase/  # UI component demos
│   ├── package.json
│   ├── jest.config.js
│   └── next.config.js
└── backend/           # FastAPI application
    ├── routers/      # API route handlers (auth, users, activities)
    ├── models/       # SQLAlchemy ORM models
    ├── schemas/      # Pydantic validation schemas
    ├── alembic/      # Database migrations
    ├── tests/        # pytest test suite
    └── main.py       # Application entry point
```

## Development Commands

### Frontend (from `frontend/` directory)

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server (auto-reload)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint

# Code formatting
pnpm format

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Backend (from `backend/` directory)

```bash
# Create virtual environment (first time only)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Development server with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn main:app --host 0.0.0.0 --port 8000

# Database migrations
alembic upgrade head              # Apply migrations
alembic revision --autogenerate -m "description"  # Create migration

# Run tests
pytest                            # All tests
pytest tests/test_activities.py -v  # Specific test file
pytest --cov=.                    # With coverage
```

## Architecture & Key Patterns

### Frontend Architecture

**Feature-Based Organization**: The `src/features/` directory contains self-contained modules with their own components, hooks, API clients, types, and utils. Each feature is organized as:
- `components/` - Feature-specific UI components
- `hooks/` - Custom React hooks for the feature
- `api/` - API client functions for backend communication
- `types/` - TypeScript interfaces matching backend schemas
- `utils/` - Feature-specific utility functions

**Type Safety**: Frontend TypeScript interfaces in `features/*/types/` must match backend Pydantic schemas. The backend documentation at `backend/README.md` shows the expected data structure.

**D3.js Visualization**: The app uses D3.js for interactive data visualization:
- D3 treemap and sunburst charts with animations
- Drill-down capabilities for hierarchical data
- Used in `activity-dashboard` for yearly activity breakdowns

**Path Aliases**: Use `@/` prefix for imports from the `src/` directory (configured in `tsconfig.json`).

### Backend Architecture

**Router Organization**: API endpoints are organized by domain in `routers/`:
- `auth.py` - Authentication endpoints (login, token management)
- `users.py` - User profile management
- `activities.py` - Activity CRUD and statistics

**Versioned API**: All endpoints use `/api/v1/` prefix (configurable via `API_V1_STR` in `config.py`).

**Database Layer**:
- SQLAlchemy ORM models in `models/` define database tables
- Pydantic schemas in `schemas/` validate request/response data
- Alembic handles database migrations
- Supports SQLite (development) and PostgreSQL (production)

**Authentication**: JWT-based authentication with bcrypt password hashing. Protected routes require `Authorization: Bearer <token>` header.

### CORS Configuration

Backend CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:5173`

Update the `CORSMiddleware` configuration in `backend/main.py` when adding new frontend origins.

## Testing

### Frontend Testing (Jest + React Testing Library)

- Configuration: `frontend/jest.config.js`
- Test utilities: `src/test-utils.tsx`
- Coverage threshold: 70% for branches, functions, lines, statements
- Tests should be co-located with components or in `__tests__` directories

### Backend Testing (pytest)

- Configuration: `backend/pytest.ini`
- Coverage requirement: 70% (`--cov-fail-under=70`)
- Test files: `tests/test_*.py`
- Use fixtures for database and test client setup
- Async tests use `pytest-asyncio` with auto mode

## Code Style

**Frontend**:
- Prettier for code formatting (`pnpm format`)
- ESLint for linting (`pnpm lint`)
- TypeScript strict mode enabled
- Use functional components with hooks

**Backend**:
- Black for code formatting
- isort for import sorting
- flake8 for linting
- Type hints required for all functions

## Environment Setup

Both frontend and backend use environment files (`.env`) for configuration:

**Backend `.env`** (copy from `backend/.env.example`):
```
DATABASE_URL=sqlite:///./visual_bio.db
SECRET_KEY=your-secret-key-change-in-production
DEBUG=true
```

**Frontend**: Uses Next.js built-in environment variable support. Create `.env.local` for development.

## Important Files

- `backend/README.md` - Comprehensive backend API documentation with endpoint examples
- `frontend/src/features/activity-dashboard/types/index.ts` - Core data types matching backend schemas
- `backend/config.py` - Backend configuration and settings
- `frontend/jest.config.js` - Frontend test configuration
- `backend/pytest.ini` - Backend test configuration

## Development Workflow

1. Start backend server: `cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000`
2. Start frontend server: `cd frontend && pnpm dev`
3. Frontend runs on `http://localhost:3000`, backend on `http://localhost:8000`
4. API documentation available at `http://localhost:8000/docs` (Swagger UI)
5. Run tests before committing: `pnpm test` (frontend) and `pytest` (backend)
6. Type check frontend: `pnpm type-check`
