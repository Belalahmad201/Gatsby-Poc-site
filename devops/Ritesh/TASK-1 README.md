# Node.js Express Hello World with docker and docker compose

This project is a simple Node.js + Express web application that is first run locally, then containerized with Docker, and finally deployed using Docker Compose.

#### Prerequisites
1. Git

2. Node.js (LTS version)

3. Docker

4. Docker Compose which comes with docker desktop (can check with docker compose version)

 ### clone the repository
     git clone https://github.com/eMahtab/node-express-hello-world
      cd node-express-hello-world

 ### Run the App locally
    - Install the dependencies
      npm install
  
    - Start the app
      npm start

      now open in broweser - http://localhost:3000
  
 ### Dockerize the App
     Create a file named Dockerfile in the project root


     FROM node:20-alpine

     WORKDIR /app

     COPY package*.json ./
     RUN npm install --production

     COPY . .

     EXPOSE 3000
     CMD ["npm", "start"] 


  ### After creating Dockerfile build the docker image

      docker build -t hello-world:latest .

  ### Run the container

      docker run -d --name Ritesh -p 3000:3000 hello-world:latest

  ### Test in Browser
      http://localhost:3000

  ### Deploy using docker compose
       Create a file named docker-compose.yml in the project root

       services:
          web:
            build: .
            image: hello-world:latest
            ports:
              - "3000:3000"
            environment:
              - NODE_ENV:production
            restart: on-failure


  ### Run with Docker Compose

      docker compose up --build -d

  ### Verify the App
  
      Visit http://localhost:3000

      check logs
      docker compose logs -f

  ### Stop the App

      docker compose down


  ### Useful Commands

     #view images
      docker images

     #view running containers
      docker ps

     #view stopped and running containers
      docker ps -a

     #stop containers
      docker stop container_name

     #remove containers
      docker rm containerID/containerName

     #View container logs
      docker logs containerID/containerName

     #run with docker compose
      docker compose up --build -d

     #stop and remove with docker compose
      docker compose down

### Project Structure
    node-express-hello-world/
    ├── app.js
    ├── package.json
    ├── package-lock.json
    ├── Dockerfile
    ├── docker-compose.yml
    ├── public/
    ├── node_modules/
    ├── routes/
    ├── views/
    └── README.md

### Troubleshooting

- Ensure Docker Desktop is running (Windows/macOS).
- Before starting the docker make sure you have virtualization enabled and wsl is installed.

- Port already in use (3000)
  on windows(Powershell/cmd)
      netstat -ano | findstr :3000
      taskkill /PID <PID> /F
  




