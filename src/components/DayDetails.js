import React from 'react';
import { Typography } from 'antd';
import './DayDetails.css';
import DetailItem from './DetailItem';
import TagSelector from './TagSelector';
import { FaSun, FaCloudSun, FaMoon, FaBed, FaBus } from 'react-icons/fa';

const { Title, Text } = Typography;


const DayDetails = ({ dayData, tripId, onRegenerateSuccess, showEdit }) => {
  return (
    <div className="day-details-modern">
      <div style={{ paddingBottom: 20 }}>
        <Title level={4} style={{ marginBottom: 12, color: 'black' }}>
          {dayData.theme}
        </Title>
        <div className="day-activities">
          <DetailItem
            title="上午"
            activity={dayData.morning}
            meal={dayData.meals?.breakfast}
            icon={<FaSun />}
            number="1"
          />
          <DetailItem
            title="下午"
            activity={dayData.afternoon}
            meal={dayData.meals?.lunch}
            icon={<FaCloudSun />}
            number="2"
          />
          <DetailItem
            title="晚上"
            activity={dayData.evening}
            meal={dayData.meals?.dinner}
            icon={<FaMoon />}
            number="3"
          />
          <DetailItem
            title="住宿"
            description={dayData.accommodation?.name}
            bookingLink={dayData.accommodation?.bookingLink}
            cost={dayData.accommodation?.price}
            icon={<FaBed />}
            number="4"
          />
          <DetailItem
            title="交通"
            description={dayData.transportation?.details || '地铁+步行'}
            bookingLink={dayData.transportation?.bookingLink}
            cost={dayData.transportation?.cost}
            icon={<FaBus />}
            number="5"
          />
        </div>
        <div className="day-cost-section">
          <Text strong style={{ fontSize: 16, color: '#2e7d32' }}>
            💰 今日预计费用：¥{dayData.dailyCost}
          </Text>
        </div>
        {/* 仅在 showEdit 为 true 时显示 TagSelector */}
        {showEdit && (
          <TagSelector 
            dayData={dayData}
            tripId={tripId}
            onRegenerateSuccess={onRegenerateSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default DayDetails;
