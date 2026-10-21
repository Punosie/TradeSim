import axios from "axios";
import { auth } from "../firebase/config";
import { log, loggingEnabled, newRequestId, serverTiming } from "./logger";

export const API_URL = import.meta.env.VITE_API_URL;
export const WS_URL = import.meta.env.VITE_WS_URL;

const api = axios.create({ baseURL: API_URL, timeout: 30000 });

// Attach the signed-in user's Firebase ID token and a correlation ID that the
// backend logs alongside its own lines for this request
api.interceptors.request.use(async (config) => {
    const token = await auth.currentUser?.getIdToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers["X-Request-ID"] = newRequestId();
    config.metadata = { start: performance.now() };
    log.http(`→ ${config.method.toUpperCase()} ${config.url}`, `id=${config.headers["X-Request-ID"]}`);
    return config;
});

const logResponse = (response, error) => {
    const { config = {}, status, headers = {} } = response ?? error ?? {};
    const total = config.metadata ? (performance.now() - config.metadata.start).toFixed(1) : "?";
    const server = serverTiming(headers["server-timing"]);
    const line = [
        `← ${config.method?.toUpperCase()} ${config.url} ${status ?? "network error"} ${total}ms`,
        server !== undefined ? `(server ${server}ms, network ${(total - server).toFixed(1)}ms)` : "",
        `id=${headers["x-request-id"] ?? config.headers?.["X-Request-ID"]}`,
    ];
    (error ? log.httpError : log.http)(...line);
};

if (loggingEnabled) {
    api.interceptors.response.use(
        (response) => {
            logResponse(response);
            return response;
        },
        (error) => {
            logResponse(error.response, error);
            return Promise.reject(error);
        }
    );
}

/** Human-readable message from an axios error (uses FastAPI's `detail`). */
export const errorMessage = (err, fallback = "Something went wrong!") => {
    const detail = err?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
    return fallback;
};

export default api;
