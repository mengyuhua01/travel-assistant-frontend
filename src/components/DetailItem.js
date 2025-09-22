import React from 'react';
import { Card } from 'antd';
import './DetailItem.css';

const DetailItem = ({ label, content, icon }) => {
  return (
    <Card className="detail-item-card fancy-card" bordered={true} hoverable>
      <div className="detail-item">
        <div className="detail-header">
          {icon && <span className="detail-icon">{icon}</span>}
          <strong className="detail-label">{label}:</strong>
        </div>
        <span className="detail-content">{content}</span>
      </div>
    </Card>
  );
};

export default DetailItem;
