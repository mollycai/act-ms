import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '@/App';
import Home from '@/views/Home/index.jsx';
import ActivityList from '@/views/ActivityList/index.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Navigate to="/home" replace />, // 根路径重定向到home
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'activity/:id',
        element: <ActivityList />,
      },
      // 其他路径都重定向到home
      {
        path: '*',
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);

export default router;
