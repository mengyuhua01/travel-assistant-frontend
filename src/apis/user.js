import apiClient from '../utils/request';

// 用户注册
export const registerUser = async (userData) => {
  return apiClient.post('/register', userData);
};

// 用户登录
export const loginUser = async (credentials) => {
  return apiClient.post('/login', credentials);
};