import os
import redis

# Create a generic redis connection
DATABASE = redis.Redis(host=os.environ.get("REDIS_HOST", "localhost"), port=int(os.environ.get("REDIS_PORT", 6379)), decode_responses=True)
