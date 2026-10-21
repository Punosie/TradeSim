import { test, expect } from '@playwright/test'

const PAGES = [
  { path: '/', title: /^TradeSim – Real-Time Crypto Trade Simulator$/ },
  { path: '/sim', title: 'Simulator | TradeSim' },
  { path: '/ask-ai', title: 'Ask AI | TradeSim' },
  { path: '/about', title: 'About | TradeSim' },
  { path: '/contact', title: 'Contact | TradeSim' },
]

for (const { path, title } of PAGES) {
  test(`${path} has its own title, description, canonical and OG tags`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveTitle(title)
    await expect(page.locator('title')).toHaveCount(1)
    await expect(page.locator('meta[name="description"]')).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path === '/' ? '/$' : path}$`))
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title instanceof RegExp ? /TradeSim/ : title)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png$/)
  })
}

test('unknown routes render a noindex 404 page', async ({ page }) => {
  await page.goto('/definitely-not-a-page')
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
})

test('crawler files and icons are served', async ({ request }) => {
  for (const [path, type] of [
    ['/robots.txt', /text\/plain/],
    ['/sitemap.xml', /xml/],
    ['/site.webmanifest', /json/],
    ['/favicon.ico', /icon/],
    ['/favicon.svg', /svg/],
    ['/og-image.png', /png/],
  ]) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
    expect(res.headers()['content-type'], path).toMatch(type)
  }
})
