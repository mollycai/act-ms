import { useState } from 'react';
import {
  Typography,
  RadioGroup,
  Radio,
  Space,
  Empty,
  Skeleton,
} from '@douyinfe/semi-ui';
import { IconGridView, IconListView } from '@douyinfe/semi-icons';
import ActivityCategoryCard from '@/views/Home/ActivityCategoryCard';
import './index.css';

const ActivityCategoryPanel = ({
  categories = [],
  loading = false,
  title = '活动分类',
}) => {
  const { Title } = Typography;
  const [layout, setLayout] = useState('grid'); // 'grid' 或 'list'

  const handleLayoutToggle = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  // 创建骨架屏组件
  const renderSkeleton = () => {
    // 创建单个骨架屏卡片的占位符
    const cardPlaceholder = (
      <div className={`skeleton-card ${layout}`}>
        <div className="skeleton-card-content">
          <Skeleton.Avatar style={{ marginRight: 12 }} />
          <div className="skeleton-info">
            <Skeleton.Paragraph style={{ width: '80%' }} />
          </div>
        </div>
      </div>
    );

    // 创建6个骨架屏卡片
    const skeletonCards = Array(6)
      .fill(null)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className={
            layout === 'grid' ? 'category-item-grid' : 'category-item-list'
          }
        >
          <Skeleton
            placeholder={cardPlaceholder}
            loading={true}
            active={true}
          ></Skeleton>
        </div>
      ));

    return (
      <div className={`categories-container ${layout}`}>{skeletonCards}</div>
    );
  };

  return (
    <div className="activity-category-panel">
      {/* 面板头部 */}
      <div className="panel-header">
        <Title heading={4}>{title}</Title>
        <Space>
          <RadioGroup
            className="activity-category-radio-group"
            type="button"
            buttonSize="small"
            value={layout}
            onChange={handleLayoutToggle}
          >
            <Radio value="grid">
              <IconGridView />
            </Radio>
            <Radio value="list">
              <IconListView />
            </Radio>
          </RadioGroup>
        </Space>
      </div>

      {/* 内容区域 */}
      <div className="panel-content">
        {loading ? (
          renderSkeleton()
        ) : categories.length === 0 ? (
          <Empty description="暂无分类数据" />
        ) : (
          <div className={`categories-container ${layout}`}>
            {categories.map((category, index) => (
              <div
                key={category.id || index}
                className={
                  layout === 'grid'
                    ? 'category-item-grid'
                    : 'category-item-list'
                }
              >
                <ActivityCategoryCard category={category} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCategoryPanel;
