import logging  # NOQA

from router import router  # NOQA
from server import server  # NOQA


@router.get("/ping")
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
