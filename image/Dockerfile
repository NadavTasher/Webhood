# The default python version is 3.10
ARG PYTHON_VERSION=3.10

# Select the base image
FROM python:${PYTHON_VERSION}-slim-bookworm

# Copy the requirements file
COPY requirements.txt /tmp/requirements.txt

# Upgrade pip and install dependencies
RUN pip install -U -r /tmp/requirements.txt pip ipython

# Copy default configurations
COPY configurations/entrypoint.conf /etc/entrypoint/entrypoint.conf

# Copy the sources
COPY src /application

# Expose the HTTP and HTTPs ports
EXPOSE 80 443

# Mark /data as a volume directory
VOLUME /data

# Change working directory to application
WORKDIR /application/backend

# Specify stop signal
STOPSIGNAL SIGINT

# Set the entrypoint to the entrypoint script
CMD [ "python", "/application/entrypoint.py" ]

# Create the certificate and the key
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj / -keyout /etc/ssl/private/server.key -out /etc/ssl/private/server.crt