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
  Collapse,
} from 'antd';
import { 
  CheckOutlined, 
  DownOutlined, 
  UpOutlined,
  HeartOutlined,
  StarOutlined
} from '@ant-design/icons';
import { getTags, setUserTags } from '../apis/user';
import { useAuth } from '../contexts/AuthContext';
import './InterestSelection.css';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

function InterestSelection() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
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
        
        // 动态设置展开的分类（获取所有唯一的分类名称）
        const categories = [...new Set(response.map(tag => tag.category))];
        setExpandedCategories(categories);
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
      navigate('/');
    } catch (error) {
      console.error('设置标签失败:', error);
      message.error('设置标签失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
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
          <Collapse
            activeKey={expandedCategories}
            onChange={setExpandedCategories}
            expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
            className="interest-categories"
          >
            {Object.entries(organizedTags).map(([categoryName, categoryTags]) => (
              <Panel 
                header={
                  <div className="category-header">
                    <Text strong style={{ fontSize: 18 }}>{categoryName}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      ({categoryTags.length} 个标签)
                    </Text>
                  </div>
                } 
                key={categoryName}
                className="category-panel"
              >
                <div className="tags-container">
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
              </Panel>
            ))}
          </Collapse>
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
