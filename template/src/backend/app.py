import logging

from runtypes import *
from router import router

# Setup the logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


@router.get("/api/ping")
def _ping():
    return "Pong"
