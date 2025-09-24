import apiClient from '../utils/request';

const POST_API_BASE = '/posts';

// 获取帖子列表（分页）
export const getPostList = async (page = 1, pageSize = 10, keyword = '') => {
  try {
    const params = { page, pageSize };
    if (keyword) {
      params.keyword = keyword;
    }
    console.log('请求帖子列表参数:', params);
    const response = await apiClient.get(POST_API_BASE, {
      params
    });
    console.log('帖子列表API响应:', response);
    return response;
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    throw error;
  }
};

// 创建新帖子
export const createPost = async (postData) => {
  try {
    console.log('发送创建帖子请求:', postData);
    const response = await apiClient.post(POST_API_BASE, postData);
    console.log('创建帖子API响应:', response);
    return response;
  } catch (error) {
    console.error('创建帖子失败:', error);
    throw error;
  }
};

// 获取帖子详情
export const getPostDetail = async (postId) => {
  try {
    console.log('请求帖子详情，ID:', postId);
    const response = await apiClient.get(`/posts/${postId}`);
    console.log('帖子详情API响应:', response);
    return response;
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    throw error;
  }
};

// 注意：评论相关的API已经移动到 commentApi.js 文件中

