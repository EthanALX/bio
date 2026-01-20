// MSW setup temporarily disabled to fix basic testing
// TODO: Fix MSW polyfills and re-enable
// import { beforeAll, afterAll, afterEach } from '@jest/globals'
// import { server } from '../src/mocks/server'

// Setup MSW server for API mocking
// beforeAll(() => {
//   server.listen({
//     onUnhandledRequest: 'error',
//   })
// })

// Reset request handlers after each test
// afterEach(() => {
//   server.resetHandlers()
// })

// Close server after all tests are complete
// afterAll(() => {
//   server.close()
// })