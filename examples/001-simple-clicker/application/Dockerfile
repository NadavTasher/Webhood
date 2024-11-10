# Select the base image
FROM webhood/3.8:2024.03.31

# Copy configurations
COPY configurations/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY configurations/entrypoint.conf /etc/entrypoint/conf.d/entrypoint.conf

# Copy sources
COPY src /application
