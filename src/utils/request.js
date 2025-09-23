import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      // 只有在不是登录页面时才重定向，避免无限循环
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 通用请求函数
 * @param {Object} config - 请求配置
 * @param {string} config.url - 请求URL
 * @param {string} config.method - 请求方法
 * @param {Object} config.data - 请求数据
 * @param {Object} config.headers - 额外的请求头
 * @returns {Promise} 请求结果
 */
export const request = async (config) => {
  try {
    return await apiClient({
      ...config,
      headers: {
        ...apiClient.defaults.headers,
        ...config.headers
      }
    });
  } catch (error) {
    throw error;
  }
};

export default apiClient;

