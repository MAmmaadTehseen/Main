import { useAuth } from '../../context/AuthContext';
import { MdAccountCircle, MdMenu } from 'react-icons/md';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <MdMenu />
        </button>
        <span className="student-id">{user?.name || user?.studentId || 'User'}</span>
      </div>
      <div className="header-right">
        <div className="profile-icon">
          <MdAccountCircle />
        </div>
      </div>
    </header>
  );
};

export default Header;
