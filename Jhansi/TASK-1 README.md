 ##DevOps Intern Assignment

 1. Installing Tools
# git --version
# node -v
# npm -v
# docker --version
# docker compose version

2. Clone and Run the App Locally
# Clone the repo
git clone https://github.com/eMahtab/node-express-hello-world.git
# Move into the folder
cd node-express-hello-world
# Install dependencies
npm install
# Start the app
npm start
Open: http://localhost:3000

3. 🐳 Dockerize the App
# Create Dockerfile
cat > Dockerfile <<EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF
# Build Docker image
docker build -t node-hello-world .
# Run the container
docker run -d -p 3000:3000 --name node-hello node-hello-world
# Check containers:
# docker ps
# Stop & remove container
# docker stop node-hello
# docker rm node-hello
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF
4. Deploy with Docker Compose
# Create docker-compose.yml
cat > docker-compose.yml <<EOF
version: "3.8"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    container_name: node-hello-app
EOF
# Run with Compose
# docker compose up -d
Verify
# docker ps
Open http://localhost:3000
# Stop Compose 
# docker compose down
5. Add README.md
