#!/usr/bin/env python
# pylint: disable=import-outside-toplevel,wrong-import-position

import os
import sys
import asyncio
import inspect
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

        # If the function is a coroutine, execute using asyncio
        if inspect.iscoroutinefunction(startup):
            asyncio.run(startup())
        else:
            startup()

    try:
        # Import the worker function
        from app import worker

        # If the function is a coroutine, execute using asyncio
        if inspect.iscoroutinefunction(worker):
            asyncio.run(worker())
        else:
            worker()
    finally:
        # Execute the shutdown function
        with contextlib.suppress(ImportError):
            # Import the shutdown function
            from app import shutdown

            # If the function is a coroutine, execute using asyncio
            if inspect.iscoroutinefunction(shutdown):
                asyncio.run(shutdown())
            else:
                shutdown()


if __name__ == "__main__":
    # Run the main function
    main()
