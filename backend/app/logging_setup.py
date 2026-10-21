"""Logging configuration with per-request correlation IDs."""

import logging
import sys
import time
from contextvars import ContextVar

from app.config import LOG_LEVEL, LOG_OUTGOING

# Set by the request logging middleware; read by every log record
request_id: ContextVar[str] = ContextVar("request_id", default="-")


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id.get()
        return True


def setup_logging():
    handler = logging.StreamHandler()
    handler.addFilter(RequestIdFilter())
    # UTC ISO-8601 timestamps, matching the Vite and Docusaurus server logs
    formatter = logging.Formatter(
        "%(asctime)s.%(msecs)03dZ %(levelname)-7s [%(request_id)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )
    formatter.converter = time.gmtime
    handler.setFormatter(formatter)
    root = logging.getLogger()
    root.handlers[:] = [handler]
    root.setLevel(LOG_LEVEL)

    # Our middleware logs every request with timing, so uvicorn's access log is redundant
    logging.getLogger("uvicorn.access").disabled = True
    for name in ("uvicorn", "uvicorn.error"):
        logging.getLogger(name).handlers[:] = []
        logging.getLogger(name).propagate = True
    # ...as are uvicorn's per-WebSocket "[accepted]" / "connection open|closed" lines
    logging.getLogger("uvicorn.error").addFilter(_drop_websocket_noise)
    if sys.platform == "win32":
        logging.getLogger("asyncio").addFilter(_drop_proactor_reset)

    # Outgoing HTTP from third-party clients (Firebase cert fetches use urllib3,
    # google-genai uses httpx); these log one line per request at these levels.
    outgoing_level = logging.DEBUG if LOG_OUTGOING else logging.WARNING
    logging.getLogger("urllib3.connectionpool").setLevel(outgoing_level)
    if LOG_OUTGOING and root.level > logging.DEBUG:
        # Let urllib3's DEBUG request lines through without enabling DEBUG globally
        logging.getLogger("urllib3.connectionpool").addFilter(_promote_to_info)
    for noisy in ("httpx", "httpcore", "websockets", "pymongo", "google_genai"):
        logging.getLogger(noisy).setLevel(logging.WARNING)


def _drop_websocket_noise(record: logging.LogRecord) -> bool:
    message = record.getMessage()
    return not (message in ("connection open", "connection closed") or message.endswith("[accepted]"))


def _drop_proactor_reset(record: logging.LogRecord) -> bool:
    """Windows' Proactor loop logs a traceback whenever a client resets a socket
    it is shutting down. It's harmless (and doesn't happen on Linux)."""
    exc = record.exc_info[1] if record.exc_info else None
    return not (isinstance(exc, ConnectionResetError) and "_call_connection_lost" in record.getMessage())


def _promote_to_info(record: logging.LogRecord) -> bool:
    if record.levelno == logging.DEBUG:
        record.levelno, record.levelname = logging.INFO, "INFO"
        record.name = "outgoing.http"
    return True
