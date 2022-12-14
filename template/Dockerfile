# Select the base image
FROM python:3.11.1-bullseye

# Install ipython for easy debugging
RUN pip install ipython

# Copy puppy to site-packages
COPY puppy/puppy /usr/local/lib/python3.11/site-packages/puppy

# Copy default sources
COPY backend /application/backend
COPY frontend /application/frontend

# Change working directory for execution
WORKDIR /application/backend

# Set default command to run
CMD [ "python", "app.py" ]