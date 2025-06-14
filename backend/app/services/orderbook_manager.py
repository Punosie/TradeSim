from app.okx_client import OKXClient
import asyncio


class LatestOrderbook(dict):
    """A class to manage the latest orderbook data from OKX."""

    def __init__(self, *args, **kwargs):
        """Initialize the LatestOrderbook with an OKXClient instance."""
        super().__init__(*args, **kwargs)
        self._client = OKXClient()

    async def update(self):
        """Continuously update the orderbook, with auto-reconnect."""
        while True:
            try:
                async for orderbook in self._client.subscribe():
                    self.clear()
                    super().update(orderbook)
            except Exception as e:
                print(f"Orderbook update failed: {e}, retrying...")
                await asyncio.sleep(1)

    def get_latest_orderbook(self):
        """Return the latest orderbook as a dictionary."""
        return dict(self)

    def get_asks(self):
        """Return the asks from the latest orderbook."""
        return self.get("asks", [])
    
    def get_bids(self):
        """Return the bids from the latest orderbook."""
        return self.get("bids", [])
    
    def get_symbol(self):
        """Return the symbol from the latest orderbook."""
        return self.get("symbol", "")
    
    def get_timestamp(self):
        """Return the timestamp from the latest orderbook."""
        return self.get("timestamp", "")
    
    def get_exchange(self):
        """Return the exchange from the latest orderbook."""
        return self.get("exchange", "OKX")
    
    def get_order_type(self):
        """Return the order type from the latest orderbook."""
        return self.get("order_type", "market")
    
shared_orderbook = LatestOrderbook()