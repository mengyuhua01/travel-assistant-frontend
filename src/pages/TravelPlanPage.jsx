import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Card, Col, Divider, message, Progress, Row, Space, Tag, Typography} from 'antd';
import {ClockCircleOutlined, DollarOutlined, EyeOutlined, UserOutlined} from '@ant-design/icons';
import TravelForm from '../components/TravelForm';
import {generateTravelPlan, getChatMessageList, getChatStatus} from '../apis/cozeApi';
import {insertTravelPlan} from '../apis/travelPlanApi';
import './TravelPlanPage.css';

const {Title, Text} = Typography;

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

    // SessionStorage键名
    const STORAGE_KEY = 'travel_plans_session';

    // 保存方案到SessionStorage
    const savePlansToCache = (plansData, formValues) => {
        try {
            const cacheData = {
                plans: plansData,
                formData: formValues
            };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('保存方案缓存失败:', error);
        }
    };

    // 从SessionStorage加载方案
    const loadPlansFromCache = () => {
        try {
            const cached = sessionStorage.getItem(STORAGE_KEY);
            if (!cached) return null;
            return JSON.parse(cached);
        } catch (error) {
            console.error('加载方案缓存失败:', error);
            return null;
        }
    };

    // 清除方案缓存
    const clearPlansCache = () => {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('清除方案缓存失败:', error);
        }
    };

    // 组件加载时恢复缓存的方案
    useEffect(() => {
        const cached = loadPlansFromCache();
        if (cached && cached.plans && cached.plans.length > 0) {
            setPlans(cached.plans);
            setFormData(cached.formData);
            message.info(`已恢复 ${cached.plans.length} 个旅行方案`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 完整的AI方案生成流程
     * 包含：发起对话 -> 轮询状态 -> 获取消息详情
     */
    const generateAITravelPlans = async (travelData) => {
        setFormData(travelData);
        setIsGenerating(true);
        setProgress(0);
     

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

            // 将新方案添加到现有方案列表中（累加，不替换）
            const updatedPlans = [...plans, ...aiGeneratedPlans];
            setPlans(updatedPlans);
            
            // 保存所有方案到缓存（包含新旧方案）
            savePlansToCache(updatedPlans, travelData);
            
            message.success('🎉 AI旅行方案生成成功！');

        } catch (error) {
            message.error(`生成失败：${error.message}`);

            // 发生错误时显示备用方案
            const fallbackPlans = generateFallbackPlans(travelData);
            const updatedPlans = [...plans, ...fallbackPlans];
            setPlans(updatedPlans);
            
            // 保存包含备用方案的所有方案到缓存
            savePlansToCache(updatedPlans, travelData);
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
            const insertResult = await insertTravelPlan(aiContent);
            const planId = insertResult.data?.id || insertResult.id;
            return [
                {
                    id: planId, // 使用数据库返回的真实ID
                    title: aiContent.title || '定制旅行方案',
                    duration: aiContent.duration || '3天',
                    budget: `¥${aiContent.totalBudget || 2000}`,
                    description: aiContent.overview || '为您定制的专属旅行方案',
                    image: '🤖',
                    type: 'ai-generated',
                    dailyPlan: aiContent.dailyPlan || []
                }
            ];
        } catch (error) {
            console.error('插入旅行方案到数据库失败:', error);
            return [
                {
                    id: 'ai-generated-temp-' + Date.now(),
                    title: aiContent.title || '定制旅行方案',
                    duration: aiContent.duration || '3天',
                    budget: `¥${aiContent.totalBudget || 2000}`,
                    description: aiContent.overview || '为您定制的专属旅行方案',
                    image: '🤖',
                    type: 'ai-generated',
                    dailyPlan: aiContent.dailyPlan || []
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
                description: `为您精心规划的${travelData.destination}${travelData.travelDays}日游，包含热门景点和特色体验，让您深度感受当地文化魅力与自然风光。`,
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
                                <div style={{marginTop: 16}}>
                                    <Button 
                                        type="link" 
                                        onClick={() => {
                                            const planCount = plans.length;
                                            clearPlansCache();
                                            setPlans([]);
                                            setFormData(null);
                                            message.success(`已清除 ${planCount} 个方案`);
                                        }}
                                        style={{color: '#8c8c8c', fontSize: 14}}
                                    >
                                        🗑️ 清除所有方案
                                    </Button>
                                </div>
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
                                            <Tag color={getTypeColor(plan.type)}
                                                 style={{fontSize: 12, padding: '4px 12px', borderRadius: 16}}>
                                                {plan.type === 'ai-generated' && '✨ AI定制'}
                                                {plan.type === 'cultural' && '🏛️ 文化旅游'}
                                                {plan.type === 'leisure' && '🏖️ 休闲度假'}
                                                {plan.type === 'adventure' && '🏔️ 户外探险'}
                                                {plan.type === 'classic' && '🌟 经典路线'}
                                            </Tag>
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

                                        <div style={{
                                            background: 'linear-gradient(135deg, #f8fffe 0%, #f0faf9 100%)',
                                            borderRadius: 12,
                                            padding: '20px',
                                            border: '1px solid #054d2e',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(5, 77, 46, 0.05)'
                                        }}>
                                            {/* 优雅的装饰线条 */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '80px',
                                                height: '2px',
                                                background: 'linear-gradient(90deg, transparent, rgba(5, 77, 46, 0.2))',
                                                zIndex: 0
                                            }} />
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '60px',
                                                height: '2px',
                                                background: 'linear-gradient(90deg, rgba(5, 77, 46, 0.15), transparent)',
                                                zIndex: 0
                                            }} />
                                            
                                            <div style={{position: 'relative', zIndex: 1}}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: 12
                                                }}>
                                                    <div style={{
                                                        fontSize: 18,
                                                        marginRight: 8
                                                    }}>
                                                        📖
                                                    </div>
                                                    <Text strong style={{
                                                        color: '#054d2e',
                                                        fontSize: 16
                                                    }}>
                                                        方案预览
                                                    </Text>
                                                </div>
                                                <Text style={{
                                                    fontSize: 15,
                                                    lineHeight: '1.6',
                                                    color: '#434343',
                                                    fontWeight: 400,
                                                    display: 'block'
                                                }}>
                                                    {plan.description}
                                                </Text>
                                            </div>
                                        </div>
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
