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

# Upgrade pip and install dependencies
RUN --mount=type=bind,source=resources/requirements.txt,target=/tmp/requirements.txt \
    pip install --no-cache-dir --prefer-binary --upgrade --requirement /tmp/requirements.txt pip ipython

# Copy default configurations
COPY resources/entrypoint.conf /etc/entrypoint.conf

# Copy the sources
COPY src /application

# Change working directory to application
WORKDIR /application/backend

# Set the entrypoint to the entrypoint script
CMD [ "python", "/application/entrypoint.py" ]