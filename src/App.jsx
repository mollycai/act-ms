import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Typography, Banner } from '@douyinfe/semi-ui';
import { getBanners } from '@/apis';
import './index.css';

function App() {
  const { Header, Content } = Layout;
  const { Title } = Typography;

  const [banners, setBanners] = useState([]);
  const [count, setCount] = useState(0);

  async function fetchData() {
    try {
      const bannersData = await getBanners();
      setBanners(bannersData || []);
      setCount(bannersData.length || 0);
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 关闭一个banner，更新count
  const handleCloseBanner = () => {
    setCount(count - 1);
  };

  const renderBanner = (banner) => {
    return (
      <Banner
        key={banner.id}
        description={`${banner.title}：${banner.content}`}
        icon={null}
        className="white-text banner-item"
        style={{
          height: '32px',
          padding: '4px 12px',
          background: banner.backgroundColor,
        }}
        closable
        onClose={handleCloseBanner}
      />
    );
  };

  return (
    <Layout className="app-layout">
      <div className="fixed-header-container">
        <div className="banners-container">{banners.map(renderBanner)}</div>
        <Header className="app-header">
          <Title heading={3} className="header-title">
            活动管理系统
          </Title>
        </Header>
      </div>
      {/* 内容区域，根据banner数量动态调整padding-top */}
      <Content
        className="app-content"
        style={{ paddingTop: `${64 + count * 32}px` }}
      >
        <div className="content-container">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
