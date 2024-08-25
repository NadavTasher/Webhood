import os
import time
import json
import munch
import asyncio
import contextlib

# Import redis utilities
import redis
import redis.asyncio

# Import rednest utilities
from rednest import List, Dictionary

# Global broadcast channel
GLOBAL_CHANNEL = "global"

# Redis connection URL
REDIS_URL = os.environ.get("REDIS", "unix:///run/redis.sock")

# Create the default redis connection
REDIS_SYNC = redis.Redis.from_url(REDIS_URL, decode_responses=True)
REDIS_ASYNC = redis.asyncio.Redis.from_url(REDIS_URL, decode_responses=True)

# Patch the dictionary copy type
Dictionary._COPY_TYPE = munch.Munch

# Create wrapper functions for databases
relist = lambda name: List(REDIS_SYNC, name)
redict = lambda name: Dictionary(REDIS_SYNC, name)


def wait_for_redis_sync():
    # Initialize ping response
    ping_response = None

    # Loop until the redis instance can be pinged
    while not ping_response:
        # Ignore busy loading errors
        with contextlib.suppress(redis.BusyLoadingError):
            # Ping the instance
            ping_response = REDIS_SYNC.ping()

        # Sleep a second
        time.sleep(1)


async def wait_for_redis_async():
    # Initialize ping response
    ping_response = None

    # Loop until the redis instance can be pinged
    while not ping_response:
        # Ignore busy loading errors
        with contextlib.suppress(redis.BusyLoadingError):
            # Ping the instance
            ping_response = await REDIS_ASYNC.ping()

        # Sleep a second
        await asyncio.sleep(1)


def broadcast_sync(channel=GLOBAL_CHANNEL, redis=REDIS_SYNC, **parameters):
    # Publish to channel
    redis.publish(channel, json.dumps(parameters))


async def broadcast_async(channel=GLOBAL_CHANNEL, redis=REDIS_ASYNC, **parameters):
    # Publish to channel
    await redis.publish(channel, json.dumps(parameters))


def receive_sync(channel=GLOBAL_CHANNEL, redis=REDIS_SYNC, count=0):
    # Count messages
    received = 0

    # Create Pub / Sub subscriber
    with redis.pubsub() as subscriber:
        # Subscribe to channel
        subscriber.subscribe(channel)

        # Loop until count is reached
        while (received < count) or (count == 0):
            # Receive message from channel
            message = subscriber.get_message(ignore_subscribe_messages=True, timeout=1)

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


async def receive_async(channel=GLOBAL_CHANNEL, redis=REDIS_ASYNC, count=0):
    # Count messages
    received = 0

    # Create Pub / Sub subscriber
    async with redis.pubsub() as subscriber:
        # Subscribe to channel
        await subscriber.subscribe(channel)

        # Loop until count is reached
        while (received < count) or (count == 0):
            # Receive message from channel
            message = await subscriber.get_message(ignore_subscribe_messages=True, timeout=1)

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
