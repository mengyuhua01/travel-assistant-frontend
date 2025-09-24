import React, { useState } from 'react';
import { Drawer, Form, Input, Button, message, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { createPost } from '../apis/postApi';
import './CreatePostDrawer.css';

const { TextArea } = Input;

const CreatePostDrawer = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 处理表单提交
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const response = await createPost({
        title: values.title.trim(),
        content: values.content.trim()
      });
      
      console.log('创建帖子API响应:', response);
      
      // 检查响应是否成功（兼容不同的后端返回格式）
      const isSuccess = response?.success !== false && 
                       (response?.success || 
                        response?.code === 200 || 
                        response?.status === 'success' || 
                        response?.data?.id || 
                        response?.id ||
                        !response?.error);
      
      if (isSuccess) {
        message.success('帖子发布成功！', 3); // 显示3秒
        form.resetFields();
        onSuccess && onSuccess();
      } else {
        const errorMsg = response?.message || response?.msg || response?.error || '发布失败，请重试';
        message.error(errorMsg);
        console.error('发布失败响应:', response);
      }
    } catch (error) {
      console.error('发布帖子失败:', error);
      message.error('发布失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理表单提交失败
  const handleSubmitFailed = (errorInfo) => {
    console.error('表单验证失败:', errorInfo);
    message.error('请完善表单信息');
  };

  // 处理抽屉关闭
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // 处理取消按钮
  const handleCancel = () => {
    if (form.isFieldsTouched()) {
      // 如果表单有修改，询问是否确认关闭
      const confirmed = window.confirm('您有未保存的内容，确定要关闭吗？');
      if (confirmed) {
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  return (
    <Drawer
      title="发布新帖子"
      placement="right"
      size="large"
      onClose={handleCancel}
      open={open}
      className="create-post-drawer"
      footer={
        <Space className="drawer-footer">
          <Button onClick={handleCancel} size="large">
            取消
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => form.submit()}
            loading={submitting}
            size="large"
            className="submit-btn"
          >
            {submitting ? '发布中...' : '发布帖子'}
          </Button>
        </Space>
      }
    >
      <div className="drawer-content">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={handleSubmitFailed}
          requiredMark={false}
        >
          <Form.Item
            label="帖子标题"
            name="title"
            rules={[
              { required: true, message: '请输入帖子标题' },
              { min: 2, message: '标题至少需要2个字符' },
              { max: 100, message: '标题不能超过100个字符' }
            ]}
          >
            <Input
              placeholder="请输入帖子标题..."
              maxLength={100}
              showCount
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="帖子内容"
            name="content"
            rules={[
              { required: true, message: '请输入帖子内容' },
              { min: 10, message: '内容至少需要10个字符' },
              { max: 2000, message: '内容不能超过2000个字符' }
            ]}
          >
            <TextArea
              placeholder="请输入帖子内容..."
              rows={12}
              maxLength={2000}
              showCount
              style={{ resize: 'none' }}
            />
          </Form.Item>

          <div className="form-tips">
            <h4>发布提示：</h4>
            <ul>
              <li>请确保内容健康，遵守社区规范</li>
              <li>标题要简洁明了，能够准确概括内容</li>
              <li>内容要详实，为其他用户提供有价值的信息</li>
              <li>发布后可以通过评论与其他用户互动</li>
            </ul>
          </div>
        </Form>
      </div>
    </Drawer>
  );
};

export default CreatePostDrawer;