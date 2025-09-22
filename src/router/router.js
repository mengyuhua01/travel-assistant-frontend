import { createBrowserRouter } from 'react-router-dom';
import TravelLayout from '../layout/TravelLayout';


const router = createBrowserRouter([
  {
    path: '/',
    element: <TravelLayout />,
    children: [

    ]
  }
]);

export default router;
