import logging

# Import utilities
from fsdicts import *
from runtypes import *
from guardify import *

# Import internal router
from router import router, sockets

# Setup the logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


@router.route("/api/ping", methods=["GET", "POST"], optional_echo=Text)
def ping_request(echo="Ping"):
    # Send back the echo
    return "Pong %s" % echo


@sockets.route("/socket/ping")
def pong_socket(socket):
    # Loop until the socket is closed
    while socket.connected:
        # Receive the client text
        ping = socket.receive(10) or "Ping"

        # Send back the name
        socket.send("Pong %r" % ping)
