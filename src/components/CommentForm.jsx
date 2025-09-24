import React, { useState } from 'react';
import { Form, Input, Button, message, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { addComment } from '../apis/commentApi';
import './CommentForm.css';

const { TextArea } = Input;

const CommentForm = ({ postId, parentId = null, onSuccess, placeholder }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 提交评论
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const commentData = {
        postId,
        content: values.content.trim(),
        parentId
      };
      
      console.log('提交评论数据:', commentData);
      const response = await addComment(commentData);
      console.log('评论提交响应:', response);
      
      // 根据后端API响应结构判断成功
      if (response && (response.id || response.success !== false)) {
        message.success(parentId ? '回复成功！' : '评论成功！');
        form.resetFields();
        onSuccess && onSuccess();
      } else {
        message.error(response?.message || '评论失败，请重试');
      }
    } catch (error) {
      console.error('评论失败:', error);
      message.error('评论失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理表单提交失败
  const handleSubmitFailed = (errorInfo) => {
    console.error('表单验证失败:', errorInfo);
    message.error('请输入评论内容');
  };

  return (
    <div className="comment-form">
      <Form
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        layout="vertical"
      >
        <Form.Item
          name="content"
          rules={[
            { required: true, message: '请输入评论内容' },
            { min: 1, message: '评论内容不能为空' },
            { max: 500, message: '评论内容不能超过500个字符' }
          ]}
        >
          <TextArea
            placeholder={placeholder || (parentId ? "写下您的回复..." : "写下您的评论...")}
            rows={parentId ? 3 : 4}
            maxLength={500}
            showCount
            style={{ resize: 'none' }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <div className="comment-form-actions">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SendOutlined />}
                className="submit-comment-btn"
                style={{ backgroundColor: '#2A6F6B', borderColor: '#2A6F6B' }}
              >
                {submitting ? '发表中...' : (parentId ? '发表回复' : '发表评论')}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CommentForm;