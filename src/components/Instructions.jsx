// src/components/Instructions.jsx
import { Typography } from 'antd';
import { InfoCircleOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const { Text, Title } = Typography;

const COLORS = {
  primary: '#7c3aed',
  secondary: '#a78bfa',
  surface: '#ffffff',
  textLight: '#6b7280',
};

const InstructionsCard = styled.div`
  margin: 32px 0;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, 
    rgba(124, 58, 237, 0.05) 0%,
    rgba(167, 139, 250, 0.05) 100%
  );
  border: 1px solid rgba(124, 58, 237, 0.1);
`;

const InstructionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .icon {
    font-size: 24px;
    color: ${COLORS.primary};
  }
`;

const InstructionsTitle = styled(Title)`
  &.ant-typography {
    margin: 0;
    color: ${COLORS.primary};
    font-size: 20px;
  }
`;

const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InstructionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);

  .icon {
    color: ${COLORS.secondary};
    font-size: 16px;
  }
`;

export default function Instructions() {
  return (
    <InstructionsCard>
      <InstructionsHeader>
        <InfoCircleOutlined className="icon" />
        <InstructionsTitle level={4}>คำแนะนำในการทำกิจกรรม</InstructionsTitle>
      </InstructionsHeader>
      <InstructionsList>
        <InstructionItem>
          <ClockCircleOutlined className="icon" />
          <Text>ใช้เวลาทำกิจกรรมครั้งละ 50 นาที</Text>
        </InstructionItem>
        <InstructionItem>
          <CalendarOutlined className="icon" />
          <Text>ทำกิจกรรมสัปดาห์ละ 2 ครั้ง ห่างกัน 48-72 ชั่วโมง</Text>
        </InstructionItem>
      </InstructionsList>
    </InstructionsCard>
  );
}