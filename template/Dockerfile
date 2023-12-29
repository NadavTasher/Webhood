# Select the base image
FROM python:3.8.18-slim-bullseye

# Install caddy web server
RUN apt update
RUN apt -y install wget supervisor

# Download and install caddy
ARG TARGETPLATFORM
RUN wget -O ./caddy.deb https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_${TARGETPLATFORM///_}_.deb && \
	apt -y install ./caddy.deb && \
	rm ./caddy.deb

# Upgrade pip and install dependencies
RUN pip install --upgrade pip ipython flask jinja2 gunicorn runtypes

# Copy default configurations
# COPY configurations/nginx.conf /etc/nginx/sites-available/default
COPY configurations/supervisor.conf /etc/supervisor/conf.d/supervisord.conf

# Copy default sources
COPY src /application

# Change working directory for execution
WORKDIR /application/backend

# Set default command to run
CMD [ "/usr/bin/supervisord" ]