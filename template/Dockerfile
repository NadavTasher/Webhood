# Select the base image
FROM webhood/base

# Set image metadata
LABEL maintainer="hey@nadav.app"
LABEL description="The Webhood template image"

# Change working directory and copy scripts
WORKDIR /bin

# Copy scripts
COPY scripts/application application
COPY scripts/console console

# Add execution permissions
RUN chmod +x application console

# Change working directory and copy sources
WORKDIR /project

# Copy sources
COPY sources/backend backend
COPY sources/frontend frontend

# Set default command
CMD ["application"]