from fastapi import Header, HTTPException
from fastapi.concurrency import run_in_threadpool
from firebase_admin import auth


async def get_current_user(authorization: str = Header(...)) -> dict:
    """Verify the Firebase ID token in the `Authorization: Bearer` header."""
    scheme, _, id_token = authorization.partition(" ")
    if scheme != "Bearer" or not id_token:
        raise HTTPException(status_code=401, detail="Invalid auth header format")

    try:
        # verify_id_token is blocking (it may fetch Google's public certs)
        return await run_in_threadpool(auth.verify_id_token, id_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Token verification failed")
