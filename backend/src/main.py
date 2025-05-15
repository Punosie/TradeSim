from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sim import run_simulation

app = FastAPI()

# Enable frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/simulate")
def simulate(amount: float = Query(50000.0)):
    return run_simulation(amount)
