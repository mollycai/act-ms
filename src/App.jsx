import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Typography, Banner, Image, Popover } from '@douyinfe/semi-ui';
import { IconBulb } from '@douyinfe/semi-icons';
import { getBanners } from '@/apis';
import { useGuide } from '@/components/Guide/GuideProvider';
import './index.css';

function App() {
  const { Header, Content } = Layout;
  const { Title } = Typography;
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [count, setCount] = useState(0);

  // @TODO 有待打磨，这段逻辑也可以抽离成hooks
  const location = useLocation();
  const { start } = useGuide();
  // 从当前url获取当前页面的key，用于新手指引
  const getPageKey = (pathname) => {
    if (pathname === '/home') return 'home';
    if (/^\/activity\/[^/]+\/detail\/[^/]+$/.test(pathname))
      return 'activityDetail';
    if (/^\/activity\/[^/]+$/.test(pathname)) return 'activityList';
    return 'home';
  };

  // 点击帮助图标，开始新手指引
  const handleHelpClick = () => {
    start(getPageKey(location.pathname));
  };

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

  // 点击标题跳转到首页
  function handleTitleClick() {
    navigate('/home');
  }

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
          <div className="app-header-left">
            <Image src="/vite.svg" alt="logo" className="header-logo" />
            <Title
              heading={3}
              className="header-title"
              onClick={handleTitleClick}
            >
              活动管理平台
            </Title>
          </div>
          <div className="app-header-right">
            <Popover
              showArrow
              arrowPointAtCenter
              content="新手指引"
              trigger="hover"
              position="bottom"
            >
              <IconBulb
                size="large"
                className="header-icon-help"
                onClick={handleHelpClick}
              />
            </Popover>
          </div>
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
