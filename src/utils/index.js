import * as dateFns from 'date-fns';

/**
 * 格式化日期时间
 * @param {string} dateString - 日期时间字符串
 * @returns {string} - 格式化后的日期时间字符串
 */
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    return dateFns.format(new Date(dateString), 'yyyy-MM-dd HH:mm');
  } catch (error) {
    console.error('日期时间格式化错误:', error);
    return '-';
  }
};

export { formatDateTime };
