import os
import logging

# Get debug state
DEBUG = bool(int(os.environ.get("DEBUG", 0)))

# Logging formats
LOG_LEVEL = logging.DEBUG if DEBUG else logging.INFO
LOG_FORMAT = "[%(asctime)s] [%(process).4d] [%(levelname).4s] %(message)s"
LOG_DATEFORMAT = "%Y-%m-%d %H:%M:%S %z"

# Add explicit exports
__all__ = ["DEBUG", "LOG_LEVEL", "LOG_FORMAT", "LOG_DATEFORMAT"]
