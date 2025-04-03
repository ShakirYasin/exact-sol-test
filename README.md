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
- npm or yarn

## Project Structure

```
.
├── backend/           # NestJS backend
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── tasks/    # Task management module
│   │   ├── websocket/# WebSocket module
│   │   └── entities/ # Database entities
│   └── .env         # Environment variables
└── frontend/        # Next.js frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── hooks/
    └── .env.local
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database named 'taskmanager'

4. Configure environment variables in `.env`

5. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- POST /auth/register - Register a new user
- POST /auth/login - Login user

### Tasks

- GET /tasks - Get all tasks
- GET /tasks/:id - Get a specific task
- POST /tasks - Create a new task
- PATCH /tasks/:id - Update a task
- DELETE /tasks/:id - Delete a task
- POST /tasks/:id/assign - Assign a task to a user

## WebSocket Events

- taskUpdate - Real-time task updates
- joinTaskRoom - Join a task's room for updates
- leaveTaskRoom - Leave a task's room

## Testing

### Backend Tests

```bash
cd backend
npm run test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Deployment

The application can be deployed using Docker:

```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
