import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Space, Typography, Button, message, Row, Col } from "antd";
import { ClockCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import confetti from "canvas-confetti";

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

const ANIMAL_TEST_DATA = [
  // ชุดที่ 1
  {
    setNumber: 1,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["ช้าง"],
          en: ["elephant"],
        },
        image: "../animals/elephant.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["ยีราฟ"],
          en: ["giraffe"],
        },
        image: "../animals/giraffe.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["ฮิปโปโปเตมัส", "ฮิปโป"],
          en: ["hippopotamus", "hippo"],
        },
        image: "../animals/hippopotamus.jpg",
      },
    ],
  },
  // ชุดที่ 2
  {
    setNumber: 2,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["เสือ"],
          en: ["tiger"],
        },
        image: "../animals/tiger.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["แพนด้า", "หมีแพนด้า"],
          en: ["panda", "giant panda"],
        },
        image: "../animals/panda.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["จระเข้", "อัลลิเกเตอร์"],
          en: ["alligator"],
        },
        image: "../animals/alligator.jpg",
      },
    ],
  },
  // ชุดที่ 3
  {
    setNumber: 3,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["หมี"],
          en: ["bear"],
        },
        image: "../animals/bear.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["กระรอก"],
          en: ["squirrel"],
        },
        image: "../animals/squirrel.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["นกเพนกวิน", "เพนกวิน"],
          en: ["penguin"],
        },
        image: "../animals/penguin.jpg",
      },
    ],
  },
  // ชุดที่ 4
  {
    setNumber: 4,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["กวาง"],
          en: ["deer"],
        },
        image: "../animals/deer.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["ม้าลาย"],
          en: ["zebra"],
        },
        image: "../animals/zebra.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["จิงโจ้"],
          en: ["kangaroo"],
        },
        image: "../animals/kangaroo.jpg",
      },
    ],
  },
  // ชุดที่ 5
  {
    setNumber: 5,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["หมู"],
          en: ["pig"],
        },
        image: "../animals/pig.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["หมาป่า"],
          en: ["wolf"],
        },
        image: "../animals/wolf.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["แรด"],
          en: ["rhinoceros", "rhino"],
        },
        image: "../animals/rhinoceros.jpg",
      },
    ],
  },
  // ชุดที่ 6
  {
    setNumber: 6,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["นก"],
          en: ["bird"],
        },
        image: "../animals/bird.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["นกยูง"],
          en: ["peacock"],
        },
        image: "../animals/peacock.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["ออรังอุตัง"],
          en: ["orangutan"],
        },
        image: "../animals/orangutan.jpg",
      },
    ],
  },
  // ชุดที่ 7
  {
    setNumber: 7,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["ลิง"],
          en: ["monkey"],
        },
        image: "../animals/monkey.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["กอริลลา"],
          en: ["gorilla"],
        },
        image: "../animals/gorilla.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["สิงโตทะเล"],
          en: ["sea lion"],
        },
        image: "../animals/sea-lion.jpg",
      },
    ],
  },
  // ชุดที่ 8
  {
    setNumber: 8,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["หมา", "สุนัข"],
          en: ["dog"],
        },
        image: "../animals/dog.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["เสือดาว"],
          en: ["leopard"],
        },
        image: "../animals/leopard.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["อิกัวน่า", "กิ้งก่ายักษ์", "อิเกวียน่า"],
          en: ["iguana"],
        },
        image: "../animals/iguana.jpg",
      },
    ],
  },
  // ชุดที่ 9
  {
    setNumber: 9,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["แกะ"],
          en: ["sheep"],
        },
        image: "../animals/sheep.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["แมวน้ำ"],
          en: ["seal"],
        },
        image: "../animals/seal.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["กวางเรนเดียร์", "เรนเดียร์"],
          en: ["reindeer"],
        },
        image: "../animals/reindeer.jpg",
      },
    ],
  },
  // ชุดที่ 10
  {
    setNumber: 10,
    questions: [
      {
        level: "easy",
        answers: {
          th: ["วัว"],
          en: ["cow"],
        },
        image: "/animals/cow.jpg",
      },
      {
        level: "medium",
        answers: {
          th: ["ไฮยีนา"],
          en: ["hyena"],
        },
        image: "/animals/hyena.jpg",
      },
      {
        level: "hard",
        answers: {
          th: ["อนาคอนดา", "งูยักษ์"],
          en: ["anaconda"],
        },
        image: "/animals/anaconda.jpg",
      },
    ],
  },
];

const StyledTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    font-size: 20px !important;
    margin-bottom: 20px !important;
    color: ${(props) => props.color || "inherit"};

    @media (min-width: 480px) {
      font-size: 22px !important;
      margin-bottom: 24px !important;
    }

    @media (min-width: 768px) {
      font-size: 24px !important;
      margin-bottom: 32px !important;
    }
  }
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

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AnswerInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${COLORS.secondary};
  border-radius: 8px;
  font-size: 16px;
  margin: 10px 0;

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
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

// เพิ่มฟังก์ชันสำหรับ Celebration Effect
const celebrateCorrectAnswer = () => {
  // ยิง confetti จากกลางจอ
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
  });

  // ยิง confetti จากมุมซ้าย
  confetti({
    particleCount: 25,
    angle: 60,
    spread: 45,
    origin: { x: 0 },
  });

  // ยิง confetti จากมุมขวา
  confetti({
    particleCount: 25,
    angle: 120,
    spread: 45,
    origin: { x: 1 },
  });
};

const celebrateTestComplete = () => {
  // Create a canvas-confetti sequence
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff0000", "#00ff00", "#0000ff"],
    });

    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff0000", "#00ff00", "#0000ff"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

// Styled Components
const AnswerReveal = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: ${(props) => (props.isCorrect ? "#f6ffed" : "#fff1f0")};
  border: 1px solid ${(props) => (props.isCorrect ? "#b7eb8f" : "#ffa39e")};
  border-radius: 8px;
  text-align: center;
`;

export default function AnimalNamingTest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [testState, setTestState] = useState("intro"); // intro, testing, completed
  const [currentSet, setCurrentSet] = useState(1);
  const [currentLevel, setCurrentLevel] = useState("easy");
  const [userAnswer, setUserAnswer] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [previousResults, setPreviousResults] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState({
    isCorrect: false,
    correctAnswers: [],
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);

  // เพิ่ม useEffect สำหรับจัดการตัวจับเวลา
  useEffect(() => {
    if (testState === "testing") {
      const intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      setTimer(intervalId);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [testState]);

  // โหลดผลการทดสอบครั้งก่อน
  useEffect(() => {
    const fetchPreviousResults = async () => {
      if (!user?.nationalId) return;

      try {
        const response = await axios.get(
          `https://brain-training-server-production.up.railway.app/api/animal-test/${user.nationalId}`
        );

        if (response.data.sessions?.length > 0) {
          setPreviousResults(
            response.data.sessions[response.data.sessions.length - 1]
          );
        }
      } catch (error) {
        console.error("Error fetching previous results:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    };

    fetchPreviousResults();
  }, [user?.nationalId]);

  // ดึงคำถามปัจจุบัน
  const getCurrentQuestion = () => {
    const set = ANIMAL_TEST_DATA.find((s) => s.setNumber === currentSet);
    return set.questions.find((q) => q.level === currentLevel);
  };

  // ตรวจสอบคำตอบ
  const checkAnswer = (answer) => {
    const question = getCurrentQuestion();

    // แปลงคำตอบเป็นตัวพิมพ์เล็กและตัดช่องว่าง
    const normalizedAnswer = answer.toLowerCase().trim();

    // ตรวจสอบว่าเป็นภาษาไทยหรือไม่
    const isThai = /[\u0E00-\u0E7F]/.test(normalizedAnswer);

    // เช็คกับคำตอบที่ถูกต้องตามภาษา
    const correctAnswers = isThai
      ? question.answers.th.map((a) => a.toLowerCase())
      : question.answers.en.map((a) => a.toLowerCase());

    return correctAnswers.includes(normalizedAnswer);
  };

  // จัดการการส่งคำตอบ
  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      message.warning("กรุณากรอกคำตอบ");
      return;
    }

    const question = getCurrentQuestion();
    const isCorrect = checkAnswer(userAnswer);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // เก็บข้อมูลคำตอบ
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentSet,
        level: currentLevel,
        userAnswer,
        isCorrect,
        timeSpent,
      },
    ]);

    // แสดงผลการตอบ
    setCurrentAnswer({
      isCorrect,
      correctAnswers: isCorrect
        ? []
        : userAnswer.match(/[\u0E00-\u0E7F]/)
        ? question.answers.th
        : question.answers.en,
    });
    setShowAnswer(true);

    // แสดง celebration effect ถ้าตอบถูก
    if (isCorrect) {
      celebrateCorrectAnswer();
    }
  };

  // ไปข้อถัดไป
  const moveToNext = () => {
    setShowAnswer(false);
    setUserAnswer("");

    if (currentLevel === "easy") {
      setCurrentLevel("medium");
    } else if (currentLevel === "medium") {
      setCurrentLevel("hard");
    } else {
      if (currentSet < 10) {
        setCurrentSet((prev) => prev + 1);
        setCurrentLevel("easy");
      } else {
        handleTestComplete();
        return;
      }
    }
    setStartTime(Date.now());
  };

  // จบแบบทดสอบ
  const handleTestComplete = async () => {
    if (timer) {
      clearInterval(timer);
    }

    const finalTime = elapsedTime;
    setTotalTime(finalTime);

    const correctAnswers = answers.filter((a) => a.isCorrect).length;

    try {
      const response = await axios.post(
        "https://brain-training-server-production.up.railway.app/api/animal-test/save-session",
        {
          nationalId: user.nationalId,
          sessionData: {
            totalTime: finalTime,
            correctAnswers,
            totalQuestions: 30,
            answers,
          },
        }
      );

      if (response.data.comparison) {
        setComparison(response.data.comparison);
        if (response.data.messages.overall) {
          message.success(response.data.messages.overall);
        }
      }

      setTestState("completed");
      celebrateTestComplete();
    } catch (error) {
      console.error("Error saving results:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกผล");
    }
  };

  // เริ่มแบบทดสอบใหม่
  const startTest = () => {
    setTestState("testing");
    setStartTime(Date.now());
    setCurrentSet(1);
    setCurrentLevel("easy");
    setAnswers([]);
    setElapsedTime(0); // รีเซ็ตเวลา
  };

  // แปลงเวลาเป็นรูปแบบ mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // แสดงหน้าแนะนำ
  const renderIntro = () => (
    <>
      <StyledCard>
        <Text>
          <StyledTitle
            level={3}
            style={{ color: COLORS.primary ,textAlign: "center", marginBottom: 32 }}
          >
            เกมปริศนา ไขชื่อสัตว์โลก
          </StyledTitle>
          แบบทดสอบนี้จะแสดงภาพให้คุณดู แล้วให้คุณพิมพ์ชื่อสัตว์ที่เห็น
          สามารถตอบได้ทั้งภาษาไทยและภาษาอังกฤษ
        </Text>
        <br />
        <br />
        <Text>
          • มีทั้งหมด 10 ชุด ชุดละ 3 ระดับ (ง่าย กลาง ยาก)
          <br />
          • ไม่จำกัดเวลาในการตอบ แต่จะมีการบันทึกเวลา
          <br />• ตอบให้ถูกต้องตามภาพที่เห็น
        </Text>

        <Space
          style={{ width: "100%", justifyContent: "center", marginTop: 24 }}
        >
          <ActionButton className="primary" onClick={startTest}>
            เริ่มทำแบบทดสอบ
          </ActionButton>
        </Space>
      </StyledCard>
    </>
  );

  // แสดงหน้าทำแบบทดสอบ
  const renderTest = () => {
    const question = getCurrentQuestion();
    const isLastQuestion = currentSet === 10 && currentLevel === "hard";

    return (
      <>
        <StyledTitle
          level={2}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          เกมปริศนา ไขชื่อสัตว์โลก
        </StyledTitle>

        <StyledCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Space size="large">
              <Space>
                <Text strong>ชุดที่ {currentSet}/10</Text>
              </Space>
              <Text strong>
                ระดับ-
                {currentLevel === "easy"
                  ? "ง่าย"
                  : currentLevel === "medium"
                  ? "กลาง"
                  : "ยาก"}
              </Text>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <Text strong style={{ minWidth: "80px" }}>
                เวลา: {formatTime(elapsedTime)}
              </Text>
            </Space>
          </div>

          <ImageContainer>
            <img src={question.image} alt="Animal" />
          </ImageContainer>

          <AnswerInput
            placeholder="พิมพ์ชื่อสัตว์ที่เห็นในภาพ..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && !showAnswer && handleSubmit()
            }
            disabled={showAnswer}
          />

          {showAnswer && (
            <AnswerReveal isCorrect={currentAnswer.isCorrect}>
              {currentAnswer.isCorrect ? (
                <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
                  🎉 ยอดเยี่ยม! คำตอบถูกต้อง
                </Text>
              ) : (
                <>
                  <Text strong style={{ color: "#ff4d4f", fontSize: "16px" }}>
                    เสียใจด้วย คำตอบไม่ถูกต้อง
                  </Text>
                  <br />
                  <Text style={{ fontSize: "14px", marginTop: "8px" }}>
                    คำตอบที่ถูกต้องคือ:{" "}
                    {currentAnswer.correctAnswers.join(" หรือ ")}
                  </Text>
                </>
              )}
            </AnswerReveal>
          )}

          <Space
            style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
          >
            {!showAnswer ? (
              <ActionButton className="primary" onClick={handleSubmit}>
                ส่งคำตอบ
              </ActionButton>
            ) : (
              <ActionButton className="primary" onClick={moveToNext}>
                {isLastQuestion ? "ดูผลการทดสอบ" : "ข้อถัดไป"}
              </ActionButton>
            )}
          </Space>
        </StyledCard>
      </>
    );
  };

  const renderSummary = () => (
    <>
      <StyledTitle
        level={2}
        style={{ textAlign: "center", marginBottom: 32, color: COLORS.primary }}
      >
        🎉 สรุปผลการทำแบบทดสอบ 🎉
      </StyledTitle>

      <StyledCard>
        <StyledTitle level={4}>เปรียบเทียบผลการทดสอบ</StyledTitle>
        <Row gutter={[16, 24]}>
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

          <Col span={8}>
            <Text strong>เวลาที่ใช้ทั้งหมด</Text>
          </Col>
          <Col span={8}>
            <Text>
              {previousResults ? formatTime(previousResults.totalTime) : "-"}
            </Text>
          </Col>
          <Col span={8}>
            <Text>
              {formatTime(totalTime)}
              {comparison?.totalTime && (
                <Text
                  style={{
                    marginLeft: "8px",
                    color: comparison.totalTime.improved
                      ? "#3f8600"
                      : "#cf1322",
                  }}
                >
                  ({comparison.totalTime.improved ? "↓" : "↑"}{" "}
                  {formatTime(Math.abs(comparison.totalTime.difference))})
                </Text>
              )}
            </Text>
          </Col>

          <Col span={8}>
            <Text strong>คะแนนรวม</Text>
          </Col>
          <Col span={8}>
            <Text>
              {previousResults
                ? `${previousResults.correctAnswers}/${previousResults.totalQuestions}`
                : "-"}
            </Text>
          </Col>
          <Col span={8}>
            <Text>
              {answers.filter((a) => a.isCorrect).length}/30
              {comparison?.correctAnswers && (
                <Text
                  style={{
                    marginLeft: "8px",
                    color: comparison.correctAnswers.improved
                      ? "#3f8600"
                      : "#cf1322",
                  }}
                >
                  ({comparison.correctAnswers.improved ? "↑" : "↓"}{" "}
                  {Math.abs(comparison.correctAnswers.difference)})
                </Text>
              )}
            </Text>
          </Col>
        </Row>
      </StyledCard>

      <Space style={{ width: "100%", justifyContent: "center", marginTop: 24 }}>
        <ActionButton className="primary" onClick={() => setTestState("intro")}>
          ทำแบบทดสอบอีกครั้ง
        </ActionButton>
        <ActionButton onClick={() => navigate("/activity-11")}>
          เกมถัดไป
        </ActionButton>
      </Space>
    </>
  );

  return (
    <PageContainer>
      <ContentContainer>
        {testState === "intro" && renderIntro()}
        {testState === "testing" && renderTest()}
        {testState === "completed" && renderSummary()}
      </ContentContainer>
    </PageContainer>
  );
}
