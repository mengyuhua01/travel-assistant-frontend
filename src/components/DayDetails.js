import React from 'react';
import { Typography } from 'antd';
import './DayDetails.css';
import DetailItem from './DetailItem';
import { FaSun, FaCloudSun, FaMoon, FaBed, FaBus } from 'react-icons/fa';

const { Title, Text } = Typography;

const DayDetails = ({ dayData }) => {
  return (
    <div className="day-details-modern">
      <div style={{ paddingBottom: 20 }}>
        <Title level={4} style={{ marginBottom: 12, color: '#2e7d32' }}>
          {dayData.theme}
        </Title>
        
        <div className="day-activities">
          <DetailItem
            title="上午"
            activity={dayData.morning}
            meal={dayData.meals.breakfast}
            icon={<FaSun />}
            number="1"
          />
          
          <DetailItem
            title="下午"
            activity={dayData.afternoon}
            meal={dayData.meals.lunch}
            icon={<FaCloudSun />}
            number="2"
          />
          
          <DetailItem
            title="晚上"
            activity={dayData.evening}
            meal={dayData.meals.dinner}
            icon={<FaMoon />}
            number="3"
          />
          
          <DetailItem
            title="住宿"
            description={dayData.accommodation}
            icon={<FaBed />}
            number="4"
          />
          
          <DetailItem
            title="交通"
            description={dayData.transportation.details}
            icon={<FaBus />}
            number="5"
          />
        </div>
        
        <div className="day-cost-section">
          <Text strong style={{ fontSize: 16, color: '#2e7d32' }}>
            💰 每日费用：¥{dayData.dailyCost}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default DayDetails;
