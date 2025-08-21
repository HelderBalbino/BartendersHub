# BartendersHub Backend API

## Overview

This is the backend API for BartendersHub, a sophisticated cocktail community
platform. Built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Cocktail CRUD operations
- Image upload with Cloudinary
- User profiles and social features
- Comment and rating system
- Search and filtering
- Rate limiting and security
- Health diagnostics script (`npm run health`)
- Request ID correlation & slow request logging

## Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (v5.0 or higher)
- Cloudinary account (for image uploads)

## Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/HelderBalbino/BartendersHub.git
    cd BartendersHub/backend
    ```bash

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your configuration:

    ```
    PORT=5000
    NODE_ENV=development
    MONGODB_URI=mongodb://localhost:27017/bartendershub
    JWT_SECRET=your-jwt-secret
    CLOUDINARY_CLOUD_NAME=your-cloudinary-name
    CLOUDINARY_API_KEY=your-cloudinary-key
    CLOUDINARY_API_SECRET=your-cloudinary-secret
    ```

4. **Start MongoDB**

    ```bash
    mongod
    ```

5. **Seed the database** (optional)

    ```bash
    npm run seed
    ```

6. **Start the server**
7. **Run health diagnostics (optional)**

    ```bash
    npm run health
    # or JSON output
    node scripts/healthCheck.js --json
    ```

    Ensures MongoDB, Cloudinary, Redis (if enabled), and email transporter are reachable.

    ```bash
    # Development
    npm run dev

    # Production
    npm start
    ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Cocktails

- `GET /api/cocktails` - Get all cocktails
- `GET /api/cocktails/:id` - Get single cocktail
-   `POST /api/cocktails` - Create cocktail (auth required)
-   `PUT /api/cocktails/:id` - Update cocktail (auth required)
-   `DELETE /api/cocktails/:id` - Delete cocktail (auth required)
-   `PUT /api/cocktails/:id/like` - Like/Unlike cocktail (auth required)
-   `POST /api/cocktails/:id/comments` - Add comment (auth required)
-   `POST /api/cocktails/:id/rating` - Rate cocktail (auth required)

### Users

-   `GET /api/users` - Get all users
-   `GET /api/users/:id` - Get single user
-   `PUT /api/users/profile` - Update profile (auth required)
-   `PUT /api/users/:id/follow` - Follow/Unfollow user (auth required)
-   `GET /api/users/:id/followers` - Get user followers
-   `GET /api/users/:id/following` - Get user following
-   `GET /api/users/:id/cocktails` - Get user cocktails

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cocktailController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Cocktail.js
│   │   ├── Follow.js
│   │   └── Favorite.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cocktails.js
│   │   └── users.js
│   ├── utils/
│   │   ├── auth.js
│   │   ├── cloudinary.js
│   │   └── seedDatabase.js
│   └── server.js
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Security Features

-   JWT authentication
-   Password hashing with bcrypt
-   Rate limiting
-   Input validation
-   File upload restrictions
-   CORS configuration
-   Helmet security headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
