# Select the base image
FROM nadavtasher/base

# Create volume
VOLUME /opt

# Copy sources
COPY backend backend
COPY frontend frontend

# Set default command
CMD ["application.mjs"]