Node.js Express Hello World with Docker


Make sure these are installed on your system:

Git

Node.js (LTS version)

Docker Desktop for Windows

#git --version

#node -v

#npm -v

#docker --version

#docker compose version

Installation & Setup

#Clone the repository

git clone https://github.com/eMahtab/node-express-hello-world.git
cd node-express-hello-world

#Create a Dockerfile in project root

# Use Node.js LTS base image
FROM node18/alpine:18.19.3

# Set working directory
WORKDIR /usr/src/app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]

Build the Docker image

#docker build -t maharathi .

#Run the container

docker run -d -p 3000:3000 --name node-app maharathi

#Deploy Using Docker Compose
version: "3.9"
services:
  web:
    build: .
    ports:
      - "3000:3000"

#Run with Docker Compose

docker compose up --build

#Stop the App

docker compose down


Summary

Run locally with npm start

Run with Docker using docker build & docker run

Deploy with Docker Compose using docker compose up
