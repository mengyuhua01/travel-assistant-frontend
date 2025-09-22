import React from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Tabs
} from 'antd';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import DayDetails from '../components/DayDetails';
import TripHeader from '../components/TripHeader';
import TripSummary from '../components/TripSummary';
import './TripDetailsPage.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const TripDetailsPage = ({ tripData }) => {
  const handleBackClick = () => {
    // For now, just show an alert. In a real app, this would navigate back
    alert('返回方案列表');
  };

  if (!tripData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Title level={3}>方案不存在</Title>
        <Button type="primary" onClick={handleBackClick} style={{ backgroundColor: '#4caf50', borderColor: '#4caf50' }}>
          返回首页
        </Button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 返回按钮 */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{ marginBottom: 24, color: '#2e7d32', borderColor: '#81c784' }}
          size="large"
        >
          返回方案列表
        </Button>

        {/* 方案头部信息 */}
        <TripHeader tripData={tripData} />

        <Row gutter={24}>
          {/* 行程安排 */}
          <Col xs={24} lg={16}>
            <Card title="📅 详细行程安排" style={{ marginBottom: 24 }}>
              <Tabs defaultActiveKey="0" className="trip-tabs">
                {tripData.dailyPlan.map((day, index) => (
                  <TabPane tab={`第${day.day}天`} key={index}>
                    <DayDetails dayData={day} />
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Col>

          {/* 费用说明 */}
          <Col xs={24} lg={8}>
            <TripSummary tripData={tripData} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TripDetailsPage;
