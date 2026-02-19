# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build arguments for Vite env vars (passed during build time)
ARG VITE_API_URL
ARG VITE_STUDENT_USERNAME
ARG VITE_STUDENT_PASSWORD
ARG VITE_ADMIN_USERNAME
ARG VITE_ADMIN_PASSWORD

# Set them as ENV so the 'npm run build' process can see them
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STUDENT_USERNAME=$VITE_STUDENT_USERNAME
ENV VITE_STUDENT_PASSWORD=$VITE_STUDENT_PASSWORD
ENV VITE_ADMIN_USERNAME=$VITE_ADMIN_USERNAME
ENV VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD

# Build the app
RUN npm run build

# Run stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
