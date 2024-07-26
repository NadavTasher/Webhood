import json
import munch
import functools

# Import redis utilities
import redis
import redis.asyncio

# Import rednest utilities
from rednest import Array, Dictionary

# Global broadcast channel
GLOBAL_CHANNEL = "global"

# Redis unix socket path
UNIX_SOCKET_PATH = "/run/redis.sock"

# Create the default redis connection
REDIS = redis.Redis(unix_socket_path=UNIX_SOCKET_PATH, decode_responses=True)
ASYNC = redis.asyncio.Redis(unix_socket_path=UNIX_SOCKET_PATH, decode_responses=True)

# Create wrapper functions for databases
relist = functools.partial(Array, redis=REDIS)
redict = functools.partial(Dictionary, redis=REDIS)


def broadcast_sync(channel=GLOBAL_CHANNEL, **parameters):
    # Publish to channel
    REDIS.publish(channel, json.dumps(parameters))


async def broadcast_async(channel=GLOBAL_CHANNEL, **parameters):
    # Publish to channel
    await ASYNC.publish(channel, json.dumps(parameters))


def receive_sync(channel=GLOBAL_CHANNEL, count=0):
    # Count messages
    received = 0

    # Create Pub / Sub subscriber
    with REDIS.pubsub() as subscriber:
        # Subscribe to channel
        subscriber.subscribe(channel)

        # Loop until count is reached
        while (received < count) or (count == 0):
            # Receive message from channel
            message = subscriber.get_message(ignore_subscribe_messages=True)

            # Skip sending if None
            if message is None:
                continue

            # Fetch the message data
            data = message.get("data")

            # Only parse if data is valid
            if not data:
                continue

            # Parse the message
            yield munch.Munch(json.loads(data))

            # Bump the receive count
            received += 1


async def receive_async(channel=GLOBAL_CHANNEL, count=0):
    # Count messages
    received = 0

    # Create Pub / Sub subscriber
    async with ASYNC.pubsub() as subscriber:
        # Subscribe to channel
        await subscriber.subscribe(channel)

        # Loop until count is reached
        while (received < count) or (count == 0):
            # Receive message from channel
            message = await subscriber.get_message(ignore_subscribe_messages=True)

            # Skip sending if None
            if message is None:
                continue

            # Fetch the message data
            data = message.get("data")

            # Only parse if data is valid
            if not data:
                continue

            # Parse the message
            yield munch.Munch(json.loads(data))

            # Bump the receive count
            received += 1
