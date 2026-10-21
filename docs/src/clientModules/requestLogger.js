// Browser-side request logging for the docs site.
// On in development; in production enable with localStorage.setItem('tradesim:debug', '1').
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const enabled = (() => {
  if (!ExecutionEnvironment.canUseDOM) return false;
  if (process.env.NODE_ENV === 'development') return true;
  try {
    return localStorage.getItem('tradesim:debug') === '1';
  } catch {
    return false;
  }
})();

const log = (...args) => console.info('%c[docs]', 'color:#3ecc5f;font-weight:bold', ...args);
const kb = (bytes) => (bytes ? `${(bytes / 1024).toFixed(1)}KB` : 'cached');

const observe = (type, callback) => {
  try {
    new PerformanceObserver((list) => list.getEntries().forEach(callback)).observe({type, buffered: true});
  } catch {
    // Entry type not supported
  }
};

if (enabled) {
  observe('navigation', (nav) =>
    log(
      `page load ${location.pathname}: TTFB ${nav.responseStart.toFixed(0)}ms, ` +
        `DOMContentLoaded ${nav.domContentLoadedEventEnd.toFixed(0)}ms, load ${nav.loadEventEnd.toFixed(0)}ms`,
    ),
  );
  observe('paint', (p) => log(`${p.name} ${p.startTime.toFixed(0)}ms`));
  observe('largest-contentful-paint', (lcp) => log(`LCP ${lcp.startTime.toFixed(0)}ms`));
  observe('resource', (r) => {
    const url = new URL(r.name);
    const where = url.origin === location.origin ? url.pathname : `${url.host}${url.pathname}`;
    log(`${r.initiatorType} ${where} ${r.duration.toFixed(0)}ms ${kb(r.transferSize)}`);
  });
}

let navStart = 0;

export function onRouteUpdate({location, previousLocation}) {
  if (enabled && previousLocation && location.pathname !== previousLocation.pathname) {
    navStart = performance.now();
  }
}

export function onRouteDidUpdate({location, previousLocation}) {
  if (enabled && previousLocation && location.pathname !== previousLocation.pathname) {
    log(`route ${previousLocation.pathname} → ${location.pathname} in ${(performance.now() - navStart).toFixed(0)}ms`);
  }
}
