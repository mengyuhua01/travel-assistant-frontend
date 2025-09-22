import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import ApiService from '../services/api';

const { Title, Text } = Typography;

function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await ApiService.login({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password
      });
      
      // 存储用户数据和认证状态
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // 成功后跳转到首页
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // 处理特定错误信息
      if (error.message.includes('用户不存在') || error.message.includes('UserNotFoundException')) {
        setError('用户不存在，请检查用户名/邮箱或先注册账号');
      } else if (error.message.includes('账号或密码错误') || error.message.includes('PasswordErrorException')) {
        setError('用户名/邮箱或密码错误');
      } else {
        setError('登录失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)' 
    }}>
      <div className="w-full max-w-md">
        <Card 
          className="shadow-2xl border-0 rounded-2xl"
          style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' 
          }}
        >
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}
            >
              <span className="text-2xl">✈️</span>
            </div>
            <Title level={2} className="text-gray-800 mb-2">
              欢迎回来
            </Title>
            <Text className="text-gray-600">
              登录您的智能旅行助手账户
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6 rounded-lg"
              closable
              onClose={() => setError('')}
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            size="large"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="usernameOrEmail"
              label={<span className="text-gray-700 font-medium">用户名或邮箱</span>}
              rules={[
                { required: true, message: '请输入用户名或邮箱' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="请输入用户名或邮箱"
                className="rounded-lg border-gray-200"
                style={{ 
                  padding: '12px 16px', 
                  height: 'auto',
                  borderColor: '#e5e7eb'
                }}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 font-medium">密码</span>}
              rules={[
                { required: true, message: '请输入密码' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码"
                className="rounded-lg border-gray-200"
                style={{ 
                  padding: '12px 16px', 
                  height: 'auto',
                  borderColor: '#e5e7eb'
                }}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                block
                size="large"
                style={{
                  height: '48px',
                  background: 'linear-gradient(135deg, #22c55e, #10b981)',
                  border: '0',
                  borderRadius: '8px',
                  fontWeight: '500',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #16a34a, #059669)';
                  e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #22c55e, #10b981)';
                  e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
                }}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="text-gray-400">或</Divider>

          <div className="text-center space-y-4">
            <div>
              <Text className="text-gray-600">还没有账户？</Text>
              <Link 
                to="/register" 
                className="ml-2 font-medium"
                style={{ 
                  color: '#22c55e',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#16a34a'}
                onMouseLeave={(e) => e.target.style.color = '#22c55e'}
              >
                立即注册
              </Link>
            </div>
            <Button 
              type="link" 
              className="text-gray-500 p-0"
              style={{ color: '#6b7280' }}
              onClick={() => alert('忘记密码功能即将推出')}
              onMouseEnter={(e) => e.target.style.color = '#22c55e'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              忘记密码？
            </Button>
          </div>
        </Card>

        <div className="text-center mt-8">
          <Text className="text-gray-500 text-sm">
            © 2024 智能旅行助手. 为您的每一次出行提供贴心服务
          </Text>
        </div>
      </div>
    </div>
  );
}

export default Login;