from fastapi import APIRouter

from app.services.orderbook_manager import hub

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Welcome to the TradeSim server!"}


@router.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok", "orderbook_ready": hub.ready}
