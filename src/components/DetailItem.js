import React from 'react';
import './DetailItem.css';

const DetailItem = ({ title, activity, meal, description, icon, number, bookingLink, cost }) => {
  return (
    <div className="detail-item-modern">
      <div className="detail-item-number">{number}</div>
      <div className="detail-item-icon">{icon}</div>
      <div className="detail-item-content">
        <h5 className="detail-item-title">{title}</h5>
        
        {/* Activity Section */}
        {activity && (
          <div className="detail-item-section activity-section">
            <div className="detail-item-label activity-label">
              <span className="label-icon">🎯</span>
              <span className="label-text">活动安排</span>
            </div>
            <div className="detail-item-text activity-text">{activity}</div>
          </div>
        )}
        
        {/* Meal Section */}
        {meal && (
          <div className="detail-item-section meal-section">
            <div className="detail-item-label meal-label">
              <span className="label-icon">🍽️</span>
              <span className="label-text">用餐</span>
            </div>
            <div className="detail-item-text meal-text">{meal}</div>
          </div>
        )}
        
        {/* Description for accommodation/transportation */}
        {description && !activity && !meal && (
          <div className="detail-item-section description-section">
            <div className="detail-item-description">{description}</div>
            
            {/* Cost information */}
            {cost && (
              <div className="detail-item-cost" style={{ marginTop: 8, color: '#2e7d32', fontWeight: 'bold' }}>
                💰 费用：¥{cost}
              </div>
            )}
            
            {/* Booking link */}
            {bookingLink && (
              <div className="detail-item-booking" style={{ marginTop: 8 }}>
                <a 
                  href={bookingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#1890ff', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🔗 预订链接
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailItem;
