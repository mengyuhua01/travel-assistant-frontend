import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Typography, 
  Tag, 
  Space, 
  Spin, 
  message, 
} from 'antd';
import { 
  CheckOutlined, 
  HeartOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  PictureOutlined,
  BookOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CompassOutlined
} from '@ant-design/icons';
import { getTags, setUserTags } from '../apis/user';
import { useAuth } from '../contexts/AuthContext';
import './InterestSelection.css';

const { Title, Paragraph, Text } = Typography;

function InterestSelection() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 检查是否已登录
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // 获取标签数据
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        
        // 检查token是否存在
        const token = localStorage.getItem('token');
        console.log('当前token:', token);
        
        if (!token) {
          message.error('请先登录');
          navigate('/login');
          return;
        }
        
        const response = await getTags();
        console.log('获取到的标签:', response);
        setTags(response);
      } catch (error) {
        console.error('获取标签失败:', error);
        
        // 检查是否是认证错误
        if (error.response?.status === 401) {
          message.error('认证失败，请重新登录');
          navigate('/login');
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
          message.error('网络连接失败，请检查后端服务是否启动');
        } else {
          message.error('获取标签失败，请稍后重试');
        }
      } finally {
        setLoading(false);
      }
    };

    // 只有在已登录状态下才获取标签
    if (isAuthenticated) {
      fetchTags();
    }
  }, [isAuthenticated, navigate]);

  // 按分类组织标签
  const organizeTagsByCategory = (tags) => {
    const categories = {};
    tags.forEach(tag => {
      if (!categories[tag.category]) {
        categories[tag.category] = [];
      }
      categories[tag.category].push(tag);
    });
    return categories;
  };

  // 获取分类图标
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      '美食': <FireOutlined />,                   
      '运动': <ThunderboltOutlined />,       
      '自然风光': <EnvironmentOutlined />,        
      '文化艺术': <PictureOutlined />,          
      '亲子休闲': <TeamOutlined />,             
      '小众探险': <CompassOutlined />,      
      '艺术': <PictureOutlined />,              
      '文化': <BookOutlined />,               
      '旅游': <StarOutlined />                   
    };
    return iconMap[categoryName] || <StarOutlined />;
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };


  const handleConfirm = async () => {
    if (selectedTags.length === 0) {
      message.warning('请至少选择一个兴趣标签');
      return;
    }

    try {
      setSubmitting(true);
      await setUserTags(selectedTags);
      message.success('兴趣标签设置成功！');
      
      // 滚动到页面顶部
      window.scrollTo(0, 0);
      navigate('/');
    } catch (error) {
      console.error('设置标签失败:', error);
      message.error('设置标签失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    // 滚动到页面顶部
    window.scrollTo(0, 0);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="interest-selection-loading">
        <Spin size="large" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>正在加载标签...</Text>
      </div>
    );
  }

  const organizedTags = organizeTagsByCategory(tags);
  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div className="interest-selection">
      <div className="interest-selection-container">
        {/* Header */}
        <div className="interest-selection-header">
          <Title level={1} className="interest-selection-title">
            <HeartOutlined className="title-icon" />
            选择你的兴趣标签
          </Title>
          <Paragraph className="interest-selection-subtitle">
            告诉我们你喜欢什么，为你推荐更精彩的旅行体验
          </Paragraph>
        </div>

        {/* Categories */}
        <div className="interest-selection-content">
          <div className="categories-container">
            {Object.entries(organizedTags).map(([categoryName, categoryTags]) => (
              <div key={categoryName} className="category-section">
                <div className="category-title">
                  <div className="category-title-content">
                    {getCategoryIcon(categoryName)}
                    <Text strong style={{ fontSize: 18, marginLeft: 8 }}>{categoryName}</Text>
                  </div>
                </div>
                <div className="tags-grid">
                  {categoryTags.map(tag => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <Tag
                        key={tag.id}
                        className={`interest-tag ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleTag(tag.id)}
                        icon={isSelected ? <CheckOutlined /> : null}
                      >
                        {tag.name}
                      </Tag>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Tags Summary */}
        {selectedTags.length > 0 && (
          <Card className="selected-tags-summary">
            <div className="summary-header">
              <Title level={4} style={{ margin: 0 }}>
                <StarOutlined className="summary-icon" />
                已选择标签 ({selectedTags.length})
              </Title>
            </div>
            <div className="selected-tags-list">
              {selectedTagsData.map(tag => (
                <Tag key={tag.id} color="green" className="selected-tag-item">
                  {tag.name}
                </Tag>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="interest-selection-actions">
          <Space size="large">
            <Button 
              size="large" 
              onClick={handleSkip}
              className="skip-button"
            >
              跳过
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleConfirm}
              loading={submitting}
              disabled={selectedTags.length === 0}
              className="confirm-button"
            >
              确认选择 {selectedTags.length > 0 && `(${selectedTags.length})`}
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default InterestSelection;
