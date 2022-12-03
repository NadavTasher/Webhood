#

import os  # NOQA

from router import router  # NOQA

from puppy.utilities.process import execute  # NOQA
from puppy.http.server.server import HTTPServer  # NOQA


def create_server(router, path="/opt/ssl.pem"):
    # Make sure certificate exists
    if not os.path.exists(path):
        # Create new certificate
        execute(
            "openssl req -new -x509 -days 3650 -nodes -out %s -keyout %s -subj /"
            % (path, path)
        )

    # Create new server
    server = HTTPServer(router)
    server.context.load_cert_chain(certfile=path, keyfile=path)

    # Return the created server
    return server


# Create the default server
server = create_server(router)
