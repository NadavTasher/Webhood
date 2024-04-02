import time

# Import utilities
from fsdicts import *
from runtypes import *
from guardify import *

# Import the router
from router import router, initialize

# Initialize value storage
DATABASE = localdict("/opt/database")

# Set defaults
DATABASE.setdefaults(count=0, timestamp=0)


@router.post("/api/count")
def count_request():
    return DATABASE.count


@router.post("/api/advance")
def advance_request():
    # Make sure enough time has passed
    assert time.time() - DATABASE.timestamp > 10, "Must wait 10 seconds between clicks"

    # Advance the value
    DATABASE.count += 1
    DATABASE.timestamp = time.time()


# Initialize the application
app = initialize()
