import React from 'react';
import './DetailItem.css';

const DetailItem = ({ label, content, icon }) => {
  return (
    <div className="detail-item-container">
      <div className="detail-item-icon">{icon}</div>
      <div className="detail-item-content">
        <h5 className="detail-item-label">{label}</h5>
        <p className="detail-item-description">{content}</p>
      </div>
    </div>
  );
};

export default DetailItem;
