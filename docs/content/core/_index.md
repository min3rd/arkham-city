+++
title = "Core Documentation"
description = "Documentation for the backend NestJS application"
weight = 10
chapter = true
+++

# Core Documentation

This section provides documentation for the Arkham City Core, which is the backend NestJS application.

## Project Structure

The core project is organized into several main components:

- **src/config**: Configuration files
- **src/core**: Core utilities and shared code
- **src/gateway**: API endpoints (controllers)
- **src/microservices**: Microservice implementations
- **src/modules**: Business logic and services
- **src/app.module.ts**: Main application module
- **src/main.ts**: Application entry point
- **src/service.module.ts**: Service module configuration

## Technologies

- **Framework**: NestJS (v11.1.0) - A progressive Node.js framework
- **Language**: TypeScript (v5.8.3)
- **Database**: MongoDB with Mongoose (v8.13.2)
- **Message Broker**: RabbitMQ with amqplib (v0.10.8)
- **Caching**: Redis with ioredis (v5.6.0)
- **Authentication**: JWT with @nestjs/jwt (v11.0.0)
- **Testing**: Jest (v29.7.0)
- **Documentation**: Compodoc (v1.1.26)