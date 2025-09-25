import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Radio, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import { registerUser } from '../apis/user';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationMode, setRegistrationMode] = useState('username');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleModeChange = (e) => {
    setRegistrationMode(e.target.value);
    setError('');
    setSuccess('');
    // 清空对应字段
    if (e.target.value === 'username') {
      form.setFieldsValue({ email: '' });
    } else {
      form.setFieldsValue({ username: '' });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 根据注册模式准备数据
      const registerData = {
        password: values.password
      };

      if (registrationMode === 'username') {
        registerData.username = values.username;
        registerData.email = null;
      } else {
        registerData.email = values.email;
        registerData.username = null;
      }

      const response = await registerUser(registerData);
      
      // 显示注册成功提示
      setSuccess('注册成功！');
      
      // 使用返回的用户数据直接登录
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        token: response.token
      };
      
      // 调用AuthContext的login方法
      await login(userData);
      
      // 确保token已保存后再跳转
      setTimeout(() => {
        navigate('/interests');
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // 处理特定错误信息 - 优先检查后端返回的具体错误信息
      const errorMessage = error.response?.data?.message || error.message || '';
      
      if (errorMessage.includes('用户名已存在') || errorMessage.includes('UsernameExistsException')) {
        setError('用户名已存在，请选择其他用户名');
      } else if (errorMessage.includes('邮箱已存在') || errorMessage.includes('EmailExistsException')) {
        setError('邮箱已被注册，请使用其他邮箱');
      } else if (errorMessage.includes('密码不能为空')) {
        setError('密码不能为空');
      } else if (errorMessage.includes('注册必须提供用户名或邮箱之一')) {
        setError('用户名或邮箱为必填项');
      } else if (error.response?.status === 409) {
        // 409状态码表示冲突，通常是用户名或邮箱已存在
        setError('用户名或邮箱已存在，请选择其他信息');
      } else if (error.response?.status === 400) {
        // 400状态码表示请求参数错误
        setError(`请求参数错误：${errorMessage || '请检查输入信息'}`);
      } else {
        setError(`注册失败：${errorMessage || '请稍后重试'}`);
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
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)'
              }}
            >
              <span className="text-3xl">🌟</span>
            </div>
            <Title level={1} style={{ 
              color: '#2A6F6B', 
              marginBottom: '16px',
              fontWeight: '700',
              fontSize: '2.5rem'
            }}>
              创建账户
            </Title>
            <Text style={{ 
              color: '#6b7280',
              fontSize: '16px',
              display: 'block',
              lineHeight: '1.5'
            }}>
              加入智能旅行助手，开启美好旅程
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

          {success && (
            <Alert
              message={success}
              type="success"
              showIcon
              className="mb-6 rounded-xl"
              style={{
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                background: '#f0fdf4',
                animation: 'slideInUp 0.3s ease-out'
              }}
            />
          )}

          <div className="mb-6" style={{ animation: 'fadeIn 1s ease-out 0.5s both' }}>
            <Text style={{ 
              color: '#374151', 
              fontWeight: '600', 
              display: 'block', 
              marginBottom: '12px' 
            }}>
              注册方式
            </Text>
            <Radio.Group 
              value={registrationMode} 
              onChange={handleModeChange}
              className="w-full"
              style={{
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '8px'
              }}
            >
              <Radio.Button 
                value="username" 
                style={{ 
                  height: '48px', 
                  lineHeight: '46px',
                  borderRadius: '12px',
                  borderColor: registrationMode === 'username' ? '#2A6F6B' : '#d1d5db',
                  background: registrationMode === 'username' ? 'rgba(42, 111, 107, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  color: registrationMode === 'username' ? '#2A6F6B' : '#6b7280',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                用户名注册
              </Radio.Button>
              <Radio.Button 
                value="email"
                style={{ 
                  height: '48px', 
                  lineHeight: '46px',
                  borderRadius: '12px',
                  borderColor: registrationMode === 'email' ? '#2A6F6B' : '#d1d5db',
                  background: registrationMode === 'email' ? 'rgba(42, 111, 107, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  color: registrationMode === 'email' ? '#2A6F6B' : '#6b7280',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                邮箱注册
              </Radio.Button>
            </Radio.Group>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            size="large"
            layout="vertical"
            requiredMark={false}
          >
            {registrationMode === 'username' && (
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少需要3个字符' }
                ]}
                style={{ animation: 'slideInUp 0.6s ease-out' }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#2A6F6B' }} />}
                  placeholder="请输入用户名"
                  size="large"
                  style={{
                    borderRadius: '12px',
                    height: '48px',
                    borderColor: '#d1d5db',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2A6F6B';
                    e.target.style.boxShadow = '0 0 0 3px rgba(42, 111, 107, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </Form.Item>
            )}

            {registrationMode === 'email' && (
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
                style={{ animation: 'slideInUp 0.6s ease-out' }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#2A6F6B' }} />}
                  placeholder="这将是您的登录邮箱"
                  size="large"
                  style={{
                    borderRadius: '12px',
                    height: '48px',
                    borderColor: '#d1d5db',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2A6F6B';
                    e.target.style.boxShadow = '0 0 0 3px rgba(42, 111, 107, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </Form.Item>
            )}

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
                { min: 6, message: '密码至少6位数!' }
              ]}
              style={{ animation: 'slideInUp 0.7s ease-out' }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#2A6F6B' }} />}
                placeholder="密码"
                size="large"
                style={{
                  borderRadius: '12px',
                  height: '48px',
                  borderColor: '#d1d5db',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
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
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致!'));
                  },
                }),
              ]}
              style={{ animation: 'slideInUp 0.8s ease-out' }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#2A6F6B' }} />}
                placeholder="确认密码"
                size="large"
                style={{
                  borderRadius: '12px',
                  height: '48px',
                  borderColor: '#d1d5db',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
            </Form.Item>

            <Form.Item className="mb-6" style={{ animation: 'slideInUp 0.9s ease-out' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<UserAddOutlined />}
                block
                size="large"
                style={{
                  height: '56px',
                  background: loading ? '#6b7280' : '#2A6F6B',
                  border: '0',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '16px',
                  boxShadow: '0 8px 32px rgba(42, 111, 107, 0.3)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className=""
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(42, 111, 107, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(42, 111, 107, 0.3)';
                  }
                }}
              >
                {loading ? '注册中...' : '创建账户'}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ 
            borderColor: '#e5e7eb', 
            color: '#6b7280',
            fontSize: '14px',
            margin: '32px 0'
          }}>
            或
          </Divider>

          <div style={{ 
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ color: '#6b7280', fontSize: '15px' }}>已有账户？</Text>
              <Link 
                to="/login" 
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
                立即登录
              </Link>
            </div>
            <Link to="/" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#2A6F6B';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#9ca3af';
            }}
            >
              返回首页
            </Link>
          </div>
        </Card>

        <div className="text-center mt-8">
          <Text className="text-gray-500 text-sm">
            Togother ©2025 为您的每一次出行提供贴心服务
          </Text>
        </div>
      </div>
    </div>
  );
}

export default Register;