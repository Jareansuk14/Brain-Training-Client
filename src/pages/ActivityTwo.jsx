import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Space,
  Typography,
  Input,
  Button,
  Steps,
  Alert,
  List,
  Modal,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  CheckOutlined,
  CloudOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const { Title, Text } = Typography;

// Color Constants
const COLORS = {
  primary: "#7c3aed", // Deep purple
  secondary: "#a78bfa", // Light purple
  background: "#fafafa", // Almost white
  surface: "#ffffff", // Pure white
  text: "#1f2937", // Dark gray
  textLight: "#6b7280", // Medium gray
  border: "#e5e7eb", // Light gray
  success: "#10b981", // Emerald
  warning: "#ef4444", // Red
  highlight: "#f3f4f6", // Very light gray
};

// Animation keyframes
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const floatCloud = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100vw); }
`;

const float = keyframes`
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        transform: translateY(-60vh) rotate(10deg);
        opacity: 1;
    }
    75% {
        transform: translateY(-80vh) rotate(-5deg);
        opacity: 0.5;
    }
    100% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 0;
    }
`;

// Styled Components
const PageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #87ceeb 0%, #e0f6ff 100%);
  overflow-y: auto;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StyledCard = styled(Card)`
  background: ${COLORS.surface};
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  border: none;

  .ant-card-head {
    border-bottom: 2px solid ${COLORS.border};
    padding: 16px 24px;
  }

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: 768px) {
    border-radius: 16px;
    margin-bottom: 16px;

    .ant-card-head {
      padding: 12px 16px;
    }

    .ant-card-body {
      padding: 16px;
    }
  }
`;

const InputSection = styled.div`
  background: ${COLORS.surface};
  padding: 24px;
  border-radius: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 16px;
  }
`;

const ThoughtsList = styled.div`
  background: ${COLORS.surface};
  padding: 24px;
  border-radius: 24px;
  margin-bottom: 24px;
  max-height: 50vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
    max-height: 40vh;
  }
`;

const ThoughtItem = styled.div`
  background: ${COLORS.highlight};
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.background};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 12px;
  }
`;

const ActionButton = styled(Button)`
  height: 48px;
  background: ${COLORS.primary} !important;
  border-color: ${COLORS.primary} !important;
  border-radius: 12px;
  color: white;
  font-weight: 500;

  &:hover {
    background: ${COLORS.secondary} !important;
    border-color: ${COLORS.secondary} !important;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const ReleaseButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 18px;
  margin-top: 16px;
  background: ${COLORS.primary} !important;
  border-color: ${COLORS.primary} !important;
  border-radius: 12px;
  color: white;
  font-weight: 500;

  &:hover {
    background: ${COLORS.secondary} !important;
    border-color: ${COLORS.secondary} !important;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    height: 40px;
    font-size: 16px;
    margin-top: 12px;
  }
`;

const StyledInput = styled(Input.TextArea)`
  border-radius: 12px;
  border: 2px solid ${COLORS.border};
  padding: 16px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: ${COLORS.background};

  &:hover,
  &:focus {
    border-color: ${COLORS.primary};
    background: ${COLORS.surface};
    box-shadow: 0 0 0 3px ${COLORS.primary}22;
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 14px;
  }
`;

const Cloud = styled.div`
  position: absolute;
  top: ${(props) => props.top}%;
  left: 0;
  width: 200px;
  height: 100px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  animation: ${floatCloud} ${(props) => props.duration}s linear infinite;
  z-index: 2;

  &:before,
  &:after {
    content: "";
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }

  &:before {
    width: 100px;
    height: 100px;
    top: -40px;
    left: 30px;
  }

  &:after {
    width: 120px;
    height: 120px;
    top: -20px;
    left: 80px;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 75px;

    &:before {
      width: 75px;
      height: 75px;
      top: -30px;
      left: 22px;
    }

    &:after {
      width: 90px;
      height: 90px;
      top: -15px;
      left: 60px;
    }
  }
`;

const BalloonContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
`;

const CloudContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999;
`;

const Balloon = styled.div`
  position: absolute;
  width: 120px;
  height: 145px;
  background: ${(props) => props.color};
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  bottom: ${(props) => props.bottom}px;
  left: ${(props) => props.left}%;
  animation: ${float} 30s ease-out forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  color: white;
  font-size: 14px;
  word-break: break-word;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:before {
    content: "";
    position: absolute;
    bottom: -30px;
    left: 50%;
    width: 2px;
    height: 40px;
    background: ${COLORS.text};
    transform: translateX(-50%);
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -35px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: ${COLORS.text};
    border-radius: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 100px;
    font-size: 12px;
    padding: 12px;

    &:before {
      height: 30px;
      bottom: -20px;
    }

    &:after {
      bottom: -25px;
      width: 6px;
      height: 6px;
    }
  }
`;

const StyledSteps = styled(Steps)`
  .ant-steps-item-process .ant-steps-item-icon {
    background: ${COLORS.primary};
    border-color: ${COLORS.primary};
  }

  .ant-steps-item-finish .ant-steps-item-icon {
    background: white;
    border-color: ${COLORS.primary};
  }

  .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
    color: ${COLORS.primary};
  }

  .ant-steps-item-finish .ant-steps-item-tail::after {
    background-color: ${COLORS.primary};
  }

  .ant-steps-item-title {
    &::after {
      background-color: ${COLORS.primary} !important;
    }
  }

  .ant-steps-item-finish .ant-steps-item-title {
    color: ${COLORS.primary};
  }

  .ant-steps-item-process .ant-steps-item-title {
    color: ${COLORS.primary};
  }
`;

const StyledAlert = styled(Alert)`
  &.ant-alert-info {
    background-color: ${COLORS.secondary}15; // เพิ่มความโปร่งใสด้วย hex opacity
    border: 1px solid ${COLORS.secondary};

    .ant-alert-message {
      color: ${COLORS.primary};
    }

    .anticon {
      color: ${COLORS.primary};
    }
  }
`;

const BreathingButton = styled(Button)`
  &.ant-btn-primary {
    background: ${COLORS.primary};
    border-color: ${COLORS.primary};

    &:hover,
    &:focus {
      background: ${COLORS.secondary};
      border-color: ${COLORS.secondary};
    }
  }

  &.ant-btn-default {
    color: ${COLORS.primary};
    border-color: ${COLORS.primary};

    &:hover,
    &:focus {
      color: ${COLORS.secondary};
      border-color: ${COLORS.secondary};
    }
  }

  &:disabled {
    background: ${COLORS.secondary}40;
    border-color: ${COLORS.secondary};
    color: white;
  }
`;

// สีสำหรับลูกโป่ง
const balloonColors = [
  COLORS.primary,
  COLORS.secondary,
  "#FFD93D", // Yellow
  "#95E1D3", // Mint
  "#A8E6CF", // Light green
  "#FFB6B9", // Light pink
  "#6C5B7B", // Purple
  "#F8B195", // Light orange
];

// ฟังก์ชันตัดข้อความ
const truncateText = (text, maxLength = 30) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default function ActivityTwo() {
  const [totalReleasedThoughts, setTotalReleasedThoughts] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState("");
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [isReleasing, setIsReleasing] = useState(false);
  const [floatingThoughts, setFloatingThoughts] = useState([]);
  const [clouds, setClouds] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const newClouds = Array(5)
      .fill(null)
      .map((_, index) => ({
        id: index,
        top: Math.random() * 100 + 5,
        duration: Math.random() * 20 + 10,
      }));
    setClouds(newClouds);
  }, []);

  const handleAddThought = () => {
    if (newThought.trim()) {
      setThoughts((prev) => [
        ...prev,
        { id: Date.now(), text: newThought.trim() },
      ]);
      setNewThought("");
      inputRef.current?.focus();
    } else {
      message.warning("กรุณากรอกความคิดที่ต้องการปล่อยวาง");
    }
  };

  const handleRemoveThought = (id) => {
    setThoughts((prev) => prev.filter((thought) => thought.id !== id));
  };

  const handleReleaseThoughts = () => {
    if (thoughts.length === 0) {
      message.warning("กรุณาเพิ่มความคิดที่ต้องการปล่อยวาง");
      return;
    }

    setIsReleasing(true);
    setTotalReleasedThoughts((prev) => prev + thoughts.length);
    thoughts.forEach((thought, index) => {
      setTimeout(() => {
        setFloatingThoughts((prev) => [
          ...prev,
          {
            ...thought,
            color:
              balloonColors[Math.floor(Math.random() * balloonColors.length)],
            left: Math.random() * 80 + 10,
            text: truncateText(thought.text),
          },
        ]);

        if (index === thoughts.length - 1) {
          setTimeout(() => {
            setThoughts([]);
            setFloatingThoughts([]);
            setIsReleasing(false);
            Modal.success({
              title: "ปล่อยวางความคิดสำเร็จ",
              content: "คุณได้ปล่อยวางความคิดทั้งหมดแล้ว รู้สึกเบาสบายขึ้นไหม?",
            });
          }, 15000);
        }
      }, index * 1000);
    });
  };

  const enhancedBalloonContainer = (
    <>
      <CloudContainer>
        {clouds.map((cloud) => (
          <Cloud key={cloud.id} top={cloud.top} duration={cloud.duration} />
        ))}
      </CloudContainer>
      <BalloonContainer>
        {floatingThoughts.map((thought) => (
          <Balloon
            key={thought.id}
            color={thought.color}
            left={thought.left}
            bottom={0}
          >
            {thought.text}
          </Balloon>
        ))}
      </BalloonContainer>
    </>
  );

  const mainContent = (
    <PageContainer>
      <ContentContainer>
        <Title
          level={2}
          style={{
            textAlign: "center",
            color: "white",
            marginBottom: 32,
            paddingTop: 60,
          }}
        >
          ปล่อยความคิด ให้ปลิวไปในอากาศ
        </Title>

        <InputSection>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <StyledInput
              ref={inputRef}
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              placeholder="พิมพ์ความคิดที่คุณต้องการปล่อยวาง..."
              autoSize={{ minRows: 2 }}
              onPressEnter={(e) => {
                e.preventDefault();
                handleAddThought();
              }}
            />
            <ActionButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddThought}
            >
              เพิ่มความคิด
            </ActionButton>
          </Space>
        </InputSection>

        <ThoughtsList>
          <Title level={4} style={{ marginBottom: 16 }}>
            ความคิดของคุณ ({thoughts.length})
          </Title>
          {thoughts.map((thought) => (
            <ThoughtItem key={thought.id}>
              <Text>{thought.text}</Text>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveThought(thought.id)}
              />
            </ThoughtItem>
          ))}
          <ReleaseButton
            type="primary"
            icon={<CloudOutlined />}
            onClick={handleReleaseThoughts}
            loading={isReleasing}
            disabled={thoughts.length === 0}
          >
            ปล่อยความคิดทั้งหมด
          </ReleaseButton>
        </ThoughtsList>

        {enhancedBalloonContainer}

        {/* เพิ่มปุ่มควบคุมที่นี่ */}
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            position: "sticky",
            bottom: 24,
          }}
        >
          <Space>
            <Button
              style={{
                margin: "0 8px",
                background: COLORS.background,
                borderColor: COLORS.border,
                color: COLORS.textLight,
                height: "40px",
                borderRadius: "12px",
                fontWeight: "500",
                padding: "0 20px",
              }}
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              ย้อนกลับ
            </Button>
            <Button
              style={{
                background: COLORS.primary,
                borderColor: COLORS.primary,
                color: "white",
                height: "40px",
                borderRadius: "12px",
                fontWeight: "500",
                padding: "0 20px",
              }}
              onClick={() => setCurrentStep((prev) => prev + 1)}
            >
              ถัดไป
            </Button>
          </Space>
        </div>
      </ContentContainer>
    </PageContainer>
  );

  const steps = [
    {
      title: "ขั้นนำ",
      content: (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <StyledCard>
            <Space direction="vertical">
              <StyledAlert
                message="ระยะเวลาในการทำกิจกรรม 50 นาที"
                type="info"
                showIcon
              />
              <Text>
                กิจกรรม "ปล่อยความคิด ให้ปลิวไปในอากาศ"
                เป็นกิจกรรมที่ช่วยให้คุณฝึกการปล่อยวางความคิดที่ไม่เป็นประโยชน์
              </Text>
            </Space>
          </StyledCard>

          <StyledCard title="การหายใจเพื่อผ่อนคลาย">
            <Space
              direction="vertical"
              align="center"
              style={{ width: "100%" }}
            >
              <Text>นั่งในท่าที่สบาย และทำการหายใจลึกๆ 3-5 ครั้ง</Text>
              <BreathingButton
                type={isBreathing ? "default" : "primary"}
                icon={<ClockCircleOutlined />}
                onClick={() => {
                  if (!isBreathing) {
                    setIsBreathing(true);
                    setBreathCount(0);
                    const interval = setInterval(() => {
                      setBreathCount((prev) => {
                        if (prev >= 4) {
                          clearInterval(interval);
                          setIsBreathing(false);
                          return 0;
                        }
                        return prev + 1;
                      });
                    }, 4000);
                  }
                }}
                disabled={isBreathing}
              >
                {isBreathing
                  ? `หายใจครั้งที่ ${breathCount + 1}`
                  : "เริ่มการหายใจ"}
              </BreathingButton>
              {isBreathing && (
                <Text>
                  {breathCount % 2 === 0 ? "หายใจเข้า..." : "หายใจออก..."}
                </Text>
              )}
            </Space>
          </StyledCard>
        </Space>
      ),
    },
    {
      title: "ขั้นดำเนินการ",
      content: mainContent,
    },
    {
      title: "ขั้นสรุป",
      content: (
        <StyledCard
          title={
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                borderBottom: "2px solid #f0f0f0",
              }}
            >
              <Title
                level={3}
                style={{
                  margin: 0,
                  background: "linear-gradient(45deg, #a78bfa, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                สรุปกิจกรรม "ปล่อยความคิด ให้ปลิวไปในอากาศ"
              </Title>
            </div>
          }
          style={{
            maxWidth: 600,
            margin: "0 auto",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
          bodyStyle={{ padding: "30px" }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                borderRadius: "16px",
                padding: "30px",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(78, 205, 196, 0.2)",
                marginBottom: "30px",
              }}
            >
              <Text
                style={{
                  fontSize: "28px",
                  color: "white",
                  fontWeight: "600",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                คุณได้ปล่อยความคิดไปทั้งหมด
              </Text>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "white",
                  margin: "15px 0",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {totalReleasedThoughts}
              </div>
              <Text
                style={{
                  fontSize: "24px",
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                ความคิด
              </Text>
            </div>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {[
                {
                  text: "การปล่อยวางความคิดเป็นทักษะที่ต้องฝึกฝนอย่างสม่ำเสมอ เพื่อให้จิตใจเป็นอิสระจากความคิดที่สร้างความทุกข์",
                  icon: "🎯",
                },
                {
                  text: "การสังเกตความรู้สึกของตัวเองหลังจากปล่อยวางความคิด จะช่วยให้เข้าใจถึงประโยชน์ของการปล่อยวาง",
                  icon: "🔍",
                },
                {
                  text: "ฝึกฝนการปล่อยวางเป็นประจำ จะช่วยให้จิตใจเบาสบายและมีความสุขมากขึ้น",
                  icon: "✨",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: "white",
                    padding: "20px 25px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    border: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      width: "40px",
                      height: "40px",
                      background: "#f8f9fa",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </div>
                  <Text
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#556270",
                      flex: 1,
                    }}
                  >
                    {item.text}
                  </Text>
                </div>
              ))}
            </Space>
          </Space>
        </StyledCard>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        กิจกรรม "ปล่อยความคิด ให้ปลิวไปในอากาศ"
      </Title>

      <StyledSteps
        current={currentStep}
        items={steps.map((item) => ({ key: item.title, title: item.title }))}
        style={{ marginBottom: 32 }}
        className="custom-steps"
      />

      <StyledCard>
        {steps[currentStep].content}

        {/* แสดงปุ่มเฉพาะเมื่อไม่ใช่ขั้นดำเนินการ */}
        {currentStep !== 1 && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Space>
              {currentStep > 0 && (
                <Button
                  style={{
                    margin: "0 8px",
                    background: COLORS.background,
                    borderColor: COLORS.border,
                    color: COLORS.textLight,
                    height: "40px",
                    borderRadius: "12px",
                    fontWeight: "500",
                    padding: "0 20px",
                  }}
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  ย้อนกลับ
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button
                  style={{
                    background: COLORS.primary,
                    borderColor: COLORS.primary,
                    color: "white",
                    height: "40px",
                    borderRadius: "12px",
                    fontWeight: "500",
                    padding: "0 20px",
                  }}
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                >
                  ถัดไป
                </Button>
              ) : (
                <Button
                  style={{
                    background: COLORS.primary,
                    borderColor: COLORS.primary,
                    color: "white",
                    height: "40px",
                    borderRadius: "12px",
                    fontWeight: "500",
                    padding: "0 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onClick={() => navigate("/")}
                  icon={<CheckOutlined />}
                >
                  จบกิจกรรม
                </Button>
              )}
            </Space>
          </div>
        )}
      </StyledCard>
    </div>
  );
}
