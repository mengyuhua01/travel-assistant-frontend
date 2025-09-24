import React, { useState } from 'react';
import { Button, Tag, Space, message } from 'antd';
import { FaChild, FaMapMarkerAlt, FaUtensils, FaHiking, FaExchangeAlt, FaSpinner, FaDollarSign, FaTree, FaLandmark, FaWalking, FaShoppingBag } from 'react-icons/fa';
import PlanComparison from './PlanComparison';
import './TagSelector.css';

const tagOptions = [
  { key: 'local', label: '本地化体验', icon: <FaMapMarkerAlt />, color: '#40a9ff' },
  { key: 'food', label: '美食探索', icon: <FaUtensils />, color: '#73d13d' },
  { key: 'nature', label: '自然观光', icon: <FaTree />, color: '#13c2c2' },
  { key: 'culture', label: '文化沉浸', icon: <FaLandmark />, color: '#9254de' },
  { key: 'citywalk', label: 'City Walk', icon: <FaWalking />, color: '#fa8c16' },
  { key: 'outdoor', label: '户外活动', icon: <FaHiking />, color: '#fadb14' },
  { key: 'shopping', label: '购物', icon: <FaShoppingBag />, color: '#eb2f96' },
  { key: 'family', label: '亲子内容', icon: <FaChild />, color: '#ff7875' },
  { key: 'economical', label: '更经济化', icon: <FaDollarSign />, color: '#52c41a' },
  { key: 'alternative', label: '替换景点', icon: <FaExchangeAlt />, color: '#b37feb' }
];

const TagSelector = ({ dayData, tripId, onRegenerateSuccess }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingProgress, setRegeneratingProgress] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [newData, setNewData] = useState(null);

  const MAX_TAG_SELECTION = 3; // 最大可选标签数

  const handleTagClick = (tagKey) => {
    setSelectedTags(prev => {
      const isSelected = prev.includes(tagKey);
      if (isSelected) {
        // 取消选择
        return prev.filter(key => key !== tagKey);
      }

      // 尝试新增选择，先判断是否超过上限
      if (prev.length >= MAX_TAG_SELECTION) {
        message.warning(`最多可选择 ${MAX_TAG_SELECTION} 个标签`);
        return prev; // 不变
      }

      return [...prev, tagKey];
    });
  };

  const handleRegenerate = async () => {
    if (selectedTags.length === 0) {
      message.warning('请至少选择一个标签');
      return;
    }

    setIsRegenerating(true);
    setRegeneratingProgress('正在准备重新生成...');
    // 保存原始数据用于对比
    setOriginalData({ ...dayData });

    try {
      // 使用修改后的重排服务
      const { regenerateDayAsync } = await import('../services/cozeReplanService');

      const selectedTagLabels = selectedTags.map(key => 
        tagOptions.find(option => option.key === key)?.label
      ).filter(Boolean);

      const updatedTrip = await regenerateDayAsync(
        tripId,
        dayData.day,
        selectedTagLabels,
        (progress) => {
          // 更新进度显示
          setRegeneratingProgress(progress);
        }
      );

      console.log('regenerateDayAsync 完成:', { updatedTrip });

      if (updatedTrip && updatedTrip.dailyPlan) {
        // 找到对应天数的新数据
        const updatedDayData = updatedTrip.dailyPlan.find(day => day.day === dayData.day);

        if (updatedDayData) {
          setNewData(updatedDayData);
          setShowComparison(true); // 显示对比弹窗
          setRegeneratingProgress('生成完成，请查看对比结果');
        } else {
          throw new Error('未找到对应天数的更新数据');
        }
      } else {
        console.error('未获取到更新后的行程数据:', { updatedTrip });
        throw new Error('未获取到更新后的行程数据');
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

  const handleComparisonConfirm = () => {
    if (newData && onRegenerateSuccess) {
      // 应用新方案
      onRegenerateSuccess(newData, null);
      message.success('新方案已应用！');
      setSelectedTags([]); // 清空选择
      setShowComparison(false);
      setOriginalData(null);
      setNewData(null);
    }
  };

  const handleComparisonCancel = () => {
    setShowComparison(false);
    setOriginalData(null);
    setNewData(null);
    message.info('已取消应用新方案');
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
        <div className="tag-hint" style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          {`最多可选择 ${MAX_TAG_SELECTION} 个标签，当前已选择 ${selectedTags.length} 个`}
        </div>
      </div>

      <div className="regenerate-section">
        <Button
          type="primary"
          onClick={handleRegenerate}
          disabled={selectedTags.length === 0 || isRegenerating}
          loading={isRegenerating}
          icon={isRegenerating ? <FaSpinner /> : null}
          className={`regenerate-button${selectedTags.length > 0 && !isRegenerating ? ' selected' : ''}`}
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

      <PlanComparison
        visible={showComparison}
        onCancel={handleComparisonCancel}
        onConfirm={handleComparisonConfirm}
        originalData={originalData}
        newData={newData}
        selectedTags={selectedTags.map(key =>
          tagOptions.find(option => option.key === key)?.label
        ).filter(Boolean)}
      />
    </div>
  );
};

export default TagSelector;
