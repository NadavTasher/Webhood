# Select the base image
FROM python:3.8.18-slim-bullseye

# Install supervisor and NGINX
RUN apt update
RUN apt -y install supervisor nginx

# Upgrade pip and install dependencies
RUN pip install --upgrade pip ipython flask jinja2 gunicorn runtypes

# Copy default configurations
COPY configurations/nginx.conf /etc/nginx/nginx.conf
COPY configurations/supervisor.conf /etc/supervisor/conf.d/supervisord.conf

# Copy default sources
COPY src /application

# Change working directory for execution
WORKDIR /application/backend

# Set default command to run
CMD [ "/usr/bin/supervisord" ]