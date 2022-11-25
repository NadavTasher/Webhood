import sys # NOQA
import time  # NOQA
import signal  # NOQA
import logging  # NOQA

from router import router  # NOQA
from server import create_http_server, create_https_server  # NOQA


@router.get("/ping")
def ping(request):
	return True

def exit(*args):
	logging.warn("Here!")
	# Exit!
	sys.exit(1)

def main():
	# Set-up logging to stdout
	logging.basicConfig(level=logging.INFO)

	# Add signal handlers
	# signal.signal(signal.SIGINT, exit)
	# # signal.signal(signal.SIGKILL, exit)
	# signal.signal(signal.SIGTERM, exit)

	# Create HTTP and HTTPS server
	http = create_http_server(router)
	https = create_https_server(router)

	# Start servers
	http.start()
	https.start()

	try:
		while True:
			time.sleep(1)
	finally:
		logging.warn("Here!1")
		http.stop()
		https.stop()

	# Wait for threads to finish
	# http.join()
	# https.join()


if __name__ == "__main__":
	main()
