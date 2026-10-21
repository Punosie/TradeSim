import logging
import re
import time
import uuid

from app.config import LOG_HEALTH_CHECKS, SLOW_REQUEST_MS
from app.logging_setup import request_id

logger = logging.getLogger("incoming")

_VALID_ID = re.compile(r"^[A-Za-z0-9._-]{1,64}$")
_QUIET_PATHS = {"/health"}


def _client(scope) -> str:
    headers = dict(scope.get("headers") or [])
    forwarded = headers.get(b"x-forwarded-for")
    if forwarded:
        return forwarded.decode().split(",")[0].strip()
    client = scope.get("client")
    return client[0] if client else "-"


def _request_id(scope) -> str:
    for name, value in scope.get("headers") or []:
        if name == b"x-request-id":
            rid = value.decode("latin-1")
            if _VALID_ID.match(rid):
                return rid
    return uuid.uuid4().hex[:12]


class RequestLoggingMiddleware:
    """Pure ASGI middleware logging every HTTP request and WebSocket session.

    Each request gets a correlation ID (taken from an incoming X-Request-ID
    header when present) that is attached to every log line emitted while
    handling it, and echoed back with a Server-Timing header.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            await self._http(scope, receive, send)
        elif scope["type"] == "websocket":
            await self._websocket(scope, receive, send)
        else:
            await self.app(scope, receive, send)

    async def _http(self, scope, receive, send):
        rid = _request_id(scope)
        token = request_id.set(rid)
        start = time.perf_counter()
        status, size = 500, 0

        async def send_wrapper(message):
            nonlocal status, size
            if message["type"] == "http.response.start":
                status = message["status"]
                elapsed = (time.perf_counter() - start) * 1000
                message.setdefault("headers", [])
                message["headers"] = list(message["headers"]) + [
                    (b"x-request-id", rid.encode()),
                    (b"server-timing", f"app;dur={elapsed:.1f}".encode()),
                ]
            elif message["type"] == "http.response.body":
                size += len(message.get("body", b""))
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        finally:
            elapsed = (time.perf_counter() - start) * 1000
            path = scope["path"]
            if path not in _QUIET_PATHS or LOG_HEALTH_CHECKS:
                query = scope.get("query_string", b"").decode()
                level = (
                    logging.ERROR if status >= 500
                    else logging.WARNING if status >= 400 or elapsed >= SLOW_REQUEST_MS
                    else logging.INFO
                )
                logger.log(
                    level,
                    "%s %s%s -> %s %dB %.1fms client=%s",
                    scope["method"], path, f"?{query}" if query else "",
                    status, size, elapsed, _client(scope),
                )
            request_id.reset(token)

    async def _websocket(self, scope, receive, send):
        rid = _request_id(scope)
        token = request_id.set(rid)
        start = time.perf_counter()
        sent = 0
        close_code = None

        async def send_wrapper(message):
            nonlocal sent, close_code
            if message["type"] == "websocket.accept":
                logger.info("WS %s accepted client=%s", scope["path"], _client(scope))
            elif message["type"] == "websocket.send":
                sent += 1
            elif message["type"] == "websocket.close":
                close_code = message.get("code", 1000)
            await send(message)

        async def receive_wrapper():
            nonlocal close_code
            message = await receive()
            if message["type"] == "websocket.disconnect":
                close_code = message.get("code", 1000)
            return message

        try:
            await self.app(scope, receive_wrapper, send_wrapper)
        finally:
            logger.info(
                "WS %s closed code=%s messages_sent=%d duration=%.1fs",
                scope["path"], close_code, sent, time.perf_counter() - start,
            )
            request_id.reset(token)
