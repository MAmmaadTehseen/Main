/**
 * Sidebar Navigation Component
 * Left navigation panel with role-based menu items
 * Shows different navigation options based on user role (admin, advisor, student)
 */

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdDashboard,
  MdFolder,
  MdAssignment,
  MdTask,
  MdForum,
  MdSmartToy,
  MdLogout,
  MdPeople,
  MdClose,
} from "react-icons/md";
import "./Sidebar.css";

/**
 * SIDEBAR COMPONENT
 * Navigation menu with role-based content
 * Admin sees: Dashboard, Users List
 * Advisor sees: Dashboard, Students, Projects, Tasks, Discussion Board
 * Student sees: Dashboard, Projects, Submissions, Tasks, Discussion, Chatbot
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open/visible
 * @param {Function} props.onClose - Callback to close sidebar
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout
   * Clears auth state and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /**
   * Close sidebar on mobile when navigation item is clicked
   * Prevents sidebar from staying open after selection
   */
  const handleNavClick = () => {
    if (window.innerWidth <= 991) {
      onClose();
    }
  };

  /**
   * Get navigation items based on user role
   * Different roles see different menu options
   */
  const getNavItems = () => {
    // Admin navigation
    if (user?.role === "admin") {
      return [
        { path: "/dashboard", icon: <MdDashboard />, label: "Dashboard" },
        { path: "/users", icon: <MdPeople />, label: "Users List" },
      ];
    }

    // Advisor navigation
    if (user?.role === "advisor") {
      return [
        { path: "/dashboard", icon: <MdDashboard />, label: "Dashboard" },
        { path: "/students", icon: <MdPeople />, label: "Students" },
        { path: "/projects", icon: <MdFolder />, label: "Projects" },
        { path: "/tasks", icon: <MdTask />, label: "Tasks" },
        { path: "/discussion", icon: <MdForum />, label: "Discussion Board" },
      ];
    }

    // Student navigation (default)
    return [
      { path: "/dashboard", icon: <MdDashboard />, label: "Dashboard" },
      { path: "/projects", icon: <MdFolder />, label: "Projects" },
      { path: "/submissions", icon: <MdAssignment />, label: "Submissions" },
      { path: "/tasks", icon: <MdTask />, label: "Tasks" },
      { path: "/discussion", icon: <MdForum />, label: "Discussion Board" },
      { path: "/chatbot", icon: <MdSmartToy />, label: "Chatbot Assistant" },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Sidebar header with logo and close button */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <img src="/logo.png" alt="FYP Compass Logo" />
        </div>
        {/* Close button visible on mobile */}
        <button className="sidebar-close" onClick={onClose}>
          <MdClose />
        </button>
      </div>

      {/* Navigation menu items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout button at bottom */}
      <button className="logout-btn" onClick={handleLogout}>
        <MdLogout />
        <span>Log Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
