// ActivitySix.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Space,
  Typography,
  Button,
  Steps,
  Input,
  message,
  Tabs,
} from "antd";
import {
  CheckOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Color Constants
const COLORS = {
  primary: "#7c3aed",
  secondary: "#a78bfa",
  background: "#7c3aed10",
  dark: "#1f2937",
  light: "#f8fafc",
  shadow: "rgba(17, 12, 46, 0.1)",
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${COLORS.background};
  padding: 40px 24px;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out;
`;

const StyledCard = styled(Card)`
  background: ${COLORS.light};
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  margin-bottom: 24px;

  .ant-card-head {
    border-bottom: 1px solid ${COLORS.background};
  }

  .ant-card-body {
    padding: 24px;
  }
`;

// เพิ่ม styled component ใหม่
const GoalTypeContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

// ปรับ GoalTypeButton
const GoalTypeButton = styled(Button)`
  flex: 1;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  position: relative;

  &.type-short {
    background: ${(props) => (props.active ? COLORS.primary : "white")};
    border-color: ${COLORS.primary};
    color: ${(props) => (props.active ? "white" : COLORS.primary)};

    &:hover {
      background: ${(props) =>
        props.active ? COLORS.secondary : COLORS.background};
      border-color: ${COLORS.secondary};
    }
  }

  &.type-long {
    background: ${(props) => (props.active ? COLORS.primary : "white")};
    border-color: ${COLORS.primary};
    color: ${(props) => (props.active ? "white" : COLORS.primary)};

    &:hover {
      background: ${(props) =>
        props.active ? COLORS.secondary : COLORS.background};
      border-color: ${COLORS.secondary};
    }
  }
`;

const SlideContainer = styled.div`
  overflow: hidden;
  margin-top: 24px;
`;

const SlideContent = styled.div`
  transform: translateX(
    ${(props) => (props.slide === "short" ? "0" : "-100%")}
  );
  transition: transform 0.3s ease-in-out;
  display: flex;
  width: 200%;
`;

const SlidePage = styled.div`
  flex: 0 0 50%;
  padding-right: 16px;
`;

const ExampleBox = styled.div`
  background: ${COLORS.background};
  border: 1px solid ${COLORS.secondary}20;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  font-style: italic;
  color: ${COLORS.dark};
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 8px;
  border: 1px solid ${COLORS.secondary};
  padding: 12px;
  min-height: 120px;
  margin: 16px 0;

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}20;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const ActionButton = styled(Button)`
  min-width: 120px;
  height: 40px;
  border-radius: 8px;
  font-weight: 500;

  &.primary {
    background: ${COLORS.primary};
    border-color: ${COLORS.primary};
    color: white;

    &:hover {
      background: ${COLORS.secondary};
      border-color: ${COLORS.secondary};
    }
  }
`;

const StyledSteps = styled(Steps)`
  .ant-steps-item-process {
    .ant-steps-item-icon {
      background: ${COLORS.primary};
      border-color: ${COLORS.primary};
    }

    .ant-steps-item-title {
      color: ${COLORS.primary} !important;
      font-size: 16px !important;
      font-weight: 500 !important;

      &::after {
        background-color: ${COLORS.primary} !important;
      }
    }
  }

  .ant-steps-item-finish {
    .ant-steps-item-icon {
      background: white;
      border-color: ${COLORS.primary};

      .ant-steps-icon {
        color: ${COLORS.primary};
      }
    }
  }

  .ant-steps-item-title {
    font-size: 16px !important;
    font-weight: 500 !important;
  }
`;

// Step Configuration
const STEPS = [
  {
    title: (
      <span style={{ fontSize: "10px", fontWeight: "500" }}>ด้านครอบครัว</span>
    ),
    category: "family",
    examples: [
      "จดจำวันเกิดและวันสำคัญของสมาชิกในครอบครัวได้ทุกคน",
      "พาครอบครัวไปท่องเที่ยวในสถานที่ที่ทุกคนต้องการไป",
      "จัดเวลาทานข้าวร่วมกันกับครอบครัวอย่างน้อยสัปดาห์ละ 3 วัน",
    ],
  },
  {
    title: (
      <span style={{ fontSize: "10px", fontWeight: "500" }}>
        ด้านการงาน/การศึกษา
      </span>
    ),
    category: "work",
    examples: [
      "จดจำขั้นตอนการทำงานสำคัญได้อย่างแม่นยำ",
      "เรียนรู้ทักษะใหม่ที่จำเป็นต่อการทำงาน",
      "พัฒนาความสามารถในการจดจำข้อมูลสำคัญของลูกค้า",
    ],
  },
  {
    title: (
      <span style={{ fontSize: "10px", fontWeight: "500" }}>ด้านสังคม</span>
    ),
    category: "social",
    examples: [
      "จดจำชื่อและรายละเอียดสำคัญของเพื่อนใหม่ที่พบ",
      "เข้าร่วมกิจกรรมกลุ่มที่สนใจอย่างน้อยเดือนละครั้ง",
      "รักษาการติดต่อกับเพื่อนเก่าอย่างสม่ำเสมอ",
    ],
  },
  {
    title: (
      <span style={{ fontSize: "10px", fontWeight: "500" }}>
        ด้านการพักผ่อน
      </span>
    ),
    category: "leisure",
    examples: [
      "ทำกิจกรรมที่ช่วยฝึกความจำในยามว่าง เช่น เล่นเกมฝึกสมอง",
      "จัดตารางเวลาพักผ่อนที่เหมาะสม",
      "หากิจกรรมยามว่างใหม่ๆ ที่ช่วยพัฒนาความจำ",
    ],
  },
  {
    title: (
      <span style={{ fontSize: "10px", fontWeight: "500" }}>ด้านสุขภาพ</span>
    ),
    category: "health",
    examples: [
      "จดจำตารางการทานยาได้อย่างแม่นยำ",
      "จดจำและปฏิบัติตามคำแนะนำด้านสุขภาพจากแพทย์",
      "วางแผนและจดจำตารางการออกกำลังกายประจำสัปดาห์",
    ],
  },
  {
    title: (
      <span style={{ fontSize: "10px", fontWeight: "500" }}>ด้านจิตวิญญาณ</span>
    ),
    category: "spiritual",
    examples: [
      "จดจำบทสวดมนต์หรือข้อคิดที่สร้างกำลังใจ",
      "ฝึกสมาธิเพื่อพัฒนาความจำอย่างสม่ำเสมอ",
      "จดบันทึกและทบทวนประสบการณ์ที่สร้างแรงบันดาลใจ",
    ],
  },
  {
    title: <span style={{ fontSize: "10px", fontWeight: "500" }}>สรุป</span>,
    category: "summary",
  },
];

// Goal Types Configuration
const GOAL_TYPES = {
  short: {
    title: "เป้าหมายระยะสั้น (1-3 เดือน)",
    icon: <ClockCircleOutlined />,
    className: "type-short",
  },
  long: {
    title: "เป้าหมายระยะยาว (6-12 เดือน)",
    icon: <CalendarOutlined />,
    className: "type-long",
  },
};

// Initial States
const INITIAL_GOAL_STATE = {
  type: null, // 'short' หรือ 'long'
  text: "",
  category: "",
};

const INITIAL_GOALS_STATE = {
  family: { short: [], long: [] },
  work: { short: [], long: [] },
  social: { short: [], long: [] },
  leisure: { short: [], long: [] },
  health: { short: [], long: [] },
  spiritual: { short: [], long: [] },
};

export default function ActivitySix() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [currentStep, setCurrentStep] = useState(0);
  const [goals, setGoals] = useState(INITIAL_GOALS_STATE);
  const [currentGoals, setCurrentGoals] = useState({
    short: "",
    long: "",
  });
  const [selectedType, setSelectedType] = useState("short");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing goals when component mounts
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user?.nationalId) {
        console.warn("No user ID available");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/life-design/${user.nationalId}`
        );

        if (response.data?.categories) {
          const formattedGoals = { ...INITIAL_GOALS_STATE };
          response.data.categories.forEach((category) => {
            formattedGoals[category.name] = {
              short: category.shortTermGoals || [],
              long: category.longTermGoals || [],
            };
          });
          console.log("Formatted goals:", formattedGoals); // เพิ่ม log
          setGoals(formattedGoals);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user?.nationalId]);

  // Update currentGoals when step changes
  useEffect(() => {
    if (goals[STEPS[currentStep]?.category]) {
      const currentCategory = STEPS[currentStep].category;
      setCurrentGoals({
        short: goals[currentCategory].latestShortGoal || "",
        long: goals[currentCategory].latestLongGoal || "",
      });
    }
  }, [currentStep, goals]);

  // Event Handlers
  const handleGoalTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleGoalTextChange = (type, text) => {
    setCurrentGoals((prev) => ({
      ...prev,
      [type]: text,
    }));
  };
  const handleSaveGoal = async () => {
    if (!user?.nationalId) {
      message.warning("กรุณาเข้าสู่ระบบก่อนทำกิจกรรม");
      return;
    }

    if (!currentGoals.short.trim() || !currentGoals.long.trim()) {
      message.warning("กรุณากรอกเป้าหมายทั้งระยะสั้นและระยะยาว");
      return;
    }

    try {
      setLoading(true);
      const currentStepData = STEPS[currentStep];

      const data = {
        nationalId: user.nationalId,
        category: currentStepData.category,
        shortTermGoal: currentGoals.short,
        longTermGoal: currentGoals.long,
      };

      const response = await axios.post(
        "https://brain-training-server.onrender.com/api/life-design/save",
        data
      );

      if (response.data.success) {
        // อัพเดต goals state
        setGoals((prev) => {
          const updatedGoals = { ...prev };
          const currentCategory = currentStepData.category;

          if (!updatedGoals[currentCategory]) {
            updatedGoals[currentCategory] = { short: [], long: [] };
          }

          updatedGoals[currentCategory] = {
            short: [
              ...(updatedGoals[currentCategory].short || []),
              { text: currentGoals.short },
            ],
            long: [
              ...(updatedGoals[currentCategory].long || []),
              { text: currentGoals.long },
            ],
          };

          console.log("Updated goals:", updatedGoals); // เพิ่ม log
          return updatedGoals;
        });

        message.success("บันทึกเป้าหมายสำเร็จ");
      }
    } catch (error) {
      console.error("Error saving goals:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      if (!currentGoals.short.trim() || !currentGoals.long.trim()) {
        message.warning("กรุณากรอกเป้าหมายทั้งระยะสั้นและระยะยาว");
        return;
      }

      await handleSaveGoal();
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error in handleNext:", error);
      message.error("เกิดข้อผิดพลาดในการดำเนินการ");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      message.success("จบกิจกรรมเรียบร้อย");
      navigate("/");
    } catch (error) {
      console.error("Error finishing activity:", error);
      message.error("เกิดข้อผิดพลาดในการจบกิจกรรม");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    try {
      // ดึงข้อมูลของ step แรก
      const firstStepCategory = STEPS[0].category;
      const firstStepGoals = goals[firstStepCategory];

      // ตั้งค่าข้อมูลเริ่มต้นจากข้อมูลที่มีอยู่
      if (firstStepGoals) {
        setCurrentGoals({
          short:
            firstStepGoals.short[firstStepGoals.short.length - 1]?.text || "",
          long: firstStepGoals.long[firstStepGoals.long.length - 1]?.text || "",
        });
      }

      // กลับไปหน้าแรก
      setCurrentStep(0);
      setSelectedType("short");
      setIsEditing(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
      message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  // และเพิ่ม useEffect เพื่อจัดการข้อมูลเมื่อเปลี่ยน step:
  useEffect(() => {
    if (!isEditing) return;

    const currentCategory = STEPS[currentStep].category;
    const currentStepGoals = goals[currentCategory];

    if (currentStepGoals) {
      setCurrentGoals({
        short:
          currentStepGoals.short[currentStepGoals.short.length - 1]?.text || "",
        long:
          currentStepGoals.long[currentStepGoals.long.length - 1]?.text || "",
      });
    }
  }, [currentStep, goals, isEditing]);

  // Render Functions
  const renderGoalTypeSelection = () => (
    <div>
      <GoalTypeContainer>
        {Object.entries(GOAL_TYPES).map(([type, config]) => (
          <GoalTypeButton
            key={type}
            icon={config.icon}
            className={config.className}
            active={selectedType === type}
            onClick={() => handleGoalTypeSelect(type)}
          >
            {config.title}
          </GoalTypeButton>
        ))}
      </GoalTypeContainer>

      {selectedType === "short" && (
        <div>
          <ExampleBox>
            <Title level={5}>ตัวอย่างเป้าหมายระยะสั้น:</Title>
            <ul style={{ marginBottom: 0 }}>
              {STEPS[currentStep].examples.slice(0, 2).map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </ExampleBox>
          <div style={{ marginTop: "20px" }}>
            <Text strong>เป้าหมายระยะสั้นของคุณ:</Text>
            <StyledTextArea
              value={currentGoals.short}
              onChange={(e) => handleGoalTextChange("short", e.target.value)}
              placeholder="พิมพ์เป้าหมายระยะสั้นของคุณที่นี่..."
              disabled={loading}
            />
          </div>
        </div>
      )}

      {selectedType === "long" && (
        <div>
          <ExampleBox>
            <Title level={5}>ตัวอย่างเป้าหมายระยะยาว:</Title>
            <ul style={{ marginBottom: 0 }}>
              {STEPS[currentStep].examples.slice(-2).map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </ExampleBox>
          <div style={{ marginTop: "20px" }}>
            <Text strong>เป้าหมายระยะยาวของคุณ:</Text>
            <StyledTextArea
              value={currentGoals.long}
              onChange={(e) => handleGoalTextChange("long", e.target.value)}
              placeholder="พิมพ์เป้าหมายระยะยาวของคุณที่นี่..."
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderSummary = () => (
    <StyledCard
      title={
        <div
          style={{
            textAlign: "center",
            borderBottom: `2px solid ${COLORS.primary}`,
            paddingBottom: 16,
            marginBottom: 24,
          }}
        >
          <Title
            level={3}
            style={{
              background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 0,
            }}
          >
            สรุปเป้าหมายทั้งหมด
          </Title>
        </div>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {STEPS.slice(0, -1).map((step, index) => {
          const categoryGoals = goals[step.category];
          if (!categoryGoals) return null;

          return (
            <div
              key={step.category}
              style={{
                background: COLORS.background,
                padding: "24px",
                borderRadius: "16px",
                marginBottom: "16px",
                border: `1px solid ${COLORS.secondary}20`,
              }}
            >
              <Title
                level={4}
                style={{
                  color: COLORS.primary,
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderBottom: `1px solid ${COLORS.secondary}40`,
                  paddingBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: COLORS.primary,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </div>
                {step.title}
              </Title>

              <Tabs defaultActiveKey="short">
                <Tabs.TabPane
                  tab={
                    <span>
                      {GOAL_TYPES.short.icon} {GOAL_TYPES.short.title}
                    </span>
                  }
                  key="short"
                >
                  {categoryGoals.short?.map((goal, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "white",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Text>{goal.text}</Text>
                    </div>
                  ))}
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    <span>
                      {GOAL_TYPES.long.icon} {GOAL_TYPES.long.title}
                    </span>
                  }
                  key="long"
                >
                  {categoryGoals.long?.map((goal, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "white",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Text>{goal.text}</Text>
                    </div>
                  ))}
                </Tabs.TabPane>
              </Tabs>
            </div>
          );
        })}

        <NavigationButtons
          style={{
            marginTop: "32px",
            padding: "24px",
            borderTop: `1px solid ${COLORS.secondary}20`,
          }}
        >
          <ActionButton
            icon={<ArrowLeftOutlined />}
            onClick={handleEdit}
            style={{ boxShadow: `0 2px 8px ${COLORS.shadow}` }}
          >
            แก้ไขคำตอบ
          </ActionButton>
          <ActionButton
            className="primary"
            icon={<CheckOutlined />}
            onClick={handleFinish}
            style={{ boxShadow: `0 2px 8px ${COLORS.primary}40` }}
          >
            จบกิจกรรม
          </ActionButton>
        </NavigationButtons>
      </Space>
    </StyledCard>
  );

  // Main Render
  return (
    <PageContainer>
      <ContentContainer>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          กิจกรรมที่ 6: ออกแบบชีวิตด้วยความทรงจำ
        </Title>

        <StyledSteps
          current={currentStep}
          items={STEPS.map((step) => ({
            title: step.title,
          }))}
          style={{ marginBottom: 32 }}
        />

        {currentStep < STEPS.length - 1 ? (
          <StyledCard title={STEPS[currentStep].title}>
            {renderGoalTypeSelection()}

            <NavigationButtons>
              {currentStep > 0 && (
                <ActionButton
                  icon={<ArrowLeftOutlined />}
                  onClick={handlePrevious}
                >
                  ย้อนกลับ
                </ActionButton>
              )}
              <ActionButton
                className="primary"
                onClick={handleNext}
                disabled={
                  !currentGoals.short.trim() || !currentGoals.long.trim()
                }
              >
                {currentStep === STEPS.length - 2 ? "ดูสรุป" : "ถัดไป"}
              </ActionButton>
            </NavigationButtons>
          </StyledCard>
        ) : (
          renderSummary()
        )}

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
