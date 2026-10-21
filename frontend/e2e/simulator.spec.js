import { test, expect } from '@playwright/test'

test('live order book and prediction stream in, and sockets close when leaving', async ({ page }) => {
  const sockets = new Map()
  page.on('websocket', (ws) => {
    sockets.set(ws.url(), 'open')
    ws.on('close', () => sockets.set(ws.url(), 'closed'))
  })

  await page.goto('/sim')
  await expect(page.locator('.ag-row').first()).toBeVisible()

  const bestBid = Number(await page.locator('.ag-row .ag-cell').first().textContent())
  const prediction = page.getByText('60 sec').locator('xpath=following-sibling::div')
  await expect(prediction).toHaveText(/\d/)
  const predicted = Number((await prediction.textContent()).replaceAll(',', ''))
  // The model predicts a small relative move, so it must stay near the live price
  expect(Math.abs(predicted - bestBid) / bestBid).toBeLessThan(0.01)

  expect([...sockets.values()]).toEqual(['open', 'open'])
  // Navigate in-app (as users do) rather than reloading the page
  await page.evaluate(() => {
    history.pushState({}, '', '/about')
    dispatchEvent(new PopStateEvent('popstate'))
  })
  await expect(page).toHaveTitle('About | TradeSim')
  await expect.poll(() => [...sockets.values()]).toEqual(['closed', 'closed'])
})

test('trading requires sign-in', async ({ page }) => {
  await page.goto('/sim')
  await expect(page.getByText('Please log in to submit a trade')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Submit Trade' }).first()).toBeDisabled()
})
