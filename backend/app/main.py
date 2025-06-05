import asyncio
from fastapi import FastAPI
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from app.router.routes import router as app_router
from app.services.orderbook_manager import shared_orderbook
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs on startup
    task = asyncio.create_task(shared_orderbook.update())
    yield
    # This runs on shutdown (cancel background task)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(app_router)