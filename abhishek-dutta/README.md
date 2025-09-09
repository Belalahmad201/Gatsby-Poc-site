markdown
# Node.js Express Hello World with Docker

A simple Node.js web application containerized with Docker and deployed using Docker Compose.

## Prerequisites

- Git
- Node.js (LTS version)
- Docker Desktop for Windows

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/eMahtab/node-express-hello-world.git
cd node-express-hello-world

### 2. Run locally without Docker
bash
npm install
npm start
Visit: http://localhost:3000


### 3. Build and run with Docker
    bash
    # Build the image
    docker build -t node-hello-world .
    # Run the container
    docker run -d -p 3000:3000 --name  node-app node-hello-world

####4. Deploy with Docker Compose
    bash
    docker compose up -d


###Access the Application

Local: http://localhost:3000
Docker Container: http://localhost:3000

###Useful Commands
    bash
    # View running containers
    docker ps
    # View container logs
    docker logs node-app
    # Stop container
    docker stop node-app
    # Remove container
    docker rm node-app
    # Stop and remove with compose
    docker compose down


### Project Structure
      node-express-hello-world/
      ├── Dockerfile
      ├── docker-compose.yml
      ├── package.json
      ├── app.js
      └── README.md

### Troubleshooting for Windows
If Docker commands don't work:
      1.Make sure Docker Desktop is running
      2.Run VS Code as Administrator
      3.Check if virtualization is enabled in BIOS

If port 3000 is busy:
      cmd
      # Find process using port 3000
      netstat -ano | findstr :3000

      # Kill the process (replace PID with actual number)
      taskkill /PID <PID> /F

If you get permission errors:Run PowerShell or Command Prompt as Administrator

Final Verification :
     After completing all steps, you should see "Hello World!"when visiting http://localhost:3000 in your browser.

     The application is now successfully containerized andrunning with Docker Compose on your Windows machine!



## To create this file in VS Code:

1. **Open the project folder** in VS Code
2. **Create a new file**: Right-click in the file explorer → "New File"
3. **Name it**: `README.md`
4. **Paste the content** above
5. **Save the file**: Ctrl + S

Your README is now complete and professional! It includes:
- ✅ Clear prerequisites
- ✅ Step-by-step instructions
- ✅ Useful commands
- ✅ Project structure
- ✅ Windows-specific troubleshooting
- ✅ Final verification steps

Well done! This documentation will help anyone (including your future self) understand and run your project easily.