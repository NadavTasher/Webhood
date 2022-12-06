# Select the base image
FROM python:2.7.18-buster

# Install ipython for easy debugging
RUN pip install ipython

# Copy puppy to site-packages
COPY puppy/puppy /usr/local/lib/python2.7/site-packages/puppy

# Copy default sources
COPY sources/backend /application/backend
COPY sources/frontend /application/frontend

# Change working directory for execution
WORKDIR /application/backend

# Set default command to run
CMD [ "python", "app.py" ]