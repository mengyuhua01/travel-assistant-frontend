import React from 'react';
import { Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './PlanCard.css';

const { Title, Paragraph } = Typography;

const PlanCard = ({ card }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (card.link) {
      // Extract planId from the link (assumes format: /trip/{planId})
      const match = card.link.match(/\/trip\/(\d+)/);
      const planId = match ? match[1] : null;
      if (planId) {
        navigate(`/trip/${planId}`, { state: { from: 'home' } });
      } else {
        navigate(card.link);
      }
    }
  };

  const CardContent = () => (
    <>
      {card.icon && <div className="card-icon">{card.icon}</div>}
      {card.image && <img src={card.image} alt={card.title} className="card-image" />}
      <Title level={4}>{card.title}</Title>
      <Paragraph>{card.description}</Paragraph>
      {card.author && <div className="author">{card.author}</div>}
    </>
  );

  return (
    <div className="plan-card-link" style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={handleClick}>
      <Card className="section-card" hoverable>
        <CardContent />
      </Card>
    </div>
  );
};

export default PlanCard;
