import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TripDetailsPage from '../pages/TripDetailsPage';

// 开发用组件：模拟路由参数
export default function TripDetailsDev() {
  // 使用硬编码的 tripId 进行开发测试
  const mockTripId = '1'; // 请替换为真实的数据库中的 tripId
  
  return (
    <div>
      <div style={{ 
        background: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        padding: '10px', 
        margin: '10px 0',
        borderRadius: '4px'
      }}>
        <strong>开发模式</strong>: 当前使用 tripId = {mockTripId}
        <br />
        <small>请确保数据库中存在此ID的行程数据，或修改 tripId 为有效值</small>
        <br />
        <small>访问路径: /dev-trip (模拟 /trip/{mockTripId})</small>
      </div>
      
      {/* 创建一个独立的路由上下文来模拟 /trip/:id */}
      <Router>
        <Routes>
          <Route 
            path="*" 
            element={<MockTripDetailsWrapper tripId={mockTripId} />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

// 包装组件来模拟路由参数
function MockTripDetailsWrapper({ tripId }) {
  // 模拟 useParams 和 useNavigate
  const mockUseParams = () => ({ id: tripId });
  const mockUseNavigate = () => (path) => {
    console.log('导航到:', path);
    alert(`模拟导航到: ${path}`);
  };

  // 临时替换 React Router hooks
  React.useLayoutEffect(() => {
    const originalParams = require('react-router-dom').useParams;
    const originalNavigate = require('react-router-dom').useNavigate;
    
    // 这里仅作为开发提示，实际的 hook 替换需要在组件层面处理
    console.log('开发提示: 正在模拟路由参数 id =', tripId);
  }, [tripId]);

  return <TripDetailsPage />;
}
