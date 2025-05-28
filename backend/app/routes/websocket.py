from fastapi import WebSocket, APIRouter, WebSocketDisconnect
from app.okx_ws import sub_to_orderbook

router = APIRouter()

@router.websocket("/ws/okx")
# ws://127.0.0.1:8000/ws/okx
async def orderbook_ws(websockt: WebSocket):
    await websockt.accept()
    print("WebSocket connection established")
    try:
        async for message in sub_to_orderbook():
            await websockt.send_json(message)
    except Exception as e:
        print(f"WebSocket error: {e}")
    except WebSocketDisconnect:
        print("WebSocket connection closed")
    finally:
        print("WebSocket connection closed")