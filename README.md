# LIVEr

## Technology Stack(Backend)

| Technology  | Purpose |
|-----------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| Firebase Admin | Authentication & Database |
| Redis | Caching Layer |
| Winston | Logging |
| Jest | Testing Framework |

## Technology Stack(Frontend)

| Technology  | Purpose  |
|-----------|-----------|
| React.js | UI Library |
| React Router | Client-side routing |
| Firebase Authentication | Authentication and database access |
| Axios | HTTP client for API requests |
| Styled Components | CSS-in-JS for styling |
| Context API for State Management | State management |

## Configuration

Create a `.env` file in the project root with the following variables:

```dotenv
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_API_URL=your_backend_api_url
```

## Installation
1. ``` 
    git clone https://github.com/runtyalien/LIVEr.git
    cd LIVEr
    ```
2. If you want to run project using docker
   * Create docker image 
        
        ```npm run docker:build```
   * Start application within docker container 
        
        ```npm run docker:up```
   * Stop docker container 
    
        ```npm run docker:up```
    
3. If you want to run the project locally
    * To install dependencies from fronend and backend
        
        ```npm run install```
    * To start frontend and backend servers 
    
        ```npm run start```

## Documentation

- Both **frontend** and **backend** folders contain their own README.md where you can find detailed documentation.


## API Endpoints

##

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

### To Access Swagger
```http://localhost:3001/api-docs/```