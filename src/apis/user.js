import apiClient from '../utils/request';

// 用户注册
export const registerUser = async (userData) => {
  return apiClient.post('/register', userData);
};

// 用户登录
export const loginUser = async (credentials) => {
  return apiClient.post('/login', credentials);
};

// 获取所有标签
export const getTags = async () => {
  return apiClient.get('/tags');
};

// 设置用户标签
export const setUserTags = async (tagIds) => {
  return apiClient.put('/user/tags', { tagIds });
};

// 获取用户标签
export const getUserTag = async () => {
  return apiClient.get('/user/tags');
};