import axios from "axios";
import { auth } from "../firebase/config";

export const API_URL = import.meta.env.VITE_API_URL;
export const WS_URL = import.meta.env.VITE_WS_URL;

const api = axios.create({ baseURL: API_URL, timeout: 30000 });

// Attach the signed-in user's Firebase ID token to every request
api.interceptors.request.use(async (config) => {
    const token = await auth.currentUser?.getIdToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/** Human-readable message from an axios error (uses FastAPI's `detail`). */
export const errorMessage = (err, fallback = "Something went wrong!") => {
    const detail = err?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
    return fallback;
};

export default api;
