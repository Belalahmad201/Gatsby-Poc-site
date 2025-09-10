#Node Express Hello World

##steps 


###Run Locally
1-npm install
2-start the npm(npm start)
3-open http://localhost:3000


###Run with Docker
#->after creating Dockerfile
1-docker build -t node-express-hello-world .
docker run -d -p 3000:3000 node-express-hello-world

###Run with Docker-compose
#->after creating docker-compose.yml file
1-docker-compose up --build
open http://localhost:3000
