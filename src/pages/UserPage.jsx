import { useState, useEffect } from 'react';
import { Card, List, Tag, Typography, Row, Col, Button, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HistoryOutlined, HeartOutlined } from '@ant-design/icons';
import { getUserTag } from '../apis/user.js';
import { getUserTravelPlans } from '../apis/travelPlanApi';
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

  // Real travel plans for user (max 3)
  const navigate = useNavigate();
  const [recentPlans, setRecentPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    // Fetch up to 3 recent travel plans
    const fetchRecentPlans = async () => {
      try {
        setPlansLoading(true);
        const response = await getUserTravelPlans();
        const plans = response.data || response;
        setRecentPlans(Array.isArray(plans) ? plans.slice(0, 3) : []);
      } catch (error) {
        setRecentPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchRecentPlans();
  }, []);

  return (
    <div className="user-page">
      <div className="container">

        <Row gutter={[24, 24]}>
          {/* Personal Information Card */}
          <Col xs={24} md={8}>
            <Card className="profile-card" variant="borderless">
              <div className="profile-header">
                <img src="/image/user.png" alt="User Logo" className="user-logo" />
              </div>
              <div className="profile-info">
                  <Title level={2} className='profile-name'>{user.username || user.email}</Title>
                </div>
                <div> 
                    <div> 
                        <Button
                    type="primary"
                    icon={<HeartOutlined />}
                    style={{ 
                      background: '#2A6F6B', 
                      border: 'none', 
                      borderRadius: 8 
                    }}
                    className='update-tags-button'
                  >
                    更新我的兴趣偏好
                  </Button>
                    </div>
                    
                    {loading ? (
                <p>正在加载标签...</p>
              ) : (
                <div className="user-tags">
                  {userTags.length > 0 ? (
                    userTags.map((tag) => (
                      <Tag key={tag.id} color="green" className="interest-tag">
                        {tag.name}
                      </Tag>
                    ))
                  ) : (
                    <Text type="secondary">尚未选择任何标签。</Text>
                  )}
                </div>
              )}

                </div>
            </Card>
          </Col>


          {/* History Planning Card */}
          <Col xs={24} md={16}>
            <Card title="旅行历史" className="history-card" variant="borderless">
              <div style={{ marginBottom: 16 }}>
                <Link to="/history">
                  <Button
                    type="primary"
                    icon={<HistoryOutlined />}
                    style={{ background: '#2A6F6B', border: 'none', borderRadius: 8 }}
                  >
                    查看所有行程历史
                  </Button>
                </Link>
              </div>
              {/* 最近旅行方案 section directly below the button */}
              <div>
                <h3 style={{ margin: '16px 0 8px 0', fontWeight: 500 }}>最近旅行方案</h3>
                {plansLoading ? (
                  <p>加载中...</p>
                ) : recentPlans.length > 0 ? (
                  <List
                    dataSource={recentPlans}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Text strong>{item.title || '旅行方案'}</Text>}
                          description={
                            <>
                              <Text>{item.overview || item.description}</Text>
                              {/* <br /> */}
                              {/* <Text type="secondary">Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text> */}
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span style={{ color: '#8c8c8c', fontSize: 16 }}>
                        您还没有创建过旅行方案
                      </span>
                    }
                  >
                    <Button
                      type="primary"
                      onClick={() => navigate('/plan')}
                      style={{
                        background: '#2A6F6B',
                        border: 'none',
                        borderRadius: 8,
                        height: 40,
                        padding: '0 24px'
                      }}
                    >
                      创建第一个方案
                    </Button>
                  </Empty>
                )}
              </div>
            </Card>
          </Col>
        </Row>

      </div>
    </div>
  );
};

export default UserPage;