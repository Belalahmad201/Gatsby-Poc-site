# Install git
sudo apt install -y git
git --version

# Install node.js
curl -fsSL https://deb.nodesource.com/setup\_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v

# Install npm dependencies
npm install
npm -v

# Install Docker and Docker-Compose
sudo apt install docker.io docker-compose
sudo systemctl start docker
docker --version
docker-compose --version

# clone the repository
git clone https://github.com/eMahtab/node-express-hello-world
ls 
cd node-express-hello-world

# install and start the npm
npm install
npm start

# check the node app is running on port 3000
curl http://localhost:3000

# Create a dockerfile 
vi Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package\*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
ENV PORT=3000
CMD \["npm", "start"]

# create docker image 
docker build -t node-app:latest .

# run the container from image 
docker run -d --name hexa-app -p 3000:3000 node-app:latest

# check the node app is running 
curl http://localhost:3000

# create a docker-compose file
vi docker-compose.yml
version: "3.8"
services:
app:
   build: .
  container\_name: node-app
   ports:
     - "3000:3000"
restart: unless-stopped

# run docker-compose file
 docker-compose up --build -d

# check the running process
docker ps

# check the node app running
curl http://localhost:3000















