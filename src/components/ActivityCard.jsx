// src/components/ActivityCard.jsx
import { Card, Space, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

// Design system constants
const COLORS = {
  primary: '#7c3aed',
  secondary: '#a78bfa',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#1f2937',
  textLight: '#6b7280',
  border: '#e5e7eb',
  highlight: '#f3f4f6',
  gradient: {
    start: 'rgba(124, 58, 237, 0.05)',
    end: 'rgba(167, 139, 250, 0.05)'
  }
};

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  border: 1px solid ${COLORS.border};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: ${COLORS.surface};

  &:hover {
    transform: translateY(-2px);
    border-color: ${COLORS.secondary};
    box-shadow: 0 8px 16px rgba(124, 58, 237, 0.1);
  }

  .ant-card-head {
    border-bottom: 1px solid ${COLORS.border};
    min-height: 60px;
    padding: 0 24px;
    border-radius: 16px 16px 0 0;
  }

  .ant-card-body {
    padding: 24px;
  }

  .ant-card-head-title {
    padding: 16px 0;
  }

  @media (max-width: 576px) {
    margin-bottom: 16px;

    .ant-card-head {
      padding: 0 16px;
    }

    .ant-card-body {
      padding: 16px;
    }
  }
`;

const ActivityNumber = styled.div`
  background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
`;

const Duration = styled(Space)`
  color: ${COLORS.textLight};
  background: ${COLORS.highlight};
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
`;

const ActivityTitle = styled(Title)`
  &.ant-typography {
    color: ${COLORS.text};
    margin-bottom: 16px !important;
  }
`;

const SubtitleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Subtitle = styled(Text)`
  &.ant-typography {
    color: ${COLORS.textLight};
    font-size: 15px;
    display: flex;
    align-items: center;
    
    &:before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: ${COLORS.secondary};
      border-radius: 50%;
      margin-right: 12px;
      opacity: 0.7;
    }
  }
`;

export default function ActivityCard({ number, title, subtitles, duration }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/activity-${number}`);
  };

  return (
    <StyledCard
      onClick={handleClick}
      title={
        <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
          <ActivityNumber>Session {number}</ActivityNumber>
          <Duration>
            <ClockCircleOutlined />
            <span>{duration} นาที</span>
          </Duration>
        </Space>
      }
    >
      <ActivityTitle level={4}>{title}</ActivityTitle>
      <SubtitleList>
        {subtitles.map((subtitle, index) => (
          <Subtitle key={index}>{subtitle}</Subtitle>
        ))}
      </SubtitleList>
    </StyledCard>
  );
}