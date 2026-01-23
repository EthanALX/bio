import { http, HttpResponse } from 'msw'
import activities from './activities.json'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const handlers = [
  // Mock health check
  http.get(`${API_BASE_URL}/`, () => {
    return HttpResponse.json({ Hello: 'World' })
  }),

  // Mock activities endpoint
  http.get(`${API_BASE_URL}/activities`, () => {
    return HttpResponse.json(activities)
  }),

  // Mock activity creation
  http.post(`${API_BASE_URL}/activities`, () => {
    return HttpResponse.json(
      {
        id: '3',
        type: 'swim',
        date: '2024-01-17',
        duration: 60,
        distance: 2,
        calories: 500,
      },
      { status: 201 }
    )
  }),

  // Mock frontend API endpoint (used in integration tests)
  http.get('/api/activities', () => {
    return HttpResponse.json(activities)
  }),

  // Mock error response
  http.get(`${API_BASE_URL}/error`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }),
]