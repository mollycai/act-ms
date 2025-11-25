import { createRoot } from 'react-dom/client';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/routers';
import './index.css';

// 等待数据库初始化完成
async function startApp() {
  try {
    // 检查是否存在初始化Promise
    if (window.dbInitialized) {
      await window.dbInitialized;
    }

    console.log('数据库已准备好，启动应用');
    createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('启动应用失败:', error);
  }
}

// 启动应用
startApp();
