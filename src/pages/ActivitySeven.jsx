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

const starAnimation = keyframes`
    0% { transform: scale(0) rotate(0deg); }
    50% { transform: scale(1.5) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
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
export default function ActivitySeven() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState([]);
  const [goals, setGoals] = useState([]);
  const [plans, setPlans] = useState({});
  const [obstacles, setObstacles] = useState({});
  const [commitments, setCommitments] = useState({});
  const [rewards, setRewards] = useState({});
  const [completedGoals, setCompletedGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionHistory, setActionHistory] = useState([]);

  // Form states
  const [newValue, setNewValue] = useState({ text: "", reason: "" });
  const [newGoal, setNewGoal] = useState("");
  const [newPlan, setNewPlan] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Steps configuration
  const steps = [
    { title: "ค่านิยม", icon: <HeartOutlined /> },
    { title: "เป้าหมาย", icon: <AimOutlined /> },
    { title: "แผนปฏิบัติ", icon: <RocketFilled /> },
    { title: "พันธสัญญา", icon: <LockOutlined /> },
    { title: "สรุป", icon: <CheckOutlined /> },
  ];

  // ปรับ useEffect ที่ดึงข้อมูล
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/activity-seven/${user.nationalId}`
        );
        const { values, goals, actions } = response.data;

        setValues(values || []);
        setGoals(goals || []);

        // Extract plans, obstacles, commitments, and rewards from goals
        const plansMap = {};
        const obstaclesMap = {};
        const commitmentsMap = {};
        const rewardsMap = {};

        goals?.forEach((goal) => {
          plansMap[goal.id] = goal.plans || [];
          obstaclesMap[goal.id] = goal.obstacles || "";
          commitmentsMap[goal.id] = goal.commitment || "";
          rewardsMap[goal.id] = goal.reward || "";
        });

        setPlans(plansMap);
        setObstacles(obstaclesMap);
        setCommitments(commitmentsMap);
        setRewards(rewardsMap);
        setActionHistory(actions || []);
        setCompletedGoals(goals?.filter((goal) => goal.completed) || []);

        // เช็คว่ามีข้อมูลครบหรือไม่
        if (values?.length > 0 && goals?.length > 0) {
          let isComplete = true;

          // เช็คว่าทุกเป้าหมายมีแผนปฏิบัติและอุปสรรค
          const hasAllPlansAndObstacles = goals.every((goal) => {
            const hasPlans = plansMap[goal.id]?.length > 0;
            const hasObstacles = obstaclesMap[goal.id]?.trim() !== "";
            return hasPlans && hasObstacles;
          });

          // เช็คว่าทุกเป้าหมายมีพันธสัญญาและรางวัล
          const hasAllCommitmentsAndRewards = goals.every((goal) => {
            const hasCommitment = commitmentsMap[goal.id]?.trim() !== "";
            const hasReward = rewardsMap[goal.id]?.trim() !== "";
            return hasCommitment && hasReward;
          });

          isComplete = hasAllPlansAndObstacles && hasAllCommitmentsAndRewards;

          // ถ้ามีข้อมูลครบ ให้ไปที่หน้าสรุป
          if (isComplete) {
            setCurrentStep(4); // ไปที่หน้าสรุป
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

  // Values handlers
  const handleAddValue = async () => {
    if (!newValue.text.trim() || !newValue.reason.trim()) {
      message.warning("กรุณากรอกค่านิยมและเหตุผลให้ครบถ้วน");
      return;
    }

    const newValueItem = {
      id: Date.now().toString(),
      text: newValue.text.trim(),
      reason: newValue.reason.trim(),
    };

    try {
      setLoading(true);
      await axios.post("https://brain-training-server.onrender.com/api/activity-seven/values/save", {
        nationalId: user.nationalId,
        values: [...values, newValueItem],
      });

      setValues((prev) => [...prev, newValueItem]);
      setNewValue({ text: "", reason: "" });
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
          const valueToRemove = values.find((v) => v.id === valueId);

          await axios.post("https://brain-training-server.onrender.com/api/activity-seven/delete", {
            nationalId: user.nationalId,
            itemId: valueId,
            itemType: "value",
            text: valueToRemove.text,
          });

          setValues((prev) => prev.filter((v) => v.id !== valueId));
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบค่านิยม");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Goals handlers
  const handleAddGoal = async () => {
    if (!newGoal.trim()) {
      message.warning("กรุณากรอกเป้าหมาย");
      return;
    }

    const newGoalItem = {
      id: Date.now().toString(),
      text: newGoal.trim(),
      completed: false,
      plans: [],
      obstacles: "",
      commitment: "",
      reward: "",
    };

    try {
      setLoading(true);
      await axios.post("https://brain-training-server.onrender.com/api/activity-seven/goals/save", {
        nationalId: user.nationalId,
        goals: [...goals, newGoalItem],
      });

      setGoals((prev) => [...prev, newGoalItem]);
      setNewGoal("");
      message.success("เพิ่มเป้าหมายสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มเป้าหมาย");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGoal = async (goalId) => {
    Modal.confirm({
      title: "ยืนยันการลบ",
      content:
        "คุณแน่ใจหรือไม่ที่จะลบเป้าหมายนี้? แผนปฏิบัติและข้อมูลที่เกี่ยวข้องจะถูกลบไปด้วย",
      okText: "ใช่",
      cancelText: "ไม่",
      onOk: async () => {
        try {
          setLoading(true);
          const goalToRemove = goals.find((g) => g.id === goalId);

          await axios.post("https://brain-training-server.onrender.com/api/activity-seven/delete", {
            nationalId: user.nationalId,
            itemId: goalId,
            itemType: "goal",
            text: goalToRemove.text,
          });

          setGoals((prev) => prev.filter((g) => g.id !== goalId));

          // Clear related data
          const newPlans = { ...plans };
          delete newPlans[goalId];
          setPlans(newPlans);

          const newObstacles = { ...obstacles };
          delete newObstacles[goalId];
          setObstacles(newObstacles);

          const newCommitments = { ...commitments };
          delete newCommitments[goalId];
          setCommitments(newCommitments);

          const newRewards = { ...rewards };
          delete newRewards[goalId];
          setRewards(newRewards);
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบเป้าหมาย");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Plans handlers
  const handleAddPlan = async (goalId) => {
    if (!newPlan.trim()) {
      message.warning("กรุณากรอกแผนปฏิบัติ");
      return;
    }

    const newPlanItem = {
      id: Date.now().toString(),
      text: newPlan.trim(),
    };

    try {
      setLoading(true);
      const updatedPlans = {
        ...plans,
        [goalId]: [...(plans[goalId] || []), newPlanItem],
      };

      // อัพเดทข้อมูลเป้าหมายพร้อมแผนปฏิบัติ
      const updatedGoals = goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              plans: updatedPlans[goalId], // เพิ่มแผนปฏิบัติ
              obstacles: obstacles[goal.id] || "", // เพิ่มอุปสรรค
              commitment: commitments[goal.id] || "", // เพิ่มพันธสัญญา
              reward: rewards[goal.id] || "", // เพิ่มรางวัล
            }
          : goal
      );

      // บันทึกลงฐานข้อมูล
      await axios.post("https://brain-training-server.onrender.com/api/activity-seven/goals/save", {
        nationalId: user.nationalId,
        goals: updatedGoals,
      });

      setPlans(updatedPlans);
      setGoals(updatedGoals); // อัพเดท state ของ goals ด้วย
      setNewPlan("");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มแผนปฏิบัติ");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlan = async (goalId, planId) => {
    Modal.confirm({
      title: "ยืนยันการลบ",
      content: "คุณแน่ใจหรือไม่ที่จะลบแผนปฏิบัตินี้?",
      okText: "ใช่",
      cancelText: "ไม่",
      onOk: async () => {
        try {
          setLoading(true);
          const planToRemove = plans[goalId].find((p) => p.id === planId);

          // บันทึกประวัติการลบ
          await axios.post("https://brain-training-server.onrender.com/api/activity-seven/delete", {
            nationalId: user.nationalId,
            itemId: planId,
            itemType: "plan",
            text: planToRemove.text,
          });

          const updatedPlans = {
            ...plans,
            [goalId]: plans[goalId].filter((p) => p.id !== planId),
          };

          // อัพเดทข้อมูลเป้าหมายพร้อมแผนปฏิบัติที่เหลือ
          const updatedGoals = goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  plans: updatedPlans[goalId],
                  obstacles: obstacles[goal.id] || "",
                  commitment: commitments[goal.id] || "",
                  reward: rewards[goal.id] || "",
                }
              : goal
          );

          // บันทึกลงฐานข้อมูล
          await axios.post(
            "https://brain-training-server.onrender.com/api/activity-seven/goals/save",
            {
              nationalId: user.nationalId,
              goals: updatedGoals,
            }
          );

          setPlans(updatedPlans);
          setGoals(updatedGoals);
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบแผนปฏิบัติ");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // เพิ่มฟังก์ชันสำหรับบันทึกอุปสรรค
  const handleObstacleChange = async (goalId, value) => {
    try {
      const updatedGoals = goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              plans: plans[goal.id] || [],
              obstacles: value,
              commitment: commitments[goal.id] || "",
              reward: rewards[goal.id] || "",
            }
          : goal
      );

      await axios.post("https://brain-training-server.onrender.com/api/activity-seven/goals/save", {
        nationalId: user.nationalId,
        goals: updatedGoals,
      });

      setObstacles((prev) => ({
        ...prev,
        [goalId]: value,
      }));
      setGoals(updatedGoals);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกอุปสรรค");
    }
  };

  // Complete goal handler
  const handleComplete = async (goalId) => {
    try {
      setLoading(true);
      const updatedGoals = goals.map((goal) => {
        if (goal.id === goalId) {
          const completed = !goal.completed;
          return { ...goal, completed };
        }
        return goal;
      });

      await axios.post("https://brain-training-server.onrender.com/api/activity-seven/goals/save", {
        nationalId: user.nationalId,
        goals: updatedGoals,
      });

      setGoals(updatedGoals);
      setCompletedGoals(updatedGoals.filter((goal) => goal.completed));

      const completedGoal = updatedGoals.find((g) => g.id === goalId);
      if (completedGoal.completed) {
        message.success("ยินดีด้วย! คุณทำเป้าหมายนี้สำเร็จแล้ว 🎉");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    if (validateCurrentStep()) {
      try {
        setLoading(true);
        if (currentStep === 3) {
          // After commitments step
          // Save all current data
          const updatedGoals = goals.map((goal) => ({
            ...goal,
            obstacles: obstacles[goal.id],
            commitment: commitments[goal.id],
            reward: rewards[goal.id],
          }));

          await axios.post(
            "https://brain-training-server.onrender.com/api/activity-seven/goals/save",
            {
              nationalId: user.nationalId,
              goals: updatedGoals,
            }
          );

          // Fetch summary data
          const summaryResponse = await axios.get(
            `https://brain-training-server.onrender.com/api/activity-seven/summary/${user.nationalId}`
          );
          setActionHistory(summaryResponse.data.actions);
        }
        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
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

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // ขั้นตอนค่านิยม
        if (values.length === 0) {
          message.warning("กรุณาเพิ่มค่านิยมอย่างน้อย 1 รายการ");
          return false;
        }
        return true;

      case 1: // ขั้นตอนเป้าหมาย
        if (goals.length === 0) {
          message.warning("กรุณาเพิ่มเป้าหมายอย่างน้อย 1 รายการ");
          return false;
        }
        return true;

      case 2: // ขั้นตอนแผนปฏิบัติ
        const missingPlans = goals.find(
          (goal) => !plans[goal.id] || plans[goal.id].length === 0
        );
        const missingObstacles = goals.find(
          (goal) => !obstacles[goal.id] || obstacles[goal.id].trim() === ""
        );

        if (missingPlans) {
          message.warning("กรุณาเพิ่มแผนปฏิบัติให้ครบทุกเป้าหมาย");
          return false;
        }
        if (missingObstacles) {
          message.warning("กรุณาระบุอุปสรรคที่อาจเกิดขึ้นให้ครบทุกเป้าหมาย");
          return false;
        }
        return true;

      case 3: // ขั้นตอนพันธสัญญา
        const missingCommitments = goals.find(
          (goal) => !commitments[goal.id] || commitments[goal.id].trim() === ""
        );
        const missingRewards = goals.find(
          (goal) => !rewards[goal.id] || rewards[goal.id].trim() === ""
        );

        if (missingCommitments) {
          message.warning("กรุณาระบุพันธสัญญาให้ครบทุกเป้าหมาย");
          return false;
        }
        if (missingRewards) {
          message.warning("กรุณาระบุรางวัลให้ครบทุกเป้าหมาย");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleEdit = (goalId) => {
    setSelectedGoal(goalId);
    setCurrentStep(2); // พาไปที่ขั้นแผนปฏิบัติ
  };

  // Navigation buttons component
  const NavigationButtons = () => (
    <Row justify="center" style={{ marginTop: 24 }}>
      <Space size="middle">
        {currentStep > 0 && (
          <ActionButton
            className="ghost"
            icon={<LeftOutlined />}
            onClick={handleBack}
          >
            ย้อนกลับ
          </ActionButton>
        )}

        {currentStep < steps.length - 1 ? (
          <ActionButton
            className="primary"
            icon={<RightOutlined />}
            onClick={handleNext}
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

  // Helper functions for summary view
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

  const sortByTimestamp = (actions) => {
    return [...actions].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  // Utility Components
  const StatisticCard = ({ title, value, total, icon, color }) => (
    <StyledCard style={{ height: "100%" }}>
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
    </StyledCard>
  );

  return (
    <PageContainer>
      <ContentContainer>
      <PageTitle level={2}>กิจกรรมที่ 7 : สู่ฝัน ความสำเร็จ"</PageTitle>

        <Steps
          current={currentStep}
          style={{ marginBottom: 32 }}
          items={steps.map((step) => ({
            title: step.title,
            icon: step.icon,
          }))}
        />

        {/* Content for each step */}
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {currentStep === 0 && (
            <StyledCard title="ค่านิยมของฉัน">
              <Alert
                message="ระยะเวลาในการทำกิจกรรม 50 นาที"
                type="info"
                showIcon
                style={{ marginBottom: 16, borderRadius: 8 }}
              />

              <Space direction="vertical" style={{ width: "100%" }}>
                <StyledInput
                  placeholder="ค่านิยมของคุณ..."
                  value={newValue.text}
                  onChange={(e) =>
                    setNewValue((prev) => ({ ...prev, text: e.target.value }))
                  }
                />
                <StyledTextArea
                  placeholder="อธิบายว่าทำไมค่านิยมนี้ถึงสำคัญกับคุณ..."
                  value={newValue.reason}
                  onChange={(e) =>
                    setNewValue((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  rows={4}
                />
                <ActionButton
                  className="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddValue}
                  loading={loading}
                >
                  เพิ่มค่านิยม
                </ActionButton>

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

                <AnimatePresence>
                  {goals
                    .filter((goal) => !goal.completed)
                    .map((goal) => (
                      <ItemCard
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                      >
                        <Row justify="space-between" align="middle">
                          <Col flex="1">
                            <Text>{goal.text}</Text>
                          </Col>
                          <Col>
                            <Button
                              type="text"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => handleRemoveGoal(goal.id)}
                            />
                          </Col>
                        </Row>
                      </ItemCard>
                    ))}
                </AnimatePresence>
              </Space>
            </StyledCard>
          )}
          {/* Step 3: แผนปฏิบัติ */}
          {currentStep === 2 && (
            <StyledCard title="แผนปฏิบัติ">
              {goals
                .filter((goal) => !goal.completed) // แสดงเฉพาะเป้าหมายที่ยังไม่สำเร็จ
                .map((goal) => (
                  <Collapse
                    key={goal.id}
                    style={{
                      marginBottom: 16,
                      background: "none",
                      border: "none",
                    }}
                  >
                    <Collapse.Panel
                      header={<Text strong>{goal.text}</Text>}
                      key={goal.id}
                      style={{
                        background: COLORS.light,
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div
                          style={{ display: "flex", gap: 8, marginBottom: 16 }}
                        >
                          <StyledInput
                            placeholder="เพิ่มแผนปฏิบัติ..."
                            value={newPlan}
                            onChange={(e) => setNewPlan(e.target.value)}
                            onPressEnter={() => handleAddPlan(goal.id)}
                          />
                          <ActionButton
                            className="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddPlan(goal.id)}
                            loading={loading}
                          >
                            เพิ่มแผน
                          </ActionButton>
                        </div>

                        {(plans[goal.id] || []).map((plan, index) => (
                          <PlanItem key={plan.id}>
                            <Row justify="space-between" align="middle">
                              <Col flex="1">
                                <Text>{`${index + 1}. ${plan.text}`}</Text>
                              </Col>
                              <Col>
                                <Button
                                  type="text"
                                  danger
                                  icon={<CloseOutlined />}
                                  onClick={() =>
                                    handleRemovePlan(goal.id, plan.id)
                                  }
                                />
                              </Col>
                            </Row>
                          </PlanItem>
                        ))}

                        <StyledTextArea
                          placeholder="อุปสรรคที่อาจเกิดขึ้น..."
                          value={obstacles[goal.id] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setObstacles((prev) => ({
                              ...prev,
                              [goal.id]: value,
                            }));
                          }}
                          onBlur={(e) =>
                            handleObstacleChange(goal.id, e.target.value)
                          }
                          rows={4}
                        />
                      </Space>
                    </Collapse.Panel>
                  </Collapse>
                ))}
            </StyledCard>
          )}
          {/* Step 4: พันธสัญญา */}
          {currentStep === 3 && (
            <StyledCard title="พันธสัญญา">
              {goals
                .filter((goal) => !goal.completed) // แสดงเฉพาะเป้าหมายที่ยังไม่สำเร็จ
                .map((goal) => (
                  <StyledCard
                    key={goal.id}
                    type="inner"
                    title={goal.text}
                    style={{ marginBottom: 16 }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Title level={5}>แผนปฏิบัติ:</Title>
                      {(plans[goal.id] || []).map((plan, index) => (
                        <Text key={plan.id}>{`${index + 1}. ${
                          plan.text
                        }`}</Text>
                      ))}

                      <Title level={5}>อุปสรรคที่อาจเกิดขึ้น:</Title>
                      <Text>{obstacles[goal.id] || "-"}</Text>

                      <Title level={5}>พันธสัญญากับตัวเอง:</Title>
                      <StyledTextArea
                        placeholder="สร้างพันธสัญญากับตัวเอง..."
                        value={commitments[goal.id] || ""}
                        onChange={(e) =>
                          setCommitments((prev) => ({
                            ...prev,
                            [goal.id]: e.target.value,
                          }))
                        }
                        rows={4}
                      />

                      <Title level={5}>รางวัลที่จะให้ตัวเอง:</Title>
                      <StyledInput
                        placeholder="รางวัลเมื่อทำสำเร็จ..."
                        value={rewards[goal.id] || ""}
                        onChange={(e) =>
                          setRewards((prev) => ({
                            ...prev,
                            [goal.id]: e.target.value,
                          }))
                        }
                      />
                    </Space>
                  </StyledCard>
                ))}
            </StyledCard>
          )}
          {/* Step 5: สรุป */}
          {currentStep === 4 && (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <StyledCard>
                <Title
                  level={3}
                  style={{ color: COLORS.primary, marginBottom: 24 }}
                >
                  <HeartOutlined style={{ marginRight: 8 }} />
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
                          position: "relative",
                        }}
                        actions={[
                          <Tooltip title="ลบ" key="delete">
                            <Button
                              type="text"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => handleRemoveValue(value.id)}
                            />
                          </Tooltip>,
                        ]}
                      >
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <Badge.Ribbon
                            text="ค่านิยม"
                            color={COLORS.primary}
                            style={{ borderRadius: "4px" }}
                          >
                            <Title
                              level={4}
                              style={{ color: COLORS.dark, marginTop: 8 }}
                            >
                              {value.text}
                            </Title>
                          </Badge.Ribbon>
                          <Paragraph
                            style={{
                              color: COLORS.dark,
                              background: `${COLORS.background}50`,
                              padding: "12px",
                              borderRadius: "8px",
                              margin: "8px 0",
                            }}
                          >
                            <Text
                              type="secondary"
                              style={{
                                fontSize: "12px",
                                display: "block",
                                marginBottom: "4px",
                              }}
                            >
                              เหตุผล
                            </Text>
                            {value.reason}
                          </Paragraph>
                        </Space>
                      </StyledCard>
                    </Col>
                  ))}
                </Row>
              </StyledCard>

              {/* ส่วนแสดงเป้าหมายและแผนปฏิบัติ */}
              <StyledCard>
                <Tabs
                  defaultActiveKey="inProgress"
                  type="card"
                  size="large"
                  items={[
                    {
                      key: "inProgress",
                      label: (
                        <span>
                          <RocketFilled style={{ marginRight: 8 }} />
                          กำลังดำเนินการ
                        </span>
                      ),
                      children: (
                        <>
                          <Row gutter={[16, 16]}>
                            {/* ปุ่มสร้างเป้าหมายใหม่อยู่ด้านบนเสมอ */}
                            <Col span={24} style={{ marginBottom: 16 }}>
                              <ActionButton
                                className="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setCurrentStep(0)} // พาไปที่หน้าค่านิยม
                                block
                              >
                                สร้างเป้าหมายใหม่
                              </ActionButton>
                            </Col>

                            {/* แสดงข้อความถ้าไม่มีเป้าหมายที่กำลังดำเนินการ */}
                            {goals.filter((goal) => !goal.completed).length ===
                              0 && (
                              <Col
                                span={24}
                                style={{
                                  textAlign: "center",
                                  padding: "20px 0",
                                }}
                              >
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "16px" }}
                                >
                                  ไม่มีเป้าหมายที่กำลังดำเนินการอยู่
                                </Text>
                              </Col>
                            )}

                            {/* แสดงเป้าหมายที่กำลังดำเนินการ */}
                            {goals
                              .filter((goal) => !goal.completed)
                              .map((goal) => (
                                <Col xs={24} md={12} lg={8} key={goal.id}>
                                  <StyledCard
                                    hoverable
                                    style={{
                                      height: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                    actions={[
                                      <Tooltip title="ทำสำเร็จ" key="complete">
                                        <Button
                                          type="text"
                                          icon={
                                            <CheckOutlined
                                              style={{ color: COLORS.success }}
                                            />
                                          }
                                          onClick={() =>
                                            handleComplete(goal.id)
                                          }
                                        />
                                      </Tooltip>,
                                      <Tooltip title="แก้ไข" key="edit">
                                        <Button
                                          type="text"
                                          icon={
                                            <EditOutlined
                                              style={{ color: COLORS.primary }}
                                            />
                                          }
                                          onClick={() => handleEdit(goal.id)}
                                        />
                                      </Tooltip>,
                                      <Tooltip title="ลบ" key="delete">
                                        <Button
                                          type="text"
                                          danger
                                          icon={<CloseOutlined />}
                                          onClick={() =>
                                            handleRemoveGoal(goal.id)
                                          }
                                        />
                                      </Tooltip>,
                                    ]}
                                  >
                                    <Title
                                      level={4}
                                      style={{ color: COLORS.primary }}
                                    >
                                      {goal.text}
                                    </Title>

                                    <Collapse
                                      ghost
                                      style={{ marginBottom: 16 }}
                                      defaultActiveKey={["plans"]}
                                    >
                                      <Collapse.Panel
                                        header={
                                          <Space>
                                            <Text
                                              strong
                                              style={{ color: COLORS.dark }}
                                            >
                                              แผนปฏิบัติ
                                            </Text>
                                          </Space>
                                        }
                                        key="plans"
                                      >
                                        {(plans[goal.id] || []).map(
                                          (plan, index) => (
                                            <PlanItem
                                              key={plan.id}
                                              style={{
                                                background: `${COLORS.background}50`,
                                                borderLeft: `3px solid ${COLORS.primary}`,
                                              }}
                                            >
                                              <Row
                                                justify="space-between"
                                                align="middle"
                                              >
                                                <Col flex="1">
                                                  <Text>{`${index + 1}. ${
                                                    plan.text
                                                  }`}</Text>
                                                </Col>
                                              </Row>
                                            </PlanItem>
                                          )
                                        )}
                                      </Collapse.Panel>
                                    </Collapse>

                                    {obstacles[goal.id] && (
                                      <div style={{ marginTop: 16 }}>
                                        <Text
                                          type="secondary"
                                          style={{ fontSize: "12px" }}
                                        >
                                          อุปสรรคที่อาจเกิดขึ้น
                                        </Text>
                                        <Paragraph
                                          style={{
                                            background: `${COLORS.warning}10`,
                                            padding: "8px",
                                            borderRadius: "4px",
                                            marginTop: "4px",
                                          }}
                                        >
                                          {obstacles[goal.id]}
                                        </Paragraph>
                                      </div>
                                    )}

                                    {commitments[goal.id] && (
                                      <div style={{ marginTop: 16 }}>
                                        <Text
                                          type="secondary"
                                          style={{ fontSize: "12px" }}
                                        >
                                          พันธสัญญา
                                        </Text>
                                        <Paragraph
                                          style={{
                                            background: `${COLORS.primary}10`,
                                            padding: "8px",
                                            borderRadius: "4px",
                                            marginTop: "4px",
                                          }}
                                        >
                                          {commitments[goal.id]}
                                        </Paragraph>
                                      </div>
                                    )}

                                    {rewards[goal.id] && (
                                      <div style={{ marginTop: 16 }}>
                                        <Text
                                          type="secondary"
                                          style={{ fontSize: "12px" }}
                                        >
                                          รางวัล
                                        </Text>
                                        <Paragraph
                                          style={{
                                            background: `${COLORS.gold}10`,
                                            padding: "8px",
                                            borderRadius: "4px",
                                            marginTop: "4px",
                                          }}
                                        >
                                          {rewards[goal.id]}
                                        </Paragraph>
                                      </div>
                                    )}
                                  </StyledCard>
                                </Col>
                              ))}
                          </Row>
                        </>
                      ),
                    },
                    {
                      key: "completed",
                      label: (
                        <span>
                          <StarFilled
                            style={{ marginRight: 8, color: COLORS.gold }}
                          />
                          สำเร็จแล้ว
                        </span>
                      ),
                      children: (
                        <Row gutter={[16, 16]}>
                          {goals
                            .filter((goal) => goal.completed)
                            .map((goal) => (
                              <Col xs={24} md={12} lg={8} key={goal.id}>
                                <motion.div
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <StyledCard
                                    hoverable
                                    style={{
                                      height: "100%",
                                      background: `${COLORS.success}05`,
                                      borderLeft: `3px solid ${COLORS.success}`,
                                    }}
                                  >
                                    <CompletedStar>
                                      <StarFilled />
                                    </CompletedStar>
                                    <Title
                                      level={4}
                                      style={{ color: COLORS.success }}
                                    >
                                      {goal.text}
                                    </Title>
                                    {(plans[goal.id] || []).map(
                                      (plan, index) => (
                                        <PlanItem
                                          key={plan.id}
                                          style={{
                                            background: `${COLORS.success}10`,
                                            borderColor: `${COLORS.success}30`,
                                          }}
                                        >
                                          <Text delete>{`${index + 1}. ${
                                            plan.text
                                          }`}</Text>
                                        </PlanItem>
                                      )
                                    )}
                                  </StyledCard>
                                </motion.div>
                              </Col>
                            ))}
                        </Row>
                      ),
                    },
                  ]}
                />
              </StyledCard>

              {/* ส่วนแสดงสถิติสรุป */}
              <Row justify="center" gutter={[16, 16]} style={{ width: "100%" }}>
                <Col xs={24} sm={12} lg={6}>
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
                <Col xs={24} sm={12} lg={6}>
                  <StyledCard>
                    <Statistic
                      title="เป้าหมายทั้งหมด"
                      value={goals.length}
                      prefix={
                        <AimOutlined style={{ color: COLORS.secondary }} />
                      }
                    />
                  </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StyledCard>
                    <Statistic
                      title="เป้าหมายที่สำเร็จ"
                      value={goals.filter((goal) => goal.completed).length}
                      prefix={<StarFilled style={{ color: COLORS.gold }} />}
                    />
                  </StyledCard>
                </Col>
              </Row>
            </Space>
          )}{" "}
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
