import React, { useState, useEffect } from 'react';
import { Button, Spin, Input, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import TripDetailsPage from '../pages/TripDetailsPage';

const { TextArea } = Input;

const TripLoader = () => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('请生成一个3天2晚的苏州旅游行程，预算2000元，包含园林游览和本地美食体验');
  const [progress, setProgress] = useState('');

  const loadTripFromCoze = async () => {
    if (!prompt.trim()) {
      message.warning('请输入行程需求');
      return;
    }

    setLoading(true);
    setProgress('正在向 Coze 请求生成行程...');
    setTripData(null);

    try {
      // 动态导入 cozeService
      const { fetchFullTrip } = await import('../services/cozeReplanService');
      
      const result = await fetchFullTrip(prompt, (progressText) => {
        setProgress(progressText);
      });

      setTripData(result);
      message.success('行程生成成功！');
      setProgress('');
    } catch (error) {
      console.error('加载行程失败:', error);
      message.error(`加载行程失败: ${error.message}`);
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  // 如果有行程数据，显示详情页面
  if (tripData) {
    return (
      <div>
        <div style={{ padding: '20px', background: '#f5f5f5', marginBottom: '20px' }}>
          <Button onClick={() => setTripData(null)} type="default" style={{ marginRight: '10px' }}>
            重新生成行程
          </Button>
          <span style={{ color: '#666' }}>当前行程：{tripData.title}</span>
        </div>
        <TripDetailsPage tripData={tripData} />
      </div>
    );
  }

  // 否则显示加载界面
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>AI 旅行助手</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          描述您的旅行需求：
        </label>
        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例如：请生成一个3天2晚的苏州旅游行程，预算2000元，包含园林游览和本地美食体验"
          rows={4}
          disabled={loading}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button
          type="primary"
          size="large"
          onClick={loadTripFromCoze}
          loading={loading}
          disabled={loading || !prompt.trim()}
        >
          {loading ? '生成中...' : '生成旅行行程'}
        </Button>
      </div>

      {loading && (
        <div style={{ 
          background: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
            <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>正在生成行程...</span>
          </div>
          <div style={{ 
            background: '#fff', 
            padding: '10px', 
            borderRadius: '4px',
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            maxHeight: '150px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {progress || '准备中...'}
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
        <h3>使用说明：</h3>
        <ul>
          <li>在上方输入框中描述您的旅行需求（目的地、天数、预算、偏好等）</li>
          <li>点击"生成旅行行程"按钮，AI 将为您定制专属的旅行计划</li>
          <li>生成后可以在每一天的行程中选择标签进行个性化调整</li>
          <li>支持实时流式显示或一次性完整结果</li>
        </ul>
      </div>
    </div>
  );
};

export default TripLoader;
