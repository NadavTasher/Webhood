# Select the base image
FROM python:2.7.18-buster

# Install ipython for easy debugging
RUN pip install ipython

# Copy puppy library to packages
WORKDIR /usr/local/lib/python2.7/site-packages
COPY puppy/puppy puppy

# Change working directory and copy sources
WORKDIR /application
COPY sources/backend backend
COPY sources/frontend frontend

# Change working directory for execution
WORKDIR /application/backend
CMD [ "python", "app.py" ]