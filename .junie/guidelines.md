# Arkham City Development Guidelines

This document provides essential information for developers working on the Arkham City project.

## Build/Configuration Instructions

### Prerequisites

- Node.js >= 18
- Docker and Docker Compose
- MongoDB and Redis (provided via Docker)

### Setting Up the Core Project

1. Navigate to the core project directory:
   ```bash
   cd arkham-city/arkham-city-core
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start required services (MongoDB and Redis):
   ```bash
   cd ..  # Return to project root
   docker compose -f docker-compose-dev.yml up -d
   ```

5. Start the development server:
   ```bash
   cd arkham-city-core
   npm run start:dev  # For hot-reload development
   # OR
   npm run start:debug  # For debugging
   # OR
   npm run start:prod  # For production mode
   ```

### Setting Up the Dashboard Project

1. Navigate to the dashboard project directory:
   ```bash
   cd arkham-city/arkham-city-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Testing Information

### Core Project Testing

The core project uses Jest for testing. Tests are located in files with the `.spec.ts` extension, typically next to the
file they're testing.

#### Running Tests

- Run all tests:
  ```bash
  cd arkham-city-core
  npm test
  ```

- Run tests with watch mode:
  ```bash
  npm run test:watch
  ```

- Run tests with coverage:
  ```bash
  npm run test:cov
  ```

- Run end-to-end tests:
  ```bash
  npm run test:e2e
  ```

#### Creating Tests

1. Create a new file with the `.spec.ts` extension next to the file you want to test.
2. Follow the NestJS testing pattern:
    - For services and providers:
      ```typescript
      import { Test, TestingModule } from '@nestjs/testing';
      import { YourService } from './your.service';
      
      describe('YourService', () => {
        let service: YourService;
      
        beforeEach(async () => {
          const module: TestingModule = await Test.createTestingModule({
            providers: [YourService],
          }).compile();
      
          service = module.get<YourService>(YourService);
        });
      
        it('should be defined', () => {
          expect(service).toBeDefined();
        });
        
        // Add more tests here
      });
      ```

    - For static utility classes:
      ```typescript
      import { YourUtilityClass } from './your-utility.class';
      
      describe('YourUtilityClass', () => {
        it('should perform expected operation', () => {
          const result = YourUtilityClass.someMethod();
          expect(result).toEqual(expectedValue);
        });
        
        // Add more tests here
      });
      ```

### Dashboard Project Testing

The dashboard project uses Karma and Jasmine for testing. Tests are configured but no tests have been implemented yet.

#### Running Tests

```bash
cd arkham-city-dashboard
npm test
```

#### Creating Tests

1. Create a new file with the `.spec.ts` extension next to the file you want to test.
2. Follow the Angular testing pattern:
   ```typescript
   import { ComponentFixture, TestBed } from '@angular/core/testing';
   import { YourComponent } from './your.component';
   
   describe('YourComponent', () => {
     let component: YourComponent;
     let fixture: ComponentFixture<YourComponent>;
   
     beforeEach(async () => {
       await TestBed.configureTestingModule({
         declarations: [YourComponent]
       }).compileComponents();
   
       fixture = TestBed.createComponent(YourComponent);
       component = fixture.componentInstance;
       fixture.detectChanges();
     });
   
     it('should create', () => {
       expect(component).toBeTruthy();
     });
     
     // Add more tests here
   });
   ```

### Example Test

Here's an example of a test for the HashService utility class:

```typescript
import { HashService } from './hash.service';

describe('HashService', () => {
  const testValue = 'test-value';
  const testKey = 'test-key';

  describe('hash and compare', () => {
    it('should hash a value', () => {
      const hashed = HashService.hash(testValue);
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toEqual(testValue);
    });

    it('should correctly compare a value with its hash', () => {
      const hashed = HashService.hash(testValue);
      const result = HashService.compare(testValue, hashed);
      expect(result).toBe(true);
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt a value', () => {
      const encrypted = HashService.encrypt(testValue, testKey);
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toEqual(testValue);
    });

    it('should correctly decrypt an encrypted value', () => {
      const encrypted = HashService.encrypt(testValue, testKey);
      const decrypted = HashService.decrypt<string>(encrypted, testKey);
      expect(decrypted).toEqual(testValue);
    });
  });
});
```

## Code Style and Development Guidelines

### Code Formatting

- The project uses ESLint and Prettier for code formatting and linting.
- Run linting:
  ```bash
  npm run lint
  ```
- Run formatting:
  ```bash
  npm run format
  ```

### Core Project Structure

- `src/gateway`: API endpoints (controllers)
- `src/microservice`: Message broker subscribers
- `src/modules`: Services and business logic
- `src/core`: Shared utilities, guards, interceptors, etc.

### Naming Conventions

- Files: kebab-case (e.g., `your-service.ts`)
- Classes: PascalCase (e.g., `YourService`)
- Methods and properties: camelCase (e.g., `yourMethod()`)
- Constants: UPPER_SNAKE_CASE (e.g., `YOUR_CONSTANT`)

### API Response Format

All API responses are formatted using a response interceptor to follow this structure:

```json
{
  "error": false,
  "timestamp": "2025-03-16T08:29:22.730Z",
  "data": {}
}
```

### Documentation

- Generate API documentation:
  ```bash
  cd arkham-city-core
  npm run compodoc
  ```

### Microservice Architecture

The project uses a microservice architecture where services communicate via message brokers. When the system scales,
multiple instances of a microservice can subscribe to the same message type, allowing for distributed processing.