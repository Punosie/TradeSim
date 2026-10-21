import uvicorn

from app.config import ENV, HOST, PORT

if __name__ == "__main__":
    # access_log=False: app.middleware.request_logging logs every request with timing
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=ENV == "dev", access_log=False)
