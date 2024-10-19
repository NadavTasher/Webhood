#!/usr/bin/env python

import logging
import threading

# Setup the logger
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(process).4d] [%(levelname).4s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S %z")

# Create stop event
EVENT = threading.Event()

# Loop until finished
while not EVENT.is_set():
    # Log wait
    logging.info("Still waiting for stop event")

    # Wait for event
    EVENT.wait(60 * 60)
