import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import { Gamepad2, Play } from 'lucide-react';
import styled from '@emotion/styled';

const FloatingButton = styled(Button)`
  @keyframes float {
    0% {
      transform: translateY(0px) scale(1);
      box-shadow: 0 5px 15px rgba(124, 58, 237, 0.2);
    }
    50% {
      transform: translateY(-10px) scale(1.05);
      box-shadow: 0 25px 30px rgba(124, 58, 237, 0.3);
    }
    100% {
      transform: translateY(0px) scale(1);
      box-shadow: 0 5px 15px rgba(124, 58, 237, 0.2);
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(124, 58, 237, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
    }
  }

  animation: float 6s ease-in-out infinite;
  position: fixed;
  z-index: 1000;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    animation: pulse 2s infinite;
    background: linear-gradient(145deg, #8e49ff, #7c3aed);
  }

  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(45deg, #7c3aed, #a78bfa, #7c3aed);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
    animation: spin 4s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .icon-container {
    position: relative;
    width: 32px;
    height: 32px;
  }

  .icon {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.3s ease;
  }

  .icon-enter {
    opacity: 0;
    transform: scale(0.5) rotate(-180deg);
  }

  .icon-enter-active {
    opacity: 1;
    transform: scale(1) rotate(0);
  }

  .icon-exit {
    opacity: 1;
    transform: scale(1) rotate(0);
  }

  .icon-exit-active {
    opacity: 0;
    transform: scale(0.5) rotate(180deg);
  }
`;

const GameFAB = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ right: 24, bottom: 24 });

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      
      const newBottom = Math.max(24, Math.min(24 + position * 0.1, 100));
      setButtonPosition(prev => ({
        ...prev,
        bottom: newBottom
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Tooltip 
      title="เล่นเกม" 
      placement="left"
      color="#7c3aed"
      overlayStyle={{
        fontSize: '16px',
        padding: '8px 12px'
      }}
    >
      <FloatingButton
        type="primary"
        shape="circle"
        size="large"
        onClick={() => navigate('/game')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '64px',
          height: '64px',
          background: '#7c3aed',
          right: buttonPosition.right,
          bottom: buttonPosition.bottom,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        icon={
          <div className="flex items-center justify-center w-full h-full">
            <div className="icon-container">
              {isHovered ? (
                <Play 
                  size={32} 
                  className="text-white icon"
                  style={{
                    opacity: 1,
                    transform: 'scale(1)',
                  }}
                />
              ) : (
                <Gamepad2 
                  size={32} 
                  className="text-white icon"
                  style={{
                    opacity: 1,
                    transform: 'scale(1)',
                  }}
                />
              )}
            </div>
          </div>
        }
      />
    </Tooltip>
  );
};

export default GameFAB;