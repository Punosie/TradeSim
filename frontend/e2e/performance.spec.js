import { test, expect } from '@playwright/test'

// Page-weight and load-time budgets for the production build. Each failure
// message names the metric, so a regression is easy to pin down.
const BUDGETS = {
  '/': { jsKB: 150, lcpMs: 2500 },
  '/about': { jsKB: 150, lcpMs: 2500 },
  '/sim': { jsKB: 400, lcpMs: 3000 },
}

const collect = (page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) lcp = e.startTime
        }).observe({ type: 'largest-contentful-paint', buffered: true })
        // Give LCP a moment to settle after load
        setTimeout(() => {
          const resources = performance.getEntriesByType('resource')
          const js = resources
            .filter((r) => r.name.endsWith('.js') && new URL(r.name).origin === location.origin)
            .reduce((sum, r) => sum + r.encodedBodySize, 0)
          const nav = performance.getEntriesByType('navigation')[0]
          resolve({ lcp, jsKB: js / 1024, load: nav.loadEventEnd, dcl: nav.domContentLoadedEventEnd })
        }, 1500)
      })
  )

for (const [path, budget] of Object.entries(BUDGETS)) {
  test(`${path} stays within its load budget`, async ({ page }, testInfo) => {
    await page.goto(path, { waitUntil: 'load' })
    const m = await collect(page)
    testInfo.annotations.push({
      type: 'perf',
      description: `${path}: JS ${m.jsKB.toFixed(0)}KB, DCL ${m.dcl.toFixed(0)}ms, load ${m.load.toFixed(0)}ms, LCP ${m.lcp.toFixed(0)}ms`,
    })
    console.log(testInfo.project.name, testInfo.annotations.at(-1).description)
    expect(m.jsKB, 'JS transferred (KB, compressed size as served)').toBeLessThan(budget.jsKB)
    expect(m.lcp, 'Largest Contentful Paint (ms)').toBeLessThan(budget.lcpMs)
  })
}
