// src/components/Auth.jsx
import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  IdcardOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
  UserAddOutlined,
  WarningOutlined,
} from "@ant-design/icons";

// Color Constants
const COLORS = {
  primary: "#7c3aed", // Deep purple
  secondary: "#a78bfa", // Light purple
  background: "#fafafa", // Almost white
  surface: "#ffffff", // Pure white
  text: "#1f2937", // Dark gray
  textLight: "#6b7280", // Medium gray
  border: "#e5e7eb", // Light gray
  success: "#10b981", // Emerald
  warning: "#ef4444", // Red
  highlight: "#f3f4f6", // Very light gray
};

// Animations
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${COLORS.primary}22 0%,
    ${COLORS.secondary}22 100%
  );
  padding: 16px;
`;

const AuthCard = styled.div`
  background: ${COLORS.surface};
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  background: ${COLORS.background};
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 32px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.active ? COLORS.surface : "transparent")};
  color: ${(props) => (props.active ? COLORS.primary : COLORS.textLight)};
  box-shadow: ${(props) =>
    props.active ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    color: ${COLORS.primary};
  }
`;

const FormContainer = styled.div`
  position: relative;
  min-height: 200px;
`;

const FormContent = styled.div`
  animation: ${slideIn} 0.3s ease-out;
  position: absolute;
  width: 100%;
`;

const Title = styled.h1`
  color: ${COLORS.text};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${COLORS.textLight};
  text-align: center;
  margin-bottom: 24px;
  font-size: 14px;
`;

const StyledInput = styled(Input)`
  height: 48px;
  border-radius: 12px;
  border: 2px solid ${COLORS.border};
  padding: 0 16px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: ${COLORS.background};

  &:hover,
  &:focus {
    border-color: ${COLORS.primary};
    background: ${COLORS.surface};
    box-shadow: 0 0 0 3px ${COLORS.primary}22;
  }

  .ant-input-prefix {
    color: ${COLORS.textLight};
    font-size: 18px;
    margin-right: 12px;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  height: 48px;
  background: ${COLORS.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 24px;

  &:hover:not(:disabled) {
    background: ${COLORS.secondary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ValidationMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => (props.type === "error" ? "#ef4444" : COLORS.textLight)};
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${(props) => (props.type === "error" ? "#fee2e2" : "#f3f4f6")};

  .icon {
    font-size: 16px;
    color: ${(props) =>
      props.type === "error" ? "#ef4444" : COLORS.textLight};
  }
`;

export default function Auth() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [validating, setValidating] = useState(false);

  // Validate Thai National ID
  const validateNationalId = (nationalId) => {
    if (!nationalId || nationalId.length !== 13) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseFloat(nationalId.charAt(i)) * (13 - i);
    }
    let mod = sum % 11;
    let check = (11 - mod) % 10;
    return check === parseFloat(nationalId.charAt(12));
  };

  // Check if user exists
  const checkExistingUser = async (nationalId) => {
    try {
      const response = await axios.get(
        `https://brain-training-server.onrender.com/api/auth/user-info/${nationalId}`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  };

  // Handle login
  const handleLogin = async (values) => {
    setLoading(true);
    setError('');
    
    try {
        if (!validateNationalId(values.nationalId)) {
            setError('เลขบัตรประชาชนไม่ถูกต้อง');
            setLoading(false);
            return;
        }

        const response = await axios.post('https://brain-training-server.onrender.com/api/auth/login', values);
        
        if (response.data.success) {
            login(values.nationalId);
            message.success('เข้าสู่ระบบสำเร็จ');
            navigate('/');
        }
    } catch (error) {
        console.error('Login error:', error);
        setError(error.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
        setLoading(false);
    }
};

  // Handle registration
  const handleRegister = async (values) => {
    setLoading(true);
    setError('');
    
    try {
        if (!validateNationalId(values.nationalId)) {
            setError('เลขบัตรประชาชนไม่ถูกต้อง');
            setLoading(false);
            return;
        }

        const response = await axios.post('https://brain-training-server.onrender.com/api/auth/register', values);
        
        if (response.data.success) {
            message.success('ลงทะเบียนสำเร็จ');
            setActiveTab('login');
            registerForm.resetFields();
            message.info('กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ');
        }
    } catch (error) {
        console.error('Register error:', error);
        setError(error.response?.data?.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
        setLoading(false);
    }
};

  // Handle real-time national ID validation
  const handleNationalIdChange = async (e, form) => {
    const value = e.target.value;
    if (value.length === 13) {
        setValidating(true);
        setError('');
        
        try {
            if (!validateNationalId(value)) {
                setError('เลขบัตรประชาชนไม่ถูกต้อง');
                return;
            }

            const response = await axios.get(`https://brain-training-server.onrender.com/api/auth/check/${value}`);
            if (activeTab === 'register' && response.data.exists) {
                setError('เลขบัตรประชาชนนี้มีในระบบแล้ว');
            } else if (activeTab === 'login' && !response.data.exists) {
                setError('ไม่พบข้อมูลผู้ใช้ในระบบ');
            }
        } catch (error) {
            console.error('Validation error:', error);
        } finally {
            setValidating(false);
        }
    }
};

  // Handle tab switching
  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    loginForm.resetFields();
    registerForm.resetFields();
  };

  return (
    <PageContainer>
      <AuthCard>
        <TabContainer>
          <Tab
            active={activeTab === "login"}
            onClick={() => switchTab("login")}
          >
            เข้าสู่ระบบ
          </Tab>
          <Tab
            active={activeTab === "register"}
            onClick={() => switchTab("register")}
          >
            ลงทะเบียน
          </Tab>
        </TabContainer>

        <FormContainer>
          {activeTab === "login" && (
            <FormContent>
              <Title>ยินดีต้อนรับกลับ</Title>
              <Subtitle>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</Subtitle>

              <Form form={loginForm} onFinish={handleLogin}>
                <Form.Item
                  name="nationalId"
                  rules={[
                    { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
                    {
                      pattern: /^\d{13}$/,
                      message: "กรุณากรอกเลขบัตรประชาชน 13 หลัก",
                    },
                  ]}
                >
                  <StyledInput
                    prefix={<IdcardOutlined />}
                    placeholder="เลขบัตรประชาชน 13 หลัก"
                    maxLength={13}
                    onChange={(e) => handleNationalIdChange(e, loginForm)}
                    disabled={loading}
                  />
                </Form.Item>

                {error && (
                  <ValidationMessage type="error">
                    <WarningOutlined className="icon" />
                    {error}
                  </ValidationMessage>
                )}

                <ActionButton type="submit" disabled={loading || validating}>
                  {loading ? (
                    <>
                      <LoadingOutlined /> กำลังเข้าสู่ระบบ
                    </>
                  ) : validating ? (
                    <>
                      <LoadingOutlined /> กำลังตรวจสอบ
                    </>
                  ) : (
                    <>
                      เข้าสู่ระบบ <ArrowRightOutlined />
                    </>
                  )}
                </ActionButton>
              </Form>
            </FormContent>
          )}

          {activeTab === "register" && (
            <FormContent>
              <Title>สร้างบัญชีใหม่</Title>
              <Subtitle>กรุณากรอกข้อมูลเพื่อลงทะเบียน</Subtitle>

              <Form form={registerForm} onFinish={handleRegister}>
                <Form.Item
                  name="nationalId"
                  rules={[
                    { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
                    {
                      pattern: /^\d{13}$/,
                      message: "กรุณากรอกเลขบัตรประชาชน 13 หลัก",
                    },
                  ]}
                >
                  <StyledInput
                    prefix={<IdcardOutlined />}
                    placeholder="เลขบัตรประชาชน 13 หลัก"
                    maxLength={13}
                    onChange={(e) => handleNationalIdChange(e, registerForm)}
                    disabled={loading}
                  />
                </Form.Item>

                {error && (
                  <ValidationMessage type="error">
                    <WarningOutlined className="icon" />
                    {error}
                  </ValidationMessage>
                )}

                <ActionButton type="submit" disabled={loading || validating}>
                  {loading ? (
                    <>
                      <LoadingOutlined /> กำลังลงทะเบียน
                    </>
                  ) : validating ? (
                    <>
                      <LoadingOutlined /> กำลังตรวจสอบ
                    </>
                  ) : (
                    <>
                      ลงทะเบียน <UserAddOutlined />
                    </>
                  )}
                </ActionButton>
              </Form>
            </FormContent>
          )}
        </FormContainer>
      </AuthCard>
    </PageContainer>
  );
}
