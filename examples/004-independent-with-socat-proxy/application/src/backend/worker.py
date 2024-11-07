#!/usr/bin/env python

import logging
import threading

# Import logging formats
from webhood.constants import LOG_LEVEL, LOG_FORMAT, LOG_DATEFORMAT

# Setup logging
logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT, datefmt=LOG_DATEFORMAT)

# Create stop event
EVENT = threading.Event()

# Loop until finished
while not EVENT.is_set():
    # Log wait
    logging.info("Still waiting for stop event")

    # Wait for event
    EVENT.wait(60 * 60)
