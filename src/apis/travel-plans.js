import apiClient from '../utils/request';

/**
 * Fetch travel plan details by ID
 * @param {string} id - The ID of the travel plan
 * @returns {Promise<Object>} - The travel plan data
 */
export const getTravelPlanById = async (id) => {
  try {
    const response = await apiClient.get(`/travel-plans/${id}`);
    console.log('API response:', response);
    return response; // apiClient already returns response.data due to interceptor
  } catch (error) {
    console.error(`Failed to fetch travel plan with ID ${id}:`, error);
    throw error;
  }
};