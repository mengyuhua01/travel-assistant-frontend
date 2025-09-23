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
 */
export const postChatRequest = async (requestData) => {
    return await client.chat.create(requestData);
};

/**
 * 查看对话状态的API (使用SDK)
 */
export const getChatStatus = async (conversationId, chatId) => {
    return await client.chat.retrieve(conversationId, chatId, null);
};

/**
 * 轮询查看对话状态直到完成
 */
export const pollChatStatus = async (conversationId, chatId, maxAttempts = 60, interval = 2000) => {
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const statusResult = await getChatStatus(conversationId, chatId);

            // 检查对话状态
            if (statusResult?.status === 'completed') {
                return statusResult;
            } else if (statusResult?.status === 'failed') {
                return statusResult;
            }

            // 等待指定间隔后继续轮询
            await new Promise(resolve => setTimeout(resolve, interval));
            attempts++;

        } catch (error) {
            attempts++;

            if (attempts >= maxAttempts) {
                break;
            }

            // 轮询失败时也要等待
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }

    return null;
};

/**
 * 查看对话消息列表的API (使用SDK)
 */
export const getChatMessageList = async (conversationId, chatId) => {
    try {
        return await client.chat.messages.list(conversationId, chatId, null);
    } catch (error) {
        // 如果SDK方式失败，使用原生fetch作为备选
        const fetchResponse = await fetch(`https://api.coze.cn/v3/chat/message/list?conversation_id=${conversationId}&chat_id=${chatId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return await fetchResponse.json();
    }
};

/**
 * 生成旅行方案的专用函数
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
        bot_id: "7552821142114517055",
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

    return await postChatRequest(requestData);
};

/**
 * 使用Coze SDK发起聊天请求 (非流式响应)
 */
export const postChatWithSDK = async (requestData) => {
    const nonStreamRequestData = {
        ...requestData,
        stream: false
    };
    return await client.chat.create(nonStreamRequestData);
};

export default client;
