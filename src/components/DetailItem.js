import React from 'react';
import './DetailItem.css';

// Added an `icon` prop to display an icon on the left of each detail item
const DetailItem = ({ label, content, icon }) => {
  return (
    <div className="detail-item-container">
      {icon && <div className="detail-item-icon">{icon}</div>}
      <div className="detail-item-content">
        {label && <h5 className="detail-item-label">{label}</h5>}
        <p className="detail-item-description">{content}</p>
      </div>
    </div>
  );
};

export default DetailItem;
