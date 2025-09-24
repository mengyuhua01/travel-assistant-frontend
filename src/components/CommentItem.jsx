import React, { useState } from 'react';
import { List, Typography, Space, Avatar, Button, message, Spin } from 'antd';
import { UserOutlined, CommentOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import CommentForm from './CommentForm.jsx';
import { getChildComments } from '../apis/commentApi';
import dayjs from 'dayjs';
import './CommentItem.css';

const { Text } = Typography;

const CommentItem = ({ comment, postId, onReplySuccess }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showChildComments, setShowChildComments] = useState(false);
  const [childComments, setChildComments] = useState([]);
  const [loadingChildComments, setLoadingChildComments] = useState(false);
  const [hasReplies, setHasReplies] = useState(false);
  const [repliesChecked, setRepliesChecked] = useState(false);
  // 格式化时间
  const formatTime = (time) => {
    const now = dayjs();
    const commentTime = dayjs(time);
    const diffMinutes = now.diff(commentTime, 'minute');
    
    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffMinutes < 1440) { // 24小时
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}小时前`;
    } else if (diffMinutes < 10080) { // 7天
      const diffDays = Math.floor(diffMinutes / 1440);
      return `${diffDays}天前`;
    } else {
      return commentTime.format('YYYY-MM-DD HH:mm');
    }
  };

  // 处理回复按钮点击
  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  // 组件挂载时检查是否有子评论
  React.useEffect(() => {
    checkHasReplies();
  }, [comment.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 处理回复成功
  const handleReplySuccess = () => {
    setShowReplyForm(false);
    message.success('回复成功！');
    // 重新检查子评论
    setRepliesChecked(false);
    checkHasReplies();
    // 如果当前展开了子评论，需要重新加载
    if (showChildComments) {
      fetchChildComments();
    }
    onReplySuccess && onReplySuccess();
  };

  // 检查是否有子评论（只在第一次需要时调用）
  const checkHasReplies = async () => {
    if (repliesChecked) return;
    
    try {
      const response = await getChildComments(comment.id);
      console.log('检查子评论响应:', response);
      
      let replies = [];
      if (Array.isArray(response)) {
        replies = response;
      } else if (response?.success && Array.isArray(response?.data)) {
        replies = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        replies = response.data;
      }
      
      setHasReplies(replies.length > 0);
      setChildComments(replies);
    } catch (error) {
      console.error('检查子评论失败:', error);
      setHasReplies(false);
    } finally {
      setRepliesChecked(true);
    }
  };

  // 获取子评论
  const fetchChildComments = async () => {
    setLoadingChildComments(true);
    try {
      const response = await getChildComments(comment.id);
      console.log('子评论响应:', response);
      
      let replies = [];
      if (Array.isArray(response)) {
        replies = response;
      } else if (response?.success && Array.isArray(response?.data)) {
        replies = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        replies = response.data;
      }
      
      setChildComments(replies);
      setHasReplies(replies.length > 0);
    } catch (error) {
      console.error('获取子评论失败:', error);
      message.error('获取回复失败');
    } finally {
      setLoadingChildComments(false);
    }
  };

  // 处理展开/收起子评论
  const handleToggleChildComments = () => {
    if (!showChildComments) {
      // 展开时获取子评论
      setShowChildComments(true);
      fetchChildComments();
    } else {
      // 收起时直接隐藏
      setShowChildComments(false);
    }
  };

  return (
    <List.Item className="comment-item">
      <div className="comment-content">
        <div className="comment-header">
          <Space size="small">
            <Avatar 
              size="small" 
              icon={<UserOutlined />}
              className="comment-avatar"
            />
            <Text strong className="comment-author">
              {comment.user?.username || comment.author || `user${comment.userId || comment.user?.id}`}
            </Text>
            <Text type="secondary" className="comment-time">
              {formatTime(comment.createdAt)}
            </Text>
          </Space>
        </div>
        <div className="comment-text">
          {comment.content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < comment.content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        
        {/* 回复按钮和子评论展开 */}
        <div className="comment-actions">
          <Button 
            type="text" 
            size="small" 
            icon={<CommentOutlined />}
            onClick={handleReplyClick}
            className="reply-button"
          >
            回复
          </Button>
          
          {/* 只有当确认有子评论时才显示展开按钮 */}
          {hasReplies && (
            <Button 
              type="text" 
              size="small" 
              icon={showChildComments ? <UpOutlined /> : <DownOutlined />}
              onClick={handleToggleChildComments}
              className="expand-replies-button"
              loading={loadingChildComments}
            >
              {showChildComments ? '收起回复' : '查看回复'}
            </Button>
          )}
        </div>
        
        {/* 回复表单 */}
        {showReplyForm && (
          <div className="reply-form-container">
            <CommentForm 
              postId={postId}
              parentId={comment.id}
              onSuccess={handleReplySuccess}
              placeholder={`回复 @${comment.user?.username || comment.author || 'user'}`}
            />
          </div>
        )}
        
        {/* 子评论展示区域 */}
        {showChildComments && (
          <div className="child-comments-container">
            {loadingChildComments ? (
              <div className="loading-child-comments">
                <Spin size="small" />
                <span style={{ marginLeft: 8 }}>加载回复中...</span>
              </div>
            ) : (
              childComments.length > 0 && (
                <div className="child-comments-list">
                  {childComments.map((childComment) => (
                    <div key={childComment.id} className="child-comment-item">
                      <div className="child-comment-header">
                        <Space size="small">
                          <Avatar 
                            size="small" 
                            icon={<UserOutlined />}
                            className="child-comment-avatar"
                          />
                          <span className="child-comment-author">
                            {childComment.user?.username || childComment.author || `user${childComment.userId}`}
                          </span>
                          <span className="child-comment-time">
                            {formatTime(childComment.createdAt)}
                          </span>
                        </Space>
                      </div>
                      <div className="child-comment-content">
                        {childComment.content}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </List.Item>
  );
};

export default CommentItem;