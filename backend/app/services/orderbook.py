from app.okx_ws import sub_to_orderbook

_latest_orderbook = None

async def orderbook_updater():
    global _latest_orderbook
    async for message in sub_to_orderbook():
        _latest_orderbook = message

def get_latest_orderbook():
    return _latest_orderbook