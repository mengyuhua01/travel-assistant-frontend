import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Tag, Space, Button, message, Spin, Empty } from 'antd';
import { ClockCircleOutlined, DollarOutlined, EyeOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { getUserTravelPlans } from '../apis/travelPlanApi';
import './TravelHistoryPage.css';

const { Title, Text } = Typography;

const TravelHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [travelPlans, setTravelPlans] = useState([]);

  const getTypeColor = (type) => {
    const colors = {
      cultural: 'blue',
      leisure: 'green',
      adventure: 'orange',
      'ai-generated': 'purple',
      classic: 'blue'
    };
    return colors[type] || 'default';
  };

  useEffect(() => {
    const fetchTravelPlans = async () => {
      try {
        setLoading(true);
        const response = await getUserTravelPlans();
        const plans = response.data || response;
        const formattedPlans = plans.map(plan => ({
          id: plan.id,
          title: plan.title || '旅行方案',
          duration: `${plan.duration || 3}天`,
          budget: `¥${plan.totalBudget || 0}`,
          description: plan.overview || '精心规划的旅行方案',
          image: getTypeEmoji(plan.type),
          type: plan.type || 'ai-generated',
          createdAt: plan.createdAt,
          destination: plan.destination
        }));
        setTravelPlans(formattedPlans);
      } catch (error) {
        console.error('获取旅行历史失败:', error);
        message.error('获取旅行历史失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchTravelPlans();
  }, []);

  const getTypeEmoji = (type) => {
    const emojis = {
      cultural: '🏛️',
      leisure: '🏖️',
      adventure: '🏔️',
      'ai-generated': '🤖',
      classic: '🌟'
    };
    return emojis[type] || '🌍';
  };

  const handleViewPlan = (planId) => {
    navigate(`/trip/${planId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title level={2} style={{ marginBottom: 16, color: '#1f2937' }}>
            📚 我的旅行历史
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            查看您之前创建的所有旅行方案
          </Text>
        </div>
        {travelPlans.length > 0 ? (
          <Row gutter={[24, 24]}>
            {travelPlans.map((plan) => (
              <Col xs={24} md={12} lg={8} key={plan.id}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #054d2e',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: 24 }}
                  onClick={() => handleViewPlan(plan.id)}
                  actions={[
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPlan(plan.id);
                      }}
                      style={{
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                        border: 'none',
                        color: '#2d5a27',
                        fontWeight: 500,
                        boxShadow: '0 4px 12px rgba(200, 230, 201, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      key="view"
                    >
                      查看详情
                    </Button>
                  ]}
                >
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 56, marginBottom: 12 }}>
                      {plan.image}
                    </div>
                    <Title level={4} style={{ marginBottom: 12, color: '#1f1f1f' }}>
                      {plan.title}
                    </Title>
                    <Tag 
                      color={getTypeColor(plan.type)}
                      style={{ fontSize: 12, padding: '4px 12px', borderRadius: 16 }}
                    >
                      {plan.type === 'ai-generated' && '✨ AI定制'}
                      {plan.type === 'cultural' && '🏛️ 文化旅游'}
                      {plan.type === 'leisure' && '🏖️ 休闲度假'}
                      {plan.type === 'adventure' && '🏔️ 户外探险'}
                      {plan.type === 'classic' && '🌟 经典路线'}
                    </Tag>
                  </div>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Space>
                      <ClockCircleOutlined style={{ color: '#1890ff' }} />
                      <Text strong>{plan.duration}</Text>
                    </Space>
                    <Space>
                      <DollarOutlined style={{ color: '#52c41a' }} />
                      <Text strong>{plan.budget}</Text>
                    </Space>
                    {plan.destination && (
                      <Space>
                        <UserOutlined style={{ color: '#fa541c' }} />
                        <Text>{plan.destination}</Text>
                      </Space>
                    )}
                    {plan.createdAt && (
                      <Space>
                        <CalendarOutlined style={{ color: '#8c8c8c' }} />
                        <Text type="secondary">{formatDate(plan.createdAt)}</Text>
                      </Space>
                    )}
                  </Space>
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fffe 0%, #f0faf9 100%)',
                    borderRadius: 12,
                    padding: '16px',
                    border: '1px solid #054d2e',
                    marginTop: 16,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Text style={{
                      fontSize: 14,
                      lineHeight: '1.6',
                      color: '#434343',
                      fontWeight: 400,
                      display: 'block'
                    }}>
                      {plan.description}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: '#8c8c8c', fontSize: 16 }}>
                您还没有创建过旅行方案
              </span>
            }
          >
            <Button 
              type="primary" 
              onClick={() => navigate('/plan')}
              style={{
                background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                border: 'none',
                borderRadius: 8,
                height: 40,
                padding: '0 24px'
              }}
            >
              创建第一个方案
            </Button>
          </Empty>
        )}
      </div>
    </div>
  );
};

export default TravelHistoryPage;
