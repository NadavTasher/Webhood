import ssl  # NOQA
import time  # NOQA
import logging  # NOQA
import threading  # NOQA

from puppy.http.server.server import HTTPSServer, HTTPServer  # NOQA


def create_http_server(router):
	# Create HTTP server
	server = HTTPServer(("0.0.0.0", 80), router)

	# Create app server from server
	return AppServer(server)


def create_https_server(router):
	# Create HTTPS server
	server = HTTPSServer(("0.0.0.0", 443), router)
	server.context.load_cert_chain(certfile="/opt/cert.pem", keyfile="/opt/cert.pem")

	# Create app server from server
	return AppServer(server)


class AppServer(threading.Thread):
	def __init__(self, server):
		# Initialize the thread
		super(AppServer, self).__init__()

		# Set internal state
		# self.daemon = True

		# Set the internal server
		self.server = server

	def stop(self):
		# Shut the server down
		self.server.shutdown()

	def run(self):
		try:
			# Try looping forever
			self.server.serve_forever()
		finally:
			# Close the server after
			self.server.close_server()
