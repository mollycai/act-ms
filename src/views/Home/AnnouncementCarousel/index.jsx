import { useState } from 'react';
import { Carousel, Typography, Card, Skeleton } from '@douyinfe/semi-ui';

const { Title, Text } = Typography;

const AnnouncementCarousel = ({ announcements = [], loading = false }) => {
  // eslint-disable-next-line no-unused-vars
  const [currentSlide, setCurrentSlide] = useState(0);

  // 只显示激活状态的公告
  const activeAnnouncements = announcements.filter(
    (announce) => announce.isActive
  );

  // 处理轮播图切换
  const handleChange = (index) => {
    setCurrentSlide(index);
  };

  // 处理公告点击
  const handleAnnouncementClick = (announcement) => {
    if (announcement.link) {
      window.location.href = announcement.link;
    }
  };

  // 骨架屏幕
  const placeholder = (
    <div>
      <Skeleton.Image style={{ width: '100%', height: '400px' }} />
    </div>
  );

  return (
    <Skeleton placeholder={placeholder} loading={loading} active>
      {activeAnnouncements.length > 0 ? (
        <Carousel
          autoplay={5000}
          speed={1000}
          onChange={handleChange}
          style={{ borderRadius: '8px', overflow: 'hidden', height: '400px' }}
        >
          {activeAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement)}
              style={{
                cursor: announcement.link ? 'pointer' : 'default',
                height: '400px',
                backgroundImage: `url(${announcement.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Title heading={1} style={{ margin: '60px 0 8px 60px' }}>
                {announcement.title}
              </Title>
              <Text style={{ margin: '0 0 0 60px' }}>
                {announcement.description}
              </Text>
            </div>
          ))}
        </Carousel>
      ) : (
        <Card style={{ padding: '24px', textAlign: 'center' }}>
          <Text type="secondary">暂无公告</Text>
        </Card>
      )}
    </Skeleton>
  );
};

export default AnnouncementCarousel;
