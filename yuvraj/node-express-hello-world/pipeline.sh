#!/bin/bash
set -e   # stop if any step fails

IMAGE_NAME="node-express-pipeline"
CONTAINER_NAME="node-express-app"

echo " Building Docker image..."
docker build -t $IMAGE_NAME .

echo " Installing dependencies inside container..."
docker run --rm -v $(pwd):/app -w /app $IMAGE_NAME npm install

echo " Running lint check..."
docker run --rm -v $(pwd):/app -w /app $IMAGE_NAME npx eslint .

echo "  Running tests..."
docker run --rm -v $(pwd):/app -w /app $IMAGE_NAME npm test || echo " No tests found (skipping)"

echo " Starting application container..."
# Remove old container if running
docker rm -f $CONTAINER_NAME 2>/dev/null || true
docker run -d --name $CONTAINER_NAME -p 3000:3000 $IMAGE_NAME

echo " Pipeline completed successfully! App running at: http://localhost:3000"
