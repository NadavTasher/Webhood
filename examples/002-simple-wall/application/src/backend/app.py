import time
import asyncio

# Import utilities
from fsdicts import *
from runtypes import *
from guardify import *

# Import the router
from router import router, initialize

# Import globals
from globals import DATABASE, CHANNEL


@router.post("/api/post", type_message=Text)
async def post_request(message):
    # Make sure message is not too long
    assert 4 < len(message) < 60, "Message length is invalid"

    # Create the timestamp
    timestamp = time.time()

    # Create the message
    DATABASE[timestamp] = message


@router.get("/api/posts")
@router.post("/api/posts")
def posts_request():
    # Return the sorted posts
    return [(timestamp, DATABASE[timestamp]) for timestamp in sorted(DATABASE)]


@router.socket("/socket/posts")
async def posts_socket(websocket):
    # Known timestamps
    known_timestamps = set(DATABASE)

    # Loop forever
    while websocket:
        # Check whether there are new messages
        current_timestamps = set(DATABASE)

        # Are there new timestamps?
        for timestamp in sorted(current_timestamps - known_timestamps):
            # Send the new message
            await websocket.send_json([timestamp, DATABASE[timestamp]])

        # Update the timestamps
        known_timestamps |= current_timestamps

        # Sleep for one seconds
        await asyncio.sleep(1)


# Initialize the application
app = initialize()
