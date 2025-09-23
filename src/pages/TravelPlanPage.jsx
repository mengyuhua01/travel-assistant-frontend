import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Card, Col, Divider, message, Progress, Row, Space, Tag, Typography} from 'antd';
import {ClockCircleOutlined, DollarOutlined, EyeOutlined, StarOutlined, UserOutlined} from '@ant-design/icons';
import TravelForm from '../components/TravelForm';
import {generateTravelPlan, getChatMessageList, getChatStatus} from '../apis/cozeApi';
import {insertTravelPlan} from '../apis/travelPlanApi';
import './TravelPlanPage.css';

const {Title, Text, Paragraph} = Typography;

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

            // 动画展示AI思考进度
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 79) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 1200); // 每1200毫秒更新一次进度

            await pollChatStatus(conversationId, chatId);
            clearInterval(progressInterval); // 轮询结束，清除动画

            // 第3步：获取完整的消息列表
            setProgress(80);
            message.info('📄 正在获取AI生成的完整方案...');

            const messageList = await getChatMessageList(conversationId, chatId);

            // 第4步：解析AI回复并生成前端显示的方案
            setProgress(100);
            const aiGeneratedPlans = await parseAIResponseToPlans(messageList);

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
    const parseAIResponseToPlans = async (messageList) => {
        const aiMessage = messageList.find(msg => msg.type === 'answer');
        const jsonString = aiMessage.content.substring(aiMessage.content.indexOf('{'));
        const aiContent = JSON.parse(jsonString);
        
        try {
            // 直接插入AI解析出来的aiContent对象到数据库
            const insertResult = await insertTravelPlan(aiContent);
            const planId = insertResult.data?.id || insertResult.id;
            
            // 返回前端显示格式，包含数据库返回的真实ID
            return [
                {
                    id: planId, // 使用数据库返回的真实ID
                    title: aiContent.title || '定制旅行方案',
                    duration: aiContent.duration || '3天',
                    budget: `¥${aiContent.totalBudget || 2000}`,
                    description: aiContent.overview || '为您定制的专属旅行方案',
                    image: '🤖',
                    type: 'ai-generated',
                    rating: 4.8,
                    dailyPlan: aiContent.dailyPlan || [],
                    tips: aiContent.tips || []
                }
            ];
        } catch (error) {
            console.error('插入旅行方案到数据库失败:', error);
            // 即使插入失败，也返回方案数据（使用临时ID）
            return [
                {
                    id: 'ai-generated-temp-' + Date.now(),
                    title: aiContent.title || '定制旅行方案',
                    duration: aiContent.duration || '3天',
                    budget: `¥${aiContent.totalBudget || 2000}`,
                    description: aiContent.overview || '为您定制的专属旅行方案',
                    image: '🤖',
                    type: 'ai-generated',
                    rating: 4.8,
                    dailyPlan: aiContent.dailyPlan || [],
                    tips: aiContent.tips || []
                }
            ];
        }
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
        // 直接使用数据库返回的ID进行跳转，不传递其他数据
        navigate(`/trip/${planId}`);
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

    // Function to poll chat status until completion or failure
    const pollChatStatus = async (conversationId, chatId, interval = 2000) => {
        while (true) {
            try {
                const statusResult = await getChatStatus(conversationId, chatId);

                // Check conversation status
                if (statusResult?.status === 'completed' || statusResult?.status === 'failed') {
                    return statusResult;
                }

                // Wait for the specified interval before continuing polling
                await new Promise(resolve => setTimeout(resolve, interval));

            } catch (error) {
                // Wait even if polling fails before retrying
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }
    };

    return (
        <div style={{background: '#f5f5f5', minHeight: '100vh'}}>
            {/* 表单区域 */}
            <TravelForm onSubmit={handleFormSubmit} loading={isGenerating}/>

            {/* 方案生成区域 */}
            <div style={{background: 'transparent', paddingBottom: '40px'}}>
                {/* AI生成进度显示 */}
                {isGenerating && (
                    <div className="travel-form-container" style={{background: '#ffffff', borderBottom: '1px solid #f0f0f0'}}>
                        <div className="travel-form-content">
                            <Card style={{
                                borderRadius: 12,
                                border: '1px solid #054d2e',
                                boxShadow: '0 4px 16px rgba(5, 77, 46, 0.08)'
                            }}>
                                <div style={{textAlign: 'center', padding: '60px 20px'}}>
                                    <div style={{fontSize: 48, marginBottom: 20}}>🤖</div>
                                    <Title level={2} style={{marginBottom: 24, color: '#1890ff'}}>
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
                                        style={{marginBottom: 20}}
                                    />
                                    <Text type="secondary" style={{fontSize: 16}}>
                                        {progress === 20 && '🔍 正在分析您的需求...'}
                                        {progress === 40 && '⏳ AI正在思考中...'}
                                        {progress === 80 && '📄 正在获取完整方案...'}
                                        {progress === 100 && '✅ 生成个性化方案完成！'}
                                    </Text>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* 方案预览区域 */}
                {Array.isArray(plans) && plans.length > 0 && (
                    <div className="travel-form-container" style={{background: '#ffffff', borderBottom: '1px solid #f0f0f0'}}>
                        <div className="travel-form-content">
                            <div style={{textAlign: 'center', marginBottom: 40}}>
                                <Title level={2} style={{marginBottom: 16}}>
                                    🎯 为您推荐以下旅行方案
                                </Title>
                                <Text type="secondary" style={{fontSize: 16}}>
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
                                            border: '1px solid #054d2e',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        styles={{body: {padding: 24}}}
                                        onClick={() => handleViewPlan(plan.id)}
                                        actions={[
                                            <Button
                                                type="primary"
                                                icon={<EyeOutlined/>}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewPlan(plan.id);
                                                }}
                                                style={{
                                                    borderRadius: 8,
                                                    background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                                                    border: 'none',
                                                    color: '#2d5a27',
                                                    fontWeight: 500,
                                                    boxShadow: '0 4px 12px rgba(200, 230, 201, 0.4)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                key="view"
                                            >
                                                查看详情
                                            </Button>
                                        ]}
                                    >
                                        <div style={{textAlign: 'center', marginBottom: 20}}>
                                            <div style={{fontSize: 56, marginBottom: 12}}>
                                                {plan.image}
                                            </div>
                                            <Title level={3} style={{marginBottom: 12, color: '#1f1f1f'}}>
                                                {plan.title}
                                            </Title>
                                            <Space size="middle">
                                                <Tag color={getTypeColor(plan.type)}
                                                     style={{fontSize: 12, padding: '2px 8px'}}>
                                                    {plan.type === 'ai-generated' && 'AI定制'}
                                                    {plan.type === 'cultural' && '文化旅游'}
                                                    {plan.type === 'leisure' && '休闲度假'}
                                                    {plan.type === 'adventure' && '户外探险'}
                                                    {plan.type === 'classic' && '经典路线'}
                                                </Tag>
                                                <Text type="secondary">
                                                    <StarOutlined style={{color: '#faad14', marginRight: 4}}/>
                                                    {plan.rating}
                                                </Text>
                                            </Space>
                                        </div>

                                        <Divider style={{margin: '20px 0'}}/>

                                        <Space direction="vertical" style={{width: '100%'}} size="middle">
                                            <Space>
                                                <ClockCircleOutlined style={{color: '#1890ff'}}/>
                                                <Text strong>{plan.duration}</Text>
                                            </Space>
                                            <Space>
                                                <DollarOutlined style={{color: '#52c41a'}}/>
                                                <Text strong>{plan.budget}</Text>
                                            </Space>
                                            <Space>
                                                <UserOutlined style={{color: '#fa541c'}}/>
                                                <Text>适合{formData?.peopleCount || 2}人出行</Text>
                                            </Space>
                                        </Space>

                                        <Divider style={{margin: '20px 0'}}/>

                                        <div>
                                            <Text strong style={{display: 'block', marginBottom: 12}}>
                                                行程Tips：
                                            </Text>
                                            <Space wrap>
                                                {Array.isArray(plan.tips) && plan.tips.length > 0 ? (
                                                    plan.tips.map((tip, index) => (
                                                        <Tag key={index} color="blue-inverse" style={{marginBottom: 4}}>
                                                            {tip}
                                                        </Tag>
                                                    ))
                                                ) : (
                                                    <Tag color="blue-inverse">暂无贴士信息</Tag>
                                                )}
                                            </Space>
                                        </div>

                                        <Paragraph
                                            className="plan-description"
                                            ellipsis={{rows: 2}}
                                            style={{marginTop: 16, marginBottom: 0}}
                                            type="secondary"
                                        >
                                            {plan.description}
                                        </Paragraph>
                                    </Card>
                                </Col>
                            ))}
                            </Row>
                        </div>
                    </div>
                )}

                {/* 空状态 */}
                {!isGenerating && plans.length === 0 && (
                    <div className="travel-form-container" style={{background: '#ffffff', borderBottom: '1px solid #f0f0f0'}}>
                        <div className="travel-form-content">
                            <Card 
                                className="card-empty"
                                style={{
                                    textAlign: 'center',
                                    padding: '80px 40px',
                                    borderRadius: 16,
                                    border: '1px solid #054d2e',
                                    background: '#ffffff',
                                    boxShadow: '0 4px 16px rgba(5, 77, 46, 0.08)',
                                    width: '100%',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <div style={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto 32px',
                                    background: 'linear-gradient(135deg, #e8f4fd 0%, #d6eaff 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        fontSize: 64,
                                        color: '#1890ff',
                                        zIndex: 2
                                    }}>
                                        🌍
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        fontSize: 20,
                                        opacity: 0.6
                                    }}>
                                        📍
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '25px',
                                        left: '25px',
                                        fontSize: 16,
                                        opacity: 0.6
                                    }}>
                                        ✈️
                                    </div>
                                </div>
                                <Title level={2} style={{
                                    color: '#1f2937', 
                                    marginBottom: 16,
                                    fontWeight: 600
                                }}>
                                    开始您的旅行规划
                                </Title>
                                <Text style={{
                                    fontSize: 16, 
                                    color: '#6b7280',
                                    lineHeight: '1.6'
                                }}>
                                    请填写上方表单，我们将为您生成个性化的旅行方案
                                </Text>
                                <div style={{
                                    marginTop: 32,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        background: '#1890ff',
                                        animation: 'pulse 2s infinite'
                                    }} />
                                    <div style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        background: '#52c41a',
                                        animation: 'pulse 2s infinite 0.5s'
                                    }} />
                                    <div style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        background: '#1890ff',
                                        animation: 'pulse 2s infinite 1s'
                                    }} />
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelPlanPage;
