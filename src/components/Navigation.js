import { HomeOutlined, LogoutOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';


const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">✈️</span>
            Togother
          </Link>
        </div>

        <div className="nav-menu">
          {isAuthenticated && (
            <>
              <Link to="/" className="nav-link">
                <HomeOutlined className="nav-icon" />
                Home
              </Link>
              <Link to="/plan" className="nav-link">
                <PlusOutlined className="nav-icon" />
                Start Plan
              </Link>
              <Link to="/" className="nav-link">
                <UserOutlined className="nav-icon" />
                User Page
              </Link>
            </>
          )}
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <button onClick={logout} className="login-btn">
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