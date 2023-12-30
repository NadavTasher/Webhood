# Select the base image
FROM python:3.8.18-slim-bullseye

# Upgrade pip and install dependencies
RUN pip install --upgrade pip ipython flask jinja2 gunicorn runtypes

# Install supervisor
RUN apt update
RUN apt -y install supervisor nginx

# Copy default configurations
COPY configurations/nginx.conf /etc/nginx/nginx.conf
COPY configurations/supervisord.conf /etc/supervisor/supervisord.conf

# Copy default sources
COPY src /application

# Change working directory for execution
WORKDIR /opt

# Set default command to run
CMD [ "/usr/bin/supervisord" ]