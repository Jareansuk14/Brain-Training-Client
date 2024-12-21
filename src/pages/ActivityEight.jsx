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
  Checkbox,
} from "antd";
import {
  CheckOutlined,
  ArrowLeftOutlined,
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

// Responsive Breakpoints
const BREAKPOINTS = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
};

// Step Configuration
const STEPS = [
  {
    title: "ด้านครอบครัว",
    category: "family",
    questions: [
      {
        key: "howToImprove",
        question:
          "การพัฒนาความจำจะช่วยให้ฉันเป็นสมาชิกครอบครัวที่ดีขึ้นอย่างไร?",
      },
      {
        key: "obstacles",
        question:
          "อะไรคืออุปสรรคที่อาจทำให้ฉันไม่สามารถทำตามแผนพัฒนาความจำด้านครอบครัว?",
      },
      {
        key: "handleObstacles",
        question: "ฉันจะจัดการกับอุปสรรคเหล่านั้นอย่างไร?",
      },
      {
        key: "supporters",
        question:
          "ใครในครอบครัวที่จะช่วยสนับสนุนฉันได้และจะขอความช่วยเหลืออย่างไร?",
      },
    ],
  },
  {
    title: "ด้านการงาน",
    category: "work",
    questions: [
      {
        key: "howToImprove",
        question:
          "การพัฒนาความจำจะช่วยเพิ่มประสิทธิภาพในการทำงานของฉันอย่างไร?",
      },
      {
        key: "obstacles",
        question: "อะไรคืออุปสรรคที่อาจขัดขวางการพัฒนาความจำในการทำงาน?",
      },
      {
        key: "handleObstacles",
        question: "ฉันจะจัดการกับความท้าทายในที่ทำงานอย่างไร?",
      },
      {
        key: "supporters",
        question:
          "ใครในที่ทำงานที่จะสนับสนุนฉันได้และจะขอความช่วยเหลืออย่างไร?",
      },
    ],
  },
  {
    title: "ด้านสังคม",
    category: "social",
    questions: [
      {
        key: "howToImprove",
        question:
          "การพัฒนาความจำจะช่วยปรับปรุงความสัมพันธ์ทางสังคมของฉันอย่างไร?",
      },
      {
        key: "obstacles",
        question: "อะไรที่อาจเป็นอุปสรรคในการพัฒนาความจำด้านสังคม?",
      },
      {
        key: "handleObstacles",
        question: "ฉันจะรับมือกับความท้าทายทางสังคมอย่างไร?",
      },
      {
        key: "supporters",
        question:
          "เพื่อนคนไหนที่จะช่วยสนับสนุนฉันได้และจะขอความช่วยเหลืออย่างไร?",
      },
    ],
  },
  {
    title: "ด้านการพักผ่อน",
    category: "leisure",
    questions: [
      {
        key: "howToImprove",
        question:
          "การพัฒนาความจำจะช่วยให้ฉันได้รับความเพลิดเพลินจากการพักผ่อนมากขึ้นอย่างไร?",
      },
      {
        key: "obstacles",
        question: "อะไรที่อาจขัดขวางการพัฒนาความจำในช่วงเวลาพักผ่อน?",
      },
      {
        key: "handleObstacles",
        question: "ฉันจะจัดการกับสิ่งที่รบกวนเวลาพักผ่อนอย่างไร?",
      },
      {
        key: "supporters",
        question: "ใครที่จะร่วมกิจกรรมพักผ่อนและสนับสนุนฉันได้บ้าง?",
      },
    ],
  },
  {
    title: "ด้านสุขภาพ",
    category: "health",
    questions: [
      {
        key: "howToImprove",
        question: "การพัฒนาความจำจะช่วยปรับปรุงสุขภาพโดยรวมของฉันอย่างไร?",
      },
      {
        key: "obstacles",
        question: "อะไรที่อาจเป็นอุปสรรคในการดูแลสุขภาพและความจำ?",
      },
      {
        key: "handleObstacles",
        question: "ฉันจะจัดการกับปัญหาสุขภาพที่อาจเกิดขึ้นอย่างไร?",
      },
      {
        key: "supporters",
        question: "ใครที่จะช่วยดูแลสุขภาพและสนับสนุนฉันได้บ้าง?",
      },
    ],
  },
  {
    title: "ด้านจิตวิญญาณ",
    category: "spiritual",
    questions: [
      {
        key: "howToImprove",
        question: "การพัฒนาความจำจะช่วยยกระดับจิตวิญญาณของฉันอย่างไร?",
      },
      {
        key: "obstacles",
        question: "อะไรที่อาจเป็นอุปสรรคในการพัฒนาจิตใจและความจำ?",
      },
      {
        key: "handleObstacles",
        question: "ฉันจะจัดการกับความท้าทายด้านจิตใจอย่างไร?",
      },
      {
        key: "supporters",
        question:
          "ใครที่จะช่วยสนับสนุนด้านจิตวิญญาณและฉันจะขอความช่วยเหลืออย่างไร?",
      },
    ],
  },
  {
    title: "สรุป",
    category: "summary",
  },
];

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
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

const QuestionContainer = styled.div`
  margin-bottom: 24px;
`;

const QuestionTitle = styled(Text)`
  display: block;
  font-weight: 500;
  margin-bottom: 12px;
  color: ${COLORS.dark};
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 8px;
  border: 1px solid ${COLORS.secondary};
  padding: 12px;
  min-height: 100px;
  margin: 8px 0;
  font-size: 14px;

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}20;
  }

  @media (min-width: ${BREAKPOINTS.tablet}) {
    font-size: 16px;
  }
`;

const AcceptanceContainer = styled.div`
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid ${COLORS.secondary}20;
`;

const NavigationButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;

  @media (min-width: ${BREAKPOINTS.mobile}) {
    flex-direction: row;
    justify-content: space-between;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

// Component States
const INITIAL_ANSWERS = {
  howToImprove: "",
  obstacles: "",
  handleObstacles: "",
  supporters: "",
};

export default function ActivityEight() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commitments, setCommitments] = useState({});

  // Fetch existing data
  useEffect(() => {
    const fetchCommitments = async () => {
      if (!user?.nationalId) {
        console.warn("No user ID available");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/activity-eight/${user.nationalId}`
        );

        if (response.data?.categories) {
          const formattedCommitments = {};
          response.data.categories.forEach((category) => {
            formattedCommitments[category.name] = {
              ...category.commitment,
            };
          });
          setCommitments(formattedCommitments);

          // ตรวจสอบว่ามีข้อมูลครบทุกด้านหรือไม่
          const hasAllCategories = [
            "family",
            "work",
            "social",
            "leisure",
            "health",
            "spiritual",
          ].every((category) => formattedCommitments[category]?.isAccepted);

          if (hasAllCategories) {
            setCurrentStep(STEPS.length - 1);
          }
        }
      } catch (error) {
        console.error("Error fetching commitments:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchCommitments();
  }, [user?.nationalId]);

  // Update answers when step changes
  useEffect(() => {
    if (currentStep < STEPS.length - 1) {
      const currentCategory = STEPS[currentStep].category;
      const existingCommitment = commitments[currentCategory];
      if (existingCommitment) {
        setAnswers({
          howToImprove: existingCommitment.howToImprove || "",
          obstacles: existingCommitment.obstacles || "",
          handleObstacles: existingCommitment.handleObstacles || "",
          supporters: existingCommitment.supporters || "",
        });
        setIsAccepted(existingCommitment.isAccepted || false);
      } else {
        setAnswers(INITIAL_ANSWERS);
        setIsAccepted(false);
      }
    }
  }, [currentStep, commitments]);

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAcceptanceChange = (e) => {
    setIsAccepted(e.target.checked);
  };

  const handleSaveCommitment = async () => {
    if (!user?.nationalId) {
      message.warning("กรุณาเข้าสู่ระบบก่อนทำกิจกรรม");
      return;
    }

    try {
      setLoading(true);
      const currentStepData = STEPS[currentStep];

      const data = {
        nationalId: user.nationalId,
        category: currentStepData.category,
        ...answers,
        isAccepted,
      };

      const response = await axios.post(
        "https://brain-training-server.onrender.com/api/activity-eight/save",
        data
      );

      if (response.data.success) {
        setCommitments((prev) => ({
          ...prev,
          [currentStepData.category]: {
            ...answers,
            isAccepted,
          },
        }));

        message.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error saving commitment:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      if (Object.values(answers).some((answer) => !answer.trim())) {
        message.warning("กรุณาตอบคำถามให้ครบทุกข้อ");
        return;
      }

      if (!isAccepted) {
        message.warning("กรุณายอมรับพันธสัญญาก่อนดำเนินการต่อ");
        return;
      }

      await handleSaveCommitment();
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

  const renderQuestions = () => (
    <div>
      {STEPS[currentStep].questions.map((questionData) => (
        <QuestionContainer key={questionData.key}>
          <QuestionTitle>{questionData.question}</QuestionTitle>
          <StyledTextArea
            value={answers[questionData.key]}
            onChange={(e) =>
              handleAnswerChange(questionData.key, e.target.value)
            }
            placeholder="พิมพ์คำตอบของคุณที่นี่..."
            disabled={loading}
          />
        </QuestionContainer>
      ))}

      <AcceptanceContainer>
        <Checkbox
          checked={isAccepted}
          onChange={handleAcceptanceChange}
          disabled={
            loading || Object.values(answers).some((answer) => !answer.trim())
          }
        >
          <Text strong>ฉันยอมรับที่จะทำตามพันธสัญญานี้</Text>
        </Checkbox>
      </AcceptanceContainer>

      <NavigationButtons>
        {currentStep > 0 && (
          <ActionButton icon={<ArrowLeftOutlined />} onClick={handlePrevious}>
            ย้อนกลับ
          </ActionButton>
        )}
        <ActionButton
          className="primary"
          onClick={handleNext}
          disabled={
            !isAccepted ||
            Object.values(answers).some((answer) => !answer.trim())
          }
        >
          {currentStep === STEPS.length - 2 ? "ดูสรุป" : "ถัดไป"}
        </ActionButton>
      </NavigationButtons>
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
            สรุปพันธสัญญาทั้งหมด
          </Title>
        </div>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {STEPS.slice(0, -1).map((step, index) => {
          const categoryCommitment = commitments[step.category];
          if (!categoryCommitment) return null;

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

              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {step.questions.map((questionData) => (
                  <div key={questionData.key}>
                    <Text strong>{questionData.question}</Text>
                    <div
                      style={{
                        background: "white",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <Text>{categoryCommitment[questionData.key]}</Text>
                    </div>
                  </div>
                ))}
              </Space>
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
            onClick={() => setCurrentStep(0)}
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
          กิจกรรมที่ 8: สร้างพันธสัญญาเพื่อพัฒนาความจำ
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
            {renderQuestions()}
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
