import logging

from pymongo import AsyncMongoClient, monitoring
from pymongo.server_api import ServerApi

from app.config import LOG_OUTGOING, MONGO_COLLECTION, MONGO_DB, MONGO_URL

from .trade_repository import TradeRepository

logger = logging.getLogger("outgoing.mongo")

# Driver-internal commands that would only add noise
_SKIP_COMMANDS = {"hello", "ismaster", "isMaster", "saslStart", "saslContinue", "endSessions", "buildInfo"}


class CommandLogger(monitoring.CommandListener):
    """Logs every MongoDB command the app sends, with its round-trip time."""

    def started(self, event):
        pass

    def succeeded(self, event):
        if event.command_name not in _SKIP_COMMANDS:
            logger.info(
                "%s %s -> ok %.1fms",
                event.command_name, event.database_name, event.duration_micros / 1000,
            )

    def failed(self, event):
        logger.warning(
            "%s %s -> FAILED %.1fms: %s",
            event.command_name, event.database_name, event.duration_micros / 1000, event.failure,
        )


# The client connects lazily, so creating it at import time does no I/O.
client: AsyncMongoClient = AsyncMongoClient(
    MONGO_URL,
    server_api=ServerApi("1"),
    event_listeners=[CommandLogger()] if LOG_OUTGOING else [],
)

trade_repository = TradeRepository(client[MONGO_DB][MONGO_COLLECTION])
