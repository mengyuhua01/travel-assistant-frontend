import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { getTravelPlanById } from '../apis/travel-plans';
import DayDetails from '../components/DayDetails';
import TripHeader from '../components/TripHeader';
import TripSummary from '../components/TripSummary';
import './TripDetailsPage.css';

const { Title } = Typography;

const TripDetailsPage = () => {
  const { id } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const data = await getTravelPlanById(id);
        console.log('Fetched trip data:', data);
        setTripData(data);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [id]);

  const handleBackClick = () => {
    // For now, just show an alert. In a real app, this would navigate back
    alert('返回方案列表');
  };

  const handleRegenerateSuccess = (updatedDayData, updatedTripData) => {
    console.log('handleRegenerateSuccess 被调用:', { updatedDayData, updatedTripData });
    
    // 更新整个行程数据
    if (updatedTripData) {
      console.log('更新整个行程数据');
      setTripData(updatedTripData);
    } else {
      console.log('只更新单天数据, day:', updatedDayData?.day);
      // 如果只返回了单天数据，则只更新对应的天
      setTripData(prevData => {
        const newData = {
          ...prevData,
          dailyPlan: prevData.dailyPlan?.map(day => 
            day.day === updatedDayData.day ? updatedDayData : day
          ) || []
        };
        console.log('新的 tripData:', newData);
        return newData;
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
    <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #f0fff4)', minHeight: '100vh', padding: '24px' }}>
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
              <Tabs
                defaultActiveKey="0"
                className="trip-tabs"
                items={tripData.dailyPlan?.map((day, index) => ({
                  key: String(index),
                  label: `第${day.day}天`,
                  children: (
                    <DayDetails
                      dayData={day}
                      originalTrip={tripData}
                      onRegenerateSuccess={handleRegenerateSuccess}
                    />
                  )
                })) || []}
              />
            </Card>
          </Col>

          {/* 费用说明 */}
          <Col xs={24} lg={8}>
            <TripSummary 
              tripData={tripData}
              budgetBreakdown={tripData.budgetBreakdown}
              tips={tripData.tips}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TripDetailsPage;
