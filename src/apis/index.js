// 模拟网络延迟函数
const simulateNetworkDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 获取Banner列表
export const getBanners = async () => {
  try {
    // 模拟网络延迟800ms
    await simulateNetworkDelay(800);
    const banners = await window.dbManager.getAll('banners');
    return banners;
  } catch (error) {
    console.error('获取Banner数据失败:', error);
    return [];
  }
};

// 获取活动分类
export const getActivityCategories = async () => {
  try {
    await simulateNetworkDelay(600);
    const categories = await window.dbManager.getAll('categories');
    return categories;
  } catch (error) {
    console.error('获取分类数据失败:', error);
    return [];
  }
};

// 获取轮播图数据
export const getCarousels = async () => {
  try {
    await simulateNetworkDelay(600);
    const carousels = await window.dbManager.getAll('announcements');
    return carousels;
  } catch (error) {
    console.error('获取轮播图数据失败:', error);
    return [];
  }
};

// 根据活动id获取活动详情
export const queryActivityList = async (query) => {
  try {
    await simulateNetworkDelay(500);

    const activity = await window.dbManager.query('activities', query);
    return activity;
  } catch (error) {
    console.error('根据活动id获取活动详情失败:', error);
    return null;
  }
};
