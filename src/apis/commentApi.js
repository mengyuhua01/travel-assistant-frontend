import apiClient from '../utils/request';

const COMMENT_API_BASE = '/comments';

// 获取帖子的所有评论
export const getCommentsByPost = async (postId) => {
  try {
    console.log('获取帖子评论，帖子ID:', postId);
    const response = await apiClient.get(`${COMMENT_API_BASE}/posts/${postId}`);
    console.log('评论API响应:', response);
    return response;
  } catch (error) {
    console.error('获取帖子评论失败:', error);
    throw error;
  }
};

// 添加评论（支持回复评论）
export const addComment = async (commentData) => {
  try {
    const { postId, content, parentId = null } = commentData;
    
    const payload = {
      postId,  
      content,
      parentId
    };
    const response = await apiClient.post(COMMENT_API_BASE, payload);
    console.log('添加评论API响应:', response);
    return response;
  } catch (error) {
    console.error('添加评论失败:', error);
    throw error;
  }
};

// 删除评论（如果需要的话）
export const deleteComment = async (commentId) => {
  try {
    console.log('删除评论，评论ID:', commentId);
    const response = await apiClient.delete(`${COMMENT_API_BASE}/${commentId}`);
    console.log('删除评论API响应:', response);
    return response;
  } catch (error) {
    console.error('删除评论失败:', error);
    throw error;
  }
};

// 更新评论（如果需要的话）
export const updateComment = async (commentId, content) => {
  try {
    console.log('更新评论，评论ID:', commentId, '新内容:', content);
    const response = await apiClient.put(`${COMMENT_API_BASE}/${commentId}`, {
      content
    });
    console.log('更新评论API响应:', response);
    return response;
  } catch (error) {
    console.error('更新评论失败:', error);
    throw error;
  }
};

// 获取评论的子评论
export const getChildComments = async (parentCommentId) => {
  try {
    console.log('获取子评论，父评论ID:', parentCommentId);
    const response = await apiClient.get(`${COMMENT_API_BASE}/${parentCommentId}`);
    console.log('子评论API响应:', response);
    return response;
  } catch (error) {
    console.error('获取子评论失败:', error);
    throw error;
  }
};