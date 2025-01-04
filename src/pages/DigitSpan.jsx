import React, { useRef, useState, useEffect } from "react";
import { Card, Space, Typography, Button, message, Row, Col } from "antd";
import {
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
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
  color: #FFF;
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

  // States
  const [stage, setStage] = useState("intro"); // intro, memorize, input, completed
  const [mode, setMode] = useState("forward"); // forward, backward
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
  const currentLevel = useRef(1);
  const timerRef = useRef(null);
  const [forwardResults, setForwardResults] = useState(null);
  const [currentModeResults, setCurrentModeResults] = useState({
    mode: "forward",
    totalTime: 0,
    levels: [],
  });

  // Function สำหรับเก็บผลลัพธ์แต่ละ level
  const saveCurrentLevelResult = () => {
    const levelResult = {
      level: currentLevel.current,
      digits: digits,
      userAnswer: userInput.map(Number),
      isCorrect: isCorrect,
      timeSpent:
        elapsedTime -
        currentModeResults.levels.reduce((acc, cur) => acc + cur.timeSpent, 0),
    };

    setCurrentModeResults((prev) => ({
      ...prev,
      levels: [...prev.levels, levelResult],
    }));
  };

  // Timer Effect - จัดการการนับเวลา
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

  // Load previous results
  useEffect(() => {
    const fetchPreviousResults = async () => {
      if (!user?.nationalId) return;

      try {
        const response = await axios.get(
          `https://brain-training-server-production.up.railway.app/api/digit-span/${user.nationalId}`
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

  // Timer for memorization phase
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
    setIsTimerRunning(true); // เริ่มจับเวลาเมื่อเริ่มเกม
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
    const correct = userInput.every((d, i) => parseInt(d) === correctDigits[i]);

    setIsCorrect(correct);

    if (correct) {
      celebrateCorrect();
      message.success("ถูกต้อง!");

      if (currentLevel.current === 6) {
        if (mode === "forward") {
          const currentForwardTime = elapsedTime;
          setForwardTime(currentForwardTime);
          saveCurrentLevelResult();
          const completedForwardResults = {
            ...currentModeResults,
            mode: "forward",
            totalTime: currentForwardTime,
          };
          setForwardResults(completedForwardResults);
          setNextAction({
            text: "เริ่มโหมด Backward",
            action: () => {
              setMode("backward");
              updateLevel(1);
              setShowResult(false);
              setElapsedTime(0);
              setCurrentModeResults({
                mode: "backward",
                totalTime: 0,
                levels: [],
              });
              startGame();
            },
          });
        } else {
          const currentBackwardTime = elapsedTime;
          setBackwardTime(currentBackwardTime);
          saveCurrentLevelResult();
          const backwardResults = {
            ...currentModeResults,
            mode: "backward",
            totalTime: currentBackwardTime,
          };
          setNextAction({
            text: "ดูผลการทดสอบ",
            action: () => {
              handleTestComplete(forwardResults, backwardResults);
            },
          });
        }
      } else {
        saveCurrentLevelResult();
        setNextAction({
          text: `ไป Level ${currentLevel.current + 1}`,
          action: () => {
            updateLevel(currentLevel.current + 1);
            setShowResult(false);
            startGame();
          },
        });
      }
    } else {
      saveCurrentLevelResult();
      message.error("ไม่ถูกต้อง");
      setNextAction({
        text: "ลองอีกครั้ง",
        action: () => {
          setShowResult(false);
          setUserInput([]);
          startGame();
        },
      });
    }
    setShowResult(true);
  };

  const handleTestComplete = async (forwardResults, backwardResults) => {
    try {
      // อัพเดทค่า backwardTime ให้ถูกต้องจาก backwardResults
      const forwardTime = forwardResults.totalTime;
      const backwardTime = backwardResults.totalTime;
      const totalTimeSpent = forwardTime + backwardTime;

      const response = await axios.post(
        "https://brain-training-server-production.up.railway.app/api/digit-span/save-session",
        {
          nationalId: user.nationalId,
          sessionData: {
            totalTime: totalTimeSpent,
            forwardTime: forwardResults.totalTime, // ใช้ค่าจาก results โดยตรง
            backwardTime: backwardResults.totalTime, // ใช้ค่าจาก results โดยตรง
            modes: [forwardResults, backwardResults],
          },
        }
      );

      if (response.data.comparison) {
        setComparison(response.data.comparison);
        if (response.data.messages.overall) {
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
          Digit Span Memory Training
        </Title>

        <Text style={{ fontSize: "16px", color: COLORS.dark }}>
          แบบทดสอบนี้จะช่วยฝึกความจำระยะสั้นของคุณ โดยจะมีตัวเลขแสดงขึ้นมาให้จำ
          และคุณจะต้องจำตัวเลขเหล่านั้นให้ได้ในเวลาที่กำหนด
          <br />
          <br />
          • มี 6 ระดับ เริ่มจาก 3 หลักไปจนถึง 8 หลัก
          <br />
          • แต่ละระดับจะมีเวลาให้จำ 5 วินาที
          <br />• มีทั้งโหมด Forward (จำปกติ) และ Backward (จำแบบย้อนกลับ)
        </Text>

        <StartGameButton size="large" onClick={startGame}>
          เริ่มทำแบบทดสอบ
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

      <DigitDisplay>{digits.join("")}</DigitDisplay>
    </StyledCard>
  );

  const renderInput = () => (
    <InputCard>
      <div className="card-content">
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

        <Text
          style={{ textAlign: "center", display: "block", marginBottom: 24 }}
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
            <ResultButton
              type={isCorrect ? "primarys" : "defaults"}
              size="large"
              onClick={nextAction.action}
            >
              {nextAction.text}
            </ResultButton>
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

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Title level={4}>ครั้งนี้</Title>
          <Space direction="vertical" size={16}>
            <div>
              Forward: {formatTime(forwardTime)}
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
            <div>
              Backward: {formatTime(backwardTime)}
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
            <div>
              รวมเวลาทั้งหมด: {formatTime(forwardTime + backwardTime)}
              {comparison?.totalTime && (
                <Text
                  style={{
                    marginLeft: 8,
                    color: comparison.totalTime.improved
                      ? COLORS.success
                      : COLORS.error,
                  }}
                >
                  {comparison.totalTime.improved ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )}
                  {formatTime(Math.abs(comparison.totalTime.difference))}
                </Text>
              )}
            </div>
          </Space>
        </Col>

        <Col span={12}>
          <Title level={4}>ครั้งก่อน</Title>
          <Space direction="vertical" size={16}>
            <div>
              Forward:{" "}
              {previousResults && previousResults.forwardTime
                ? formatTime(previousResults.forwardTime)
                : "-"}
            </div>
            <div>
              Backward:{" "}
              {previousResults && previousResults.backwardTime
                ? formatTime(previousResults.backwardTime)
                : "-"}
            </div>
            <div>
              รวม:{" "}
              {previousResults && previousResults.totalTime
                ? formatTime(previousResults.totalTime)
                : "-"}
            </div>
          </Space>
        </Col>
      </Row>

      <Space style={{ width: "100%", justifyContent: "center", marginTop: 32 }}>
        <EndGameButton  onClick={() => window.location.reload()}>
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
