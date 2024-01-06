from runtypes import *
from router import router


@router.get("/api/ping")
def _ping():
    return "Pong"
