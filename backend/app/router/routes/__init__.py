from fastapi import APIRouter
from .root import router as root_router
from .websocket import router as websocket_router
from .trade import router as trade_router
from .prediction import router as prediction_router

router = APIRouter()
router.include_router(root_router)
router.include_router(trade_router)
router.include_router(websocket_router)
router.include_router(prediction_router)