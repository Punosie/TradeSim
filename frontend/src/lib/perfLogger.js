import { log, loggingEnabled } from "./logger";

const observe = (type, callback) => {
    try {
        new PerformanceObserver((list) => list.getEntries().forEach(callback)).observe({ type, buffered: true });
    } catch {
        // Entry type not supported in this browser
    }
};

const kb = (bytes) => (bytes ? `${(bytes / 1024).toFixed(1)}KB` : "cached");

/**
 * Logs page-load timings, Web Vitals and every network resource the page fetches
 * (scripts, styles, images, API calls, Firebase/analytics requests).
 */
export const startPerfLogging = () => {
    if (!loggingEnabled || typeof PerformanceObserver === "undefined") return;

    observe("navigation", (nav) => {
        log.perf(
            `page load ${location.pathname}: TTFB ${nav.responseStart.toFixed(0)}ms, ` +
            `DOMContentLoaded ${nav.domContentLoadedEventEnd.toFixed(0)}ms, load ${nav.loadEventEnd.toFixed(0)}ms, ` +
            `document ${kb(nav.transferSize)}`
        );
    });
    observe("paint", (p) => log.perf(`${p.name} ${p.startTime.toFixed(0)}ms`));
    observe("largest-contentful-paint", (lcp) =>
        log.perf(`LCP ${lcp.startTime.toFixed(0)}ms`, lcp.element?.tagName ?? "")
    );

    let cls = 0;
    observe("layout-shift", (shift) => {
        if (!shift.hadRecentInput) cls += shift.value;
    });
    addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") log.perf(`CLS ${cls.toFixed(3)}`);
    });

    observe("resource", (r) => {
        const url = new URL(r.name);
        const where = url.origin === location.origin ? url.pathname : `${url.host}${url.pathname}`;
        log.perf(`${r.initiatorType} ${where} ${r.duration.toFixed(0)}ms ${kb(r.transferSize)}`);
    });
};
