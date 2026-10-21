import asyncio
import logging
from contextlib import suppress

from fastapi import WebSocket, WebSocketDisconnect

from app.services.orderbook_manager import Channel, OrderbookHub

logger = logging.getLogger(__name__)


async def stream_channel(websocket: WebSocket, hub: OrderbookHub, channel: Channel):
    """Relay every message published on `channel` to the client until it disconnects.

    A reader task watches for the client's close frame, so a disconnect is
    noticed immediately (and its close code logged) instead of on the next send.
    """
    await websocket.accept()
    with hub.subscribe(channel) as queue:

        async def pump():
            while True:
                await websocket.send_text(await queue.get())

        async def watch_disconnect():
            while True:
                message = await websocket.receive()
                if message["type"] == "websocket.disconnect":
                    return

        tasks = [asyncio.create_task(pump()), asyncio.create_task(watch_disconnect())]
        try:
            await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        finally:
            for task in tasks:
                task.cancel()
            for task in tasks:
                # RuntimeError/WebSocketDisconnect: send raced with the client closing
                with suppress(asyncio.CancelledError, WebSocketDisconnect, RuntimeError):
                    await task
