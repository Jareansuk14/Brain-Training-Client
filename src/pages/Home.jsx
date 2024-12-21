// src/pages/Home.jsx
import { Layout, Row, Col } from "antd";
import styled from "@emotion/styled";
import Header from "../components/Header";
import Instructions from "../components/Instructions";
import ActivityCard from "../components/ActivityCard";

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
    number: 1,
    title:
      "ตระหนักรู้ มีสติอยู่กับปัจจุบัน ยอมรับตนเอง เสริมสร้างสมอง ผ่านแผนที่ความคิด",
    subtitles: [
      "กิจกรรมส่วนที่ 1 : ฉันคือฉัน",
      "กิจกรรมส่วนที่ 2 : Mind Mapping Magic : เสริมพลังสมองด้วยแผนภาพความคิด",
    ],
    duration: 50,
  },
  {
    number: 2,
    title: "ปล่อยความคิด ให้ปลิวไปในอากาศ",
    subtitles: ["กิจกรรมส่วนที่ 1 : ปล่อยความคิด ให้ปลิวไปในอากาศ"],
    duration: 50,
  },
  {
    number: 3,
    title: "สมาธิดิจิทัล",
    subtitles: ["กิจกรรมส่วนที่ 1 : สมาธิดิจิทัลธรรมชาติ"],
    duration: 50,
  },
  {
    number: 4,
    title: "รู้ตัว รู้ใจ รู้อารมณ์",
    subtitles: [
      "กิจกรรมส่วนที่ 1 : วงล้ออารมณ์",
      "กิจกรรมส่วนที่ 2 : บันทึกอารมณ์",
    ],
    duration: 50,
  },
  {
    number: 5,
    title: "สร้างค่านิยม",
    subtitles: [
      "กิจกรรมส่วนที่ 1 : ด้านครอบครัว",
      "กิจกรรมส่วนที่ 2 : ด้านการงาน",
      "กิจกรรมส่วนที่ 3 : ด้านสังคม",
      "กิจกรรมส่วนที่ 4 : ด้านการพักผ่อน",
      "กิจกรรมส่วนที่ 5 : ด้านสุขภาพ",
      "กิจกรรมส่วนที่ 6 : ด้านจิตวิญญาณ",
    ],
    duration: 50,
  },
  {
    number: 6,
    title: "ตั้งเป้าหมายเพื่อพัฒนาความจำ",
    subtitles: [
      "กิจกรรมส่วนที่ 1 : ด้านครอบครัว",
      "กิจกรรมส่วนที่ 2 : ด้านการงาน",
      "กิจกรรมส่วนที่ 3 : ด้านสังคม",
      "กิจกรรมส่วนที่ 4 : ด้านการพักผ่อน",
      "กิจกรรมส่วนที่ 5 : ด้านสุขภาพ",
      "กิจกรรมส่วนที่ 6 : ด้านจิตวิญญาณ",
    ],
    duration: 50,
  },
  {
    number: 7,
    title: "สร้างแนวทางปฏิบัติเพื่อพัฒนาความจำ",
    subtitles: [
      "กิจกรรมส่วนที่ 1 : ด้านครอบครัว",
      "กิจกรรมส่วนที่ 2 : ด้านการงาน",
      "กิจกรรมส่วนที่ 3 : ด้านสังคม",
      "กิจกรรมส่วนที่ 4 : ด้านการพักผ่อน",
      "กิจกรรมส่วนที่ 5 : ด้านสุขภาพ",
      "กิจกรรมส่วนที่ 6 : ด้านจิตวิญญาณ",
    ],
    duration: 50,
  },
  {
    number: 8,
    title: "พันธสัญญาใจ” ยุติกิจกรรม",
    subtitles: [
      "กิจกรรมส่วนที่ 1 : การค้นหาค่านิยม",
      "กิจกรรมส่วนที่ 2 : การกำหนดเป้าหมาย",
      "กิจกรรมส่วนที่ 3 : การสร้างพันธสัญญา",
    ],
    duration: 50,
  },
];

export default function Home() {
  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        <Row justify="center">
          <Col xs={24} sm={24} md={20} lg={16} xl={14}>
            <ContentWrapper>
              <Instructions />
              {activities.map((activity) => (
                <ActivityCard key={activity.number} {...activity} />
              ))}
            </ContentWrapper>
          </Col>
        </Row>
      </StyledContent>
    </StyledLayout>
  );
}
