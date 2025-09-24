import React, { useState } from 'react';
import { Card, Button, Space, Typography, message, Modal, Input } from 'antd';
import { EyeOutlined, CommentOutlined, UserOutlined } from '@ant-design/icons';
import { addComment } from '../apis/commentApi';
import dayjs from 'dayjs';
import './PostCard.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const PostCard = ({ post, onCardClick, onRefresh }) => {
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // 处理卡片点击
  const handleCardClick = (e) => {
    // 如果点击的是按钮，不触发卡片点击事件
    if (e.target.closest('.post-card-actions')) {
      return;
    }
    onCardClick(post.id);
  };

  // 处理查看详情按钮点击
  const handleViewDetail = (e) => {
    e.stopPropagation();
    onCardClick(post.id);
  };

  // 处理评论按钮点击
  const handleComment = (e) => {
    e.stopPropagation();
    setCommentModalVisible(true);
  };

  // 提交评论
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    setSubmittingComment(true);
    try {
      const commentData = {
        postId: post.id,
        content: commentContent.trim(),
        parentId: null // 帖子卡片的评论没有父评论
      };
      
      console.log('PostCard提交评论:', commentData);
      const response = await addComment(commentData);
      console.log('PostCard评论响应:', response);
      
      // 根据后端响应判断成功
      if (response && (response.id || response.success !== false)) {
        message.success('评论成功！');
        setCommentContent('');
        setCommentModalVisible(false);
        onRefresh && onRefresh();
      } else {
        message.error(response?.message || '评论失败');
      }
    } catch (error) {
      console.error('评论失败:', error);
      message.error('评论失败，请重试');
    } finally {
      setSubmittingComment(false);
    }
  };

  // 处理评论模态框取消
  const handleCommentCancel = () => {
    setCommentModalVisible(false);
    setCommentContent('');
  };

  // 截取内容预览
  const getPreviewContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.slice(0, maxLength) + '...';
  };

  // 格式化时间
  const formatTime = (time) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
  };

  return (
    <>
      <Card
        className="post-card"
        hoverable
        onClick={handleCardClick}
        styles={{
          body: { padding: '20px' }
        }}
      >
        {/* 帖子标题 */}
        <Title level={4} className="post-title" ellipsis={{ rows: 2 }}>
          {post.title}
        </Title>

        {/* 帖子内容预览 */}
        <Paragraph className="post-content-preview" ellipsis={{ rows: 3 }}>
          {getPreviewContent(post.content)}
        </Paragraph>

        {/* 帖子元信息 */}
        <div className="post-meta">
          <Space size="small">
            <UserOutlined />
            <Text type="secondary">
              {post.user?.username || post.author || `user${post.userId || post.user?.id}`}
            </Text>
            <Text type="secondary">•</Text>
            <Text type="secondary">
              {formatTime(post.createdAt)}
            </Text>
            {post.commentCount > 0 && (
              <>
                <Text type="secondary">•</Text>
                <Text type="secondary" className="comment-count">
                  {post.commentCount} 条评论
                </Text>
              </>
            )}
          </Space>
        </div>

        {/* 操作按钮 */}
        <div className="post-card-actions" onClick={(e) => e.stopPropagation()}>
          <Space>
            <Button 
              type="primary" 
              icon={<EyeOutlined />}
              onClick={handleViewDetail}
              size="small"
            >
              查看详情
            </Button>
            <Button 
              icon={<CommentOutlined />}
              onClick={handleComment}
              size="small"
            >
              评论 {post.commentCount > 0 && `(${post.commentCount})`}
            </Button>
          </Space>
        </div>
      </Card>

      {/* 评论模态框 */}
      <Modal
        title="发表评论"
        open={commentModalVisible}
        onOk={handleSubmitComment}
        onCancel={handleCommentCancel}
        confirmLoading={submittingComment}
        okText="发表"
        cancelText="取消"
        footer={[
          <Button key="cancel" onClick={handleCommentCancel}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={submittingComment}
            onClick={handleSubmitComment}
            disabled={!commentContent.trim()}
            style={{ backgroundColor: '#2A6F6B', borderColor: '#2A6F6B' }}
          >
            发表
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>帖子：</Text>
          <Text>{post.title}</Text>
        </div>
        <TextArea
          placeholder="请输入您的评论..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          rows={4}
          maxLength={500}
          style={{ resize: 'none' }}
        />
      </Modal>
    </>
  );
};

export default PostCard;