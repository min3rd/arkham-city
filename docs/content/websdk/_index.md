+++
title = "WebSDK Documentation"
description = "Documentation for the Web SDK"
weight = 30
chapter = true
+++

# WebSDK Documentation

This section provides documentation for the Arkham City WebSDK, which is a client-side SDK for integrating with the
Arkham City backend services.

## Installation

```bash
# Using npm
npm install arkham-city-websdk

# Using yarn
yarn add arkham-city-websdk
```

## Configuration

Before using the SDK, you need to configure it with your project details:

```typescript
import { globalConfig } from 'arkham-city-websdk/dist/manager';

// Initialize the SDK in your app's entry point
globalConfig({
  url: 'http://your-arkham-city-backend-url',  // Backend URL
  version: 'v1',                               // API version
  projectId: 'your-project-id',                // Project ID from Arkham City dashboard
  appId: 'your-app-id',                        // App ID from Arkham City dashboard
  secretKey: 'your-secret-key',                // Secret key from Arkham City dashboard
  isProductionMode: true,                      // Set to false for development
});
```

## Features

The WebSDK provides the following main features:

### Firestore-like Database

The SDK provides a Firestore-like interface for data operations:

```typescript
import { firestore } from 'arkham-city-websdk/dist/firestore';

// Query documents
firestore('collection-name')
  .select<InputType, OutputType>({ /* query parameters */ })
  .subscribe(result => {
    console.log('Query result:', result);
  });

// Get a document by ID
firestore('collection-name')
  .get<DocumentType>(documentId)
  .subscribe(document => {
    console.log('Document:', document);
  });

// Create a document
firestore('collection-name')
  .create<InputType, OutputType>(data)
  .subscribe(createdDocument => {
    console.log('Created document:', createdDocument);
  });

// Update a document
firestore('collection-name')
  .update<InputType, OutputType>(documentId, data)
  .subscribe(updatedDocument => {
    console.log('Updated document:', updatedDocument);
  });

// Delete a document
firestore('collection-name')
  .delete<boolean>(documentId)
  .subscribe(success => {
    console.log('Delete successful:', success);
  });
```

### Authentication

The SDK also provides authentication capabilities:

```typescript
import { auth } from 'arkham-city-websdk/dist/auth';

// Register a new user
auth.register({
  email: 'user@example.com',
  password: 'password123',
  // Additional user data
})
  .subscribe(result => {
    console.log('Registration result:', result);
  });

// Log in
auth.login({
  email: 'user@example.com',
  password: 'password123',
})
  .subscribe(result => {
    console.log('Login result:', result);
  });

// Log out
auth.logout()
  .subscribe(success => {
    console.log('Logout successful:', success);
  });

// Get current user
const currentUser = auth.currentUser();
console.log('Current user:', currentUser);
```