# Visual Bio Backend API

A production-ready FastAPI backend for fitness activity tracking with user authentication, activity management, and statistical analysis.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Activity Management**: Full CRUD operations for fitness activities
- **Route Tracking**: Support for GPS coordinates and route visualization
- **Statistical Analysis**: Activity stats, yearly breakdowns, and performance metrics
- **Database Support**: SQLite for development, PostgreSQL for production
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Type Safety**: Full Pydantic validation and SQLAlchemy models

## Quick Start

### 1. Installation

```bash
# Clone and install dependencies
cd backend
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env

# Run database migrations
alembic upgrade head
```

### 2. Start the Server

```bash
# Development server with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Access Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication (`/api/v1/auth`)

#### `POST /api/v1/auth/login`
Authenticate user and get access token.

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### Users (`/api/v1/users`)

#### `POST /api/v1/users/`
Create a new user account.

```json
{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "secure_password"
}
```

#### `GET /api/v1/users/me`
Get current user profile (requires authentication).

#### `PUT /api/v1/users/me`
Update current user profile (requires authentication).

### Activities (`/api/v1/activities`)

#### `POST /api/v1/activities/`
Create a new activity (requires authentication).

```json
{
  "date": "2024-01-15T10:00:00",
  "distance": 5.0,
  "pace": "5'20\"/km",
  "bpm": 150,
  "time": "26m 40s",
  "route": "Morning Run",
  "activity_type": "run",
  "coordinates": [
    {"lat": 40.7128, "lng": -74.0060},
    {"lat": 40.7138, "lng": -74.0050}
  ]
}
```

#### `GET /api/v1/activities/`
Get user activities with optional filtering (requires authentication).

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records (default: 100)
- `year`: Filter by year
- `month`: Filter by month (1-12)
- `activity_type`: Filter by activity type (`run`, `workout`, `cycling`)

#### `GET /api/v1/activities/{activity_id}`
Get a specific activity (requires authentication).

#### `PUT /api/v1/activities/{activity_id}`
Update an activity (requires authentication).

#### `DELETE /api/v1/activities/{activity_id}`
Delete an activity (requires authentication).

### Statistics (`/api/v1/activities/stats`)

#### `GET /api/v1/activities/stats/overview`
Get activity statistics for current user.

**Response:**
```json
{
  "Distance": 125.5,
  "Days": 45,
  "AvgPace": "5'15\"/km",
  "Routes": 12
}
```

#### `GET /api/v1/activities/stats/yearly`
Get yearly statistics with activities grouped by year.

**Response:**
```json
[
  {
    "year": 2024,
    "stats": {
      "Distance": 85.2,
      "Days": 30,
      "AvgPace": "5'18\"/km",
      "Routes": 8
    },
    "activities": [...]
  }
]
```

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `username`: Unique username
- `hashed_password`: Secure password hash
- `full_name`: User's full name
- `is_active`: Account status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Activities Table
- `id`: Primary key
- `user_id`: Foreign key to users table
- `date`: Activity datetime
- `distance`: Distance in kilometers
- `pace`: Pace string (e.g., "5'20\"/km")
- `bpm`: Average heart rate
- `time`: Duration string
- `route`: Route name
- `activity_type`: Enum (run, workout, cycling)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Activity Routes Table
- `id`: Primary key
- `activity_id`: Foreign key to activities table
- `latitude`: GPS latitude
- `longitude`: GPS longitude
- `elevation`: Elevation in meters
- `timestamp`: Coordinate timestamp
- `order_index`: Order for sequence

## Configuration

### Environment Variables

- `DATABASE_URL`: SQLite database URL (default: sqlite:///./visual_bio.db)
- `POSTGRES_URL`: PostgreSQL connection URL (for production)
- `SECRET_KEY`: JWT secret key (change in production)
- `API_V1_STR`: API version prefix (default: /api/v1)
- `DEBUG`: Debug mode (default: true)

### Database Setup

#### Development (SQLite)
```bash
# SQLite is configured by default
alembic upgrade head
```

#### Production (PostgreSQL)
```bash
# Set POSTGRES_URL in .env
POSTGRES_URL=postgresql://username:password@localhost:5432/visual_bio

# Run migrations
alembic upgrade head
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Send credentials to `/api/v1/auth/login`
2. **Receive Token**: Get JWT access token in response
3. **Include Token**: Add `Authorization: Bearer <token>` header to protected requests
4. **Token Expiration**: Tokens expire after 30 minutes (configurable)

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "detail": "Error description"
}
```

## Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_activities.py -v
```

## Development

### Database Migrations

Create new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

### API Versioning

The API uses versioned URLs (`/api/v1/`). To add a new version:

1. Create new routers in `routers/v2/`
2. Update main.py to include the new version
3. Maintain backward compatibility

## Production Deployment

### Security Checklist

- [ ] Change `SECRET_KEY` to a secure random value
- [ ] Set `DEBUG=false`
- [ ] Use HTTPS (TLS/SSL)
- [ ] Configure proper CORS origins
- [ ] Set up database connection pooling
- [ ] Configure logging and monitoring
- [ ] Set up rate limiting
- [ ] Use environment variables for secrets

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN alembic upgrade head

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Frontend Integration

The backend is designed to work seamlessly with the Visual Bio frontend. The TypeScript interfaces in `frontend/src/features/activity-dashboard/types/index.ts` match the backend schemas:

```typescript
export interface Activity {
    id: string;
    date: string; // ISO date string
    distance: number; // in km
    pace: string; // e.g., "5'20\"/km"
    bpm: number; // heart rate
    time: string; // duration, e.g., "1h 23m"
    route: string; // route name
    type: 'run' | 'workout' | 'cycling'; // activity type
    coordinates?: Array<{ lat: number; lng: number }>; // for map visualization
}
```

This ensures type-safe communication between frontend and backend.