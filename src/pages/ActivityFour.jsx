import React, { useState, useEffect } from "react";
import {
  Card,
  Space,
  Typography,
  Button,
  Steps,
  Alert,
  Input,
  InputNumber,
  Tabs,
  Badge,
  message,
} from "antd";
import { InfoCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Enhanced color palette
const COLORS = {
  primary: "#7c3aed",
  secondary: "#a78bfa",
  background: "#7c3aed10",
  dark: "#1f2937",
  accent: "#81B29A",
  light: "#FFFFFF",
  wave: "#BBE1E2",
  shadow: "rgba(17, 12, 46, 0.1)",
  success: "#10b981",
  highlight: "#ffffff78",
};

// Minimalist emotion colors
const EMOTION_COLORS = {
  // Negative emotions - cooler, muted tones
  โกรธ: "#6fd2db",
  ว้าวุ่นใจ: "#6697e5",
  กลัว: "#9166c2",
  ประหลาดใจ: "#b068c2",
  เสียใจ: "#df69ce",
  อึดอัด: "#f4787c",
  // Positive emotions - warmer, softer tones
  สนใจ: "#ff997d",
  มั่นใจ: "#ffb266",
  รัก: "#fac966",
  สบดี: "#ffed6b",
  พึงใจ: "#badd66",
  สุข: "#badd66",
};

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    margin-bottom: 40px;
    color: ${COLORS.text};
    font-size: 32px;
    font-weight: 700;
    position: relative;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);

    &::after {
      content: "";
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: linear-gradient(
        90deg,
        ${COLORS.primary},
        ${COLORS.secondary}
      );
      border-radius: 2px;
    }
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  padding: 24px;
  overflow: hidden;
  background: ${COLORS.background};
`;

const ContentContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    width: 95%;
    padding: 0 12px;
  }
`;

const EmotionWheel = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 1;
  filter: drop-shadow(0 10px 20px ${COLORS.shadow});
  transition: transform 0.3s ease;
`;

const CenterDivider = styled.line`
  stroke: #000000;
  stroke-width: 1;
  opacity: 0.5;
`;

const EmotionSegment = styled.path`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  stroke: #000000;
  stroke-width: 1;

  &:hover {
    filter: brightness(1.1) contrast(1.1);
    transform-origin: center;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmotionLabel = styled.text`
  font-size: 16px;
  font-weight: 600;
  fill: #333;
  text-anchor: middle;
  pointer-events: none;
  transition: all 0.3s ease;
`;

const CenterLabel = styled.text`
  font-size: 18px;
  font-weight: 800;
  fill: #fff;
  text-anchor: middle;
  pointer-events: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const StyledCard = styled(Card)`
  background: ${COLORS.light};
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  margin-top: 24px;
  transition: all 0.3s ease;

  .ant-card-head {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
`;

const StyledInput = styled(Input)`
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${COLORS.primary};
  }

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px rgba(42, 157, 143, 0.1);
  }
`;

const StyledInputNumber = styled(InputNumber)`
  width: 100%;
  border-radius: 8px;

  &:hover {
    border-color: ${COLORS.primary};
  }

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px rgba(42, 157, 143, 0.1);
  }
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 8px;
  resize: none;

  &:hover {
    border-color: ${COLORS.primary};
  }

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px rgba(42, 157, 143, 0.1);
  }
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  height: 40px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(42, 157, 143, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

// แก้ไข EmotionTab
const EmotionTab = styled(Tabs.TabPane)`
  padding: 16px;
  background: ${(props) => props.color}10;
  border-radius: 12px;
  margin-bottom: 16px;
`;

// เพิ่ม ScrollableContainer ใหม่
const ScrollableContainer = styled.div`
  max-height: 400px; // ความสูงสูงสุดของ container
  overflow-y: auto;
  padding-right: 8px;

  // Custom scrollbar styling
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${COLORS.primary}50;
    border-radius: 10px;

    &:hover {
      background: ${COLORS.primary}80;
    }
  }
`;

const HistoryEntry = styled.div`
  padding: 16px;
  background: ${COLORS.light};
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${COLORS.shadow};
  }
`;

const EmotionBadge = styled(Badge)`
  .ant-badge-count {
    background: ${(props) => props.color};
    color: white;
    font-weight: 600;
    box-shadow: none;
    margin-left: -10px;
    position: relative;
    top: 1px;
  }
`;

const InstructionCard = styled.div`
  background: ${COLORS.highlight};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid ${COLORS.border};
  animation: ${slideIn} 0.4s ease-out;

  .instruction-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .anticon {
      font-size: 24px;
      color: ${COLORS.primary};
    }

    h4 {
      margin: 0;
      color: ${COLORS.text};
      font-size: 18px;
      font-weight: 600;
    }
  }

  .instruction-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .instruction-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${COLORS.textLight};
      font-size: 15px;

      .anticon {
        color: ${COLORS.success};
      }
    }
  }
`;

// Emotions array
const emotions = [
  // Negative emotions
  { name: "โกรธ", color: EMOTION_COLORS["โกรธ"], position: "negative" },
  {
    name: "ว้าวุ่นใจ",
    color: EMOTION_COLORS["ว้าวุ่นใจ"],
    position: "negative",
  },
  { name: "กลัว", color: EMOTION_COLORS["กลัว"], position: "negative" },
  {
    name: "ประหลาดใจ",
    color: EMOTION_COLORS["ประหลาดใจ"],
    position: "negative",
  },
  { name: "เสียใจ", color: EMOTION_COLORS["เสียใจ"], position: "negative" },
  { name: "อึดอัด", color: EMOTION_COLORS["อึดอัด"], position: "negative" },
  // Positive emotions
  { name: "สนใจ", color: EMOTION_COLORS["สนใจ"], position: "positive" },
  { name: "มั่นใจ", color: EMOTION_COLORS["มั่นใจ"], position: "positive" },
  { name: "รัก", color: EMOTION_COLORS["รัก"], position: "positive" },
  { name: "สบดี", color: EMOTION_COLORS["สบดี"], position: "positive" },
  { name: "พึงใจ", color: EMOTION_COLORS["พึงใจ"], position: "positive" },
  { name: "สุข", color: EMOTION_COLORS["สุข"], position: "positive" },
];

export default function ActivityFour() {
  const { user } = useAuth(); // เพิ่มบรรทัดนี้
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [thoughts, setThoughts] = useState("");
  const [history, setHistory] = useState([]);
  const [activeEmotions, setActiveEmotions] = useState(new Set());
  const [loading, setLoading] = useState(false); // เพิ่มสถานะ loading

  // Update active emotions when history changes
  useEffect(() => {
    const emotionsInHistory = new Set(history.map((entry) => entry.emotion));
    setActiveEmotions(emotionsInHistory);
  }, [history]);

  const createEmotionWheel = () => {
    const segments = [];
    const centerX = 300;
    const centerY = 300;
    const radius = 250;
    const innerRadius = 100;
    const segmentsPerSide = 6;
    const anglePerSegment = Math.PI / segmentsPerSide;

    emotions.forEach((emotion, index) => {
      let startAngle;
      if (emotion.position === "negative") {
        startAngle = Math.PI / 2 + (index % segmentsPerSide) * anglePerSegment;
      } else {
        startAngle =
          -Math.PI / 2 +
          ((index - segmentsPerSide) % segmentsPerSide) * anglePerSegment;
      }
      const endAngle = startAngle + anglePerSegment;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      const x1Inner = centerX + innerRadius * Math.cos(startAngle);
      const y1Inner = centerY + innerRadius * Math.sin(startAngle);
      const x2Inner = centerX + innerRadius * Math.cos(endAngle);
      const y2Inner = centerY + innerRadius * Math.sin(endAngle);

      const d = `
          M ${x1Inner} ${y1Inner}
          L ${x1} ${y1}
          A ${radius} ${radius} 0 0 1 ${x2} ${y2}
          L ${x2Inner} ${y2Inner}
          A ${innerRadius} ${innerRadius} 0 0 0 ${x1Inner} ${y1Inner}
          Z
        `;

      const labelAngle = startAngle + anglePerSegment / 2;
      const labelRadius = (radius + innerRadius) / 2;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);

      segments.push(
        <g key={emotion.name}>
          <EmotionSegment
            d={d}
            fill={emotion.color}
            onClick={() => setSelectedEmotion(emotion)}
            opacity={selectedEmotion?.name === emotion.name ? 1 : 0.9}
          />
          <EmotionLabel x={labelX} y={labelY}>
            {emotion.name}
          </EmotionLabel>
        </g>
      );
    });

    return segments;
  };

  // เพิ่ม useEffect สำหรับดึงประวัติเมื่อ component โหลด
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.nationalId) return; // เช็ค user ก่อน

      try {
        const response = await axios.get(
          `http://localhost:5000/api/emotion/history/${user.nationalId}`
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดประวัติ");
      }
    };

    fetchHistory();
  }, [user?.nationalId]);

  // แก้ไข handleSubmit
  const handleSubmit = async () => {
    if (!selectedEmotion || !user?.nationalId) return; // เช็คทั้ง emotion และ user

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/emotion/save-emotion",
        {
          nationalId: user.nationalId,
          emotion: selectedEmotion.name,
          intensity,
          thoughts,
          color: selectedEmotion.color,
        }
      );

      if (response.data.success) {
        message.success("บันทึกอารมณ์สำเร็จ");
        // Fetch updated history
        const historyResponse = await axios.get(
          `http://localhost:5000/api/emotion/history/${user.nationalId}`
        );
        setHistory(historyResponse.data);
        setThoughts("");
        setIntensity(5);
      }
    } catch (error) {
      console.error("Error saving emotion:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const getEmotionTabs = () => {
    const tabs = Array.from(activeEmotions).map((emotionName) => {
      const emotionEntries = history.filter(
        (entry) => entry.emotion === emotionName
      );
      const emotion = emotions.find((e) => e.name === emotionName);

      return (
        <EmotionTab
          tab={
            <EmotionBadge
              count={emotionEntries.length}
              color={emotion.color}
              style={{ backgroundColor: emotion.color }}
            >
              {emotionName}
            </EmotionBadge>
          }
          key={emotionName}
          color={emotion.color}
        >
          <ScrollableContainer>
            {emotionEntries.map((entry) => (
              <HistoryEntry key={entry.id}>
                <Space direction="vertical" size="small">
                  <Text type="secondary">{entry.timestamp}</Text>
                  <Text strong style={{ color: entry.color }}>
                    ระดับความเข้มข้น: {entry.intensity}/10
                  </Text>
                  <Text>{entry.thoughts}</Text>
                </Space>
              </HistoryEntry>
            ))}
          </ScrollableContainer>
        </EmotionTab>
      );
    });

    return tabs;
  };

  return (
    <PageContainer>
      <ContentContainer>
      <PageTitle level={2}>กิจกรรมที่ 4 : รู้ตัว รู้ใจ รู้อารมณ์</PageTitle>

        <InstructionCard>
          <div className="instruction-header">
            <InfoCircleOutlined />
            <h4>ระยะเวลาในการทำกิจกรรม 50 นาที</h4>
          </div>
          <div className="instruction-header">
            <h4>วิธีใช้วงล้ออารมณ์</h4>
          </div>
          <div className="instruction-list">
            <div className="instruction-item">
              <CheckCircleOutlined />
              <span>
                1. สังเกตอารมณ์ปัจจุบัน หยุดและสำรวจความรู้สึกของคุณ ณ ขณะนี้
              </span>
            </div>
            <div className="instruction-item">
              <CheckCircleOutlined />
              <span>
                2. ระบุอารมณ์บนวงล้อ เลือกคำที่ตรงกับความรู้สึกของคุณมากที่สุด
              </span>
            </div>
            <div className="instruction-item">
              <CheckCircleOutlined />
              <span>
                3. ประเมินความเข้มข้น ระบุระดับความเข้มข้นของอารมณ์ (1-10)
              </span>
            </div>
            <div className="instruction-item">
              <CheckCircleOutlined />
              <span>
                4. บันทึกความคิด สะท้อนและบันทึกสิ่งที่อาจเป็นสาเหตุของอารมณ์
              </span>
            </div>
            <div className="instruction-item">
              <CheckCircleOutlined />
              <span>
                5. ทบทวนสม่ำเสมอ ทำกิจกรรมนี้เป็นประจำเพื่อเข้าใจรูปแบบอารมณ์ของตนเอง
              </span>
            </div>
          </div>
        </InstructionCard>

        <EmotionWheel>
          <svg viewBox="0 0 600 600">
            <defs>
              <linearGradient id="negativeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9166c2" />
                <stop offset="80%" stopColor="#79c5d7" />
              </linearGradient>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffed6b" />
                <stop offset="80%" stopColor="#88c765" />
              </linearGradient>
            </defs>

            <path
              d="M 300 200 A 100 100 0 0 0 300 400 L 300 300 Z"
              fill="url(#negativeGradient)"
            />
            <path
              d="M 300 200 A 100 100 0 0 1 300 400 L 300 300 Z"
              fill="url(#positiveGradient)"
            />
            <CenterDivider x1="300" y1="200" x2="300" y2="400" />
            {createEmotionWheel()}
            <CenterLabel x="255" y="290">
              อารมณ์
            </CenterLabel>
            <CenterLabel x="255" y="310">
              เชิงลบ
            </CenterLabel>
            <CenterLabel x="345" y="290">
              อารมณ์
            </CenterLabel>
            <CenterLabel x="345" y="310">
              เชิงบวก
            </CenterLabel>
          </svg>
        </EmotionWheel>

        <StyledCard>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Text strong>อารมณ์ที่เลือก:</Text>
              <StyledInput
                value={selectedEmotion?.name || ""}
                disabled={true}
                style={{ marginTop: 8 }}
              />
            </div>

            <div>
              <Text strong>ระดับความเข้มข้น (1-10):</Text>
              <StyledInputNumber
                min={1}
                max={10}
                value={intensity}
                onChange={setIntensity}
                disabled={!selectedEmotion}
                style={{ width: "100%", marginTop: 8 }}
              />
            </div>

            <div>
              <Text strong>บันทึกความคิด:</Text>
              <StyledTextArea
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                placeholder="บันทึกความคิดของคุณที่เกี่ยวกับอารมณ์นี้..."
                disabled={!selectedEmotion}
                autoSize={{ minRows: 3, maxRows: 6 }}
                style={{ marginTop: 8 }}
              />
            </div>

            <StyledButton
              type="primary"
              onClick={handleSubmit}
              disabled={!selectedEmotion || !thoughts.trim()}
              style={{
                background: COLORS.primary,
                borderColor: COLORS.primary,
              }}
            >
              บันทึกอารมณ์
            </StyledButton>
          </Space>
        </StyledCard>

        <StyledCard title="ประวัติการบันทึกอารมณ์">
          {activeEmotions.size > 0 ? (
            <Tabs>{getEmotionTabs()}</Tabs>
          ) : (
            <Text
              type="secondary"
              style={{ textAlign: "center", display: "block", padding: "24px" }}
            >
              ยังไม่มีประวัติการบันทึกอารมณ์
            </Text>
          )}
        </StyledCard>
      </ContentContainer>
    </PageContainer>
  );
}
