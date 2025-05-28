from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Welcome to the TradeSim server!"}