import time
import asyncio

# Import utilities
from runtypes import *
from guardify import *

# Import the router
from utilities.redis import broadcast, listen
from utilities.starlette import router

# Import globals
from globals import DATABASE


@router.post("/api/post", type_message=Text)
async def post_request(message):
    # Make sure message is not too long
    assert 4 < len(message) < 60, "Message length is invalid"

    # Create the timestamp
    timestamp = int(time.time())

    # Create the message
    DATABASE[str(timestamp)] = message

    # Notify listeners
    await broadcast("posts", message=message, timestamp=timestamp)


@router.get("/api/posts")
@router.post("/api/posts")
def posts_request():
    # Return the sorted posts
    return [(int(timestamp), DATABASE[timestamp]) for timestamp in sorted(DATABASE)]


@router.socket("/socket/posts")
async def posts_socket(websocket):
    # Accept the websocket
    await websocket.accept()

    # Loop forever
    async for post in listen("posts"):
        # Send the new message
        await websocket.send_json([post.timestamp, post.message])


# Initialize the application
app = router.initialize()
