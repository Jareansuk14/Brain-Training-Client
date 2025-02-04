import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Button, Row, Col, Select, message } from 'antd';
import { ClockCircleOutlined , SwapRightOutlined} from '@ant-design/icons';
import { RotateCcw } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import confetti from 'canvas-confetti';

const { Title, Text } = Typography;

// Constants
const COLORS = {
  primary: '#7c3aed',
  secondary: '#a78bfa',
  background: '#7c3aed10',
  dark: '#1f2937',
  light: '#f8fafc',
  shadow: 'rgba(17, 12, 46, 0.1)',
};

const LEVELS = {
  1: 3,
  2: 4,
  3: 5,
  4: 6,
  5: 7,
  6: 8,
};

// Wood texture gradient
const WOOD_TEXTURE = `
  repeating-linear-gradient(
    45deg,
    #8B4513,
    #8B4513 10px,
    #A0522D 10px,
    #A0522D 20px
  )
`;

// Screen Orientation Check Component
const OrientationCheck = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsPortrait(width < height);
      setScreenWidth(width);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (screenWidth <= 768 && isPortrait) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center',
        background: COLORS.background
      }}>
        <RotateCcw size={48} style={{ color: COLORS.primary, marginBottom: '20px' }} />
        <Title level={3} style={{ color: COLORS.primary }}>
          กรุณาหมุนจอเป็นแนวนอน
        </Title>
        <Text>
          เพื่อประสบการณ์การเล่นที่ดีที่สุด กรุณาหมุนอุปกรณ์ของคุณเป็นแนวนอน
        </Text>
      </div>
    );
  }

  return children;
};

// Disc Component
const Disc = ({ size, color, index, isTop, isSelected }) => {
    const baseWidth = window.innerWidth <= 1024 ? 30 : 40;
    const widthIncrement = window.innerWidth <= 1024 ? 20 : 25;
    const width = baseWidth + size * widthIncrement;
  
    return (
      <div
        style={{
          width: `${width}px`,
          height: window.innerWidth <= 1024 ? '24px' : '32px',
          backgroundColor: color,
          margin: '2px auto',
          borderRadius: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.9)',
          fontSize: window.innerWidth <= 1024 ? '12px' : '14px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          border: '2px solid rgba(255,255,255,0.4)',
          transform: isSelected && isTop ? 
            'translateY(-20px) scale(1.05)' : 
            'translateY(0) scale(1)',
          zIndex: isSelected && isTop ? 3 : 2,
          position: 'relative',
        }}
      >
        {size}
      </div>
    );
  };
  
  // Tower Base Component
  const TowerBase = () => {
    const baseWidth = window.innerWidth <= 1024 ? 200 : 260;
    const baseHeight = window.innerWidth <= 1024 ? 30 : 40;
  
    return (
      <div style={{
        position: 'relative',
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        marginBottom: '0',
        padding: '0',
      }}>
        {/* Main Base */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: `${baseWidth * 0.115}px`,
          width: `${baseWidth * 0.77}px`,
          height: `${baseHeight * 0.75}px`,
          background: WOOD_TEXTURE,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          transform: 'perspective(500px) rotateX(10deg)',
          transformStyle: 'preserve-3d',
          border: '2px solid rgba(139, 69, 19, 0.6)',
        }} />
        
        {/* Base Shadow */}
        <div style={{
          position: 'absolute',
          bottom: `-${baseHeight * 0.25}px`,
          left: `${baseWidth * 0.077}px`,
          width: `${baseWidth * 0.85}px`,
          height: `${baseHeight * 0.5}px`,
          background: 'rgba(0,0,0,0.2)',
          filter: 'blur(8px)',
          borderRadius: '50%',
        }} />
      </div>
    );
  };
  
  // Tower Component
  const Tower = ({ index, discs, discColors, selectedTower, onTowerClick }) => {
    const towerWidth = window.innerWidth <= 1024 ? 240 : 300;
    const towerHeight = window.innerWidth <= 1024 ? 300 : 400;
    const rodHeight = window.innerWidth <= 1024 ? 200 : 280;
    const isSelected = selectedTower === index;
  
    return (
      <div
        onClick={() => onTowerClick(index)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          minHeight: `${towerHeight}px`,
          width: `${towerWidth}px`,
          padding: '20px',
          backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.1)' : 'white',
          borderRadius: '16px',
          boxShadow: isSelected ? 
            '0 0 0 2px rgba(124, 58, 237, 0.5)' : 
            '0 8px 16px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          position: 'relative',
          border: '1px solid rgba(0,0,0,0.1)',
          flex: '0 0 auto',
          cursor: 'pointer',
        }}
      >
        {/* Tower Number */}
        <div style={{
          position: 'absolute',
          top: '12px',
          fontSize: window.innerWidth <= 1024 ? '14px' : '16px',
          color: COLORS.dark,
          fontWeight: 'bold',
          padding: '4px 12px',
          borderRadius: '12px',
          background: 'rgba(124, 58, 237, 0.1)',
        }}>
          Tower {index + 1}
        </div>
        
        {/* Discs Container */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column-reverse',
          alignItems: 'center',
          minHeight: `${rodHeight}px`,
          justifyContent: 'flex-start',
          width: '100%',
          zIndex: 1,
          marginBottom: '16px',
          position: 'relative',
        }}>
          {/* Tower Rod */}
          <div style={{
            position: 'absolute',
            bottom: '-16px',
            width: '16px',
            height: `${rodHeight}px`,
            background: WOOD_TEXTURE,
            borderRadius: '8px 8px 4px 4px',
            boxShadow: '2px 4px 8px rgba(0,0,0,0.2)',
            zIndex: 0,
            border: '1px solid rgba(139, 69, 19, 0.6)',
          }} />
          
          {/* Discs */}
          {discs.map((disc, i) => (
            <Disc
              key={disc}
              size={disc}
              color={discColors[disc - 1]}
              index={i}
              isTop={i === discs.length - 1}
              isSelected={isSelected}
            />
          ))}
        </div>
        
        {/* Tower Base */}
        <TowerBase />
      </div>
    );
  };

  // Game Instructions Component
const GameInstructions = () => (
    <Card style={{ 
      marginBottom: '24px',
      maxWidth: '800px',
      margin: '0 auto 24px auto'
    }}>
      <Title level={4} style={{ color: COLORS.primary, marginBottom: '16px' }}>
        วิธีการเล่น
      </Title>
      <ul style={{ paddingLeft: '20px' }}>
        <li style={{ marginBottom: '8px' }}>
          <Text>
            ย้ายจานทั้งหมดจากหอคอยซ้ายไปหอคอยขวา โดยต้องวางให้จานใหญ่อยู่ด้านล่างเสมอ
          </Text>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Text>
            กดที่หอคอยเพื่อเลือกจานที่ต้องการย้าย แล้วกดที่หอคอยปลายทาง
          </Text>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Text>
            พยายามทำให้สำเร็จด้วยจำนวนการเคลื่อนย้ายน้อยที่สุด
          </Text>
        </li>
      </ul>
    </Card>
  );
  
  // Game Stats Component
  const GameStats = ({ time, moves, minMoves, selectedLevel, gameState }) => (
    <Card style={{ marginBottom: '24px' }}>
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col xs={24} sm={8}>
          <Space size="large">
            <Space>
              <ClockCircleOutlined />
              <Text strong>เวลา: {formatTime(time)}</Text>
            </Space>
          </Space>
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
          <Space>
            <SwapRightOutlined />
            <Text strong>การเคลื่อนย้าย: {moves}</Text>
            {gameState === 'playing' && (
              <Text type="secondary">(น้อยสุด: {minMoves})</Text>
            )}
          </Space>
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
          <Text strong>ระดับ {selectedLevel} </Text>
          <Text type="secondary">({LEVELS[selectedLevel]} จาน)</Text>
        </Col>
      </Row>
    </Card>
  );
  
  // Game Controls Component
  const GameControls = ({ gameState, selectedLevel, setSelectedLevel, initializeGame, resetGame }) => (
    <div style={{ 
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      gap: '12px',
      backgroundColor: 'white',
      padding: '12px 24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }}>
      {gameState === 'waiting' && (
        <>
          <Select
            value={selectedLevel}
            onChange={setSelectedLevel}
            style={{ width: 150 }}
          >
            {Object.entries(LEVELS).map(([level, discs]) => (
              <Select.Option key={level} value={parseInt(level)}>
                ระดับ {level} ({discs} จาน)
              </Select.Option>
            ))}
          </Select>
          <Button 
            type="primary"
            style={{ 
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary
            }}
            onClick={() => initializeGame()}
          >
            เริ่มเกม
          </Button>
        </>
      )}
      {gameState === 'completed' && (
        <>
          <Button 
            type="primary"
            style={{ 
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary
            }}
            onClick={resetGame}
          >
            เล่นใหม่
          </Button>
          <Button
            onClick={() => initializeGame(true)}
          >
            เล่นระดับเดิมอีกครั้ง
          </Button>
        </>
      )}
    </div>
  );
  
  // Game Container Component
  const GameContainer = ({ children }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      marginBottom: '32px',
      padding: '0 20px',
      maxWidth: '100%',
      overflowX: 'auto',
      minHeight: window.innerWidth <= 1024 ? '340px' : '440px',
    }}>
      {children}
    </div>
  );
  
  // Helper Functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Main Component
const TowerOfHanoi = () => {
    const [gameState, setGameState] = useState('waiting');
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [towers, setTowers] = useState([[], [], []]);
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState(null);
    const [discColors, setDiscColors] = useState([]);
    const [minMoves, setMinMoves] = useState(0);
    const [showInstructions, setShowInstructions] = useState(true);
    const [selectedTower, setSelectedTower] = useState(null);
  
    // Initialize random colors for discs
    useEffect(() => {
      const generateRandomColors = () => {
        const maxDiscs = 8;
        const colors = Array(maxDiscs).fill().map(() => {
          const hue = Math.floor(Math.random() * 360);
          return `hsl(${hue}, 70%, 50%)`;
        });
        setDiscColors(colors);
      };
      
      generateRandomColors();
    }, []);
  
    // Cleanup timer on unmount
    useEffect(() => {
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [timer]);
  
    // Handle tower click
    const handleTowerClick = (towerIndex) => {
      if (gameState !== 'playing') return;
  
      if (selectedTower === null) {
        // No tower selected yet
        if (towers[towerIndex].length === 0) {
          return;
        }
        setSelectedTower(towerIndex);
      } else {
        // Attempting to move disc
        const sourceTower = towers[selectedTower];
        const targetTower = towers[towerIndex];
        
        if (selectedTower === towerIndex) {
          setSelectedTower(null);
          return;
        }
        
        const discToMove = sourceTower[sourceTower.length - 1];
        const topDiscOnTarget = targetTower[targetTower.length - 1];
  
        if (targetTower.length === 0 || discToMove < topDiscOnTarget) {
          // Valid move
          const newTowers = towers.map(tower => [...tower]);
          const disc = newTowers[selectedTower].pop();
          newTowers[towerIndex].push(disc);
          
          setTowers(newTowers);
          setMoves(prev => prev + 1);
          
          // Check if game is won
          if (towerIndex === 2 && newTowers[2].length === LEVELS[selectedLevel]) {
            handleGameWin();
          }
        } else {
          message.error('ไม่สามารถวางจานใหญ่บนจานเล็กได้');
        }
        
        setSelectedTower(null);
      }
    };
  
    // Initialize game board
    const initializeGame = (keepLevel = false) => {
      if (!keepLevel) {
        setShowInstructions(false);
      }
      const numDiscs = LEVELS[selectedLevel];
      const initialTowers = [
        Array.from({ length: numDiscs }, (_, i) => numDiscs - i),
        [],
        []
      ];
      setTowers(initialTowers);
      setMoves(0);
      setTime(0);
      setGameState('playing');
      setSelectedTower(null);
      setMinMoves(Math.pow(2, numDiscs) - 1);
  
      if (timer) clearInterval(timer);
  
      const intervalId = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
      setTimer(intervalId);
  
      message.info('กดที่หอคอยเพื่อเลือกและย้ายจาน', 3);
    };
  
    // Reset game
    const resetGame = () => {
      if (timer) {
        clearInterval(timer);
      }
      setGameState('waiting');
      setShowInstructions(true);
      setMoves(0);
      setTime(0);
      setTowers([[], [], []]);
      setSelectedTower(null);
  
      // Generate new random colors
      const colors = Array(8).fill().map(() => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 50%)`;
      });
      setDiscColors(colors);
    };
  
    // Handle game win
    const handleGameWin = () => {
      clearInterval(timer);
      setGameState('completed');
      
      // Multiple confetti bursts
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
  
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
  
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
  
        const particleCount = 50 * (timeLeft / duration);
  
        // Random confetti burst
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
      
      // Show completion message
      message.success(
        <div style={{ padding: '10px' }}>
          <Title level={4} style={{ color: COLORS.primary, marginBottom: '12px' }}>
            🎉 ยินดีด้วย! คุณชนะแล้ว!
          </Title>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            จำนวนการเคลื่อนย้าย: {moves} ครั้ง
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            จำนวนน้อยที่สุดที่เป็นไปได้: {minMoves} ครั้ง
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            เวลาที่ใช้: {formatTime(time)}
          </div>
        </div>,
        5
      );
    };
  
    return (
      <OrientationCheck>
        <div style={{ 
          minHeight: '100vh',
          minWidth: '100vw',
          padding: '24px 0',
          background: COLORS.background,
          overflowX: 'hidden'
        }}>
          <div style={{ 
            maxWidth: '1400px', 
            margin: '0 auto',
            paddingBottom: '80px'
          }}>
            <Title 
              level={2} 
              style={{ 
                textAlign: 'center',
                marginBottom: '24px',
                color: COLORS.primary,
                padding: '0 20px'
              }}
            >
              Tower of Hanoi - ระดับ {selectedLevel}
            </Title>
  
            {showInstructions && <GameInstructions />}
  
            <GameStats 
              time={time}
              moves={moves}
              minMoves={minMoves}
              selectedLevel={selectedLevel}
              gameState={gameState}
            />
  
            <GameContainer>
              {[0, 1, 2].map(i => (
                <Tower
                  key={i}
                  index={i}
                  discs={towers[i]}
                  discColors={discColors}
                  selectedTower={selectedTower}
                  onTowerClick={handleTowerClick}
                />
              ))}
            </GameContainer>
  
            <GameControls 
              gameState={gameState}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              initializeGame={initializeGame}
              resetGame={resetGame}
            />
          </div>
        </div>
      </OrientationCheck>
    );
  };
  
  export default TowerOfHanoi;