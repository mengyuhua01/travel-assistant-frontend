import React, { useState, useEffect } from 'react';
import { Card, Avatar, List, Tag, Typography, Row, Col } from 'antd';
import { getUserTag } from '../apis/user.js';
import './UserPage.css';

const { Title, Text } = Typography;

const UserPage = () => {
  const [user, setUser] = useState({});
  const [userTags, setUserTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      setUser(JSON.parse(userDataFromStorage));
    }

    const fetchUserTags = async () => {
      try {
        const response = await getUserTag();
        if (response) {
          console.log("Fetched user tags:", response);
          setUserTags(response);
        } else {
          console.log("Fetched user tags fail:");
          setUserTags([]);
        }
      } catch (error) {
        console.error("Failed to fetch user tags:", error);
        setUserTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTags();
  }, []);

  // Mock history planning data
  const historyPlans = [
    { id: 1, title: 'Family Trip to Bali', date: '2023-07-15', status: 'Completed', description: 'A wonderful beach vacation with the kids.' },
    { id: 2, title: 'Weekend Getaway to Tokyo', date: '2023-09-20', status: 'Completed', description: 'Exploring the vibrant city life.' },
    { id: 3, title: 'Adventure in the Alps', date: '2024-01-10', status: 'Planned', description: 'Skiing and mountain hiking trip.' },
  ];

  return (
    <div className="user-page">
      <div className="container">
        <Title level={2} className="page-title">My Profile</Title>

        <Row gutter={[24, 24]}>
          {/* Personal Information Card */}
          <Col xs={24} md={8}>
            <Card className="profile-card" variant="borderless">
              <div className="profile-header">
                <Avatar size={330} src={user.avatar || 'https://placehold.co/100'} />
              </div>
              <div className="profile-info">
                  <Title level={4}>{user.username || user.email}</Title>
                </div>
            </Card>
          </Col>

          {/* History Planning Card */}
          <Col xs={24} md={16}>
            <Card title="Travel History" className="history-card" variant="borderless">
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
            <Card title="My Interests" className="tags-card" variant="borderless">
              {loading ? (
                <p>Loading tags...</p>
              ) : (
                <div className="user-tags">
                  {userTags.length > 0 ? (
                    userTags.map((tag) => (
                      <Tag key={tag.id} color="green" className="interest-tag">
                        {tag.name}
                      </Tag>
                    ))
                  ) : (
                    <Text type="secondary">No tags selected yet.</Text>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserPage;