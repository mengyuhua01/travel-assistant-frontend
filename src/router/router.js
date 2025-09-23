import { createBrowserRouter } from 'react-router-dom';
import TravelLayout from '../layout/TravelLayout';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import HomePage from '../pages/HomePage.js';
import InterestSelection from '../pages/InterestSelection.jsx';
// 导入其他页面组件（当需要时取消注释）
// import TripDetailsPage from '../pages/TripDetailsPage';
// import UserProfile from '../pages/UserProfile';
// import UserSettings from '../pages/UserSettings';
// import AboutPage from '../pages/AboutPage';
// import HelpPage from '../pages/HelpPage';

const router = createBrowserRouter([
  // 根路径 - 所有用户都看到HomePage
  {
    path: '/',
    element: <TravelLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      // 在这里添加其他页面路由
      // 示例：
      // {
      //   path: 'trip/:id',  // 访问路径：/trip/123
      //   element: <TripDetailsPage />
      // },
      // {
      //   path: 'profile',   // 访问路径：/profile
      //   element: <UserProfile />
      // },
      // {
      //   path: 'settings',  // 访问路径：/settings
      //   element: <UserSettings />
      // },
      // {
      //   path: 'my-trips',  // 访问路径：/my-trips
      //   element: <MyTrips />
      // }
    ]
  },
  
  // 登录和注册页面
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/interests',
    element: <InterestSelection />
  }
  
  // 其他公开页面示例（当需要时取消注释）：
  // {
  //   path: '/about',
  //   element: <AboutPage />
  // },
  // {
  //   path: '/help',
  //   element: <HelpPage />
  // }
]);

export default router;
