# Select the base image
FROM node:14
# Copy frontend & backend to working directory
COPY frontend frontend
COPY backend backend
# Application entrypoint
CMD ["node", "backend/server.js"]