export function subscribeMidPricePred(url, onMessageCallback) {
    const socket = new WebSocket(url);

    socket.addEventListener("open", (event) => {
        console.log("WebSocket connection established.");
    });

    socket.addEventListener("close", (event) => {
        console.log(`Connection closed. Code: ${event.code}, Reason: ${event.reason}`);
    });

    socket.addEventListener("error", (event) => {
        console.error(`Error: ${event}`);
    });

    socket.addEventListener("message", (event) => {
        try {
            const data = JSON.parse(event.data);
            onMessageCallback(data);
        } catch (err) {
            console.warn("Error parsing message:", err);
        }
    });

    return socket;
}