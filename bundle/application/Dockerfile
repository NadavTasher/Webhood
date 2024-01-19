# Select the base image
FROM webhood/3.8

# Copy configurations
COPY configurations/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY configurations/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy sources
COPY src /application