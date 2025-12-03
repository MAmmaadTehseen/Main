import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student Pages
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/projects/Projects';
import Submissions from './pages/submissions/Submissions';
import Tasks from './pages/tasks/Tasks';
import Discussion from './pages/discussion/Discussion';
import Chatbot from './pages/chatbot/Chatbot';

// Advisor Pages
import AdvisorDashboard from './pages/dashboard/AdvisorDashboard';
import AdvisorProjects from './pages/projects/AdvisorProjects';
import AdvisorTasks from './pages/tasks/AdvisorTasks';
import Students from './pages/students/Students';

// Admin Pages
import AdminDashboard from './pages/dashboard/AdminDashboard';
import UsersList from './pages/users/UsersList';

import './index.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route wrapper (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Role-based component wrapper for three roles
const RoleBasedRoute = ({
  studentComponent: StudentComponent,
  advisorComponent: AdvisorComponent,
  adminComponent: AdminComponent
}) => {
  const { user } = useAuth();

  if (user?.role === 'admin' && AdminComponent) {
    return <AdminComponent />;
  }

  if (user?.role === 'advisor' && AdvisorComponent) {
    return <AdvisorComponent />;
  }

  if (StudentComponent) {
    return <StudentComponent />;
  }

  return <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <RoleBasedRoute
              studentComponent={Dashboard}
              advisorComponent={AdvisorDashboard}
              adminComponent={AdminDashboard}
            />
          }
        />
        <Route
          path="projects"
          element={
            <RoleBasedRoute
              studentComponent={Projects}
              advisorComponent={AdvisorProjects}
            />
          }
        />
        <Route path="submissions" element={<Submissions />} />
        <Route
          path="tasks"
          element={
            <RoleBasedRoute
              studentComponent={Tasks}
              advisorComponent={AdvisorTasks}
            />
          }
        />
        <Route path="discussion" element={<Discussion />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="students" element={<Students />} />
        <Route path="users" element={<UsersList />} />
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
