import dbManager from './indexedDBManager.js';
import initialData from './initialData.js';

// 暴露全局变量
window.dbManager = dbManager;

// 初始化数据库
const initDB = async () => {
  try {
    await dbManager.initializeData(initialData);
    console.log('数据库初始化完成');
    // 触发自定义事件通知数据库已初始化
    window.dispatchEvent(new CustomEvent('databaseInitialized'));
    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return false;
  }
};

// 立即执行初始化
window.dbInitialized = initDB();
