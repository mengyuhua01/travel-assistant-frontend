import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api';

// Import token using the environment variable
const token = process.env.COZE_API_TOKEN || 'pat_XzIMnIxCpTLf5EDE0GpdWcvIfE2KzscjuFdUDRwo1gjfOd7Cu603gtUtOipxHGwm'

// Create a client instance
const client = new CozeAPI({
    baseURL: COZE_CN_BASE_URL,
    token: token,   //扣子个人访问令牌。
    allowPersonalAccessTokenInBrowser: true // 允许在浏览器环境中使用个人访问令牌
});

/**
 * 发起POST请求到Coze聊天API (使用SDK)
 * @param {Object} requestData - 请求数据
 * @param {string} requestData.bot_id - 机器人ID
 * @param {string} requestData.user_id - 用户ID
 * @param {Array} requestData.additional_messages - 消息数组
 * @param {boolean} requestData.stream - 是否流式响应
 * @returns {Promise} API响应数据
 */
export const postChatRequest = async (requestData) => {
    try {
        const response = await client.chat.create(requestData);
        return response; // 直接返回完整响应
    } catch (error) {
        console.error('Coze API request failed:', error);
        throw error;
    }
};

/**
 * 查看对话状态的API (使用SDK)
 * @param {string} conversationId - 会话ID
 * @param {string} chatId - 对话ID
 * @returns {Promise} 对话状态信息
 */
export const getChatStatus = async (conversationId, chatId) => {
    try {
        console.log('查询对话状态参数:', { conversationId, chatId });

        // 使用正确的参数名称：conversation_id 和 chat_id
        const response = await client.chat.retrieve(
            conversationId,
            chatId,null
        );

        console.log('查询状态成功响应:', response);
        return response; // 直接返回完整响应
    } catch (error) {
        console.error('Get chat status failed:', error);
        console.error('查询参数:', { conversationId, chatId });
        throw error;
    }
};

/**
 * 轮询查看对话状态直到完成
 * @param {string} conversationId - 会话ID
 * @param {string} chatId - 对话ID
 * @param {number} maxAttempts - 最大轮询次数，默认60次（2分钟）
 * @param {number} interval - 轮询间隔，默认2000ms（2秒）
 * @returns {Promise} 完成的对话信息
 */
export const pollChatStatus = async (conversationId, chatId, maxAttempts = 60, interval = 2000) => {
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const statusResult = await getChatStatus(conversationId, chatId);

            console.log(`轮询第${attempts + 1}次，完整响应:`, statusResult);
            console.log(`轮询第${attempts + 1}次，状态:`, statusResult?.status);

            // 检查对话状态 - 根据实际响应结构调整
            if (statusResult?.status === 'completed') {
                return statusResult;
            } else if (statusResult?.status === 'failed') {
                throw new Error('对话处理失败');
            }

            // 等待指定间隔后继续轮询（现在是2秒）
            await new Promise(resolve => setTimeout(resolve, interval));
            attempts++;

        } catch (error) {
            console.error(`轮询第${attempts + 1}次失败:`, error);
            attempts++;

            if (attempts >= maxAttempts) {
                throw new Error('轮询超时，对话可能仍在处理中');
            }

            // 轮询失败时也要等待
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }

    throw new Error('轮询超时，对话可能仍在处理中');
};

/**
 * 查看对话消息列表的API (使用SDK)
 * 注意：调用此API之前，建议先轮询查看对话详情API确认本轮对话已结束（status=completed）
 * @param {string} conversationId - 会话ID
 * @param {string} chatId - 对话ID
 * @returns {Promise} 对话消息列表
 */
export const getChatMessageList = async (conversationId, chatId) => {
    try {
        console.log('获取消息列表参数:', { conversationId, chatId });

        // 尝试使用和getChatStatus相同的位置参数格式
        const response = await client.chat.messages.list(
            conversationId,
            chatId,
            null
        );

        console.log('获取消息列表成功响应:', response);
        return response; // 直接返回完整响应

    } catch (error) {
        console.error('SDK方式失败，尝试原生fetch:', error);

        // 如果SDK方式失败，使用原生fetch作为备选
        try {
            const fetchResponse = await fetch(`https://api.coze.cn/v3/chat/message/list?conversation_id=${conversationId}&chat_id=${chatId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!fetchResponse.ok) {
                const errorText = await fetchResponse.text();
                throw new Error(`HTTP error! status: ${fetchResponse.status}, message: ${errorText}`);
            }

            const data = await fetchResponse.json();
            console.log('原生fetch获取消息成功:', data);
            return data;

        } catch (fetchError) {
            console.error('原生fetch也失败:', fetchError);
            throw error; // 抛出原始错误
        }
    }
};

/**
 * 生成旅行方案的专用函数
 * @param {Object} travelData - 旅行数据
 * @param {string} travelData.departure - 始发地
 * @param {string} travelData.destination - 目的地
 * @param {number} travelData.peopleCount - 出行人数
 * @param {string} travelData.budget - 预算
 * @param {string} travelData.startDate - 开始日期
 * @param {string} travelData.endDate - 结束日期
 * @param {number} travelData.travelDays - 旅行天数
 * @returns {Promise} 旅行方案生成结果
 */
export const generateTravelPlan = async (travelData) => {
    const message = `请为我生成一个旅行方案：
- 始发地：${travelData.departure}
- 目的地：${travelData.destination}
- 出行人数：${travelData.peopleCount}人
- 预算：${travelData.budget}元
- 出行时间：${travelData.startDate} 到 ${travelData.endDate}
- 旅行天数：${travelData.travelDays}天

请根据以上信息生成详细的旅行方案，包括行程安排、景点推荐、住宿建议等。`;

    const requestData = {
        bot_id: "7552821142114517055", // 需要替换为实际的机器人ID
        user_id: "user_" + Date.now(),
        additional_messages: [
            {
                role: "user",
                content: message,
                content_type: "text"
            }
        ],
        stream: false,
    };

    // 只发起对话请求，返回包含conversation_id和chat_id的响应
    return await postChatRequest(requestData);
};

/**
 * 使用Coze SDK发起聊天请求 (非流式响应)
 * @param {Object} requestData - 请求数据
 * @returns {Promise} API响应数据
 */
export const postChatWithSDK = async (requestData) => {
    try {
        // 确保设置为非流式响应
        const nonStreamRequestData = {
            ...requestData,
            stream: false
        };
        const response = await client.chat.create(nonStreamRequestData);
        return response; // 直接返回响应体数据
    } catch (error) {
        console.error('Coze SDK request failed:', error);
        throw error;
    }
};

export default client;
