import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Row, Col, Card, Space } from 'antd';
import { RocketOutlined, GlobalOutlined, StarOutlined, HeartOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function StartPage() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <RocketOutlined style={{ fontSize: '48px' }} />,
      title: 'AI智能规划',
      description: '基于先进AI算法，为您量身定制最优旅行路线',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '48px' }} />,
      title: '全球目的地',
      description: '覆盖全球200+国家和地区，发现未知的美好',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <StarOutlined style={{ fontSize: '48px' }} />,
      title: '个性推荐',
      description: '根据您的喜好和预算，精准推荐心仪之选',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <HeartOutlined style={{ fontSize: '48px' }} />,
      title: '贴心服务',
      description: '24/7智能客服，让您的旅程无忧无虑',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 动态背景装饰 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
        `,
        animation: 'float 6s ease-in-out infinite'
      }}>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes slideIn {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </div>

      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '30px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            ✈️
          </div>
          
          <Title 
            level={1} 
            style={{ 
              fontSize: '4rem',
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              marginBottom: '20px',
              fontWeight: '700',
              animation: 'slideIn 1s ease-out'
            }}
          >
            智能旅行助手
          </Title>
          
          <Paragraph style={{ 
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '800px',
            margin: '0 auto 50px',
            lineHeight: '1.8',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            animation: 'slideIn 1s ease-out 0.2s both'
          }}>
            让AI为您规划完美旅程，探索世界的无限可能，创造属于您的独特回忆
          </Paragraph>

          <Space size="large" style={{ animation: 'slideIn 1s ease-out 0.4s both' }}>
            <Link to="/register">
              <Button
                type="primary"
                size="large"
                icon={<UserAddOutlined />}
                style={{
                  height: '60px',
                  padding: '0 40px',
                  fontSize: '18px',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '30px',
                  fontWeight: '600',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                }}
              >
                开启旅程
              </Button>
            </Link>
            
            <Link to="/login">
              <Button
                size="large"
                icon={<LoginOutlined />}
                style={{
                  height: '60px',
                  padding: '0 40px',
                  fontSize: '18px',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '30px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.8)';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                立即登录
              </Button>
            </Link>
          </Space>
        </div>

        {/* Features Section */}
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                style={{
                  height: '320px',
                  background: currentFeature === index 
                    ? 'rgba(255,255,255,0.25)' 
                    : 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(20px)',
                  border: currentFeature === index 
                    ? '2px solid rgba(255,255,255,0.4)' 
                    : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  textAlign: 'center',
                  transition: 'all 0.5s ease',
                  transform: currentFeature === index ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: currentFeature === index 
                    ? '0 20px 60px rgba(0,0,0,0.3)' 
                    : '0 10px 40px rgba(0,0,0,0.2)',
                  cursor: 'pointer'
                }}
                bodyStyle={{ 
                  padding: '40px 24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div style={{
                  background: feature.color,
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: 'white',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }}>
                  {feature.icon}
                </div>
                
                <Title level={4} style={{ 
                  color: 'white', 
                  marginBottom: '16px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                  {feature.title}
                </Title>
                
                <Paragraph style={{ 
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: '1.6',
                  margin: 0,
                  textShadow: '0 1px 5px rgba(0,0,0,0.2)'
                }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Bottom CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '80px',
          padding: '40px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Title level={3} style={{ 
            color: 'white', 
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            超过100万用户的选择
          </Title>
          <Paragraph style={{ 
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            marginBottom: '30px',
            textShadow: '0 1px 5px rgba(0,0,0,0.2)'
          }}>
            加入我们，开始您的智能旅行体验
          </Paragraph>
          <Link to="/register">
            <Button
              type="primary"
              size="large"
              style={{
                height: '50px',
                padding: '0 30px',
                fontSize: '16px',
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                border: '0',
                borderRadius: '25px',
                fontWeight: '600',
                boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(34, 197, 94, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
              }}
            >
              免费开始使用
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StartPage;