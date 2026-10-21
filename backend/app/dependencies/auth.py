import logging
import time

from fastapi import Header, HTTPException
from fastapi.concurrency import run_in_threadpool
from firebase_admin import auth

logger = logging.getLogger("outgoing.firebase")


async def get_current_user(authorization: str = Header(...)) -> dict:
    """Verify the Firebase ID token in the `Authorization: Bearer` header."""
    scheme, _, id_token = authorization.partition(" ")
    if scheme != "Bearer" or not id_token:
        raise HTTPException(status_code=401, detail="Invalid auth header format")

    start = time.perf_counter()
    try:
        # verify_id_token is blocking (it may fetch Google's public certs)
        user = await run_in_threadpool(auth.verify_id_token, id_token)
    except Exception as e:
        logger.warning("verify_id_token -> rejected %.1fms: %s", (time.perf_counter() - start) * 1000, type(e).__name__)
        raise HTTPException(status_code=401, detail="Token verification failed")

    logger.info("verify_id_token uid=%s -> ok %.1fms", user["uid"], (time.perf_counter() - start) * 1000)
    return user
