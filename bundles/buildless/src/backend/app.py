import logging

# Import utilities
from runtypes import *
from guardify import *

# Import the router
from utilities.redis import broadcast_sync, broadcast_async, receive_sync, receive_async, redict
from utilities.starlette import router

# Initialize ping database
DATABASE = redict("click")
DATABASE.setdefaults(count=0)


@router.post("/api/click")
def click_request() -> str:
    # Increment ping count
    DATABASE.count += 1

    # Log the user click
    logging.info("User clicked - count is now %d", DATABASE.count)

    # Return the ping count
    return "Click count is %d" % DATABASE.count


@router.post("/api/relay", type_message=Text)
async def relay_request(message):
    # Publish to channel
    await broadcast_async(text=message)


@router.socket("/socket/relay")
async def relay_socket(websocket) -> None:
    # Accept the websocket
    await websocket.accept()

    # Subscribe to the global relay
    async for event in receive_async():
        # Send the message
        await websocket.send_text(event.text)


# Initialize the application
app = router.initialize()
