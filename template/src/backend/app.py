from runtypes import *
from router import app


@app.get("/api/ping")
def _ping():
    return "Pong"
