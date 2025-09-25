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
    const [currentStatusMessage, setCurrentStatusMessage] = useState('');

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
        setCurrentStatusMessage('🤖 正在向AI发起旅行规划请求...');

        // 状态消息数组 - 重新调整进度分布，前面更快，后面更平缓
        const statusMessages = [
            { progress: 18, message: '正在向AI发起旅行规划请求...', emoji: '🤖' },
            { progress: 30, message: 'AI正在分析您的需求...', emoji: '🧠' },
            { progress: 42, message: '正在搜索目的地信息...', emoji: '🗺️' },
            { progress: 54, message: '正在匹配合适的住宿...', emoji: '🏨' },
            { progress: 66, message: '正在规划行程路线...', emoji: '🎯' },
            { progress: 75, message: '正在优化旅行建议...', emoji: '💡' },
            { progress: 80, message: 'AI正在深度思考中...', emoji: '⚡' },
            { progress: 84, message: '正在完善方案细节...', emoji: '🔍' },
        ];

        let currentMessageIndex = 0;
        let progressUpdater = null;

        // 创建自动进度推进器 - 前期快速，后期平缓
        const createProgressUpdater = (maxProgress = 85) => {
            return setInterval(() => {
                setProgress(prev => {
                    // 如果还有预设消息未显示
                    if (currentMessageIndex < statusMessages.length) {
                        const currentStatus = statusMessages[currentMessageIndex];

                        // 检查是否应该显示下一个状态消息
                        if (prev >= currentStatus.progress - 2) { // 提前2%开始显示消息
                            message.info(currentStatus.message);
                            setCurrentStatusMessage(currentStatus.message);
                            currentMessageIndex++;
                        }
                    }

                    // 动态增长逻辑 - 前期快，后期慢
                    if (prev < maxProgress) {
                        let increment;
                        if (prev < 30) {
                            increment = 2.0; // 0-30%: 快速增长
                        } else if (prev < 60) {
                            increment = 1.5; // 30-60%: 中等增长
                        } else if (prev < 75) {
                            increment = 0.8; // 60-75%: 较慢增长
                        } else {
                            increment = 0.4; // 75-85%: 缓慢增长
                        }
                        return Math.min(prev + increment, maxProgress);
                    }

                    return prev;
                });
            }, 1000); // 每1秒更新一次，更频繁的更新
        };

        try {
            // 第1步：发起对话请求（占0%-10%）
            setProgress(5);
            message.info('🤖 正在向AI发起旅行规划请求...');

            const chatResponse = await generateTravelPlan(travelData);

            const conversationId = chatResponse.conversation_id;
            const chatId = chatResponse.id;

            setProgress(10);

            // 第2步：轮询对话状态（占10%-85%，主要时间）
            message.info('⏳ AI正在深度思考中，请稍候...');
            setCurrentStatusMessage('⏳ AI正在深度思考中，请稍候...');

            // 启动进度更新器
            progressUpdater = createProgressUpdater(85);

            // 开始轮询，同时进度条会自动更新
            await pollChatStatus(conversationId, chatId);

            // 清除进度更新器
            if (progressUpdater) {
                clearInterval(progressUpdater);
            }

            // 第3步：获取完整的消息列表（占85%-95%）
            // 平滑增长到90%
            setCurrentStatusMessage('📄 正在获取AI生成的完整方案...');
            message.info('📄 正在获取AI生成的完整方案...');

            const step3Progress = setInterval(() => {
                setProgress(prev => {
                    if (prev < 90) {
                        return Math.min(prev + 0.8, 90);
                    }
                    clearInterval(step3Progress);
                    return prev;
                });
            }, 200);

            const messageList = await getChatMessageList(conversationId, chatId);
            clearInterval(step3Progress);

            // 第4步：解析AI回复并生成前端显示的方案（占90%-100%）
            setCurrentStatusMessage('🎨 正在生成方案预览...');

            const step4Progress = setInterval(() => {
                setProgress(prev => {
                    if (prev < 100) {
                        return Math.min(prev + 0.5, 100);
                    }
                    clearInterval(step4Progress);
                    return prev;
                });
            }, 150);

            const aiGeneratedPlans = await parseAIResponseToPlans(messageList);

            // 将新方案添加到现有方案列表中（累加，不替换）
            const updatedPlans = [...plans, ...aiGeneratedPlans];
            setPlans(updatedPlans);

            // 保存所有方案到缓存（包含新旧方案）
            savePlansToCache(updatedPlans, travelData);

            // 确保进度到达100%
            clearInterval(step4Progress);
            setProgress(100);
            setCurrentStatusMessage('✅ 生成个性化方案完成！');

            // 延迟显示成功消息，让进度条完成动画
            setTimeout(() => {
                message.success('🎉 AI旅行方案生成成功！');
            }, 500);

        } catch (error) {
            // 清除进度更新器
            if (progressUpdater) {
                clearInterval(progressUpdater);
            }

            message.error(`生成失败：${error.message}`);
            setCurrentStatusMessage('生成未成功，您可以稍后再试');

        } finally {
            setIsGenerating(false);
            // 延迟重置进度和状态消息，让用户看到完成状态
            setTimeout(() => {
                setProgress(0);
                setCurrentStatusMessage('');
            }, 1000);
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
                    duration: `${aiContent.duration || 3}天`, // 前端显示时添加"天"字
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
                    duration: `${aiContent.duration || 3}天`, // 前端显示时添加"天"字
                    budget: `¥${aiContent.totalBudget || 2000}`,
                    description: aiContent.overview || '为您定制的专属旅行方案',
                    image: '🤖',
                    type: 'ai-generated',
                    dailyPlan: aiContent.dailyPlan || []
                }
            ];
        }
    };


    // 处理表单提交 - 这是生成方案按钮的点击事件
    const handleFormSubmit = (values) => {
        generateAITravelPlans(values);
    };

    // 跳转到方案详情
    const handleViewPlan = (planId) => {
        // 直接使用数据库返回的ID进行跳转，传递来源信息
        navigate(`/trip/${planId}`, { state: { from: 'plan' } });
    };

    // 获取方案类型对应的颜色
    const getTypeColor = (type) => {
        const colors = {
            cultural: 'blue',
            leisure: 'green',
            adventure: 'orange',
            'ai-generated': '#EBADE',
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
                                    <div style={{marginBottom: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <img
                                            src="/robot.svg"
                                            alt="AI机器人"
                                            style={{
                                                width: 48,
                                                height: 48,
                                                objectFit: 'contain'
                                            }}
                                            onError={(e) => {
                                                // 如果图片加载失败，显示默认emoji
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        {/* 备用emoji，图片加载失败时显示 */}
                                        <div style={{
                                            fontSize: 48,
                                            display: 'none'
                                        }}>
                                            🤖
                                        </div>
                                    </div>
                                    <Title level={2} style={{marginBottom: 24, color: '#8c8c8c'}}>
                                        AI正在为您生成专属旅行方案
                                    </Title>
                                    <Progress
                                        percent={progress}
                                        status="active"
                                        strokeColor={{
                                            from: '#2A6F6B',
                                            to: '#2A6F6B',
                                        }}
                                        strokeWidth={8}
                                        style={{marginBottom: 20}}
                                        showInfo={false}
                                    />
                                    <Text type="secondary" style={{fontSize: 16}}>
                                        {currentStatusMessage || '🤖 正在准备生成方案...'}
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
                                    为您推荐以下旅行方案
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
                                                    className="plan-detail-button"
                                                    key="view"
                                                >
                                                    查看详情
                                                </Button>
                                            ]}
                                        >
                                            {/* 标题区域 - 固定高度 */}
                                            <div style={{textAlign: 'center', marginBottom: 20, height: 140}}>
                                                <div style={{fontSize: 56, marginBottom: 12, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    {plan.type === 'ai-generated' ? (
                                                        <img
                                                            src="/robot.svg"
                                                            alt="AI机器人"
                                                            style={{
                                                                width: 56,
                                                                height: 56,
                                                                objectFit: 'contain'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'block';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{fontSize: 56}}>
                                                            {plan.image}
                                                        </div>
                                                    )}
                                                    {/* 备用emoji，图片加载失败时显示 */}
                                                    {plan.type === 'ai-generated' && (
                                                        <div style={{
                                                            fontSize: 56,
                                                            display: 'none'
                                                        }}>
                                                            🤖
                                                        </div>
                                                    )}
                                                </div>
                                                <Title level={3} style={{marginBottom: 8, color: '#1f1f1f', fontSize: 16, lineHeight: '24px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <span style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textAlign: 'center'
                                                    }}>
                                                        {plan.title}
                                                    </span>
                                                </Title>
                                                <Tag color={getTypeColor(plan.type)}
                                                     style={{
                                                        fontSize: 12,
                                                        padding: '4px 12px',
                                                        borderRadius: 16,
                                                        color: plan.type === 'ai-generated' ? '#000000' : undefined
                                                     }}>
                                                    {plan.type === 'ai-generated' && '✨ AI定制'}
                                                    {plan.type === 'cultural' && '🏛️ 文化旅游'}
                                                    {plan.type === 'leisure' && '🏖️ 休闲度假'}
                                                    {plan.type === 'adventure' && '🏔️ 户外探险'}
                                                    {plan.type === 'classic' && '🌟 经典路线'}
                                                </Tag>
                                            </div>

                                            <Divider style={{margin: '20px 0'}}/>

                                            {/* 人数预算天数区域 - 减少高度 */}
                                            <div style={{height: 70}}>
                                                <Space direction="vertical" style={{width: '100%'}} size="small">
                                                    <Space size="small">
                                                        <ClockCircleOutlined style={{color: '#1890ff'}}/>
                                                        <Text strong style={{fontSize: 14}}>{plan.duration}</Text>
                                                    </Space>
                                                    <Space size="small">
                                                        <DollarOutlined style={{color: '#52c41a'}}/>
                                                        <Text strong style={{fontSize: 14}}>{plan.budget}</Text>
                                                    </Space>
                                                    <Space size="small">
                                                        <UserOutlined style={{color: '#fa541c'}}/>
                                                        <Text style={{fontSize: 14}}>适合{formData?.peopleCount || 2}人出行</Text>
                                                    </Space>
                                                </Space>
                                            </div>

                                            <Divider style={{margin: '20px 0'}}/>

                                            {/* 方案预览区域 - 增加高度 */}
                                            <div style={{
                                                background: '#ffffff',
                                                borderRadius: 12,
                                                padding: '20px',
                                                border: '1px solid #054d2e',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(5, 77, 46, 0.05)',
                                                height: 180,
                                                marginBottom: 20
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

                                                <div style={{position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column'}}>
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
                                                            color: '#000000',
                                                            fontSize: 16
                                                        }}>
                                                            方案预览
                                                        </Text>
                                                    </div>
                                                    <div style={{flex: 1, overflow: 'hidden'}}>
                                                        <Text style={{
                                                            fontSize: 15,
                                                            lineHeight: '1.6',
                                                            color: '#000000',
                                                            fontWeight: 400,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 4,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {plan.description}
                                                        </Text>
                                                    </div>
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
                                    margin: '0 auto 32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {/* 主要图片 - 使用travel.png */}
                                    <img
                                        src="/travel.png"
                                        alt="旅行规划"
                                        style={{
                                            width: 120,
                                            height: 120,
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))'
                                        }}
                                        onError={(e) => {
                                            // 如果图片加载失败，显示默认emoji
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    {/* 备用emoji，图片加载失败时显示 */}
                                    <div style={{
                                        fontSize: 120,
                                        color: '#1890ff',
                                        display: 'none'
                                    }}>
                                        🌍
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
