import logging

# Import utilities
from fsdicts import *
from runtypes import *
from guardify import *

# Import internal router
from router import router

# Setup the logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


@router.get("/api/ping")
def _ping():
    return "Pong"
