# Import utilities
from fsdicts import *
from runtypes import *
from guardify import *

# Import the router
from router import router, initialize


@router.post("/api/ping", type_echo=Text)
def ping_request(echo):
    return "Ping %s" % echo


@router.socket("/socket/ping", optional_initial=Text)
async def ping_socket(websocket, initial="Ping"):
    # Send the initial string
    await websocket.send_text(initial)

    # Loop until client closes
    while websocket:
        # Receive the next string from the client
        next_string = await websocket.receive_text()

        # Send the same string
        await websocket.send_text(next_string)


# Initialize the application
app = initialize()
