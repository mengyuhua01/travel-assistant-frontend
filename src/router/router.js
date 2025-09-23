import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import TravelPlanPage from "../pages/TravelPlanPage";
import TravelLayout from "../layout/TravelLayout";


const router = createBrowserRouter([
    {
        path: '/',
        element: <TravelLayout/>,
        children: [
            { path: '', element: <HomePage/> },
            { path: '/plan', element: <TravelPlanPage/> },
        ]
    }
]);

export default router;
