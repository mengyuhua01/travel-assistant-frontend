import { createBrowserRouter } from 'react-router-dom';
import TravelLayout from '../layout/TravelLayout';
// import ProtectedRoute from '../components/ProtectedRoute';
import StartPage from '../pages/StartPage';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import HomePage from '../pages/HomePage.js';
// import TripDetailsDev from '../components/TripDetailsDev';
// 导入其他页面组件（当需要时取消注释）
// import TripDetailsPage from '../pages/TripDetailsPage';
// import UserProfile from '../pages/UserProfile';
// import UserSettings from '../pages/UserSettings';
// import AboutPage from '../pages/AboutPage';
// import HelpPage from '../pages/HelpPage';


const router = createBrowserRouter([
  // 公开页面（不需要登录）
  {
    path: '/',
    element: (
        <TravelLayout />
    ),
    children: [
      {
    path: '',
    element: <HomePage />
  },
  {
    path: 'start',
    element: <StartPage />
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'register',
    element: <Register />
  } 
    ]
  },
  
  // 受保护的页面（需要登录）- 根路径作为应用入口
  {
    path: '/',
    element: (
      // <ProtectedRoute>
      //   <TravelLayout />
      // </ProtectedRoute>
      <TravelLayout />
    ),
    children: [
      // 在这里添加其他受保护的页面路由
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
