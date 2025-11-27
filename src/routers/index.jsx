import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from '@/App';

// 懒加载组件
const Home = lazy(() => import('@/views/Home/index.jsx'));
const ActivityList = lazy(() => import('@/views/ActivityList/index.jsx'));
const ActivityDetail = lazy(() => import('@/views/ActivityDetail/index.jsx'));

// 创建一个简单的 Loading 组件用于 Suspense fallback
const LoadingFallback = () => <div>Loading...</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/home" replace />, // 根路径重定向到home
      },
      {
        path: 'home',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'activity/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ActivityList />
          </Suspense>
        ),
      },
      {
        path: 'activity/:categoryId/detail/:activityId',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ActivityDetail />
          </Suspense>
        ),
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
