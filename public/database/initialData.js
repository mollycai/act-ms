const initialData = {
  // banner
  banners: [
    {
      id: 'main_banner_1',
      title: '🎉年度最大促销活动',
      content: '全场商品低至5折，限时抢购中！',
      link: '/promotion/annual',
      backgroundColor: 'var(--semi-ai-general-5)',
      textColor: 'var(--semi-color-bg-0)',
      startTime: '2024-10-01T00:00:00',
      endTime: '2024-10-31T23:59:59',
    },
  ],
  // 活动分类
  categories: [
    {
      id: 'cat_1',
      name: '限时抢购',
      icon: 'flash-on',
      color: 'rgba(var(--semi-red-5), 1)',
      description: '每日限时特惠商品',
      order: 1,
      isActive: true,
      count: 100,
    },
    {
      id: 'cat_2',
      name: '新品首发',
      icon: 'star',
      color: 'rgba(var(--semi-orange-5), 1)',
      description: '最新产品抢先购',
      order: 2,
      isActive: true,
      count: 50,
    },
    {
      id: 'cat_3',
      name: '满减优惠',
      icon: 'tag',
      color: 'rgba(var(--semi-green-5), 1)',
      description: '购物满额立减',
      order: 3,
      isActive: true,
      count: 75,
    },
    {
      id: 'cat_4',
      name: '会员专享',
      icon: 'person',
      color: 'rgba(var(--semi-violet-5), 1)',
      description: '会员特权活动',
      order: 4,
      isActive: true,
      count: 30,
    },
    {
      id: 'cat_5',
      name: '组合套餐',
      icon: 'group-work',
      color: 'rgba(var(--semi-indigo-5), 1)',
      description: '优惠组合套装',
      order: 5,
      isActive: true,
      count: 20,
    },
    {
      id: 'cat_6',
      name: '品牌活动',
      icon: 'local-offer',
      color: 'rgba(var(--semi-yellow-5), 1)',
      description: '品牌专属活动',
      order: 6,
      isActive: true,
      count: 40,
    },
  ],
  // 轮播图
  announcements: [
    {
      id: 'announce_1',
      title: '双十一预热活动开始',
      description: '提前加购，享受优先发货和额外优惠',
      imageUrl:
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-1.png',
      link: '/promotion/double11',
      startTime: '2024-10-20T00:00:00',
      endTime: '2024-11-11T23:59:59',
      isActive: true,
    },
    {
      id: 'announce_2',
      title: '新品发布：智能手表Pro',
      description: '超长续航，健康监测，立即预约体验',
      imageUrl:
        '	https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-2.png',
      link: '/products/smartwatch-pro',
      startTime: '2024-10-15T00:00:00',
      endTime: '2024-11-30T23:59:59',
      isActive: true,
    },
    {
      id: 'announce_3',
      title: '会员专享：积分翻倍',
      description: '会员购物积分翻倍，限时一周',
      imageUrl:
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-3.png',
      link: '/membership/benefits',
      startTime: '2024-10-25T00:00:00',
      endTime: '2024-10-31T23:59:59',
      isActive: true,
    },
  ],
};

export default initialData;
