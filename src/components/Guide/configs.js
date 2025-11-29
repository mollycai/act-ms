/**
 * 引导步骤的配置:
 * 1. 每个键值对表示一个页面的引导步骤配置，键为页面路由名称，值为引导步骤的数组
 * 2. 每个引导步骤对象包含以下属性：
 *    selector: 用于定位目标元素的CSS选择器
 *    title: 引导步骤的标题，显示在弹窗中
 *    content: 引导步骤的详细描述，显示在弹窗中
 *    placement: 弹窗的显示位置，可选值为top、bottom、left、right
 */
export const guideConfigs = {
  home: [
    {
      selector: '.activity-category-radio-group',
      title: '布局',
      content: '切换面板布局查看不同展示',
      placement: 'left',
    },
    {
      selector: '.activity-category-card',
      title: '进入活动列表',
      content: '点击分类卡片进入对应活动列表',
      placement: 'right',
    },
  ],
  activityList: [
    {
      selector: '.semi-form',
      title: '筛选条件',
      content: '通过筛选快速定位目标活动',
      placement: 'bottom',
    },
    {
      selector: '.semi-table',
      title: '数据列表',
      content: '查看活动数据，支持分页切换',
      placement: 'top',
    },
    {
      selector: '.semi-table .semi-button',
      title: '查看详情',
      content: '点击操作进入活动详情并进行编辑',
      placement: 'left',
    },
  ],
  activityDetail: [
    {
      selector: '.activity-detail-header',
      title: '返回与编辑',
      content: '这里可以返回、编辑与保存',
      placement: 'bottom',
    },
    {
      selector: '.activity-detail-main',
      title: '活动信息',
      content: '查看并编辑活动的核心信息与规则',
      placement: 'top',
    },
  ],
};
