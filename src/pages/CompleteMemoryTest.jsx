import React, { useState, useEffect } from "react";
import {
  Card,
  Space,
  Typography,
  Button,
  message,
  Row,
  Col,
  Input,
} from "antd";
import { ClockCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import confetti from "canvas-confetti";

const { Title, Text } = Typography;

// ข้อมูลสำหรับการทดสอบและเกม
const TEST_DATA = {
  // คำศัพท์สำหรับทดสอบความจำ
  memoryWords: [
    // อาหาร
    "ผัดไทย",
    "ส้มตำ",
    "ต้มยำ",
    "แกงเขียวหวาน",
    "ขนมจีน",
    "ข้าวมันไก่",
    "กระเพรา",
    "ลาบ",
    "น้ำพริก",
    "ยำวุ้นเส้น",
    // ผลไม้
    "ทุเรียน",
    "มะม่วง",
    "มะพร้าว",
    "ส้มโอ",
    "มังคุด",
    "ลำไย",
    "ลิ้นจี่",
    "เงาะ",
    "กล้วย",
    "สับปะรด",
    // สัตว์
    "ช้าง",
    "เสือ",
    "ลิง",
    "นก",
    "ปลา",
    "กระต่าย",
    "แมว",
    "สิงโต",
    "กวาง",
    "หมี",
    // สถานที่
    "วัด",
    "ตลาด",
    "โรงเรียน",
    "สวน",
    "ทะเล",
    "ภูเขา",
    "น้ำตก",
    "สนามหลวง",
    "พิพิธภัณฑ์",
    "อุทยาน",
    // สิ่งของ
    "ร่ม",
    "พัด",
    "กระเป๋า",
    "รองเท้า",
    "หมวก",
    "แก้วน้ำ",
    "จาน",
    "ช้อน",
    "โต๊ะ",
    "เก้าอี้",
  ],

  // รูปทรงและสี
  shapes: [
    "สามเหลี่ยม",
    "สี่เหลี่ยม",
    "วงกลม",
    "ดาว",
    "หกเหลี่ยม",
    "สี่เหลี่ยมขนมเปียกปูน",
    "ครึ่งวงกลม",
    "ห้าเหลี่ยม",
    "วงรี",
    "สามเหลี่ยมมุมฉาก",
  ],

  colors: [
    "แดง",
    "เขียว",
    "น้ำเงิน",
    "เหลือง",
    "ม่วง",
    "ส้ม",
    "ชมพู",
    "น้ำตาล",
    "เทา",
    "ดำ",
  ],

  // items สำหรับการนับจำนวน (emoji)
  countingItems: ["🍎", "🌟", "🎈", "🐶", "🌺", "🎨", "🎭", "🎪", "🎯", "🎲"],

  // คำถามเกี่ยวกับสัตว์
  animalQuestions: [
    // สัตว์
    {
      question: "สัตว์ชนิดใดเป็นสัตว์บก?",
      answers: ["ช้าง", "ปลาวาฬ", "นกเพนกวิน", "แมวน้ำ"],
      correct: "ช้าง",
    },
    {
      question: "สัตว์ชนิดใดเป็นสัตว์ปีก?",
      answers: ["งู", "นก", "จิ้งจก", "กบ"],
      correct: "นก",
    },
    {
      question: "สัตว์ชนิดใดเป็นสัตว์น้ำ?",
      answers: ["ปลา", "แมว", "ไก่", "หมู"],
      correct: "ปลา",
    },
    {
      question: "สัตว์ชนิดใดกินพืชเป็นอาหาร?",
      answers: ["เสือ", "กระต่าย", "จระเข้", "แมว"],
      correct: "กระต่าย",
    },
    {
      question: "สัตว์ใดมีงวง?",
      answers: ["ช้าง", "ม้า", "วัว", "ควาย"],
      correct: "ช้าง",
    },
    {
      question: "สัตว์ชนิดใดมีปีก?",
      answers: ["เป็ด", "หมู", "แมว", "วัว"],
      correct: "เป็ด",
    },
    {
      question: "สัตว์ใดอาศัยอยู่ในน้ำ?",
      answers: ["ปลาโลมา", "สิงโต", "ไก่", "แมว"],
      correct: "ปลาโลมา",
    },
    {
      question: "สัตว์ใดมีเขา?",
      answers: ["กวาง", "หมู", "ช้าง", "เสือ"],
      correct: "กวาง",
    },
    {
      question: "สัตว์ใดชอบกินกล้วย?",
      answers: ["ลิง", "เสือ", "สิงโต", "จระเข้"],
      correct: "ลิง",
    },
    {
      question: "สัตว์ใดออกลูกเป็นไข่?",
      answers: ["เต่า", "แมว", "ช้าง", "ม้า"],
      correct: "เต่า",
    },

    // ผลไม้
    {
      question: "ผลไม้ใดมีหนาม?",
      answers: ["ทุเรียน", "มะม่วง", "ส้ม", "แตงโม"],
      correct: "ทุเรียน",
    },
    {
      question: "ผลไม้ใดมีสีเหลือง?",
      answers: ["กล้วย", "มะม่วง", "แอปเปิ้ล", "องุ่น"],
      correct: "กล้วย",
    },
    {
      question: "ผลไม้ใดมีรสเปรี้ยว?",
      answers: ["มะนาว", "ทุเรียน", "มะพร้าว", "ขนุน"],
      correct: "มะนาว",
    },
    {
      question: "ผลไม้ใดเป็นผลไม้เมืองหนาว?",
      answers: ["แอปเปิ้ล", "มะม่วง", "ทุเรียน", "มะละกอ"],
      correct: "แอปเปิ้ล",
    },
    {
      question: "ผลไม้ใดมีน้ำมาก?",
      answers: ["แตงโม", "ลำไย", "ลิ้นจี่", "มังคุด"],
      correct: "แตงโม",
    },

    // สี
    {
      question: "สีใดเป็นสีของท้องฟ้า?",
      answers: ["น้ำเงิน", "เขียว", "ชมพู", "ม่วง"],
      correct: "น้ำเงิน",
    },
    {
      question: "สีใดเป็นสีของใบไม้?",
      answers: ["เขียว", "แดง", "เหลือง", "ม่วง"],
      correct: "เขียว",
    },
    {
      question: "สีใดเป็นสีของพระอาทิตย์?",
      answers: ["เหลือง", "ฟ้า", "เขียว", "ม่วง"],
      correct: "เหลือง",
    },
    {
      question: "สีใดเป็นสีของกล้วยสุก?",
      answers: ["เหลือง", "เขียว", "แดง", "ม่วง"],
      correct: "เหลือง",
    },
    {
      question: "สีใดเป็นสีของเลือด?",
      answers: ["แดง", "น้ำเงิน", "เขียว", "เหลือง"],
      correct: "แดง",
    },

    // อาหาร
    {
      question: "อาหารใดเป็นของหวาน?",
      answers: ["ไอศกรีม", "ต้มยำ", "ผัดกะเพรา", "ส้มตำ"],
      correct: "ไอศกรีม",
    },
    {
      question: "อาหารใดทำจากข้าว?",
      answers: ["ข้าวผัด", "สปาเก็ตตี้", "พิซซ่า", "แฮมเบอร์เกอร์"],
      correct: "ข้าวผัด",
    },
    {
      question: "อาหารใดเป็นอาหารทะเล?",
      answers: ["กุ้ง", "ไก่", "หมู", "วัว"],
      correct: "กุ้ง",
    },
    {
      question: "อาหารใดมีรสเผ็ด?",
      answers: ["ต้มยำ", "ข้าวต้ม", "สลัด", "ขนมปัง"],
      correct: "ต้มยำ",
    },
    {
      question: "อาหารใดกินตอนเช้า?",
      answers: ["โจ๊ก", "ต้มยำ", "ส้มตำ", "ผัดกะเพรา"],
      correct: "โจ๊ก",
    },

    // พาหนะ
    {
      question: "พาหนะใดวิ่งบนราง?",
      answers: ["รถไฟ", "รถยนต์", "รถตู้", "รถเมล์"],
      correct: "รถไฟ",
    },
    {
      question: "พาหนะใดมีสองล้อ?",
      answers: ["จักรยาน", "รถยนต์", "รถบัส", "เรือ"],
      correct: "จักรยาน",
    },
    {
      question: "พาหนะใดใช้บินบนฟ้า?",
      answers: ["เครื่องบิน", "เรือ", "รถไฟ", "รถยนต์"],
      correct: "เครื่องบิน",
    },
    {
      question: "พาหนะใดแล่นในน้ำ?",
      answers: ["เรือ", "รถไฟ", "รถเมล์", "จักรยาน"],
      correct: "เรือ",
    },
    {
      question: "พาหนะใดใช้ไฟฟ้า?",
      answers: ["รถไฟฟ้า", "รถม้า", "จักรยาน", "เรือใบ"],
      correct: "รถไฟฟ้า",
    },

    // อาชีพ
    {
      question: "อาชีพใดรักษาคนป่วย?",
      answers: ["หมอ", "ครู", "ตำรวจ", "พ่อค้า"],
      correct: "หมอ",
    },
    {
      question: "อาชีพใดสอนหนังสือ?",
      answers: ["ครู", "หมอ", "ทหาร", "ชาวนา"],
      correct: "ครู",
    },
    {
      question: "อาชีพใดปลูกข้าว?",
      answers: ["ชาวนา", "ชาวประมง", "พ่อค้า", "หมอ"],
      correct: "ชาวนา",
    },
    {
      question: "อาชีพใดจับปลา?",
      answers: ["ชาวประมง", "ชาวนา", "ครู", "ทหาร"],
      correct: "ชาวประมง",
    },
    {
      question: "อาชีพใดขายของ?",
      answers: ["พ่อค้า", "หมอ", "ครู", "ทหาร"],
      correct: "พ่อค้า",
    },

    // กีฬา
    {
      question: "กีฬาใดใช้ลูกบอล?",
      answers: ["ฟุตบอล", "ว่ายน้ำ", "มวย", "วิ่ง"],
      correct: "ฟุตบอล",
    },
    {
      question: "กีฬาใดเล่นในน้ำ?",
      answers: ["ว่ายน้ำ", "วิ่ง", "บาสเกตบอล", "มวย"],
      correct: "ว่ายน้ำ",
    },
    {
      question: "กีฬาใดใช้ไม้ตี?",
      answers: ["เบสบอล", "ฟุตบอล", "วิ่ง", "มวย"],
      correct: "เบสบอล",
    },
    {
      question: "กีฬาใดใช้ตาข่าย?",
      answers: ["วอลเลย์บอล", "มวย", "วิ่ง", "ยูโด"],
      correct: "วอลเลย์บอล",
    },
    {
      question: "กีฬาใดเล่นบนสนามหญ้า?",
      answers: ["ฟุตบอล", "มวย", "ว่ายน้ำ", "ยูโด"],
      correct: "ฟุตบอล",
    },

    // สถานที่
    {
      question: "สถานที่ใดรักษาคนป่วย?",
      answers: ["โรงพยาบาล", "โรงเรียน", "ตลาด", "สวนสาธารณะ"],
      correct: "โรงพยาบาล",
    },
    {
      question: "สถานที่ใดซื้อของ?",
      answers: ["ตลาด", "วัด", "สวนสาธารณะ", "โรงพยาบาล"],
      correct: "ตลาด",
    },
    {
      question: "สถานที่ใดเรียนหนังสือ?",
      answers: ["โรงเรียน", "โรงพยาบาล", "ตลาด", "วัด"],
      correct: "โรงเรียน",
    },
    {
      question: "สถานที่ใดออกกำลังกาย?",
      answers: ["สวนสาธารณะ", "ตลาด", "โรงพยาบาล", "วัด"],
      correct: "สวนสาธารณะ",
    },
    {
      question: "สถานที่ใดทำบุญ?",
      answers: ["วัด", "ตลาด", "โรงเรียน", "โรงพยาบาล"],
      correct: "วัด",
    },

    // เครื่องใช้
    {
      question: "สิ่งใดใช้เขียน?",
      answers: ["ดินสอ", "จาน", "แก้วน้ำ", "หมอน"],
      correct: "ดินสอ",
    },
    {
      question: "สิ่งใดใช้นอน?",
      answers: ["เตียง", "โต๊ะ", "ตู้", "เก้าอี้"],
      correct: "เตียง",
    },
    {
      question: "สิ่งใดใช้กินข้าว?",
      answers: ["ช้อน", "กรรไกร", "ดินสอ", "ไม้บรรทัด"],
      correct: "ช้อน",
    },
    {
      question: "สิ่งใดใช้ตัด?",
      answers: ["กรรไกร", "ดินสอ", "ช้อน", "แก้วน้ำ"],
      correct: "กรรไกร",
    },
    {
      question: "สิ่งใดใช้ดื่มน้ำ?",
      answers: ["แก้วน้ำ", "จาน", "ช้อน", "ส้อม"],
      correct: "แก้วน้ำ",
    },
  ],
};

// Color map for ShapeDisplay
const COLOR_MAP = {
  แดง: "#ff4d4f",
  เขียว: "#52c41a",
  น้ำเงิน: "#1890ff",
  เหลือง: "#fadb14",
  ม่วง: "#722ed1",
  ส้ม: "#fa8c16",
  ชมพู: "#eb2f96",
  น้ำตาล: "#8b4513",
  เทา: "#8c8c8c",
  ดำ: "#000000",
};

// Shape styles for ShapeDisplay
const SHAPE_STYLES = {
  สามเหลี่ยม: "clip-path: polygon(50% 0%, 0% 100%, 100% 100%);",
  สี่เหลี่ยม: "border-radius: 0;",
  วงกลม: "border-radius: 50%;",
  ดาว: `clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);`,
  หกเหลี่ยม:
    "clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);",
  สี่เหลี่ยมขนมเปียกปูน: "transform: rotate(45deg);",
  ครึ่งวงกลม: "border-radius: 100px 100px 0 0;",
  ห้าเหลี่ยม:
    "clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);",
  วงรี: "border-radius: 50%; transform: scaleX(1.5);",
  สามเหลี่ยมมุมฉาก: "clip-path: polygon(0% 0%, 0% 100%, 100% 100%);",
};

// Color Constants
const COLORS = {
  primary: "#7c3aed", // สีม่วงเป็นสีหลัก
  secondary: "#a78bfa", // สีม่วงอ่อน
  background: "#7c3aed10", // สีพื้นหลังม่วงอ่อนมาก
  dark: "#1f2937", // สีเทาเข้ม
  light: "#f8fafc", // สีขาวนวล
  shadow: "rgba(17, 12, 46, 0.1)",
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.background}, white);
  padding: 40px 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      ${COLORS.background} 0%,
      transparent 70%
    );
    animation: rotate 60s linear infinite;
    z-index: -1;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: none;
  box-shadow: 0 4px 24px ${COLORS.shadow},
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
  transition: transform 0.3s ease;

  .ant-card-body {
    padding: 32px;
  }
`;

const Timer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  font-size: 18px;
  font-weight: bold;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${COLORS.primary};
  }
`;

const Score = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  font-size: 18px;
  font-weight: bold;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${COLORS.primary};
  }
`;

// ปรับปรุง styled components
const GameStats = styled.div`
  position: fixed;
  top: 80px;
  left: 20px;
  background: white;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 24px ${COLORS.shadow};
  font-size: 16px;
  z-index: 100;
  min-width: 200px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;

    &:first-child {
      border-bottom: 1px solid ${COLORS.background};
      padding-bottom: 12px;
    }

    &:last-child {
      padding-top: 12px;
    }

    .icon {
      color: ${COLORS.primary};
      font-size: 20px;
    }

    .label {
      color: ${COLORS.dark};
      opacity: 0.8;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .value {
      font-weight: bold;
      color: ${COLORS.dark};
      font-size: 16px;
    }

    .score {
      font-weight: bold;
      .correct {
        color: #52c41a;
      }
      .total {
        color: ${COLORS.dark};
        opacity: 0.6;
      }
    }
  }
`;

const AnswerButton = styled(Button)`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: ${COLORS.light};
  color: ${COLORS.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover:not([disabled]) {
    transform: translateY(-2px);
    background: white;
    border-color: ${COLORS.primary};
    color: ${COLORS.primary};
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
  }

  &:active:not([disabled]) {
    transform: translateY(0);
  }

  &.correct {
    background: linear-gradient(135deg, #52c41a, #389e0d);
    border-color: #52c41a;
    color: white;
    box-shadow: 0 4px 12px rgba(82, 196, 26, 0.2);

    &::after {
      content: "✓";
      margin-left: 8px;
      font-weight: bold;
    }
  }

  &.wrong {
    background: linear-gradient(135deg, #ff4d4f, #cf1322);
    border-color: #ff4d4f;
    color: white;
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.2);

    &::after {
      content: "✗";
      margin-left: 8px;
      font-weight: bold;
    }
  }

  &[disabled] {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const QuestionCard = styled(StyledCard)`
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary});
  }

  .stats-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: ${COLORS.background};
    border-radius: 12px;
    margin-bottom: 24px;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      position: relative;

      &:first-of-type::after {
        content: "";
        position: absolute;
        right: -10px;
        top: 50%;
        transform: translateY(-50%);
        width: 2px;
        height: 70%;
        background: rgba(124, 58, 237, 0.2);
      }

      .stat-label {
        font-size: 14px;
        color: ${COLORS.dark};
        opacity: 0.7;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: ${COLORS.primary};
        display: flex;
        align-items: baseline;
        gap: 2px;

        .total {
          font-size: 16px;
          opacity: 0.5;
        }
      }
    }
  }

  .question-header {
    text-align: center;
    margin-bottom: 32px;

    .question-text {
      font-size: 24px;
      color: ${COLORS.dark};
      font-weight: 600;
      margin: 0;
    }
  }

  .question-content {
    background: ${COLORS.background};
    padding: 32px;
    border-radius: 16px;
    margin: 24px 0;
    display: flex;
    justify-content: center;
    align-items: center;

    &.counting {
      font-size: 2.5rem;
      letter-spacing: 8px;
    }
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 16px 0;
  }
`;

const StyledInput = styled(Input)`
  height: 48px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.background};
  }
`;

const ActionButton = styled(Button)`
  min-width: 120px;
  height: 44px;
  border-radius: 8px;
  font-weight: 500;

  &.primary {
    background: ${COLORS.primary};
    border-color: ${COLORS.primary};
    color: white;

    &:hover {
      background: ${COLORS.secondary};
      border-color: ${COLORS.secondary};
    }
  }
`;

const AnswerResult = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${(props) =>
    props.isCorrect ? "rgba(82, 196, 26, 0.1)" : "rgba(255, 77, 79, 0.1)"};
  border: 1px solid ${(props) => (props.isCorrect ? "#b7eb8f" : "#ffa39e")};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;

  .number {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${(props) => (props.isCorrect ? "#52c41a" : "#ff4d4f")};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .answer-text {
    color: ${COLORS.dark};
    font-size: 16px;
  }
`;

const CorrectAnswersSection = styled.div`
  margin-top: 32px;
  padding: 24px;
  background: ${COLORS.background};
  border-radius: 12px;
  text-align: center;

  .title {
    color: ${COLORS.primary};
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .answers-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }

  .answer-item {
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 16px;
    color: ${COLORS.dark};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &.correct {
      background: #52c41a;
      color: white;
      box-shadow: 0 2px 8px rgba(82, 196, 26, 0.2);
    }
  }
`;

const SummaryCard = styled(StyledCard)`
  .summary-header {
    text-align: center;
    margin-bottom: 32px;

    .total-score {
      font-size: 48px;
      color: ${COLORS.primary};
      font-weight: bold;
      margin: 16px 0;

      .total {
        color: ${COLORS.dark};
        opacity: 0.5;
      }
    }
  }
`;

const ShapeDisplay = styled.div`
  width: 200px;
  height: 200px;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ shape, color }) => `
    background-color: ${COLOR_MAP[color]};
    ${SHAPE_STYLES[shape]}
  `}
`;

// Celebration Effects
const celebrateCorrect = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

const celebrateComplete = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff0000", "#00ff00", "#0000ff"],
    });

    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff0000", "#00ff00", "#0000ff"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

// Generate Questions
// Helper function สำหรับสุ่มตัวเลือกที่ไม่ซ้ำกัน
const generateUniqueOptions = (correctAnswer, possibleAnswers, count = 4) => {
  const options = new Set([correctAnswer]);
  const remaining = possibleAnswers.filter(
    (answer) => answer !== correctAnswer
  );

  while (options.size < count && remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    options.add(remaining[randomIndex]);
    remaining.splice(randomIndex, 1);
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
};

const generateQuestion = () => {
  const questionTypes = ["math", "counting", "shape", "color", "animal"];
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  switch (type) {
    case "math":
      const operations = ["+", "-", "×"];
      const op = operations[Math.floor(Math.random() * operations.length)];
      let num1, num2, answer;

      switch (op) {
        case "+":
          num1 = Math.floor(Math.random() * 20) + 1;
          num2 = Math.floor(Math.random() * 20) + 1;
          answer = num1 + num2;
          break;
        case "-":
          num1 = Math.floor(Math.random() * 20) + 10;
          num2 = Math.floor(Math.random() * num1);
          answer = num1 - num2;
          break;
        case "×":
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          answer = num1 * num2;
          break;
      }

      // สร้างตัวเลือกที่ไม่ซ้ำสำหรับคณิตศาสตร์
      const mathOptions = new Set([answer]);
      while (mathOptions.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        if (offset !== 0) {
          mathOptions.add(answer + offset);
        }
      }

      return {
        type: "math",
        question: `${num1} ${op} ${num2} = ?`,
        options: Array.from(mathOptions).sort(() => Math.random() - 0.5),
        answer,
      };

    case "counting":
      const item =
        TEST_DATA.countingItems[
          Math.floor(Math.random() * TEST_DATA.countingItems.length)
        ];
      const count = Math.floor(Math.random() * 8) + 3;
      const display = Array(count).fill(item).join(" ");

      // สร้างตัวเลือกที่ไม่ซ้ำสำหรับการนับ
      const countOptions = new Set([count]);
      while (countOptions.size < 4) {
        const offset = Math.floor(Math.random() * 3) + 1;
        countOptions.add(count + offset);
        countOptions.add(count - offset);
      }

      return {
        type: "counting",
        question: `มี${item}กี่อัน?`,
        display,
        options: Array.from(countOptions)
          .slice(0, 4)
          .sort(() => Math.random() - 0.5),
        answer: count,
      };

    case "shape":
      const shape =
        TEST_DATA.shapes[Math.floor(Math.random() * TEST_DATA.shapes.length)];
      const color =
        TEST_DATA.colors[Math.floor(Math.random() * TEST_DATA.colors.length)];

      return {
        type: "shape",
        question: "รูปนี้คือรูปอะไร?",
        shape,
        color,
        options: generateUniqueOptions(shape, TEST_DATA.shapes),
        answer: shape,
      };

    case "color":
      const colorQ =
        TEST_DATA.colors[Math.floor(Math.random() * TEST_DATA.colors.length)];
      const shapeQ =
        TEST_DATA.shapes[Math.floor(Math.random() * TEST_DATA.shapes.length)];

      return {
        type: "color",
        question: "รูปนี้เป็นสีอะไร?",
        shape: shapeQ,
        color: colorQ,
        options: generateUniqueOptions(colorQ, TEST_DATA.colors),
        answer: colorQ,
      };

    case "animal":
      const animalQ =
        TEST_DATA.animalQuestions[
          Math.floor(Math.random() * TEST_DATA.animalQuestions.length)
        ];
      return {
        type: "animal",
        question: animalQ.question,
        options: animalQ.answers,
        answer: animalQ.correct,
      };

    default:
      return generateQuestion();
  }
};

// Main Component
export default function MemoryTest() {
  // States
  const [stage, setStage] = useState("intro"); // intro, memorize, game, recall
  const [memoryWords, setMemoryWords] = useState([]);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);

  useEffect(() => {
    if (stage === "recall") {
      // แยกคำที่ถูกต้อง (5 คำที่ต้องจำ)
      const correctWords = [...memoryWords];

      // สร้างชุดคำที่เหลือ (ไม่รวมคำที่ถูกต้อง)
      const remainingWords = TEST_DATA.memoryWords.filter(
        (word) => !correctWords.includes(word)
      );

      // สุ่มคำที่เหลืออีก 5 คำ
      const randomIncorrectWords = remainingWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      // รวมคำที่ถูกต้องและคำที่สุ่มมา แล้วสลับตำแหน่ง
      const allOptions = [...correctWords, ...randomIncorrectWords].sort(
        () => Math.random() - 0.5
      );

      setAvailableOptions(allOptions);
    }
  }, [stage, memoryWords]);

  // Initialize memory words
  useEffect(() => {
    const shuffled = [...TEST_DATA.memoryWords].sort(() => Math.random() - 0.5);
    setMemoryWords(shuffled.slice(0, 5));
  }, []);

  // Timer for memorization phase
  useEffect(() => {
    if (stage === "memorize") {
      setTimeLeft(15);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStage("game");
            setCurrentQuestion(generateQuestion());
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Timer for game phase
  useEffect(() => {
    if (stage === "game") {
      setTimeLeft(300); // 5 minutes
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStage("recall");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle game answer
  const handleGameAnswer = (selected) => {
    setSelectedAnswer(selected);
    setShowResults(true);
    setAnsweredQuestions((prev) => prev + 1);

    const isCorrect = selected === currentQuestion.answer;
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      celebrateCorrect();
      message.success("ถูกต้อง!");
    } else {
      message.error("ไม่ถูกต้อง");
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResults(false);
      setCurrentQuestion(generateQuestion());
    }, 2000);
  };

  // Render functions
  const renderIntro = () => (
    <StyledCard>
      <Space
        direction="vertical"
        size={24}
        style={{ width: "100%", textAlign: "center" }}
      >
        <Title level={2} style={{ color: COLORS.primary, marginBottom: 0 }}>
          แบบทดสอบความจำ MoCA
        </Title>

        <Text style={{ fontSize: "16px", color: COLORS.dark }}>
          คุณจะได้เห็นคำ 5 คำ เป็นเวลา 15 วินาที จากนั้นจะมีเกมให้เล่น 5 นาที
          และสุดท้ายจะต้องจำคำเหล่านั้นให้ได้
        </Text>

        <div style={{ marginTop: "24px" }}>
          <ActionButton
            className="primary"
            size="large"
            onClick={() => setStage("memorize")}
          >
            เริ่มทำแบบทดสอบ
          </ActionButton>
        </div>
      </Space>
    </StyledCard>
  );

  const renderMemorize = () => (
    <StyledCard>
      <Space
        direction="vertical"
        size={24}
        style={{ width: "100%", textAlign: "center" }}
      >
        <Title level={2} style={{ color: COLORS.primary, marginBottom: 0 }}>
          จำคำต่อไปนี้
        </Title>

        <Timer>
          <ClockCircleOutlined />
          {timeLeft} วินาที
        </Timer>

        <div
          style={{
            background: COLORS.background,
            padding: "32px",
            borderRadius: "12px",
            marginTop: "24px",
          }}
        >
          {memoryWords.map((word, index) => (
            <Title
              level={2}
              key={index}
              style={{
                color: COLORS.dark,
                marginBottom: index === memoryWords.length - 1 ? 0 : "24px",
              }}
            >
              {word}
            </Title>
          ))}
        </div>
      </Space>
    </StyledCard>
  );

  const renderGame = () => (
    <QuestionCard>
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-label">เวลาที่เหลือ</div>
          <div className="stat-value">{formatTime(timeLeft)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">คะแนน</div>
          <div className="stat-value">
            {correctAnswers}
            <span className="total">/{answeredQuestions}</span>
          </div>
        </div>
      </div>

      <div className="question-header">
        <h2 className="question-text">{currentQuestion.question}</h2>
      </div>

      {(currentQuestion.type === "shape" ||
        currentQuestion.type === "color") && (
        <div className="question-content">
          <ShapeDisplay
            shape={currentQuestion.shape}
            color={currentQuestion.color}
          />
        </div>
      )}

      {currentQuestion.type === "counting" && (
        <div className="question-content counting">
          {currentQuestion.display}
        </div>
      )}

      <div className="options-grid">
        {currentQuestion.options.map((option, index) => (
          <AnswerButton
            key={index}
            onClick={() => !showResults && handleGameAnswer(option)}
            disabled={showResults}
            className={
              showResults
                ? option === currentQuestion.answer
                  ? "correct"
                  : selectedAnswer === option
                  ? "wrong"
                  : ""
                : ""
            }
          >
            {option}
          </AnswerButton>
        ))}
      </div>
    </QuestionCard>
  );

  const renderRecall = () => (
    <SummaryCard>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div className="summary-header">
          <Title level={2} style={{ color: COLORS.primary, marginBottom: 0 }}>
            จำคำที่เห็นตอนแรกได้ไหม?
          </Title>
          {showAnswers && (
            <div className="total-score">
              {
                selectedOptions.filter((answer) => memoryWords.includes(answer))
                  .length
              }
              <span className="total">/5</span>
            </div>
          )}
        </div>

        {!showAnswers ? (
          <>
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <Text>เลือกคำที่คุณจำได้ ({selectedOptions.length}/5)</Text>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              {availableOptions.map((option) => (
                <AnswerButton
                  key={option}
                  onClick={() => {
                    if (selectedOptions.includes(option)) {
                      setSelectedOptions((prev) =>
                        prev.filter((item) => item !== option)
                      );
                    } else if (selectedOptions.length < 5) {
                      setSelectedOptions((prev) => [...prev, option]);
                    }
                  }}
                  className={selectedOptions.includes(option) ? "selected" : ""}
                  style={{
                    backgroundColor: selectedOptions.includes(option)
                      ? COLORS.primary
                      : "white",
                    color: selectedOptions.includes(option)
                      ? "white"
                      : COLORS.dark,
                  }}
                >
                  {option}
                </AnswerButton>
              ))}
            </div>

            <ActionButton
              className="primary"
              size="large"
              style={{ width: "100%" }}
              disabled={selectedOptions.length !== 5}
              onClick={() => {
                const correct = selectedOptions.filter((answer) =>
                  memoryWords.includes(answer)
                ).length;
                setAnswers(selectedOptions);
                setShowAnswers(true);
                message.info(`คุณจำได้ ${correct} คำ จาก 5 คำ`);
                celebrateComplete();
              }}
            >
              {selectedOptions.length !== 5
                ? `เลือกอีก ${5 - selectedOptions.length} คำ`
                : "ส่งคำตอบ"}
            </ActionButton>
          </>
        ) : (
          <>
            <div style={{ marginBottom: "24px" }}>
              {selectedOptions.map((answer, index) => {
                const isCorrect = memoryWords.includes(answer);
                return (
                  <AnswerResult key={index} isCorrect={isCorrect}>
                    <span className="number">{index + 1}</span>
                    <span className="answer-text">{answer}</span>
                  </AnswerResult>
                );
              })}
            </div>

            <CorrectAnswersSection>
              <div className="title">คำทั้งหมดที่ต้องจำ</div>
              <div className="answers-grid">
                {memoryWords.map((word, index) => {
                  const isAnsweredCorrectly = selectedOptions.includes(word);
                  return (
                    <div
                      key={index}
                      className={`answer-item ${
                        isAnsweredCorrectly ? "correct" : ""
                      }`}
                    >
                      {word}
                    </div>
                  );
                })}
              </div>
            </CorrectAnswersSection>

            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <ActionButton
                className="primary"
                size="large"
                style={{ width: "100%" }}
                onClick={() => window.location.reload()}
              >
                เริ่มทำแบบทดสอบใหม่
              </ActionButton>
              <Button
                size="large"
                style={{ width: "100%" }}
                onClick={() => navigate("/")}
              >
                กลับหน้าหลัก
              </Button>
            </Space>
          </>
        )}
      </Space>
    </SummaryCard>
  );

  return (
    <PageContainer>
      <ContentContainer>
        {stage === "intro" && renderIntro()}
        {stage === "memorize" && renderMemorize()}
        {stage === "game" && renderGame()}
        {stage === "recall" && renderRecall()}
      </ContentContainer>
    </PageContainer>
  );
}
