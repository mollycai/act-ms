import { Card, Typography } from '@douyinfe/semi-ui';
import {
  IconTicketCode,
  IconStar,
  IconAlarm,
  IconPriceTag,
  IconMember,
  IconUserGroup,
  IconGift,
  IconChevronRight,
} from '@douyinfe/semi-icons';
import './index.css';

const { Text } = Typography;

// 图标映射，将initialData中的icon名称映射到实际的图标组件
const iconMap = {
  'flash-on': <IconAlarm size="large" className="icon" />,
  star: <IconStar size="large" className="icon" />,
  tag: <IconPriceTag size="large" className="icon" />,
  person: <IconMember size="large" className="icon" />,
  'group-work': <IconUserGroup size="large" className="icon" />,
  'local-offer': <IconGift size="large" className="icon" />,
};

const ActivityCategoryCard = ({ category }) => {
  // 直接从category对象获取图标
  const getIcon = () => {
    // 如果category有icon属性，并且在iconMap中有对应的映射，则使用该图标
    if (category.icon && iconMap[category.icon]) {
      return iconMap[category.icon];
    }
    return <IconTicketCode size={24} />; // 默认图标
  };

  // 直接从category对象获取颜色
  const getColor = () => {
    return category.color || 'rgba(var(--semi-blue-5), 1)'; // 默认颜色
  };

  const handleClick = () => {};

  return (
    <Card className="activity-category-card" onClick={handleClick}>
      <div className="card-content">
        <div className="icon-container" style={{ backgroundColor: getColor() }}>
          {getIcon()}
        </div>
        <div className="category-info">
          <Text strong className="category-name">
            {category.name || '未命名分类'}
          </Text>
          <Text type="secondary" className="category-desc">
            {category.description || '暂无描述'}
          </Text>
          {category.count !== undefined && (
            <Text type="secondary" size="small" className="category-count">
              {category.count} 个活动
            </Text>
          )}
        </div>
        <div className="icon-container">
          <IconChevronRight />
        </div>
      </div>
    </Card>
  );
};

export default ActivityCategoryCard;
