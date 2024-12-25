// ColorSortingGame.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Space,
  Typography,
  Button,
  message,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  ClockCircleOutlined,
  SwapOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import axios from "axios";
const { Title, Text } = Typography;

// Color Constants
const COLORS = {
  primary: "#7c3aed",
  secondary: "#a78bfa",
  background: "#7c3aed10",
  dark: "#1f2937",
  light: "#f8fafc",
  shadow: "rgba(17, 12, 46, 0.1)",
};

// Game Colors
const GAME_COLORS = [
  "#FF6B6B", // แดง
  "#f2993a", // ส้ม
  "#45B7D1", // น้ำเงิน
  "#68f558", // เขียว
  "#fccf51", // เหลือง
  "#D4A5A5", // ชมพู
  "#9370DB", // ม่วง
  "#3d8bff", // เขียวน้ำทะเล
];

// Level Colors
const LEVEL_COLORS = {
  easy: "#4CAF50",
  medium: "#2196F3",
  hard: "#F44336",
};

// Animation for celebrating
const celebrateAnimation = () => {
  // ยิง confetti จากกลางจอ
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  // ยิง confetti จากมุมซ้าย
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
  });

  // ยิง confetti จากมุมขวา
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
  });
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${COLORS.background};
  padding: 20px 12px;

  @media (min-width: 768px) {
    padding: 40px 24px;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: row; // รักษา layout แนวนอนเสมอ
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 16px;
  }
  
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 12px;
    margin-top: 20px;
  }
  
  @media (min-width: 769px) {
    gap: 32px;
    margin-top: 32px;
  }
`;

const GameBoard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0; // ป้องกัน flex child จากการขยายเกินขนาด parent
  
  @media (max-width: 480px) {
    gap: 8px;
  }
  
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 10px;
  }
  
  @media (min-width: 769px) {
    gap: 24px;
  }
`;

const BoxGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.level === "easy"
      ? "repeat(2, 1fr)"
      : props.level === "medium"
      ? "repeat(3, 1fr)"
      : "repeat(5, 1fr)"};
  gap: 4px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  
  @media (max-width: 480px) {
    padding: 4px;
    gap: 2px;
    border-radius: 6px;
  }
  
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 6px;
    gap: 3px;
    border-radius: 8px;
  }
  
  @media (min-width: 769px) {
    padding: 16px;
    gap: 8px;
    border-radius: 12px;
  }
`;

const ColorBox = styled.div`
  aspect-ratio: 1;
  background-color: ${(props) => props.color};
  border-radius: 6px;
  cursor: ${(props) => (props.isTarget ? "default" : "pointer")};
  transition: all 0.2s ease;
  border: 2px solid transparent;

  ${(props) =>
    props.isSelected &&
    `
    transform: scale(0.95);
    border-color: ${COLORS.primary};
    box-shadow: 0 0 12px rgba(124, 58, 237, 0.3);
  `}

  &:hover {
    transform: ${(props) =>
      !props.isTarget && (props.isSelected ? "scale(0.95)" : "scale(1.05)")};
  }
  
  @media (min-width: 769px) {
    border-radius: 8px;
    border-width: 3px;
  }
`;

const StyledCard = styled(Card)`
  background: white;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  margin-bottom: 12px;

  .ant-card-body {
    padding: 16px;
  }

  @media (min-width: 768px) {
    border-radius: 12px;
    margin-bottom: 16px;

    .ant-card-body {
      padding: 24px;
    }
  }
`;

const ActionButton = styled(Button)`
  min-width: 100px;
  height: 40px;
  border-radius: 6px;
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

  @media (min-width: 768px) {
    min-width: 120px;
    height: 44px;
    border-radius: 8px;
  }
`;

const StyledTitle = styled(Title)`
  font-size: 20px !important;
  margin-bottom: 20px !important;

  @media (min-width: 768px) {
    font-size: 24px !important;
    margin-bottom: 32px !important;
  }
`;

export default function ColorSortingGame() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [level, setLevel] = useState("easy");
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [selectedBox, setSelectedBox] = useState(null);
  const [targetPattern, setTargetPattern] = useState([]);
  const [currentPattern, setCurrentPattern] = useState([]);
  const [timer, setTimer] = useState(null);
  const [gameStats, setGameStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previousResults, setPreviousResults] = useState(null);
  const [comparison, setComparison] = useState(null);

  // Load previous results if they exist
  useEffect(() => {
    const fetchPreviousResults = async () => {
      if (!user?.nationalId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/game-results/${user.nationalId}`
        );

        if (response.data.sessions?.length > 0) {
          setPreviousResults(
            response.data.sessions[response.data.sessions.length - 1]
          );
        }
      } catch (error) {
        console.error("Error fetching previous results:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousResults();
  }, [user?.nationalId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  // สุ่มสีสำหรับรูปแบบต้นฉบับ
  const generatePattern = (level) => {
    const boxCount = level === "easy" ? 4 : level === "medium" ? 12 : 25;
    const colors = [];
    for (let i = 0; i < boxCount; i++) {
      colors.push(GAME_COLORS[i % GAME_COLORS.length]);
    }
    return shuffleArray([...colors]);
  };

  // สลับตำแหน่งของ array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // เริ่มเกมใหม่
  const startGame = (nextLevel = level) => {
    const target = generatePattern(nextLevel);
    setTargetPattern(target);
    setCurrentPattern(shuffleArray([...target]));
    setMoves(0);
    setTime(0);
    setSelectedBox(null);
    setGameState("playing");

    const intervalId = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    setTimer(intervalId);
  };

  // จัดการการคลิกที่กล่องสี
  const handleBoxClick = (index) => {
    if (gameState !== "playing") return;

    if (selectedBox === null) {
      setSelectedBox(index);
    } else {
      const newPattern = [...currentPattern];
      [newPattern[selectedBox], newPattern[index]] = [
        newPattern[index],
        newPattern[selectedBox],
      ];
      setCurrentPattern(newPattern);
      setSelectedBox(null);
      setMoves((prev) => prev + 1);

      if (JSON.stringify(newPattern) === JSON.stringify(targetPattern)) {
        handleLevelComplete();
      }
    }
  };

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Reset game
  const resetGame = () => {
    clearInterval(timer);
    setGameState("waiting");
    setLevel("easy");
    setGameStats([]);
    setMoves(0);
    setTime(0);
    setSelectedBox(null);
    setTargetPattern([]);
    setCurrentPattern([]);
    setComparison(null);
  };

  const handleLevelComplete = async () => {
    clearInterval(timer);

    // บันทึกผลของระดับปัจจุบัน
    const currentScore = {
      level,
      time,
      moves,
    };

    // อัพเดท gameStats ด้วยผลระดับปัจจุบัน
    const updatedStats = [...gameStats, currentScore];
    setGameStats(updatedStats);

    // แสดง celebration animation
    celebrateAnimation();

    if (level === "easy") {
      await message.success("ยอดเยี่ยม! ผ่านระดับง่ายแล้ว", 1.5);
      setLevel("medium");
      startGame("medium");
    } else if (level === "medium") {
      await message.success("เก่งมาก! ผ่านระดับกลางแล้ว", 1.5);
      setLevel("hard");
      startGame("hard");
    } else {
      // จบเกมระดับยาก
      clearInterval(timer);
      setGameState("completed");

      try {
        // รวมคะแนนทั้งหมดรวมถึงระดับยาก
        const sessionData = {
          totalTime: updatedStats.reduce((total, stat) => total + stat.time, 0),
          totalMoves: updatedStats.reduce(
            (total, stat) => total + stat.moves,
            0
          ),
          games: updatedStats, // ส่งข้อมูลทุกระดับรวมถึงระดับยาก
        };

        const response = await axios.post(
          "https://brain-training-server.onrender.com/api/game-results/save-session",
          {
            nationalId: user.nationalId,
            sessionData,
          }
        );

        if (response.data.comparison) {
          setComparison(response.data.comparison);

          if (response.data.messages.overall) {
            message.success(response.data.messages.overall);
          }
        }

        message.success("ยอดเยี่ยม! คุณผ่านทุกระดับแล้ว");

        setTimeout(() => {
          celebrateAnimation();
        }, 500);
      } catch (error) {
        console.error("Error saving results:", error);
        message.error("เกิดข้อผิดพลาดในการบันทึกผล");
      }
    }
  };

  const renderComparison = () => (
    <StyledCard>
      <Title level={4}>เปรียบเทียบผลการเล่น</Title>
      <Row gutter={[16, 24]}>
        {/* หัวข้อ */}
        <Col span={8}></Col>
        <Col span={8}>
          <Text strong style={{ color: COLORS.secondary }}>
            ครั้งที่แล้ว
          </Text>
        </Col>
        <Col span={8}>
          <Text strong style={{ color: COLORS.primary }}>
            ครั้งนี้
          </Text>
        </Col>

        {/* เวลารวม */}
        <Col span={8}>
          <Text strong>เวลารวมทั้งหมด</Text>
        </Col>
        <Col span={8}>
          <Text>{formatTime(previousResults?.totalTime || 0)}</Text>
        </Col>
        <Col span={8}>
          <Text>
            {formatTime(
              gameStats.reduce((total, stat) => total + stat.time, 0)
            )}
            {comparison && (
              <Text
                style={{
                  marginLeft: "8px",
                  color: comparison.totalTime.improved ? "#3f8600" : "#cf1322",
                }}
              >
                ({comparison.totalTime.improved ? "↓" : "↑"}{" "}
                {formatTime(Math.abs(comparison.totalTime.difference))})
              </Text>
            )}
          </Text>
        </Col>

        {/* จำนวนการเคลื่อนย้าย */}
        <Col span={8}>
          <Text strong>จำนวนการเคลื่อนย้ายรวม</Text>
        </Col>
        <Col span={8}>
          <Text>{previousResults?.totalMoves || 0} ครั้ง</Text>
        </Col>
        <Col span={8}>
          <Text>
            {gameStats.reduce((total, stat) => total + stat.moves, 0)} ครั้ง
            {comparison && (
              <Text
                style={{
                  marginLeft: "8px",
                  color: comparison.totalMoves.improved ? "#3f8600" : "#cf1322",
                }}
              >
                ({comparison.totalMoves.improved ? "↓" : "↑"}{" "}
                {Math.abs(comparison.totalMoves.difference)})
              </Text>
            )}
          </Text>
        </Col>
      </Row>
    </StyledCard>
  );

  const renderLevelComparison = (level, index) => {
    const previousLevel = previousResults?.games?.[index];
    const currentLevel = gameStats[index];
    const comparisonData = comparison?.games?.[index];

    return (
      <StyledCard key={index}>
        <Title
          level={4}
          style={{
            color: LEVEL_COLORS[level],
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <TrophyOutlined />
          {level === "easy"
            ? "ระดับง่าย"
            : level === "medium"
            ? "ระดับกลาง"
            : "ระดับยาก"}
        </Title>
        <Row gutter={[16, 24]}>
          <Col span={8}></Col>
          <Col span={8}>
            <Text strong style={{ color: COLORS.secondary }}>
              {previousLevel ? "ครั้งที่แล้ว" : "-"}
            </Text>
          </Col>
          <Col span={8}>
            <Text strong style={{ color: COLORS.primary }}>
              ครั้งนี้
            </Text>
          </Col>

          {/* เวลาที่ใช้ */}
          <Col span={8}>
            <Text strong>เวลาที่ใช้</Text>
          </Col>
          <Col span={8}>
            {previousLevel ? (
              <Text>{formatTime(previousLevel.time)}</Text>
            ) : (
              <Text>-</Text>
            )}
          </Col>
          <Col span={8}>
            <Text>
              {formatTime(currentLevel.time)}
              {previousLevel && comparisonData && (
                <Text
                  style={{
                    marginLeft: "8px",
                    color: comparisonData.time.improved ? "#3f8600" : "#cf1322",
                  }}
                >
                  ({comparisonData.time.improved ? "↓" : "↑"}{" "}
                  {formatTime(Math.abs(comparisonData.time.difference))})
                </Text>
              )}
            </Text>
          </Col>

          {/* จำนวนการเคลื่อนย้าย */}
          <Col span={8}>
            <Text strong>จำนวนการเคลื่อนย้าย</Text>
          </Col>
          <Col span={8}>
            {previousLevel ? (
              <Text>{previousLevel.moves} ครั้ง</Text>
            ) : (
              <Text>-</Text>
            )}
          </Col>
          <Col span={8}>
            <Text>
              {currentLevel.moves} ครั้ง
              {previousLevel && comparisonData && (
                <Text
                  style={{
                    marginLeft: "8px",
                    color: comparisonData.moves.improved
                      ? "#3f8600"
                      : "#cf1322",
                  }}
                >
                  ({comparisonData.moves.improved ? "↓" : "↑"}{" "}
                  {Math.abs(comparisonData.moves.difference)})
                </Text>
              )}
            </Text>
          </Col>
        </Row>
      </StyledCard>
    );
  };

  const renderSummary = () => (
    <>
      <StyledTitle
        level={2}
        style={{
          textAlign: "center",
          marginBottom: "32px",
          color: COLORS.primary,
        }}
      >
        🎉 สรุปผลการเล่นเกมจัดเรียงสี 🎉
      </StyledTitle>

      {renderComparison()}

      {gameStats.map((stat, index) => renderLevelComparison(stat.level, index))}

      <Space
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: "24px",
        }}
      >
        <ActionButton className="primary" onClick={resetGame}>
          เล่นใหม่
        </ActionButton>
        <ActionButton onClick={() => navigate("/")}>กลับหน้าหลัก</ActionButton>
      </Space>
    </>
  );

  const renderGame = () => (
    <>
      <StyledTitle level={2} style={{ textAlign: "center" }}>
        เกมจัดเรียงสี -{" "}
        {level === "easy"
          ? "ระดับง่าย"
          : level === "medium"
          ? "ระดับกลาง"
          : "ระดับยาก"}
      </StyledTitle>

      <StyledCard>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Space>
              <ClockCircleOutlined />
              <Text strong>เวลา: {formatTime(time)}</Text>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space>
              <SwapOutlined />
              <Text strong>จำนวนครั้งที่เคลื่อนย้าย: {moves}</Text>
            </Space>
          </Col>
          {gameState === "waiting" && (
            <Col xs={24} md={8} style={{ textAlign: "right" }}>
              <ActionButton className="primary" onClick={() => startGame()}>
                เริ่มเกม
              </ActionButton>
            </Col>
          )}
        </Row>
      </StyledCard>

      <GameContainer>
        <GameBoard>
          <Title level={4}>รูปแบบต้นฉบับ</Title>
          <BoxGrid level={level}>
            {targetPattern.map((color, index) => (
              <ColorBox key={index} color={color} isTarget={true} />
            ))}
          </BoxGrid>
        </GameBoard>

        <GameBoard>
          <Title level={4}>กล่องของคุณ</Title>
          <BoxGrid level={level}>
            {currentPattern.map((color, index) => (
              <ColorBox
                key={index}
                color={color}
                isSelected={selectedBox === index}
                onClick={() => handleBoxClick(index)}
              />
            ))}
          </BoxGrid>
        </GameBoard>
      </GameContainer>
    </>
  );

  return (
    <PageContainer>
      <ContentContainer>
        {gameState === "completed" ? renderSummary() : renderGame()}
      </ContentContainer>
    </PageContainer>
  );
}
