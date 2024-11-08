// src/components/Header.jsx
import { Typography, Space } from 'antd';
import styled from '@emotion/styled';

const { Title } = Typography;

const COLORS = {
  primary: '#7c3aed',
  secondary: '#a78bfa',
  text: '#1f2937',
  textLight: '#6b7280',
  highlight: '#f3f4f6',
};

const StyledHeader = styled.header`
  text-align: center;
  padding: 3rem 1rem 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary});
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem 1.5rem;
  }
`;

const MainTitle = styled(Title)`
  &.ant-typography {
    color: ${COLORS.text};
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 16px !important;
    position: relative;
    display: inline-block;
    
    &::before {
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      background: ${COLORS.primary}15;
      border-radius: 12px;
      transform: rotate(-15deg);
      z-index: -1;
      right: -10px;
      top: -5px;
    }

    @media (max-width: 768px) {
      font-size: 24px;
      
      &::before {
        width: 30px;
        height: 30px;
        right: -5px;
        top: -3px;
      }
    }
  }
`;

const SubTitle = styled(Title)`
  &.ant-typography {
    color: ${COLORS.textLight};
    font-weight: 400;
    font-size: 18px;
    max-width: 700px;
    margin: 0 auto !important;
    line-height: 1.6;
    position: relative;
    
    strong {
      color: ${COLORS.primary};
      font-weight: 800;
      padding: 0 4px;
    }

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  width: 140px;
  height: 140px;
  background: ${COLORS.highlight};
  border-radius: 50%;
  z-index: -1;
  opacity: 0.7;

  &.left {
    left: -30px;
    top: 20%;
  }

  &.right {
    right: -40px;
    bottom: 10%;
    width: 180px;
    height: 180px;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export default function Header() {
  return (
    <StyledHeader>
      <FloatingShape className="left" />
      <FloatingShape className="right" />
      <Space direction="vertical" size={16}>
        <MainTitle level={1}>โปรแกรมพัฒนาสมองแบบผสมผสาน</MainTitle>
        <SubTitle level={3}>
          เสริมสร้าง<strong>ความจำใช้งาน</strong>และลดภาวะบกพร่องเล็กน้อยทาง<strong>การรู้คิด</strong>ในวัยทำงาน
        </SubTitle>
      </Space>
    </StyledHeader>
  );
}