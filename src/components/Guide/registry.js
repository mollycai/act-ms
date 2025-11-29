const map = new Map();

/**
 * 注册引导步骤，用来存储引导步骤的配置
 * @param {string} key - 引导步骤的唯一标识，例如页面路由名称
 * @param {object|object[]} config - 引导步骤的配置，单个对象或数组
 */
const registerGuide = (key, config) => {
  if (!key) return;
  const steps = Array.isArray(config) ? config : config?.steps;
  map.set(key, steps || []);
};

/**
 * 获取引导步骤的配置
 * @param {string} key - 引导步骤的唯一标识，例如页面路由名称
 * @returns {object[]} - 引导步骤的配置数组
 */
const getGuide = (key) => {
  return map.get(key) || [];
};

/**
 * 检查是否存在指定的引导步骤
 * @param {string} key - 引导步骤的唯一标识，例如页面路由名称
 * @returns {boolean} - 如果存在指定的引导步骤，则返回true，否则返回false
 */
const hasGuide = (key) => {
  return map.has(key);
};

export { registerGuide, getGuide, hasGuide };
