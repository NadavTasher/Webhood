from runtypes import *
from router import app, endpoint


@app.get("/api/ping")
@endpoint()
def _ping():
    return "Pong"
