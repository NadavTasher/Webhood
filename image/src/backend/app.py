# Import utilities
from runtypes import *
from guardify import *

# Import the router
from utilities import REDIS, router, redict

# Initialize ping database
DATABASE = redict("click")
DATABASE.setdefaults(count=0)


@router.post("/api/click")
def click_request() -> str:
    # Increment ping count
    DATABASE.count += 1

    # Return the ping count
    return "Click count is %d" % DATABASE.count


@router.post("/api/relay", type_message=Text)
async def relay_request(message):
    # Subscribe to the global relay
    async with REDIS.pubsub() as pubsub:
        # Publish to channel
        await pubsub.publish("relay", message)


@router.socket("/socket/relay", optional_channel=Text)
async def relay_socket(websocket, channel="relay") -> None:
    # Validate relay channel
    assert channel in ["relay"], "Invalid channel was requestd"

    # Accept the websocket
    await websocket.accept()

    # Subscribe to the global relay
    async with REDIS.pubsub() as pubsub:
        # Subscribe to channel
        await pubsub.subscribe(channel)

        # Loop forever and send messages
        while True:
            await websocket.send_text(await channel.get_message(ignore_subscribe_messages=True))


# Initialize the application
app = router.initialize()
