import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../apis/user';

const { Title, Text } = Typography;

function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    
    console.log('开始登录，用户名/邮箱:', values.usernameOrEmail);
    
    try {
      console.log('发送登录请求到后端...');
      const response = await loginUser({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password
      });
      
      console.log('登录响应:', response);
      
      // 检查响应是否包含必要字段
      if (!response || !response.token) {
        throw new Error('登录响应格式错误：缺少token');
      }
      
      // 使用Auth上下文的login方法，包含token
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        token: response.token
      };
      
      console.log('准备保存用户数据:', userData);
      login(userData);
      
      console.log('登录成功，准备跳转到首页');
      // 成功后跳转到首页
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // 处理特定错误信息 - 优先检查后端返回的具体错误信息
      const errorMessage = error.response?.data?.message || error.message || '';
      
      if (errorMessage.includes('用户不存在') || errorMessage.includes('UserNotFoundException')) {
        setError('用户不存在，请检查用户名/邮箱或先注册账号');
      } else if (errorMessage.includes('账号或密码错误') || errorMessage.includes('PasswordErrorException')) {
        setError('账号或密码错误');
      } else if (error.response?.status === 401) {
        // 401状态码但没有具体错误信息时，显示通用认证失败信息
        setError('用户名/邮箱或密码错误');
      } else if (error.response?.status === 500) {
        setError('服务器错误，请稍后重试');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setError('网络连接失败，请检查后端服务是否启动');
      } else {
        setError(`登录失败：${errorMessage || '请稍后重试'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      background: '#EAF4EB',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>


      <div className="w-full max-w-md" style={{ 
        position: 'relative', 
        zIndex: 1,
        animation: 'slideInUp 0.8s ease-out'
      }}>
        <Card 
          className="border-0 rounded-3xl"
          style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb'
          }}
        >
          <div className="text-center mb-8" style={{ animation: 'fadeIn 1s ease-out 0.3s both' }}>
            <div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ 
                background: '#2A6F6B',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            >
              <span className="text-3xl">✈️</span>
            </div>
            <Title level={1} style={{ 
              color: '#2A6F6B', 
              marginBottom: '16px',
              fontWeight: '700',
              fontSize: '2.5rem'
            }}>
              欢迎回来
            </Title>
            <Text style={{ 
              color: '#6b7280',
              fontSize: '16px',
              display: 'block',
              lineHeight: '1.5'
            }}>
              登录您的智能旅行助手账户
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6 rounded-xl"
              style={{
                borderRadius: '12px',
                border: '1px solid #fecaca',
                animation: 'slideInUp 0.3s ease-out'
              }}
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
            style={{ animation: 'fadeIn 1s ease-out 0.5s both' }}
          >
            <Form.Item
              name="usernameOrEmail"
              label={<span style={{ color: '#374151', fontWeight: '600' }}>用户名或邮箱</span>}
              rules={[
                { required: true, message: '请输入用户名或邮箱' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#2A6F6B' }} />}
                placeholder="请输入用户名或邮箱"
                style={{ 
                  padding: '14px 16px', 
                  height: 'auto',
                  borderColor: '#d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.8)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2A6F6B';
                  e.target.style.boxShadow = '0 0 0 4px rgba(42, 111, 107, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ color: '#374151', fontWeight: '600' }}>密码</span>}
              rules={[
                { required: true, message: '请输入密码' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#2A6F6B' }} />}
                placeholder="请输入密码"
                style={{ 
                  padding: '14px 16px', 
                  height: 'auto',
                  borderColor: '#d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.8)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2A6F6B';
                  e.target.style.boxShadow = '0 0 0 4px rgba(42, 111, 107, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  height: '56px',
                  background: loading ? '#6b7280' : '#2A6F6B',
                  border: '0',
                  borderRadius: '14px',
                  fontWeight: '600',
                  fontSize: '16px',
                  boxShadow: '0 8px 25px rgba(42, 111, 107, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = '#1f5f5b';
                    e.target.style.boxShadow = '0 12px 35px rgba(42, 111, 107, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = '#2A6F6B';
                    e.target.style.boxShadow = '0 8px 25px rgba(42, 111, 107, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {!loading && <LoginOutlined style={{ fontSize: '16px' }} />}
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ 
            color: '#9ca3af', 
            margin: '32px 0',
            animation: 'fadeIn 1s ease-out 0.7s both'
          }}>
            或
          </Divider>

          <div style={{ 
            textAlign: 'center',
            animation: 'fadeIn 1s ease-out 0.9s both'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ color: '#6b7280', fontSize: '15px' }}>还没有账户？</Text>
              <Link 
                to="/register" 
                style={{ 
                  color: '#2A6F6B',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  marginLeft: '8px',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#1f5f5b';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#2A6F6B';
                  e.target.style.textDecoration = 'none';
                }}
              >
                立即注册
              </Link>
            </div>
            <Link to="/">
              <Button 
                type="link" 
                style={{ 
                  color: '#9ca3af',
                  padding: '4px 0',
                  height: 'auto',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#2A6F6B';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#9ca3af';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ← 返回首页
              </Button>
            </Link>
          </div>
        </Card>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px',
          animation: 'fadeIn 1s ease-out 1.1s both'
        }}>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '14px',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            Togother ©2025 为您的每一次出行提供贴心服务
          </Text>
        </div>
      </div>
    </div>
  );
}

export default Login;