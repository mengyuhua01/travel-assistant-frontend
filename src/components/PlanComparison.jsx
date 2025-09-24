import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Col, Modal, Row, Space, Tag, Typography } from "antd";
import { useState } from "react";
import { FaBed, FaBus, FaCloudSun, FaMoon, FaSun } from "react-icons/fa";
import "./PlanComparison.css";

const { Title, Text, Paragraph } = Typography;

const PlanComparison = ({
  visible,
  onCancel,
  onConfirm,
  originalData,
  newData,
  selectedTags,
}) => {
  const [showDetails, setShowDetails] = useState({
    morning: false,
    afternoon: false,
    evening: false,
    accommodation: false,
    transportation: false,
  });

  const toggleDetails = (section) => {
    setShowDetails((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderTimeSection = (title, original, updated, icon, sectionKey) => {
    const hasChanged = JSON.stringify(original) !== JSON.stringify(updated);

    // 处理不同类型的数据渲染
    const renderContent = (data, isOriginal = true) => {
      if (!data) return "无";

      // 如果是简单的字符串类型（上午、下午、晚上活动）
      if (typeof data === "string") {
        return data;
      }

      // 如果是对象类型（住宿、交通）
      if (typeof data === "object") {
        const content = [];

        // 处理活动信息
        if (data.activity) {
          content.push(`活动: ${data.activity}`);
        }

        // 处理名称信息（住宿名称、交通方式等）
        if (data.name) {
          content.push(`名称: ${data.name}`);
        }

        // 处理详细信息
        if (data.details) {
          content.push(`详情: ${data.details}`);
        }

        // 处理地址信息
        if (data.address) {
          content.push(`地址: ${data.address}`);
        }

        // 处理房间类型
        if (data.roomType) {
          content.push(`房间类型: ${data.roomType}`);
        }

        // 处理用餐信息
        if (data.meal) {
          content.push(`用餐: ${data.meal}`);
        }

        // 处理价格信息
        if (data.price) {
          content.push(`价格: ¥${data.price}`);
        }

        // 处理费用信息
        if (data.cost) {
          content.push(`费用: ¥${data.cost}`);
        }

        // 处理预订链接
        if (data.bookingLink) {
          content.push(`预订: ${data.bookingLink}`);
        }

        return content.length > 0 ? content.join("\n") : "暂无详细信息";
      }

      return String(data);
    };

    return (
      <div className="comparison-section">
        <div className="section-header">
          <span className="section-icon">{icon}</span>
          <Title level={5} className="section-title">
            {title}
          </Title>
          {hasChanged && (
            <Tag color="orange" size="small">
              已更新
            </Tag>
          )}
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => toggleDetails(sectionKey)}
            className="details-toggle"
          >
            {showDetails[sectionKey] ? "收起" : "详情"}
          </Button>
        </div>

        {showDetails[sectionKey] && (
          <Row gutter={16} className="comparison-content">
            <Col span={12}>
              <Card
                size="small"
                title="原方案"
                className={`comparison-card ${hasChanged ? "" : "unchanged"}`}
                headStyle={{ backgroundColor: "#f5f5f5" }}
              >
                <div className="plan-content">
                  <div className="activity-info">
                    <Paragraph
                      ellipsis={{ rows: 4, expandable: true }}
                      style={{ whiteSpace: "pre-line", margin: 0 }}
                    >
                      {renderContent(original, true)}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={12}>
              <Card
                size="small"
                title="新方案"
                className={`comparison-card ${
                  hasChanged ? "updated" : "unchanged"
                }`}
                headStyle={{
                  backgroundColor: hasChanged ? "#f6ffed" : "#f5f5f5",
                  borderBottom: hasChanged
                    ? "1px solid #b7eb8f"
                    : "1px solid #d9d9d9",
                }}
              >
                <div className="plan-content">
                  <div className="activity-info">
                    <Paragraph
                      ellipsis={{ rows: 4, expandable: true }}
                      style={{ whiteSpace: "pre-line", margin: 0 }}
                    >
                      {renderContent(updated, false)}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    );
  };

  const renderCostComparison = () => {
    const originalCost = originalData?.dailyCost || 0;
    const newCost = newData?.dailyCost || 0;
    const costDiff = newCost - originalCost;

    return (
      <div className="cost-comparison">
        <Title level={5}>费用对比</Title>
        <Row gutter={16}>
          <Col span={8}>
            <div className="cost-item">
              <Text type="secondary">原费用</Text>
              <div className="cost-value">¥{originalCost}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="cost-item">
              <Text type="secondary">新费用</Text>
              <div className="cost-value">¥{newCost}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="cost-item">
              <Text type="secondary">差额</Text>
              <div
                className={`cost-value ${
                  costDiff > 0 ? "increase" : costDiff < 0 ? "decrease" : ""
                }`}
              >
                {costDiff > 0 ? "+" : ""}¥{costDiff}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  if (!originalData || !newData) {
    return null;
  }

  return (
    <Modal
      title={
        <div className="comparison-modal-title">
          <span>方案对比 - 第{originalData.day}天</span>
          <Space wrap style={{ marginLeft: 16 }}>
            {selectedTags.map((tag) => (
              <Tag key={tag} color="green" size="small">
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      width={1000}
      className="plan-comparison-modal"
      footer={[
        <Button key="cancel" onClick={onCancel} size="large">
          取消
        </Button>,
        <Button
          key="confirm"
          type="primary"
          icon={<CheckOutlined />}
          onClick={onConfirm}
          size="large"
          className="confirm-button"
        >
          应用新方案
        </Button>,
      ]}
    >
      <div className="comparison-container">
        <div className="theme-comparison">
          <Title level={4}>主题对比</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="原主题" className="theme-card">
                <Text>{originalData.theme}</Text>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="新主题" className="theme-card updated">
                <Text>{newData.theme}</Text>
              </Card>
            </Col>
          </Row>
        </div>

        {renderTimeSection(
          "上午活动",
          originalData.morning,
          newData.morning,
          <FaSun />,
          "morning"
        )}
        {renderTimeSection(
          "下午活动",
          originalData.afternoon,
          newData.afternoon,
          <FaCloudSun />,
          "afternoon"
        )}
        {renderTimeSection(
          "晚上活动",
          originalData.evening,
          newData.evening,
          <FaMoon />,
          "evening"
        )}
        {renderTimeSection(
          "住宿安排",
          originalData.accommodation,
          newData.accommodation,
          <FaBed />,
          "accommodation"
        )}
        {renderTimeSection(
          "交通安排",
          originalData.transportation,
          newData.transportation,
          <FaBus />,
          "transportation"
        )}

        {renderCostComparison()}
      </div>
    </Modal>
  );
};

export default PlanComparison;
