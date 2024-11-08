import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Button, Steps, Alert, Checkbox, Input, List, Tag, message, Modal } from 'antd';
import { HeartOutlined, AimOutlined, CheckOutlined, PlusOutlined, DeleteOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Updated minimal color palette
const COLORS = {
    primary: '#7c3aed',    // Deep purple
    secondary: '#a78bfa',  // Light purple
    background: '#7c3aed10', // Almost white
    surface: '#ffffff',    // Pure white
    text: '#1f2937',      // Dark gray
    textLight: '#6b7280', // Medium gray
    border: '#e5e7eb',    // Light gray
    success: '#10b981',   // Emerald
    warning: '#ef4444',   // Red
    highlight: '#f3f4f6', // Very light gray
};

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

// Smooth fade-in animation
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
`;

// Updated styled components with minimal design
const PageContainer = styled.div`
    min-height: 100vh;
    padding: 32px;
    background: ${COLORS.background};

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

const ContentContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    background: ${COLORS.surface};
    border-radius: 24px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    padding: 40px;

    @media (max-width: 768px) {
        padding: 24px;
        border-radius: 16px;
    }
`;

const StyledCard = styled(Card)`
    margin-bottom: 32px;
    border-radius: 16px;
    border: 1px solid ${COLORS.border};
    box-shadow: none;
    animation: ${fadeIn} 0.5s ease-out;

    .ant-card-head {
        border-bottom: 1px solid ${COLORS.border};
        padding: 16px 24px;
        min-height: auto;
    }

    .ant-card-head-title {
        font-size: 18px;
        font-weight: 500;
    }

    .ant-card-body {
        padding: 24px;
    }
`;

const ValueCard = styled(Card)`
    margin-bottom: 16px;
    border-radius: 12px;
    border: 1px solid ${COLORS.border};
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${props => props.selected ? COLORS.highlight : COLORS.surface};
    
    ${props => props.selected && `
        border-color: ${COLORS.primary};
        border-width: 2px;
    `}
    
    &:hover {
        border-color: ${COLORS.primary};
    }

    .ant-card-body {
        padding: 20px;
    }
`;

const ActionButton = styled(Button)`
    height: 44px;
    padding: 0 24px;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &.primary {
        background: ${COLORS.primary};
        border: none;
        color: white;
        
        &:hover {
            background: ${COLORS.secondary};
            transform: translateY(-1px);
        }

        &:disabled {
            background: ${COLORS.textLight};
            opacity: 0.5;
        }
    }

    &.ghost {
        color: ${COLORS.text};
        border: 1px solid ${COLORS.border};
        background: transparent;
        
        &:hover {
            color: ${COLORS.primary};
            border-color: ${COLORS.primary};
            background: transparent;
        }
    }
`;

const StyledTextArea = styled(TextArea)`
    border-radius: 12px;
    border: 1px solid ${COLORS.border};
    padding: 16px;
    transition: all 0.2s ease;
    font-size: 16px;
    resize: none;
    
    &:hover, &:focus {
        border-color: ${COLORS.primary};
        box-shadow: none;
    }
`;

const StyledSteps = styled(Steps)`
    margin-bottom: 48px;

    .ant-steps-item-icon {
        width: 40px;
        height: 40px;
        line-height: 40px;
        border: none;
        
        .ant-steps-icon {
            font-size: 18px;
        }
    }

    .ant-steps-item-title {
        font-size: 16px;
        font-weight: 500;
    }
`;


// ข้อมูลคุณค่า
const VALUES_DATA = [
    {
        id: 1,
        title: 'การเรียนรู้และพัฒนาตนเอง',
        description: 'มุ่งมั่นในการเรียนรู้สิ่งใหม่และพัฒนาทักษะอย่างต่อเนื่อง เพื่อการเติบโตที่ยั่งยืน'
    },
    {
        id: 2,
        title: 'สุขภาพและความเป็นอยู่ที่ดี',
        description: 'ให้ความสำคัญกับการดูแลสุขภาพกายและใจ สร้างสมดุลในการใช้ชีวิต'
    },
    {
        id: 3,
        title: 'ความสัมพันธ์และการเชื่อมต่อ',
        description: 'สร้างและรักษาความสัมพันธ์ที่มีความหมาย เสริมสร้างการเชื่อมต่อกับผู้อื่น'
    },
    {
        id: 4,
        title: 'ความสำเร็จและการบรรลุเป้าหมาย',
        description: 'มุ่งมั่นสู่ความสำเร็จและการบรรลุเป้าหมายที่ตั้งไว้อย่างมีประสิทธิภาพ'
    },
    {
        id: 5,
        title: 'ความคิดสร้างสรรค์และการแสดงออก',
        description: 'ส่งเสริมการแสดงออกทางความคิดสร้างสรรค์และจินตนาการอย่างอิสระ'
    },
    {
        id: 6,
        title: 'ความรับผิดชอบและจริยธรรม',
        description: 'ยึดมั่นในความถูกต้อง มีความรับผิดชอบต่อตนเองและสังคม'
    },
    {
        id: 7,
        title: 'ความเป็นผู้นำและการทำงานเป็นทีม',
        description: 'พัฒนาทักษะการเป็นผู้นำและการทำงานร่วมกับผู้อื่น'
    },
    {
        id: 8,
        title: 'การจัดการอารมณ์และความเครียด',
        description: 'พัฒนาทักษะการจัดการอารมณ์และความเครียดอย่างมีประสิทธิภาพ'
    }
];

export default function ActivitySix() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedValues, setSelectedValues] = useState([]);
    const [goals, setGoals] = useState({
        workingMemory: '',
        cognition: '',
        lifeBalance: ''
    });
    const [loading, setLoading] = useState(false);
    const [existingPlans, setExistingPlans] = useState([]);
    const [showSummaryFirst, setShowSummaryFirst] = useState(false);

    // ตรวจสอบแผนที่มีอยู่เมื่อโหลดหน้า
    useEffect(() => {
        const checkExistingPlans = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/life-design/${user.nationalId}`);
                const plans = response.data;

                if (plans && plans.length > 0) {
                    const validPlans = plans.map(plan => ({
                        ...plan,
                        values: Array.isArray(plan.values) ? plan.values : []
                    }));
                    setExistingPlans(validPlans);
                    setShowSummaryFirst(true);
                    setCurrentStep(2);
                }
            } catch (error) {
                console.error('Error fetching existing plans:', error);
                message.error('ไม่สามารถโหลดข้อมูลแผนเป้าหมายได้');
            }
        };

        if (user?.nationalId) {
            checkExistingPlans();
        }
    }, [user?.nationalId]);

    // ฟังก์ชันสำหรับเลือก Values
    const handleValueSelect = (valueId) => {
        if (selectedValues.includes(valueId)) {
            setSelectedValues(selectedValues.filter(id => id !== valueId));
        } else {
            setSelectedValues([...selectedValues, valueId]);
        }
    };

    // ฟังก์ชันสำหรับบันทึกเป้าหมาย
    const handleGoalChange = (field, value) => {
        setGoals(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // ฟังก์ชันสำหรับลบแผนเป้าหมาย
    const handleDeletePlan = async (planId) => {
        try {
            await axios.put(`http://localhost:5000/api/life-design/delete/${planId}`);
            setExistingPlans(existingPlans.filter(plan => plan._id !== planId));
            message.success('ลบแผนเป้าหมายสำเร็จ');
        } catch (error) {
            console.error('Error deleting plan:', error);
            message.error('ไม่สามารถลบแผนเป้าหมายได้');
        }
    };

    // ฟังก์ชันสำหรับบันทึกแผนเป้าหมายใหม่
    const handleSavePlan = async () => {
        setLoading(true);
        try {
            if (!selectedValues.length || !goals.workingMemory || !goals.cognition || !goals.lifeBalance) {
                message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
                setLoading(false);
                return;
            }

            const response = await axios.post('http://localhost:5000/api/life-design/create', {
                nationalId: user.nationalId,
                values: selectedValues,
                goals: {
                    workingMemory: goals.workingMemory.trim(),
                    cognition: goals.cognition.trim(),
                    lifeBalance: goals.lifeBalance.trim()
                }
            });

            if (response.data.success) {
                message.success('บันทึกแผนเป้าหมายสำเร็จ');
                // ตรวจสอบว่า response.data.plan มีข้อมูลครบถ้วน
                if (response.data.plan) {
                    setExistingPlans(prev => [...prev, response.data.plan]);
                }
                resetForm();
                setShowSummaryFirst(true);
            }
        } catch (error) {
            console.error('Error saving plan:', error);
            message.error(
                error.response?.data?.error ||
                'ไม่สามารถบันทึกแผนเป้าหมายได้ กรุณาลองใหม่อีกครั้ง'
            );
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันรีเซ็ตฟอร์ม
    const resetForm = () => {
        setSelectedValues([]);
        setGoals({
            workingMemory: '',
            cognition: '',
            lifeBalance: ''
        });
        setCurrentStep(0);
    };

    // ฟังก์ชันเริ่มแผนใหม่
    const handleStartNewPlan = () => {
        resetForm();
        setShowSummaryFirst(false);
        setCurrentStep(0);
    };

    // เงื่อนไขการไปขั้นตอนถัดไป
    const canProceedToGoals = selectedValues.length > 0;
    const canProceedToAction = goals.workingMemory && goals.cognition && goals.lifeBalance;

    return (
        <PageContainer>
            <ContentContainer>
            <PageTitle level={2}>ออกแบบชีวิต สร้างเป้าหมายที่สมดุล</PageTitle>

                {showSummaryFirst ? (
                    // แสดงสรุปแผนที่มีอยู่
                    <>
                        <StyledCard title="แผนเป้าหมายของคุณ">
                            {existingPlans.map((plan) => (
                                <StyledCard
                                    key={plan._id}
                                    type="inner"
                                    style={{ marginBottom: 16 }}
                                    extra={
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDeletePlan(plan._id)}
                                        >
                                            ลบแผน
                                        </Button>
                                    }
                                >
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <div>
                                            <Text strong>คุณค่าที่เลือก:</Text>
                                            <div style={{ marginTop: 8 }}>
                                                {plan.values.map((valueId) => (
                                                    <Tag
                                                        key={valueId}
                                                        color={COLORS.primary}
                                                        style={{ margin: '4px', padding: '4px 8px' }}
                                                    >
                                                        {VALUES_DATA.find(v => v.id === valueId)?.title}
                                                    </Tag>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Text strong>เป้าหมาย:</Text>
                                            <List
                                                style={{ marginTop: 8 }}
                                                itemLayout="vertical"
                                                dataSource={[
                                                    {
                                                        label: 'ความจำใช้งาน',
                                                        content: plan.goals.workingMemory
                                                    },
                                                    {
                                                        label: 'กระบวนการรู้คิด',
                                                        content: plan.goals.cognition
                                                    },
                                                    {
                                                        label: 'ความสมดุลในชีวิต',
                                                        content: plan.goals.lifeBalance
                                                    }
                                                ]}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                            <Text type="secondary">{item.label}:</Text>
                                                            <Text>{item.content}</Text>
                                                        </Space>
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                    </Space>
                                </StyledCard>
                            ))}

                            <div style={{ textAlign: 'center', marginTop: 24 }}>
                                <ActionButton
                                    className="primary"
                                    onClick={handleStartNewPlan}
                                    icon={<PlusOutlined />}
                                    size="large"
                                >
                                    สร้างแผนใหม่
                                </ActionButton>
                            </div>
                        </StyledCard>
                    </>
                ) : (
                    // แสดงฟอร์มสร้างแผนใหม่
                    <>
                        <StyledSteps
                            current={currentStep}
                            items={[
                                { title: 'ค้นหาคุณค่า', icon: <HeartOutlined /> },
                                { title: 'กำหนดเป้าหมาย', icon: <AimOutlined /> },
                                { title: 'สรุปแผนเป้าหมาย', icon: <CheckOutlined /> }
                            ]}
                        />

                        {/* Step 1: ค้นหาคุณค่า */}
                        {currentStep === 0 && (
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <StyledCard>
                                    <Alert
                                        message="ระยะเวลาในการทำกิจกรรม 50 นาที"
                                        type="info"
                                        showIcon
                                        style={{
                                            marginBottom: 24,
                                            borderRadius: 12,
                                            border: 'none',
                                            background: `${COLORS.primary}10`
                                        }}
                                    />
                                    <Paragraph style={{
                                        fontSize: '16px',
                                        marginBottom: 32,
                                        color: '#000',
                                        lineHeight: '1.8',
                                        fontWeight: '600'
                                    }}>
                                        เลือกคุณค่าที่สำคัญในชีวิตของคุณ เพื่อเป็นเข็มทิศนำทางในการกำหนดเป้าหมายและแผนปฏิบัติการ
                                    </Paragraph>

                                    {VALUES_DATA.map(value => (
                                        <ValueCard
                                            key={value.id}
                                            selected={selectedValues.includes(value.id)}
                                            onClick={() => handleValueSelect(value.id)}
                                        >
                                            <Space align="start">
                                                <Checkbox
                                                    checked={selectedValues.includes(value.id)}
                                                    style={{ marginTop: 4 }}
                                                />
                                                <div>
                                                    <Text strong style={{
                                                        fontSize: '16px',
                                                        display: 'block',
                                                        marginBottom: 8,
                                                        color: COLORS.text
                                                    }}>
                                                        {value.title}
                                                    </Text>
                                                    <Text type="secondary" style={{
                                                        fontSize: '14px',
                                                        lineHeight: '1.6'
                                                    }}>
                                                        {value.description}
                                                    </Text>
                                                </div>
                                            </Space>
                                        </ValueCard>
                                    ))}
                                </StyledCard>

                                <div style={{ textAlign: 'right' }}>
                                    <ActionButton
                                        className="primary"
                                        disabled={!canProceedToGoals}
                                        onClick={() => setCurrentStep(1)}
                                        size="large"
                                    >
                                        ถัดไป
                                    </ActionButton>
                                </div>
                            </Space>
                        )}

                        {/* Step 2: กำหนดเป้าหมาย */}
                        {currentStep === 1 && (
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <StyledCard title="ความจำใช้งาน (Working Memory)">
                                    <Paragraph style={{
                                        marginBottom: 16,
                                        color: COLORS.textLight,
                                        lineHeight: '1.8'
                                    }}>
                                        กำหนดเป้าหมายในการพัฒนาความจำใช้งาน เช่น การจดจำข้อมูลระยะสั้น การจัดการข้อมูลหลายอย่างพร้อมกัน
                                    </Paragraph>
                                    <StyledTextArea
                                        rows={4}
                                        placeholder="เป้าหมายการพัฒนาความจำใช้งานของคุณ..."
                                        value={goals.workingMemory}
                                        onChange={(e) => handleGoalChange('workingMemory', e.target.value)}
                                    />
                                </StyledCard>

                                <StyledCard title="กระบวนการรู้คิด (Cognitive Function)">
                                    <Paragraph style={{
                                        marginBottom: 16,
                                        color: COLORS.textLight,
                                        lineHeight: '1.8'
                                    }}>
                                        กำหนดเป้าหมายในการพัฒนากระบวนการคิด การวิเคราะห์ และการแก้ปัญหา
                                    </Paragraph>
                                    <StyledTextArea
                                        rows={4}
                                        placeholder="เป้าหมายการพัฒนากระบวนการรู้คิดของคุณ..."
                                        value={goals.cognition}
                                        onChange={(e) => handleGoalChange('cognition', e.target.value)}
                                    />
                                </StyledCard>

                                <StyledCard title="ความสมดุลในชีวิต (Life Balance)">
                                    <Paragraph style={{
                                        marginBottom: 16,
                                        color: COLORS.textLight,
                                        lineHeight: '1.8'
                                    }}>
                                        กำหนดเป้าหมายในการสร้างสมดุลระหว่างการทำงาน การพักผ่อน และการใช้ชีวิต
                                    </Paragraph>
                                    <StyledTextArea
                                        rows={4}
                                        placeholder="เป้าหมายการสร้างสมดุลในชีวิตของคุณ..."
                                        value={goals.lifeBalance}
                                        onChange={(e) => handleGoalChange('lifeBalance', e.target.value)}
                                    />
                                </StyledCard>

                                <div style={{ textAlign: 'right', marginTop: 32 }}>
                                    <Space size={16}>
                                        <ActionButton
                                            className="ghost"
                                            onClick={() => setCurrentStep(0)}
                                            size="large"
                                        >
                                            ย้อนกลับ
                                        </ActionButton>
                                        <ActionButton
                                            className="primary"
                                            disabled={!canProceedToAction}
                                            onClick={() => setCurrentStep(2)}
                                            size="large"
                                        >
                                            ถัดไป
                                        </ActionButton>
                                    </Space>
                                </div>
                            </Space>
                        )}

                        {/* Step 3: สรุปแผนเป้าหมาย */}
                        {currentStep === 2 && (
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <StyledCard title="สรุปเป้าหมายที่เลือก">
                                    <List
                                        itemLayout="vertical"
                                        dataSource={[
                                            {
                                                title: 'คุณค่าที่เลือก',
                                                content: (
                                                    <div style={{ marginTop: 8 }}>
                                                        {selectedValues.map((valueId) => (
                                                            <Tag
                                                                key={valueId}
                                                                color={COLORS.primary}
                                                                style={{ margin: '4px', padding: '4px 8px' }}
                                                            >
                                                                {VALUES_DATA.find(v => v.id === valueId)?.title}
                                                            </Tag>
                                                        ))}
                                                    </div>
                                                )
                                            },
                                            {
                                                title: 'เป้าหมายด้านความจำใช้งาน',
                                                content: goals.workingMemory
                                            },
                                            {
                                                title: 'เป้าหมายด้านกระบวนการรู้คิด',
                                                content: goals.cognition
                                            },
                                            {
                                                title: 'เป้าหมายด้านความสมดุลในชีวิต',
                                                content: goals.lifeBalance
                                            }
                                        ]}
                                        renderItem={item => (
                                            <List.Item style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <Text strong style={{
                                                        fontSize: '16px',
                                                        color: COLORS.primary
                                                    }}>
                                                        {item.title}
                                                    </Text>
                                                    {typeof item.content === 'string' ? (
                                                        <Text style={{
                                                            fontSize: '14px',
                                                            color: COLORS.text,
                                                            lineHeight: '1.6'
                                                        }}>
                                                            {item.content}
                                                        </Text>
                                                    ) : (
                                                        item.content
                                                    )}
                                                </Space>
                                            </List.Item>
                                        )}
                                    />

                                    <div style={{ textAlign: 'right', marginTop: 32 }}>
                                        <Space size={16}>
                                            <ActionButton
                                                className="ghost"
                                                onClick={() => setCurrentStep(1)}
                                                size="large"
                                            >
                                                ย้อนกลับ
                                            </ActionButton>
                                            <ActionButton
                                                className="primary"
                                                onClick={handleSavePlan}
                                                loading={loading}
                                                size="large"
                                            >
                                                บันทึกแผนเป้าหมาย
                                            </ActionButton>
                                        </Space>
                                    </div>
                                </StyledCard>
                            </Space>
                        )}

                        {/* Progress indicator */}
                        <Alert
                            style={{
                                marginTop: 48,
                                borderRadius: 12,
                                border: 'none',
                                background: `${COLORS.primary}10`
                            }}
                            message={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ color: COLORS.primary }}>
                                        ความคืบหน้า: {currentStep === 0 ? '33%' : currentStep === 1 ? '66%' : '100%'}
                                    </Text>
                                    <Text type="secondary">
                                        {currentStep === 0 ? 'กำลังเลือกคุณค่า' :
                                            currentStep === 1 ? 'กำลังกำหนดเป้าหมาย' :
                                                'กำลังสรุปแผนเป้าหมาย'}
                                    </Text>
                                </div>
                            }
                            type="info"
                            showIcon
                        />

                        {/* Helper Messages */}
                        {currentStep === 0 && !canProceedToGoals && (
                            <Alert
                                style={{
                                    marginTop: 16,
                                    borderRadius: 12,
                                    border: 'none',
                                    background: `${COLORS.warning}10`
                                }}
                                message="กรุณาเลือกอย่างน้อย 1 คุณค่าที่สำคัญสำหรับคุณ"
                                type="warning"
                                showIcon
                            />
                        )}

                        {currentStep === 1 && !canProceedToAction && (
                            <Alert
                                style={{
                                    marginTop: 16,
                                    borderRadius: 12,
                                    border: 'none',
                                    background: `${COLORS.warning}10`
                                }}
                                message="กรุณากรอกเป้าหมายให้ครบทุกด้าน"
                                type="warning"
                                showIcon
                            />
                        )}
                    </>
                )}
            </ContentContainer>

            {/* Loading overlay */}
            {loading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <Space direction="vertical" align="center">
                        <LoadingOutlined style={{ fontSize: 24, color: COLORS.primary }} />
                        <Text>กำลังดำเนินการ...</Text>
                    </Space>
                </div>
            )}
        </PageContainer>
    );
}