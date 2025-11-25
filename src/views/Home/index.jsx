import { useEffect, useState } from 'react';
import { getActivityCategories, getCarousels } from '@/apis';
import ActivityCategoryPanel from '@/views/Home/ActivityPanel';
import AnnouncementCarousel from '@/views/Home/AnnouncementCarousel';

function Home() {
  const [categories, setCategories] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [carouselLoading, setCarouselLoading] = useState(false);

  async function fetchCategoryData() {
    setCategoryLoading(true);
    try {
      const categoriesData = await getActivityCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setCategoryLoading(false);
    }
  }

  async function fetchCarouselData() {
    setCarouselLoading(true);
    try {
      const carouselsData = await getCarousels();
      setCarousels(carouselsData || []);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setCarouselLoading(false);
    }
  }

  useEffect(() => {
    fetchCarouselData();
    fetchCategoryData();
  }, []);

  return (
    <div className="home-container">
      {/* 活动分类面板 */}
      <div className="section" style={{ marginBottom: '24px' }}>
        <AnnouncementCarousel
          announcements={carousels}
          loading={carouselLoading}
        />
      </div>
      <div className="section">
        <ActivityCategoryPanel
          categories={categories}
          loading={categoryLoading}
          title="活动分类"
        />
      </div>
    </div>
  );
}

export default Home;
