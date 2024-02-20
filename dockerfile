FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy all files
COPY . .

# Install npm dependencies for all services
RUN npm install --prefix api-gateway \
  && npm install --prefix counselor \
  && npm install --prefix admin \
  && npm install --prefix user \
  && npm install --prefix notification-service

# Expose ports for each service (assuming each service listens on a different port)
EXPOSE 9000 8001

# Command to start services
CMD ["node", "api-gateway/server.js", "&&", "node", "counselor/server.js"]
