import React, { useState } from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import CustomCard from './CustomCard';
import './Section.css';
import './CustomCard.css';

const { Title } = Typography;


const Section = ({ title, cards, backgroundColor = "white", pageSize, cardComponent: CardComponent }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pageSize ? Math.ceil(cards.length / pageSize) : 1;
  const pagedCards = pageSize
    ? cards.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : cards;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const CardToRender = CardComponent || CustomCard;
  return (
    <section className="section" style={{ backgroundColor }}>
      <div className="container">
        <Title level={2} className="section-title">{title}</Title>
        <Row gutter={[24, 24]} justify="center">
          {pagedCards.map((card, index) => (
            <Col xs={20} sm={12} lg={6} key={index}>
              <CardToRender card={card} />
            </Col>
          ))}
        </Row>
        {totalPages > 1 && (
          <div className="section-paging">
            <Button className='section-paging-btn'
              icon={<LeftOutlined />}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            />
            <span className='section-paging-info'>
              {currentPage} / {totalPages}
            </span>
            <Button className='section-paging-btn'
              icon={<RightOutlined />}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Section;