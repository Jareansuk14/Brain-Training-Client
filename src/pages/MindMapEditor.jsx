import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, message, Tooltip, Spin } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

// Color Constants
const COLORS = {
  primary: '#7c3aed',      // สีม่วงหลัก (เหมือนต้นแบบ)
  secondary: '#8b5cf6',    // สีม่วงรอง
  tertiary: '#a78bfa',     // สีม่วงอ่อน
  background: '#7c3aed10', // สีพื้นหลังโปร่งใส
  dark: '#1f2937',        // สีเทาเข้ม
  light: '#f8fafc',       // สีขาวนวล
  shadow: 'rgba(124, 58, 237, 0.1)',  // เงาสีม่วงโปร่งใส
  connection: '#e2e8f0',   // สีเส้นเชื่อม
  hover: '#f1f5f9',      // สีเมื่อ hover
  success: '#10b981',    // สีเขียว
  warning: '#f59e0b',    // สีส้ม
  danger: '#ef4444',     // สีแดง
  border: '#e5e7eb',     // สีขอบ
  gradient: {
    start: '#7c3aed',    // สีไล่ระดับเริ่มต้น
    end: '#8b5cf6'       // สีไล่ระดับจบ
  }
};

// Breakpoints
const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
};

// API Base URL
const API_BASE_URL = 'https://brain-training-server.onrender.com/api/mindmap';

// Animations
const fadeIn = keyframes({
  from: { 
    opacity: 0, 
    transform: 'translateY(10px)' 
  },
  to: { 
    opacity: 1, 
    transform: 'translateY(0)' 
  }
});

// Styled Components
const PageContainer = styled('div')({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${COLORS.gradient.start}08, ${COLORS.gradient.end}08)`,
  padding: '20px 15px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    background: `linear-gradient(135deg, ${COLORS.gradient.start}, ${COLORS.gradient.end})`,
    opacity: 0.05,
    zIndex: 0
  },
  [`@media (min-width: ${BREAKPOINTS.tablet})`]: {
    padding: '40px 24px',
  }
});

const ContentContainer = styled('div')({
  maxWidth: '100%',
  width: '100%',
  margin: '0 auto',
  animation: `${fadeIn} 0.6s ease-out`,
  position: 'relative',
  zIndex: 1,
  [`@media (min-width: ${BREAKPOINTS.tablet})`]: {
    maxWidth: '1000px',
  }
});

const StyledCard = styled(Card)({
  background: COLORS.light,
  borderRadius: '16px',
  border: 'none',
  boxShadow: `0 4px 24px ${COLORS.shadow}`,
  marginBottom: '16px',
  transition: 'all 0.3s ease',
  '& .ant-card-head': {
    borderBottom: `1px solid ${COLORS.background}`,
    padding: '16px 24px',
  },
  '& .ant-card-body': {
    padding: '24px',
  },
  '& .ant-spin-nested-loading': {
    width: '100%'
  },
  '& .ant-spin-container': {
    width: '100%'
  }
});

const IntroCard = styled(StyledCard)({
  background: COLORS.background,
  color: COLORS.dark,
  marginBottom: '32px',
  border: `1px solid ${COLORS.border}`,
  boxShadow: `0 4px 6px -1px ${COLORS.shadow}, 0 2px 4px -2px ${COLORS.shadow}`,
  '& .ant-card-head-title': {
    color: COLORS.dark
  },
  '& .ant-typography': {
    color: COLORS.dark
  }
});

const NodeContainer = styled('div')(props => ({
  marginLeft: `${props.level * 24}px`,
  [`@media (min-width: ${BREAKPOINTS.tablet})`]: {
    marginLeft: `${props.level * 32}px`,
  },
  marginBottom: '16px',
  padding: '8px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-16px',
    top: '24px',
    width: '24px',
    height: '2px',
    background: COLORS.connection,
    display: props.level === 0 ? 'none' : 'block',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '-16px',
    top: '26px',
    width: '2px',
    height: 'calc(100% - 26px)',
    background: COLORS.connection,
    display: props.level === 0 ? 'none' : 'block',
  }
}));

const NodeContent = styled('div')(props => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'white',
  padding: '12px 16px',
  borderRadius: '12px',
  border: `1px solid ${props.isEditing ? COLORS.primary : COLORS.connection}`,
  boxShadow: `0 2px 4px ${COLORS.shadow}`,
  transition: 'all 0.3s ease',
  
  '& .anticon': {
    fontSize: '16px',
    color: props.isEditing ? COLORS.primary : COLORS.dark,
  },

  '& .ant-btn': {
    minWidth: '32px',
    height: '32px',
    
    '& .anticon': {
      fontSize: '14px',
    }
  },

  '&:hover': {
    background: COLORS.hover,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 8px ${COLORS.shadow}`,
    borderColor: COLORS.primary,
    
    '& .anticon': {
      color: COLORS.primary,
    }
  },

  [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
    flexWrap: 'wrap',
    '& .ant-space': {
      marginTop: '8px',
      width: '100%',
      justifyContent: 'flex-end'
    }
  }
}));

const NodeInput = styled(Input)({
  borderRadius: '8px',
  border: `2px solid ${COLORS.primary}`,
  padding: '8px 12px',
  fontSize: '14px',
  '&:focus': {
    boxShadow: `0 0 0 2px ${COLORS.primary}20`
  }
});

const ActionButton = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  height: '32px',
  padding: '0 12px',
  transition: 'all 0.2s ease',
  border: 'none',
  fontWeight: '500',

  '&.ant-btn': {
    boxShadow: `0 2px 4px ${COLORS.shadow}`,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 6px ${COLORS.shadow}`,
    },
  },

  '&.ant-btn-default': {
    background: '#fff',
    borderColor: COLORS.border,
    color: COLORS.dark,
    '&:hover': {
      background: COLORS.hover,
      borderColor: COLORS.primary,
      color: COLORS.primary,
    },
  },
  
  '&.primary': {
    background: '#fff',
    borderColor: COLORS.primary,
    color: 'white',
    '&:hover': {
      background: COLORS.secondary,
      borderColor: COLORS.secondary,
    },
    '&:active': {
      transform: 'translateY(0)',
    }
  },

  '&.success': {
    background: COLORS.success,
    borderColor: COLORS.success,
    color: 'white',
    '&:hover': {
      background: '#059669',
      borderColor: '#059669',
    }
  },

  '&.ant-btn-dangerous': {
    background: '#fff',
    borderColor: COLORS.danger,
    color: COLORS.danger,
    '&:hover': {
      background: COLORS.danger,
      borderColor: COLORS.danger,
      color: 'white',
    }
  }
});

const ButtonGroup = styled(Space)({
  opacity: 0.8,
  transition: 'all 0.3s ease',
  gap: '8px !important',

  '& .ant-btn': {
    margin: '0 !important',
  },

  [`${NodeContent}:hover &`]: {
    opacity: 1,
    transform: 'scale(1.02)',
  }
});

const NodeText = styled(Text)({
  fontSize: '14px',
  flexGrow: 1,
  marginRight: '8px',
  color: COLORS.dark
});

const HelpText = styled(Paragraph)({
  color: COLORS.dark,
  marginBottom: '0',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '& .anticon': {
    fontSize: '16px'
  },
  [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
    fontSize: '13px'
  }
});

// Node Component
const Node = ({ node, level, onUpdate, onDelete, onAddChild, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(node?.content || 'หัวข้อใหม่');
  const [loading, setLoading] = useState(false);

  if (!node) return null;

  const handleSave = async () => {
    if (!tempContent.trim()) {
      message.warning('กรุณากรอกข้อความ');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(node._id, tempContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving node:', error);
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <NodeContainer level={level}>
      <NodeContent isEditing={isEditing}>
        {node.children?.length > 0 && (
          <Tooltip title={node.isExpanded ? 'ย่อ' : 'ขยาย'}>
            <ActionButton
              icon={node.isExpanded ? <ZoomOutOutlined /> : <ZoomInOutlined />}
              onClick={() => onToggle(node._id)}
              size="small"
              disabled={loading}
            />
          </Tooltip>
        )}
        
        {isEditing ? (
          <Space>
            <NodeInput
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              onPressEnter={handleKeyPress}
              onBlur={handleSave}
              autoFocus
              disabled={loading}
            />
            <ActionButton
              icon={<SaveOutlined />}
              onClick={handleSave}
              className="success"
              size="small"
              loading={loading}
            />
          </Space>
        ) : (
          <>
            <NodeText>{node.content}</NodeText>
            <ButtonGroup size={4}>
              <Tooltip title="แก้ไข">
                <ActionButton
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  size="small"
                  disabled={loading}
                />
              </Tooltip>
              <Tooltip title="เพิ่มหัวข้อย่อย">
                <ActionButton
                  icon={<PlusOutlined />}
                  onClick={() => onAddChild(node._id)}
                  className="primary"
                  size="small"
                  disabled={loading}
                />
              </Tooltip>
              {level > 0 && (
                <Tooltip title="ลบ">
                  <ActionButton
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(node._id)}
                    danger
                    size="small"
                    disabled={loading}
                  />
                </Tooltip>
              )}
            </ButtonGroup>
          </>
        )}
      </NodeContent>

      {node.isExpanded && node.children?.map((child) => (
        <Node
          key={child._id}
          node={child}
          level={level + 1}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddChild={onAddChild}
          onToggle={onToggle}
        />
      ))}
    </NodeContainer>
  );
};

// Main Component
const MindMapEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mindMap, setMindMap] = useState({
    root: {
      _id: 'root',
      content: 'หัวข้อหลัก',
      children: [],
      isExpanded: true
    }
  });

  // Fetch mind map data
  useEffect(() => {
    if (user?.nationalId) {
      fetchMindMap();
    }
  }, [user?.nationalId]);

  const fetchMindMap = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${user.nationalId}`);
      console.log('Fetched mind map:', response.data);
      if (response.data && response.data.root) {
        setMindMap({ root: response.data.root });
      }
    } catch (error) {
      console.error('Error fetching mind map:', error);
      message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
  };

  // Add new node with optimistic update
  const addChild = async (parentId) => {
    // Create temporary node
    const tempNode = {
      _id: Date.now().toString(), // Temporary ID
      content: 'หัวข้อใหม่',
      children: [],
      isExpanded: true
    };

    // Optimistically update UI
    setMindMap(prevMap => {
      const addNodeToTree = (node) => {
        if (node._id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), tempNode],
            isExpanded: true
          };
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: node.children.map(addNodeToTree)
          };
        }
        return node;
      };
      
      return {
        ...prevMap,
        root: addNodeToTree(prevMap.root)
      };
    });

    try {
      // Make API call in background
      const response = await axios.post(`${API_BASE_URL}/add-node`, {
        nationalId: user.nationalId,
        parentId,
        content: 'หัวข้อใหม่'
      });
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      // Update with real data from server
      setMindMap(prevMap => {
        const updateNodeToReal = (node) => {
          if (node._id === tempNode._id) {
            return response.data;
          }
          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: node.children.map(updateNodeToReal)
            };
          }
          return node;
        };
        
        return {
          ...prevMap,
          root: updateNodeToReal(prevMap.root)
        };
      });
    } catch (error) {
      console.error('Error adding node:', error);
      message.error('เกิดข้อผิดพลาดในการเพิ่มหัวข้อ');
      // Revert optimistic update on error
      setMindMap(prevMap => {
        const removeNode = (node) => {
          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: node.children
                .filter(child => child._id !== tempNode._id)
                .map(removeNode)
            };
          }
          return node;
        };
        return {
          ...prevMap,
          root: removeNode(prevMap.root)
        };
      });
    }
  };

  // Update node content with optimistic update
  const updateNode = async (nodeId, content) => {
    // Store original content for rollback
    let originalContent;
    
    // Optimistically update UI
    setMindMap(prevMap => {
      const updateNodeInTree = (node) => {
        if (!node) return node;
        
        if (node._id === nodeId) {
          originalContent = node.content;
          return { ...node, content };
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: node.children.map(child => updateNodeInTree(child))
          };
        }
        return node;
      };
      
      return {
        ...prevMap,
        root: updateNodeInTree(prevMap.root)
      };
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/update-node`, {
        nationalId: user.nationalId,
        nodeId,
        content
      });

      if (!response.data.success) {
        throw new Error('Failed to update node');
      }
    } catch (error) {
      console.error('Error updating node:', error);
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      
      // Revert to original content on error
      setMindMap(prevMap => {
        const revertNode = (node) => {
          if (!node) return node;
          
          if (node._id === nodeId) {
            return { ...node, content: originalContent };
          }
          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: node.children.map(revertNode)
            };
          }
          return node;
        };
        
        return {
          ...prevMap,
          root: revertNode(prevMap.root)
        };
      });
      throw error;
    }
  };

  // Delete node with optimistic update
  const deleteNode = async (nodeId) => {
    // Store deleted node and its parent for potential rollback
    let deletedNode = null;
    let parentNode = null;
    
    // Optimistically update UI
    setMindMap(prevMap => {
      const findAndRemoveNode = (node) => {
        if (!node) return node;
        
        if (node.children && node.children.length > 0) {
          const nodeToDelete = node.children.find(child => child._id === nodeId);
          if (nodeToDelete) {
            deletedNode = nodeToDelete;
            parentNode = node;
          }
          
          return {
            ...node,
            children: node.children
              .filter(child => child._id !== nodeId)
              .map(child => findAndRemoveNode(child))
          };
        }
        return node;
      };
      
      return {
        ...prevMap,
        root: findAndRemoveNode(prevMap.root)
      };
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/delete-node`, {
        nationalId: user.nationalId,
        nodeId
      });

      if (!response.data.success) {
        throw new Error('Failed to delete node');
      }
    } catch (error) {
      console.error('Error deleting node:', error);
      message.error('เกิดข้อผิดพลาดในการลบหัวข้อ');
      
      // Restore deleted node on error
      if (deletedNode && parentNode) {
        setMindMap(prevMap => {
          const restoreNode = (node) => {
            if (node._id === parentNode._id) {
              return {
                ...node,
                children: [...node.children, deletedNode]
              };
            }
            if (node.children && node.children.length > 0) {
              return {
                ...node,
                children: node.children.map(restoreNode)
              };
            }
            return node;
          };
          
          return {
            ...prevMap,
            root: restoreNode(prevMap.root)
          };
        });
      }
    }
  };

  // Toggle node expansion with optimistic update
  const toggleNode = async (nodeId) => {
    // Optimistically update UI first
    setMindMap(prevMap => {
      const toggleNodeInTree = (node) => {
        if (node._id === nodeId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: node.children.map(toggleNodeInTree)
          };
        }
        return node;
      };
      
      return {
        ...prevMap,
        root: toggleNodeInTree(prevMap.root)
      };
    });

    // Then make API call in background
    try {
      await axios.post(`${API_BASE_URL}/toggle-node`, {
        nationalId: user.nationalId,
        nodeId
      });
    } catch (error) {
      console.error('Error toggling node:', error);
      // Revert the toggle on error
      setMindMap(prevMap => {
        const revertToggle = (node) => {
          if (node._id === nodeId) {
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: node.children.map(revertToggle)
            };
          }
          return node;
        };
        
        return {
          ...prevMap,
          root: revertToggle(prevMap.root)
        };
      });
      message.error('เกิดข้อผิดพลาดในการเปลี่ยนแปลงการแสดงผล');
    }
  };

  return (
    <PageContainer>
      <ContentContainer>
        <Title level={2} style={{ 
          textAlign: 'center', 
          marginBottom: 32,
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${COLORS.gradient.start}, ${COLORS.gradient.end})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '8px 0',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            background: `linear-gradient(135deg, ${COLORS.gradient.start}, ${COLORS.gradient.end})`,
            borderRadius: '2px'
          }
        }}>
          กิจกรรม "คิดแตกกิ่ง"
        </Title>

        <IntroCard>
          <Space direction="vertical" size={16}>
            <Title level={4} style={{ 
              marginBottom: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: COLORS.primary
            }}>
              วิธีการใช้งาน
              <InfoCircleOutlined style={{ fontSize: 20 }} />
            </Title>
            <Space style={{ width: '100%' }} direction="vertical" size={12}>
              <HelpText>
                • คลิกที่ปุ่ม <PlusOutlined style={{ color: COLORS.primary }} /> เพื่อเพิ่มหัวข้อย่อยใหม่
              </HelpText>
              <HelpText>
                • คลิกที่ปุ่ม <EditOutlined style={{ color: COLORS.primary }} /> เพื่อแก้ไขข้อความ
              </HelpText>
              <HelpText>
                • คลิกที่ปุ่ม <DeleteOutlined style={{ color: COLORS.warning }} /> เพื่อลบหัวข้อ (ยกเว้นหัวข้อหลัก)
              </HelpText>
              <HelpText>
                • คลิกที่ปุ่ม <ZoomInOutlined style={{ color: COLORS.primary }} />/<ZoomOutOutlined style={{ color: COLORS.primary }} /> เพื่อย่อ/ขยายหัวข้อย่อย
              </HelpText>
              <Text type="secondary" style={{ fontSize: '13px', marginTop: '8px' }}>
                ข้อมูลจะถูกบันทึกโดยอัตโนมัติเมื่อมีการเปลี่ยนแปลง
              </Text>
            </Space>
          </Space>
        </IntroCard>

        <StyledCard
          styles={{
            body: {
              padding: '32px 24px'
            }
          }}
        >
          <Node
            node={mindMap.root}
            level={0}
            onUpdate={updateNode}
            onDelete={deleteNode}
            onAddChild={addChild}
            onToggle={toggleNode}
          />
        </StyledCard>
        <div className="flex justify-center mt-8 mb-12">
          <ActionButton
            onClick={() => navigate('/activity-9')}
            className="primary"
            style={{
              fontSize: '1.1rem',
              height: '48px',
              padding: '0 36px',
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${COLORS.gradient.start}, ${COLORS.gradient.end})`,
              color: 'white',
              border: 'none',
            }}
          >
            ถัดไป
          </ActionButton>
        </div>
      </ContentContainer>
    </PageContainer>
  );
};

export default MindMapEditor;