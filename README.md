# Product House - Backend

## [ Live Link (Server) ](https://product-house-server-eight.vercel.app/)
## [ Live Link (Frontend) ](https://product-house-abrar.netlify.app)



## Overview
This is the backend of the Product House project, providing API endpoints for product data. The backend is built with Node.js, Express, and MongoDB.

## Features
- RESTful API for products
- Product filtering by category, brand, and price
- JWT-based authentication for secure access
- MongoDB for data storage

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose (for MongoDB modeling)
- JWT (for authentication)

## Project Setup

### Prerequisites
- Node.js (v14.x or later)
- npm or yarn
- MongoDB (local or cloud)
- nodemon
- git


## Running the Project Locally

### Installation
1. Clone the repository:
```
git clone https://github.com/abrarul-hoque/product-house-server
```
2. Navigate to the project directory:

```
cd product-house-server
```

3. Install the dependencies:

```
npm install
```

4. Set up the environment variables in a .env file:


```
DB_USER=<mongodb_userName>
DB_PASS=<mongodb_password>
```

5. Run the Server:
```
nodemon index.js
```

6. Open your browser and go to http://localhost:5000 to view the application.


## API Endpoints
- GET /api/products - Get all products, paginationQuery, Sort Query, filterQuery
- GET /api/products/search/:name - Get a product by name
- GET /api/products/brands - Get all brands Name
- GET /api/products/category - Get all Category Name
- GET /api/productCount - Get Product Count

