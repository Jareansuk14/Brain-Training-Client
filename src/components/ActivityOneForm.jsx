import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  Space,
  Typography,
  Steps,
  Select,
  message,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  SaveOutlined,
  LoadingOutlined,
  HeartOutlined,
  BookOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import locale from "antd/es/date-picker/locale/th_TH";
import dayjs from "dayjs";
import "dayjs/locale/th";

const { Title, Text, Paragraph } = Typography;
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

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${COLORS.gradientStart} 0%,
    ${COLORS.gradientEnd} 100%
  );
  padding: 40px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${COLORS.surface};
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 48px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 16px;
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

const StyledAlert = styled.div`
  background: ${COLORS.gradientStart};
  border-left: 4px solid ${COLORS.primary};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${fadeIn} 0.4s ease-out;

  .alert-icon {
    color: ${COLORS.primary};
    font-size: 20px;
    margin-top: 2px;
  }

  .alert-content {
    flex: 1;
  }

  .alert-title {
    color: ${COLORS.text};
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 15px;
  }

  .alert-description {
    color: ${COLORS.textLight};
    font-size: 14px;
    line-height: 1.6;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-form-item-label {
    padding-bottom: 8px;

    label {
      color: ${COLORS.text};
      font-weight: 500;
      font-size: 15px;
      height: auto;
    }
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker {
    border-radius: 10px;
    border-color: ${COLORS.border};
    padding: 8px 12px;
    font-size: 15px;
    transition: all 0.2s ease;
    height: auto;

    &:hover,
    &:focus {
      border-color: ${COLORS.secondary};
      box-shadow: 0 0 0 2px ${COLORS.secondary}20;
    }
  }

  .ant-select-selector {
    height: 42px !important;
    padding: 0 12px !important;

    .ant-select-selection-item {
      line-height: 42px !important;
    }
  }

  .ant-picker {
    width: 100%;
    height: 42px;
  }

  .ant-input-affix-wrapper {
    border-radius: 10px;
    padding: 0 12px;

    &:hover,
    &:focus {
      border-color: ${COLORS.secondary};
    }

    .ant-input {
      height: 40px;
    }
  }

  textarea.ant-input {
    padding: 12px;
    min-height: 120px;
    line-height: 1.6;
  }
`;

const StyledSteps = styled(Steps)`
  margin-bottom: 40px;

  .ant-steps-item-icon {
    width: 36px;
    height: 36px;
    line-height: 36px;
    background: ${COLORS.primary};
    border: none;

    .ant-steps-icon {
      color: white;
      font-size: 16px;
    }
  }

  .ant-steps-item-title {
    font-size: 15px;
    font-weight: 500;
  }

  .ant-steps-item-description {
    font-size: 13px;
    color: ${COLORS.textLight};
  }

  .ant-steps-item-tail::after {
    background-color: ${COLORS.border};
  }

  .ant-steps-item-finish {
    .ant-steps-item-icon {
      background-color: ${COLORS.success};
    }

    .ant-steps-item-tail::after {
      background-color: ${COLORS.success};
    }
  }
`;

const ActionButton = styled.button`
  height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  ${(props) =>
    props.variant === "primary" &&
    `
    background: ${COLORS.primary};
    color: white;
    border: none;
    
    &:hover {
      background: ${COLORS.secondary};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${COLORS.primary}40;
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: ${COLORS.textLight};
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}

  ${(props) =>
    props.variant === "ghost" &&
    `
    color: ${COLORS.text};
    border: 1px solid ${COLORS.border};
    background: transparent;
    
    &:hover {
      color: ${COLORS.primary};
      border-color: ${COLORS.primary};
      background: ${COLORS.primary}05;
    }
  `}

  .anticon {
    font-size: 16px;
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

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;

  .loading-content {
    text-align: center;

    .anticon {
      font-size: 24px;
      color: ${COLORS.primary};
      margin-bottom: 12px;
    }

    .loading-text {
      color: ${COLORS.text};
      font-size: 15px;
    }
  }
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  animation: ${fadeIn} 0.4s ease-out;
`;

const FormGroup = styled.div`
  background: ${COLORS.surface};
  border-radius: 16px;
  border: 1px solid ${COLORS.border};
  padding: 24px;
  margin-bottom: 24px;

  .group-title {
    font-weight: 600;
    color: ${COLORS.text};
    margin-bottom: 16px;
    font-size: 16px;
  }
`;

const SummaryStyles = styled.div`
  .summary-grid {
    display: grid;
    gap: 24px;
    margin-top: 16px;
  }

  .summary-item {
    background: ${COLORS.background};
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  }

  .summary-label {
    color: ${COLORS.primary}; // สีม่วง
    font-size: 14px;
    margin-bottom: 8px;
    font-weight: 500; // ตัวหนาขึ้น
  }

  .summary-value {
    color: ${COLORS.text};
    font-size: 16px;
    line-height: 1.6;
    white-space: pre-wrap;
    padding-left: 8px; // เยื้องซ้าย
    border-left: 2px solid ${COLORS.border}; // เส้นแบ่งด้านซ้าย
  }

  @media (min-width: 768px) {
    .summary-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

// Blood type options
const bloodTypes = [
  "A",
  "B",
  "O",
  "AB",
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

export default function ActivityOneForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    basicInfo: null,
    deepQuestions: null,
  });

  // Fetch existing data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.nationalId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://brain-training-server-production.up.railway.app/api/user-info/get/${user.nationalId}`
        );

        if (response.data.success && response.data.user) {
          const userData = response.data.user;
          if (userData.basicInfo && Object.keys(userData.basicInfo).length > 0) {
            setInitialData(userData);
            setFormData({
              basicInfo: userData.basicInfo,
              deepQuestions: userData.deepQuestions,
            });

            // Format data for form
            const formattedData = {
              ...userData.basicInfo,
              ...userData.deepQuestions,
              birthDate: userData.basicInfo?.birthDate
                ? dayjs(userData.basicInfo.birthDate)
                : dayjs(),
              favoriteFoods: userData.basicInfo?.favoriteFoods?.join(", "),
              dislikedFoods: userData.basicInfo?.dislikedFoods?.join(", "),
              hobbies: userData.basicInfo?.hobbies?.join(", "),
              personalTraits: userData.basicInfo?.personalTraits?.join(", "),
            };
            form.setFieldsValue(formattedData);
          } else {
            form.setFieldsValue({ birthDate: dayjs() });
            setFormData({
              basicInfo: {},
              deepQuestions: {},
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        form.setFieldsValue({ birthDate: dayjs() });
        setFormData({
          basicInfo: {},
          deepQuestions: {},
        });

        if (error.response?.status === 404) {
          message.info("เริ่มต้นกรอกข้อมูลใหม่");
        } else {
          message.error("ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.nationalId, form]);

  // Handle next step and save basic info
  const next = async () => {
    try {
      const values = await form.validateFields();
      
      if (currentStep === 0) {
        // Format basicInfo data
        const basicInfo = {
          fullName: values.fullName,
          nickname: values.nickname,
          bloodType: values.bloodType,
          age: Number(values.age),
          birthDate: values.birthDate?.toDate(),
          favoriteColor: values.favoriteColor,
          favoriteFoods: values.favoriteFoods
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          dislikedFoods: values.dislikedFoods
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          hobbies: values.hobbies
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          motto: values.motto,
          personalTraits: values.personalTraits
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        };

        // Validate required fields
        const missingFields = Object.entries(basicInfo)
          .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
          .map(([key]) => key);

        if (missingFields.length > 0) {
          message.error(`กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.join(", ")}`);
          return;
        }

        // Save basicInfo to state
        setFormData((prev) => ({
          ...prev,
          basicInfo,
        }));

        // Save to backend
        const response = await axios.post(
          "https://brain-training-server-production.up.railway.app/api/user-info/save-basic-info",
          {
            nationalId: user.nationalId,
            basicInfo,
          }
        );

        if (response.data.success) {
          message.success("บันทึกข้อมูลพื้นฐานสำเร็จ");
          setCurrentStep(currentStep + 1);
        } else {
          throw new Error(response.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error.response?.data?.message || "กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  // Final submit
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Validate deep questions
      const deepQuestions = {
        happiness: values.happiness,
        longTermGoals: values.longTermGoals,
        proudestMoment: values.proudestMoment,
        biggestFear: values.biggestFear,
        strengthsWeaknesses: values.strengthsWeaknesses,
        desiredChanges: values.desiredChanges,
      };

      const { basicInfo } = formData;
      if (!basicInfo || Object.keys(basicInfo).length === 0) {
        message.error("ไม่พบข้อมูลพื้นฐาน กรุณากรอกข้อมูลพื้นฐานก่อน");
        setLoading(false);
        return;
      }

      // Save complete data
      const response = await axios.post(
        "https://brain-training-server-production.up.railway.app/api/user-info/save-info",
        {
          nationalId: user.nationalId,
          basicInfo,
          deepQuestions,
        }
      );

      if (response.data.success) {
        message.success("บันทึกข้อมูลทั้งหมดสำเร็จ");
        setInitialData(response.data.user);
        setFormData(prev => ({
          ...prev,
          deepQuestions
        }));
        setCurrentStep(currentStep + 1);
      } else {
        throw new Error(response.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Save error:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const SummarySection = () => {
    const { basicInfo, deepQuestions } = formData;
    
    return (
      <FormSection>
        <SummaryStyles>
        <StyledAlert>
          <InfoCircleOutlined className="alert-icon" />
          <div className="alert-content">
            <div className="alert-title">สรุปข้อมูลของคุณ</div>
            <div className="alert-description">
              นี่คือข้อมูลทั้งหมดที่คุณได้กรอก กรุณาตรวจสอบความถูกต้อง
            </div>
          </div>
        </StyledAlert>

        <FormGroup>
          <div className="group-title">ข้อมูลทั่วไป</div>
          <div className="summary-grid">
            <SummaryItem label="ชื่อ/นามแฟง" value={basicInfo?.fullName} />
            <SummaryItem label="เหตุผลของนามแฟง" value={basicInfo?.nickname} />
            <SummaryItem label="กรุ๊ปเลือด" value={basicInfo?.bloodType} />
            <SummaryItem label="อายุ" value={`${basicInfo?.age} ปี`} />
            <SummaryItem 
              label="วันเกิด" 
              value={dayjs(basicInfo?.birthDate).format('DD/MM/YYYY')} 
            />
          </div>
        </FormGroup>

        <FormGroup>
          <div className="group-title">ความชอบและบุคลิกภาพ</div>
          <div className="summary-grid">
            <SummaryItem label="สีที่ชอบ" value={basicInfo?.favoriteColor} />
            <SummaryItem 
              label="อาหารที่ชอบ" 
              value={basicInfo?.favoriteFoods?.join(", ")} 
            />
            <SummaryItem 
              label="อาหารที่ไม่ชอบ" 
              value={basicInfo?.dislikedFoods?.join(", ")} 
            />
            <SummaryItem 
              label="งานอดิเรก" 
              value={basicInfo?.hobbies?.join(", ")} 
            />
            <SummaryItem label="คติประจำใจ" value={basicInfo?.motto} />
            <SummaryItem 
              label="นิสัยส่วนตัว" 
              value={basicInfo?.personalTraits?.join(", ")} 
            />
          </div>
        </FormGroup>

        <FormGroup>
          <div className="group-title">การพัฒนาตนเอง</div>
          <div className="summary-grid">
            <SummaryItem 
              label="สิ่งที่ทำให้มีความสุขที่สุด" 
              value={deepQuestions?.happiness} 
            />
            <SummaryItem 
              label="ความฝันหรือเป้าหมายระยะยาว" 
              value={deepQuestions?.longTermGoals} 
            />
            <SummaryItem 
              label="ความภูมิใจที่สุดในชีวิต" 
              value={deepQuestions?.proudestMoment} 
            />
            <SummaryItem 
              label="ความกลัวหรือความกังวล" 
              value={deepQuestions?.biggestFear} 
            />
            <SummaryItem 
              label="จุดแข็ง" 
              value={deepQuestions?.strengthsWeaknesses} 
            />
            <SummaryItem 
              label="จุดอ่อน" 
              value={deepQuestions?.desiredChanges} 
            />
          </div>
        </FormGroup>
      </SummaryStyles>
      </FormSection>
    );
  };

  const SummaryItem = ({ label, value }) => (
    <div className="summary-item">
      <div className="summary-label">{label}</div>
      <div className="summary-value">{value}</div>
    </div>
  );

  // Form steps configuration
  const steps = [
    {
      title: "ข้อมูลพื้นฐาน",
      icon: <HeartOutlined style={{ color: COLORS.primary }} />,
      content: (
        <FormSection>
          <InstructionCard>
            <div className="instruction-header">
              <InfoCircleOutlined />
              <h4>คำแนะนำในการทำกิจกรรม</h4>
            </div>
            <div className="instruction-list">
              <div className="instruction-item">
                <CheckCircleOutlined />
                <span>ใช้เวลาในการทำกิจกรรม 50 นาที</span>
              </div>
              <div className="instruction-item">
                <CheckCircleOutlined />
                <span>ตอบคำถามอย่างจริงใจและใคร่ครวญ</span>
              </div>
              <div className="instruction-item">
                <CheckCircleOutlined />
                <span>ไม่มีคำตอบที่ถูกหรือผิด เป้าหมายคือการทำความเข้าใจตนเอง</span>
              </div>
            </div>
          </InstructionCard>

          <StyledAlert>
            <InfoCircleOutlined className="alert-icon" />
            <div className="alert-content">
              <div className="alert-title">ข้อมูลส่วนบุคคล</div>
              <div className="alert-description">
                กรุณากรอกข้อมูลพื้นฐานของคุณ ข้อมูลเหล่านี้จะช่วยให้เราเข้าใจตัวตนของคุณมากขึ้น
              </div>
            </div>
          </StyledAlert>

          <FormGroup>
            <div className="group-title">ข้อมูลทั่วไป</div>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Form.Item
                name="fullName"
                label="ชื่อ/นามแฟง ที่บ่งบอกความเป็นตัวตนของคุณ"
                rules={[{ required: true, message: "กรุณากรอกชื่อ/นามแฟง ที่บ่งบอกความเป็นตัวตนของคุณ" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="ชื่อ/นามแฟง ที่บ่งบอกความเป็นตัวตนของคุณ" />
              </Form.Item>

              <Space wrap>
                <Form.Item
                  name="nickname"
                  label="เหตุผลของนามแฟง"
                  rules={[{ required: true, message: "กรุณากรอกเหตุผลของนามแฟง" }]}
              >
                <Input placeholder="เหตุผลของนามแฟง" />
              </Form.Item>

              <Form.Item
                name="bloodType"
                label="กรุ๊ปเลือด"
                rules={[{ required: true, message: "กรุณาเลือกกรุ๊ปเลือด" }]}
              >
                <Select style={{ width: 120 }} placeholder="กรุ๊ปเลือด">
                  {bloodTypes.map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="age"
                label="อายุ (ปี)"
                rules={[{ required: true, message: "กรุณากรอกอายุ" }]}
              >
                <Input type="number" style={{ width: 100 }} placeholder="อายุ" />
              </Form.Item>
            </Space>

            <Form.Item
              name="birthDate"
              label="วันเกิด"
              rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
            >
              <DatePicker
                locale={locale}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="เลือกวันเกิด"
              />
            </Form.Item>
          </Space>
        </FormGroup>

        <FormGroup>
          <div className="group-title">ข้อมูลความชอบและบุคลิกภาพ</div>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Form.Item
              name="favoriteColor"
              label="สีที่ชอบ"
              rules={[{ required: true, message: "กรุณาระบุสีที่ชอบ" }]}
            >
              <TextArea placeholder="สีที่คุณชอบ" autoSize={{ minRows: 2 }} />
            </Form.Item>

            <Form.Item
              name="favoriteFoods"
              label="อาหารที่ชอบ"
              rules={[{ required: true, message: "กรุณาระบุอาหารที่ชอบ" }]}
            >
              <TextArea
                placeholder="กรอกอาหารที่ชอบ (คั่นด้วยเครื่องหมายจุลภาค ,)"
                autoSize={{ minRows: 2 }}
              />
            </Form.Item>

            <Form.Item
              name="dislikedFoods"
              label="อาหารที่ไม่ชอบ"
              rules={[{ required: true, message: "กรุณาระบุอาหารที่ไม่ชอบ" }]}
            >
              <TextArea
                placeholder="กรอกอาหารที่ไม่ชอบ (คั่นด้วยเครื่องหมายจุลภาค ,)"
                autoSize={{ minRows: 2 }}
              />
            </Form.Item>

            <Form.Item
              name="hobbies"
              label="งานอดิเรก"
              rules={[{ required: true, message: "กรุณาระบุงานอดิเรก" }]}
            >
              <TextArea
                placeholder="กรอกงานอดิเรกของคุณ (คั่นด้วยเครื่องหมายจุลภาค ,)"
                autoSize={{ minRows: 2 }}
              />
            </Form.Item>

            <Form.Item
              name="motto"
              label="คติประจำใจ"
              rules={[{ required: true, message: "กรุณาระบุคติประจำใจ" }]}
            >
              <TextArea
                placeholder="คติประจำใจของคุณ"
                autoSize={{ minRows: 2 }}
              />
            </Form.Item>

            <Form.Item
              name="personalTraits"
              label="นิสัยส่วนตัว"
              rules={[{ required: true, message: "กรุณาระบุนิสัยส่วนตัว" }]}
            >
              <TextArea
                placeholder="กรอกนิสัยส่วนตัวของคุณ (คั่นด้วยเครื่องหมายจุลภาค ,)"
                autoSize={{ minRows: 2 }}
              />
            </Form.Item>
          </Space>
        </FormGroup>
      </FormSection>
    ),
  },
  {
    title: "คำถามเชิงลึก",
    icon: <BookOutlined style={{ color: COLORS.primary }} />,
    content: (
      <FormSection>
        <StyledAlert>
          <InfoCircleOutlined className="alert-icon" />
          <div className="alert-content">
            <div className="alert-title">คำถามเพื่อการพัฒนาตนเอง</div>
            <div className="alert-description">
              กรุณาตอบคำถามต่อไปนี้อย่างจริงใจ เพื่อช่วยให้คุณเข้าใจตนเองมากขึ้น
            </div>
          </div>
        </StyledAlert>

        <FormGroup>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Form.Item
              name="happiness"
              label="อะไรคือสิ่งที่ทำให้คุณมีความสุขที่สุด"
              rules={[{ required: true, message: "กรุณาตอบคำถามนี้" }]}
            >
              <TextArea
                placeholder="บอกเล่าถึงสิ่งที่ทำให้คุณมีความสุขที่สุด"
                autoSize={{ minRows: 3 }}
              />
            </Form.Item>

            <Form.Item
              name="longTermGoals"
              label="อะไรคือความฝันหรือเป้าหมายระยะยาวของคุณ"
              rules={[{ required: true, message: "กรุณาตอบคำถามนี้" }]}
            >
              <TextArea
                placeholder="เล่าถึงความฝันหรือเป้าหมายระยะยาวของคุณ"
                autoSize={{ minRows: 3 }}
              />
            </Form.Item>

            <Form.Item
              name="proudestMoment"
              label="คุณรู้สึกภูมิใจกับอะไรมากที่สุดในชีวิต"
              rules={[{ required: true, message: "กรุณาตอบคำถามนี้" }]}
            >
              <TextArea
                placeholder="เล่าถึงความภาคภูมิใจของคุณ"
                autoSize={{ minRows: 3 }}
              />
            </Form.Item>

            <Form.Item
              name="biggestFear"
              label="อะไรคือความกลัวหรือความกังวลที่ใหญ่ที่สุดของคุณ"
              rules={[{ required: true, message: "กรุณาตอบคำถามนี้" }]}
            >
              <TextArea
                placeholder="เล่าถึงความกลัวหรือความกังวลของคุณ"
                autoSize={{ minRows: 3 }}
              />
            </Form.Item>

            <Form.Item
              name="strengthsWeaknesses"
              label="อะไรคือจุดแข็งของคุณ"
              rules={[{ required: true, message: "กรุณาตอบคำถามนี้" }]}
            >
              <TextArea
                placeholder="อธิบายถึงจุดแข็งของคุณ"
                autoSize={{ minRows: 3 }}
              />
            </Form.Item>

            <Form.Item
              name="desiredChanges"
              label="อะไรคือจุดอ่อนของคุณ"
              rules={[{ required: true, message: "กรุณาตอบคำถามนี้" }]}
            >
              <TextArea
                placeholder="อธิบายถึงจุดอ่อนของคุณ"
                autoSize={{ minRows: 3 }}
              />
            </Form.Item>
          </Space>
        </FormGroup>
      </FormSection>
    ),
  },
  {
    title: "สรุปข้อมูล",
    icon: <CheckCircleOutlined style={{ color: COLORS.primary }} />,
    content: <SummarySection />,
  },
];

  return (
    <PageContainer>
      <ContentContainer>
        <PageTitle level={2}>Session 1 : "ฉันคือฉัน"</PageTitle>

        <StyledSteps
          current={currentStep}
          items={steps.map((item) => ({
            title: item.title,
            icon: item.icon,
          }))}
        />

        <StyledForm
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ birthDate: dayjs() }}
        >
          {steps[currentStep].content}

          <Space style={{ width: "100%", justifyContent: "center", marginTop: 32 }}>
            {currentStep > 0 && (
              <ActionButton variant="ghost" onClick={prev}>
                ย้อนกลับ
              </ActionButton>
            )}
            {currentStep === steps.length - 1 ? (
              <ActionButton
                variant="primary"
                onClick={() => navigate('/activity-1/mindmap')}
              >
                ถัดไป
              </ActionButton>
            ) : currentStep === 1 ? (
              <ActionButton
                variant="primary"
                onClick={form.submit}
                disabled={loading}
              >
                {loading ? <LoadingOutlined /> : <SaveOutlined />}
                บันทึกข้อมูล
              </ActionButton>
            ) : (
              <ActionButton variant="primary" onClick={next}>
                ถัดไป
              </ActionButton>
            )}
          </Space>
        </StyledForm>

        {loading && (
          <LoadingOverlay>
            <div className="loading-content">
              <LoadingOutlined />
              <Text className="loading-text">กำลังบันทึกข้อมูล...</Text>
            </div>
          </LoadingOverlay>
        )}
      </ContentContainer>
    </PageContainer>
  );
}