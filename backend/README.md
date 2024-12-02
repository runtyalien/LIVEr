# Product View Tracking 

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Overview

This is the backend part of code designed to track and manage product views of a user, provides user engagement insights, and sends notifications that has been viewed more than twice in specified timeperiod.

## Features

- **User Authentication**
  - Secure Firebase-based authentication

- **Product View Tracking**
  - Record and manage product views
  - Recently viewed products management

- **Notification System**
  - Email notifications for frequent product views
  - Customizable notification triggers

- **Performance Optimization**
  - Redis caching
  - Efficient database queries
  - Minimal response payloads

## Technology Stack

| Technology  | Purpose |
|-----------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| Firebase Admin | Authentication & Database |
| Redis | Caching Layer |
| Winston | Logging |
| Jest | Testing Framework |

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 
- npm 
- Firebase Account
- Redis Server
- Gmail Account (for notifications)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/product-view-microservice.git
cd product-view-microservice
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

## Configuration

Create a `.env` file in the project root with the following variables:

```dotenv
PORT=3000
REDIS_URL=redis://localhost:6379
FIREBASE_PROJECT_ID=your-project-id
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development
JWT_SECRET=your-jwt-secret
```

### Firebase Setup

1. Create a Firebase project
2. Generate a service account key
3. Save `serviceAccountKey.json` in `src/config/`

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication Endpoints

- **POST /api/v1/auth/login**
- **POST /api/v1/auth/register**

### Product Endpoints

- **GET /api/v1/users/products**
  - Retrieve all products
- **GET /api/v1/users/products/:productId**
  - Fetch specific product details

### Recently Viewed Endpoints

- **GET /api/v1/users/:userId/recentlyViewed**
  - Get recently viewed products
- **POST /api/v1/users/:userId/recentlyViewed**
  - Record a product view

## Testing

### Running Tests

**Unit Tests**
```bash
npm run test:unit
```

**Integration Tests**
```bash
npm run test:integration
```

**Full Test Suite**
```bash
npm test
```

## Project Structure

```
src/
│
├── config/
│   ├── firebase.js
│   └── redis.js
│
├── middleware/
│   ├── auth.js
│   └── logger.js
│
├── routes/
│   └── v1/
│       ├── index.js
│       └── users.js
│
├── services/
│   └── email.js
│
├── utils/
│   ├── errorHandler.js
│   └── validators.js
│
└── tests/
    ├── unit/
    └── integration/
```

## Security

- JWT Authentication
- Firebase Token Verification
- Input Validation
- Rate Limiting
- CORS Protection
- Helmet.js Security Headers

### Docker

```bash
docker-compose up --build
```

Developed with ❤️ by [Omkar]
