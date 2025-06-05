from pydantic import BaseModel, Field
from typing import Literal


class TradeInput(BaseModel):
    """
    Schema for trade input data.
    """
    exchange: Literal["OKX"] = Field("OKX", description="Exchange name")
    asset: str = Field(
        "BTC-USDT-SWAP", description="Asset type, e.g., 'BTC-USD-SWAP'")
    order_type: Literal["market"] = Field(
        "market", description="Type of order")
    qty_usd: float = Field(..., description="Quantity in USD")
