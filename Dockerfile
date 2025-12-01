# Use official Node.js LTS image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy backend and frontend package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
RUN cd backend && npm install

# Install frontend dependencies
RUN cd frontend && npm install

# Copy backend and frontend source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend for production
RUN cd frontend && npm run build

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "backend/server.js"]
