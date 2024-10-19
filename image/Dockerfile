# The default python version is 3.10
ARG PYTHON_VERSION=3.10

# Select the base image
FROM python:${PYTHON_VERSION}-slim-bookworm

# Expose the HTTP and HTTPs ports
EXPOSE 8080 8443

# Mark /data as a volume directory
VOLUME /data

# Specify stop signal
STOPSIGNAL SIGINT

# Install socat
RUN apt update && \
	apt install -y socat && \
	rm -rf /var/lib/apt/lists

# Copy the requirements file
COPY resources/requirements.txt /tmp/requirements.txt

# Upgrade pip and install dependencies
RUN pip install -U -r /tmp/requirements.txt pip ipython

# Copy default configurations
COPY resources/entrypoint.conf /etc/entrypoint.conf

# Copy the sources
COPY src /application

# Change working directory to application
WORKDIR /application/backend

# Set the entrypoint to the entrypoint script
CMD [ "python", "/application/entrypoint.py" ]

# Create the certificate and the key
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj / -keyout /etc/ssl/private/server.key -out /etc/ssl/private/server.crt