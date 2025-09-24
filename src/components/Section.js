import React from 'react';
import { Row, Col, Typography } from 'antd';
import CustomCard from './CustomCard';
import './Section.css';
import './CustomCard.css';

const { Title } = Typography;

const Section = ({ title, cards, backgroundColor = "white" }) => {
  return (
    <section className="section" style={{ backgroundColor }}>
      <div className="container">
        <Title level={2} className="section-title">{title}</Title>
        <Row gutter={[24, 24]} justify="center">
          {cards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <CustomCard card={card} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Section;