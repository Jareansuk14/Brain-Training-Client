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
  "#4ECDC4", // ฟ้า
  "#8fce00", // น้ำเงิน
  "#ffd966", // เขียว
  "#e448a3", // เหลือง
  "#D4A5A5", // ชมพู
  "#9370DB", // ม่วง
  "#ff982d", // เขียวน้ำทะเล
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
  padding: 40px 24px;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const GameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  margin-top: 32px;
`;

const GameBoard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BoxGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.level === "easy"
      ? "repeat(2, 1fr)"
      : props.level === "medium"
      ? "repeat(3, 1fr)"
      : "repeat(5, 1fr)"};
  gap: 8px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px ${COLORS.shadow};
`;

const ColorBox = styled.div`
  aspect-ratio: 1;
  background-color: ${(props) => props.color};
  border-radius: 8px;
  cursor: ${(props) => (props.isTarget ? "default" : "pointer")};
  transition: all 0.2s ease;
  border: 3px solid transparent;

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
`;

const StyledCard = styled(Card)`
  background: white;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  margin-bottom: 16px;

  .ant-card-body {
    padding: 24px;
  }
`;

const ActionButton = styled(Button)`
  min-width: 120px;
  height: 44px;
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

  // Celebrate animation function
  const celebrateAnimation = () => {
    // Center confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Left confetti
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });

    // Right confetti
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  };

  const handleLevelComplete = async () => {
    clearInterval(timer);

    const currentScore = {
      level,
      time,
      moves,
    };

    setGameStats((prev) => [...prev, currentScore]);
    celebrateAnimation();

    if (level === "easy") {
      message.success("ยอดเยี่ยม! ผ่านระดับง่ายแล้ว", 1.5).then(() => {
        setLevel("medium");
        startGame("medium");
      });
    } else if (level === "medium") {
      message.success("เก่งมาก! ผ่านระดับกลางแล้ว", 1.5).then(() => {
        setLevel("hard");
        startGame("hard");
      });
    } else {
      clearInterval(timer);
      setGameState("completed");

      try {
        const totalTime = gameStats.reduce(
          (total, stat) => total + stat.time,
          0
        );
        const totalMoves = gameStats.reduce(
          (total, stat) => total + stat.moves,
          0
        );

        const sessionData = {
          totalTime,
          totalMoves,
          games: gameStats,
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

  const renderSummary = () => (
    <>
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: "32px",
          color: COLORS.primary,
        }}
      >
        🎉 สรุปผลการเล่นเกมจัดเรียงสี 🎉
      </Title>

      {/* Previous Result */}
      {previousResults && (
        <StyledCard>
          <Title level={4}>ผลการเล่นครั้งก่อน</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic
                title="เวลารวมทั้งหมด"
                value={formatTime(previousResults.totalTime)}
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="จำนวนการเคลื่อนย้ายรวม"
                value={previousResults.totalMoves}
                prefix={<SwapOutlined />}
                suffix="ครั้ง"
              />
            </Col>
          </Row>

          {/* แสดงรายละเอียดแต่ละระดับของครั้งก่อน */}
          {previousResults.games.map((game, index) => (
            <div key={index} style={{ marginTop: "16px" }}>
              <Title level={5} style={{ color: LEVEL_COLORS[game.level] }}>
                {game.level === "easy"
                  ? "ระดับง่าย"
                  : game.level === "medium"
                  ? "ระดับกลาง"
                  : "ระดับยาก"}
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="เวลาที่ใช้"
                    value={formatTime(game.time)}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="จำนวนการเคลื่อนย้าย"
                    value={game.moves}
                    prefix={<SwapOutlined />}
                    suffix="ครั้ง"
                  />
                </Col>
              </Row>
            </div>
          ))}
        </StyledCard>
      )}

      {/* Current Result */}
      <StyledCard>
        <Title level={4}>ผลการเล่นครั้งนี้</Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title="เวลารวมทั้งหมด"
              value={formatTime(
                gameStats.reduce((total, stat) => total + stat.time, 0)
              )}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="จำนวนการเคลื่อนย้ายรวม"
              value={gameStats.reduce((total, stat) => total + stat.moves, 0)}
              prefix={<SwapOutlined />}
              suffix="ครั้ง"
            />
          </Col>
        </Row>

        {/* แสดงรายละเอียดแต่ละระดับของครั้งนี้ */}
        {gameStats.map((stat, index) => (
          <div key={index} style={{ marginTop: "16px" }}>
            <Title level={5} style={{ color: LEVEL_COLORS[stat.level] }}>
              {stat.level === "easy"
                ? "ระดับง่าย"
                : stat.level === "medium"
                ? "ระดับกลาง"
                : "ระดับยาก"}
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="เวลาที่ใช้"
                  value={formatTime(stat.time)}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="จำนวนการเคลื่อนย้าย"
                  value={stat.moves}
                  prefix={<SwapOutlined />}
                  suffix="ครั้ง"
                />
              </Col>
            </Row>
          </div>
        ))}
      </StyledCard>

      {/* Comparison */}
      {comparison && (
        <StyledCard>
          <Title level={4}>การเปรียบเทียบ</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic
                title="เวลารวม"
                value={formatTime(Math.abs(comparison.totalTime.difference))}
                valueStyle={{
                  color: comparison.totalTime.improved ? "#3f8600" : "#cf1322",
                }}
                prefix={
                  comparison.totalTime.improved ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                suffix={comparison.totalTime.improved ? "เร็วขึ้น" : "ช้าลง"}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="จำนวนการเคลื่อนย้าย"
                value={Math.abs(comparison.totalMoves.difference)}
                valueStyle={{
                  color: comparison.totalMoves.improved ? "#3f8600" : "#cf1322",
                }}
                prefix={
                  comparison.totalMoves.improved ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                suffix={`ครั้ง ${
                  comparison.totalMoves.improved ? "น้อยลง" : "มากขึ้น"
                }`}
              />
            </Col>
          </Row>

          {comparison.games.map((game, index) => (
            <div key={index} style={{ marginTop: "16px" }}>
              <Title level={5} style={{ color: LEVEL_COLORS[game.level] }}>
                {game.level === "easy"
                  ? "ระดับง่าย"
                  : game.level === "medium"
                  ? "ระดับกลาง"
                  : "ระดับยาก"}
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="เปรียบเทียบเวลา"
                    value={formatTime(Math.abs(game.time.difference))}
                    valueStyle={{
                      color: game.time.improved ? "#3f8600" : "#cf1322",
                    }}
                    prefix={
                      game.time.improved ? (
                        <ArrowDownOutlined />
                      ) : (
                        <ArrowUpOutlined />
                      )
                    }
                    suffix={game.time.improved ? "เร็วขึ้น" : "ช้าลง"}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="เปรียบเทียบการเคลื่อนย้าย"
                    value={Math.abs(game.moves.difference)}
                    valueStyle={{
                      color: game.moves.improved ? "#3f8600" : "#cf1322",
                    }}
                    prefix={
                      game.moves.improved ? (
                        <ArrowDownOutlined />
                      ) : (
                        <ArrowUpOutlined />
                      )
                    }
                    suffix={`ครั้ง ${
                      game.moves.improved ? "น้อยลง" : "มากขึ้น"
                    }`}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </StyledCard>
      )}

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
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        เกมจัดเรียงสี -{" "}
        {level === "easy"
          ? "ระดับง่าย"
          : level === "medium"
          ? "ระดับกลาง"
          : "ระดับยาก"}
      </Title>

      <StyledCard>
        <Space size="large">
          <Space>
            <ClockCircleOutlined />
            <Text strong>เวลา: {formatTime(time)}</Text>
          </Space>
          <Space>
            <SwapOutlined />
            <Text strong>จำนวนครั้งที่เคลื่อนย้าย: {moves}</Text>
          </Space>
          {gameState === "waiting" && (
            <ActionButton className="primary" onClick={() => startGame()}>
              เริ่มเกม
            </ActionButton>
          )}
        </Space>
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
