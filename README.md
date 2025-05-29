# 📚 Book Review API

A RESTful API built with Node.js and Express for managing book reviews with JWT authentication.

## 🚀 Features

- **User Authentication**: JWT-based registration and login
- **Book Management**: Add, view, and search books
- **Review System**: Submit, update, and delete reviews
- **Advanced Search**: Search books by title or author
- **Pagination**: All list endpoints support pagination
- **Rating System**: Automatic average rating calculation
- **Input Validation**: Comprehensive validation for all inputs
- **Security**: Rate limiting, CORS, Helmet security headers

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate limiting
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm manager

## 🏗️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/r1tikpatil/Book-Review-System.git
   cd Book-Review-System
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/bookreview
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start MongoDB**

   - **Local MongoDB**: Ensure MongoDB is running on your system
   - **MongoDB Atlas**: Use your cloud connection string in `MONGODB_URI`

5. **Run the application**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:8000/api/health
   ```

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, 3-30 chars),
  email: String (unique, valid email),
  password: String (hashed, min 6 chars),
  createdAt: Date,
  updatedAt: Date
}
```

### Books Collection

```javascript
{
  _id: ObjectId,
  title: String (required, max 200 chars),
  author: String (required, max 100 chars),
  genre: String (required, max 50 chars),
  description: String (optional, max 1000 chars),
  publishedYear: Number (optional, 1000-current year),
  isbn: String (optional, unique),
  addedBy: ObjectId (ref: User),
  averageRating: Number (0-5, auto-calculated),
  totalRatings: Number (auto-calculated),
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  rating: Number (1-5, required),
  comment: String (optional, max 1000 chars),
  createdAt: Date,
  updatedAt: Date
}
```

**Constraints:**

- One review per user per book (compound unique index)
- Automatic average rating updates via MongoDB middleware

## 🔌 API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### User Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Books

#### Add New Book (Authenticated)

```http
POST /api/books
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "description": "A classic American novel set in the Jazz Age",
  "publishedYear": 1925,
  "isbn": "978-0-7432-7356-5"
}
```

#### Get All Books (with filters and pagination)

```http
GET /api/books?page=1&limit=10&author=Fitzgerald&genre=Fiction
```
