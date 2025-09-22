import { createBrowserRouter } from 'react-router-dom';
import TravelLayout from '../layout/TravelLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import StartPage from '../pages/StartPage';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import HomePage from '../pages/HomePage.jsx';


const router = createBrowserRouter([
  {
    path: '/start',
    element: <StartPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <TravelLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      }
      // 在这里可以添加其他受保护的页面路由
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

export default router;
