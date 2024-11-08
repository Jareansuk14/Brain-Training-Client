import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Space, Typography, Input, Button, Steps, Alert, List, Modal, message } from 'antd';
import {
    ClockCircleOutlined,
    CheckOutlined,
    CloudOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';



const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 
              0 2px 4px rgba(0, 0, 0, 0.03), 
              0 4px 8px rgba(0, 0, 0, 0.03);

  .ant-card-head {
    border-bottom: 2px solid #f0f0f0;
  }

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), 
                0 4px 8px rgba(0, 0, 0, 0.05), 
                0 8px 16px rgba(0, 0, 0, 0.05);
  }
`;

const PageContainer = styled.div`
  height: calc(100vh - 64px);
  overflow-y: auto;
  background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%);
  padding: 24px;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const InputSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ThoughtsList = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ThoughtItem = styled.div`
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f9f9f9;
  }
`;

const ActionButton = styled(Button)`
  min-width: 120px;
  height: 40px;
  background: #4ECDC4 !important; // สีเขียวมิ้นท์
  border-color: #4ECDC4 !important;
  
  &:hover {
    background: #45B7AF !important;
    border-color: #45B7AF !important;
  }
`;

const ReleaseButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 18px;
  margin-top: 16px;
  background: #FF6B6B !important; // สีแดงอ่อน
  border-color: #FF6B6B !important;
  
  &:hover {
    background: #ee5253 !important;
    border-color: #ee5253 !important;
  }
`;

// Cloud animations
const floatCloud = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`;

const Cloud = styled.div`
  position: absolute;
  top: ${props => props.top}%;
  left: 0;
  width: 200px;
  height: 100px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  animation: ${floatCloud} ${props => props.duration}s linear infinite;
  z-index: 2;

  &:before, &:after {
    content: '';
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

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
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
  background: ${props => props.color};
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  bottom: ${props => props.bottom}px;
  left: ${props => props.left}%;
  transform: translateY(0);
  transition: transform 4s ease-out;
  opacity: 1;
  animation: float 4s ease-out forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  color: white;
  font-size: 14px;
  word-break: break-word;

  &:before {  // เชือกลูกโป่ง
    content: '';
    position: absolute;
    bottom: -30px;
    left: 50%;
    width: 2px;
    height: 40px;
    background: #666;
    transform: translateX(-50%);
  }

  &:after {  // ปมเชือก
    content: '';
    position: absolute;
    bottom: -35px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: #666;
    border-radius: 50%;
    transform: translateX(-50%);
  }

  @keyframes float {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-120vh);
      opacity: 0;
    }
  }
`;

// เพิ่มอาร์เรย์สีสำหรับลูกโป่ง
const balloonColors = [
    '#FF6B6B',  // สีแดงอ่อน
    '#4ECDC4',  // สีฟ้า
    '#FFD93D',  // สีเหลือง
    '#95E1D3',  // สีเขียวมิ้นท์
    '#A8E6CF',  // สีเขียวอ่อน
    '#FFB6B9',  // สีชมพูอ่อน
    '#6C5B7B',  // สีม่วง
    '#F8B195'   // สีส้มอ่อน
];

// ฟังก์ชันสำหรับตัดข้อความให้พอดีกับลูกโป่ง
const truncateText = (text, maxLength = 30) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export default function ActivityTwo() {
    const [totalReleasedThoughts, setTotalReleasedThoughts] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [thoughts, setThoughts] = useState([]);
    const [newThought, setNewThought] = useState('');
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathCount, setBreathCount] = useState(0);
    const [isReleasing, setIsReleasing] = useState(false);
    const [floatingThoughts, setFloatingThoughts] = useState([]);
    const [clouds, setClouds] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // สร้างก้อนเมฆเมื่อ component mount
    useEffect(() => {
        const newClouds = Array(5).fill(null).map((_, index) => ({
            id: index,
            top: Math.random() * 100 + 5, // สุ่มตำแหน่งความสูง 10-70%
            duration: Math.random() * 20 + 10 // สุ่มความเร็ว 30-50 วินาที
        }));
        setClouds(newClouds);
    }, []);

    const handleAddThought = () => {
        if (newThought.trim()) {
            setThoughts(prev => [...prev, { id: Date.now(), text: newThought.trim() }]);
            setNewThought('');
            inputRef.current?.focus();
        } else {
            message.warning('กรุณากรอกความคิดที่ต้องการปล่อยวาง');
        }
    };

    const handleRemoveThought = (id) => {
        setThoughts(prev => prev.filter(thought => thought.id !== id));
    };

    const handleReleaseThoughts = () => {
        if (thoughts.length === 0) {
            message.warning('กรุณาเพิ่มความคิดที่ต้องการปล่อยวาง');
            return;
        }

        setIsReleasing(true);
        setTotalReleasedThoughts(prev => prev + thoughts.length);
        thoughts.forEach((thought, index) => {
            setTimeout(() => {
                setFloatingThoughts(prev => [...prev, {
                    ...thought,
                    color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
                    left: Math.random() * 80 + 10,
                    text: truncateText(thought.text)
                }]);

                if (index === thoughts.length - 1) {
                    setTimeout(() => {
                        setThoughts([]);
                        setFloatingThoughts([]);
                        setIsReleasing(false);
                        Modal.success({
                            title: 'ปล่อยวางความคิดสำเร็จ',
                            content: 'คุณได้ปล่อยวางความคิดทั้งหมดแล้ว รู้สึกเบาสบายขึ้นไหม?'
                        });
                    }, 2000);
                }
            }, index * 1000);
        });
    };

    const enhancedBalloonContainer = (
        <>
            <CloudContainer>
                {clouds.map(cloud => (
                    <Cloud
                        key={cloud.id}
                        top={cloud.top}
                        duration={cloud.duration}
                    />
                ))}
            </CloudContainer>
            <BalloonContainer>
                {floatingThoughts.map(thought => (
                    <Balloon
                        key={thought.id}
                        color={thought.color}
                        left={thought.left}
                        bottom={0}
                    >
                        <div className="balloon-body">
                            {thought.text}
                        </div>
                        <div className="highlight" />
                        <div className="knot" />
                    </Balloon>
                ))}
            </BalloonContainer>
        </>
    );

    const mainContent = (
        <PageContainer>
            <ContentContainer>
                <Title level={2} style={{ textAlign: 'center', color: 'white', marginBottom: 32 }}>
                    ปล่อยความคิด ให้ปลิวไปในอากาศ
                </Title>

                <InputSection>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Input.TextArea
                            ref={inputRef}
                            value={newThought}
                            onChange={e => setNewThought(e.target.value)}
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
                    {thoughts.map(thought => (
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
            </ContentContainer>
        </PageContainer>
    );

    const steps = [
        {
            title: 'ขั้นนำ',
            content: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <StyledCard>
                        <Space direction="vertical">
                            <Alert
                                message="ระยะเวลาในการทำกิจกรรม 50 นาที"
                                type="info"
                                showIcon
                            />
                            <Text>
                                กิจกรรม "ปล่อยความคิด ให้ปลิวไปในอากาศ" เป็นกิจกรรมที่ช่วยให้คุณฝึกการปล่อยวางความคิดที่ไม่เป็นประโยชน์
                            </Text>
                        </Space>
                    </StyledCard>

                    <StyledCard title="การหายใจเพื่อผ่อนคลาย">
                        <Space direction="vertical" align="center" style={{ width: '100%' }}>
                            <Text>นั่งในท่าที่สบาย และทำการหายใจลึกๆ 3-5 ครั้ง</Text>
                            <Button
                                type={isBreathing ? "default" : "primary"}
                                icon={<ClockCircleOutlined />}
                                onClick={() => {
                                    if (!isBreathing) {
                                        setIsBreathing(true);
                                        setBreathCount(0);
                                        const interval = setInterval(() => {
                                            setBreathCount(prev => {
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
                                {isBreathing ? `หายใจครั้งที่ ${breathCount + 1}` : 'เริ่มการหายใจ'}
                            </Button>
                            {isBreathing && (
                                <Text>
                                    {breathCount % 2 === 0 ? 'หายใจเข้า...' : 'หายใจออก...'}
                                </Text>
                            )}
                        </Space>
                    </StyledCard>
                </Space>
            )
        },
        {
            title: 'ขั้นดำเนินการ',
            content: mainContent
        },
        {
            title: 'ขั้นสรุป',
            content: (
                <StyledCard
                    title={
                        <div style={{
                            textAlign: 'center',
                            padding: '20px 0',
                            borderBottom: '2px solid #f0f0f0'
                        }}>
                            <Title level={3} style={{
                                margin: 0,
                                background: 'linear-gradient(45deg, #4ECDC4, #556270)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                สรุปกิจกรรม "ปล่อยความคิด ให้ปลิวไปในอากาศ"
                            </Title>
                        </div>
                    }
                    style={{
                        maxWidth: 600,
                        margin: '0 auto',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                    bodyStyle={{ padding: '30px' }}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #4ECDC4 0%, #556270 100%)',
                            borderRadius: '16px',
                            padding: '30px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(78, 205, 196, 0.2)',
                            marginBottom: '30px'
                        }}>
                            <Text style={{
                                fontSize: '28px',
                                color: 'white',
                                fontWeight: '600',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                คุณได้ปล่อยความคิดไปทั้งหมด
                            </Text>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: 'white',
                                margin: '15px 0',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                {totalReleasedThoughts}
                            </div>
                            <Text style={{
                                fontSize: '24px',
                                color: 'white',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                ความคิด
                            </Text>
                        </div>

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {[
                                {
                                    text: 'การปล่อยวางความคิดเป็นทักษะที่ต้องฝึกฝนอย่างสม่ำเสมอ เพื่อให้จิตใจเป็นอิสระจากความคิดที่สร้างความทุกข์',
                                    icon: '🎯'
                                },
                                {
                                    text: 'การสังเกตความรู้สึกของตัวเองหลังจากปล่อยวางความคิด จะช่วยให้เข้าใจถึงประโยชน์ของการปล่อยวาง',
                                    icon: '🔍'
                                },
                                {
                                    text: 'ฝึกฝนการปล่อยวางเป็นประจำ จะช่วยให้จิตใจเบาสบายและมีความสุขมากขึ้น',
                                    icon: '✨'
                                }
                            ].map((item, index) => (
                                <div key={index} style={{
                                    background: 'white',
                                    padding: '20px 25px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                    border: '1px solid #f0f0f0',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '15px'
                                }}>
                                    <div style={{
                                        fontSize: '24px',
                                        width: '40px',
                                        height: '40px',
                                        background: '#f8f9fa',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <Text style={{
                                        fontSize: '16px',
                                        lineHeight: '1.8',
                                        color: '#556270',
                                        flex: 1
                                    }}>
                                        {item.text}
                                    </Text>
                                </div>
                            ))}
                        </Space>
                    </Space>
                </StyledCard>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
                กิจกรรม "ปล่อยความคิด ให้ปลิวไปในอากาศ"
            </Title>

            <Steps
                current={currentStep}
                items={steps.map(item => ({ key: item.title, title: item.title }))}
                style={{ marginBottom: 32 }}
            />

            <StyledCard>
                {steps[currentStep].content}

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Space>
                        {currentStep > 0 && (
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={() => setCurrentStep(prev => prev - 1)}
                            >
                                ย้อนกลับ
                            </Button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <Button
                                type="primary"
                                onClick={() => setCurrentStep(prev => prev + 1)}
                            >
                                ถัดไป
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                onClick={() => navigate('/')} 
                                icon={<CheckOutlined />} 
                            >
                                จบกิจกรรม
                            </Button>
                        )}
                    </Space>
                </div>
            </StyledCard>
        </div>
    );
}