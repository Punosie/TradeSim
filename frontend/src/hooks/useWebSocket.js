import { useEffect, useRef } from "react";

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
            socket = new WebSocket(url);
            socket.onopen = () => {
                attempt = 0;
            };
            socket.onmessage = (event) => {
                try {
                    handlerRef.current(JSON.parse(event.data));
                } catch (err) {
                    console.warn("Error parsing message:", err);
                }
            };
            socket.onclose = () => {
                if (closed) return;
                const delay = Math.min(1000 * 2 ** attempt++, MAX_BACKOFF_MS);
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
