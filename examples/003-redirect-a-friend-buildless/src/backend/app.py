# mypy: disable-error-code=valid-type
# pylint: disable=no-member, unused-wildcard-import

import logging

# Import utilities
from runtypes import *
from guardify import *

# Import the router
from webhood.router import router
from webhood.database import wait_for_redis_sync, broadcast_async, receive_async, redict

# Wait for redis to ping back before operating on database
wait_for_redis_sync()

@router.post("/api/redirect")
async def redirect_others(url: str, id: str) -> None:
    # Publish to channel
    await broadcast_async(url=url, id=id)


@router.socket("/socket/redirect")
async def redirect_myself(websocket) -> None:
    # Accept the websocket
    await websocket.accept()

    # Subscribe to the global relay
    async for event in receive_async():
        # Send the message
        await websocket.send_json(event)


# Initialize the application
app = router.initialize()
