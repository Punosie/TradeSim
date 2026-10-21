import { useEffect, useRef } from "react";
import { log } from "../lib/logger";

const MAX_BACKOFF_MS = 15000;

/**
 * Subscribe to a JSON WebSocket for the lifetime of the component.
 * Reconnects with exponential backoff and always closes on unmount.
 * `onMessage` may change between renders without reopening the socket.
 */
const useWebSocket = (url, onMessage) => {
    const handlerRef = useRef(onMessage);

    useEffect(() => {
        handlerRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!url) return;
        let socket;
        let retryTimer;
        let attempt = 0;
        let closed = false;

        const connect = () => {
            const start = performance.now();
            let opened = start;
            let received = 0;
            log.ws(`→ connect ${url}`);
            socket = new WebSocket(url);
            socket.onopen = () => {
                attempt = 0;
                opened = performance.now();
                log.ws(`✓ open ${url} in ${(opened - start).toFixed(0)}ms`);
            };
            socket.onmessage = (event) => {
                received++;
                if (received === 1) {
                    log.ws(`first message ${url} ${(performance.now() - start).toFixed(0)}ms after connect`);
                }
                try {
                    handlerRef.current(JSON.parse(event.data));
                } catch (err) {
                    log.wsError("Error parsing message:", err);
                }
            };
            socket.onerror = () => log.wsError(`error ${url}`);
            socket.onclose = (event) => {
                log.ws(
                    `✗ close ${url} code=${event.code} after ${((performance.now() - opened) / 1000).toFixed(1)}s, ${received} messages`
                );
                if (closed) return;
                const delay = Math.min(1000 * 2 ** attempt++, MAX_BACKOFF_MS);
                log.wsError(`reconnecting ${url} in ${delay}ms (attempt ${attempt})`);
                retryTimer = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            closed = true;
            clearTimeout(retryTimer);
            socket?.close();
        };
    }, [url]);
};

export default useWebSocket;
