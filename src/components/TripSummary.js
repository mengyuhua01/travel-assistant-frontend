import React from 'react';
import {
  Card,
  Button,
  Space,
  Descriptions,
  Tag
} from 'antd';
import './TripSummary.css';

const TripSummary = ({ tripData }) => {
  const inclusions = [
    `${tripData.duration-1}晚住宿`,
    '全程用餐',
    '景点门票',
    '交通费用',
    '旅游保险'
  ];

  const exclusions = [
    '个人消费',
    '自费项目',
    '小费',
    '额外餐饮'
  ];

  const highlights = [
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
      </Card>

      <Card title="✨ 行程亮点" style={{ marginBottom: 24 }}>
        <Space wrap size="middle">
          {highlights.map((highlight, index) => (
            <Tag key={index} color="green" style={{ padding: '6px 12px', fontSize: 14 }}>
              {highlight}
            </Tag>
          ))}
        </Space>
      </Card>

      <Card title="✅ 费用包含" style={{ marginBottom: 24 }}>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {inclusions.map((item, index) => (
            <li key={index} style={{ marginBottom: 8, color: '#52c41a' }}>
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="❌ 费用不含" style={{ marginBottom: 24 }}>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {exclusions.map((item, index) => (
            <li key={index} style={{ marginBottom: 8, color: '#ff4d4f' }}>
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="primary" size="large" block style={{ backgroundColor: '#4caf50', borderColor: '#4caf50' }}>
            立即预订
          </Button>
          <Button size="large" block style={{ color: '#2e7d32', borderColor: '#81c784' }}>
            咨询客服
          </Button>
          <Button size="large" block style={{ color: '#2e7d32', borderColor: '#81c784' }}>
            分享方案
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default TripSummary;
