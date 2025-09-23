import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Row,
  Col,
  Progress,
  Button,
  Tag,
  Space,
  Divider,
  Empty,
  message
} from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  StarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import TravelForm from '../components/TravelForm';
import { generateTravelPlan, pollChatStatus, getChatMessageList } from '../apis/cozeApi';

const { Title, Text, Paragraph } = Typography;

/**
 * 旅行方案主页面
 * 包含表单和方案预览
 */
const TravelPlanPage = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState(null);

  /**
   * 完整的AI方案生成流程
   * 包含：发起对话 -> 轮询状态 -> 获取消息详情
   */
  const generateAITravelPlans = async (travelData) => {
    setFormData(travelData);
    setIsGenerating(true);
    setProgress(0);
    setPlans([]);

    try {
      // 第1步：发起对话请求
      setProgress(20);
      message.info('🤖 正在向AI发起旅行规划请求...');

      const chatResponse = await generateTravelPlan(travelData);

      const conversationId = chatResponse.conversation_id;
      const chatId = chatResponse.id;

      // 第2步：轮询对话状态
      setProgress(40);
      message.info('⏳ AI正在思考中，请稍候...');

      const completedChat = await pollChatStatus(conversationId, chatId);

      // 第3步：获取完整的消息列表
      setProgress(80);
      message.info('📄 正在获取AI生成的完整方案...');

      const messageList = await getChatMessageList(conversationId, chatId);

      // 第4步：解析AI回复并生成前端显示的方案
      setProgress(100);
      const aiGeneratedPlans = parseAIResponseToPlans(messageList);

      setPlans(aiGeneratedPlans);
      message.success('🎉 AI旅行方案生成成功！');

    } catch (error) {
      message.error(`生成失败：${error.message}`);

      // 发生错误时显示备用方案
      const fallbackPlans = generateFallbackPlans(travelData);
      setPlans(fallbackPlans);
      message.warning('已为您提供备用方案');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  /**
   * 解析AI消息列表，转换为前端显示的方案格式
   */
  const parseAIResponseToPlans = (messageList) => {
    const aiMessage = messageList.find(msg => msg.type === 'answer');
    const aiContent = JSON.parse(aiMessage.content);

    return [
      {
        id: 'ai-generated-1',
        title: aiContent.title || '定制旅行方案',
        duration: `${aiContent.duration || 3}天`,
        budget: `¥${aiContent.totalBudget || 2000}`,
        description: aiContent.overview || '为您定制的专属旅行方案',
        image: '🤖',
        type: 'ai-generated',
        highlights: aiContent.tips ? aiContent.tips.slice(0, 4) : ['AI定制', '个性化', '智能推荐'],
        rating: 4.8,
        dailyPlan: aiContent.dailyPlan || [],
        tips: aiContent.tips || []
      }
    ];
  };

  /**
   * 生成备用方案
   */
  const generateFallbackPlans = (travelData) => {
    return [
      {
        id: 'fallback-1',
        title: `${travelData.destination}经典之旅`,
        duration: `${travelData.travelDays}天${travelData.travelDays - 1}夜`,
        budget: `¥${travelData.budget}/人`,
        rating: 4.6,
        highlights: ['经典路线', '热门景点', '性价比高', '安全可靠'],
        description: `为您精心规划的${travelData.destination}${travelData.travelDays}日游，包含热门景点和特色体验。`,
        image: '🏛️',
        type: 'classic'
      }
    ];
  };

  // 处理表单提交 - 这是生成方案按钮的点击事件
  const handleFormSubmit = (values) => {
    generateAITravelPlans(values);
  };

  // 跳转到方案详情
  const handleViewPlan = (planId) => {
    navigate(`/plan/${planId}`, {
      state: {
        formData,
        planId
      }
    });
  };

  // 获取方案类型对应的颜色
  const getTypeColor = (type) => {
    const colors = {
      cultural: 'blue',
      leisure: 'green',
      adventure: 'orange',
      'ai-generated': 'purple',
      classic: 'blue'
    };
    return colors[type] || 'default';
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 表单区域 */}
      <TravelForm onSubmit={handleFormSubmit} loading={isGenerating} />

      {/* 方案生成区域 */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', paddingBottom: '40px' }}>
        {/* AI生成进度显示 */}
        {isGenerating && (
          <Card style={{ marginBottom: 24, borderRadius: 12 }}>
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🤖</div>
              <Title level={2} style={{ marginBottom: 24, color: '#1890ff' }}>
                AI正在为您生成专属旅行方案
              </Title>
              <Progress
                percent={progress}
                status="active"
                strokeColor={{
                  from: '#667eea',
                  to: '#764ba2',
                }}
                strokeWidth={8}
                style={{ marginBottom: 20 }}
              />
              <Text type="secondary" style={{ fontSize: 16 }}>
                {progress === 20 && '🔍 正在分析您的需求...'}
                {progress === 40 && '⏳ AI正在思考中...'}
                {progress === 80 && '📄 正在获取完整方案...'}
                {progress === 100 && '✅ 生成个性化方案完成！'}
              </Text>
            </div>
          </Card>
        )}

        {/* 方案预览区域 */}
        {Array.isArray(plans) && plans.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <Title level={2} style={{ marginBottom: 16 }}>
                🎯 为您推荐以下旅行方案
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                根据您的需求，我们为您精选了最适合的旅行方案
              </Text>
            </div>

            <Row gutter={[24, 24]}>
              {plans.map((plan) => (
                <Col xs={24} md={12} lg={8} key={plan.id}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: '1px solid #f0f0f0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    bodyStyle={{ padding: 24 }}
                    onClick={() => handleViewPlan(plan.id)}
                    actions={[
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPlan(plan.id);
                        }}
                        style={{
                          borderRadius: 8,
                          background: plan.type === 'ai-generated'
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : '#1890ff',
                          border: 'none'
                        }}
                        key="view"
                      >
                        查看详情
                      </Button>
                    ]}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <div style={{ fontSize: 56, marginBottom: 12 }}>
                        {plan.image}
                      </div>
                      <Title level={3} style={{ marginBottom: 12, color: '#1f1f1f' }}>
                        {plan.title}
                      </Title>
                      <Space size="middle">
                        <Tag color={getTypeColor(plan.type)} style={{ fontSize: 12, padding: '2px 8px' }}>
                          {plan.type === 'ai-generated' && 'AI定制'}
                          {plan.type === 'cultural' && '文化旅游'}
                          {plan.type === 'leisure' && '休闲度假'}
                          {plan.type === 'adventure' && '户外探险'}
                          {plan.type === 'classic' && '经典路线'}
                        </Tag>
                        <Text type="secondary">
                          <StarOutlined style={{ color: '#faad14', marginRight: 4 }} />
                          {plan.rating}
                        </Text>
                      </Space>
                    </div>

                    <Divider style={{ margin: '20px 0' }} />

                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      <Space>
                        <ClockCircleOutlined style={{ color: '#1890ff' }} />
                        <Text strong>{plan.duration}</Text>
                      </Space>
                      <Space>
                        <DollarOutlined style={{ color: '#52c41a' }} />
                        <Text strong>{plan.budget}</Text>
                      </Space>
                      <Space>
                        <UserOutlined style={{ color: '#fa541c' }} />
                        <Text>适合{formData?.peopleCount || 2}人出行</Text>
                      </Space>
                    </Space>

                    <Divider style={{ margin: '20px 0' }} />

                    <div>
                      <Text strong style={{ display: 'block', marginBottom: 12 }}>
                        行程提示：
                      </Text>
                      <Space wrap>
                        {Array.isArray(plan.highlights) && plan.highlights.length > 0 ? (
                          plan.highlights.map((highlight, index) => (
                            <Tag key={index} color="blue-inverse" style={{ marginBottom: 4 }}>
                              {highlight}
                            </Tag>
                          ))
                        ) : (
                          <Tag color="blue-inverse">暂无亮点信息</Tag>
                        )}
                      </Space>
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ marginTop: 16, marginBottom: 0 }}
                      type="secondary"
                    >
                      {plan.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* 空状态 */}
        {!isGenerating && plans.length === 0 && (
          <Card style={{
            textAlign: 'center',
            padding: '80px 20px',
            borderRadius: 16,
            border: '2px dashed #d9d9d9'
          }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>🗺️</div>
            <Title level={3} style={{ color: '#8c8c8c', marginBottom: 16 }}>
              开始您的旅行规划
            </Title>
            <Text style={{ fontSize: 16, color: '#999' }}>
              请填写上方表单，我们将为您生成个性化的旅行方案
            </Text>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TravelPlanPage;
