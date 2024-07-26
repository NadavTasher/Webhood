# Select the base image
FROM webhood/3.8

# Copy configurations
COPY configurations/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY configurations/redis.conf /etc/redis/conf.d/redis.conf
COPY configurations/entrypoint.conf /etc/entrypoint/conf.d/entrypoint.conf

# Copy sources
COPY src /application