import { Button, Typography, Modal } from 'antd';
import '../components/CustomCard.css';
import Section from '../components/Section';
import '../components/Section.css';
import './HomePage.css';
import hotPlacesData from '../data/hotPlacesData';
import familyHotelsData from '../data/familyHotelsData';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // Features data
  const featuresData = [
    {
      icon: '🗓️',
      title: 'Easy Planning',
      description: 'Intuitive tools that make trip planning a breeze, not a burden.',
      link: '/previous-plans'
    },
    {
      icon: '👶',
      title: 'Kid-Friendly Focus',
      description: 'Find destinations and activities perfect for children of all ages.',
      link: '/previous-plans'
    },
    {
      icon: '💰',
      title: 'Budget Management',
      description: 'Keep track of expenses and find family-friendly deals and discounts.',
      link: '/previous-plans'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access your plans anywhere, anytime - perfect for busy parents.',
      link: '/previous-plans'
    }
  ];

  // Testimonials data
  const testimonialsData = [
    {
      icon: '💬',
      title: 'Sarah M.',
      description: '"This app saved me hours of planning time!"',
      author: 'Mom of 3',
      link: '/previous-plans'
    },
    {
      icon: '💬',
      title: 'Jessica L.',
      description: '"Finally, a travel planner that gets families."',
      author: 'Working Mom',
      link: '/previous-plans'
    },
    {
      icon: '💬',
      title: 'Maria R.',
      description: '"Our best family vacation yet, thanks to this tool!"',
      author: 'Adventure Mom',
      link: '/previous-plans'
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
              无论是挑选亲子胜地，还是管理出行预算，我们统统为您搞定！
            </p>
            <div className="hero-buttons">
              <Link 
                to={isAuthenticated ? '/travel-plan' : '/login'}
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
        visible={modalVisible}
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
        title="热门地点"
        cards={hotPlacesData}
        backgroundColor="#e8f5e9"
      />

      {/* Hot Places Section */}
      <Section
        title="小眾地点"
        cards={hotPlacesData}
        backgroundColor="white"
      />

      {/* Family Friendly Hotels Section */}
      <Section
        title="家庭友好型酒店"
        cards={familyHotelsData}
        backgroundColor="#e8f5e9"
      />

      {/* Testimonials Section */}
      <Section
        title="用户口碑"
        cards={testimonialsData}
        backgroundColor="white"
      />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2}>准备好开启您的家庭之旅了吗？</Title>
            <Paragraph>携手万千家庭，一同圆旅行之梦。</Paragraph>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;