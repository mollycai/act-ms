import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from '@/routers';
import './index.css';

import { GuideProvider } from '@/components/Guide/GuideProvider';
import { registerGuide } from '@/components/Guide/registry';
import { guideConfigs } from '@/components/Guide/configs';

// 等待数据库初始化完成
async function startApp() {
  try {
    // 检查是否存在初始化Promise
    if (window.dbInitialized) {
      await window.dbInitialized;
    }

    console.log('数据库已准备好，启动应用');

    // 注册引导弹窗
    Object.keys(guideConfigs).forEach((key) => {
      registerGuide(key, { steps: guideConfigs[key] });
    });

    createRoot(document.getElementById('root')).render(
      <GuideProvider>
        <RouterProvider router={router} />
      </GuideProvider>
    );
  } catch (error) {
    console.error('启动应用失败:', error);
  }
}

// 启动应用
startApp();
