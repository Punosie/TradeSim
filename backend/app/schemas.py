from pydantic import BaseModel, Field
from typing import Literal, Union
from datetime import datetime


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
    side: Literal["buy", "sell"] = Field(
        "buy", description="Trade side (buy/sell)")


class TradeOutput(BaseModel):
    """
    Schema for trade output data stored in the database.
    """
    user_id: str = Field(..., description="UID of the user who executed the trade")
    timestamp: Union[str, datetime] = Field(..., description="Timestamp of the trade")
    exchange: str = Field(..., description="Exchange used for the trade")
    asset: str = Field(..., description="Asset traded")
    order_type: str = Field(..., description="Order type")
    side: str = Field(..., description="Trade side (buy/sell)")
    qty_usd: float = Field(..., description="Amount in USD used for the trade")
    filled_qty: float = Field(..., description="Quantity filled in base asset")
    fee_usd: float = Field(..., description="Fee charged in USD")
    slippage: float = Field(..., description="Slippage percentage")
    average_price: float = Field(..., description="Average price of executed trade")
    total_value: float = Field(..., description="Total value of the trade in USD")
    latency: str = Field(..., description="Simulated latency or delay info")
    status: Literal["success", "failed"] = Field(..., description="Execution status")
    
    class Config:
        from_attributes = True
