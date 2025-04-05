# Task Management System

A full-stack task management system built with NestJS, Next.js, PostgreSQL, MongoDB, and WebSocket support.

## Features

- User authentication with JWT
- Task CRUD operations
- Real-time task updates using WebSocket
- Role-based access control
- Event logging with MongoDB
- Modern and responsive UI

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- MongoDB
- npm or pnpm
- Docker and Docker Compose

## Getting Started

You can run this application either using Docker Compose for all services or run the databases in Docker while running the backend and frontend manually. Choose the setup that best suits your needs.

### Option 1: Full Docker Compose Setup

1. Make sure Docker and Docker Compose are installed on your system
2. Copy the environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Start all services:
   ```bash
   docker compose up -d
   ```
4. The services will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - PostgreSQL: localhost:5433
   - MongoDB: localhost:27017

### Option 2: Hybrid Setup (Databases in Docker, Services Manual)

1. First, comment out the backend and frontend services in your docker-compose.yml:
   ```yaml
   # Comment out or remove these blocks
   # backend:
   #   build: ...
   
   # frontend:
   #   build: ...
   ```

2. Start the databases using Docker:
   ```bash
   docker compose up -d
   ```

3. Backend Setup:
   ```bash
   # Navigate to backend directory
   cd backend

   # Copy environment file
   cp .env.example .env

   # Install dependencies
   npm install

   # Start development server
   npm run start:dev
   ```
   The backend will be available at http://localhost:3001

4. Frontend Setup:
   ```bash
   # In a new terminal, navigate to frontend directory
   cd frontend

   # Copy environment file
   cp .env.example .env.local

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

### Environment Configuration

Make sure to update the following environment files with your configurations:

#### Backend (.env)
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=taskmanager
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET="your_jwt_secret_here"
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Creating an Admin User

To create an admin user, you can make a POST request to the `/users/admin` endpoint with the following JSON payload:

```json
{
  "email": "admin@example.com",
  "password": "your_secure_password",
  "firstName": "Admin",
  "lastName": "User"
}
```

Example using curl:
```bash
curl -X POST http://localhost:3001/api/users/admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your_secure_password", "firstName": "Admin", "lastName": "User"}'
```

The system will automatically:
- Hash the password securely
- Set the user role to 'admin'
- Prevent duplicate email addresses
- Return the created admin user (without the password hash)

Note: Make sure to create an admin user before starting to use the system, as certain operations may require admin privileges.

