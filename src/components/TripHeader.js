import React from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Space,
  Rate
} from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  StarOutlined
} from '@ant-design/icons';
import './TripHeader.css';

const { Title, Text, Paragraph } = Typography;

const TripHeader = ({ tripData }) => {
  const getTypeLabel = (type) => {
    const labels = {
      cultural: '文化旅游',
      leisure: '休闲度假',
      adventure: '户外探险',
      economic: '经济游'
    };
    return labels[type] || '旅游';
  };

  return (
    <Card style={{ marginBottom: 24 }} className="trip-header-card">
      <Row gutter={24} align="middle">
        <Col flex="auto">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>
              🏖️
            </div>
            <Title level={2} style={{ marginBottom: 8, color: '#2e7d32' }}>
              {tripData.title}
            </Title>
            <Space size="large">
              <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
                {getTypeLabel('economic')}
              </Tag>
              <Space>
                <StarOutlined style={{ color: '#4caf50' }} />
                <Text strong style={{ fontSize: 16, color: '#388e3c' }}>4.8</Text>
                <Rate disabled defaultValue={4.8} allowHalf style={{ fontSize: 16 }} />
              </Space>
            </Space>
          </div>

          <Paragraph style={{ fontSize: 16, textAlign: 'center', marginBottom: 24, color: '#4caf50' }}>
            {tripData.overview}
          </Paragraph>

          <Row gutter={16} justify="center">
            <Col>
              <Space>
                <ClockCircleOutlined style={{ color: '#4caf50', fontSize: 18 }} />
                <Text strong style={{ fontSize: 16, color: '#2e7d32' }}>{tripData.duration}天</Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <DollarOutlined style={{ color: '#388e3c', fontSize: 18 }} />
                <Text strong style={{ fontSize: 16, color: '#2e7d32' }}>¥{tripData.totalBudget}</Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <UserOutlined style={{ color: '#66bb6a', fontSize: 18 }} />
                <Text strong style={{ fontSize: 16, color: '#2e7d32' }}>适合单人</Text>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default TripHeader;
