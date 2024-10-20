#!/usr/bin/env python
# pylint: disable=import-outside-toplevel,wrong-import-position

import os
import sys
import logging
import argparse
import contextlib

# Import uvicorn
import uvicorn
import uvicorn.config

# Append the current directory to the Python PATH
sys.path.append(os.getcwd())

# Import logging formats
from webhood.constants import LOG_LEVEL, LOG_FORMAT, LOG_DATEFORMAT


def main():
    # Setup logging
    logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT, datefmt=LOG_DATEFORMAT)

    # Create argument parser to parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=4)

    # Parse the arguments
    arguments = parser.parse_args()

    # Execute the startup function
    with contextlib.suppress(ImportError):
        # Import the startup function
        from app import startup

        # Execute the function
        startup()

    try:
        # Setup the logging formats
        uvicorn.config.LOGGING_CONFIG["formatters"]["default"]["fmt"] = uvicorn.config.LOGGING_CONFIG["formatters"]["access"]["fmt"] = LOG_FORMAT
        uvicorn.config.LOGGING_CONFIG["formatters"]["default"]["datefmt"] = uvicorn.config.LOGGING_CONFIG["formatters"]["access"]["datefmt"] = LOG_DATEFORMAT

        # Run the application using uvicorn
        uvicorn.run(
            app="app:router",
            factory=True,
            # Host and port to bind
            host="0.0.0.0",
            port=8080,
            # Allow connections from all IPs
            forwarded_allow_ips="*",
            # Enable access log
            access_log=True,
            # Disable Date and Server headers
            date_header=False,
            server_header=False,
            # Number of workers
            workers=arguments.workers,
        )
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
