import { test, expect } from '@playwright/test'

const API_URL = process.env.E2E_API_URL || 'http://127.0.0.1:8000'

test.describe('backend API', () => {
  test.skip(({ isMobile }) => isMobile, 'API checks only need to run once')

  test('health reports a live order book', async ({ request }) => {
    const res = await request.get(`${API_URL}/health`)
    expect(res.status()).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok', orderbook_ready: true })
  })

  test('responses carry correlation and timing headers', async ({ request }) => {
    const res = await request.get(`${API_URL}/`, { headers: { 'X-Request-ID': 'e2e-check-123' } })
    expect(res.headers()['x-request-id']).toBe('e2e-check-123')
    expect(res.headers()['server-timing']).toMatch(/^app;dur=\d/)
  })

  test('authenticated endpoints reject missing or bad tokens', async ({ request }) => {
    expect((await request.post(`${API_URL}/simulate/trade`, { data: { qty_usd: 10 } })).status()).toBe(422)
    const bad = await request.post(`${API_URL}/simulate/trade`, {
      data: { qty_usd: 10 },
      headers: { Authorization: 'Bearer not-a-token' },
    })
    expect(bad.status()).toBe(401)
    expect((await request.get(`${API_URL}/trade-history`, { headers: { Authorization: 'Bearer x' } })).status()).toBe(401)
  })
})
