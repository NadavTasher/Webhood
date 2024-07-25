# Import utilities
from runtypes import *
from guardify import *

# Import the router
from router import PlainTextResponse, router, initialize
from database import redict, relist


@router.get("/api/code", optional_head=int)
def code_request(head=None):
    # Read the uptime
    with open(__file__, "r") as code_file:
        code = code_file.read()

    # If all data is to be returned, return all
    if head is None:
        return PlainTextResponse(code)

    # Split code to lines
    lines = code.splitlines(keepends=True)

    # Take only specific lines
    assert 0 < head <= len(lines), "Head range invalid"

    # Take just the first "head" lines
    return PlainTextResponse(str().join(lines[:head]))


@router.post("/api/ping", optional_echo=Text, optional_content_type=Text, optional_content_data=Bytes)
def ping_request(echo=None, content_type=None, content_data=None):
    return "Ping %r" % (echo or content_data)


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
