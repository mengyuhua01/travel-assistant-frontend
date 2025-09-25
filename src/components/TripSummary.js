import React from 'react';
import {
  Card,
  Space,
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
      <Card 
        title="💰 费用估算" 
        style={{ marginBottom: 24 }}
        extra={
          <span style={{ 
            fontSize: '12px', 
            color: '#8c8c8c', 
            fontWeight: 'normal',
            background: '#f5f5f5',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #e8e8e8'
          }}>
            AI生成 · 仅供参考
          </span>
        }
      >
        {/* 核心预算信息 - 突出显示 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#2e7d32',
          color: 'white',
          padding: '20px 24px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
        }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>预计总费用</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: 1 }}>
              ¥{tripData.totalBudget}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>出行天数</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {tripData.duration}天
            </div>
          </div>
        </div>

        {/* 友好提示 */}
        <div style={{ 
          padding: '12px 16px', 
          marginBottom: '20px',
          fontSize: '13px',
          color: '#595959',
          lineHeight: 1.5
        }}>
          <div style={{ fontWeight: '600', marginBottom: '6px', color: '#262626' }}>
            💡 费用说明
          </div>
          此费用为AI智能估算，实际花费因个人消费习惯、季节变化、预订时机等因素而异。
          <br />
          <span style={{ 
            color: '#262626',
            fontWeight: '600',
            fontSize: '13px'
          }}>
            💰 建议预留10-20%缓冲资金
          </span>
        </div>
        {budgetBreakdown && (
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#262626', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💳 费用明细
              <span style={{ 
                fontSize: '12px', 
                color: '#66bb6a', 
                fontWeight: 'normal',
                background: '#e8f5e8',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid #c8e6c9'
              }}>
                详细分类
              </span>
            </div>
            
            {/* 使用网格布局优化明细显示 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '12px',
              marginBottom: '16px'
            }}>
              {[
                { key: 'transportation', label: '🚗 交通', value: budgetBreakdown.transportation },
                { key: 'accommodation', label: '🏨 住宿', value: budgetBreakdown.accommodation },
                { key: 'food', label: '🍜 餐饮', value: budgetBreakdown.food },
                { key: 'activities', label: '🎯 活动', value: budgetBreakdown.activities },
                { key: 'shopping', label: '🛍️ 购物', value: budgetBreakdown.shopping },
                { key: 'other', label: '📝 其他', value: budgetBreakdown.other }
              ].filter(item => item.value && item.value > 0).map(item => (
                <div 
                  key={item.key}
                  style={{
                    background: '#f9fff9',
                    border: '1px solid #e1f5e1',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e8f5e8';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f9fff9';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#2e7d32',
                    fontWeight: '600'
                  }}>
                    {item.label}
                  </span>
                  <span style={{ 
                    fontSize: '16px', 
                    color: '#388e3c',
                    fontWeight: '600'
                  }}>
                    ¥{item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card 
        title="✨ 行程提示" 
        style={{ marginBottom: 24 }}
        extra={
          <span style={{ 
            fontSize: '12px', 
            color: '#8c8c8c', 
            fontWeight: 'normal',
            background: '#f5f5f5',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #e8e8e8'
          }}>
            AI智能提醒
          </span>
        }
      >
        <div style={{ 
          background: '#fafafa', 
          border: '1px solid #d9d9d9', 
          borderRadius: '6px', 
          padding: '8px 12px', 
          marginBottom: '16px',
          fontSize: '13px',
          color: '#8c8c8c'
        }}>
           根据您的行程特点，AI为您提示，帮助您更好地规划和享受旅程
        </div>
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
                borderRadius: '6px',
                fontWeight: '500'
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
