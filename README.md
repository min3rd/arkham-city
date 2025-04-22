# Arkham City Deployment

This repository contains Docker configuration files for deploying the Arkham City application stack.

## Components

The deployment consists of the following components:

1. **Gateway Service**: A NestJS application that serves as the API gateway.
2. **Microservices**: Three instances of the NestJS application running in microservice mode.
3. **Dashboard**: An Angular web application for the user interface.
4. **Nginx**: A web server that serves the dashboard and routes API requests to the gateway.
5. **MongoDB**: A database for storing application data.
6. **Redis**: A message broker for communication between services.

## Deployment Instructions

### Prerequisites

- Docker and Docker Compose installed on your system
- Git repository cloned to your local machine

### Steps to Deploy

1. Build and start all services:

```bash
docker-compose up -d
```

2. To view logs from all services:

```bash
docker-compose logs -f
```

3. To view logs from a specific service:

```bash
docker-compose logs -f <service-name>
```

Where `<service-name>` can be one of: `gateway`, `microservice1`, `microservice2`, `microservice3`, `dashboard`,
`nginx`, `mongo`, `redis`.

### Accessing the Application

- **Dashboard**: Access the web dashboard at http://localhost/
- **API**: Access the API directly at http://localhost:3000/ or through Nginx at http://localhost/api/

## Architecture

- The **Gateway Service** handles HTTP API requests and communicates with microservices via Redis.
- The **Microservices** process tasks asynchronously, communicating via Redis.
- The **Dashboard** provides a web interface for users.
- **Nginx** serves the dashboard and routes API requests to the gateway.
- **MongoDB** stores application data in two databases: metadata and firestore.
- **Redis** serves as a message broker for communication between services.

## Configuration

The services are configured using environment variables defined in the docker-compose.yml file. You can modify these
variables to customize the deployment.

## Scaling

To scale the number of microservice instances:

```bash
docker-compose up -d --scale microservice1=3 --scale microservice2=3 --scale microservice3=3
```

This will start 3 instances of each microservice type.