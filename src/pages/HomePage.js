import PlanCard from '../components/PlanCard';
import { Button, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartOutlined, UserOutlined } from '@ant-design/icons';
import { getRecommendations, getUserTag } from '../apis/user.js';
import { getRecentTravelPlans } from '../apis/travelPlanApi';
import '../components/CustomCard.css';
import Section from '../components/Section';
import '../components/Section.css';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [publicRecommendations, setPublicRecommendations] = useState([]);
  const RECOMMENDATIONS_PER_PAGE = 8;
  const [recentPlanCards, setRecentPlanCards] = useState([]);
  
  useEffect(() => {
    // Fetch recent travel plans and convert to card format for the "过往计划" section
    const fetchRecentPlans = async () => {
      try {
        const response = await getRecentTravelPlans();
        const plans = response.data || response;
        const cards = Array.isArray(plans)
          ? plans.map(plan => ({
              title: plan.title || '旅行方案',
              description: plan.overview || '精心规划的旅行方案',
              link: `/trip/${plan.id}`
            }))
          : [];
        setRecentPlanCards(cards);
      } catch (error) {
        setRecentPlanCards([]);
      }
    };
    fetchRecentPlans();
  }, []);

  // Fetch public recommendations for all users
  useEffect(() => {
    const fetchPublicRecommendations = async () => {
      try {
        const publicData = await getRecommendations();
        setPublicRecommendations(Array.isArray(publicData) ? publicData : []);
        console.log('Fetched Public Recommendations:', publicData);
      } catch (error) {
        console.error('Failed to fetch public recommendations:', error);
        setPublicRecommendations([]);
      }
    };

    fetchPublicRecommendations();
  }, []);

  // Fetch personalized recommendations for authenticated users
  useEffect(() => {
    const fetchPersonalizedRecommendations = async () => {
      if (isAuthenticated) {
        try {
          const tags = await getUserTag();
          if (tags && Array.isArray(tags) && tags.length > 0) {
            const tagIds = tags.map(tag => tag.id);
            const recommendedData = await getRecommendations(tagIds);
            setRecommendations(Array.isArray(recommendedData) ? recommendedData : []);
            console.log('Fetched Personalized Recommendations:', recommendedData);
          } else {
            setRecommendations([]);
          }
        } catch (error) {
          console.error('Failed to fetch personalized recommendations:', error);
          setRecommendations([]);
        }
      } else {
        // For non-authenticated users, recommendations section will be empty
        setRecommendations([]);
      }
    };

    fetchPersonalizedRecommendations();
  }, [isAuthenticated, publicRecommendations]);

  // Features data
  const featuresData = [
    {
      icon: <img src="/image/task.png" alt="Task Icon" className="feature-icon" />,
      name: '易规划',
    },
    {
      icon: <img src="/image/mother.png" alt="Mother Icon" className="feature-icon" />,
      name: '亲子游',
    },
    {
      icon: <img src="/image/meeting.png" alt="Meeting Icon" className="feature-icon" />,
      name: '客制化',
    },
    {
      icon: <img src="/image/tools.png" alt="Tools Icon" className="feature-icon" />,
      name: '随心改',
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              懂你所想 行你所愿 <p className="highlight">旅行规划从未如此简单</p>
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
              {/* <Button size="large" className="cta-secondary">
                观看演示
              </Button> */}
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
        </div>
        <img src="/image/together_clean_white.svg" alt="Big Logo" className="big-logo" />
      </section>

      {/* Personalized Recommendations Section */}
      <Section
        title="为你精选"
        cards={recommendations}
        backgroundColor="white"
        pageSize={RECOMMENDATIONS_PER_PAGE}
        emptyContent={
          isAuthenticated ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ marginBottom: '20px' }}>您还没有选择兴趣偏好，无法为您提供个性化推荐</p>
              <Link to="/interests">
                <Button 
                  type="primary"
                  icon={<HeartOutlined />}
                  style={{ 
                    background: 'linear-gradient(135deg, #4caf50, #388e3c)', 
                    border: 'none', 
                    borderRadius: 8 
                  }}
                >
                  设置您的兴趣偏好
                </Button>
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ marginBottom: '20px' }}>登录后可以获得个性化推荐</p>
              <Link to="/login">
                <Button 
                  type="primary"
                  icon={<UserOutlined />}
                  style={{ 
                    background: 'linear-gradient(135deg, #4caf50, #388e3c)', 
                    border: 'none', 
                    borderRadius: 8 
                  }}
                >
                  立即登录
                </Button>
              </Link>
            </div>
          )
        }
      />

      <Section
        title="大众精选"
        cards={publicRecommendations}
        backgroundColor={"#e8f5e9"}
        pageSize={RECOMMENDATIONS_PER_PAGE}
      />

      <Section
        title="规划展示"
        cards={recentPlanCards }
        backgroundColor="white"
        pageSize={4}
        cardComponent={PlanCard}
      />

      <Section 
        title="为啥大家都超爱我们的行程规划？" 
        cards={featuresData} 
        backgroundColor="#e8f5e9"
      />

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