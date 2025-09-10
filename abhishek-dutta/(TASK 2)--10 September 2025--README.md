# Node.js Express Hello World with Docker CI Pipeline

A Node.js web application with a local CI/CD pipeline using Docker, including automated testing and linting with fail-fast behavior.

## 🚀 Features

- Simple Express.js web server
- Dockerized application
- Local CI pipeline with fail-fast on linting errors
- Automated testing with Jest
- ESLint for code quality
- Docker Compose deployment

## 📋 Prerequisites

- Git
- Node.js (LTS version)
- Docker Desktop
- VS Code (recommended for Windows users)

### Windows Setup
1. Install Docker Desktop for Windows
2. Ensure WSL2 is enabled
3. Use Git Bash or PowerShell to run bash scripts

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/eMahtab/node-express-hello-world.git
cd node-express-hello-world
```

### 2. Add Pipeline Files
Create the following files in your project directory:
- `pipeline.sh` (from this assignment)
- `.eslintrc.js`
- `app.test.js`
- Update `package.json` with lint and test scripts

### 3. Install Dependencies Locally (Optional)
```bash
npm install
```

## 🔄 CI Pipeline

### Pipeline Features
✅ **Fail-Fast Behavior**: If linting fails, build and deployment are stopped  
✅ **Automated Testing**: Runs Jest tests  
✅ **Code Quality**: ESLint checks  
✅ **Health Checks**: Verifies application is running  
✅ **Colored Output**: Clear visual feedback  

### Running the Pipeline

#### On Linux/Mac:
```bash
chmod +x pipeline.sh
./pipeline.sh
```

#### On Windows (Git Bash):
```bash
chmod +x pipeline.sh
./pipeline.sh
```

#### On Windows (PowerShell):
```powershell
bash pipeline.sh
```

### Pipeline Steps

1. **Docker Check** - Verifies Docker is running
2. **Build Image** - Creates Docker image from Dockerfile
3. **Install Dependencies** - Runs npm install in container
4. **Linting** - Runs ESLint (FAILS FAST if errors found)
5. **Testing** - Runs Jest tests (FAILS FAST if tests fail)
6. **Production Build** - Only builds if all checks pass
7. **Deployment** - Deploys with Docker Compose
8. **Health Check** - Verifies application is accessible

## 🧪 Testing & Linting

### Run Tests Locally
```bash
npm test
```

### Run Linting
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

## 🐳 Docker Commands

### Build Image Manually
```bash
docker build -t node-app-ci .
```

### Run Container
```bash
docker run -d -p 3000:3000 --name my-node-app node-app-ci
```

### Docker Compose
```bash
docker compose up -d
docker compose down
docker compose logs
```

## 📁 Project Structure

```
node-express-hello-world/
├── app.js                 # Main application file
├── app.test.js           # Test file
├── .eslintrc.js          # ESLint configuration
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── package.json          # Node.js dependencies and scripts
├── pipeline.sh           # CI pipeline script
└── README.md            # This file
```

## 🔍 Pipeline Output Example

```
================================================
       LOCAL CI PIPELINE FOR NODE.JS APP       
================================================

[PIPELINE] Checking Docker status...
[PIPELINE] Building Docker image...
[PIPELINE] Running container and installing dependencies...
[PIPELINE] Installing npm dependencies...
[PIPELINE] Running linting checks...
[PIPELINE] Linting passed successfully ✓
[PIPELINE] Running tests...
[PIPELINE] Tests passed successfully ✓
[PIPELINE] Building production-ready image...
[PIPELINE] Deploying application with Docker Compose...
[PIPELINE] Performing health check...
[PIPELINE] Application is running at http://localhost:3000 ✓

================================================
    PIPELINE COMPLETED SUCCESSFULLY! ✓
================================================
```

## ⚠️ Fail-Fast Behavior

The pipeline implements fail-fast behavior:

1. **If linting fails** → Pipeline stops, no build or deployment
2. **If tests fail** → Pipeline stops, no deployment
3. **If build fails** → Pipeline stops with error

Example of failed linting:
```
[PIPELINE] Running linting checks...
[ERROR] Linting failed! Fix the linting errors before proceeding.
[WARNING] Build and deployment stopped due to linting errors.
```

## 🛠️ Troubleshooting

### Windows Issues

1. **Permission Denied on pipeline.sh**
   ```bash
   chmod +x pipeline.sh
   ```

2. **Docker not found**
   - Ensure Docker Desktop is running
   - Restart Docker Desktop

3. **Port 3000 in use**
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Common Issues

1. **Linting Errors**
   ```bash
   npm run lint:fix  # Auto-fix issues
   npm run lint      # Check remaining issues
   ```

2. **Test Failures**
   ```bash
   npm test -- --verbose  # Run with detailed output
   ```

3. **Container Already Exists**
   ```bash
   docker rm -f node-app-test
   ```

## 📸 Screenshots

To capture successful pipeline run:

### Windows (PowerShell):
```powershell
./pipeline.sh | Tee-Object -FilePath pipeline-output.txt
```

### Linux/Mac:
```bash
./pipeline.sh | tee pipeline-output.txt
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## 📝 Assignment Deliverables Checklist

- [x] `pipeline.sh` script with fail-fast behavior
- [x] Updated README with run instructions
- [x] Linting configuration (`.eslintrc.js`)
- [x] Test file (`app.test.js`)
- [x] Updated `package.json` with scripts
- [x] Updated `Dockerfile` with dev dependencies
- [ ] Screenshot of successful pipeline run

---

**Note**: The pipeline ensures code quality by stopping deployment if linting or tests fail, maintaining high standards for production deployments.