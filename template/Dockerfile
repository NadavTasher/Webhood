# Select the base image
FROM python:2.7.18-buster

# Install ipython for easy debugging
RUN pip install ipython

# Install tlslite for encryption
RUN pip install tlslite

# Copy startup scripts to bin and set permissions
COPY scripts/application /bin/application
COPY scripts/console /bin/console
RUN chmod +x /bin/application /bin/console

# Copy puppy library to packages
WORKDIR /usr/local/lib/python2.7/site-packages
COPY puppy/puppy puppy

# Change working directory and copy sources
WORKDIR /application
COPY sources/backend backend
COPY sources/frontend frontend

# Change working directory for execution
WORKDIR /application/backend
# STOPSIGNAL SIGINT
# ENTRYPOINT [ "python" ]
CMD ["application"]

RUN openssl req -new -x509 -days 365 -nodes -out /opt/cert.pem -keyout /opt/cert.pem -subj /