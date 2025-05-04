import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Space,
  Typography,
  Button,
  message,
  Row,
  Col,
  Table,
} from "antd";
import {
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HeartFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import axios from "axios";

const { Title, Text } = Typography;

// Constants
const COLORS = {
  primary: "#7c3aed",
  secondary: "#a78bfa",
  background: "#7c3aed10",
  dark: "#1f2937",
  light: "#f8fafc",
  shadow: "rgba(17, 12, 46, 0.1)",
  success: "#52c41a",
  error: "#ff4d4f",
};

const LEVEL_DIGITS = {
  1: 3,
  2: 4,
  3: 5,
  4: 6,
  5: 7,
  6: 8,
};

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
`;

const StyledCard = styled(Card)`
  background: white;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  margin-bottom: 16px;
  position: relative;

  .ant-card-body {
    padding: 24px;
  }
`;

const AttemptsContainer = styled.div`
  position: absolute;
  top: 50px;
  left: 0px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeartIcon = styled(HeartFilled)`
  color: ${(props) => (props.active ? COLORS.error : "#ddd")};
  font-size: 24px;
  transition: all 0.3s ease;
`;

// Timer styled components
const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const TimerLabel = styled.div`
  font-size: 12px;
  color: ${COLORS.primary};
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const TimerValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${COLORS.dark};
  display: flex;
  align-items: center;
  gap: 6px;

  .icon {
    color: ${COLORS.primary};
    font-size: 16px;
  }
`;

const DigitDisplay = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: ${COLORS.primary};
  text-align: center;
  letter-spacing: 16px;
  margin: 32px 0;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.background};
  border-radius: 12px;
  padding: 16px;
`;

const InputCard = styled(StyledCard)`
  .card-content {
    min-height: 400px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
`;

const StartGameButton = styled(Button)`
  height: 60px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 12px;
  color: #fff;
  border-color: ${COLORS.primary};
  background: ${COLORS.primary};
  width: 200px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const GohomeButton = styled(Button)`
  height: 40px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 12px;
  color: ${COLORS.primary};
  border-color: ${COLORS.primary};
  width: 150px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const EndGameButton = styled(Button)`
  height: 40px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 12px;
  color: #fff;
  border-color: ${COLORS.primary};
  background: ${COLORS.primary};
  width: 150px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ResultButton = styled(Button)`
  min-width: 150px;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 12px;

  &.ant-btn-primarys {
    background-color: ${COLORS.primary};
    border-color: ${COLORS.primary};
    color: white;
  }

  &.ant-btn-defaults {
    color: ${COLORS.error};
    border-color: ${COLORS.error};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: ${COLORS.background};
  border-radius: 16px;
`;

const NumberButton = styled(Button)`
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 12px;
  color: ${COLORS.primary};
  border-color: ${COLORS.primary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    background: ${COLORS.primary};
    color: white;
    border-color: ${COLORS.primary};
  }
`;

const SendButton = styled(Button)`
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 12px;
  color: #fff;
  border-color: ${COLORS.primary};
  background: ${COLORS.primary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    background: ${COLORS.primary};
    color: white;
    border-color: ${COLORS.primary};
  }
`;

const LevelIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  gap: 12px;

  .mode {
    font-size: 18px;
    color: ${COLORS.primary};
    font-weight: bold;
  }

  .level {
    background: ${COLORS.primary};
    color: white;
    padding: 4px 16px;
    border-radius: 16px;
    font-weight: bold;
  }
`;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// คอมโพเนนต์แสดงคำแนะนำ
const InstructionBox = ({ mode }) => (
  <div
    style={{
      background: `${COLORS.background}`,
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "16px",
    }}
  >
    <Space direction="vertical" size={4}>
      <Text strong style={{ color: COLORS.primary, fontSize: "16px" }}>
        <InfoCircleOutlined style={{ marginRight: 8 }} />
        วิธีการเล่น
      </Text>
      <Text>
        {mode === "forward"
          ? "โหมดปกติ (Forward): จดจำตัวเลขจากซ้ายไปขวา เช่น เห็น 123 ต้องจำ 123"
          : "โหมดย้อนกลับ (Backward): จดจำตัวเลขจากขวาไปซ้าย เช่น เห็น 123 ต้องจำ 321"}
      </Text>
      <Text>• คุณมีเวลาจดจำตัวเลข 5 วินาที</Text>
      <Text>• แต่ละระดับมีโอกาสตอบผิดได้ 3 ครั้ง (สังเกตไอคอน ❤️)</Text>
      <Text>• ระดับที่สูงขึ้นจะมีจำนวนตัวเลขเพิ่มขึ้น</Text>
    </Space>
  </div>
);

// Celebration Effects
const celebrateCorrect = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

const celebrateComplete = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

export default function DigitSpan() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [stage, setStage] = useState("intro");
  const [mode, setMode] = useState("forward");
  const [level, setLevel] = useState(1);
  const [digits, setDigits] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [forwardTime, setForwardTime] = useState(0);
  const [backwardTime, setBackwardTime] = useState(0);
  const [previousResults, setPreviousResults] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [nextAction, setNextAction] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [attemptsHistory, setAttemptsHistory] = useState([]);
  const currentLevel = useRef(1);
  const timerRef = useRef(null);
  const [currentModeResults, setCurrentModeResults] = useState({
    mode: "forward",
    totalTime: 0,
    successRate: 0,
    levels: [],
  });

  // กำหนดค่าเริ่มต้นให้กับ nextAction
  useEffect(() => {
    setNextAction({
      text: "เริ่มเกม",
      action: () => startGame()
    });
  }, []);

  // Effect for Timer
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  // Effect for loading previous results
  useEffect(() => {
    const fetchPreviousResults = async () => {
      if (!user?.nationalId) return;

      try {
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/digit-span/${user.nationalId}`
        );

        if (response.data.sessions?.length > 0) {
          const lastSession =
            response.data.sessions[response.data.sessions.length - 1];
          setPreviousResults(lastSession);
        }
      } catch (error) {
        console.error("Error fetching previous results:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    };

    fetchPreviousResults();
  }, [user?.nationalId]);

  // Effect for memorization phase timer
  useEffect(() => {
    if (stage === "memorize") {
      setTimeLeft(5);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStage("input");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const generateDigits = () => {
    const digitCount = LEVEL_DIGITS[currentLevel.current];
    let digits = [];
    while (digits.length < digitCount) {
      const digit = Math.floor(Math.random() * 10);
      if (digits.length === 0 || digit !== digits[digits.length - 1]) {
        digits.push(digit);
      }
    }
    return digits;
  };

  const updateLevel = (newLevel) => {
    currentLevel.current = newLevel;
    setLevel(newLevel);
  };

  const startGame = () => {
    const newDigits = generateDigits();
    setStage("memorize");
    setDigits(newDigits);
    setUserInput([]);
    setIsCorrect(false);
    setIsTimerRunning(true);

    // ตั้งค่าโหมดปัจจุบัน
    setCurrentModeResults((prev) => ({
      ...prev,
      mode: mode,
    }));
    
    // กำหนดค่าเริ่มต้นให้กับ nextAction เมื่อเริ่มเกม
    setNextAction({
      text: "ลองอีกครั้ง",
      action: () => {
        setShowResult(false);
        setUserInput([]);
        startGame();
      }
    });
  };

  const handleInput = (digit) => {
    if (userInput.length < LEVEL_DIGITS[currentLevel.current]) {
      setUserInput([...userInput, digit]);
    }
  };

  const handleSubmit = () => {
    setIsTimerRunning(false);

    const reversedDigits = [...digits].reverse();
    const correctDigits = mode === "forward" ? digits : reversedDigits;
    const correct = userInput.every(
      (d, i) => parseInt(d) === correctDigits[i]
    );

    // บันทึกผลของระดับปัจจุบัน (ใช้ค่า correct โดยตรง)
    const levelResult = {
      level: currentLevel.current,
      digits: digits,
      userAnswer: userInput.map(Number),
      isCorrect: correct, // ใช้ correct โดยตรง
      attemptsUsed: 3 - attempts,
      timeSpent:
        elapsedTime -
        currentModeResults.levels.reduce(
          (acc, cur) => acc + (cur.timeSpent || 0),
          0
        ),
    };

    // อัปเดต levels และคำนวณอัตราการตอบถูก
    const updatedLevels = [...currentModeResults.levels, levelResult];
    const correctAnswers = updatedLevels.filter(
      (level) => level.isCorrect === true
    ).length;
    const successRate = (correctAnswers / updatedLevels.length) * 100;

    // อัปเดต state
    setCurrentModeResults({
      ...currentModeResults,
      levels: updatedLevels,
      successRate: successRate,
      totalTime: elapsedTime,
    });

    // อัปเดต isCorrect (หลังจากบันทึกผลแล้ว)
    setIsCorrect(correct);
    
    if (correct) {
      celebrateCorrect();
      message.success("ถูกต้อง!");

      if (currentLevel.current === 6) {
        // ถ้าเป็นเลเวลสุดท้าย ให้จบเกม
        setNextAction({
          text: "ดูผลการทดสอบ",
          action: () => {
            const currentModeTime = elapsedTime;

            // เก็บผลลัพธ์ตามโหมดที่เล่น
            if (mode === "forward") {
              setForwardTime(currentModeTime);
              handleTestComplete();
            } else {
              setBackwardTime(currentModeTime);
              handleTestComplete();
            }
          },
        });
      } else {
        // ถ้ายังไม่ถึงเลเวลสุดท้าย ให้ไปเลเวลถัดไป
        setNextAction({
          text: `ไป Level ${currentLevel.current + 1}`,
          action: () => {
            updateLevel(currentLevel.current + 1);
            setShowResult(false);
            setAttempts(3);
            startGame();
          },
        });
      }
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);

      if (newAttempts === 0) {
        // หมดโอกาสแล้ว
        message.error("หมดโอกาสแล้ว");

        if (currentLevel.current === 6) {
          // ถ้าเป็นเลเวลสุดท้าย ให้จบเกม
          setNextAction({
            text: "ดูผลการทดสอบ",
            action: () => {
              const currentModeTime = elapsedTime;

              // เก็บผลลัพธ์ตามโหมดที่เล่น
              if (mode === "forward") {
                setForwardTime(currentModeTime);
                handleTestComplete();
              } else {
                setBackwardTime(currentModeTime);
                handleTestComplete();
              }
            },
          });
        } else {
          // ถ้ายังไม่ถึงเลเวลสุดท้าย ให้ไปเลเวลถัดไป
          setNextAction({
            text: `ไป Level ${currentLevel.current + 1}`,
            action: () => {
              updateLevel(currentLevel.current + 1);
              setAttempts(3);
              setShowResult(false);
              startGame();
            },
          });
        }
      } else {
        // ยังมีโอกาสลองอีกครั้ง
        message.error(`ไม่ถูกต้อง เหลือโอกาสอีก ${newAttempts} ครั้ง`);
        setNextAction({
          text: "ลองอีกครั้ง",
          action: () => {
            setShowResult(false);
            setUserInput([]);
            startGame();
          },
        });
      }
    }
    setShowResult(true);
  };

  const handleTestComplete = async () => {
    try {
      // ตรวจสอบว่าเล่นโหมดไหน
      const isForwardMode = mode === "forward";
      
      // สร้าง sessionData
      const sessionData = {
        totalTime: elapsedTime,
        forwardTime: isForwardMode ? elapsedTime : 0,
        backwardTime: isForwardMode ? 0 : elapsedTime,
        successRate: currentModeResults.successRate || 0,
        forwardSuccessRate: isForwardMode ? currentModeResults.successRate : 0,
        backwardSuccessRate: isForwardMode ? 0 : currentModeResults.successRate,
        modes: [currentModeResults] 
      };

      const response = await axios.post(
        "https://brain-training-server.onrender.com/api/digit-span/save-session",
        {
          nationalId: user.nationalId,
          sessionData: sessionData,
        }
      );

      if (response.data.comparison) {
        setComparison(response.data.comparison);
        if (response.data.messages?.overall) {
          message.success(response.data.messages.overall);
        }
      }

      setStage("completed");
      celebrateComplete();
    } catch (error) {
      console.error("Error saving results:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกผล");
    }
  };

  const renderIntro = () => (
    <StyledCard>
      <Space
        direction="vertical"
        size={24}
        style={{ width: "100%", textAlign: "center" }}
      >
        <Title level={2} style={{ color: COLORS.primary, marginBottom: 0 }}>
          เกมสนุกเลข ปลุกพลังสมอง
        </Title>

        <Text style={{ fontSize: "16px", color: COLORS.dark }}>
          เกมฝึกความจำสนุกๆ ที่จะช่วยพัฒนาสมองของคุณ!
          คุณจะได้เห็นตัวเลขปรากฏบนหน้าจอ แล้วต้องจำให้ได้ภายในเวลาที่กำหนด
        </Text>

        <div
          style={{
            background: COLORS.background,
            padding: "24px",
            borderRadius: "12px",
            margin: "12px 0",
          }}
        >
          <Text
            strong
            style={{
              fontSize: "18px",
              color: COLORS.primary,
              display: "block",
              marginBottom: "16px",
            }}
          >
            วิธีการเล่น
          </Text>

          <Space direction="vertical" size={16} style={{ textAlign: "left" }}>
            <div>
              <Text strong>1. ระดับความยาก:</Text>
              <Text> มี 6 ระดับ แต่ละระดับจะเพิ่มจำนวนตัวเลข</Text>
              <Text
                style={{
                  display: "block",
                  color: COLORS.secondary,
                  marginTop: "4px",
                }}
              >
                เช่น: ระดับ 1 = 3 หลัก (234), ระดับ 2 = 4 หลัก (5678)
              </Text>
            </div>

            <div>
              <Text strong>2. โหมดการเล่น:</Text>
              <div style={{ marginLeft: "16px" }}>
                <Text style={{ display: "block" }}>
                  • แบบปกติ (Forward): จำตัวเลขจากซ้ายไปขวา
                </Text>
                <Text style={{ color: COLORS.secondary }}>
                  ถ้าเห็น "123" ต้องตอบ "123"
                </Text>
                <Text style={{ display: "block" }}>
                  • แบบย้อนกลับ (Backward): จำตัวเลขจากขวาไปซ้าย
                </Text>
                <Text style={{ color: COLORS.secondary }}>
                  ถ้าเห็น "123" ต้องตอบ "321"
                </Text>
              </div>
            </div>

            <div>
              <Text strong>3. เวลาและโอกาส:</Text>
              <Text style={{ display: "block" }}>
                • มีเวลาดูตัวเลข 5 วินาที
              </Text>
              <Text style={{ display: "block" }}>
                • ตอบผิดได้ 3 ครั้งในแต่ละระดับ
              </Text>
              <Text style={{ display: "block", color: COLORS.secondary }}>
                สังเกตไอคอน ❤️ ด้านบนเพื่อดูจำนวนโอกาสที่เหลือ
              </Text>
            </div>

            <div>
              <Text strong>4. คำแนะนำ:</Text>
              <Text style={{ display: "block" }}>
                • พยายามจัดกลุ่มตัวเลขในใจเพื่อจำได้ง่ายขึ้น
              </Text>
              <Text style={{ display: "block" }}>
                • ฝึกท่องตัวเลขในใจระหว่างที่รอ
              </Text>
            </div>
          </Space>
        </div>

        {/* เพิ่มตัวเลือกโหมดการเล่น */}
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Text strong style={{ fontSize: "18px", color: COLORS.primary }}>
            เลือกโหมดการเล่น
          </Text>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card
                hoverable
                style={{
                  borderColor: mode === "forward" ? COLORS.primary : "#f0f0f0",
                  backgroundColor:
                    mode === "forward" ? COLORS.background : "white",
                }}
                onClick={() => setMode("forward")}
              >
                <Title level={5} style={{ color: COLORS.primary, margin: 0 }}>
                (Forward)
                </Title>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                hoverable
                style={{
                  borderColor: mode === "backward" ? COLORS.primary : "#f0f0f0",
                  backgroundColor:
                    mode === "backward" ? COLORS.background : "white",
                }}
                onClick={() => setMode("backward")}
              >
                <Title level={5} style={{ color: COLORS.primary, margin: 0 }}>
                  (Backward)
                </Title>
              </Card>
            </Col>
          </Row>
        </div>

        <StartGameButton size="large" onClick={startGame}>
          เริ่มเกม
        </StartGameButton>
      </Space>
    </StyledCard>
  );

  const renderMemorize = () => (
    <StyledCard>
      <LevelIndicator>
        <span className="mode">
          {mode === "forward" ? "Forward" : "Backward"}
        </span>
        <span className="level">Level {currentLevel.current}</span>
      </LevelIndicator>

      <TimerContainer style={{ right: "240px" }}>
        <TimerLabel>เวลาทั้งหมด</TimerLabel>
        <TimerValue>
          <ClockCircleOutlined className="icon" />
          {formatTime(elapsedTime)}
        </TimerValue>
      </TimerContainer>

      {/* เพิ่มคำแนะนำ */}
      <InstructionBox mode={mode} />

      <Text style={{ display: "block", textAlign: "center", marginBottom: 16 }}>
        มีเวลาจำ {timeLeft} วินาที
      </Text>

      <DigitDisplay>{digits.join("")}</DigitDisplay>
    </StyledCard>
  );

  const renderInput = () => (
    <InputCard>
      <div className="card-content">
        <AttemptsContainer>
          {[...Array(3)].map((_, index) => (
            <HeartIcon key={index} active={index < attempts} />
          ))}
        </AttemptsContainer>

        <LevelIndicator>
          <span className="mode">
            {mode === "forward" ? "Forward" : "Backward"}
          </span>
          <span className="level">Level {currentLevel.current}</span>
        </LevelIndicator>

        <TimerContainer>
          <TimerLabel>เวลาทั้งหมด</TimerLabel>
          <TimerValue>
            <ClockCircleOutlined className="icon" />
            {formatTime(elapsedTime)}
          </TimerValue>
        </TimerContainer>

        {/* เพิ่มคำแนะนำ */}
        <InstructionBox mode={mode} />

        <Text
          style={{ textAlign: "center", display: "block", marginBottom: 16 }}
        >
          {mode === "forward"
            ? "กรอกตัวเลขตามลำดับที่เห็น"
            : "กรอกตัวเลขย้อนกลับจากที่เห็น"}
        </Text>

        <DigitDisplay>{userInput.map((d) => d).join("") || " "}</DigitDisplay>

        {!showResult ? (
          <NumberPad>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <NumberButton
                key={digit}
                onClick={() => handleInput(digit)}
                disabled={
                  userInput.length === LEVEL_DIGITS[currentLevel.current]
                }
              >
                {digit}
              </NumberButton>
            ))}
            <NumberButton
              onClick={() => setUserInput((prev) => prev.slice(0, -1))}
              disabled={userInput.length === 0}
            >
              ←
            </NumberButton>
            <NumberButton
              onClick={() => handleInput(0)}
              disabled={userInput.length === LEVEL_DIGITS[currentLevel.current]}
            >
              0
            </NumberButton>
            <SendButton
              onClick={handleSubmit}
              disabled={userInput.length !== LEVEL_DIGITS[currentLevel.current]}
            >
              ส่ง
            </SendButton>
          </NumberPad>
        ) : (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Title
              level={3}
              style={{
                color: isCorrect ? COLORS.success : COLORS.error,
                marginBottom: "24px",
              }}
            >
              {isCorrect
                ? "🎉 ยอดเยี่ยม! คำตอบถูกต้อง"
                : attempts === 0
                ? "😢 หมดโอกาสแล้ว"
                : "😢 เสียใจด้วย คำตอบไม่ถูกต้อง"}
            </Title>
            <Text
              style={{
                display: "block",
                marginBottom: "16px",
                fontSize: "18px",
                color: COLORS.dark,
              }}
            >
              ตัวเลขที่ถูกต้อง:{" "}
              <span style={{ fontWeight: "bold", letterSpacing: "2px" }}>
                {mode === "forward"
                  ? digits.join("")
                  : [...digits].reverse().join("")}
              </span>
            </Text>
            {/* เพิ่มการตรวจสอบว่า nextAction มีค่าหรือไม่ */}
            {nextAction && (
              <ResultButton
                type={isCorrect ? "primarys" : "defaults"}
                size="large"
                onClick={nextAction.action}
              >
                {nextAction.text}
              </ResultButton>
            )}
          </div>
        )}
      </div>
    </InputCard>
  );

  const renderSummary = () => (
    <StyledCard>
      <Title level={2} style={{ textAlign: "center", color: COLORS.primary }}>
        สรุปผลการทดสอบ
      </Title>

      {/* แสดงว่าเล่นโหมดไหน */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Text
          style={{ fontSize: 18, color: COLORS.primary, fontWeight: "bold" }}
        >
          โหมดการเล่น:{" "}
          {mode === "forward" ? "แบบปกติ (Forward)" : "แบบย้อนกลับ (Backward)"}
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Title level={4}>ครั้งนี้</Title>
          <Space direction="vertical" size={16}>
            {/* แสดงเฉพาะโหมดที่เล่น */}
            {mode === "forward" ? (
              <div>
                เวลาที่ใช้: {formatTime(elapsedTime)}
                {comparison?.forwardTime && (
                  <Text
                    style={{
                      marginLeft: 8,
                      color: comparison.forwardTime.improved
                        ? COLORS.success
                        : COLORS.error,
                    }}
                  >
                    {comparison.forwardTime.improved ? (
                      <ArrowDownOutlined />
                    ) : (
                      <ArrowUpOutlined />
                    )}
                    {formatTime(Math.abs(comparison.forwardTime.difference))}
                  </Text>
                )}
              </div>
            ) : (
              <div>
                เวลาที่ใช้: {formatTime(elapsedTime)}
                {comparison?.backwardTime && (
                  <Text
                    style={{
                      marginLeft: 8,
                      color: comparison.backwardTime.improved
                        ? COLORS.success
                        : COLORS.error,
                    }}
                  >
                    {comparison.backwardTime.improved ? (
                      <ArrowDownOutlined />
                    ) : (
                      <ArrowUpOutlined />
                    )}
                    {formatTime(Math.abs(comparison.backwardTime.difference))}
                  </Text>
                )}
              </div>
            )}

            {/* แสดงอัตราการตอบถูก */}
            <div>
              อัตราการตอบถูก:{" "}
              {
                // ตรวจสอบค่าให้แน่ใจว่ามีค่าที่ถูกต้อง
                currentModeResults &&
                typeof currentModeResults.successRate === "number"
                  ? currentModeResults.successRate.toFixed(1) + "%"
                  : "0.0%"
              }
              {comparison &&
                comparison[
                  mode === "forward"
                    ? "forwardSuccessRate"
                    : "backwardSuccessRate"
                ] && (
                  <Text
                    style={{
                      marginLeft: 8,
                      color: comparison[
                        mode === "forward"
                          ? "forwardSuccessRate"
                          : "backwardSuccessRate"
                      ].improved
                        ? COLORS.success
                        : COLORS.error,
                    }}
                  >
                    {comparison[
                      mode === "forward"
                        ? "forwardSuccessRate"
                        : "backwardSuccessRate"
                    ].improved ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                    {Math.abs(
                      comparison[
                        mode === "forward"
                          ? "forwardSuccessRate"
                          : "backwardSuccessRate"
                      ].difference
                    ).toFixed(1)}
                    %
                  </Text>
                )}
            </div>
          </Space>
        </Col>

        <Col span={12}>
          <Title level={4}>ครั้งก่อน</Title>
          <Space direction="vertical" size={16}>
            {/* แสดงเฉพาะโหมดที่เล่น */}
            {mode === "forward" ? (
              <div>
                เวลาที่ใช้:{" "}
                {previousResults && previousResults.forwardTime
                  ? formatTime(previousResults.forwardTime)
                  : "-"}
              </div>
            ) : (
              <div>
                เวลาที่ใช้:{" "}
                {previousResults && previousResults.backwardTime
                  ? formatTime(previousResults.backwardTime)
                  : "-"}
              </div>
            )}

            {/* แสดงอัตราการตอบถูกของครั้งก่อน */}
            <div>
              อัตราการตอบถูก:{" "}
              {previousResults &&
              (mode === "forward"
                ? previousResults.forwardSuccessRate
                : previousResults.backwardSuccessRate)
                ? `${(mode === "forward"
                    ? previousResults.forwardSuccessRate
                    : previousResults.backwardSuccessRate
                  ).toFixed(1)}%`
                : "-"}
            </div>
          </Space>
        </Col>
      </Row>

      {/* คำแนะนำเพิ่มเติม */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Text style={{ fontSize: 16, display: "block", marginBottom: 8 }}>
          <InfoCircleOutlined style={{ marginRight: 8 }} />
          ลองฝึกฝนบ่อยๆ เพื่อพัฒนาความจำของคุณ
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.secondary }}>
          โปรดทดลองเล่นทั้งโหมด Forward และ Backward เพื่อฝึกสมองทั้งสองด้าน
        </Text>
      </div>

      {/* แสดงประวัติการเล่นของโหมดปัจจุบัน */}
      {previousResults &&
        previousResults.sessions &&
        previousResults.sessions.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4} style={{ color: COLORS.primary }}>
              ประวัติการเล่น {mode === "forward" ? "Forward" : "Backward"} Mode
            </Title>

            <Table
              dataSource={previousResults.sessions
                .filter(
                  (session) =>
                    (mode === "forward" && session.forwardTime > 0) ||
                    (mode === "backward" && session.backwardTime > 0)
                )
                .map((session, index) => ({
                  key: index,
                  date: new Date(session.completedAt).toLocaleDateString(
                    "th-TH"
                  ),
                  time: formatTime(
                    mode === "forward"
                      ? session.forwardTime
                      : session.backwardTime
                  ),
                  successRate: `${(mode === "forward"
                    ? session.forwardSuccessRate || 0
                    : session.backwardSuccessRate || 0
                  ).toFixed(1)}%`,
                }))}
                columns={[
                  {
                    title: "วันที่",
                    dataIndex: "date",
                    key: "date",
                  },
                  {
                    title: "เวลาที่ใช้",
                    dataIndex: "time",
                    key: "time",
                  },
                  {
                    title: "อัตราการตอบถูก",
                    dataIndex: "successRate",
                    key: "successRate",
                  },
                ]}
                pagination={false}
                size="small"
              />
            </div>
          )}
  
        <Space style={{ width: "100%", justifyContent: "center", marginTop: 32 }}>
          <EndGameButton onClick={() => window.location.reload()}>
            เริ่มทำแบบทดสอบใหม่
          </EndGameButton>
          <GohomeButton onClick={() => navigate("/")}>กลับหน้าหลัก</GohomeButton>
        </Space>
      </StyledCard>
    );
  
    return (
      <PageContainer>
        <ContentContainer>
          {stage === "intro" && renderIntro()}
          {stage === "memorize" && renderMemorize()}
          {stage === "input" && renderInput()}
          {stage === "completed" && renderSummary()}
        </ContentContainer>
      </PageContainer>
    );
  }