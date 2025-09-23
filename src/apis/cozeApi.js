import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api';


const token = process.env.COZE_API_TOKEN || 'pat_XzIMnIxCpTLf5EDE0GpdWcvIfE2KzscjuFdUDRwo1gjfOd7Cu603gtUtOipxHGwm'


const client = new CozeAPI({
    baseURL: COZE_CN_BASE_URL,
    token: token,
    allowPersonalAccessTokenInBrowser: true
});


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
 * 查看对话消息列表的API (使用SDK)
 */
export const getChatMessageList = async (conversationId, chatId) => {
    return await client.chat.messages.list(conversationId, chatId, null);
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
export default client;
