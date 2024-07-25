import redis

# Import types from rednest
from rednest import Dictionary, Array

# Create a generic redis connection
REDIS = redis.Redis(unix_socket_path="/run/redis.sock", decode_responses=True)


# Create wrapper functions for databases
def redict(name):
    return Dictionary(name, REDIS)


def relist(name):
    return Array(name, REDIS)
