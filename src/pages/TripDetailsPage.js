import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { getTripById } from '../services/tripService';
import DayDetails from '../components/DayDetails';
import TripHeader from '../components/TripHeader';
import TripSummary from '../components/TripSummary';
import AmapContainer from '../components/AmapContainer';
import './TripDetailsPage.css';

const { Title } = Typography;

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        if (!id) {
          console.error('Trip ID is missing');
          setLoading(false);
          return;
        }
        
        const data = await getTripById(id);
        console.log('Fetched trip data:', data);
        
        // 验证数据结构
        if (!data) {
          console.error('No data received from API');
          setTripData(null);
        } else {
          setTripData(data);
        }
      } catch (error) {
        console.error('Error fetching trip data:', error);
        setTripData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [id]);

  const handleBackClick = () => {
    // Navigate back to the travel plan page
    navigate('/plan');
  };

  const handleRegenerateSuccess = (updatedDayData, updatedTripData) => {
    try {
      console.log('handleRegenerateSuccess 被调用:', { updatedDayData, updatedTripData });
      
      // 更新整个行程数据
      if (updatedTripData) {
        console.log('更新整个行程数据');
        setTripData(updatedTripData);
      } else if (updatedDayData && updatedDayData.day) {
        console.log('只更新单天数据, day:', updatedDayData.day);
        // 如果只返回了单天数据，则只更新对应的天
        setTripData(prevData => {
          if (!prevData || !Array.isArray(prevData.dailyPlan)) {
            console.error('Previous data is invalid:', prevData);
            return prevData;
          }
          
          const newData = {
            ...prevData,
            dailyPlan: prevData.dailyPlan.map(day => 
              day.day === updatedDayData.day ? updatedDayData : day
            )
          };
          console.log('新的 tripData:', newData);
          return newData;
        });
      } else {
        console.error('Invalid data provided to handleRegenerateSuccess:', { updatedDayData, updatedTripData });
      }
    } catch (error) {
      console.error('Error in handleRegenerateSuccess:', error);
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
          返回生成方案頁面
        </Button>

        {/* 方案头部信息 */}
        <TripHeader tripData={tripData} />

        <Row gutter={24}>
          {/* 行程安排 */}
          <Col xs={24} lg={14}>
            <Card title="📅 详细行程安排" style={{ marginBottom: 24 }}>
              {tripData?.dailyPlan && Array.isArray(tripData.dailyPlan) && tripData.dailyPlan.length > 0 ? (
                <Tabs
                  defaultActiveKey="0"
                  className="trip-tabs"
                  items={tripData.dailyPlan.map((day, index) => {
                    if (!day || typeof day.day === 'undefined') {
                      console.warn('Invalid day data at index', index, day);
                      return null;
                    }
                    return {
                      key: String(index),
                      label: `第${day.day}天`,
                      children: (
                        <DayDetails
                          dayData={day}
                          tripId={id}
                          originalTrip={tripData}
                          onRegenerateSuccess={handleRegenerateSuccess}
                        />
                      )
                    };
                  }).filter(Boolean)}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>暂无行程安排数据</p>
                </div>
              )}
            </Card>
          </Col>

          {/* 右侧：地图和费用说明 */}
          <Col xs={24} lg={10}>
            {/* 地图组件 */}
            <AmapContainer 
              tripData={tripData}
              style={{ marginBottom: 24 }}
            />
            
            {/* 费用说明 */}
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
