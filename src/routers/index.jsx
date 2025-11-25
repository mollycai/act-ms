import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../views/Home/index.jsx';

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
    ],
  },
]);

export default router;
