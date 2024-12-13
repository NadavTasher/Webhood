# The default python version is 3.10
ARG PYTHON_VERSION=3.10

# Select the base image
FROM python:${PYTHON_VERSION}-slim-bookworm

# We use the python version argument
ARG PYTHON_VERSION

# Expose the HTTP and HTTPs ports
EXPOSE 8080 8443

# Mark /data as a volume directory
VOLUME /data

# Specify stop signal
STOPSIGNAL SIGINT

# Upgrade pip and install dependencies
RUN --mount=type=bind,source=requirements.txt,target=requirements.txt \
	pip install --no-cache-dir --prefer-binary --upgrade --requirement requirements.txt pip ipython

# Copy the webhood library
COPY webhood /usr/local/lib/python${PYTHON_VERSION}/webhood

# Copy the sources
COPY src /application

# Change working directory to application
WORKDIR /application/backend

# Set the entrypoint to the entrypoint script
CMD [ "python", "/application/server.py" ]
