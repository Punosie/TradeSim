"main.py"

import asyncio
from contextlib import asynccontextmanager

from app.router.routes import router as app_router
from app.services.orderbook_manager import shared_orderbook
from app.utils.firebase_auth import init_firebase
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import trade_repository

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs on startup
    task = asyncio.create_task(shared_orderbook.update())
    
    trade_repository.init_indexes()  # Ensure indexes are created on startup
    
    yield
    # This runs on shutdown (cancel background task)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

# Initialize Firebase
init_firebase()

app = FastAPI(lifespan=lifespan)

origins=[
    "https://tradesim-shubhabha.vercel.app",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(app_router)