# ZMercRestAPI

ZMercRestAPI is a RESTful API designed for the ZMercado React application. It provides endpoints for managing users, roles, permissions, products, payments, and more.

## Features

- User authentication and authorization using JWT.
- Role-based access control (RBAC).
- CRUD operations for users, roles, and products.
- Secure password hashing with bcrypt.
- Integration with MongoDB for data storage.
- Environment configuration using dotenv.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/ZMercRestAPi.git
    cd ZMercRestAPi
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and configure the following variables:
    ```env
    DATABASE_URL=mongodb://localhost:27017/your-database
    JWT_SECRET=your-secret-key
    ```

4. Generate Prisma client:
    ```bash
    npx prisma generate
    ```

## Usage

1. Start the development server:
    ```bash
    npm start
    ```

2. Access the API at `http://localhost:3000`.

## Scripts

- `npm start`: Compiles TypeScript and starts the server with nodemon.
- `npm test`: Placeholder for running tests.

## API Endpoints

### Authentication
- `POST /auth/login`: User login.
- `POST /auth/register`: User registration.

### Users
- `GET /users`: Get all users.    
- `GET /users/:id`: Get a user by ID. //under development
- `POST /users`: Create a new user. //under development
- `PUT /users/:id`: Update a user. //under development
- `DELETE /users/:id`: Delete a user. //under development

### Products
- `GET /products`: Get all products. //under development
- `POST /products`: Add a new product. //under development

## Technologies Used

- **Node.js**: Backend runtime.
- **Express**: Web framework.
- **Prisma**: ORM for database management.
- **MongoDB**: Database.
- **JWT**: Authentication.
- **bcrypt**: Password hashing.



## Author
Developed by Hamza M.  