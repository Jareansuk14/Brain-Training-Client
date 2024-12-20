// ActivityFive.jsx - Part 1: Constants & Styled Components

import React, { useState, useEffect } from "react";
import {
  Card,
  Space,
  Typography,
  Button,
  Steps,
  Input,
  message,
} from "antd";
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  CoffeeOutlined,
  HeartOutlined,
  StarOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  LoadingOutlined ,
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
  .ant-steps-item-process {
    .ant-steps-item-icon {
      background: ${COLORS.primary};
      border-color: ${COLORS.primary};
    }
    
    .ant-steps-item-title {
      color: ${COLORS.primary} !important;
      
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
    
    .ant-steps-item-title {
      color: ${COLORS.primary} !important;
      
      &::after {
        background-color: ${COLORS.primary} !important;
      }
    }
  }

  .ant-steps-item-tail::after {
    background-color: ${COLORS.secondary} !important;
  }

  .ant-steps-item-wait {
    .ant-steps-item-icon {
      background: white;
      border-color: ${COLORS.secondary};
      
      .ant-steps-icon {
        color: ${COLORS.secondary};
      }
    }
  }

  .ant-steps-item-icon {
    .anticon {
      color: inherit;
    }
  }
`;

// Steps Configuration
const STEPS = [
  {
    title: "ครอบครัว",
    category: "family",
    questions: [
      {
        id: "family_1",
        text: "หากความจำของคุณดี คุณจะสามารถทำอะไรกับครอบครัวได้บ้าง?"
      },
      {
        id: "family_2", 
        text: "ความทรงจำที่มีค่าที่สุดกับครอบครัวของคุณคืออะไร?"
      }
    ]
  },
  {
    title: "การงาน/การศึกษา",
    category: "work",
    questions: [
      {
        id: "work_1",
        text: "ความจำที่ดีจะช่วยพัฒนาการทำงานของคุณอย่างไร?"
      },
      {
        id: "work_2",
        text: "อะไรคือทักษะหรือความรู้ที่คุณอยากจดจำเพื่อพัฒนาตนเอง?"
      }
    ]
  },
  {
    title: "สังคม",
    category: "social", 
    questions: [
      {
        id: "social_1",
        text: "การมีความจำที่ดีจะช่วยในการสร้างความสัมพันธ์กับผู้อื่นอย่างไร?"
      },
      {
        id: "social_2",
        text: "เรื่องราวหรือประสบการณ์ทางสังคมใดที่คุณไม่อยากลืม?"
      }
    ]
  },
  {
    title: "การพักผ่อน",
    category: "leisure",
    questions: [
      {
        id: "leisure_1",
        text: "กิจกรรมยามว่างใดที่ต้องใช้ความจำและทำให้คุณมีความสุข"
      },
      {
        id: "leisure_2",
        text: "การพักผ่อนแบบไหนที่ช่วยฝึกความจำของคุณ?"
      }
    ]
  },
  {
    title: "สุขภาพ", 
    category: "health",
    questions: [
      {
        id: "health_1",
        text: "คุณจะใช้ความจำในการดูแลสุขภาพตนเองอย่างไร?"
      },
      {
        id: "health_2",
        text: "การมีความจำที่ดีจะช่วยในการดูแลสุขภาพของคุณอย่างไร?"
      }
    ]
  },
  {
    title: "จิตวิญญาณ",
    category: "spiritual",
    questions: [
      {
        id: "spiritual_1",
        text: "ความทรงจำใดที่สร้างแรงบันดาลใจในการใช้ชีวิตของคุณ?"
      },
      {
        id: "spiritual_2",
        text: "คุณจะใช้ความจำในการพัฒนาจิตใจของตนเองอย่างไร?"
      }
    ]
  },
  {
    title: "สรุป",
    category: "summary"
  }
 ];

 export default function ActivityFive() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // โหลดข้อมูลที่เคยบันทึกไว้
  useEffect(() => {
    const fetchAnswers = async () => {
      if (!user?.nationalId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/goals/${user.nationalId}`
        );
        
        if (response.data.answers) {
          const formattedAnswers = {};
          response.data.answers.forEach(category => {
            category.questions.forEach(q => {
              formattedAnswers[q.questionId] = q.answer;
            });
          });
          setAnswers(formattedAnswers);
        }
      } catch (error) {
        message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [user?.nationalId]);

  // บันทึกคำตอบ
  const handleSaveAnswers = async () => {
    if (!user?.nationalId) return;

    try {
      setLoading(true);
      const currentStep = STEPS[currentStep];
      const questionsToSave = currentStep.questions?.map(q => ({
        questionId: q.id,
        question: q.text,
        answer: answers[q.id] || ''
      })) || [];

      await axios.post('https://brain-training-server.onrender.com/api/goals/save', {
        nationalId: user.nationalId,
        category: currentStep.category,
        questions: questionsToSave
      });

      message.success('บันทึกคำตอบเรียบร้อย');
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // การเปลี่ยนคำตอบ
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // ไปขั้นตอนถัดไป
  const handleNext = async () => {
    const currentQuestions = STEPS[currentStep].questions || [];
    const unanswered = currentQuestions.some(q => !answers[q.id]?.trim());

    if (unanswered) {
      message.warning('กรุณาตอบคำถามให้ครบทุกข้อ');
      return;
    }

    await handleSaveAnswers();
    setCurrentStep(prev => prev + 1);
  };

  // ย้อนกลับ
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // แสดงคำถามของขั้นตอนปัจจุบัน
  const renderQuestions = () => {
    const currentStepData = STEPS[currentStep];
    if (!currentStepData.questions) return null;

    return (
      <StyledCard title={currentStepData.title}>
        {currentStepData.questions.map(question => (
          <div key={question.id}>
            <QuestionText>{question.text}</QuestionText>
            <StyledTextArea
              value={answers[question.id] || ''}
              onChange={e => handleAnswerChange(question.id, e.target.value)}
              placeholder="พิมพ์คำตอบของคุณที่นี่..."
              disabled={loading}
            />
          </div>
        ))}
      </StyledCard>
    );
  };

  // แสดงหน้าสรุป
  const renderSummary = () => {
    return (
      <StyledCard title="สรุปคำตอบทั้งหมด">
        {STEPS.slice(0, -1).map(step => (
          <div key={step.category} style={{ marginBottom: 24 }}>
            <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {step.icon} {step.title}
            </Title>
            {step.questions.map(question => (
              <div key={question.id} style={{ marginBottom: 16 }}>
                <QuestionText>{question.text}</QuestionText>
                <Text>{answers[question.id] || '-'}</Text>
              </div>
            ))}
          </div>
        ))}
        <NavigationButtons>
          <ActionButton icon={<ArrowLeftOutlined />} onClick={() => setIsEditing(true)}>
            แก้ไขคำตอบ
          </ActionButton>
          <ActionButton className="primary" icon={<CheckOutlined />}>
            จบกิจกรรม
          </ActionButton>
        </NavigationButtons>
      </StyledCard>
    );
  };

  return (
    <PageContainer>
      <ContentContainer>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          กิจกรรมที่ 5: เสริมสร้างความจำ เพิ่มคุณค่าชีวิต
        </Title>

        <StyledSteps
          current={currentStep}
          items={STEPS.map(step => ({
            title: step.title,
            icon: step.icon
          }))}
          style={{ marginBottom: 32 }}
        />

        {currentStep < STEPS.length - 1 ? renderQuestions() : renderSummary()}

        {currentStep < STEPS.length - 1 && (
          <NavigationButtons>
            {currentStep > 0 && (
              <ActionButton icon={<ArrowLeftOutlined />} onClick={handlePrevious}>
                ย้อนกลับ
              </ActionButton>
            )}
            <ActionButton className="primary" onClick={handleNext}>
              {currentStep === STEPS.length - 2 ? 'ดูสรุป' : 'ถัดไป'}
            </ActionButton>
          </NavigationButtons>
        )}

        {loading && (
          <div style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000 
          }}>
            <Space direction="vertical" align="center">
              <LoadingOutlined style={{ fontSize: 24, color: COLORS.primary }} />
              <Text>กำลังดำเนินการ...</Text>
            </Space>
          </div>
        )}
      </ContentContainer>
    </PageContainer>
  );
}