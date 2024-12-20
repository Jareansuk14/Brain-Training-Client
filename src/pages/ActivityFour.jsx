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
  max-width: 720px;    // เพิ่มจาก 600px เป็น 720px
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
  font-size: 10px;
  font-weight: 400;
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
const emotions = {
  negative: {
    outer: [
      { name: "รำคาญ", color: "#6fd2db30" },      // เปลี่ยนจาก 80 เป็น 50
      { name: "หงุดหงิด", color: "#6697e530" },
      { name: "กังวลใจ", color: "#9166c230" },
      { name: "ไม่สบายใจ", color: "#b068c230" },
      { name: "เบื่อ", color: "#df69ce30" },
      { name: "เซ็ง", color: "#f4787c30" },
    ],
    middle: [                                      // คงเดิม 90%
      { name: "โมโห", color: "#6fd2db97" },
      { name: "ตึงเครียด", color: "#6697e597" },
      { name: "กลัว", color: "#9166c297" },
      { name: "วิตกกังวล", color: "#b068c297" },
      { name: "เศร้า", color: "#df69ce97" },
      { name: "อึดอัด", color: "#f4787c97" },
    ],
    inner: [                                      // คงเดิม 100%
      { name: "โกรธจัด", color: "#6fd2db" },
      { name: "แค้น", color: "#6697e5" },
      { name: "หวาดกลัว", color: "#9166c2" },
      { name: "ตื่นตระหนก", color: "#b068c2" },
      { name: "ซึมเศร้า", color: "#df69ce" },
      { name: "ทรมาน", color: "#f4787c" },
    ],
  },
  positive: {
    outer: [
      { name: "พอใจ", color: "#ff997d30" },      // เปลี่ยนจาก 80 เป็น 50
      { name: "สบายใจ", color: "#ffb26630" },
      { name: "ชอบ", color: "#fac96630" },
      { name: "สดชื่น", color: "#ffed6b30" },
      { name: "ผ่อนคลาย", color: "#badd6630" },
      { name: "รื่นรมย์", color: "#9cdd6630" },
    ],
    middle: [                                     // คงเดิม 90%
      { name: "ดีใจ", color: "#ff997d97" },
      { name: "มั่นใจ", color: "#ffb26697" },
      { name: "รัก", color: "#fac96697" },
      { name: "ตื่นเต้น", color: "#ffed6b97" },
      { name: "สุข", color: "#badd6697" },
      { name: "ปลื้ม", color: "#9cdd6697" },
    ],
    inner: [                                      // คงเดิม 100%
      { name: "เปรมปรีดิ์", color: "#ff997d" },
      { name: "ภาคภูมิใจ", color: "#ffb266" },
      { name: "หลงรัก", color: "#fac966" },
      { name: "ปิติ", color: "#ffed6b" },
      { name: "เบิกบาน", color: "#badd66" },
      { name: "ปลาบปลื้ม", color: "#9cdd66" },
    ],
  },
};

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
    // เพิ่มขนาดทุก radius 20%
    const outerRadius = 290;      // เดิม 250 * 1.2
    const middleRadius = 230;     // เดิม 200 * 1.2
    const innerRadius = 170;      // เดิม 150 * 1.2
    const centerRadius = 100;     // เดิม 100 * 1.2
    const segmentsPerSide = 6;
    const anglePerSegment = Math.PI / segmentsPerSide;
  
    const createLayer = (emotions, startRadius, endRadius, position) => {
      emotions.forEach((emotion, index) => {
        let startAngle;
        if (position === "negative") {
          startAngle = Math.PI / 2 + index * anglePerSegment;
        } else {
          startAngle = -Math.PI / 2 + index * anglePerSegment;
        }
        const endAngle = startAngle + anglePerSegment;
  
        const x1 = centerX + startRadius * Math.cos(startAngle);
        const y1 = centerY + startRadius * Math.sin(startAngle);
        const x2 = centerX + startRadius * Math.cos(endAngle);
        const y2 = centerY + startRadius * Math.sin(endAngle);
        const x1Inner = centerX + endRadius * Math.cos(startAngle);
        const y1Inner = centerY + endRadius * Math.sin(startAngle);
        const x2Inner = centerX + endRadius * Math.cos(endAngle);
        const y2Inner = centerY + endRadius * Math.sin(endAngle);
  
        const d = `
          M ${x1Inner} ${y1Inner}
          L ${x1} ${y1}
          A ${startRadius} ${startRadius} 0 0 1 ${x2} ${y2}
          L ${x2Inner} ${y2Inner}
          A ${endRadius} ${endRadius} 0 0 0 ${x1Inner} ${y1Inner}
          Z
        `;
  
        const labelAngle = startAngle + anglePerSegment / 2;
        const labelRadius = (startRadius + endRadius) / 2;
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
    };
  
    // Create all layers
    createLayer(emotions.negative.outer, outerRadius, middleRadius, "negative");
    createLayer(emotions.negative.middle, middleRadius, innerRadius, "negative");
    createLayer(emotions.negative.inner, innerRadius, centerRadius, "negative");
    createLayer(emotions.positive.outer, outerRadius, middleRadius, "positive");
    createLayer(emotions.positive.middle, middleRadius, innerRadius, "positive");
    createLayer(emotions.positive.inner, innerRadius, centerRadius, "positive");
  
    return segments;
  };

  // เพิ่ม useEffect สำหรับดึงประวัติเมื่อ component โหลด
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.nationalId) return; // เช็ค user ก่อน

      try {
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/emotion/history/${user.nationalId}`
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดประวัติ");
      }
    };

    fetchHistory();
  }, [user?.nationalId]);

  const handleSubmit = async () => {
    if (!selectedEmotion || !user?.nationalId) return;
  
    setLoading(true);
    try {
      const response = await axios.post(
        "https://brain-training-server.onrender.com/api/emotion/save-emotion",
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
          `https://brain-training-server.onrender.com/api/emotion/history/${user.nationalId}`
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
  
      // หา emotion จากโครงสร้างใหม่
      let emotion = null;
      ['outer', 'middle', 'inner'].some(layer => {
        const found = emotions.negative[layer].find(e => e.name === emotionName) 
                     || emotions.positive[layer].find(e => e.name === emotionName);
        if (found) {
          emotion = found;
          return true;
        }
        return false;
      });
  
      // ถ้าไม่พบ emotion ให้ข้ามไป
      if (!emotion) return null;
  
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
    }).filter(Boolean); // กรองค่า null ออก
  
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
