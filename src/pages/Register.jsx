import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Radio, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import { registerUser } from '../apis/user';

const { Title, Text } = Typography;

function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationMode, setRegistrationMode] = useState('username');
  const navigate = useNavigate();

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

      await registerUser(registerData);
      
      // 显示注册成功提示
      setSuccess('注册成功！正在跳转到登录页面...');
      
      // 0.8秒后跳转到登录页面
      setTimeout(() => {
        navigate('/login');
      }, 800);
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
      background: 'linear-gradient(135deg, #0f766e 0%, #059669 25%, #10b981 50%, #22c55e 75%, #4ade80 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 动态背景装饰 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 15% 25%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)
        `,
        animation: 'float 10s ease-in-out infinite'
      }}>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(1deg); }
            }
            @keyframes slideInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}
        </style>
      </div>

      {/* 背景几何图形 */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '8%',
        width: '120px',
        height: '120px',
        background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.08))',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '12%',
        width: '90px',
        height: '90px',
        background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(34, 197, 94, 0.08))',
        borderRadius: '25px',
        animation: 'float 9s ease-in-out infinite'
      }} />

      <div className="w-full max-w-md" style={{ 
        position: 'relative', 
        zIndex: 1,
        animation: 'slideInUp 0.8s ease-out'
      }}>
        <Card 
          className="shadow-2xl border-0 rounded-3xl"
          style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <div className="text-center mb-8" style={{ animation: 'fadeIn 1s ease-out 0.3s both' }}>
            <div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ 
                background: 'linear-gradient(135deg, #22c55e, #10b981, #059669)',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)'
              }}
            >
              <span className="text-3xl">🌟</span>
            </div>
            <Title level={1} style={{ 
              color: '#047857', 
              marginBottom: '16px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #047857, #059669, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
                  borderColor: registrationMode === 'username' ? '#22c55e' : '#d1d5db',
                  background: registrationMode === 'username' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  color: registrationMode === 'username' ? '#047857' : '#6b7280',
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
                  borderColor: registrationMode === 'email' ? '#22c55e' : '#d1d5db',
                  background: registrationMode === 'email' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  color: registrationMode === 'email' ? '#047857' : '#6b7280',
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
                  prefix={<UserOutlined style={{ color: '#10b981' }} />}
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
                  prefix={<MailOutlined style={{ color: '#10b981' }} />}
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
                prefix={<LockOutlined style={{ color: '#10b981' }} />}
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
                prefix={<LockOutlined style={{ color: '#10b981' }} />}
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
                  background: loading 
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                    : 'linear-gradient(45deg, #22c55e 25%, #10b981 50%, #059669 75%)',
                  border: '0',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '16px',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className=""
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.3)';
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
                  color: '#22c55e',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  marginLeft: '8px',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#16a34a';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#22c55e';
                  e.target.style.textDecoration = 'none';
                }}
              >
                立即登录
              </Link>
            </div>
            <Link to="/start" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#22c55e';
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
            © 2024 智能旅行助手. 为您的每一次出行提供贴心服务
          </Text>
        </div>
      </div>
    </div>
  );
}

export default Register;