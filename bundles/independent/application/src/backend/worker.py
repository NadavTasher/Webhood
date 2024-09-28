#!/usr/bin/env python

import logging
import threading

# Setup the logging
logging.basicConfig(level=logging.INFO, format="%(process)d:W %(asctime)s * %(message)s", datefmt="%d %b %Y %H:%M:%S.000")

# Create stop event
EVENT = threading.Event()

# Loop until finished
while not EVENT.is_set():
    # Log wait
    logging.info("Still waiting for stop event")

    # Wait for event
    EVENT.wait(60 * 60)
