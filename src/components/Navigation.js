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
            <img src="/image/logo-removebg.png" alt="Travel Assistant Logo" className="brand-logo" />
          </Link>
        </div>

        <div className="nav-menu">
          {isAuthenticated && (
            <>
              <Link to="/" className="nav-link">
                <HomeOutlined className="nav-icon" />
                首页
              </Link>
              <Link to="/plan" className="nav-link">
                <PlusOutlined className="nav-icon" />
                开始规划
              </Link>
              <Link to="/user" className="nav-link">
                <UserOutlined className="nav-icon" />
                我的
              </Link>
            </>
          )}
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <Link to="/login"  onClick={logout} className="login-btn">
              <LogoutOutlined />  登出
            </Link>
          ) : (
            <Link to="/login" className="login-btn">
              <UserOutlined />  登入
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;