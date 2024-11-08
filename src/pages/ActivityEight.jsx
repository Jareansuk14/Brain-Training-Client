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
  Statistic,
  Badge,
  Modal,
  Row,
  Col,
  Tooltip,
  Timeline,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  LoadingOutlined,
  HeartOutlined,
  EditOutlined,
  StarFilled,
  RocketFilled,
  AimOutlined,
  LockOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Color palette ใช้เหมือนเดิมเพื่อความ consistent
const COLORS = {
  primary: "#7c3aed", // Soft purple
  secondary: "#a78bfa", // Light purple
  background: "#7c3aed10", // Very light purple
  dark: "#3730a3", // Deep purple
  accent: "#60a5fa", // Sky blue
  light: "#f8fafc", // Almost white
  wave: "#c7d2fe", // Light purple for waves
  success: "#22c55e", // Green for completed items
  warning: "#ef4444", // Red for deleted items
  gold: "#fbbf24", // Gold for stars
  text: "#1f2937",
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

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

// Styled Components (นำมาจาก ActivityFive และเพิ่มเติม)
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

// เพิ่ม animation keyframes สำหรับดาว
const starAnimation = keyframes`
    0% { transform: scale(0) rotate(0deg); }
    50% { transform: scale(1.5) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
`;

// เพิ่ม styled component สำหรับดาว
const CompletedStar = styled(motion.div)`
  position: absolute;
  top: -10px;
  right: -10px;
  color: ${COLORS.gold};
  font-size: 24px;
  animation: ${starAnimation} 0.5s ease-out;
`;

const ItemCard = styled(motion.div)`
  background: ${(props) =>
    props.completed ? `${COLORS.success}15` : COLORS.background};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateX(4px);
    transition: transform 0.2s ease;
  }

  ${(props) =>
    props.completed &&
    `
        border: 1px solid ${COLORS.success}30;
    `}
`;

const PlanItem = styled.div`
  background: ${COLORS.light};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid ${COLORS.wave};
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

const StyledTextArea = styled(TextArea)`
  border-radius: 8px;
  border: 1px solid ${COLORS.wave};
  padding: 8px 12px;

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

// Main Component
export default function ActivityEight() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionHistory, setActionHistory] = useState([]);
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState({ text: "", reason: "" });

  // Form states
  const [newGoal, setNewGoal] = useState("");
  const [newPlan, setNewPlan] = useState("");
  const [obstacles, setObstacles] = useState("");
  const [commitment, setCommitment] = useState("");
  const [reward, setReward] = useState("");

  // Steps configuration
  const steps = [
    { title: "ค่านิยม", icon: <HeartOutlined /> },
    { title: "เป้าหมาย", icon: <AimOutlined /> },
    { title: "แผนปฏิบัติ", icon: <RocketFilled /> },
    { title: "พันธสัญญา", icon: <LockOutlined /> },
    { title: "สรุป", icon: <CheckOutlined /> },
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/activity-eight/${user.nationalId}`
        );
        const { currentGoal, completedGoals, actions, values } = response.data;

        setValues(values || []);
        setCompletedGoals(completedGoals || []);
        setActionHistory(actions || []);

        // ถ้ามีเป้าหมายที่สมบูรณ์แล้วและยังไม่เสร็จ ให้ไปที่หน้าสรุปทันที
        if (currentGoal) {
          setCurrentGoal(currentGoal);
          setObstacles(currentGoal.obstacles || "");
          setCommitment(currentGoal.commitment || "");
          setReward(currentGoal.reward || "");

          if (!currentGoal.completed && isGoalComplete(currentGoal)) {
            setCurrentStep(4);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    };

    if (user?.nationalId) {
      fetchData();
    }
  }, [user?.nationalId]);

  // เพิ่มฟังก์ชันตรวจสอบความสมบูรณ์ของเป้าหมาย
  const isGoalComplete = (goal) => {
    if (!goal) return false;

    return (
      goal.text &&
      goal.plans?.length > 0 &&
      goal.obstacles?.trim() &&
      goal.commitment?.trim() &&
      goal.reward?.trim()
    );
  };

  // เพิ่มฟังก์ชันจัดการค่านิยม
  const handleAddValue = async () => {
    if (!newValue.text.trim() || !newValue.reason.trim()) {
      message.warning("กรุณากรอกค่านิยมและเหตุผลให้ครบถ้วน");
      return;
    }

    if (values.length >= 1) {
      message.warning("สามารถเพิ่มค่านิยมได้เพียง 1 รายการ");
      return;
    }

    try {
      setLoading(true);
      const newValueItem = {
        id: Date.now().toString(),
        text: newValue.text.trim(),
        reason: newValue.reason.trim(),
      };

      await axios.post("https://brain-training-server.onrender.com/api/activity-eight/values/save", {
        nationalId: user.nationalId,
        values: [...values, newValueItem],
      });

      setValues((prev) => [...prev, newValueItem]);
      setNewValue({ text: "", reason: "" });
      message.success("เพิ่มค่านิยมสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มค่านิยม");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveValue = async (valueId) => {
    Modal.confirm({
      title: "ยืนยันการลบ",
      content: "คุณแน่ใจหรือไม่ที่จะลบค่านิยมนี้?",
      okText: "ใช่",
      cancelText: "ไม่",
      onOk: async () => {
        try {
          setLoading(true);
          await axios.post(
            "https://brain-training-server.onrender.com/api/activity-eight/values/delete",
            {
              nationalId: user.nationalId,
              valueId,
            }
          );

          setValues((prev) => prev.filter((v) => v.id !== valueId));
          message.success("ลบค่านิยมสำเร็จ");
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบค่านิยม");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Handle goal creation
  const handleAddGoal = async () => {
    if (!newGoal.trim()) {
      message.warning("กรุณากรอกเป้าหมาย");
      return;
    }

    if (currentGoal) {
      message.warning("สามารถเพิ่มได้เพียง 1 เป้าหมาย");
      return;
    }

    try {
      setLoading(true);
      const newGoalItem = {
        id: Date.now().toString(),
        text: newGoal.trim(),
        completed: false,
        plans: [],
        obstacles: "",
        commitment: "",
        reward: "",
      };

      await axios.post("https://brain-training-server.onrender.com/api/activity-eight/goal/save", {
        nationalId: user.nationalId,
        goal: newGoalItem,
      });

      setCurrentGoal(newGoalItem);
      setNewGoal("");
      message.success("เพิ่มเป้าหมายสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มเป้าหมาย");
    } finally {
      setLoading(false);
    }
  };

  // Handle plan creation
  const handleAddPlan = async () => {
    if (!newPlan.trim()) {
      message.warning("กรุณากรอกแผนปฏิบัติ");
      return;
    }

    try {
      setLoading(true);
      const newPlanItem = {
        id: Date.now().toString(),
        text: newPlan.trim(),
        completed: false,
      };

      await axios.post("https://brain-training-server.onrender.com/api/activity-eight/plan/save", {
        nationalId: user.nationalId,
        plan: newPlanItem,
      });

      setCurrentGoal((prev) => ({
        ...prev,
        plans: [...prev.plans, newPlanItem],
      }));
      setNewPlan("");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มแผนปฏิบัติ");
    } finally {
      setLoading(false);
    }
  };

  // Handle plan completion
  const handleCompletePlan = async (planId) => {
    try {
      setLoading(true);
      const updatedPlans = currentGoal.plans.map((plan) =>
        plan.id === planId ? { ...plan, completed: true } : plan
      );

      await axios.post("https://brain-training-server.onrender.com/api/activity-eight/plan/save", {
        nationalId: user.nationalId,
        plan: updatedPlans.find((p) => p.id === planId),
      });

      setCurrentGoal((prev) => ({
        ...prev,
        plans: updatedPlans,
      }));
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัพเดทแผนปฏิบัติ");
    } finally {
      setLoading(false);
    }
  };

  // Handle goal completion
  const handleCompleteGoal = async () => {
    try {
      setLoading(true);
      const updatedGoal = {
        ...currentGoal,
        completed: true,
      };

      await axios.post("https://brain-training-server.onrender.com/api/activity-eight/goal/save", {
        nationalId: user.nationalId,
        goal: updatedGoal,
      });

      setCompletedGoals((prev) => [...prev, updatedGoal]);
      setCurrentGoal(null);
      message.success("ยินดีด้วย! คุณทำเป้าหมายนี้สำเร็จแล้ว 🎉");
      setCurrentStep(3); // Go to summary
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
    } finally {
      setLoading(false);
    }
  };

  // Handle plan deletion
  const handleRemovePlan = async (planId) => {
    Modal.confirm({
      title: "ยืนยันการลบ",
      content: "คุณแน่ใจหรือไม่ที่จะลบแผนปฏิบัตินี้?",
      okText: "ใช่",
      cancelText: "ไม่",
      onOk: async () => {
        try {
          setLoading(true);
          await axios.post(
            "https://brain-training-server.onrender.com/api/activity-eight/plan/delete",
            {
              nationalId: user.nationalId,
              planId,
            }
          );

          setCurrentGoal((prev) => ({
            ...prev,
            plans: prev.plans.filter((p) => p.id !== planId),
          }));
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบแผนปฏิบัติ");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Handle goal updates
  const handleUpdateGoal = async () => {
    try {
      setLoading(true);
      const updatedGoal = {
        ...currentGoal,
        obstacles,
        commitment,
        reward,
      };

      await axios.post("https://brain-training-server.onrender.com/api/activity-eight/goal/save", {
        nationalId: user.nationalId,
        goal: updatedGoal,
      });

      setCurrentGoal(updatedGoal);
      message.success("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = () => {
    // ย้ายการตรวจสอบเป้าหมายที่สมบูรณ์ไปที่หน้าสุดท้าย
    if (
      currentStep === 4 &&
      currentGoal &&
      !currentGoal.completed &&
      isGoalComplete(currentGoal)
    ) {
      return true;
    }

    switch (currentStep) {
      case 0: // ขั้นตอนค่านิยม
        if (values.length === 0) {
          message.warning("กรุณาเพิ่มค่านิยม");
          return false;
        }
        if (values.length > 1) {
          message.warning("สามารถเพิ่มค่านิยมได้เพียง 1 รายการ");
          return false;
        }
        return true;

      case 1: // ขั้นตอนเป้าหมาย
        if (!currentGoal?.text) {
          message.warning("กรุณาเพิ่มเป้าหมาย");
          return false;
        }
        return true;

      case 2: // ขั้นตอนแผนปฏิบัติ
        if (!currentGoal.plans || currentGoal.plans.length === 0) {
          message.warning("กรุณาเพิ่มแผนปฏิบัติอย่างน้อย 1 รายการ");
          return false;
        }
        if (!obstacles.trim()) {
          message.warning("กรุณาระบุอุปสรรคที่อาจเกิดขึ้น");
          return false;
        }
        return true;

      case 3: // ขั้นตอนพันธสัญญา
        if (!commitment.trim()) {
          message.warning("กรุณาระบุพันธสัญญา");
          return false;
        }
        if (!reward.trim()) {
          message.warning("กรุณาระบุรางวัล");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    if (validateCurrentStep()) {
      if (currentStep === 3) {
        await handleUpdateGoal();
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // ถ้ามีเป้าหมายที่กำลังดำเนินการอยู่ จะกลับไปหน้าอื่นไม่ได้
    if (currentGoal && !currentGoal.completed) {
      message.warning("คุณมีเป้าหมายที่กำลังดำเนินการอยู่ กรุณาทำให้เสร็จก่อน");
      setCurrentStep(4);
      return;
    }
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    Modal.confirm({
      title: "ยืนยันการเสร็จสิ้นกิจกรรม",
      content: "คุณแน่ใจหรือไม่ว่าต้องการเสร็จสิ้นกิจกรรม?",
      okText: "ใช่",
      cancelText: "ไม่",
      onOk() {
        message.success("เสร็จสิ้นกิจกรรม");
        navigate("/home");
      },
    });
  };

  // Navigation buttons component
  const NavigationButtons = () => {
    const canNavigate = !isGoalComplete(currentGoal) || currentStep === 4;

    return (
      <Row justify="center" style={{ marginTop: 24 }}>
        <Space size="middle">
          {currentStep > 0 && (
            <ActionButton
              className="ghost"
              icon={<LeftOutlined />}
              onClick={handleBack}
              disabled={!canNavigate}
            >
              ย้อนกลับ
            </ActionButton>
          )}

          {currentStep < steps.length - 1 ? (
            <ActionButton
              className="primary"
              icon={<RightOutlined />}
              onClick={handleNext}
              disabled={!canNavigate}
            >
              ถัดไป
            </ActionButton>
          ) : (
            <ActionButton
              className="primary"
              icon={<CheckOutlined />}
              onClick={handleFinish}
            >
              เสร็จสิ้นกิจกรรม
            </ActionButton>
          )}
        </Space>
      </Row>
    );
  };

  return (
    <PageContainer>
      <ContentContainer>
        <PageTitle level={2}>กิจกรรมที่ 8 : พันธสัญญาใจ” ยุติกิจกรรม</PageTitle>

        <Steps
          current={currentStep}
          style={{ marginBottom: 32 }}
          items={steps.map((step) => ({
            title: step.title,
            icon: step.icon,
          }))}
        />

        {/* ถ้ามีเป้าหมายที่กำลังดำเนินการ จะแสดง warning */}

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Step 1: ค่านิยม */}
          {currentStep === 0 && (
            <StyledCard title="ค่านิยมของฉัน">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Alert
                  message="ระบุค่านิยมที่สำคัญสำหรับคุณ"
                  description="ค่านิยมจะเป็นหลักการพื้นฐานในการกำหนดเป้าหมายของคุณ"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <div style={{ marginBottom: 16 }}>
                  <StyledInput
                    placeholder="ค่านิยมของคุณ..."
                    value={newValue.text}
                    onChange={(e) =>
                      setNewValue((prev) => ({ ...prev, text: e.target.value }))
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <StyledTextArea
                    placeholder="อธิบายว่าทำไมค่านิยมนี้ถึงสำคัญกับคุณ..."
                    value={newValue.reason}
                    onChange={(e) =>
                      setNewValue((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                  <ActionButton
                    className="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddValue}
                    style={{ marginTop: 8 }}
                  >
                    เพิ่มค่านิยม
                  </ActionButton>
                </div>

                <AnimatePresence>
                  {values.map((value) => (
                    <ItemCard
                      key={value.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                    >
                      <Row justify="space-between" align="top">
                        <Col flex="1">
                          <Title level={4}>{value.text}</Title>
                          <Paragraph>{value.reason}</Paragraph>
                        </Col>
                        <Col>
                          <Button
                            type="text"
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => handleRemoveValue(value.id)}
                          />
                        </Col>
                      </Row>
                    </ItemCard>
                  ))}
                </AnimatePresence>
              </Space>
            </StyledCard>
          )}

          {/* Step 2: เป้าหมาย */}
          {currentStep === 1 && (
            <StyledCard title="เป้าหมายของฉัน">
              <Alert
                message="หมายเหตุ"
                description="คุณสามารถมีเป้าหมายที่กำลังดำเนินการได้เพียงหนึ่งเป้าหมายเท่านั้น และต้องทำให้เสร็จก่อนที่จะเพิ่มเป้าหมายใหม่"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              {!currentGoal && (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <StyledInput
                      placeholder="เพิ่มเป้าหมายของคุณ..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onPressEnter={handleAddGoal}
                    />
                    <ActionButton
                      className="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddGoal}
                      loading={loading}
                    >
                      เพิ่มเป้าหมาย
                    </ActionButton>
                  </div>
                </Space>
              )}

              {currentGoal && (
                <ItemCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Row justify="space-between" align="middle">
                    <Col flex="1">
                      <Text strong>{currentGoal.text}</Text>
                    </Col>
                  </Row>
                </ItemCard>
              )}
            </StyledCard>
          )}

          {/* Step 3: แผนปฏิบัติ */}
          {currentStep === 2 && currentGoal && (
            <StyledCard title="แผนปฏิบัติ">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <StyledInput
                    placeholder="เพิ่มแผนปฏิบัติ..."
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    onPressEnter={handleAddPlan}
                  />
                  <ActionButton
                    className="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddPlan}
                    loading={loading}
                  >
                    เพิ่มแผน
                  </ActionButton>
                </div>

                <AnimatePresence>
                  {currentGoal.plans.map((plan) => (
                    <PlanItem
                      key={plan.id}
                      style={{
                        background: plan.completed
                          ? `${COLORS.success}10`
                          : COLORS.light,
                        borderLeft: `3px solid ${
                          plan.completed ? COLORS.success : COLORS.primary
                        }`,
                      }}
                    >
                      <Row justify="space-between" align="middle">
                        <Col flex="1">
                          <Text
                            style={{
                              textDecoration: plan.completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {plan.text}
                          </Text>
                        </Col>
                        <Col>
                          <Space>
                            {!plan.completed && (
                              <Button
                                type="text"
                                icon={
                                  <CheckOutlined
                                    style={{ color: COLORS.success }}
                                  />
                                }
                                onClick={() => handleCompletePlan(plan.id)}
                              />
                            )}
                            <Button
                              type="text"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => handleRemovePlan(plan.id)}
                            />
                          </Space>
                        </Col>
                      </Row>
                    </PlanItem>
                  ))}
                </AnimatePresence>

                <StyledTextArea
                  placeholder="อุปสรรคที่อาจเกิดขึ้น..."
                  value={obstacles}
                  onChange={(e) => setObstacles(e.target.value)}
                  rows={4}
                  style={{ marginTop: 16 }}
                />
              </Space>
            </StyledCard>
          )}

          {/* Step 4: พันธสัญญา */}
          {currentStep === 3 && currentGoal && (
            <StyledCard title="พันธสัญญา">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Title level={5}>แผนปฏิบัติ:</Title>
                {currentGoal.plans.map((plan, index) => (
                  <Text key={plan.id}>{`${index + 1}. ${plan.text}`}</Text>
                ))}

                <Title level={5}>อุปสรรคที่อาจเกิดขึ้น:</Title>
                <Text>{obstacles}</Text>

                <Title level={5}>พันธสัญญากับตัวเอง:</Title>
                <StyledTextArea
                  placeholder="สร้างพันธสัญญากับตัวเอง..."
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                  rows={4}
                />

                <Title level={5}>รางวัลที่จะให้ตัวเอง:</Title>
                <StyledInput
                  placeholder="รางวัลเมื่อทำสำเร็จ..."
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                />
              </Space>
            </StyledCard>
          )}

          {/* Step 5: สรุป */}
          {currentStep === 4 && (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* ส่วนแสดงค่านิยม */}
              <StyledCard>
                <Title level={3} style={{ color: COLORS.primary }}>
                  <HeartOutlined style={{ marginRight: 8 , color: COLORS.accent }} />
                  ค่านิยมของฉัน
                </Title>
                <Row gutter={[16, 16]}>
                  {values.map((value) => (
                    <Col xs={24} md={12} lg={8} key={value.id}>
                      <StyledCard
                        hoverable
                        style={{
                          height: "100%",
                          background: `${COLORS.primary}05`,
                          borderLeft: `3px solid ${COLORS.primary}`,
                        }}
                      >
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <Badge.Ribbon text="ค่านิยม" color={COLORS.primary}>
                            <Title level={4} style={{ marginTop: 8 }}>
                              {value.text}
                            </Title>
                          </Badge.Ribbon>
                          <Paragraph
                            style={{
                              background: `${COLORS.background}50`,
                              padding: "12px",
                              borderRadius: "8px",
                              margin: "8px 0",
                            }}
                          >
                            {value.reason}
                          </Paragraph>
                        </Space>
                      </StyledCard>
                    </Col>
                  ))}
                </Row>
              </StyledCard>

              {/* Current Goal Section */}
              {currentGoal && (
                <StyledCard>
                  <Title level={3} style={{ color: COLORS.primary }}>
                    <AimOutlined style={{ marginRight: 8 , color: COLORS.success }} />
                    เป้าหมายปัจจุบัน
                  </Title>
                  <StyledCard
                    type="inner"
                    style={{
                      background: `${COLORS.primary}05`,
                      borderLeft: `3px solid ${COLORS.primary}`,
                    }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Title level={4}>{currentGoal.text}</Title>
                      <Collapse ghost>
                        <Collapse.Panel header="แผนปฏิบัติ" key="1">
                          {currentGoal.plans.map((plan, index) => (
                            <PlanItem
                              key={plan.id}
                              style={{
                                background: plan.completed
                                  ? `${COLORS.success}10`
                                  : COLORS.light,
                              }}
                            >
                              <Text
                                delete={plan.completed}
                                style={{
                                  color: plan.completed
                                    ? COLORS.success
                                    : undefined,
                                }}
                              >
                                {`${index + 1}. ${plan.text}`}
                              </Text>
                            </PlanItem>
                          ))}
                        </Collapse.Panel>
                      </Collapse>

                      {obstacles && (
                        <div>
                          <Text type="secondary">อุปสรรคที่อาจเกิดขึ้น:</Text>
                          <Paragraph
                            style={{
                              background: `${COLORS.warning}10`,
                              padding: 8,
                              borderRadius: 4,
                            }}
                          >
                            {obstacles}
                          </Paragraph>
                        </div>
                      )}

                      {commitment && (
                        <div>
                          <Text type="secondary">พันธสัญญา:</Text>
                          <Paragraph
                            style={{
                              background: `${COLORS.primary}10`,
                              padding: 8,
                              borderRadius: 4,
                            }}
                          >
                            {commitment}
                          </Paragraph>
                        </div>
                      )}

                      {reward && (
                        <div>
                          <Text type="secondary">รางวัล:</Text>
                          <Paragraph
                            style={{
                              background: `${COLORS.gold}10`,
                              padding: 8,
                              borderRadius: 4,
                            }}
                          >
                            {reward}
                          </Paragraph>
                        </div>
                      )}

                      {!currentGoal.completed && (
                        <ActionButton
                          className="primary"
                          icon={<CheckOutlined />}
                          onClick={handleCompleteGoal}
                          block
                        >
                          ทำเป้าหมายนี้สำเร็จแล้ว
                        </ActionButton>
                      )}
                    </Space>
                  </StyledCard>
                </StyledCard>
              )}

              {/* Completed Goals Section */}
              <StyledCard>
                <Title level={3} style={{ color: COLORS.success }}>
                  <StarFilled style={{ marginRight: 8, color: COLORS.gold }} />
                  เป้าหมายที่สำเร็จแล้ว
                </Title>
                <Row gutter={[16, 16]}>
                  {completedGoals.length === 0 ? (
                    <Col span={24}>
                      <Alert
                        message="ยังไม่มีเป้าหมายที่สำเร็จ"
                        type="info"
                        showIcon
                        style={{ borderRadius: 8 }}
                      />
                    </Col>
                  ) : (
                    completedGoals.map((goal) => (
                      <Col xs={24} md={12} lg={8} key={goal.id}>
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <StyledCard
                            hoverable
                            style={{
                              position: "relative",
                              height: "100%",
                              background: `${COLORS.success}05`,
                              borderLeft: `3px solid ${COLORS.success}`,
                            }}
                          >
                            <CompletedStar>
                              <StarFilled />
                            </CompletedStar>

                            <Badge.Ribbon text="สำเร็จ" color={COLORS.success}>
                              <Title
                                level={4}
                                style={{ color: COLORS.success, marginTop: 8 }}
                              >
                                {goal.text}
                              </Title>
                            </Badge.Ribbon>

                            <Collapse ghost>
                              <Collapse.Panel header="รายละเอียด" key="1">
                                <Space
                                  direction="vertical"
                                  style={{ width: "100%" }}
                                >
                                  {goal.plans.map((plan, index) => (
                                    <Text key={plan.id} delete>
                                      {`${index + 1}. ${plan.text}`}
                                    </Text>
                                  ))}

                                  {goal.obstacles && (
                                    <div>
                                      <Text type="secondary">
                                        อุปสรรคที่อาจเกิดขึ้น:
                                      </Text>
                                      <Paragraph
                                        style={{
                                          background: `${COLORS.warning}10`,
                                          padding: 8,
                                          borderRadius: 4,
                                        }}
                                      >
                                        {goal.obstacles}
                                      </Paragraph>
                                    </div>
                                  )}

                                  {goal.commitment && (
                                    <div>
                                      <Text type="secondary">พันธสัญญา:</Text>
                                      <Paragraph
                                        style={{
                                          background: `${COLORS.primary}10`,
                                          padding: 8,
                                          borderRadius: 4,
                                        }}
                                      >
                                        {goal.commitment}
                                      </Paragraph>
                                    </div>
                                  )}

                                  {goal.reward && (
                                    <div>
                                      <Text type="secondary">รางวัล:</Text>
                                      <Paragraph
                                        style={{
                                          background: `${COLORS.gold}10`,
                                          padding: 8,
                                          borderRadius: 4,
                                        }}
                                      >
                                        {goal.reward}
                                      </Paragraph>
                                    </div>
                                  )}
                                </Space>
                              </Collapse.Panel>
                            </Collapse>
                          </StyledCard>
                        </motion.div>
                      </Col>
                    ))
                  )}
                </Row>
              </StyledCard>

              {/* Statistics Section */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <StyledCard>
                    <Statistic
                      title="ค่านิยมทั้งหมด"
                      value={values.length}
                      prefix={
                        <HeartOutlined style={{ color: COLORS.primary }} />
                      }
                    />
                  </StyledCard>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <StyledCard>
                    <Statistic
                      title="เป้าหมายที่สำเร็จ"
                      value={completedGoals.length}
                      prefix={<StarFilled style={{ color: COLORS.gold }} />}
                    />
                  </StyledCard>
                </Col>
                {currentGoal && (
                  <Col xs={24} sm={12} md={8}>
                    <StyledCard>
                      <Statistic
                        title="ความคืบหน้าเป้าหมายปัจจุบัน"
                        value={
                          (currentGoal.plans.filter((p) => p.completed).length /
                            currentGoal.plans.length) *
                          100
                        }
                        suffix="%"
                        precision={1}
                        prefix={
                          <RocketFilled style={{ color: COLORS.accent }} />
                        }
                      />
                    </StyledCard>
                  </Col>
                )}
              </Row>
            </Space>
          )}
        </Space>

        <NavigationButtons />

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
