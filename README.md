# FYP COMPASS

A comprehensive Final Year Project (FYP) Management System designed for educational institutions to facilitate collaboration between students, advisors, and administrators in managing academic projects.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Database Schema](#database-schema)
- [File Upload System](#file-upload-system)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

FYP COMPASS is a full-stack web application that streamlines the final year project management process in academic institutions. It provides dedicated dashboards for administrators, advisors, and students, enabling efficient project tracking, task management, file submissions, grading, and communication.

### Key Highlights

- Role-based access control with three distinct user types
- Real-time project progress tracking
- File upload system for tasks and submissions
- Discussion board for project communication
- AI-powered chatbot assistant with FYP project knowledge base
- Email notifications for password resets and account creation
- Responsive design for all devices

## Features

### Authentication & Authorization
- User registration for advisors and students
- JWT-based authentication with secure token management
- Role-based access control (Admin, Advisor, Student)
- Password reset functionality via email
- Protected routes with middleware validation

### Admin Dashboard
- Create and manage users (Admin, Advisor, Student)
- Create and oversee all projects
- View all users with role-based filtering
- Update and delete users and projects
- System-wide oversight capabilities

### Advisor Dashboard
- Create FYP projects with descriptions
- Add students to projects
- Create tasks with file attachments (PDFs, documents)
- Review and grade student submissions
- Track project and task progress
- Manage project discussions
- View all assigned students

### Student Dashboard
- View assigned projects and details
- Access and complete assigned tasks
- Submit task files for evaluation
- Track submission status (pending, submitted, evaluated)
- View grades and feedback
- Participate in project discussions
- Access AI chatbot for project guidance

### Project Management
- Create projects with detailed descriptions
- Multi-advisor and multi-student project support
- Real-time progress tracking
- Project-based task organization

### Task Management
- Create tasks with instructions and file attachments
- Assign tasks to specific projects
- Track completion status
- Support for various file types

### Submission System
- File upload for task submissions
- Submission status workflow (pending → submitted → evaluated)
- Grading system with numerical marks
- Submission history tracking

### Discussion Board
- Project-scoped conversations
- Real-time message posting
- Timestamped message history
- Advisor-student communication

### AI Chatbot
- Knowledge base with 50+ FYP project entries
- Project information search capabilities
- Keyword-based project matching
- Links to project documentation and resources

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest | Runtime environment |
| Express.js | 5.1.0 | Web framework |
| MongoDB | - | Database |
| Mongoose | 8.16.2 | ODM for MongoDB |
| JWT | 9.0.2 | Authentication |
| bcryptjs | 3.0.2 | Password hashing |
| Multer | 2.0.1 | File uploads |
| Nodemailer | 7.0.11 | Email service |
| Socket.io | 4.8.1 | Real-time capabilities |
| dotenv | 17.1.0 | Environment management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | 5.4.21 | Build tool |
| React Router | 7.10.0 | Client-side routing |
| Axios | 1.13.2 | HTTP client |
| React Icons | 5.5.0 | Icon library |
| ESLint | 9.39.1 | Code linting |

### DevOps
| Service | Purpose |
|---------|---------|
| Render | Backend hosting |
| Vercel | Frontend hosting |
| MongoDB Atlas | Cloud database |
| Gmail SMTP | Email service |

## Project Structure

```
Main/
├── Backend/
│   ├── controllers/          # Business logic
│   │   ├── adminController.js
│   │   ├── advisorController.js
│   │   ├── authController.js
│   │   ├── chatbotController.js
│   │   ├── discussionController.js
│   │   ├── progressController.js
│   │   ├── studentController.js
│   │   ├── submissionController.js
│   │   └── taskController.js
│   ├── middleware/           # Express middleware
│   │   ├── authMiddleware.js # JWT & role-based access
│   │   └── upload.js         # Multer configuration
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Submission.js
│   │   └── Discussion.js
│   ├── routes/               # API endpoints
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── advisorRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── discussionRoutes.js
│   │   └── progressRoutes.js
│   ├── utils/                # Utility functions
│   │   └── email.js          # Email sending
│   ├── seed/                 # Database seeding
│   │   └── admin.js
│   ├── uploads/              # Uploaded files
│   │   ├── tasks/
│   │   └── submissions/
│   ├── server.js             # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Reusable components
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── ProgressCircle.jsx
│   │   │   │   └── StatusBadge.jsx
│   │   │   └── layout/       # Layout components
│   │   │       ├── Header.jsx
│   │   │       ├── Layout.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── auth/         # Authentication
│   │   │   ├── dashboard/    # Role-based dashboards
│   │   │   ├── projects/     # Project management
│   │   │   ├── tasks/        # Task management
│   │   │   ├── submissions/  # Submissions
│   │   │   ├── discussion/   # Discussion board
│   │   │   ├── chatbot/      # AI assistant
│   │   │   ├── students/     # Student management
│   │   │   └── users/        # User management
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── App.jsx           # Main application
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
├── package.json              # Root package.json
├── render.yaml               # Render deployment config
└── README.md
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fyp-compass.git
   cd fyp-compass
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

   This command installs dependencies for root, backend, and frontend.

3. **Configure environment variables** (see [Environment Configuration](#environment-configuration))

4. **Seed the admin user** (optional)
   ```bash
   cd Backend
   node seed/admin.js
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts both backend (port 5000) and frontend (port 5173) concurrently.

### Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:5173
```

> **Note:** For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) if 2FA is enabled.

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:backend` | Start only the backend server |
| `npm run dev:frontend` | Start only the frontend server |
| `npm run build:frontend` | Build the frontend for production |
| `npm run start` | Start the backend in production mode |
| `npm run install:all` | Install all dependencies |

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/signup` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Protected |
| POST | `/forgot-password` | Request password reset | Public |
| POST | `/reset-password` | Reset password | Public |

#### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/create-user` | Create new user | Admin |
| POST | `/create-project` | Create new project | Admin |
| GET | `/users` | Get all users | Admin |
| GET | `/projects` | Get all projects | Admin |
| PUT | `/users/:id` | Update user | Admin |
| PUT | `/projects/:id` | Update project | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| DELETE | `/projects/:id` | Delete project | Admin |

#### Advisor Routes (`/api/advisor`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/create-project` | Create project | Advisor |
| POST | `/add-student` | Add student to project | Advisor |
| POST | `/create-task` | Create task | Advisor |
| GET | `/projects` | Get advisor's projects | Advisor |
| GET | `/tasks/:taskId/submissions` | Get task submissions | Advisor |
| PATCH | `/submissions/:id/grade` | Grade submission | Advisor |
| DELETE | `/projects/:id` | Delete project | Advisor |
| DELETE | `/tasks/:id` | Delete task | Advisor |

#### Student Routes (`/api/student`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/projects` | Get assigned projects | Student |
| GET | `/projects/:id/tasks` | Get project tasks | Student |
| POST | `/submit-task` | Submit task | Student |

#### Discussion Routes (`/api/discussion`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/:projectId` | Get project discussions | Protected |
| POST | `/:projectId` | Post message | Protected |

#### Progress Routes (`/api/progress`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/project/:id` | Get project progress | Protected |
| GET | `/task/:id` | Get task progress | Protected |

#### Chatbot Routes (`/api/chatbot`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Send message to chatbot | Protected |

### Response Format

**Success Response:**
```json
{
  "message": "Success message",
  "data": { }
}
```

**Error Response:**
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## User Roles

### Admin
- Full system access
- User management (create, update, delete)
- Project oversight
- Cannot be created via signup (seeded or created by another admin)

### Advisor
- Create and manage own projects
- Add students to projects
- Create and assign tasks
- Review and grade submissions
- Participate in discussions

### Student
- View assigned projects
- Complete and submit tasks
- Track progress and grades
- Participate in project discussions
- Access chatbot assistant

## Database Schema

### User Model
```javascript
{
  name: String,          // Required
  email: String,         // Required, Unique
  password: String,      // Required, Hashed
  role: String,          // 'admin' | 'advisor' | 'student'
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  name: String,          // Required
  description: String,
  advisors: [ObjectId],  // References to User
  students: [ObjectId],  // References to User
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  name: String,          // Required
  instructions: String,
  fileUrl: String,       // Uploaded file path
  projectId: ObjectId,   // Reference to Project
  createdBy: ObjectId,   // Reference to User
  isDone: Boolean,
  isCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Submission Model
```javascript
{
  taskId: ObjectId,      // Reference to Task
  studentId: ObjectId,   // Reference to User
  fileUrl: String,       // Submitted file path
  marks: Number,         // Nullable
  status: String,        // 'pending' | 'submitted' | 'evaluated'
  createdAt: Date,
  updatedAt: Date
}
```

### Discussion Model
```javascript
{
  projectId: ObjectId,   // Reference to Project
  sender: ObjectId,      // Reference to User
  message: String,
  createdAt: Date,
  updatedAt: Date
}
```

## File Upload System

The application uses **Multer** middleware for handling file uploads. Files are stored on the server's filesystem and served statically.

### Storage Locations

| Directory | Purpose | Used By |
|-----------|---------|---------|
| `Backend/uploads/tasks/` | Task attachment files | Advisors |
| `Backend/uploads/submissions/` | Student submission files | Students |

### How File Uploads Work

#### 1. Advisor Uploading Task Files

When an advisor creates a task, they can attach a file (PDF, document, etc.):

**Frontend (React):**
```javascript
const formData = new FormData();
formData.append('name', taskName);
formData.append('instructions', instructions);
formData.append('projectId', projectId);
formData.append('file', selectedFile);  // File object from input

await axios.post('/api/advisor/create-task', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
});
```

**API Endpoint:** `POST /api/advisor/create-task`

#### 2. Student Submitting Task Files

When a student submits their work for a task:

**Frontend (React):**
```javascript
const formData = new FormData();
formData.append('taskId', taskId);
formData.append('file', selectedFile);  // File object from input

await axios.post('/api/student/submit-task', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
});
```

**API Endpoint:** `POST /api/student/submit-task`

### Multer Configuration

The upload middleware is configured in `Backend/middleware/upload.js`:

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dynamic destination based on upload type
    const uploadPath = req.baseUrl.includes('student')
      ? 'uploads/submissions/'
      : 'uploads/tasks/';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomNumber.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
```

### Accessing Uploaded Files

Files are served statically from the `/uploads` endpoint:

```
# Task files
GET http://localhost:5000/uploads/tasks/{filename}

# Submission files
GET http://localhost:5000/uploads/submissions/{filename}
```

**Example in Frontend:**
```javascript
// Display a task file link
const fileUrl = `${VITE_SERVER_URL}/uploads/tasks/${task.fileUrl}`;

// Display a submission file link
const submissionUrl = `${VITE_SERVER_URL}/uploads/submissions/${submission.fileUrl}`;
```

### File Upload Flow Diagram

```
┌─────────────┐     FormData      ┌─────────────┐     Multer      ┌─────────────┐
│   Frontend  │ ───────────────▶  │   Express   │ ─────────────▶  │  File System │
│   (React)   │                   │   Server    │                 │   /uploads   │
└─────────────┘                   └─────────────┘                 └─────────────┘
                                        │
                                        │ Save file path
                                        ▼
                                  ┌─────────────┐
                                  │   MongoDB   │
                                  │  (fileUrl)  │
                                  └─────────────┘
```

### Supported File Types

The current configuration accepts all file types. Common uploads include:

- **Documents:** PDF, DOC, DOCX, TXT
- **Presentations:** PPT, PPTX
- **Spreadsheets:** XLS, XLSX
- **Images:** PNG, JPG, JPEG
- **Archives:** ZIP, RAR

### File Size Limits

By default, Multer has no file size limit. To add a limit, modify the configuration:

```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024  // 10 MB limit
  }
});
```

### CORS Headers for File Access

The server includes CORS headers for file access:

```javascript
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));
```

### Best Practices

1. **Always use FormData** for file uploads
2. **Set Content-Type to multipart/form-data** in headers
3. **Include authentication token** for protected upload routes
4. **Handle upload errors** gracefully on the frontend
5. **Validate file types** on both frontend and backend for production

## Deployment

### Backend Deployment (Render)

The project includes a `render.yaml` configuration file:

```yaml
services:
  - type: web
    name: fyp-compass-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd Backend && npm install
    startCommand: cd Backend && npm start
```

**Environment Variables to set on Render:**
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `FRONTEND_URL`
- `NODE_ENV=production`

### Frontend Deployment (Vercel)

The project includes a `vercel.json` configuration:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

**Environment Variables to set on Vercel:**
- `VITE_API_URL` - Your backend API URL
- `VITE_SERVER_URL` - Your backend server URL

### Deployment Steps

1. **Backend (Render)**
   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Select the repository and configure using `render.yaml`
   - Add environment variables
   - Deploy

2. **Frontend (Vercel)**
   - Connect your GitHub repository to Vercel
   - Set the root directory to `frontend`
   - Add environment variables
   - Deploy

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth with expiration
- **Role-Based Access**: Middleware enforcing user permissions
- **CORS Protection**: Configurable cross-origin resource sharing
- **HTTP Security Headers**: XSS protection, content type sniffing prevention
- **Email Security**: Token-based password reset with expiration
- **Input Validation**: Request validation on all endpoints

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting PR

## License

This project is licensed under the ISC License.

---

## Support

For issues and feature requests, please [open an issue](https://github.com/yourusername/fyp-compass/issues) on GitHub.

---

**FYP COMPASS** - Streamlining Final Year Project Management
