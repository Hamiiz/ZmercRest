# ZMercRestAPI

ZMercRestAPI is a RESTful API designed for the ZMercado React application. It provides endpoints for managing users, roles, permissions, products, payments, and more.

## Features

- User authentication and authorization using JWT.
- Role-based access control (RBAC).
- CRUD operations for users, roles, and products.
- Secure password hashing with bcrypt.
- Integration with MongoDB for data storage.
- Middleware for token validation using `jose`.
- Prisma ORM for database management.
- Environment-based configuration using `dotenv`.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSql
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
    DATABASE_URL=YOUR-POSTGRES-STRING
    JWT_SECRET=your-secret-key
    BETTER_AUTH_SECRET=your-secret-key
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

2. Access the API at `http://localhost:1000`.

## Scripts

- `npm start`: Compiles TypeScript and starts the server with nodemon.
- `npm test`: Placeholder for running tests.

## API Endpoints

### Authentication
- `POST /auth/sign-up/email`: User registration.
- `POST /auth/sign-in/email`: User login.
- `POST /auth/sign-in/username`: User login.
- `GET /auth/token`: User JWT Token.

### Users
- `GET /getuser`: Get all users.    
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
- **postgresql**: Database.
- **JWT**: Authentication.
- **bcrypt**: Password hashing.
- **Better-auth**: Authentication.


## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Description of changes"
    ```
4. Push to your branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request on GitHub.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

Developed by Hamza M.
Developed by Hamza M.  