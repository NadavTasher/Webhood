# Import database class
from fsdicts import localdict

# Create post database
DATABASE = localdict("/opt/database")

# Cross-worker notifier
CHANNEL = "wall"

# Maximum age for a post
MAX_AGE_SECONDS = 120
