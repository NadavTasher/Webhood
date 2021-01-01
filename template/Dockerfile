# Select the base image
FROM nadavtasher/base

# Install basic utilities
RUN npm install --global node-fetch

# Copy sources
COPY backend backend
COPY frontend frontend

# Set default command
CMD ["application.mjs"]