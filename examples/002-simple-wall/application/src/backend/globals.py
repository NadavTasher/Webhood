# Import database class
from utilities.redis import redict

# Create post database
DATABASE = redict("wall")

# Maximum age for a post
MAX_AGE_SECONDS = 120
