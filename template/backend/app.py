import logging

from router import router
from server import server


@router.get("ping")
@router.post("ping")
def ping(request):
    return True


def main():
    # Set-up logging to stdout
    logging.basicConfig(level=logging.INFO)

    try:
        # Start the server
        server.start()

        # Wait for server to stop
        while not server.stopped:
            server.join(1)
    finally:
        server.stop()


if __name__ == "__main__":
    main()
