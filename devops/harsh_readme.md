# firstly created a dockerfile with no extension containing

## Used official Node.js runtime as base image
FROM node:18

## Set working directory inside the container
WORKDIR /app

## Copy package.json and package-lock.json first
COPY package*.json ./

## Install dependencies
RUN npm install

## Copy the rest of the project files
COPY . .

## Set port environment variable
ENV PORT=3000

## Expose port 3000 (app runs here)
EXPOSE 3000

## Command to start the app
CMD ["npm","start"]

# cmd For the terminal

## now building image we use
build -t node-hello-world .

## docker run cammand
docker run -p 3000:3000 node-hello-world
