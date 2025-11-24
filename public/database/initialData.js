const initialData = {
  banners: [
    {
      id: 'main_banner_1',
      title: '年度最大促销活动',
      content: '全场商品低至5折，限时抢购中！',
      link: '/promotion/annual',
      backgroundColor: '#ff4d4f',
      textColor: '#ffffff',
      showIcon: true,
      iconType: 'bell',
      startTime: '2024-10-01T00:00:00',
      endTime: '2024-10-31T23:59:59',
      isActive: true
    }
  ],
  categories: [
    {
      id: 'cat_1',
      name: '限时抢购',
      icon: 'flash-on',
      color: '#ff4d4f',
      description: '每日限时特惠商品',
      order: 1,
      isActive: true
    },
    {
      id: 'cat_2',
      name: '新品首发',
      icon: 'star',
      color: '#ff9800',
      description: '最新产品抢先购',
      order: 2,
      isActive: true
    },
    {
      id: 'cat_3',
      name: '满减优惠',
      icon: 'tag',
      color: '#4caf50',
      description: '购物满额立减',
      order: 3,
      isActive: true
    },
    {
      id: 'cat_4',
      name: '会员专享',
      icon: 'person',
      color: '#2196f3',
      description: '会员特权活动',
      order: 4,
      isActive: true
    },
    {
      id: 'cat_5',
      name: '组合套餐',
      icon: 'group-work',
      color: '#9c27b0',
      description: '优惠组合套装',
      order: 5,
      isActive: true
    },
    {
      id: 'cat_6',
      name: '品牌活动',
      icon: 'local-offer',
      color: '#607d8b',
      description: '品牌专属活动',
      order: 6,
      isActive: true
    }
  ]
};

export default initialData;
