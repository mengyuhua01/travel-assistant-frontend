import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Card, Typography, Button, Space, Spin, message, Divider } from 'antd';
import { ArrowLeftOutlined, UserOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import CommentSection from '../components/CommentSection.jsx';
import { getPostDetail } from '../apis/postApi';
import { getCommentsByPost } from '../apis/commentApi';
import dayjs from 'dayjs';
import './PostDetailPage.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // 获取帖子详情
  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      console.log('获取帖子详情，ID:', id);
      const response = await getPostDetail(id);
      console.log('帖子详情API响应:', response);
      
      // 根据您的后端API，直接返回Post对象
      if (response && response.id) {
        setPost(response);
        console.log('成功设置帖子数据:', response);
      } else if (response?.success && response?.data) {
        // 兼容包装格式
        setPost(response.data);
        console.log('成功设置帖子数据:', response.data);
      } else {
        message.error('帖子不存在或已被删除');
        navigate('/posts');
      }
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      message.error('获取帖子详情失败');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  // 获取帖子评论
  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      console.log('获取帖子评论，帖子ID:', id);
      const response = await getCommentsByPost(id);
      console.log('评论API响应:', response);
      
      // 根据您的后端API结构设置评论数据
      if (Array.isArray(response)) {
        setComments(response);
      } else if (response?.success && Array.isArray(response?.data)) {
        setComments(response.data);
      } else if (response?.data && Array.isArray(response.data)) {
        setComments(response.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
      setComments([]);
      // 不显示错误消息，因为可能只是没有评论
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostDetail();
      fetchComments();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 返回帖子列表
  const handleGoBack = () => {
    navigate('/posts');
  };

  // 格式化时间显示
  const formatTimeDisplay = (createdAt, updatedAt) => {
    const created = dayjs(createdAt);
    const updated = dayjs(updatedAt);
    
    const authorName = post?.user?.username || post?.author || `user${post?.userId || post?.user?.id}`;
    
    if (created.isSame(updated)) {
      return (
        <Space size="small">
          <UserOutlined />
          <Text strong>{authorName}</Text>
          <Text type="secondary">发布于</Text>
          <Text type="secondary">{created.format('YYYY年MM月DD日 HH:mm')}</Text>
        </Space>
      );
    } else {
      return (
        <Space size="small">
          <UserOutlined />
          <Text strong>{authorName}</Text>
          <Text type="secondary">编辑于</Text>
          <Text type="secondary">{updated.format('YYYY年MM月DD日 HH:mm')}</Text>
          <EditOutlined style={{ color: '#52c41a' }} />
        </Space>
      );
    }
  };

  // 处理评论成功刷新
  const handleCommentSuccess = () => {
    fetchPostDetail(); // 重新获取帖子详情以更新评论数量
    fetchComments(); // 重新获取评论列表
  };

  if (loading) {
    return (
      <Layout className="post-detail-layout">
        <Content className="post-detail-content">
          <div className="loading-container">
            <Spin size="large" />
            <p>加载中...</p>
          </div>
        </Content>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout className="post-detail-layout">
        <Content className="post-detail-content">
          <div className="error-container">
            <p>帖子不存在</p>
            <Button onClick={handleGoBack}>返回帖子列表</Button>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="post-detail-layout">
      <Content className="post-detail-content">
        {/* 返回按钮 */}
        <div className="back-button-container">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            size="large"
            className="back-button"
          >
            返回帖子列表
          </Button>
        </div>

        {/* 帖子内容卡片 */}
        <Card className="post-content-card">
          {/* 帖子标题 */}
          <Title level={1} className="post-title">
            {post.title}
          </Title>

          {/* 帖子元信息 */}
          <div className="post-meta">
            {formatTimeDisplay(post.createdAt, post.updatedAt)}
            {post.commentCount > 0 && (
              <>
                <Divider type="vertical" />
                <Space size="small">
                  <ClockCircleOutlined />
                  <Text type="secondary">
                    {post.commentCount} 条评论
                  </Text>
                </Space>
              </>
            )}
          </div>

          <Divider />

          {/* 帖子内容 */}
          <div className="post-content">
            <Paragraph>
              {post.content.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < post.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </Paragraph>
          </div>
        </Card>

        {/* 评论区域 */}
        <Card className="comments-card" title="评论区">
          <CommentSection 
            postId={post.id} 
            comments={comments}
            loading={commentsLoading}
            onCommentSuccess={handleCommentSuccess}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default PostDetailPage;