import os

# Get debug state
DEBUG = bool(int(os.environ.get("DEBUG", 0)))
