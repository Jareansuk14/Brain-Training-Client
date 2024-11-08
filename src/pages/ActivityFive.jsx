// src/pages/ActivityFive.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Space,
  Typography,
  Button,
  Steps,
  Alert,
  Input,
  Tabs,
  Collapse,
  message,
  Timeline,
  Badge,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  LoadingOutlined,
  HeartOutlined,
  AimOutlined,
  ClockCircleOutlined,
  RocketFilled,
  CheckCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// Color palette for blue and soft purple theme
const COLORS = {
  primary: "#7c3aed",
  secondary: "#a78bfa",
  background: "#7c3aed10",
  dark: "#1f2937", // Deep purple
  accent: "#60a5fa", // Sky blue
  light: "#f8fafc", // Almost white
  wave: "#a78bfa", // Light purple for waves
  success: "#22c55e", // Green for completed items
  warning: "#ef4444", // Red for deleted items
  highlight: "#f3f4f6",
};

const PageTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    margin-bottom: 40px;
    color: ${COLORS.text};
    font-size: 32px;
    font-weight: 700;
    position: relative;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);

    &::after {
      content: "";
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: linear-gradient(
        90deg,
        ${COLORS.primary},
        ${COLORS.secondary}
      );
      border-radius: 2px;
    }
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const InstructionCard = styled.div`
  background: ${COLORS.highlight};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid ${COLORS.border};
  animation: ${slideIn} 0.4s ease-out;

  .instruction-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .anticon {
      font-size: 24px;
      color: ${COLORS.primary};
    }

    h4 {
      margin: 0;
      color: ${COLORS.text};
      font-size: 18px;
      font-weight: 600;
    }
  }

  .instruction-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .instruction-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${COLORS.textLight};
      font-size: 15px;

      .anticon {
        color: ${COLORS.success};
      }
    }
  }
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${COLORS.background}; // เปลี่ยนเป็นใช้สีพื้นหลังโดยตรง
  padding: 40px 24px;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const ContentContainer = styled.div`
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    width: 95%;
    padding: 0 12px;
  }
`;

const StyledCard = styled(Card)`
  background: ${COLORS.light};
  margin-bottom: 16px;
  border-radius: 16px;
  border: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px rgba(55, 48, 163, 0.05);
  animation: ${fadeIn} 0.5s ease-out;

  .ant-card-head {
    border-bottom: 1px solid ${COLORS.background};
    padding: 16px 24px;
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const ValueItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: ${COLORS.background};
  border-radius: 8px;
  margin-bottom: 8px;
  animation: ${fadeIn} 0.3s ease-out;

  &:hover {
    transform: translateX(4px);
    transition: transform 0.2s ease;
  }
`;

const GoalItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: ${(props) =>
    props.completed ? `${COLORS.success}15` : COLORS.background};
  border-radius: 8px;
  margin-bottom: 8px;
  animation: ${fadeIn} 0.3s ease-out;

  &:hover {
    transform: translateX(4px);
    transition: transform 0.2s ease;
  }

  ${(props) =>
    props.completed &&
    `
        text-decoration: line-through;
        opacity: 0.7;
    `}
`;

const ActionButton = styled(Button)`
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.primary {
    background: ${COLORS.primary};
    border: none;
    color: white;

    &:hover {
      background: ${COLORS.secondary};
      transform: translateY(-1px);
    }
  }

  &.ghost {
    color: ${COLORS.primary};
    border-color: ${COLORS.primary};

    &:hover {
      color: ${COLORS.secondary};
      border-color: ${COLORS.secondary};
      background: ${COLORS.background};
    }
  }
`;

const StyledInput = styled(Input)`
  border-radius: 8px;
  border: 1px solid ${COLORS.wave};
  padding: 8px 12px;

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

// Utility Components
const StatisticCard = ({ title, value, total, icon, color }) => (
  <Card style={{ borderRadius: 12, height: "100%" }}>
    <Space direction="vertical" style={{ width: "100%" }} align="center">
      <div
        style={{
          fontSize: 24,
          color: color,
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}10`,
          borderRadius: "50%",
        }}
      >
        {icon}
      </div>
      <Statistic
        title={title}
        value={value}
        suffix={total ? `/ ${total}` : null}
        valueStyle={{ color }}
      />
    </Space>
  </Card>
);

const getActionIcon = (action) => {
  switch (action) {
    case "add":
      return <PlusOutlined style={{ color: COLORS.primary }} />;
    case "delete":
      return <CloseOutlined style={{ color: COLORS.warning }} />;
    case "complete":
      return <CheckOutlined style={{ color: COLORS.success }} />;
    default:
      return null;
  }
};

const getActionText = (action) => {
  switch (action) {
    case "add":
      return "เพิ่มใหม่";
    case "delete":
      return "ลบออก";
    case "complete":
      return "สำเร็จแล้ว";
    default:
      return "";
  }
};

// Helper Functions
const getActionColor = (action) => {
  switch (action) {
    case "add":
      return COLORS.primary;
    case "delete":
      return COLORS.warning;
    case "complete":
      return COLORS.success;
    default:
      return COLORS.dark;
  }
};

const getTimelineColor = (action) => {
  switch (action) {
    case "add":
      return COLORS.primary;
    case "delete":
      return COLORS.warning;
    case "complete":
      return COLORS.success;
    default:
      return COLORS.dark;
  }
};

const getTimelineIcon = (action) => {
  switch (action) {
    case "add":
      return <PlusOutlined />;
    case "delete":
      return <CloseOutlined />;
    case "complete":
      return <CheckOutlined />;
    default:
      return null;
  }
};

const getActionStatus = (action) => {
  switch (action) {
    case "add":
      return "processing";
    case "delete":
      return "error";
    case "complete":
      return "success";
    default:
      return "default";
  }
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Component State
export default function ActivityFive() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState([]);
  const [shortTermGoals, setShortTermGoals] = useState([]);
  const [longTermGoals, setLongTermGoals] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionHistory, setActionHistory] = useState([]);

  // Fetch existing data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/goals/${user.nationalId}`
        );
        const { values, shortTermGoals, longTermGoals, actions } =
          response.data;

        setValues(values || []);
        setShortTermGoals(shortTermGoals || []);
        setLongTermGoals(longTermGoals || []);
        setActionHistory(actions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    };

    if (user?.nationalId) {
      fetchData();
    }
  }, [user?.nationalId]);

  // Handler Functions
  const handleAddValue = async () => {
    if (!newValue.trim()) {
      message.warning("กรุณากรอกค่านิยมของคุณ");
      return;
    }

    const newValueItem = {
      id: Date.now().toString(),
      text: newValue.trim(),
    };

    try {
      setLoading(true);
      await axios.post("https://brain-training-server.onrender.com/api/goals/save", {
        nationalId: user.nationalId,
        values: [...values, newValueItem],
      });

      setValues((prev) => [...prev, newValueItem]);
      setNewValue("");
      message.success("เพิ่มค่านิยมสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มค่านิยม");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveValue = async (id) => {
    try {
      setLoading(true);
      const valueToRemove = values.find((v) => v.id === id);

      await axios.post("https://brain-training-server.onrender.com/api/goals/delete", {
        nationalId: user.nationalId,
        itemId: id,
        itemType: "value",
        text: valueToRemove.text,
      });

      await axios.post("https://brain-training-server.onrender.com/api/goals/save", {
        nationalId: user.nationalId,
        values: values.filter((v) => v.id !== id),
      });

      setValues((prev) => prev.filter((v) => v.id !== id));
      message.success("ลบค่านิยมสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบค่านิยม");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (type) => {
    if (!newGoal.trim()) {
      message.warning("กรุณากรอกเป้าหมายของคุณ");
      return;
    }

    const newGoalItem = {
      id: Date.now().toString(),
      text: newGoal.trim(),
      completed: false,
    };

    try {
      setLoading(true);
      const updatedGoals =
        type === "short"
          ? [...shortTermGoals, newGoalItem]
          : [...longTermGoals, newGoalItem];

      await axios.post("https://brain-training-server.onrender.com/api/goals/save", {
        nationalId: user.nationalId,
        [type === "short" ? "shortTermGoals" : "longTermGoals"]: updatedGoals,
      });

      if (type === "short") {
        setShortTermGoals((prev) => [...prev, newGoalItem]);
      } else {
        setLongTermGoals((prev) => [...prev, newGoalItem]);
      }

      setNewGoal("");
      message.success("เพิ่มเป้าหมายสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มเป้าหมาย");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGoal = async (id, type) => {
    try {
      setLoading(true);
      const goalsArray = type === "short" ? shortTermGoals : longTermGoals;
      const goalToRemove = goalsArray.find((g) => g.id === id);

      await axios.post("https://brain-training-server.onrender.com/api/goals/delete", {
        nationalId: user.nationalId,
        itemId: id,
        itemType: type === "short" ? "shortTermGoal" : "longTermGoal",
        text: goalToRemove.text,
      });

      const updatedGoals = goalsArray.filter((g) => g.id !== id);
      await axios.post("https://brain-training-server.onrender.com/api/goals/save", {
        nationalId: user.nationalId,
        [type === "short" ? "shortTermGoals" : "longTermGoals"]: updatedGoals,
      });

      if (type === "short") {
        setShortTermGoals((prev) => prev.filter((g) => g.id !== id));
      } else {
        setLongTermGoals((prev) => prev.filter((g) => g.id !== id));
      }

      message.success("ลบเป้าหมายสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบเป้าหมาย");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGoal = async (id, type) => {
    try {
      setLoading(true);
      const goalsArray = type === "short" ? shortTermGoals : longTermGoals;
      const goalToToggle = goalsArray.find((g) => g.id === id);
      const updatedGoal = {
        ...goalToToggle,
        completed: !goalToToggle.completed,
      };

      await axios.post("https://brain-training-server.onrender.com/api/goals/complete", {
        nationalId: user.nationalId,
        itemId: id,
        itemType: type === "short" ? "shortTermGoal" : "longTermGoal",
        text: goalToToggle.text,
      });

      const updatedGoals = goalsArray.map((g) =>
        g.id === id ? updatedGoal : g
      );
      await axios.post("https://brain-training-server.onrender.com/api/goals/save", {
        nationalId: user.nationalId,
        [type === "short" ? "shortTermGoals" : "longTermGoals"]: updatedGoals,
      });

      if (type === "short") {
        setShortTermGoals((prev) =>
          prev.map((g) => (g.id === id ? updatedGoal : g))
        );
      } else {
        setLongTermGoals((prev) =>
          prev.map((g) => (g.id === id ? updatedGoal : g))
        );
      }

      message.success(
        updatedGoal.completed
          ? "เป้าหมายสำเร็จแล้ว!"
          : "ยกเลิกการทำเครื่องหมายสำเร็จ"
      );
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://brain-training-server.onrender.com/api/goals/summary/${user.nationalId}`
      );
      setActionHistory(response.data.actions);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลสรุป");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "ขั้นนำ", icon: <HeartOutlined /> },
    { title: "ขั้นดำเนินการ", icon: <AimOutlined /> },
    { title: "ขั้นสรุป", icon: <CheckOutlined /> },
  ];

  const sortByTimestamp = (actions) => {
    return [...actions].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  return (
    <PageContainer>
      <ContentContainer>
        <PageTitle level={2}>
          เสริมสร้างพลัง ตั้งเป้าหมายชีวิต สร้างค่านิยม
        </PageTitle>

        <Steps
          current={currentStep}
          style={{ marginBottom: 32 }}
          items={steps.map((step) => ({
            title: step.title,
            icon: step.icon,
          }))}
        />

        {/* ขั้นนำ */}
        {currentStep === 0 && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <InstructionCard>
              <div className="instruction-header">
                <InfoCircleOutlined />
                <h4>คำแนะนำในการทำกิจกรรม</h4>
              </div>
              <div className="instruction-list">
                <div className="instruction-item">
                  <CheckCircleOutlined />
                  <span>ใช้เวลาในการทำกิจกรรม 50 นาที</span>
                </div>
                <div className="instruction-item">
                  <CheckCircleOutlined />
                  <span>ตอบคำถามอย่างจริงใจและใคร่ครวญ</span>
                </div>
                <div className="instruction-item">
                  <CheckCircleOutlined />
                  <span>
                    ไม่มีคำตอบที่ถูกหรือผิด เป้าหมายคือการทำความเข้าใจตนเอง
                  </span>
                </div>
              </div>
            </InstructionCard>
            <div style={{ textAlign: "center" }}>
              <ActionButton
                className="primary"
                onClick={() => setCurrentStep(1)}
                block
              >
                เริ่มกิจกรรม
              </ActionButton>
            </div>
          </Space>
        )}

        {/* ขั้นดำเนินการ */}
        {currentStep === 1 && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <StyledCard title="ค่านิยมของฉัน">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <StyledInput
                    placeholder="เพิ่มค่านิยมของคุณ..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onPressEnter={handleAddValue}
                  />
                  <ActionButton
                    className="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddValue}
                    loading={loading}
                  >
                    เพิ่ม
                  </ActionButton>
                </div>

                {values.map((value) => (
                  <ValueItem key={value.id}>
                    <HeartOutlined
                      style={{ marginRight: 8, color: COLORS.primary }}
                    />
                    <Text style={{ flex: 1 }}>{value.text}</Text>
                    <CloseOutlined
                      style={{ cursor: "pointer", color: COLORS.secondary }}
                      onClick={() => handleRemoveValue(value.id)}
                    />
                  </ValueItem>
                ))}
              </Space>
            </StyledCard>

            <StyledCard title="เป้าหมายชีวิต">
              <Tabs
                items={[
                  {
                    key: "short",
                    label: (
                      <span>
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        เป้าหมายระยะสั้น
                      </span>
                    ),
                    children: (
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div
                          style={{ display: "flex", gap: 8, marginBottom: 16 }}
                        >
                          <StyledInput
                            placeholder="เพิ่มเป้าหมายระยะสั้น..."
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            onPressEnter={() => handleAddGoal("short")}
                          />
                          <ActionButton
                            className="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddGoal("short")}
                            loading={loading}
                          >
                            เพิ่ม
                          </ActionButton>
                        </div>

                        {shortTermGoals.map((goal) => (
                          <GoalItem key={goal.id} completed={goal.completed}>
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() =>
                                handleToggleGoal(goal.id, "short")
                              }
                              style={{ marginRight: 8 }}
                            />
                            <Text style={{ flex: 1 }}>{goal.text}</Text>
                            <CloseOutlined
                              style={{
                                cursor: "pointer",
                                color: COLORS.secondary,
                              }}
                              onClick={() => handleRemoveGoal(goal.id, "short")}
                            />
                          </GoalItem>
                        ))}
                      </Space>
                    ),
                  },
                  {
                    key: "long",
                    label: (
                      <span>
                        <RocketFilled style={{ marginRight: 8 }} />
                        เป้าหมายระยะยาว
                      </span>
                    ),
                    children: (
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div
                          style={{ display: "flex", gap: 8, marginBottom: 16 }}
                        >
                          <StyledInput
                            placeholder="เพิ่มเป้าหมายระยะยาว..."
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            onPressEnter={() => handleAddGoal("long")}
                          />
                          <ActionButton
                            className="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddGoal("long")}
                            loading={loading}
                          >
                            เพิ่ม
                          </ActionButton>
                        </div>

                        {longTermGoals.map((goal) => (
                          <GoalItem key={goal.id} completed={goal.completed}>
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() => handleToggleGoal(goal.id, "long")}
                              style={{ marginRight: 8 }}
                            />
                            <Text style={{ flex: 1 }}>{goal.text}</Text>
                            <CloseOutlined
                              style={{
                                cursor: "pointer",
                                color: COLORS.secondary,
                              }}
                              onClick={() => handleRemoveGoal(goal.id, "long")}
                            />
                          </GoalItem>
                        ))}
                      </Space>
                    ),
                  },
                ]}
              />
            </StyledCard>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Space>
                <ActionButton
                  className="ghost"
                  onClick={() => setCurrentStep(0)}
                >
                  ย้อนกลับ
                </ActionButton>
                <ActionButton
                  className="primary"
                  onClick={handleNext}
                  loading={loading}
                >
                  ถัดไป
                </ActionButton>
              </Space>
            </div>
          </Space>
        )}

        {/* ขั้นสรุป */}
        {currentStep === 2 && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <StyledCard>
              <Title
                level={3}
                style={{
                  textAlign: "center",
                  color: COLORS.primary,
                  marginBottom: 24,
                  background: `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                สรุปการดำเนินการทั้งหมด
              </Title>

              <Collapse
                defaultActiveKey={["values", "shortGoals", "longGoals"]}
                style={{
                  background: "none",
                  border: "none",
                }}
              >
                {/* ส่วนค่านิยม */}
                <Collapse.Panel
                  key="values"
                  header={
                    <Space>
                      <HeartOutlined style={{ color: COLORS.primary }} />
                      <Text strong>ค่านิยมของฉัน</Text>
                    </Space>
                  }
                  style={{
                    marginBottom: 24,
                    background: COLORS.light,
                    borderRadius: 12,
                    border: `1px solid ${COLORS.wave}`,
                  }}
                >
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                  >
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {sortByTimestamp(
                        actionHistory.filter(
                          (action) => action.itemType === "value"
                        )
                      ).map((action, index) => (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <Card
                            size="small"
                            style={{
                              marginBottom: 8,
                              borderRadius: 8,
                              background: `${getActionColor(action.action)}05`,
                              borderLeft: `4px solid ${getActionColor(
                                action.action
                              )}`,
                            }}
                          >
                            <Row align="middle">
                              <Col flex="32px">
                                {getActionIcon(action.action)}
                              </Col>
                              <Col flex="auto">
                                <Text strong>{action.text}</Text>
                                <br />
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formatDate(action.timestamp)}
                                </Text>
                              </Col>
                              <Col>
                                <Badge
                                  status={getActionStatus(action.action)}
                                  text={getActionText(action.action)}
                                />
                              </Col>
                            </Row>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </Collapse.Panel>

                {/* ส่วนเป้าหมายระยะสั้น */}
                <Collapse.Panel
                  key="shortGoals"
                  header={
                    <Space>
                      <ClockCircleOutlined style={{ color: COLORS.accent }} />
                      <Text strong>เป้าหมายระยะสั้น</Text>
                    </Space>
                  }
                  style={{
                    marginBottom: 24,
                    background: COLORS.light,
                    borderRadius: 12,
                    border: `1px solid ${COLORS.wave}`,
                  }}
                >
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                  >
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {sortByTimestamp(
                        actionHistory.filter(
                          (action) => action.itemType === "shortTermGoal"
                        )
                      ).map((action, index) => (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <Card
                            size="small"
                            style={{
                              marginBottom: 8,
                              borderRadius: 8,
                              background: `${getActionColor(action.action)}05`,
                              borderLeft: `4px solid ${getActionColor(
                                action.action
                              )}`,
                            }}
                          >
                            <Row align="middle">
                              <Col flex="32px">
                                {getActionIcon(action.action)}
                              </Col>
                              <Col flex="auto">
                                <Text strong>{action.text}</Text>
                                <br />
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formatDate(action.timestamp)}
                                </Text>
                              </Col>
                              <Col>
                                <Badge
                                  status={getActionStatus(action.action)}
                                  text={getActionText(action.action)}
                                />
                              </Col>
                            </Row>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </Collapse.Panel>

                {/* ส่วนเป้าหมายระยะยาว */}
                <Collapse.Panel
                  key="longGoals"
                  header={
                    <Space>
                      <RocketFilled style={{ color: COLORS.dark }} />
                      <Text strong>เป้าหมายระยะยาว</Text>
                    </Space>
                  }
                  style={{
                    background: COLORS.light,
                    borderRadius: 12,
                    border: `1px solid ${COLORS.wave}`,
                  }}
                >
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                  >
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {sortByTimestamp(
                        actionHistory.filter(
                          (action) => action.itemType === "longTermGoal"
                        )
                      ).map((action, index) => (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <Card
                            size="small"
                            style={{
                              marginBottom: 8,
                              borderRadius: 8,
                              background: `${getActionColor(action.action)}05`,
                              borderLeft: `4px solid ${getActionColor(
                                action.action
                              )}`,
                            }}
                          >
                            <Row align="middle">
                              <Col flex="32px">
                                {getActionIcon(action.action)}
                              </Col>
                              <Col flex="auto">
                                <Text strong>{action.text}</Text>
                                <br />
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formatDate(action.timestamp)}
                                </Text>
                              </Col>
                              <Col>
                                <Badge
                                  status={getActionStatus(action.action)}
                                  text={getActionText(action.action)}
                                />
                              </Col>
                            </Row>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </Collapse.Panel>
              </Collapse>

              {/* สถิติสรุป */}
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} sm={8}>
                  <StatisticCard
                    title="ค่านิยมทั้งหมด"
                    value={values.length}
                    icon={<HeartOutlined />}
                    color={COLORS.primary}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <StatisticCard
                    title="เป้าหมายระยะสั้นที่สำเร็จ"
                    value={shortTermGoals.filter((g) => g.completed).length}
                    total={shortTermGoals.length}
                    icon={<CheckOutlined />}
                    color={COLORS.success}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <StatisticCard
                    title="เป้าหมายระยะยาวที่สำเร็จ"
                    value={longTermGoals.filter((g) => g.completed).length}
                    total={longTermGoals.length}
                    icon={<RocketFilled />}
                    color={COLORS.accent}
                  />
                </Col>
              </Row>
            </StyledCard>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Space>
                <ActionButton
                  className="ghost"
                  onClick={() => setCurrentStep(1)}
                >
                  ย้อนกลับ
                </ActionButton>
                <ActionButton
                  className="primary"
                  onClick={() => navigate("/")}
                  icon={<CheckOutlined />}
                >
                  เสร็จสิ้นกิจกรรม
                </ActionButton>
              </Space>
            </div>

            {/* CSS สำหรับ custom scrollbar */}
            <style>
              {`
                            div::-webkit-scrollbar {
                                width: 6px;
                            }
                            
                            div::-webkit-scrollbar-track {
                                background: ${COLORS.background};
                                border-radius: 3px;
                            }
                            
                            div::-webkit-scrollbar-thumb {
                                background: ${COLORS.wave};
                                border-radius: 3px;
                            }
                            
                            div::-webkit-scrollbar-thumb:hover {
                                background: ${COLORS.secondary};
                            }

                            .ant-collapse-content {
                                overflow: hidden !important;
                            }
                        `}
            </style>
          </Space>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Space direction="vertical" align="center">
              <LoadingOutlined
                style={{ fontSize: 24, color: COLORS.primary }}
              />
              <Text>กำลังดำเนินการ...</Text>
            </Space>
          </div>
        )}
      </ContentContainer>
    </PageContainer>
  );
}
