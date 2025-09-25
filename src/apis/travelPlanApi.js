import { request } from '../utils/request';

/**
 * 旅行方案相关的API接口
 */

// API基础路径
const TRAVEL_PLAN_API_BASE = '/travel-plans';

/**
 * 插入旅行方案
 * @param {Object} aiContent - AI生成的旅行方案数据对象
 * @returns {Promise<Object>} 返回插入结果，包含生成的ID
 */
export const insertTravelPlan = async (aiContent) => {
  try {
    return await request({
      url: TRAVEL_PLAN_API_BASE,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: aiContent 
    });
  } catch (error) {
    console.error('插入旅行方案失败:', error);
    throw new Error(error.message || '插入旅行方案失败');
  }
};

/**
 * 根据ID获取旅行方案详情
 * @param {string} planId - 方案ID
 * @returns {Promise<Object>} 返回方案详情
 */
export const getTravelPlanById = async (planId) => {
  try {
    return await request({
      url: `${TRAVEL_PLAN_API_BASE}/${planId}`,
      method: 'GET'
    });
  } catch (error) {
    console.error('获取旅行方案详情失败:', error);
    throw new Error(error.message || '获取旅行方案详情失败');
  }
};


/**
 * 获取用户的所有旅行方案
 * @returns {Promise<Array>} 返回方案列表
 */
export const getUserTravelPlans = async () => {
  try {
    return await request({
      url: TRAVEL_PLAN_API_BASE,
      method: 'GET'
    });
  } catch (error) {
    console.error('获取旅行方案列表失败:', error);
    throw new Error(error.message || '获取旅行方案列表失败');
  }
};

/**
 * 获取用户的所有旅行方案
 * @returns {Promise<Array>} 返回方案列表
 */
export const getRecentTravelPlans = async () => {
  try {
    return await request({
      url: `${TRAVEL_PLAN_API_BASE}/recent`,
      method: 'GET'
    });
  } catch (error) {
    console.error('获取旅行方案列表失败:', error);
    throw new Error(error.message || '获取旅行方案列表失败');
  }
};

/**
 * 完整更新旅行方案
 * @param {string} planId - 方案ID
 * @param {Object} planData - 完整的方案数据
 * @returns {Promise<Object>} 返回更新后的方案
 */
export const updateTravelPlan = async (planId, planData) => {
  try {
    return await request({
      url: `${TRAVEL_PLAN_API_BASE}/${planId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: planData
    });
  } catch (error) {
    console.error('更新旅行方案失败:', error);
    throw new Error(error.message || '更新旅行方案失败');
  }
};

/**
 * 部分更新旅行方案
 * @param {string} planId - 方案ID
 * @param {Object} partialData - 部分更新的数据
 * @returns {Promise<Object>} 返回更新后的方案
 */
export const partialUpdateTravelPlan = async (planId, partialData) => {
  try {
    return await request({
      url: `${TRAVEL_PLAN_API_BASE}/${planId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      data: partialData
    });
  } catch (error) {
    console.error('部分更新旅行方案失败:', error);
    throw new Error(error.message || '部分更新旅行方案失败');
  }
};

/**
 * 删除旅行方案
 * @param {string} planId - 方案ID
 * @returns {Promise<Object>} 返回删除结果
 */
export const deleteTravelPlan = async (planId) => {
  try {
    return await request({
      url: `${TRAVEL_PLAN_API_BASE}/${planId}`,
      method: 'DELETE'
    });
  } catch (error) {
    console.error('删除旅行方案失败:', error);
    throw new Error(error.message || '删除旅行方案失败');
  }
};


