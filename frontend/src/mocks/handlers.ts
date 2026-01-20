import { rest } from 'msw'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const handlers = [
  // Mock health check
  rest.get(`${API_BASE_URL}/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ Hello: 'World' })
    )
  }),

  // Mock activities endpoint
  rest.get(`${API_BASE_URL}/activities`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          type: 'run',
          date: '2024-01-15',
          duration: 30,
          distance: 5,
          calories: 300,
        },
        {
          id: '2',
          type: 'cycle',
          date: '2024-01-16',
          duration: 45,
          distance: 15,
          calories: 400,
        },
      ])
    )
  }),

  // Mock activity creation
  rest.post(`${API_BASE_URL}/activities`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '3',
        type: 'swim',
        date: '2024-01-17',
        duration: 60,
        distance: 2,
        calories: 500,
      })
    )
  }),

  // Mock frontend API endpoint (used in integration tests)
  rest.get('/api/activities', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          type: 'run',
          date: '2024-01-15',
          duration: 30,
          distance: 5,
          calories: 300,
        },
        {
          id: '2',
          type: 'cycle',
          date: '2024-01-16',
          duration: 45,
          distance: 15,
          calories: 400,
        },
      ])
    )
  }),

  // Mock error response
  rest.get(`${API_BASE_URL}/error`, (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal Server Error' })
    )
  }),
]