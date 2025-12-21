/**
 * Main App Component
 * Handles routing and authentication for the entire application
 * Manages public, protected, and role-based routes
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// ========== STUDENT PAGES ==========
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import Submissions from "./pages/submissions/Submissions";
import Tasks from "./pages/tasks/Tasks";
import Discussion from "./pages/discussion/Discussion";
import Chatbot from "./pages/chatbot/Chatbot";

// ========== ADVISOR PAGES ==========
import AdvisorDashboard from "./pages/dashboard/AdvisorDashboard";
import AdvisorProjects from "./pages/projects/AdvisorProjects";
import AdvisorTasks from "./pages/tasks/AdvisorTasks";
import Students from "./pages/students/Students";

// ========== ADMIN PAGES ==========
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UsersList from "./pages/users/UsersList";

import "./index.css";

/**
 * PROTECTED ROUTE WRAPPER
 * Prevents unauthorized access to authenticated pages
 * Redirects unauthenticated users to login page
 * Shows loading state while checking authentication
 *
 * @component
 * @param {React.ReactNode} children - Protected page component
 */
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

/**
 * PUBLIC ROUTE WRAPPER
 * Allows only unauthenticated users to access login/signup pages
 * Redirects authenticated users to dashboard
 * Prevents logged-in users from accessing auth pages
 *
 * @component
 * @param {React.ReactNode} children - Public page component
 */
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

/**
 * ROLE-BASED ROUTE WRAPPER
 * Renders different components based on user role
 * Supports admin, advisor, and student roles with specific pages
 * Falls back to student view if role not matched
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.Component} props.studentComponent - Page for students
 * @param {React.Component} props.advisorComponent - Page for advisors
 * @param {React.Component} props.adminComponent - Page for admins
 */
const RoleBasedRoute = ({
  studentComponent: StudentComponent,
  advisorComponent: AdvisorComponent,
  adminComponent: AdminComponent,
}) => {
  const { user } = useAuth();

  // Check user role and render appropriate component
  if (user?.role === "admin" && AdminComponent) {
    return <AdminComponent />;
  }

  if (user?.role === "advisor" && AdvisorComponent) {
    return <AdvisorComponent />;
  }

  if (StudentComponent) {
    return <StudentComponent />;
  }

  return <Navigate to="/dashboard" replace />;
};

/**
 * APP ROUTES COMPONENT
 * Defines all application routes organized by type:
 * - Public routes: Login, Signup, Password recovery
 * - Protected routes: Authenticated user pages
 * - Role-based routes: Pages with different views per role
 */
function AppRoutes() {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      {/* Login page - accessible only when not logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Signup page - accessible only when not logged in */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Forgot password page - for password reset requests */}
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Reset password page - processes password reset with token */}
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* ========== PROTECTED ROUTES ========== */}
      {/* Main layout for authenticated users */}
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
