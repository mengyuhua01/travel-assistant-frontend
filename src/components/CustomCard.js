import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const CustomCard = ({ card }) => {
  const CardContent = () => (
    <>
      {card.icon && <div className="card-icon">{card.icon}</div>}
      {card.image && <img src={card.imageUrl} alt={card.name} className="card-image" />}
      <Title level={4} className="card-name">{card.name}</Title>
      <Paragraph>{card.description}</Paragraph>
      {card.author && <div className="author">{card.author}</div>}
    </>
  );

  if (card.link) {
    return (
      <a href={card.link} style={{ textDecoration: 'none' }}>
        <Card className="section-card" hoverable>
          <CardContent />
        </Card>
      </a>
    );
  }

  return (
    <Card className="section-card" hoverable>
      <CardContent />
    </Card>
  );
};

export default CustomCard;