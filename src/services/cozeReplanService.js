import axios from 'axios';

const token = process.env.REACT_APP_COZE_API_TOKEN?.trim();
const botId = process.env.REACT_APP_COZE_BOT_ID?.trim();

// 调试信息
console.log('Environment variables check:');
console.log('Token exists:', !!token);
console.log('Bot ID:', botId);
console.log('Bot ID type:', typeof botId);
console.log('Bot ID length:', botId?.length);

if (!token) {
  throw new Error("REACT_APP_COZE_API_TOKEN is not set in environment variables.");
}

if (!botId) {
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
  throw new Error("REACT_APP_COZE_BOT_ID is not set in environment variables.");
}

const cozeClient = axios.create({
  baseURL: 'https://api.coze.cn',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// 提取消息文本内容的辅助函数
const extractTextFromMessage = (message) => {
  if (typeof message.content === 'string') {
    return message.content;
  }
  
  if (Array.isArray(message.content)) {
    return message.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('');
  }
  
  if (message.content && typeof message.content === 'object' && message.content.text) {
    return message.content.text;
  }
  
  return JSON.stringify(message.content);
};

// 合并解析后的响应到原始行程数据
const mergeParsedResponse = (originalTrip, parsedResponse, dayNumber) => {
  const updatedTrip = JSON.parse(JSON.stringify(originalTrip));

  // Helper to ensure numeric day
  const toDayNumber = (d) => {
    if (d === undefined || d === null) return Number(dayNumber);
    const n = Number(d);
    return Number.isNaN(n) ? Number(dayNumber) : n;
  };

  // If returned an array of days
  if (parsedResponse && Array.isArray(parsedResponse.dailyPlan)) {
    parsedResponse.dailyPlan.forEach(newDay => {
      const nd = { ...newDay };
      nd.day = toDayNumber(nd.day);
      const idx = updatedTrip.dailyPlan.findIndex(d => Number(d.day) === nd.day);
      if (idx >= 0) {
        updatedTrip.dailyPlan[idx] = nd;
      } else {
        updatedTrip.dailyPlan.push(nd);
      }
    });
  } else if (parsedResponse && (parsedResponse.day || parsedResponse.day === 0 || parsedResponse.day === '0')) {
    // Single day object with day field
    const nd = { ...parsedResponse, day: toDayNumber(parsedResponse.day) };
    const idx = updatedTrip.dailyPlan.findIndex(d => Number(d.day) === nd.day);
    if (idx >= 0) {
      updatedTrip.dailyPlan[idx] = nd;
    } else {
      updatedTrip.dailyPlan.push(nd);
    }
  } else if (parsedResponse && typeof parsedResponse === 'object') {
    // Single day object without day field: assume user clicked dayNumber
    const nd = { ...parsedResponse, day: toDayNumber(undefined) };
    const idx = updatedTrip.dailyPlan.findIndex(d => Number(d.day) === nd.day);
    if (idx >= 0) {
      updatedTrip.dailyPlan[idx] = nd;
    } else {
      updatedTrip.dailyPlan.push(nd);
    }
  }

  // Merge budgetBreakdown if present
  if (parsedResponse && parsedResponse.budgetBreakdown && typeof parsedResponse.budgetBreakdown === 'object') {
    updatedTrip.budgetBreakdown = {
      ...updatedTrip.budgetBreakdown,
      ...parsedResponse.budgetBreakdown,
    };
  }

  // Recalculate totalBudget if budgetBreakdown exists
  if (updatedTrip.budgetBreakdown && typeof updatedTrip.budgetBreakdown === 'object') {
    const total = Object.values(updatedTrip.budgetBreakdown).reduce((sum, v) => sum + (typeof v === 'number' ? v : Number(v) || 0), 0);
    updatedTrip.totalBudget = total;
  }

  return updatedTrip;
};

// 异步轮询版本（完整结果读取后渲染）- 主要函数
export const regenerateDayAsync = async (originalTrip, dayNumber, selectedTags, onProgress) => {
  const tagsText = selectedTags.join(' / ');
  
  const prompt = `请根据以下原始行程 JSON，对 Day${dayNumber} 进行优化重排，重排原因是：希望加入更多【${tagsText}】

原始Json：
${JSON.stringify(originalTrip, null, 2)}

请返回完整的更新后的JSON格式数据，保持原有的数据结构不变。`;

  try {
    if (onProgress) {
      onProgress('正在发送请求到Coze API...');
    }

    // 确保Bot ID是字符串格式
    const botIdStr = String(botId);
    console.log('Using Bot ID:', botIdStr);

    const requestPayload = {
      bot_id: botIdStr,
      user_id: `user_${Date.now()}`,
      stream: false, // 强制使用非流式调用
      auto_save_history: true,
      additional_messages: [
        {
          role: 'user',
          content: prompt,
          content_type: 'text',
        },
      ],
    };

    console.log('Request payload:', JSON.stringify(requestPayload, null, 2));

    // 发起聊天请求
    const response = await cozeClient.post('/v3/chat', requestPayload);

    if (onProgress) {
      onProgress('请求已发送，等待AI处理...');
    }

    const { data } = response;
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.code !== 0) {
      throw new Error(`API错误: ${data.msg || 'Unknown error'}`);
    }

    // 获取聊天ID
    const chatId = data.data?.id;
    const conversationId = data.data?.conversation_id;
    
    if (!chatId) {
      throw new Error('未获取到聊天ID');
    }

    if (onProgress) {
      onProgress('AI正在处理中，请稍候...');
    }

    // 使用固定间隔轮询策略，每秒检查一次，总等待上限 90s
    let attempts = 0;
    const delay = 1000; // 固定 1s 间隔
    const maxAttempts = 90; // 最多90次，即90秒

    while (attempts < maxAttempts) {
      // 等待 1 秒
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;

      try {
        // 检查聊天状态
        const statusResponse = await cozeClient.get(`/v3/chat/retrieve?chat_id=${chatId}&conversation_id=${conversationId}`);
        
        if (statusResponse.data?.code !== 0) {
          console.warn(`状态查询失败: ${statusResponse.data?.msg || 'Unknown error'}, 重试中...`);
          // 继续重试而不是直接抛出错误
          continue;
        }

        const status = statusResponse.data.data?.status;
        
        if (onProgress) {
          onProgress(`AI处理中 (第${attempts}次检查, 状态: ${status}, 已耗时: ${attempts}s)...`);
        }

        if (status === 'completed') {
          // 获取完整的聊天消息
          const messagesResponse = await cozeClient.get(`/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`);
          
          if (messagesResponse.data?.code !== 0) {
            throw new Error(`消息获取失败: ${messagesResponse.data?.msg || 'Unknown error'}`);
          }

          const messages = messagesResponse.data.data || [];
          console.log('Received messages:', JSON.stringify(messages, null, 2));

          // 查找AI的回复消息
          const aiMessage = messages.find(msg => msg.role === 'assistant' && msg.type === 'answer');
          
          if (!aiMessage || !aiMessage.content) {
            throw new Error('未找到AI的回复内容');
          }

          if (onProgress) {
            onProgress('AI处理完成，正在解析结果...');
          }

          // 提取文本内容
          const fullResponse = extractTextFromMessage(aiMessage);
          console.log('AI完整回复:', fullResponse);

          // 解析JSON并合并到原始数据
          const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.error('未找到JSON格式数据，AI原始回复:', fullResponse.slice(0, 500));
            throw new Error('AI返回的数据中未包含JSON格式结果');
          }

          let parsedResponse = null;
          try {
            parsedResponse = JSON.parse(jsonMatch[0]);
          } catch (e) {
            console.error('JSON解析失败:', e, '原始片段:', jsonMatch[0].slice(0, 200));
            throw new Error('解析AI返回的JSON失败');
          }

          if (onProgress) {
            onProgress('结果解析成功，正在合并数据...');
          }

          // 使用现有的合并逻辑
          const updatedTrip = mergeParsedResponse(originalTrip, parsedResponse, dayNumber);

          if (onProgress) {
            onProgress('数据合并完成！');
          }

          return updatedTrip;
        }

        if (status === 'failed') {
          throw new Error('AI处理失败');
        }

        // 如果状态是 in_progress 或其他，继续等待
      } catch (statusError) {
        console.error('状态检查出错:', statusError);
        if (attempts > 5) { // 增加重试次数
          throw statusError;
        }
      }
    }

    throw new Error('AI回复超时（>90s），请重试');

  } catch (error) {
    console.error('重新生成失败:', error);
    
    if (error.response) {
      const errorMsg = error.response.data?.msg || error.response.statusText || '未知错误';
      throw new Error(`API请求失败: ${errorMsg}`);
    } else {
      throw error;
    }
  }
};
