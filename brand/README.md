## Getting Started

pnpm dev

## Docker

docker build -t eru-labs-brand:latest .
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  eru-labs-brand:latest