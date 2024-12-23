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
  CalendarOutlined,
  FieldTimeOutlined,
  HistoryOutlined,
  LoadingOutlined,
  CloseOutlined,
  BulbOutlined,
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

// Responsive Breakpoints
const BREAKPOINTS = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components with Mobile Responsiveness
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${COLORS.background};
  padding: 20px 15px;

  @media (min-width: ${BREAKPOINTS.tablet}) {
    padding: 40px 24px;
  }
`;

const ContentContainer = styled.div`
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: ${BREAKPOINTS.tablet}) {
    max-width: 800px;
  }
`;

const StyledCard = styled(Card)`
  background: ${COLORS.light};
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  margin-bottom: 16px;

  .ant-card-head {
    border-bottom: 1px solid ${COLORS.background};
  }

  .ant-card-body {
    padding: 16px;

    @media (min-width: ${BREAKPOINTS.tablet}) {
      padding: 24px;
    }
  }
`;

const GoalTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: ${BREAKPOINTS.mobile}) {
    flex-direction: row;
    gap: 16px;
  }
`;

const ExampleBox = styled.div`
  background: ${COLORS.background};
  border: 1px solid ${COLORS.secondary}30;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  color: ${COLORS.dark};
  font-size: 14px;
  box-shadow: 0 2px 8px ${COLORS.shadow};

  .example-title {
    color: ${COLORS.primary};
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .example-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .example-item {
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    border: 1px solid ${COLORS.secondary}15;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px ${COLORS.shadow};
    }

    &::before {
      content: "•";
      color: ${COLORS.primary};
      font-size: 20px;
    }
  }

  @media (min-width: ${BREAKPOINTS.tablet}) {
    padding: 20px;
    margin: 20px 0;
    font-size: 15px;

    .example-title {
      font-size: 17px;
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;

  @media (min-width: ${BREAKPOINTS.mobile}) {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 24px;
  }
`;

const ActionButton = styled(Button)`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-weight: 500;

  @media (min-width: ${BREAKPOINTS.mobile}) {
    width: auto;
    min-width: 120px;
  }

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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  text-align: center;

  .ant-steps {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .ant-steps-item {
    display: none !important;
  }

  .ant-steps-item-process {
    display: flex !important;
    justify-content: center;
    align-items: center;
    flex: none;
    margin: 0 auto;
    padding: 0;
    min-width: auto;
    position: relative;
    width: 100%;

    .ant-steps-item-container {
      padding: 0;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      .ant-steps-item-tail,
      .ant-steps-item-icon {
        display: none;
      }

      .ant-steps-item-content {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: auto;
        margin: 0 auto;
        text-align: center;

        .ant-steps-item-title {
          color: ${COLORS.primary};
          font-weight: 600;
          font-size: 1.5rem;
          text-align: center;
          padding: 0 !important;
          margin: 0 auto;
          width: 100%;

          &::after {
            display: none;
          }
        }
      }
    }
  }

  .ant-steps-item-tail {
    display: none !important;
  }

  .ant-steps-item-wait,
  .ant-steps-item-finish,
  .ant-steps-item-title::after {
    display: none !important;
  }
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 8px;
  border: 1px solid ${COLORS.secondary};
  padding: 12px;
  min-height: 120px;
  margin: 12px 0;
  font-size: 14px;

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}20;
  }

  @media (min-width: ${BREAKPOINTS.tablet}) {
    margin: 16px 0;
    font-size: 16px;
  }
`;

const PracticeTypeButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  position: relative;

  @media (min-width: ${BREAKPOINTS.mobile}) {
    flex: 1;
  }

  &.type-daily {
    background: ${(props) => (props.active ? COLORS.primary : "white")};
    border-color: ${COLORS.primary};
    color: ${(props) => (props.active ? "white" : COLORS.primary)};
  }

  &.type-weekly {
    background: ${(props) => (props.active ? COLORS.primary : "white")};
    border-color: ${COLORS.primary};
    color: ${(props) => (props.active ? "white" : COLORS.primary)};
  }

  &.type-monthly {
    background: ${(props) => (props.active ? COLORS.primary : "white")};
    border-color: ${COLORS.primary};
    color: ${(props) => (props.active ? "white" : COLORS.primary)};
  }
`;

// Step Configuration
const STEPS = [
  {
    title: "ด้านครอบครัว",
    category: "family",
    examples: [
      "ทบทวนรูปภาพครอบครัวพร้อมระลึกถึงเหตุการณ์ 5 นาที",
      "โทรหาครอบครัวและพูดคุยถึงความทรงจำดีๆ",
      "จัดกิจกรรมรำลึกความทรงจำกับครอบครัว",
    ],
  },
  {
    title: "ด้านการงาน",
    category: "work",
    examples: [
      "ทบทวนขั้นตอนการทำงานสำคัญทุกวัน",
      "จดบันทึกและทบทวนการประชุมสำคัญ",
      "ทำแผนผังความคิดสรุปงานประจำเดือน",
    ],
  },
  {
    title: "ด้านสังคม",
    category: "social",
    examples: [
      "จดบันทึกชื่อและรายละเอียดของคนที่พบใหม่",
      "ติดต่อเพื่อนเก่าและแลกเปลี่ยนความทรงจำ",
      "จัดกิจกรรมพบปะสังสรรค์กับกลุ่มเพื่อน",
    ],
  },
  {
    title: "ด้านการพักผ่อน",
    category: "leisure",
    examples: [
      "เลือกเกมฝึกสมองเล่นเป็นประจำทุกวัน",
      "จัดตารางทำกิจกรรมที่ชื่นชอบสัปดาห์ละครั้ง",
      "วางแผนท่องเที่ยวพร้อมจดบันทึกสถานที่ที่ประทับใจ",
    ],
  },
  {
    title: "ด้านสุขภาพ",
    category: "health",
    examples: [
      "ทบทวนตารางการรับประทานยาทุกวัน",
      "บันทึกและติดตามผลการออกกำลังกายทุกสัปดาห์",
      "ทำบันทึกสุขภาพและนัดหมายแพทย์ประจำเดือน",
    ],
  },
  {
    title: "ด้านจิตวิญญาณ",
    category: "spiritual",
    examples: [
      "ฝึกสมาธิหรือสวดมนต์เป็นประจำทุกวัน",
      "อ่านหนังสือธรรมะและจดบันทึกข้อคิดที่ได้",
      "ร่วมกิจกรรมทางศาสนาหรือจิตอาสาเดือนละครั้ง",
    ],
  },
  {
    title: "สรุป",
    category: "summary",
  },
];

// Practice Types Configuration
const PRACTICE_TYPES = {
  daily: {
    title: "รายวัน",
    icon: <FieldTimeOutlined />,
    className: "type-daily",
  },
  weekly: {
    title: "รายสัปดาห์",
    icon: <CalendarOutlined />,
    className: "type-weekly",
  },
  monthly: {
    title: "รายเดือน",
    icon: <HistoryOutlined />,
    className: "type-monthly",
  },
};

// Initial States
const INITIAL_PRACTICES_STATE = {
  daily: "",
  weekly: "",
  monthly: "",
};

export default function ActivitySeven() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [currentStep, setCurrentStep] = useState(0);
  const [practices, setPractices] = useState({
    family: { daily: [], weekly: [], monthly: [] },
    work: { daily: [], weekly: [], monthly: [] },
    social: { daily: [], weekly: [], monthly: [] },
    leisure: { daily: [], weekly: [], monthly: [] },
    health: { daily: [], weekly: [], monthly: [] },
    spiritual: { daily: [], weekly: [], monthly: [] },
  });
  const [currentPractices, setCurrentPractices] = useState(
    INITIAL_PRACTICES_STATE
  );
  const [selectedType, setSelectedType] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing practices when component mounts
  useEffect(() => {
    const fetchPractices = async () => {
      if (!user?.nationalId) {
        console.warn("No user ID available");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/activity-seven/${user.nationalId}`
        );

        if (response.data?.categories) {
          const formattedPractices = { ...practices };
          response.data.categories.forEach((category) => {
            formattedPractices[category.name] = {
              daily: category.dailyPractices || [],
              weekly: category.weeklyPractices || [],
              monthly: category.monthlyPractices || [],
            };
          });
          setPractices(formattedPractices);

          // ตรวจสอบว่ามีข้อมูลครบทุกด้านหรือไม่
          const hasAllCategories = [
            "family",
            "work",
            "social",
            "leisure",
            "health",
            "spiritual",
          ].every((category) => {
            const categoryData = formattedPractices[category];
            return (
              categoryData &&
              categoryData.daily.length > 0 &&
              categoryData.weekly.length > 0 &&
              categoryData.monthly.length > 0
            );
          });

          if (hasAllCategories) {
            setCurrentStep(STEPS.length - 1);
          }
        }
      } catch (error) {
        console.error("Error fetching practices:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchPractices();
  }, [user?.nationalId]);

  // Event Handlers
  const handlePracticeTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handlePracticeTextChange = (text) => {
    setCurrentPractices((prev) => ({
      ...prev,
      [selectedType]: text,
    }));
  };

  const handleSavePractice = async () => {
    if (!user?.nationalId) {
      message.warning("กรุณาเข้าสู่ระบบก่อนทำกิจกรรม");
      return;
    }

    if (
      !currentPractices.daily ||
      !currentPractices.weekly ||
      !currentPractices.monthly
    ) {
      message.warning("กรุณากรอกแนวทางปฏิบัติให้ครบทุกประเภท");
      return;
    }

    try {
      setLoading(true);
      const currentStepData = STEPS[currentStep];

      const data = {
        nationalId: user.nationalId,
        category: currentStepData.category,
        dailyPractice: {
          type: "daily",
          text: currentPractices.daily.trim(),
        },
        weeklyPractice: {
          type: "weekly",
          text: currentPractices.weekly.trim(),
        },
        monthlyPractice: {
          type: "monthly",
          text: currentPractices.monthly.trim(),
        },
      };

      const response = await axios.post(
        "https://brain-training-server.onrender.com/api/activity-seven/save",
        data
      );

      if (response.data.success) {
        setPractices((prev) => {
          const updatedPractices = { ...prev };
          const currentCategory = currentStepData.category;

          updatedPractices[currentCategory] = {
            daily: [{ type: "daily", text: currentPractices.daily }],
            weekly: [{ type: "weekly", text: currentPractices.weekly }],
            monthly: [{ type: "monthly", text: currentPractices.monthly }],
          };

          return updatedPractices;
        });

        message.success("บันทึกแนวทางปฏิบัติสำเร็จ");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // เพิ่ม useEffect นี้
  useEffect(() => {
    if (isEditing && currentStep < STEPS.length - 1) {
      const currentCategory = STEPS[currentStep].category;
      const categoryPractices = practices[currentCategory];

      if (categoryPractices) {
        // อัพเดทข้อมูลใน form เมื่อเปลี่ยนหน้า
        setCurrentPractices({
          daily: categoryPractices.daily[0]?.text || "",
          weekly: categoryPractices.weekly[0]?.text || "",
          monthly: categoryPractices.monthly[0]?.text || "",
        });
      } else {
        // ถ้าไม่มีข้อมูลให้ reset form
        setCurrentPractices({
          daily: "",
          weekly: "",
          monthly: "",
        });
      }
    }
  }, [currentStep, isEditing, practices]); // เพิ่ม dependencies

  // แก้ไขฟังก์ชัน handleNext ให้ไม่ reset ค่าถ้าอยู่ในโหมดแก้ไข
  const handleNext = async () => {
    try {
      if (
        !currentPractices.daily.trim() ||
        !currentPractices.weekly.trim() ||
        !currentPractices.monthly.trim()
      ) {
        message.warning("กรุณากรอกแนวทางปฏิบัติให้ครบทุกประเภท");
        return;
      }

      await handleSavePractice();

      // ไม่ต้อง reset ค่าถ้าอยู่ในโหมดแก้ไข
      if (!isEditing) {
        setCurrentPractices({
          daily: "",
          weekly: "",
          monthly: "",
        });
      }

      setSelectedType("daily");
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
      const firstStepCategory = STEPS[0].category;
      const firstStepPractices = practices[firstStepCategory];

      if (firstStepPractices) {
        setCurrentPractices({
          daily: firstStepPractices.daily[0]?.text || "",
          weekly: firstStepPractices.weekly[0]?.text || "",
          monthly: firstStepPractices.monthly[0]?.text || "",
        });
      }

      setCurrentStep(0);
      setSelectedType("daily");
      setIsEditing(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
      message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  // Render Functions
  const renderPracticeTypeSelection = () => (
    <div>
      <GoalTypeContainer>
        {Object.entries(PRACTICE_TYPES).map(([type, config]) => (
          <PracticeTypeButton
            key={type}
            icon={config.icon}
            className={config.className}
            active={selectedType === type}
            onClick={() => handlePracticeTypeSelect(type)}
          >
            {config.title}
            {currentPractices[type].trim() && (
              <CheckOutlined style={{ marginLeft: 8, color: "green" }} />
            )}
          </PracticeTypeButton>
        ))}
      </GoalTypeContainer>

      <ExampleBox>
        <div className="example-title">
          <BulbOutlined style={{ color: COLORS.primary }} />
          ตัวอย่างแนวทางปฏิบัติ
        </div>
        <ul className="example-list">
          {STEPS[currentStep].examples.map((example, index) => (
            <li key={index} className="example-item">
              {example}
            </li>
          ))}
        </ul>
      </ExampleBox>

      <div style={{ marginTop: "20px" }}>
        <Text strong>แนวทางปฏิบัติของคุณ:</Text>
        <StyledTextArea
          value={currentPractices[selectedType]}
          onChange={(e) => handlePracticeTextChange(e.target.value)}
          placeholder="พิมพ์แนวทางปฏิบัติของคุณที่นี่..."
          disabled={loading}
        />
      </div>

      {/* เพิ่มส่วนแสดงสถานะการกรอกข้อมูล */}
      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          สถานะการกรอกข้อมูล:
          {Object.entries(currentPractices).map(([type, value]) => (
            <span key={type} style={{ marginLeft: 8 }}>
              {PRACTICE_TYPES[type].title}:
              {value.trim() ? (
                <CheckOutlined style={{ marginLeft: 4, color: "green" }} />
              ) : (
                <CloseOutlined style={{ marginLeft: 4, color: "red" }} />
              )}
            </span>
          ))}
        </Text>
      </div>
    </div>
  );

  const renderSummary = () => (
    <StyledCard
      title={
        <div
          style={{
            textAlign: "center",
            borderBottom: `2px solid ${COLORS.primary}`,
            paddingTop: 16,
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
            สรุปแนวทางปฏิบัติทั้งหมด
          </Title>
        </div>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {STEPS.slice(0, -1).map((step, index) => {
          const categoryPractices = practices[step.category];
          if (!categoryPractices) return null;

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

              <Tabs defaultActiveKey="daily">
                {Object.entries(PRACTICE_TYPES).map(([type, config]) => (
                  <Tabs.TabPane
                    tab={
                      <span>
                        {config.icon} {config.title}
                      </span>
                    }
                    key={type}
                  >
                    {categoryPractices[type]?.map((practice, idx) => (
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
                        <Text>{practice.text}</Text>
                      </div>
                    ))}
                  </Tabs.TabPane>
                ))}
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
        <Title
          level={2}
          style={{ textAlign: "center", marginBottom: 32, fontSize: "2rem" }}
        >
          กิจกรรมที่ 7: สู่ฝัน ความสำเร็จ
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
            {renderPracticeTypeSelection()}

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
                  !currentPractices.daily.trim() ||
                  !currentPractices.weekly.trim() ||
                  !currentPractices.monthly.trim()
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
