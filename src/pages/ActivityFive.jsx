// ActivityFive.jsx - Part 1: Constants & Styled Components

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Space, Typography, Button, Steps, Input, message } from "antd";
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

const QuestionText = styled(Text)`
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: ${COLORS.dark};
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 8px;
  border: 1px solid ${COLORS.secondary};
  padding: 12px;
  min-height: 120px;
  margin-bottom: 24px;

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

// Steps Configuration
const STEPS = [
  {
    title: "ด้านครอบครัว",
    category: "family",
    questions: [
      {
        id: "family_1",
        text: "หากความจำของคุณดี คุณจะสามารถทำอะไรกับครอบครัวได้บ้าง?",
      },
      {
        id: "family_2",
        text: "ความทรงจำที่มีค่าที่สุดกับครอบครัวของคุณคืออะไร?",
      },
    ],
  },
  {
    title: "ด้านการงาน",
    category: "work",
    questions: [
      {
        id: "work_1",
        text: "ความจำที่ดีจะช่วยพัฒนาการทำงานของคุณอย่างไร?",
      },
      {
        id: "work_2",
        text: "อะไรคือทักษะหรือความรู้ที่คุณอยากจดจำเพื่อพัฒนาตนเอง?",
      },
    ],
  },
  {
    title: "ด้านสังคม",
    category: "social",
    questions: [
      {
        id: "social_1",
        text: "การมีความจำที่ดีจะช่วยในการสร้างความสัมพันธ์กับผู้อื่นอย่างไร?",
      },
      {
        id: "social_2",
        text: "เรื่องราวหรือประสบการณ์ทางสังคมใดที่คุณไม่อยากลืม?",
      },
    ],
  },
  {
    title: "ด้านการพักผ่อน",
    category: "leisure",
    questions: [
      {
        id: "leisure_1",
        text: "กิจกรรมยามว่างใดที่ต้องใช้ความจำและทำให้คุณมีความสุข",
      },
      {
        id: "leisure_2",
        text: "การพักผ่อนแบบไหนที่ช่วยฝึกความจำของคุณ?",
      },
    ],
  },
  {
    title: "ด้านสุขภาพ",
    category: "health",
    questions: [
      {
        id: "health_1",
        text: "คุณจะใช้ความจำในการดูแลสุขภาพตนเองอย่างไร?",
      },
      {
        id: "health_2",
        text: "การมีความจำที่ดีจะช่วยในการดูแลสุขภาพของคุณอย่างไร?",
      },
    ],
  },
  {
    title: "ด้านจิตวิญญาณ",
    category: "spiritual",
    questions: [
      {
        id: "spiritual_1",
        text: "ความทรงจำใดที่สร้างแรงบันดาลใจในการใช้ชีวิตของคุณ?",
      },
      {
        id: "spiritual_2",
        text: "คุณจะใช้ความจำในการพัฒนาจิตใจของตนเองอย่างไร?",
      },
    ],
  },
  {
    title: "สรุป",
    category: "summary",
  },
];

export default function ActivityFive() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // โหลดข้อมูลที่เคยบันทึกไว้
  useEffect(() => {
    const fetchAnswers = async () => {
      if (!user?.nationalId) {
        console.warn("No user ID available");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://brain-training-server-production.up.railway.app/api/goals/${user.nationalId}`
        );

        console.log("Fetched data:", response.data);

        if (response.data.answers) {
          const formattedAnswers = {};
          response.data.answers.forEach((category) => {
            category.questions.forEach((q) => {
              formattedAnswers[q.questionId] = q.answer;
            });
          });
          setAnswers(formattedAnswers);
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [user?.nationalId]);

  useEffect(() => {
    if (isEditing && currentStep === STEPS.length - 1) {
      setIsEditing(false);
    }
  }, [currentStep, isEditing]);

  // เพิ่ม useEffect ใหม่สำหรับตรวจสอบข้อมูลเก่า
  useEffect(() => {
    const checkExistingAnswers = async () => {
      if (!user?.nationalId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://brain-training-server-production.up.railway.app/api/goals/${user.nationalId}`
        );

        // ตรวจสอบว่ามีข้อมูลคำตอบครบทุกด้านหรือไม่
        if (response.data.answers) {
          const categories = [
            "family",
            "work",
            "social",
            "leisure",
            "health",
            "spiritual",
          ];
          const hasAllCategories = categories.every((category) =>
            response.data.answers.some((answer) => answer.category === category)
          );

          // ถ้ามีข้อมูลครบทุกด้าน ให้ไปที่หน้าสรุป
          if (hasAllCategories) {
            const formattedAnswers = {};
            response.data.answers.forEach((category) => {
              category.questions.forEach((q) => {
                formattedAnswers[q.questionId] = q.answer;
              });
            });
            setAnswers(formattedAnswers);
            setCurrentStep(STEPS.length - 1); // ไปที่หน้าสรุป
          }
        }
      } catch (error) {
        console.error("Error checking existing answers:", error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingAnswers();
  }, [user?.nationalId]); // เรียกใช้เมื่อ user.nationalId มีการเปลี่ยนแปลง

  // บันทึกคำตอบ
  const handleSaveAnswers = async () => {
    if (!user?.nationalId) return;

    try {
      setLoading(true);
      const currentStepData = STEPS[currentStep];

      if (!currentStepData.questions) return;

      const questionsToSave = currentStepData.questions.map((q) => ({
        questionId: q.id,
        question: q.text,
        answer: answers[q.id] || "",
      }));

      if (!questionsToSave.length) {
        console.warn("No questions to save");
        return;
      }

      // Log ข้อมูลที่จะส่ง
      console.log("Data to save:", {
        nationalId: user.nationalId,
        category: currentStepData.category,
        questions: questionsToSave,
      });

      await axios.post(
        "https://brain-training-server-production.up.railway.app/api/goals/save",
        {
          nationalId: user.nationalId,
          category: currentStepData.category,
          questions: questionsToSave,
        }
      );

      message.success("บันทึกคำตอบเรียบร้อย");
    } catch (error) {
      console.error("Error saving answers:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // การเปลี่ยนคำตอบ
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // ไปขั้นตอนถัดไป
  const handleNext = async () => {
    try {
      const currentStepData = STEPS[currentStep];
      if (!currentStepData.questions) {
        setCurrentStep((prev) => prev + 1);
        return;
      }

      const unanswered = currentStepData.questions.some(
        (q) => !answers[q.id]?.trim()
      );
      if (unanswered) {
        message.warning("กรุณาตอบคำถามให้ครบทุกข้อ");
        return;
      }

      if (currentStep < STEPS.length - 1) {
        await handleSaveAnswers();
      }

      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error in handleNext:", error);
      message.error("เกิดข้อผิดพลาดในการดำเนินการ");
    }
  };

  // ย้อนกลับ
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // ฟังก์ชันสำหรับการแก้ไขคำตอบ
  const handleEdit = () => {
    const shouldSave = STEPS[currentStep].questions?.some((q) => answers[q.id]);

    if (shouldSave) {
      handleSaveAnswers().then(() => {
        setCurrentStep(0);
        setIsEditing(true);
      });
    } else {
      setCurrentStep(0);
      setIsEditing(true);
    }
  };

  // ฟังก์ชันสำหรับจบกิจกรรม
  const handleFinish = async () => {
    try {
      setLoading(true);
      message.success("จบกิจกรรมเรียบร้อย");
      navigate("/activity-9");
    } catch (error) {
      console.error("Error finishing activity:", error);
      message.error("เกิดข้อผิดพลาดในการจบกิจกรรม");
    } finally {
      setLoading(false);
    }
  };

  // แสดงคำถามของขั้นตอนปัจจุบัน
  const renderQuestions = () => {
    const currentStepData = STEPS[currentStep];
    if (!currentStepData.questions) return null;

    return (
      <StyledCard title={currentStepData.title}>
        {currentStepData.questions.map((question) => (
          <div key={question.id}>
            <QuestionText>{question.text}</QuestionText>
            <StyledTextArea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="พิมพ์คำตอบของคุณที่นี่..."
              disabled={loading}
            />
          </div>
        ))}
      </StyledCard>
    );
  };

  // แสดงหน้าสรุป
  // แก้ไขฟังก์ชัน renderSummary():

  const renderSummary = () => {
    return (
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
              สรุปการตอบคำถามทั้งหมด
            </Title>
          </div>
        }
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {STEPS.slice(0, -1).map((step, index) => (
            <div
              key={step.category}
              style={{
                background: COLORS.background,
                padding: " 24px",
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
              {step.questions.map((question, qIndex) => (
                <div
                  key={question.id}
                  style={{
                    marginBottom: "20px",
                    padding: "16px",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: `0 2px 8px ${COLORS.shadow}`,
                  }}
                >
                  <QuestionText
                    style={{
                      color: COLORS.dark,
                      fontWeight: "500",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: COLORS.primary,
                        minWidth: "24px",
                      }}
                    >
                      {qIndex + 1}.
                    </span>
                    {question.text}
                  </QuestionText>

                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      background: COLORS.background,
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.secondary}20`,
                    }}
                  >
                    <Text
                      style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "15px",
                        lineHeight: "1.6",
                      }}
                    >
                      {answers[question.id] || "-"}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          ))}

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
              style={{
                boxShadow: `0 2px 8px ${COLORS.primary}40`,
              }}
            >
              จบกิจกรรม
            </ActionButton>
          </NavigationButtons>
        </Space>
      </StyledCard>
    );
  };

  return (
    <PageContainer>
      <ContentContainer>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Session 5 : เสริมสร้างพลัง สร้างค่านิยม
        </Title>

        <StyledSteps
          current={currentStep}
          items={STEPS.map((step) => ({
            title: step.title,
          }))}
          style={{ marginBottom: 32 }}
        />

        {currentStep < STEPS.length - 1 ? renderQuestions() : renderSummary()}

        {currentStep < STEPS.length - 1 && (
          <NavigationButtons>
            {currentStep > 0 && (
              <ActionButton
                icon={<ArrowLeftOutlined />}
                onClick={handlePrevious}
              >
                ย้อนกลับ
              </ActionButton>
            )}
            <ActionButton className="primary" onClick={handleNext}>
              {currentStep === STEPS.length - 2 ? "ดูสรุป" : "ถัดไป"}
            </ActionButton>
          </NavigationButtons>
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
