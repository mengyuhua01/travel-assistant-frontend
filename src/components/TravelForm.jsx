import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Card,
  Typography,
  Row,
  Col,
  message
} from 'antd';
import {
  EnvironmentOutlined,
  AimOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './TravelForm.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * 旅行信息收集表单组件
 * 用于收集用户的出行基本信息，包括始发地、目的地、人数、预算和出行时间
 */
const TravelForm = ({ onSubmit, loading: externalLoading }) => {
  const [form] = Form.useForm();
  const [travelDays, setTravelDays] = useState(0);

  /**
   * 计算旅行天数
   * @param {Array} dates - 开始和结束日期数组
   */
  const calculateTravelDays = (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0];
      const endDate = dates[1];
      const days = endDate.diff(startDate, 'day') + 1; // +1 因为包含开始日
      setTravelDays(days);
      return days;
    }
    setTravelDays(0);
    return 0;
  };

  /**
   * 表单提交处理函数
   * @param {Object} values - 表单数据
   */
  const handleSubmit = async (values) => {
    try {
      // 格式化提交数据
      const submitData = {
        ...values,
        startDate: values.travelDates[0].format('YYYY-MM-DD'),
        endDate: values.travelDates[1].format('YYYY-MM-DD'),
        travelDays: calculateTravelDays(values.travelDates),
        // 去除预算中的非数字字符，保留数字和小数点
        budget: values.budget.toString().replace(/[^\d.]/g, '')
      };

      console.log('提交的旅行信息：', submitData);

      // 如果有外部传入的onSubmit函数，则调用它
      if (onSubmit) {
        onSubmit(submitData);
      } else {
        // 原有的处理逻辑（保持向后兼容）
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('旅行信息提交成功！即将为您生成个性化行程方案...');
      }

    } catch (error) {
      message.error('提交失败，请重试');
      console.error('提交错误：', error);
    }
  };

  /**
   * 表单提交失败处理函数
   * @param {Object} errorInfo - 错误信息
   */
  const handleSubmitFailed = (errorInfo) => {
    message.warning('请完善必填信息');
    console.log('表单验证失败：', errorInfo);
  };

  /**
   * 预算格式验证
   * @param {String} value - 输入值
   * @returns {Boolean} 是否有效
   */
  const validateBudget = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('请输入预算金额'));
    }

    // 验证预算格式：允许数字、小数点和常见货币符号
    const budgetRegex = /^[¥$€£]?\d+(\.\d{1,2})?[万千元块]?$/;
    if (!budgetRegex.test(value.toString())) {
      return Promise.reject(new Error('预算格式不正确，请输入有效金额（如：5000、¥8000、1.2万）'));
    }

    return Promise.resolve();
  };

  return (
    <div className="travel-form-container">
      <div className="travel-form-content">
        <div className="travel-form-header">
          <Title level={1} className="travel-form-title">
            ✈️ 智能旅行助手
          </Title>
          <Text className="travel-form-subtitle">
            填写您的出行需求，AI将为您生成专属的个性化旅行方案
          </Text>
        </div>

        <Card
          className="travel-form-card"
          styles={{ body: { padding: '32px' } }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={handleSubmitFailed}
            size="large"
            requiredMark={false}
          >
            <Row gutter={24}>
              {/* 第一行：始发地和目的地 */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="始发地"
                  name="departure"
                  rules={[
                    { required: true, message: '请输入始发地' },
                    { min: 2, message: '始发地至少输入2个字符' }
                  ]}
                >
                  <Input
                    prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                    placeholder="请输入出发城市"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="目的地"
                  name="destination"
                  rules={[
                    { required: true, message: '请输入目的地' },
                    { min: 2, message: '目的地至少输入2个字符' }
                  ]}
                >
                  <Input
                    prefix={<AimOutlined style={{ color: '#52c41a' }} />}
                    placeholder="请输入目标城市"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              {/* 第二行：人数和预算 */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="出行人数"
                  name="peopleCount"
                  rules={[
                    { required: true, message: '请输入出行人数' },
                    {
                      type: 'number',
                      min: 1,
                      max: 20,
                      message: '出行人数应在1-20人之间'
                    }
                  ]}
                >
                  <InputNumber
                    prefix={<UserOutlined style={{ color: '#fa541c' }} />}
                    placeholder="请输入人数"
                    min={1}
                    max={20}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="预算金额"
                  name="budget"
                  rules={[
                    { validator: validateBudget }
                  ]}
                >
                  <Input
                    prefix={<DollarOutlined style={{ color: '#fa8c16' }} />}
                    placeholder="请输入预算金额"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              {/* 第三行：出行时间和天数显示 */}
              <Col xs={24} sm={16}>
                <Form.Item
                  label="出行时间"
                  name="travelDates"
                  rules={[
                    { required: true, message: '请选择出行时间' },
                    {
                      validator: (_, value) => {
                        if (value && value[0] && value[0].isBefore(dayjs(), 'day')) {
                          return Promise.reject(new Error('出行时间不能早于今天'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <RangePicker
                    placeholder={['开始日期', '结束日期']}
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    onChange={calculateTravelDays}
                    showTime={false}
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item label="旅行天数">
                  <div className="travel-duration-display">
                    <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    {travelDays > 0 ? `${travelDays}天` : '请选择日期'}
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row justify="center" className="travel-form-submit-row">
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={externalLoading || false}
                  size="large"
                  className="travel-form-submit-button"
                >
                  {externalLoading ? '正在生成方案...' : '🚀 生成旅行方案'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default TravelForm;
