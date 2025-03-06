import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  Space,
  Typography,
  Button,
  Steps,
  Alert,
  Input,
  Modal,
  message,
  Empty,
} from "antd";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  CheckOutlined,
  SoundOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Design system colors
const COLORS = {
  primary: "#7c3aed",
  secondary: "#a78bfa",
  background: "#fafafa",
  surface: "#ffffff",
  text: "#1f2937",
  textLight: "#6b7280",
  border: "#e5e7eb",
  success: "#10b981",
  warning: "#ef4444",
  highlight: "#f3f4f6",
  gradientStart: "rgba(124, 58, 237, 0.05)",
  gradientEnd: "rgba(167, 139, 250, 0.05)",
};

// Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
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
  background: linear-gradient(
    135deg,
    ${COLORS.gradientStart} 0%,
    ${COLORS.gradientEnd} 100%
  );
  padding: 40px 24px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: ${COLORS.surface};
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 48px;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 16px;
  }
`;

const StyledCard = styled(Card)`
  background: ${COLORS.surface};
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.4s ease-out;

  .ant-card-head {
    border-bottom: 1px solid ${COLORS.border};
    padding: 20px 24px;
  }

  .ant-card-body {
    padding: 24px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
`;

const DurationCard = styled.div`
  background: ${(props) =>
    props.selected ? `${COLORS.primary}10` : COLORS.surface};
  border: 2px solid
    ${(props) => (props.selected ? COLORS.primary : COLORS.border)};
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    border-color: ${COLORS.primary};
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.1);
  }

  .duration-number {
    font-size: 36px;
    font-weight: 700;
    color: ${(props) => (props.selected ? COLORS.primary : COLORS.text)};
    line-height: 1;
    margin-bottom: 4px;
  }

  .duration-text {
    font-size: 16px;
    color: ${(props) => (props.selected ? COLORS.primary : COLORS.textLight)};
  }
`;

const VideoSection = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: black;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.01);
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ControlSection = styled.div`
  background: ${COLORS.surface};
  border-radius: 20px;
  padding: 32px;
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  gap: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  align-items: center;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;

    & > *:first-child {
      grid-column: 1 / -1;
      justify-self: center;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    grid-template-columns: 1fr;
    gap: 16px;

    & > * {
      grid-column: 1 / -1;
    }
  }
`;

const Timer = styled.div`
  font-size: 48px;
  font-weight: 300;
  color: ${COLORS.primary};
  background: ${COLORS.gradientStart};
  padding: 24px 40px;
  border-radius: 16px;
  letter-spacing: 2px;
  text-align: center;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    font-size: 36px;
    padding: 16px 24px;
  }
`;

const TimerAndButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionButton = styled(Button)`
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &.primary {
    background: ${COLORS.primary};
    border: none;
    color: white;

    &:hover {
      background: ${COLORS.secondary};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: ${COLORS.textLight};
      opacity: 0.6;
    }
  }

  .anticon {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const NotesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ThoughtInput = styled(TextArea)`
  border-radius: 12px;
  border: 1px solid ${COLORS.border};
  padding: 16px;
  font-size: 16px;
  resize: none;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${COLORS.secondary};
  }

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}20;
  }
`;

const StyledSteps = styled(Steps)`
  margin-bottom: 40px;

  // สำหรับ step ปัจจุบัน
  .ant-steps-item-process {
    .ant-steps-item-icon {
      background: ${COLORS.primary}; // สีม่วงเข้ม #7c3aed
      border-color: ${COLORS.primary};
    }

    .ant-steps-item-title {
      color: ${COLORS.primary} !important;
      
      &::after {
        background-color: ${COLORS.primary} !important;
      }
    }
  }

  // สำหรับ step ที่เสร็จแล้ว
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

  // สำหรับเส้นเชื่อมระหว่าง steps
  .ant-steps-item-tail::after {
    background-color: ${COLORS.secondary} !important; // สีม่วงอ่อน #a78bfa
  }

  // สำหรับ step ที่ยังไม่ถึง
  .ant-steps-item-wait {
    .ant-steps-item-icon {
      background: white;
      border-color: ${COLORS.secondary};
      
      .ant-steps-icon {
        color: ${COLORS.secondary};
      }
    }
  }

  .ant-steps-item-title {
    font-size: 16px;
    font-weight: 500;
  }
`;

const PageTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    margin-bottom: 40px;
    color: ${COLORS.text};
    font-size: 32px;
    font-weight: 700;
    position: relative;

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

const StyledAlert = styled(Alert)`
  background: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
  border: none;

  .ant-alert-message {
    font-weight: 800;
    color: #7c3aed;
  }
`;

const InstructionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;

  .instruction-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${COLORS.text};
    font-size: 15px;

    .anticon {
      color: ${COLORS.primary};
    }
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

// คลิปวิดีโอสำหรับแต่ละระยะเวลา
const videos = {
  5: "oQEllKFFiJM",
  10: "9-A7zWwTWfQ",
  15: "yLeYqVtR_xo",
  30: "7T9Hb1-skNA",
};

export default function ActivityThree() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thoughts, setThoughts] = useState("");
  const [remainingTime, setRemainingTime] = useState(5 * 60);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const { user } = useAuth();
  const [meditationHistory, setMeditationHistory] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `https://brain-training-server.onrender.com/api/meditation/history/${user.nationalId}`
        );
        setMeditationHistory(response.data);
      } catch (error) {
        console.error("Error fetching meditation history:", error);
      }
    };

    if (user?.nationalId) {
      fetchHistory();
    }
  }, [user?.nationalId]);

  useEffect(() => {
    setIsVideoReady(false);
    setIsVideoCompleted(false);

    const handleMessage = (event) => {
      if (event.data.type === "video-ready") {
        setIsVideoReady(true);
      } else if (event.data.type === "video-ended") {
        handleVideoEnd();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedDuration]);

  // Functions for meditation control
  const startMeditation = () => {
    if (videoRef.current) {
      setIsPlaying(true);
      videoRef.current.contentWindow.postMessage({ command: "play" }, "*");
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            handleVideoEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseMeditation = () => {
    if (videoRef.current) {
      setIsPlaying(false);
      videoRef.current.contentWindow.postMessage({ command: "pause" }, "*");
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resetMeditation = () => {
    if (videoRef.current) {
      setIsPlaying(false);
      setIsVideoCompleted(false);
      videoRef.current.contentWindow.postMessage({ command: "reset" }, "*");
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRemainingTime(selectedDuration * 60);
      setThoughts("");
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (videoRef.current) {
      videoRef.current.contentWindow.postMessage({ command: "pause" }, "*");
    }
    setRemainingTime(0);
    setIsVideoCompleted(true);
    setIsModalVisible(true);
  };

  const handleMeditationComplete = async () => {
    if (!thoughts.trim()) {
      message.error("กรุณาบันทึกความคิดและความรู้สึกก่อนดำเนินการต่อ");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://brain-training-server.onrender.com/api/meditation/save-session",
        {
          nationalId: user.nationalId,
          duration: selectedDuration,
          notes: thoughts,
        }
      );

      if (response.data.success) {
        message.success("บันทึกการทำสมาธิเรียบร้อยแล้ว");
        setCanProceed(true);
        setMeditationHistory([...meditationHistory, response.data.session]);
      }
    } catch (error) {
      console.error("Error saving meditation session:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setRemainingTime(duration * 60);
    setIsPlaying(false);
    setIsVideoCompleted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsVideoReady(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Custom Player HTML Template
  const getCustomPlayerHtml = (videoId) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { margin: 0; overflow: hidden; background: black; }
            #player { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        </style>
    </head>
    <body>
        <div id="player"></div>
        <script>
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            var player;
            function onYouTubeIframeAPIReady() {
                player = new YT.Player('player', {
                    videoId: '${videoId}',
                    playerVars: {
                        controls: 0,
                        disablekb: 1,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        playsinline: 1,
                        vq: 'hd1080',
                        hd: 1,
                        iv_load_policy: 3
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange,
                        'onPlaybackQualityChange': onPlaybackQualityChange
                    }
                });
            }

            function onPlayerReady(event) {
                player.setPlaybackQuality('hd1080');
                window.parent.postMessage({ type: 'video-ready' }, '*');
            }

            function onPlaybackQualityChange(event) {
                if (event.data !== 'hd1080') {
                    player.setPlaybackQuality('hd1080');
                }
            }

            function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.ENDED) {
                    window.parent.postMessage({ type: 'video-ended' }, '*');
                }
            }

            window.addEventListener('message', function(event) {
                if (!player) return;

                switch(event.data.command) {
                    case 'play':
                        player.setPlaybackQuality('hd1080');
                        player.playVideo();
                        break;
                    case 'pause':
                        player.pauseVideo();
                        break;
                    case 'reset':
                        player.seekTo(0);
                        player.pauseVideo();
                        break;
                }
            });
        </script>
    </body>
    </html>
  `;

  return (
    <PageContainer>
      <ContentContainer>
        <PageTitle level={2}>Session 3 : สมาธิดิจิทัล</PageTitle>

        <StyledSteps
          current={currentStep}
          items={[
            { title: "ขั้นนำ" },
            { title: "ขั้นดำเนินการ" },
            { title: "ขั้นสรุป" },
          ]}
        />

        {currentStep === 0 && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <InstructionCard>
              <div className="instruction-header">
                <InfoCircleOutlined />
                <h4>ระยะเวลาในการทำกิจกรรม 50 นาที</h4>
              </div>
              <div className="instruction-list">
                <div className="instruction-item">
                  <CheckCircleOutlined />
                  <span>
                    กิจกรรม "สมาธิดิจิทัล" เป็นการฝึกสมาธิผ่านเทคโนโลยีดิจิทัล
                    โดยใช้เสียงและภาพเคลื่อนไหวเพื่อช่วยให้จิตใจสงบ
                    และผ่อนคลายมากขึ้น
                  </span>
                </div>
              </div>
            </InstructionCard>

            <Title level={4} style={{ textAlign: "center", margin: "32px 0" }}>
              เลือกระยะเวลาในการทำสมาธิ
            </Title>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "16px",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              {[5, 10, 15, 30].map((duration) => (
                <DurationCard
                  key={duration}
                  selected={selectedDuration === duration}
                  onClick={() => handleDurationSelect(duration)}
                >
                  <div className="duration-number">{duration}</div>
                  <div className="duration-text">นาที</div>
                </DurationCard>
              ))}
            </div>

            <StyledCard title="คำแนะนำการใช้งาน">
              <InstructionList>
                <div className="instruction-item">
                  <SoundOutlined /> สวมหูฟังเพื่อประสบการณ์ที่ดีที่สุด
                </div>
                <div className="instruction-item">
                  👁️ จดจ่อกับภาพและเสียงที่ได้ยิน
                </div>
                <div className="instruction-item">
                  ✍️ บันทึกความคิดและความรู้สึกที่เกิดขึ้น
                </div>
                <div className="instruction-item">
                  🎯 ทำตามคำแนะนำในคลิปวิดีโอ
                </div>
              </InstructionList>
            </StyledCard>
          </Space>
        )}

        {currentStep === 1 && (
          <>
            <VideoSection>
              <iframe
                ref={videoRef}
                srcDoc={getCustomPlayerHtml(videos[selectedDuration])}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoSection>

            <ControlSection>
              <Timer>{formatTime(remainingTime)}</Timer>

              <TimerAndButtons>
                {!isPlaying ? (
                  <ActionButton
                    className="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={startMeditation}
                    disabled={!isVideoReady}
                  >
                    เริ่มทำสมาธิ
                  </ActionButton>
                ) : (
                  <ActionButton
                    className="primary"
                    icon={<PauseCircleOutlined />}
                    onClick={pauseMeditation}
                  >
                    หยุดชั่วคราว
                  </ActionButton>
                )}

                <ActionButton
                  icon={<ReloadOutlined />}
                  onClick={resetMeditation}
                  disabled={!isVideoReady}
                >
                  เริ่มใหม่
                </ActionButton>
              </TimerAndButtons>

              <NotesSection>
                <Text strong>บันทึกความคิดและความรู้สึก:</Text>
                <ThoughtInput
                  placeholder="พิมพ์ความคิดและความรู้สึกของคุณที่นี่..."
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                />
              </NotesSection>
            </ControlSection>
          </>
        )}

        {currentStep === 2 && (
          <StyledCard>
            <Title
              level={3}
              style={{ textAlign: "center", marginBottom: "32px" }}
            >
              ประวัติการทำสมาธิ
            </Title>

            {meditationHistory.length > 0 ? (
              meditationHistory.map((session) => (
                <div
                  key={session.sessionNumber}
                  style={{
                    background: COLORS.background,
                    padding: "24px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <Text strong>
                    ครั้งที่ {session.sessionNumber} ระยะเวลา {session.duration}{" "}
                    นาที
                  </Text>
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "16px",
                      background: COLORS.surface,
                      borderRadius: "8px",
                    }}
                  >
                    {session.notes}
                  </div>
                  <Text type="secondary" style={{ marginTop: "8px" }}>
                    {new Date(session.completedAt).toLocaleString("th-TH")}
                  </Text>
                </div>
              ))
            ) : (
              <Empty description="ยังไม่มีประวัติการทำสมาธิ" />
            )}
          </StyledCard>
        )}

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Space size="middle">
            {currentStep > 0 && (
              <ActionButton onClick={() => setCurrentStep((prev) => prev - 1)}>
                ย้อนกลับ
              </ActionButton>
            )}

            {currentStep < 2 ? (
              <ActionButton
                className="primary"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={currentStep === 1 && !isVideoCompleted}
              >
                ถัดไป
              </ActionButton>
            ) : (
              <ActionButton
                className="primary"
                onClick={() => navigate("/activity-9")}
                icon={<CheckOutlined />}
              >
                จบกิจกรรม
              </ActionButton>
            )}
          </Space>
        </div>
      </ContentContainer>

      <Modal
        title="การทำสมาธิเสร็จสมบูรณ์"
        open={isModalVisible}
        onOk={handleMeditationComplete}
        onCancel={() => setIsModalVisible(false)}
        okText="บันทึก"
        cancelText="ยกเลิก"
        okButtonProps={{
          style: { background: COLORS.primary, borderColor: COLORS.primary },
        }}
      >
        <p>คุณได้ทำสมาธิครบตามเวลาที่กำหนดแล้ว</p>
        <p>กรุณาบันทึกความคิดและความรู้สึกของคุณในช่องบันทึกด้านล่าง</p>
      </Modal>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Space direction="vertical" align="center">
            <LoadingOutlined style={{ fontSize: 24, color: COLORS.primary }} />
            <Text>กำลังบันทึกข้อมูล...</Text>
          </Space>
        </div>
      )}
    </PageContainer>
  );
}
