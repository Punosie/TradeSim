// Request/performance logging for the browser console.
// On in development; in production enable it with VITE_REQUEST_LOGGING=true at
// build time, or per browser with localStorage.setItem("tradesim:debug", "1").

const readFlag = () => {
    try {
        return localStorage.getItem("tradesim:debug") === "1";
    } catch {
        return false;
    }
};

export const loggingEnabled =
    import.meta.env.DEV || import.meta.env.VITE_REQUEST_LOGGING === "true" || readFlag();

const STYLES = {
    http: "color:#38bdf8;font-weight:bold",
    ws: "color:#a78bfa;font-weight:bold",
    perf: "color:#34d399;font-weight:bold",
    route: "color:#f472b6;font-weight:bold",
};

const noop = () => {};

const make = (tag, method = "info") =>
    loggingEnabled
        ? (...args) => console[method](`%c[${tag}]`, STYLES[tag] ?? "", ...args)
        : noop;

export const log = {
    http: make("http"),
    httpError: make("http", "warn"),
    ws: make("ws"),
    wsError: make("ws", "warn"),
    perf: make("perf"),
    route: make("route"),
};

export const newRequestId = () => crypto.randomUUID().replaceAll("-", "").slice(0, 12);

/** Parse a Server-Timing header ("app;dur=12.3") into milliseconds. */
export const serverTiming = (header) => {
    const match = /dur=([\d.]+)/.exec(header || "");
    return match ? Number(match[1]) : undefined;
};
