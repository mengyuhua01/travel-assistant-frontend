import React, { useState } from 'react';
import { Button, Tag, Space, message } from 'antd';
import { FaChild, FaMapMarkerAlt, FaUtensils, FaHiking, FaExchangeAlt, FaSpinner, FaDollarSign } from 'react-icons/fa';
import './TagSelector.css';

const tagOptions = [
  { key: 'family', label: '亲子内容', icon: <FaChild />, color: '#ff7875' },
  { key: 'local', label: '本地化体验', icon: <FaMapMarkerAlt />, color: '#40a9ff' },
  { key: 'food', label: '美食探索', icon: <FaUtensils />, color: '#73d13d' },
  { key: 'outdoor', label: '户外活动', icon: <FaHiking />, color: '#fadb14' },
  { key: 'alternative', label: '替换景点', icon: <FaExchangeAlt />, color: '#b37feb' },
  { key: 'economical', label: '更经济化', icon: <FaDollarSign />, color: '#52c41a' }
];

const TagSelector = ({ dayData, originalTrip, onRegenerateSuccess }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingProgress, setRegeneratingProgress] = useState('');

  const handleTagClick = (tagKey) => {
    setSelectedTags(prev => 
      prev.includes(tagKey) 
        ? prev.filter(key => key !== tagKey)
        : [...prev, tagKey]
    );
  };

  const handleRegenerate = async () => {
    if (selectedTags.length === 0) {
      message.warning('请至少选择一个标签');
      return;
    }

    setIsRegenerating(true);
    setRegeneratingProgress('正在准备重新生成...');

    try {
      // 动态导入 cozeService 并使用异步接口
      const { regenerateDayAsync } = await import('../services/cozeReplanService');

      const selectedTagLabels = selectedTags.map(key => 
        tagOptions.find(option => option.key === key)?.label
      ).filter(Boolean);

      const updatedTrip = await regenerateDayAsync(
        originalTrip,
        dayData.day,
        selectedTagLabels,
        (progress) => {
          // 更新进度显示
          setRegeneratingProgress(progress);
        }
      );

      // 找到更新后的当天数据并回调父组件以重新渲染
      const updatedDayData = updatedTrip.dailyPlan?.find(day => day.day === dayData.day);

      console.log('regenerateDayAsync 完成:', { updatedTrip, updatedDayData });

      if (updatedDayData && onRegenerateSuccess) {
        console.log('调用 onRegenerateSuccess');
        onRegenerateSuccess(updatedDayData, updatedTrip);
        message.success('行程重新生成成功！');
        setSelectedTags([]); // 清空选择
        setRegeneratingProgress('重新生成完成！');
      } else {
        console.error('未找到更新后的当天数据:', { updatedTrip, dayData: dayData.day });
        throw new Error('未找到更新后的当天数据');
      }

    } catch (error) {
      console.error('重新生成失败:', error);
      message.error(`重新生成失败: ${error.message}`);
      setRegeneratingProgress(`失败: ${error.message}`);
    } finally {
      setIsRegenerating(false);
      // 3秒后清空进度信息
      setTimeout(() => {
        setRegeneratingProgress('');
      }, 3000);
    }
  };

  return (
    <div className="tag-selector">
      <div className="tag-section">
        <h4 className="tag-title">选择优化方向：</h4>
        <Space wrap>
          {tagOptions.map(option => (
            <Tag
              key={option.key}
              color={selectedTags.includes(option.key) ? option.color : 'default'}
              onClick={() => handleTagClick(option.key)}
              className={`tag-option ${selectedTags.includes(option.key) ? 'selected' : ''}`}
              style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '14px' }}
            >
              <span style={{ marginRight: '5px' }}>{option.icon}</span>
              {option.label}
            </Tag>
          ))}
        </Space>
      </div>

      <div className="regenerate-section">
        <Button
          type="primary"
          onClick={handleRegenerate}
          disabled={selectedTags.length === 0 || isRegenerating}
          loading={isRegenerating}
          icon={isRegenerating ? <FaSpinner /> : null}
          className="regenerate-button"
        >
          {isRegenerating ? '重新生成中...' : '重新生成该天行程'}
        </Button>
      </div>

      { (isRegenerating || regeneratingProgress) && (
        <div className="progress-section">
          <div className="progress-text">
            {regeneratingProgress}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
