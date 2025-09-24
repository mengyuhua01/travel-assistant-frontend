import { Button, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRecommendations, getUserTag } from '../apis/user.js';
import '../components/CustomCard.css';
import Section from '../components/Section';
import '../components/Section.css';
import { useAuth } from '../contexts/AuthContext';
import hotPlacesData from '../data/hotPlacesData';
import './HomePage.css';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchAndSetRecommendations = async () => {
      if (isAuthenticated) {
        try {
          const tags = await getUserTag();
          if (tags && Array.isArray(tags)) {
            const tagIds = tags.map(tag => tag.id);
            console.log('User Tag IDs:', tagIds);

            if (tagIds.length > 0) {
              const recommendedData = await getRecommendations(tagIds);
              setRecommendations(recommendedData);
              console.log('Fetched Recommendations:', recommendedData);
            } else {
              const recommendedData = await getRecommendations();
              setRecommendations(recommendedData);
              console.log('Fetched Recommendations:', recommendedData);
            }
          }
        } catch (error) {
          console.error('Failed to fetch user tags or recommendations on HomePage:', error);
        }
      }
    };

    fetchAndSetRecommendations();
  }, [isAuthenticated]);

  // Features data
  const featuresData = [
    {
    icon: '🗓️',
    title: 'AI智能行程规划',
    description: '由AI驱动，能深度理解您的偏好与需求，一键生成完全个人化的专属行程。',
  },
  {
    icon: '👶',
    title: '弹性动态行程调整',
    description: '旅途中最懂应变，可随时根据突发状况，实时推荐替代方案。',
  },
  {
    icon: '💰',
    title: '直观化预算管理',
    description: ' 以清晰图表实时追踪与预测花费，让您对整体支出一目了然，轻松掌控旅游预算。',
  },
  {
    icon: '📱',
    title: '个人化旅游动态推送',
    description: ' 在主页主动提供您可能感兴趣的当地活动与秘境景点，让惊喜不间断。',
  }
  ];



  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              规划您的完美家庭之旅 <p className="highlight">缔造无忧难忘回忆！</p>
            </h1>
            
            <p className="hero-subtitle">
              无论是挑选旅游胜地，还是管理出行预算，我们统统为您搞定！
            </p>
            <div className="hero-buttons">
              <Link 
                to={isAuthenticated ? '/plan' : '/login'}
                onClick={(e) => { if (!isAuthenticated) { e.preventDefault(); setModalVisible(true); } }}
              >
                <Button type="primary" size="large" className="cta-primary">
                  开始规划
                </Button>
              </Link>
              <Button size="large" className="cta-secondary">
                观看演示
              </Button>
            </div>
            <Modal
        title="请先登录"
        open={modalVisible}
        onOk={() => { setModalVisible(false); navigate('/login'); }}
        onCancel={() => setModalVisible(false)}
      >
        您需要登录哦，马上开始规划您的旅行吧！
      </Modal>
          </div>
          <div className="hero-image">
            <div className="family-illustration">
              <span className="family-emoji">👨‍👩‍👧‍👦</span>
              <div className="travel-icons">
                <span>✈️</span>
                <span>🏖️</span>
                <span>🎪</span>
                <span>🚗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section title="揭秘：大家为啥都超爱我们的行程规划？" cards={featuresData} />

      {/* Hot Places Section */}
      <Section
        title="为你精选"
        cards={recommendations}
        backgroundColor="#e8f5e9"
      />

      {/* Hot Places Section */}
      <Section
        title="过往计划"
        cards={hotPlacesData}
        backgroundColor="white"
      />

      {/* Family Friendly Hotels Section */}
      {/* <Section
        title="家庭友好型酒店"
        cards={familyHotelsData}
        backgroundColor="#e8f5e9"
      /> */}

      {/* Testimonials Section */}
      {/* <Section
        title="用户口碑"
        cards={testimonialsData}
        backgroundColor="white"
      /> */}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} style={{ color: 'white' }}>准备好开启您的家庭之旅了吗？</Title>
            <Paragraph style={{ color: 'white' }}>携手万千家庭，一同圆旅行之梦。</Paragraph>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;