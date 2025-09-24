import React from 'react';
import {
  Card,
  Space,
  Descriptions,
  Tag
} from 'antd';
import './TripSummary.css';

const TripSummary = ({ tripData, budgetBreakdown, tips }) => {
  // Use tips as highlights if provided, otherwise fallback
  const highlights = Array.isArray(tips) && tips.length > 0 
    ? tips 
    : [
        '经济实惠',
        '文化体验',
        '美食品鉴',
        '交通便利',
        '住宿舒适'
      ];

  return (
    <div className="trip-summary">
      <Card title="💰 费用说明" style={{ marginBottom: 24 }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="总预算">¥{tripData.totalBudget}</Descriptions.Item>
          <Descriptions.Item label="出行人数">单人</Descriptions.Item>
          <Descriptions.Item label="出行天数">{tripData.duration}天</Descriptions.Item>
        </Descriptions>
        {budgetBreakdown && (
          <Descriptions column={1} size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label={<span style={{ color: '#2e7d32' }}>交通</span>}>
              <span style={{ color: '#2e7d32' }}>¥{budgetBreakdown.transportation}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ color: '#2e7d32' }}>住宿</span>}>
              <span style={{ color: '#2e7d32' }}>¥{budgetBreakdown.accommodation}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ color: '#2e7d32' }}>餐饮</span>}>
              <span style={{ color: '#2e7d32' }}>¥{budgetBreakdown.food}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ color: '#2e7d32' }}>活动</span>}>
              <span style={{ color: '#2e7d32' }}>¥{budgetBreakdown.activities}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ color: '#2e7d32' }}>购物</span>}>
              <span style={{ color: '#2e7d32' }}>¥{budgetBreakdown.shopping}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ color: '#2e7d32' }}>其他</span>}>
              <span style={{ color: '#2e7d32' }}>¥{budgetBreakdown.other}</span>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="✨ 行程提示" style={{ marginBottom: 24 }}>
        <Space wrap size="middle">
          {highlights.map((highlight, index) => (
            <Tag
              key={index}
              color="green"
              style={{
                padding: '6px 12px',
                fontSize: 14,
                whiteSpace: 'normal', // Allow text to wrap
                wordBreak: 'break-word', // Break long words
                textAlign: 'center', // Center-align text
              }}
            >
              {highlight}
            </Tag>
          ))}
        </Space>
      </Card>
    </div>
  );
};

export default TripSummary;
