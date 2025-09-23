import { 
  getTravelPlanById, 
  updateTravelPlan, 
  partialUpdateTravelPlan 
} from '../apis/travelPlanApi';

/**
 * 旅行方案业务逻辑服务
 */

/**
 * 根据ID获取旅行方案详情
 * @param {string} tripId - 方案ID
 * @returns {Promise<Object>} 返回方案详情
 */
export const getTripById = async (tripId) => {
  try {
    const response = await getTravelPlanById(tripId);
    
    // 确保数据格式正确
    const tripData = response.data || response;
    
    // 如果没有dailyPlan字段，尝试从其他字段构建
    if (!tripData.dailyPlan && tripData.details) {
      tripData.dailyPlan = tripData.details;
    }
    
    // 确保每天都有必要的字段，并重新分配天数
    if (tripData.dailyPlan && Array.isArray(tripData.dailyPlan)) {
      tripData.dailyPlan = tripData.dailyPlan.map((day, index) => ({
        day: index + 1, // 根据数组索引重新分配天数，确保连续
        date: day.date,
        theme: day.theme || `第${index + 1}天`,
        morning: day.morning || '',
        afternoon: day.afternoon || '',
        evening: day.evening || '',
        meals: day.meals || {
          breakfast: '',
          lunch: '',
          dinner: ''
        },
        accommodation: day.accommodation || {
          name: '',
          address: '',
          roomType: '',
          price: 0,
          bookingLink: ''
        },
        transportation: day.transportation || {
          details: '',
          cost: 0,
          bookingLink: ''
        },
        dailyCost: day.dailyCost || 0,
        // 保留其他字段，但确保day字段被正确覆盖
        ...day,
        day: index + 1 // 再次确保day字段是正确的
      }));
    }
    
    // 确保有总预算
    if (!tripData.totalBudget && tripData.dailyPlan) {
      tripData.totalBudget = tripData.dailyPlan.reduce((sum, day) => sum + (day.dailyCost || 0), 0);
    }
    
    return tripData;
  } catch (error) {
    console.error('获取旅行方案详情失败:', error);
    throw error;
  }
};

/**
 * 完整更新旅行方案
 * @param {string} tripId - 方案ID
 * @param {Object} tripData - 完整的方案数据
 * @returns {Promise<Object>} 返回更新后的方案
 */
export const updateTrip = async (tripId, tripData) => {
  try {
    // 重新计算总预算
    if (tripData.dailyPlan && Array.isArray(tripData.dailyPlan)) {
      tripData.totalBudget = tripData.dailyPlan.reduce((sum, day) => sum + (day.dailyCost || 0), 0);
      
      // 重新计算预算分解
      tripData.budgetBreakdown = calculateBudgetBreakdown(tripData.dailyPlan);
    }
    
    const response = await updateTravelPlan(tripId, tripData);
    return response.data || response;
  } catch (error) {
    console.error('更新旅行方案失败:', error);
    throw error;
  }
};

/**
 * 部分更新旅行方案
 * @param {string} tripId - 方案ID
 * @param {Object} partialData - 部分更新的数据
 * @returns {Promise<Object>} 返回更新后的方案
 */
export const partialUpdateTrip = async (tripId, partialData) => {
  try {
    // 如果更新包含 dailyPlan，需要重新计算总预算
    if (partialData.dailyPlan && Array.isArray(partialData.dailyPlan)) {
      partialData.totalBudget = partialData.dailyPlan.reduce((sum, day) => sum + (day.dailyCost || 0), 0);
      partialData.budgetBreakdown = calculateBudgetBreakdown(partialData.dailyPlan);
    }
    
    const response = await partialUpdateTravelPlan(tripId, partialData);
    return response.data || response;
  } catch (error) {
    console.error('部分更新旅行方案失败:', error);
    throw error;
  }
};

/**
 * 更新特定天的行程
 * @param {string} tripId - 方案ID
 * @param {number} dayNumber - 天数
 * @param {Object} dayData - 该天的新数据
 * @returns {Promise<Object>} 返回更新后的完整方案
 */
export const updateDayPlan = async (tripId, dayNumber, dayData) => {
  try {
    // 先获取完整的行程数据
    const currentTrip = await getTripById(tripId);
    
    // 更新指定天的数据
    const updatedDailyPlan = currentTrip.dailyPlan.map(day => 
      day.day === dayNumber ? { ...day, ...dayData } : day
    );
    
    // 重新计算总预算
    const totalBudget = updatedDailyPlan.reduce((sum, day) => sum + (day.dailyCost || 0), 0);
    
    // 准备更新数据
    const updateData = {
      dailyPlan: updatedDailyPlan,
      totalBudget: totalBudget,
      budgetBreakdown: calculateBudgetBreakdown(updatedDailyPlan)
    };
    
    // 执行部分更新
    const updatedTrip = await partialUpdateTrip(tripId, updateData);
    
    return updatedTrip;
  } catch (error) {
    console.error('更新单天行程失败:', error);
    throw error;
  }
};

/**
 * 重新排序日程计划
 * @param {string} tripId - 方案ID
 * @param {Array} newOrder - 新的排序数组，包含原始的day索引
 * @returns {Promise<Object>} 返回更新后的方案
 */
export const reorderDayPlan = async (tripId, newOrder) => {
  try {
    // 获取当前的旅行方案
    const currentTrip = await getTripById(tripId);
    
    if (!currentTrip.dailyPlan || !Array.isArray(currentTrip.dailyPlan)) {
      throw new Error('无效的日程数据');
    }
    
    // 根据新顺序重新排列数组
    const reorderedPlan = newOrder.map((originalIndex, newIndex) => {
      const dayData = currentTrip.dailyPlan[originalIndex];
      return {
        ...dayData,
        day: newIndex + 1, // 重新分配天数
        theme: dayData.theme?.replace(/第\d+天/, `第${newIndex + 1}天`) || `第${newIndex + 1}天`
      };
    });
    
    // 更新数据
    const updateData = {
      dailyPlan: reorderedPlan,
      totalBudget: reorderedPlan.reduce((sum, day) => sum + (day.dailyCost || 0), 0),
      budgetBreakdown: calculateBudgetBreakdown(reorderedPlan)
    };
    
    // 执行更新
    const updatedTrip = await partialUpdateTrip(tripId, updateData);
    
    return updatedTrip;
  } catch (error) {
    console.error('重新排序日程失败:', error);
    throw error;
  }
};

/**
 * 计算预算分解
 * @param {Array} dailyPlan - 每日计划
 * @returns {Object} 预算分解对象
 */
const calculateBudgetBreakdown = (dailyPlan) => {
  const breakdown = {
    accommodation: 0,
    food: 0,
    transportation: 0,
    activities: 0,
    others: 0
  };
  
  dailyPlan.forEach(day => {
    // 住宿费用
    if (day.accommodation && day.accommodation.price) {
      breakdown.accommodation += day.accommodation.price;
    }
    
    // 交通费用
    if (day.transportation && day.transportation.cost) {
      breakdown.transportation += day.transportation.cost;
    }
    
    // 餐饮费用 (估算为日费用的40%)
    const dailyCost = day.dailyCost || 0;
    breakdown.food += Math.round(dailyCost * 0.4);
    
    // 活动费用 (剩余费用)
    const accommodationCost = (day.accommodation && day.accommodation.price) || 0;
    const transportationCost = (day.transportation && day.transportation.cost) || 0;
    const foodCost = Math.round(dailyCost * 0.4);
    
    breakdown.activities += Math.max(0, dailyCost - accommodationCost - transportationCost - foodCost);
  });
  
  return breakdown;
};

export default {
  getTripById,
  updateTrip,
  partialUpdateTrip,
  updateDayPlan,
  reorderDayPlan
};
