/**
 * Header Component
 * Top navigation bar displaying user information and menu toggle
 * Shows current logged-in user's name
 */

import { useAuth } from "../../context/AuthContext";
import { MdAccountCircle, MdMenu, MdLogout } from "react-icons/md";
import "./Header.css";

/**
 * HEADER COMPONENT
 * Displays the top navigation bar with:
 * - Menu button (for mobile sidebar toggle)
 * - Current user name/ID
 * - Profile icon
 * - Logout button
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onMenuClick - Callback when menu button is clicked
 */
const Header = ({ onMenuClick }) => {
  // Get current user and logout function from auth context
  const { user, logout } = useAuth();

  return (
    <header className="header">
      {/* Left side - Menu button and user info */}
      <div className="header-left">
        {/* Mobile menu toggle button */}
        <button className="menu-btn" onClick={onMenuClick}>
          <MdMenu />
        </button>

        {/* Display user's name or ID */}
        <span className="student-id">
          {user?.name || user?.studentId || "User"}
        </span>
      </div>

      {/* Right side - Profile icon and Logout */}
      <div className="header-right">
        <button className="logout-btn" onClick={logout} title="Logout">
          <MdLogout />
        </button>
        <div className="profile-icon">
          <MdAccountCircle />
        </div>
      </div>
    </header>
  );
};

export default Header;
