// src/pages/MindMapEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, Typography, message, Tooltip, Select, ColorPicker, Input, InputNumber, Dropdown } from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    LineOutlined,
    BgColorsOutlined,
    FontColorsOutlined,
    FontSizeOutlined,
    BorderOutlined,
    CopyOutlined,
    LoadingOutlined,
    NodeIndexOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

// Constants
const SHAPES = {
    RECTANGLE: 'rectangle',
    ROUNDED: 'rounded',
    ELLIPSE: 'ellipse',
    DIAMOND: 'diamond',
    HEXAGON: 'hexagon',
    PARALLELOGRAM: 'parallelogram',
    OCTAGON: 'octagon'
};

const SHAPE_PREVIEWS = {
    [SHAPES.RECTANGLE]: `
      <svg viewBox="0 0 40 40" width="15" height="15" style="margin-top: 8px;">
        <rect x="5" y="5" width="30" height="30" fill="currentColor"/>
      </svg>
    `,
    [SHAPES.ROUNDED]: `
      <svg viewBox="0 0 40 40" width="15" height="15" style="margin-top: 8px;">
        <rect x="5" y="5" width="30" height="30" rx="6" ry="6" fill="currentColor"/>
      </svg>
    `,
    [SHAPES.ELLIPSE]: `
      <svg viewBox="0 0 40 40" width="15" height="15" style="margin-top: 8px;">
        <ellipse cx="20" cy="20" rx="15" ry="15" fill="currentColor"/>
      </svg>
    `,
    [SHAPES.DIAMOND]: `
      <svg viewBox="0 0 40 40" width="15" height="15" style="margin-top: 8px;">
        <path d="M20,5 L35,20 L20,35 L5,20 Z" fill="currentColor"/>
      </svg>
    `,
    [SHAPES.HEXAGON]: `
      <svg viewBox="0 0 40 40" width="15" height="15" style="margin-top: 8px;">
        <path d="M10,5 L30,5 L35,20 L30,35 L10,35 L5,20 Z" fill="currentColor"/>
      </svg>
    `,
    [SHAPES.PARALLELOGRAM]: `
      <svg viewBox="0 0 40 40" width="15" height="15" style="margin-top: 8px;">
        <path d="M10,5 L35,5 L30,35 L5,35 Z" fill="currentColor"/>
      </svg>
    `,
    [SHAPES.OCTAGON]: `
      <svg viewBox="0 0 40 40" width="15" height="15" style="margin-top: 8px;">
        <path d="M15,5 L25,5 L35,15 L35,25 L25,35 L15,35 L5,25 L5,15 Z" fill="currentColor"/>
      </svg>
    `
};

const CONNECTOR_TYPES = {
    STRAIGHT: 'straight',
    CURVED: 'curved',
    ANGLED: 'angled'
};

const ANCHOR_POINTS = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
};

const DEFAULT_COLORS = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fadb14', '#a0d911', '#fa541c'
];

// Styled Components
const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  height: 700px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
`;

const ToolbarWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    padding: 12px;
    justify-content: center;
  }

  // จัดกลุ่มของ tools ให้เป็นระเบียบ
  .tools-section {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }

    &:not(:last-child) {
      margin-right: 16px;
      padding-right: 16px;
      border-right: 1px solid #f0f0f0;

      @media (max-width: 768px) {
        margin-right: 0;
        padding-right: 0;
        border-right: none;
        padding-bottom: 12px;
        margin-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;
      }
    }
  }
`;

const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  background: ${props => props.active ? '#f0f7ff' : '#f5f5f5'};
  border: 1px solid ${props => props.active ? '#91caff' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    border-color: #91caff;
    background: #f0f7ff;
  }

  // กำหนดความกว้างขั้นต่ำเพื่อความสวยงาม
  min-width: ${props => props.fullWidth ? '100%' : 'auto'};

  @media (max-width: 768px) {
    flex: ${props => props.fullWidth ? '1 1 100%' : '0 1 auto'};
  }
`;

const ToolLabel = styled.span`
  color: #555;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  .anticon {
    font-size: 16px;
  }
`;

const ToolDivider = styled.div`
  width: 1px;
  height: 24px;
  background: #f0f0f0;
  margin: 0 8px;
`;


const ResizeHandle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border: 2px solid #1890ff;
  border-radius: 50%;
  z-index: 2;

  &:hover {
    background: #1890ff;
  }
`;

const AnchorPoint = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border: 2px solid #1890ff;
  border-radius: 50%;
  z-index: 3;
  cursor: pointer;

  &:hover {
    background: #1890ff;
    transform: scale(1.2);
  }

  &.active {
    background: #1890ff;
  }
`;

const Topic = styled.div`
  position: absolute;
  min-width: 100px;
  min-height: 40px;
  cursor: move;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s;

  &.multi-selected {
        outline: 2px dashed #1890ff;
        outline-offset: 2px;
    }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

    &.selected {
        outline: 2px solid #1890ff;
        outline-offset: 2px;
    }
`;

const TopicContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  textarea {
    width: 100%;
    height: 100%;
    resize: none;
    text-align: center;
    line-height: 1.5;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Connection = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const ConnectionLine = styled.path`
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    stroke-width: 3;
  }
`;

const PreviewLine = styled.path`
  pointer-events: none;
  stroke-dasharray: 4;
  animation: dash 1s linear infinite;
  
  @keyframes dash {
    to {
      stroke-dashoffset: -8;
    }
  }
`;

const ConnectionControls = styled.div`
  position: absolute;
  background: white;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 4px;
`;

// Shape path generator
const getShapePath = (shape, width, height) => {
    switch (shape) {
        case SHAPES.RECTANGLE:
            return `M0,0 h${width} v${height} h-${width}z`;

        case SHAPES.ROUNDED:
            const radius = Math.min(width, height) * 0.2;
            return `
          M ${radius},0
          h ${width - 2 * radius}
          a ${radius},${radius} 0 0 1 ${radius},${radius}
          v ${height - 2 * radius}
          a ${radius},${radius} 0 0 1 -${radius},${radius}
          h -${width - 2 * radius}
          a ${radius},${radius} 0 0 1 -${radius},-${radius}
          v -${height - 2 * radius}
          a ${radius},${radius} 0 0 1 ${radius},-${radius}
        `;

        case SHAPES.ELLIPSE:
            return `
          M ${width / 2},0
          a ${width / 2},${height / 2} 0 1,0 0,${height}
          a ${width / 2},${height / 2} 0 1,0 0,-${height}
        `;

        case SHAPES.DIAMOND:
            return `
          M ${width / 2},0
          L ${width},${height / 2}
          L ${width / 2},${height}
          L 0,${height / 2} Z
        `;

        case SHAPES.HEXAGON:
            const side = width * 0.2;
            return `
          M ${side},0
          h ${width - 2 * side}
          l ${side},${height / 2}
          l -${side},${height / 2}
          h -${width - 2 * side}
          l -${side},-${height / 2}
          l ${side},-${height / 2}
        `;

        case SHAPES.PARALLELOGRAM:
            const offset = width * 0.2;
            return `
          M ${offset},0
          h ${width - offset}
          l -${offset},${height}
          h -${width - offset}
          Z
        `;

        case SHAPES.OCTAGON:
            const oct = Math.min(width, height) * 0.29;
            return `
          M ${oct},0
          h ${width - 2 * oct}
          l ${oct},${oct}
          v ${height - 2 * oct}
          l -${oct},${oct}
          h -${width - 2 * oct}
          l -${oct},-${oct}
          v -${height - 2 * oct}
          Z
        `;

        default:
            return `M0,0 h${width} v${height} h-${width}z`;
    }
};

// Main component
export default function MindMapEditor() {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
    const [currentShape, setCurrentShape] = useState(SHAPES.ROUNDED);
    const [currentColor, setCurrentColor] = useState(DEFAULT_COLORS[0]);
    const [connections, setConnections] = useState([]);
    const [connectingFrom, setConnectingFrom] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [connectorType, setConnectorType] = useState(CONNECTOR_TYPES.CURVED);
    const [connectionControls, setConnectionControls] = useState({ visible: false, x: 0, y: 0 });
    const editorRef = useRef(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState(new Set());
    const [selectionBox, setSelectionBox] = useState(null);
    const [selectionStart, setSelectionStart] = useState(null);


    // Fetch existing mindmap data when component mounts
    useEffect(() => {
        const fetchMindMap = async () => {
            if (!user?.nationalId) return;

            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/mindmap/${user.nationalId}`);
                if (response.data) {
                    setTopics(response.data.topics || []);
                    setConnections(response.data.connections || []);
                }
            } catch (error) {
                console.error('Error fetching mindmap:', error);
                message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };

        fetchMindMap();
    }, [user?.nationalId]);

    // Add save function
    const saveMindMap = async () => {
        if (!user?.nationalId) {
            message.error('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
            return;
        }

        setSaving(true);
        try {
            await axios.post('http://localhost:5000/api/mindmap/save', {
                nationalId: user.nationalId,
                topics,
                connections
            });
            message.success('บันทึกข้อมูลสำเร็จ');
        } catch (error) {
            console.error('Error saving mindmap:', error);
            message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    const addTopic = () => {
        const newTopic = {
            id: Date.now(),
            text: 'หัวข้อใหม่',
            x: 100,
            y: 100,
            shape: currentShape,
            color: currentColor,
            width: 150,
            height: 60,
            fontSize: 14,
            fontColor: '#ffffff',
        };
        setTopics([...topics, newTopic]);
    };

    const cloneTopic = (topic) => {
        const offset = 20; // ระยะห่างจากรูปทรงต้นฉบับ
        const newTopic = {
            ...topic,
            id: Date.now(),
            x: topic.x + offset,
            y: topic.y + offset,
            text: `${topic.text}`
        };
        setTopics([...topics, newTopic]);
        setSelectedTopic(newTopic);
    };

    const updateTopic = (id, updates) => {
        setTopics(topics.map(topic =>
            topic.id === id ? { ...topic, ...updates } : topic
        ));
    };

    const deleteTopic = (id) => {
        setTopics(topics.filter(topic => topic.id !== id));
        setConnections(connections.filter(conn =>
            conn.from !== id && conn.to !== id
        ));
        setSelectedTopic(null);
    };

    const startConnection = (topic, anchorPoint) => {
        const point = getAnchorPoint(topic, anchorPoint);
        setConnectingFrom({
            topic,
            anchor: anchorPoint,
            point
        });
    };

    const completeConnection = (topic, anchorPoint) => {
        if (connectingFrom && connectingFrom.topic.id !== topic.id) {
            const newConnection = {
                id: Date.now(),
                from: connectingFrom.topic.id,
                fromAnchor: connectingFrom.anchor,
                to: topic.id,
                toAnchor: anchorPoint,
                type: connectorType,
                color: currentColor,
            };
            setConnections([...connections, newConnection]);
        }
        setConnectingFrom(null);
    };

    const deleteConnection = (connectionId) => {
        setConnections(connections.filter(conn => conn.id !== connectionId));
        setSelectedConnection(null);
        setConnectionControls({ visible: false });
    };

    const updateConnection = (connectionId, updates) => {
        setConnections(connections.map(conn =>
            conn.id === connectionId ? { ...conn, ...updates } : conn
        ));
    };

    const handleConnectionClick = (e, connection) => {
        e.stopPropagation();
        setSelectedConnection(connection);
        setSelectedTopic(null);
        const rect = editorRef.current.getBoundingClientRect();
        setConnectionControls({
            visible: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // เพิ่มฟังก์ชันจัดการการเลือก
    const handleSelectionStart = (e) => {
        if (e.target === editorRef.current) {
            const rect = editorRef.current.getBoundingClientRect();
            const start = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            setSelectionStart(start);
            setSelectionBox({
                left: start.x,
                top: start.y,
                width: 0,
                height: 0
            });
            // ถ้าไม่กด Shift ให้ยกเลิกการเลือกทั้งหมด
            if (!e.shiftKey) {
                setSelectedTopics(new Set());
                setSelectedTopic(null);
            }
        }
    };

    const handleSelectionMove = (e) => {
        if (selectionStart) {
            const rect = editorRef.current.getBoundingClientRect();
            const current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            const left = Math.min(selectionStart.x, current.x);
            const top = Math.min(selectionStart.y, current.y);
            const width = Math.abs(current.x - selectionStart.x);
            const height = Math.abs(current.y - selectionStart.y);

            setSelectionBox({ left, top, width, height });

            // ตรวจสอบว่าองค์ประกอบใดอยู่ในกรอบการเลือก
            const newSelectedTopics = new Set(e.shiftKey ? Array.from(selectedTopics) : []);
            topics.forEach(topic => {
                const topicRight = topic.x + topic.width;
                const topicBottom = topic.y + topic.height;

                if (topic.x < (left + width) &&
                    topicRight > left &&
                    topic.y < (top + height) &&
                    topicBottom > top) {
                    newSelectedTopics.add(topic.id);
                }
            });
            setSelectedTopics(newSelectedTopics);
        }
    };

    const handleSelectionEnd = () => {
        setSelectionStart(null);
        setSelectionBox(null);
    };

    // ปรับปรุงการจัดการ drag สำหรับหลายองค์ประกอบ
    const [dragOffsets, setDragOffsets] = useState(new Map());

    const handleDragStart = (e, topic) => {
        if (connectingFrom) return;

        e.stopPropagation();
        setIsDragging(true);

        const rect = editorRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // เพิ่มองค์ประกอบปัจจุบันในการเลือกถ้ายังไม่ได้เลือก
        if (!selectedTopics.has(topic.id)) {
            if (!e.shiftKey) {
                setSelectedTopics(new Set([topic.id]));
            } else {
                const newSelection = new Set(selectedTopics);
                newSelection.add(topic.id);
                setSelectedTopics(newSelection);
            }
        }

        // คำนวณ offset สำหรับทุกองค์ประกอบที่ถูกเลือก
        const newDragOffsets = new Map();
        topics.forEach(t => {
            if (selectedTopics.has(t.id)) {
                newDragOffsets.set(t.id, {
                    x: mouseX - t.x,
                    y: mouseY - t.y
                });
            }
        });
        setDragOffsets(newDragOffsets);
    };

    const handleDrag = (e) => {
        if (isDragging && selectedTopics.size > 0) {
            const rect = editorRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // อัพเดทตำแหน่งของทุกองค์ประกอบที่ถูกเลือก
            const updatedTopics = topics.map(topic => {
                if (selectedTopics.has(topic.id)) {
                    const offset = dragOffsets.get(topic.id);
                    return {
                        ...topic,
                        x: mouseX - offset.x,
                        y: mouseY - offset.y
                    };
                }
                return topic;
            });

            setTopics(updatedTopics);
        }
    };

    const handleResizeStart = (e, handle) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: selectedTopic.width,
            height: selectedTopic.height
        });
    };

    const handleMouseMove = (e) => {
        const container = editorRef.current.getBoundingClientRect();
        const x = e.clientX - container.left;
        const y = e.clientY - container.top;
        setMousePosition({ x, y });

        if (isDragging && selectedTopic) {
            updateTopic(selectedTopic.id, {
                x: x - dragOffset.x,
                y: y - dragOffset.y
            });
        } else if (isResizing && selectedTopic) {
            const dx = e.clientX - resizeStart.x;
            const dy = e.clientY - resizeStart.y;
            const newWidth = Math.max(100, resizeStart.width + dx);
            const newHeight = Math.max(40, resizeStart.height + dy);
            updateTopic(selectedTopic.id, {
                width: newWidth,
                height: newHeight
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const handleContainerClick = (e) => {
        if (e.target === editorRef.current) {
            setSelectedTopic(null);
            setSelectedConnection(null);
            setConnectionControls({ visible: false });
        }
    };

    const getAnchorPoint = (topic, anchor) => {
        switch (anchor) {
            case ANCHOR_POINTS.TOP:
                return { x: topic.x + topic.width / 2, y: topic.y };
            case ANCHOR_POINTS.RIGHT:
                return { x: topic.x + topic.width, y: topic.y + topic.height / 2 };
            case ANCHOR_POINTS.BOTTOM:
                return { x: topic.x + topic.width / 2, y: topic.y + topic.height };
            case ANCHOR_POINTS.LEFT:
                return { x: topic.x, y: topic.y + topic.height / 2 };
            default:
                return { x: topic.x + topic.width / 2, y: topic.y + topic.height / 2 };
        }
    };

    const getConnectorPath = (start, end, type = connectorType) => {
        switch (type) {
            case CONNECTOR_TYPES.STRAIGHT:
                return `M ${start.x},${start.y} L ${end.x},${end.y}`;

            case CONNECTOR_TYPES.CURVED:
                const midX = (start.x + end.x) / 2;
                return `M ${start.x},${start.y} C ${midX},${start.y} ${midX},${end.y} ${end.x},${end.y}`;

            case CONNECTOR_TYPES.ANGLED:
                const midY = (start.y + end.y) / 2;
                return `M ${start.x},${start.y} L ${start.x},${midY} L ${end.x},${midY} L ${end.x},${end.y}`;

            default:
                return '';
        }
    };

    const ShapeOption = styled.div`
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    
      &:hover {
        background-color: #f5f5f5;
      }
    
      svg {
        color: #666;
      }
    
      &:hover svg {
        color: #1890ff;
      }
    `;

    // Custom shape selector component with SVG previews and labels
    const ShapeSelector = ({ value, onChange }) => (
        <Select
            value={value}
            onChange={onChange}
            style={{ width: 180 }}
            dropdownRender={menu => (
                <div style={{ cursor: 'pointer' }}>
                    {Object.entries(SHAPES).map(([key, value]) => (
                        <ShapeOption
                            key={key}
                            onClick={() => onChange(value)}
                            style={{
                                backgroundColor: currentShape === value ? '#e6f7ff' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px 12px',
                                cursor: 'pointer'  // เพิ่ม cursor pointer
                            }}
                            className="shape-option" // เพิ่ม class สำหรับ styling
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: SHAPE_PREVIEWS[value].replace('currentColor', currentColor)
                                }}
                                style={{ cursor: 'pointer' }} // เพิ่ม cursor pointer ที่ไอคอน
                            />
                            <span style={{
                                marginLeft: '8px',
                                cursor: 'pointer'  // เพิ่ม cursor pointer ที่ข้อความ
                            }}>
                                {key === 'RECTANGLE' ? 'สี่เหลี่ยม' :
                                    key === 'ROUNDED' ? 'สี่เหลี่ยมมน' :
                                        key === 'ELLIPSE' ? 'วงกลม/วงรี' :
                                            key === 'DIAMOND' ? 'เพชร' :
                                                key === 'HEXAGON' ? 'หกเหลี่ยม' :
                                                    key === 'PARALLELOGRAM' ? 'สี่เหลี่ยมด้านขนาน' :
                                                        key === 'OCTAGON' ? 'แปดเหลี่ยม' : key}
                            </span>
                        </ShapeOption>
                    ))}
                </div>
            )}
        >
            {Object.entries(SHAPES).map(([key, value]) => (
                <Select.Option
                    key={value}
                    value={value}
                    style={{ cursor: 'pointer' }} // เพิ่ม cursor pointer
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer' // เพิ่ม cursor pointer
                    }}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: SHAPE_PREVIEWS[value].replace('currentColor', currentColor)
                            }}
                            style={{ cursor: 'pointer' }} // เพิ่ม cursor pointer
                        />
                        <span style={{ cursor: 'pointer' }}> {/* เพิ่ม cursor pointer */}
                            {key === 'RECTANGLE' ? 'สี่เหลี่ยม' :
                                key === 'ROUNDED' ? 'สี่เหลี่ยมมน' :
                                    key === 'ELLIPSE' ? 'วงกลม/วงรี' :
                                        key === 'DIAMOND' ? 'เพชร' :
                                            key === 'HEXAGON' ? 'หกเหลี่ยม' :
                                                key === 'PARALLELOGRAM' ? 'สี่เหลี่ยมด้านขนาน' :
                                                    key === 'OCTAGON' ? 'แปดเหลี่ยม' : key}
                        </span>
                    </div>
                </Select.Option>
            ))}
        </Select>
    );

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Mind Mapping Magic : เสริมพลังสมองด้วยแผนภาพความคิด
                {loading && <LoadingOutlined style={{ marginLeft: 8 }} />}
            </Title>

            <StyledCard>
                <ToolbarWrapper>
                    {/* Section 1: Main Actions */}
                    <div className="tools-section">
                        <ToolGroup>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={addTopic}
                                size="middle"
                            >
                                เพิ่มรูปทรง
                            </Button>
                            <Button
                                type="primary"
                                icon={saving ? <LoadingOutlined /> : <SaveOutlined />}
                                onClick={saveMindMap}
                                loading={saving}
                            >
                                บันทึก
                            </Button>
                        </ToolGroup>
                    </div>

                    {/* Section 2: Shape and Line Controls */}
                    <div className="tools-section">
                        <ToolGroup>
                            <ToolLabel>
                                <BorderOutlined /> รูปทรง
                            </ToolLabel>
                            <ShapeSelector
                                value={currentShape}
                                onChange={setCurrentShape}
                            />
                        </ToolGroup>

                        <ToolGroup>
                            <ToolLabel>
                                <NodeIndexOutlined /> เส้น
                            </ToolLabel>
                            <Select
                                value={connectorType}
                                onChange={setConnectorType}
                                style={{ width: 120 }}
                                size="middle"
                                options={[
                                    { value: CONNECTOR_TYPES.STRAIGHT, label: 'เส้นตรง' },
                                    { value: CONNECTOR_TYPES.CURVED, label: 'เส้นโค้ง' },
                                    { value: CONNECTOR_TYPES.ANGLED, label: 'เส้นหักมุม' }
                                ]}
                            />
                        </ToolGroup>
                    </div>

                    {/* Section 3: Color Controls */}
                    <div className="tools-section">
                        <ToolGroup active={!!selectedTopic}>
                            <Tooltip title="สีพื้นหลัง">
                                <ToolLabel>
                                    <BgColorsOutlined />
                                </ToolLabel>
                            </Tooltip>
                            <ColorPicker
                                value={currentColor}
                                onChange={(color) => {
                                    const hexColor = color.toHexString();
                                    setCurrentColor(hexColor);
                                    if (selectedTopic) {
                                        updateTopic(selectedTopic.id, { color: hexColor });
                                    }
                                }}
                                presets={[{ label: 'สีพื้นฐาน', colors: DEFAULT_COLORS }]}
                            />
                        </ToolGroup>

                        <ToolGroup active={!!selectedTopic}>
                            <Tooltip title="สีตัวอักษร">
                                <ToolLabel>
                                    <FontColorsOutlined />
                                </ToolLabel>
                            </Tooltip>
                            <ColorPicker
                                value={selectedTopic?.fontColor || '#ffffff'}
                                onChange={(color) => {
                                    const hexColor = color.toHexString();
                                    if (selectedTopic) {
                                        updateTopic(selectedTopic.id, { fontColor: hexColor });
                                    }
                                }}
                                presets={[{
                                    label: 'สีพื้นฐาน',
                                    colors: ['#ffffff', '#000000', ...DEFAULT_COLORS]
                                }]}
                                disabled={!selectedTopic}
                            />
                        </ToolGroup>

                        <ToolGroup active={!!selectedTopic}>
                            <Tooltip title="ขนาดตัวอักษร">
                                <ToolLabel>
                                    <FontSizeOutlined />
                                </ToolLabel>
                            </Tooltip>
                            <InputNumber
                                min={8}
                                max={72}
                                value={selectedTopic?.fontSize || 14}
                                onChange={(value) => {
                                    if (selectedTopic && value) {
                                        updateTopic(selectedTopic.id, { fontSize: value });
                                    }
                                }}
                                style={{ width: 70 }}
                                size="middle"
                                disabled={!selectedTopic}
                            />
                        </ToolGroup>

                        <ToolGroup active={!!selectedConnection}>
                            <Tooltip title="สีเส้นเชื่อม">
                                <ToolLabel>
                                    <LineOutlined />
                                </ToolLabel>
                            </Tooltip>
                            <ColorPicker
                                value={selectedConnection?.color || currentColor}
                                onChange={(color) => {
                                    const hexColor = color.toHexString();
                                    if (selectedConnection) {
                                        updateConnection(selectedConnection.id, { color: hexColor });
                                    }
                                    setCurrentColor(hexColor);
                                }}
                                presets={[{ label: 'สีพื้นฐาน', colors: DEFAULT_COLORS }]}
                                disabled={!selectedConnection}
                            />
                        </ToolGroup>
                    </div>
                </ToolbarWrapper>


                <EditorContainer
                    ref={editorRef}
                    onMouseDown={handleSelectionStart}
                    onMouseMove={(e) => {
                        const rect = editorRef.current.getBoundingClientRect();
                        const mousePosition = {
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top
                        };
                        setMousePosition(mousePosition);

                        if (selectionStart) {
                            handleSelectionMove(e);
                        } else if (isDragging) {
                            handleDrag(e);
                        } else if (isResizing && selectedTopic) {
                            const dx = e.clientX - resizeStart.x;
                            const dy = e.clientY - resizeStart.y;
                            const newWidth = Math.max(100, resizeStart.width + dx);
                            const newHeight = Math.max(40, resizeStart.height + dy);
                            updateTopic(selectedTopic.id, {
                                width: newWidth,
                                height: newHeight
                            });
                        }
                    }}
                    onMouseUp={() => {
                        handleSelectionEnd();
                        setIsDragging(false);
                        setIsResizing(false);
                    }}
                    onMouseLeave={() => {
                        handleSelectionEnd();
                        setIsDragging(false);
                        setIsResizing(false);
                    }}
                    onClick={handleContainerClick}
                >
                    {/* Selection Box */}
                    {selectionBox && (
                        <div
                            style={{
                                position: 'absolute',
                                left: selectionBox.left,
                                top: selectionBox.top,
                                width: selectionBox.width,
                                height: selectionBox.height,
                                border: '1px solid #1890ff',
                                background: 'rgba(24, 144, 255, 0.1)',
                                pointerEvents: 'none',
                                zIndex: 1
                            }}
                        />
                    )}

                    {/* Connections Layer */}
                    <Connection>
                        {connections.map(connection => {
                            const fromTopic = topics.find(t => t.id === connection.from);
                            const toTopic = topics.find(t => t.id === connection.to);
                            if (!fromTopic || !toTopic) return null;

                            const start = getAnchorPoint(fromTopic, connection.fromAnchor);
                            const end = getAnchorPoint(toTopic, connection.toAnchor);

                            return (
                                <g key={connection.id}>
                                    <ConnectionLine
                                        d={getConnectorPath(start, end, connection.type)}
                                        stroke={connection.color || currentColor}
                                        strokeWidth={selectedConnection?.id === connection.id ? "3" : "2"}
                                        fill="none"
                                        onClick={(e) => handleConnectionClick(e, connection)}
                                    />
                                </g>
                            );
                        })}

                        {connectingFrom && (
                            <PreviewLine
                                d={getConnectorPath(connectingFrom.point, mousePosition)}
                                stroke={currentColor}
                                strokeWidth="2"
                                fill="none"
                            />
                        )}
                    </Connection>

                    {/* Connection Controls */}
                    {connectionControls.visible && (
                        <ConnectionControls
                            style={{
                                left: connectionControls.x,
                                top: connectionControls.y,
                                zIndex: 2
                            }}
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => deleteConnection(selectedConnection.id)}
                            />
                        </ConnectionControls>
                    )}

                    {/* Topics Layer */}
                    {topics.map(topic => (
                        <Topic
                            key={topic.id}
                            style={{
                                left: topic.x,
                                top: topic.y,
                                width: topic.width,
                                height: topic.height,
                                zIndex: selectedTopics.has(topic.id) ? 3 : 1
                            }}
                            className={`
                ${selectedTopics.has(topic.id) ? 'multi-selected' : ''}
                ${selectedTopic?.id === topic.id ? 'selected' : ''}
            `}
                            onMouseDown={(e) => handleDragStart(e, topic)}
                        >
                            <svg
                                width="100%"
                                height="100%"
                                style={{ position: 'absolute', top: 0, left: 0 }}
                            >
                                <path
                                    d={getShapePath(topic.shape, topic.width, topic.height)}
                                    fill={topic.color}
                                    opacity={0.8}
                                />
                            </svg>

                            {/* Anchor Points */}
                            {(selectedTopic?.id === topic.id || selectedTopics.has(topic.id) || connectingFrom) &&
                                Object.values(ANCHOR_POINTS).map(anchor => {
                                    const relativeX = anchor === ANCHOR_POINTS.LEFT ? -5 :
                                        anchor === ANCHOR_POINTS.RIGHT ? topic.width - 5 :
                                            topic.width / 2 - 5;
                                    const relativeY = anchor === ANCHOR_POINTS.TOP ? -5 :
                                        anchor === ANCHOR_POINTS.BOTTOM ? topic.height - 5 :
                                            topic.height / 2 - 5;
                                    return (
                                        <AnchorPoint
                                            key={anchor}
                                            className={connectingFrom?.topic.id === topic.id &&
                                                connectingFrom?.anchor === anchor ? 'active' : ''}
                                            style={{
                                                left: relativeX,
                                                top: relativeY
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!connectingFrom) {
                                                    startConnection(topic, anchor);
                                                } else {
                                                    completeConnection(topic, anchor);
                                                }
                                            }}
                                        />
                                    );
                                })}

                            {/* Resize Handle */}
                            {selectedTopic?.id === topic.id && (
                                <>
                                    <ResizeHandle
                                        style={{ bottom: -4, right: -4, cursor: 'se-resize' }}
                                        onMouseDown={(e) => handleResizeStart(e, 'se')}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: -30,
                                        right: -10,
                                        display: 'flex',
                                        gap: '0px',
                                        zIndex: 4
                                    }}>
                                        <Button
                                            type="text"
                                            size="mid"
                                            icon={<CopyOutlined />}
                                            style={{
                                                color: '#1890ff'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                cloneTopic(topic);
                                            }}
                                        />
                                        <Button
                                            type="text"
                                            size="mid"
                                            icon={<DeleteOutlined />}
                                            style={{
                                                color: '#ff4d4f'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteTopic(topic.id);
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Topic Content */}
                            <TopicContent>
                                <Input.TextArea
                                    value={topic.text}
                                    onChange={(e) => {
                                        const textarea = e.target;
                                        textarea.style.height = 'auto';
                                        textarea.style.height = `${textarea.scrollHeight}px`;
                                        updateTopic(topic.id, { text: e.target.value });
                                    }}
                                    onFocus={() => {
                                        setSelectedTopic(topic);
                                        if (!selectedTopics.has(topic.id)) {
                                            const newSelection = new Set([topic.id]);
                                            setSelectedTopics(newSelection);
                                        }
                                    }}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{
                                        textAlign: 'center',
                                        background: 'transparent',
                                        color: topic.fontColor,
                                        fontSize: topic.fontSize,
                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0',
                                        border: 'none',
                                        boxShadow: 'none',
                                        resize: 'none',
                                        zIndex: 2
                                    }}
                                />
                            </TopicContent>
                        </Topic>
                    ))}

                    {/* Loading Overlay */}
                    {(loading || saving) && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(255, 255, 255, 0.8)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000
                            }}
                        >
                            <Space direction="vertical" align="center">
                                <LoadingOutlined style={{ fontSize: 24 }} />
                                <Typography.Text>
                                    {loading ? 'กำลังโหลดข้อมูล...' : 'กำลังบันทึกข้อมูล...'}
                                </Typography.Text>
                            </Space>
                        </div>
                    )}
                </EditorContainer>
            </StyledCard>


            {(loading || saving) && (
                <div
                    style={{
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
                    }}
                >
                    <Space direction="vertical" align="center">
                        <LoadingOutlined style={{ fontSize: 24 }} />
                        <Typography.Text>{loading ? 'กำลังโหลดข้อมูล...' : 'กำลังบันทึกข้อมูล...'}</Typography.Text>
                    </Space>
                </div>
            )}
        </div>
    );
}