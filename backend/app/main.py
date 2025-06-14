"main.py"

import asyncio
from contextlib import asynccontextmanager

from app.router.routes import router as app_router
from app.services.orderbook_manager import shared_orderbook
from app.utils.firebase_auth import init_firebase
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth

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

# Initialize Firebase
init_firebase()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(app_router)

@app.get("/test-firebase/{uid}")
def test_firebase_user(uid: str):
    """
    Test Firebase Admin SDK by fetching user details from Firebase Auth.
    """
    try:
        user = auth.get_user(uid)
        return {
            "uid": user.uid,
            "email": user.email,
            "provider": user.provider_id,
            "created_at": user.user_metadata.creation_timestamp,
        }
    except Exception as e:
        return {"error": str(e)}

# MB8mWXGDWDche93IQgs5i5IwRaA3