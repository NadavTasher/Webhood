import ssl # NOQA
import time # NOQA
import logging  # NOQA

from router import APIRouter  # NOQA

from puppy.thread.future import future # NOQA
from puppy.http.server.server import HTTPSServer, HTTPServer  # NOQA

# Define the router and add static files
router = APIRouter()
router.static("../frontend", indexes=["index.htm", "index.html"])

@future
def run_http_server():
	# Create an HTTP server
	http_server = HTTPServer(("0.0.0.0", 80), router)

	# Serve HTTP forever
	try:
		http_server.serve_forever()
	finally:
		http_server.shutdown()

@future
def run_https_server():
	# Create an HTTPs server
	https_server = HTTPSServer(("0.0.0.0", 443), router)
	https_server.context.load_cert_chain(certfile="/opt/cert.pem", keyfile="/opt/cert.pem")

	# Serve HTTP forever
	try:
		https_server.serve_forever()
	finally:
		https_server.shutdown()

def main():
	# Set-up logging to stdout
	logging.basicConfig(level=logging.INFO)

	# Run all servers
	run_http_server()
	run_https_server()

	# Wait for signal
	while True:
		time.sleep(1)