import logging

from fastapi import WebSocket, WebSocketDisconnect

from app.services.orderbook_manager import Channel, OrderbookHub

logger = logging.getLogger(__name__)


async def stream_channel(websocket: WebSocket, hub: OrderbookHub, channel: Channel):
    """Relay every message published on `channel` to the client until it disconnects."""
    await websocket.accept()
    logger.debug("Client subscribed to %s", channel)
    with hub.subscribe(channel) as queue:
        try:
            while True:
                await websocket.send_text(await queue.get())
        except (WebSocketDisconnect, RuntimeError):
            # RuntimeError: send after the client already closed the socket
            pass
    logger.debug("Client unsubscribed from %s", channel)
