import { HomeOutlined, LoginOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Navigation.css';


const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">✈️</span>
            Family Travel Planner
          </Link>
        </div>

        <div className="nav-menu">
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
        </div>

        <div className="nav-auth">
          <Link to="/login" className="login-btn">
            <LoginOutlined />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;