+++
title = "Arkham City"
description = "Documentation for the Arkham City project"
+++

# Arkham City

Welcome to the Arkham City documentation. This site provides comprehensive information about the Arkham City project,
including architecture, components, deployment instructions, and development workflow.

## Overview

Arkham City is a modern, scalable application built on a microservice architecture. It provides a robust platform for
managing and analyzing data with a user-friendly dashboard interface. The system is designed for high performance,
reliability, and ease of deployment using containerization.

## Components

The Arkham City project consists of the following main components:

1. **Gateway Service**: A NestJS application that serves as the API gateway.
2. **Microservices**: Three instances of the NestJS application running in microservice mode.
3. **Dashboard**: An Angular web application for the user interface.
4. **Nginx**: A web server that serves the dashboard and routes API requests to the gateway.
5. **MongoDB**: A database for storing application data.
6. **RabbitMQ**: A message broker for communication between services.
7. **Redis**: Used for caching and other temporary storage needs.

## Documentation Sections

- [Core Documentation](/core/) - Documentation for the backend NestJS application
- [Dashboard Documentation](/dashboard/) - Documentation for the frontend Angular application
- [WebSDK Documentation](/websdk/) - Documentation for the Web SDK
