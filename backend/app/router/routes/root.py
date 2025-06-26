from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Welcome to the TradeSim server!"}

@router.head("/health")
def health_head():
    return