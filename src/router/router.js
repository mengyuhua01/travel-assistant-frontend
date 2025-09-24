import { createBrowserRouter } from 'react-router-dom';
import TravelLayout from '../layout/TravelLayout';
import HomePage from '../pages/HomePage.js';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import StartPage from '../pages/StartPage.jsx';
import TravelPlanPage from '../pages/TravelPlanPage.jsx';
import UserPage from '../pages/UserPage.jsx';
import InterestSelection from '../pages/InterestSelection.jsx';
import TripDetailsPage from '../pages/TripDetailsPage.js';
import ProtectedRoute from '../components/ProtectedRoute';
import TravelHistoryPage from '../pages/TravelHistoryPage.jsx';
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
        element: <TravelLayout />,
        children: [
            {
                index: true,
                element: <HomePage/>
            }
        ]
    },
    {
        path: '/start',
        element: <StartPage/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/register',
        element: <Register/>
    },

    // 受保护的页面（需要登录）- 根路径作为应用入口
    {
        path: '/',
        element: (
            <ProtectedRoute>
              <TravelLayout />
            </ProtectedRoute>
        ),
        children: [
            
            // 在这里添加其他受保护的页面路由
            // 示例：
            // {
            //   path: 'trip/:id',  // 访问路径：/trip/123
            //   element: <TripDetailsPage />
            // }
            {
              path: 'trip/:id',  // 访问路径：/trip/123
              element: <TripDetailsPage />
            },
            {
                path: 'plan', 
                element: <TravelPlanPage/>
            },
            {
              path: 'user',  // 访问路径：/user
              element: <UserPage/>
            },
            {   
              path: 'interests',  // 访问路径：/interests
              element: <InterestSelection/>
            },
            {
                path: 'history',  // 访问路径：/history
                element: <TravelHistoryPage/>
            }
            // 其他受保护页面示例（当需要时取消注释）：
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
