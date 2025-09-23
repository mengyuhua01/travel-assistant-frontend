import React from 'react';
import { Card, Avatar, List, Tag, Typography, Row, Col } from 'antd';
import './UserPage.css';

const { Title, Text, Paragraph } = Typography;

const UserPage = () => {
  // Mock user data - replace with real data from context or API
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/100',
    joinDate: 'January 2023',
    bio: 'Travel enthusiast who loves family adventures and exploring new cultures.',
  };

  // Mock history planning data
  const historyPlans = [
    { id: 1, title: 'Family Trip to Bali', date: '2023-07-15', status: 'Completed', description: 'A wonderful beach vacation with the kids.' },
    { id: 2, title: 'Weekend Getaway to Tokyo', date: '2023-09-20', status: 'Completed', description: 'Exploring the vibrant city life.' },
    { id: 3, title: 'Adventure in the Alps', date: '2024-01-10', status: 'Planned', description: 'Skiing and mountain hiking trip.' },
  ];

  // Mock user tags
  const userTags = ['Family-friendly', 'Adventure', 'Culture', 'Relaxation', 'Budget', 'Nature'];

  return (
    <div className="user-page">
      <div className="container">
        <Title level={2} className="page-title">My Profile</Title>

        <Row gutter={[24, 24]}>
          {/* Personal Information Card */}
          <Col xs={24} md={8}>
            <Card className="profile-card" bordered={false}>
              <div className="profile-header">
                <Avatar size={80} src={user.avatar} />
                <div className="profile-info">
                  <Title level={4}>{user.name}</Title>
                  <Text type="secondary">{user.email}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Member since {user.joinDate}
                  </Text>
                </div>
              </div>
              <Paragraph className="bio">{user.bio}</Paragraph>
            </Card>
          </Col>

          {/* History Planning Card */}
          <Col xs={24} md={16}>
            <Card title="Travel History" className="history-card" bordered={false}>
              <List
                dataSource={historyPlans}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>{item.title}</Text>}
                      description={
                        <>
                          <Text>{item.description}</Text>
                          <br />
                          <Text type="secondary">Date: {item.date}</Text>
                        </>
                      }
                    />
                    <Tag color={item.status === 'Completed' ? 'green' : 'blue'}>
                      {item.status}
                    </Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          {/* User Tags Card */}
          <Col xs={24}>
            <Card title="My Interests" className="tags-card" bordered={false}>
              <div className="user-tags">
                {userTags.map((tag, index) => (
                  <Tag key={index} color="green" className="interest-tag">
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserPage;