import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { RocketOutlined, GlobalOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function HomePage() {
  return (
    <div style={{ padding: '40px 0' }}>
      {/* 欢迎区域 */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={1} style={{ 
          fontSize: '3.5rem', 
          background: 'linear-gradient(135deg, #22c55e, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          智能旅行助手
        </Title>
        <Paragraph style={{ 
          fontSize: '1.2rem', 
          color: '#64748b', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          让AI为您规划完美的旅行路线，发现世界的美好，创造难忘的回忆
        </Paragraph>
      </div>

      {/* 功能特色卡片 */}
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ 
              textAlign: 'center', 
              height: '280px',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #22c55e, #10b981)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <RocketOutlined style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <Title level={4} style={{ color: '#1f2937', marginBottom: '12px' }}>
              智能规划
            </Title>
            <Paragraph style={{ color: '#6b7280', lineHeight: '1.6' }}>
              基于AI技术，为您量身定制最优旅行路线和行程安排
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ 
              textAlign: 'center', 
              height: '280px',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #0ea5e9, #0891b2)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <GlobalOutlined style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <Title level={4} style={{ color: '#1f2937', marginBottom: '12px' }}>
              全球目的地
            </Title>
            <Paragraph style={{ color: '#6b7280', lineHeight: '1.6' }}>
              覆盖全球热门旅游目的地，发现隐藏的美景和当地文化
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ 
              textAlign: 'center', 
              height: '280px',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <HeartOutlined style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <Title level={4} style={{ color: '#1f2937', marginBottom: '12px' }}>
              个性推荐
            </Title>
            <Paragraph style={{ color: '#6b7280', lineHeight: '1.6' }}>
              根据您的喜好和预算，推荐最适合的景点、美食和住宿
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ 
              textAlign: 'center', 
              height: '280px',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <StarOutlined style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <Title level={4} style={{ color: '#1f2937', marginBottom: '12px' }}>
              实时更新
            </Title>
            <Paragraph style={{ color: '#6b7280', lineHeight: '1.6' }}>
              获取最新的旅游资讯、天气信息和当地活动推荐
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* 开始使用按钮 */}
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <Title level={3} style={{ color: '#1f2937', marginBottom: '30px' }}>
          准备开始您的智能旅行之旅吗？
        </Title>
        <Button
          type="primary"
          size="large"
          style={{
            height: '50px',
            padding: '0 40px',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #22c55e, #10b981)',
            border: '0',
            borderRadius: '25px',
            fontWeight: '500',
            boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
          }}
        >
          立即体验
        </Button>
      </div>
    </div>
  );
}

export default HomePage;