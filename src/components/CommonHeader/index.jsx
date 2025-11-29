import { Layout, Typography, Image, Popover } from '@douyinfe/semi-ui';
import { IconBulb } from '@douyinfe/semi-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGuide } from '@/components/Guide/GuideProvider';
import './index.css';

const CommonHeader = () => {
  const { Header } = Layout;
  const { Title } = Typography;

  const navigate = useNavigate();

  // 点击标题跳转到首页
  function handleTitleClick() {
    navigate('/home');
  }

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

  return (
    <Header className="app-header">
      <div className="app-header-left">
        <Image src="/vite.svg" alt="logo" className="header-logo" />
        <Title heading={3} className="header-title" onClick={handleTitleClick}>
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
  );
};

export default CommonHeader;
