#!/usr/bin/env python
# pylint: disable=import-outside-toplevel,wrong-import-position

import os
import sys
import logging
import contextlib

# Append the current directory to the Python PATH
sys.path.append(os.getcwd())

# Import logging formats
from webhood.constants import LOG_LEVEL, LOG_FORMAT, LOG_DATEFORMAT


def main():
    # Setup logging
    logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT, datefmt=LOG_DATEFORMAT)

    # Execute the startup function
    with contextlib.suppress(ImportError):
        # Import the startup function
        from app import startup

        # Execute the function
        startup()

    try:
        # Import the worker function
        from app import worker

        # Execute the function
        worker()
    finally:
        # Execute the shutdown function
        with contextlib.suppress(ImportError):
            # Import the shutdown function
            from app import shutdown

            # Execute the function
            shutdown()


if __name__ == "__main__":
    # Run the main function
    main()
