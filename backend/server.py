import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket
from okx_ws import sub_to_orderbook

load_dotenv()
app = FastAPI()

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8000))

@app.get("/")
async def home():
    return {"message": "Welcome to the TradeSim server!"}

@app.websocket("/ws/okx")
async def orderbook_ws(websockt: WebSocket):
    await websockt.accept()
    await websockt.send_text("WebSocket connection established. Subscribing to orderbook...")
    
    async for message in sub_to_orderbook():
        await websockt.send_json(message)    
    
if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)