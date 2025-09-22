import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Radio, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import ApiService from '../services/api';

const { Title, Text } = Typography;

function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationMode, setRegistrationMode] = useState('username');
  const navigate = useNavigate();

  const handleModeChange = (e) => {
    setRegistrationMode(e.target.value);
    setError('');
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

      const response = await ApiService.register(registerData);
      
      // 存储用户数据
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        registrationType: registrationMode
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // 注册成功，跳转到登录页
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      // 处理特定错误信息
      if (error.message.includes('用户名已存在') || error.message.includes('UsernameExistsException')) {
        setError('用户名已存在，请选择其他用户名');
      } else if (error.message.includes('邮箱已存在') || error.message.includes('EmailExistsException')) {
        setError('邮箱已被注册，请使用其他邮箱');
      } else if (error.message.includes('密码不能为空')) {
        setError('密码不能为空');
      } else if (error.message.includes('注册必须提供用户名或邮箱之一')) {
        setError('用户名或邮箱为必填项');
      } else {
        setError('注册失败，请稍后重试');
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
              <span className="text-2xl">🌟</span>
            </div>
            <Title level={2} className="text-gray-800 mb-2">
              创建账户
            </Title>
            <Text className="text-gray-600">
              加入智能旅行助手，开启美好旅程
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

          <div className="mb-6">
            <Text className="text-gray-700 font-medium block mb-3">注册方式</Text>
            <Radio.Group 
              value={registrationMode} 
              onChange={handleModeChange}
              className="w-full"
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Radio.Button 
                  value="username" 
                  className="text-center rounded-lg border-gray-200"
                  style={{ 
                    height: '40px', 
                    lineHeight: '32px',
                    borderColor: '#e5e7eb'
                  }}
                >
                  用户名注册
                </Radio.Button>
                <Radio.Button 
                  value="email"
                  className="text-center rounded-lg border-gray-200"
                  style={{ 
                    height: '40px', 
                    lineHeight: '32px',
                    borderColor: '#e5e7eb'
                  }}
                >
                  邮箱注册
                </Radio.Button>
              </div>
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
                label={<span className="text-gray-700 font-medium">用户名</span>}
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少需要3个字符' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入用户名"
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
            )}

            {registrationMode === 'email' && (
              <Form.Item
                name="email"
                label={<span className="text-gray-700 font-medium">邮箱</span>}
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="这将是您的登录邮箱"
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
            )}

            <Form.Item
              name="password"
              label={<span className="text-gray-700 font-medium">密码</span>}
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少需要6个字符' }
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

            <Form.Item
              name="confirmPassword"
              label={<span className="text-gray-700 font-medium">确认密码</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请确认密码"
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
                icon={<UserAddOutlined />}
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
                {loading ? '注册中...' : '创建账户'}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="text-gray-400">或</Divider>

          <div className="text-center">
            <Text className="text-gray-600">已有账户？</Text>
            <Link 
              to="/login" 
              className="ml-2 font-medium"
              style={{ 
                color: '#22c55e',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#16a34a'}
              onMouseLeave={(e) => e.target.style.color = '#22c55e'}
            >
              立即登录
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