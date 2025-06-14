from fastapi import Header, HTTPException, Depends
from firebase_admin import auth

async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header format")

    id_token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # You can return email, uid, etc.
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token verification failed")
