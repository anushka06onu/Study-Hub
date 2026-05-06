# Study Hub 📚

A comprehensive study management platform designed to help students organize tasks, track study sessions, and monitor academic progress across different subjects.

## Overview

Study Hub is a full-stack web application that streamlines the student workflow by providing an intuitive interface for managing coursework, tracking time spent on studies, and visualizing learning progress through interactive analytics.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** MongoDB with Mongoose
- **UI Components:** Radix UI, Framer Motion
- **Data Visualization:** Recharts
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs
- **AI Integration:** Google Gemini API

## Features

### Core Functionality ✅
- **User Authentication:** Secure registration and login system with JWT, OTP email verification, and password recovery
- **Subject Management:** Create and organize study subjects with detailed tracking
- **Task Management:** Create, categorize, and manage tasks by subject with Google Gemini AI-powered task recommendations
- **Study Timer:** Built-in timer for tracking focused study sessions
- **Dashboard:** Centralized hub for viewing all study-related information
- **Progress Analytics:** Visual charts and metrics for tracking academic progress with dynamic data export functionality
- **Theme Support:** Dark and light mode toggle for user preference
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices with fluid animations
- **Multi-Page Navigation:** Seamless routing across different sections

### Available Pages
- Landing Page with feature overview
- Authentication (Login, Register & Password Recovery)
- Main Dashboard
- Subject Management
- Task Tracking
- Calendar View
- Analytics Dashboard
- Settings & Profile Management
- Subject Detail View

## Demo Account

To quickly explore the application without registering, you can use the following test credentials:
- **Email:** `test@example.com`
- **Password:** `password123`

## Project Structure

```
Study-Hub/
├── client/                      # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── context/            # React Context for state management
│   │   ├── charts/             # Data visualization components
│   │   ├── utils/              # Utility functions and API calls
│   │   └── index.css           # Global styling
│   └── package.json
├── server/                      # Express.js backend API
│   ├── controllers/            # Business logic for routes
│   ├── models/                 # MongoDB data schemas
│   ├── routes/                 # API endpoint definitions
│   ├── middleware/             # Authentication and custom middleware
│   ├── app.js                  # Express application setup
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/anushka06onu/Study-Hub.git
cd Study-Hub
```

2. **Install frontend dependencies**
```bash
cd client
npm install
```

3. **Install backend dependencies**
```bash
cd ../server
npm install
```

4. **Configure environment variables**
Create a `.env` file in the server directory with necessary configuration (e.g., MongoDB URI, JWT Secret, Google Gemini API Key).

## Running the Application

### Backend
```bash
cd server
npm run dev
```
The API server will run on `http://localhost:3000`

### Frontend
```bash
cd client
npm run dev
```
The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Subjects
- `GET /api/subjects` - Retrieve all subjects
- `POST /api/subjects` - Create a new subject
- `GET /api/subjects/:id` - Get subject details
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Tasks
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Sessions
- `GET /api/sessions` - Retrieve study sessions
- `POST /api/sessions` - Create study session record

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## In Development 🚧

- Notification system
- Collaboration features
- Study group sessions

## Building for Production

### Frontend Build
```bash
cd client
npm run build
```

### Deployment
The application can be deployed using:
- **Frontend:** Vercel, Netlify, or any static hosting service
- **Backend:** Heroku, Railway, or any Node.js hosting platform

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue in the repository.
