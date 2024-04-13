import select
import socket
import logging
import threading

# Setup the logging
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(process)d] [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S %z")

# Create server socket
server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
server.bind("/run/notifier.sock")
server.listen(10)

# List of clients
clients = list()

# Create stop event
EVENT = threading.Event()

# Loop forever - accept clients
try:
    # Loop until finished
    while not EVENT.is_set():
        # Log wait
        logging.info("Still waiting for stop event")

        # Check if there are things to do
        readable, _, _ = select.select([server] + clients, [], [], 1)

        # Check if have new clients
        if server in readable:
            # Accept the new client
            client, _ = server.accept()

            # Append to client list
            clients.append(client)

            # Remove server from list
            readable.remove(server)

        # Loop over readable clients
        for readable_client in readable:
            # Read a single byte from the client
            data = readable_client.recv(1)

            # If data is empty, client has disconnected
            if not data:
                # Remove the client
                clients.remove(readable_client)

                # Continue
                continue

            # Flush to all other clients
            for client in clients:
                if client != readable_client:
                    client.send(data)
finally:
    # Close server
    server.close()

    # Close clients
    for client in clients:
        client.close()
