# Blood Donor Request Website

This is a full-stack web application built with React, Node.js, and MongoDB for managing blood donor requests.

## Features

- User registration and authentication
- Donor registration with blood type and location
- Blood request posting
- View lists of donors and requests

## Tech Stack

- Frontend: React with React Router
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Installation

1. Ensure MongoDB is installed and running locally on default port 27017.
2. Install server dependencies: `cd server && npm install`
3. Install client dependencies: `cd client && npm install`
4. Start the server: `cd server && npm start`
5. Start the client: `cd client && npm start`

## Usage

- Navigate to the home page and register as a donor or requester.
- Login with your credentials.
- Donors can add their details via the dashboard.
- Requesters can post blood requests.
- View lists of available donors and open requests.

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Add a donor (authenticated)
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create a request (authenticated)

## Troubleshooting

- Ensure MongoDB is running before starting the server.
- If ports 3000 (client) or 5000 (server) are in use, change them in the respective configurations.
- Check console for error messages.

## Environment variables (server)

Create a `.env` file in the `server` folder with the following values (example):

```
MONGO_URI=mongodb://localhost:27017/bloodapp
JWT_SECRET=your_jwt_secret_here
PORT=5000

# Optional - SMTP for registration emails
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SMTP_SECURE=false
EMAIL_FROM="Blood App <no-reply@example.com>"
```

If you want the client to target a different API host (useful for mobile devices), set `REACT_APP_API_URL` in the client environment (for example in `.env` at `client/.env`):

```
REACT_APP_API_URL=http://192.168.X.Y:5000/api
```