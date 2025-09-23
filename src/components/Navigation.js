import { HomeOutlined, PlusOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">✈️</span>
            Family Travel Planner
          </Link>
        </div>
        
        {isAuthenticated && (
         <div className="nav-menu">
          <Link to="/" className="nav-link">
            <HomeOutlined className="nav-icon" />
            Home
          </Link>
          </div>
          )}
        <div className="nav-menu">
          
          {isAuthenticated && (
            <Link to="/" className="nav-link">
              <PlusOutlined className="nav-icon" />
              Start Plan
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/" className="nav-link">
              <UserOutlined className="nav-icon" />
              User Page
            </Link>
          )}
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="login-btn">
              <LogoutOutlined />
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              <UserOutlined />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;