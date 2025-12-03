import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MdDashboard,
  MdFolder,
  MdAssignment,
  MdTask,
  MdForum,
  MdSmartToy,
  MdLogout,
  MdPeople,
  MdClose
} from 'react-icons/md';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when clicking a nav item
    if (window.innerWidth <= 991) {
      onClose();
    }
  };

  // Navigation items based on user role
  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
        { path: '/users', icon: <MdPeople />, label: 'Users List' },
      ];
    }

    if (user?.role === 'advisor') {
      return [
        { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
        { path: '/students', icon: <MdPeople />, label: 'Students' },
        { path: '/projects', icon: <MdFolder />, label: 'Projects' },
        { path: '/tasks', icon: <MdTask />, label: 'Tasks' },
        { path: '/discussion', icon: <MdForum />, label: 'Discussion Board' },
      ];
    }

    // Student navigation
    return [
      { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
      { path: '/projects', icon: <MdFolder />, label: 'Projects' },
      { path: '/submissions', icon: <MdAssignment />, label: 'Submissions' },
      { path: '/tasks', icon: <MdTask />, label: 'Tasks' },
      { path: '/discussion', icon: <MdForum />, label: 'Discussion Board' },
      { path: '/chatbot', icon: <MdSmartToy />, label: 'Chatbot Assistant' },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" stroke="#1ABC9C" strokeWidth="3" fill="none"/>
            <path d="M50 15 L50 5" stroke="#1ABC9C" strokeWidth="3"/>
            <path d="M50 95 L50 85" stroke="#1ABC9C" strokeWidth="3"/>
            <path d="M15 50 L5 50" stroke="#1ABC9C" strokeWidth="3"/>
            <path d="M95 50 L85 50" stroke="#1ABC9C" strokeWidth="3"/>
            <path d="M50 20 L60 35 L50 30 L40 35 Z" fill="#1ABC9C"/>
            <path d="M35 45 L65 45 L65 55 L60 50 L55 55 L50 50 L45 55 L40 50 L35 55 Z" fill="#1B4965"/>
          </svg>
        </div>
        <span className="logo-text">FYP COMPASS</span>
        <button className="sidebar-close" onClick={onClose}>
          <MdClose />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <MdLogout />
        <span>Log Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
