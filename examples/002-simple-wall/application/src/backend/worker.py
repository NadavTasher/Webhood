import time
import logging
import threading

from globals import DATABASE, MAX_AGE_SECONDS

# Setup the logging
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(process)d] [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S %z")

# Create stop event
EVENT = threading.Event()

# Loop until finished
while not EVENT.is_set():
    # Log wait
    logging.info("Deleting posts older then %d seconds", MAX_AGE_SECONDS)

    # Loop over posts and delete old posts
    for timestamp, message in DATABASE.items():
        if time.time() - timestamp > MAX_AGE_SECONDS:
            del DATABASE[timestamp]

    # Wait for event
    EVENT.wait(60)
