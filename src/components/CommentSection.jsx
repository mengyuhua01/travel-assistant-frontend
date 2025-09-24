import React, { useState, useEffect, useRef } from 'react';
import { List, Spin, Empty, Button, Input, Space, message } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import CommentItem from './CommentItem.jsx';
import { getCommentsByPost, addComment } from '../apis/commentApi';
import './CommentSection.css';

const CommentSection = ({ postId, comments: propsComments, loading: propsLoading, onCommentSuccess }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef(null);

  // 获取评论列表（如果没有通过props传递）
  const fetchComments = async (loadMore = false) => {
    if (propsComments) return; // 如果有props评论数据，不需要自己获取
    
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await getCommentsByPost(postId);
      console.log('CommentSection获取评论响应:', response);
      
      // 根据后端API结构设置评论数据
      let newComments = [];
      if (Array.isArray(response)) {
        newComments = response;
      } else if (response?.success && Array.isArray(response?.data)) {
        newComments = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        newComments = response.data;
      }
      
      if (loadMore) {
        // 这里可以根据实际需要实现真正的分页加载更多
        // 当前先显示所有评论
        setComments(prevComments => [...prevComments, ...newComments]);
      } else {
        setComments(newComments);
      }
      
      // 如果评论数量少于预期，说明没有更多了
      setHasMore(newComments.length > 0);
    } catch (error) {
      console.error('获取评论失败:', error);
      if (!loadMore) {
        setComments([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 当props评论数据变化时更新本地状态
  useEffect(() => {
    if (propsComments) {
      setComments(propsComments);
    } else if (postId) {
      fetchComments();
    }
  }, [propsComments, postId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 处理评论提交
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        postId,
        content: commentContent.trim(),
        parentId: null
      };
      
      const response = await addComment(commentData);
      
      if (response && (response.id || response.success !== false)) {
        message.success('评论成功！');
        setCommentContent('');
        // 重新获取评论
        fetchComments();
        // 通知父组件
        onCommentSuccess && onCommentSuccess();
      } else {
        message.error(response?.message || '评论失败');
      }
    } catch (error) {
      console.error('评论失败:', error);
      message.error('评论失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理回复成功
  const handleReplySuccess = () => {
    fetchComments();
    onCommentSuccess && onCommentSuccess();
  };

  // 处理滚动到底部加载更多
  const handleScroll = (e) => {
    const { target } = e;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10 && hasMore && !loadingMore) {
      // 这里可以实现真正的分页加载更多逻辑
      // 当前暂时不加载更多，因为后端可能没有分页支持
    }
  };

  return (
    <div className="comment-section">
      {/* 评论列表 */}
      <div 
        className="comment-list-container" 
        ref={containerRef}
        onScroll={handleScroll}
      >
        <Spin spinning={propsLoading !== undefined ? propsLoading : loading}>
          {comments.length > 0 ? (
            <List
              className="comment-list"
              itemLayout="vertical"
              dataSource={comments}
              renderItem={(comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  postId={postId}
                  onReplySuccess={handleReplySuccess}
                />
              )}
            />
          ) : (
            <Empty
              description="暂无评论，快来发表第一条评论吧~"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
          
          {/* 加载更多指示器 */}
          {loadingMore && (
            <div className="loading-more">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} />} />
              <span style={{ marginLeft: 8 }}>加载更多评论...</span>
            </div>
          )}
        </Spin>
      </div>

      {/* 评论输入框 - 移到底部 */}
      <div className="comment-input-container">
        <Space.Compact style={{ display: 'flex' }}>
          <Input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="写下您的评论..."
            maxLength={500}
            onPressEnter={handleSubmitComment}
            disabled={submitting}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            onClick={handleSubmitComment}
            disabled={!commentContent.trim()}
          >
            发布
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
};

export default CommentSection;