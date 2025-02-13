// src/pages/Game.jsx
import { Layout, Row, Col } from "antd";
import styled from "@emotion/styled";
import Header from "../components/HeaderGame";
import ActivityCard from "../components/ActivityCardGame";
import HomeFAB from '../components/HomeFAB';

const { Content } = Layout;

// Design system constants
const COLORS = {
  primary: "#7c3aed",
  secondary: "#a78bfa",
  background: "#fafafa",
  surface: "#ffffff",
  text: "#1f2937",
  textLight: "#6b7280",
  border: "#e5e7eb",
  highlight: "#f3f4f6",
  gradient: {
    start: "rgba(124, 58, 237, 0.05)",
    end: "rgba(167, 139, 250, 0.05)",
  },
};

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${COLORS.gradient.start} 0%,
    ${COLORS.gradient.end} 100%
  );
`;

const StyledContent = styled(Content)`
  padding: 24px 50px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: ${COLORS.surface};
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const activities = [
  {
    no: 1,
    number: 9,
    title:
      "เกมจำสี ขยับบล็อก",
    subtitles: [
      "ระดับที่ 1 : ง่าย",
      "ระดับที่ 2 : กลาง",
      "ระดับที่ 3 : ยาก",
    ],
    duration: 50,
  },
  {
    no: 2,
    number: 10,
    title:
      "เกมปริศนา ไขชื่อสัตว์โลก",
    subtitles: [
        "เกมมีทั้งหมด 10 ชุดโดยในแต่ละชุดมี 3 ระดับ",
        "ระดับที่ 1 : ง่าย",
        "ระดับที่ 2 : กลาง",
        "ระดับที่ 3 : ยาก",
    ],
    duration: 50,
  },
  {
    no: 3,
    number: 11,
    title:
      "เกมจำคำ ท้าสมอง",
    subtitles: [
      "จำคำทั้งหมด 5 คำใน 15 วินาที",
      "ทำแบบทดสอบตอบคำถาม 5 นาที",
      "เลือกคำตอบที่ตรงกับ 5 คำในขั้นแรก"
    ],
    duration: 50,
  },
  {
    no: 4,
    number: 12,
    title:
      "เกมสนุกเลข ปลุกพลังสมอง",
    subtitles: [
      "โหมด Forward (จำปกติ) ",
      "เกมจะมี 6 ระดับ เริ่มจาก 3 หลักไปจนถึง 8 หลัก",
      "Backward (จำแบบย้อนกลับ)",
      "เกมจะมี 6 ระดับ เริ่มจาก 3 หลักไปจนถึง 8 หลัก",
    ],
    duration: 50,
  },
  {
    no: 5,
    number: 13,
    title:
      "เกมกล่องหรรษา",
    subtitles: [
      "ย้ายจานทั้งหมดจากหอคอยซ้ายไปหอคอยขวา โดยต้องวางให้จานใหญ่อยู่ด้านล่างเสมอ",
      "กดที่หอคอยเพื่อเลือกจานที่ต้องการย้าย แล้วกดที่หอคอยปลายทาง",
      "พยายามทำให้สำเร็จด้วยจำนวนการเคลื่อนย้ายน้อยที่สุด",
    ],
    duration: 50,
  },
];

export default function Game() {
  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        <Row justify="center">
          <Col xs={24} sm={24} md={20} lg={16} xl={14}>
            <ContentWrapper>
              {activities.map((activity) => (
                <ActivityCard key={activity.number} {...activity} />
              ))}
            </ContentWrapper>
          </Col>
        </Row>
      </StyledContent>
      <HomeFAB />
    </StyledLayout>
  );
}
