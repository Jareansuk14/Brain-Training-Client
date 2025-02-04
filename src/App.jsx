// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { AuthProvider, useAuth } from "./context/AuthContext";
import styled from "@emotion/styled";
import Login from "./components/Login";
import Home from "./pages/Home";
import Game from "./pages/Game";
import MindMapEditor from "./pages/MindMapEditor";
import ActivityOneForm from "./components/ActivityOneForm";
import ActivityTwo from "./pages/ActivityTwo";
import ActivityThree from "./pages/ActivityThree";
import ActivityFour from "./pages/ActivityFour";
import ActivityFive from "./pages/ActivityFive";
import ActivitySix from "./pages/ActivitySix";
import ActivitySeven from "./pages/ActivitySeven";
import ActivityEight from "./pages/ActivityEight";
import ColorSortingGame from "./pages/ColorSortingGame"
import AnimalNamingTest from "./pages/AnimalNamingTest"
import CompleteMemoryTest from "./pages/CompleteMemoryTest"
import DigitSpan from "./pages/DigitSpan"
import TowerOfHanoi from "./pages/TowerOfHanoi"


const { Header: AntHeader, Content } = Layout;

const COLORS = {
  primary: "#7c3aed",
  secondary: "#a78bfa",
  surface: "#ffffff",
  background: "#fafafa",
  text: "#1f2937",
  textLight: "#6b7280",
  border: "#e5e7eb",
};

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  background: ${COLORS.surface};
  height: 72px;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.97);
  border-bottom: 1px solid ${COLORS.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 64px;
  }
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${COLORS.primary}05 0%,
    ${COLORS.secondary}05 100%
  );
`;

const MainContent = styled(Content)`
  margin: 0;
  min-height: calc(100vh - 64px);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    box-shadow: 0 2px 10px ${COLORS.primary}40;

    @media (max-width: 768px) {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
  }

  .logo-text {
    font-weight: 600;
    font-size: 18px;
    color: ${COLORS.text};
    letter-spacing: -0.5px;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px;
  background: ${COLORS.background};
  border-radius: 30px;
  border: 1px solid ${COLORS.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${COLORS.secondary};
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .user-icon {
    width: 28px;
    height: 28px;
    background: ${COLORS.primary}15;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${COLORS.primary};
  }

  .user-text {
    font-size: 14px;
    color: ${COLORS.text};
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;

    .user-text {
      display: none;
    }
  }
`;

const LogoutButton = styled(Button)`
  height: 40px;
  padding: 0 20px;
  border-radius: 20px;
  border: none;
  background: ${COLORS.primary}08;
  color: ${COLORS.primary};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${COLORS.primary};
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${COLORS.primary}40;
  }

  .anticon {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 40px;
    padding: 0;
    justify-content: center;

    .btn-text {
      display: none;
    }
  }
`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Header Component with User Info
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <StyledHeader>
      <Link to="/">
        <LogoContainer>
          <div className="logo-icon">
            <ExperimentOutlined />
          </div>
          <div className="logo-text">Brain-Training</div>
        </LogoContainer>
      </Link>
      {user && (
        <UserInfo>
          <UserCard>
            <div className="user-icon">
              <UserOutlined />
            </div>
            <span className="user-text">{user.nationalId}</span>
          </UserCard>

          <LogoutButton onClick={logout}>
            <LogoutOutlined />
            <span className="btn-text">ออกจากระบบ</span>
          </LogoutButton>
        </UserInfo>
      )}
    </StyledHeader>
  );
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <MainContent>{children}</MainContent>
    </StyledLayout>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <AppLayout>
                <Login />
              </AppLayout>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Game />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-1"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivityOneForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-1/mindmap"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MindMapEditor />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-2/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivityTwo />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-3/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivityThree />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-4/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivityFour />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-5/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivityFive />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-6/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivitySix />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-7/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivitySeven />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-8/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivityEight />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-9/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ColorSortingGame />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-10/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnimalNamingTest />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-11/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CompleteMemoryTest />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-12/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DigitSpan />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-13/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TowerOfHanoi />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Add routes for other activities */}

          {/* Catch all route - redirects to home if logged in, or login if not */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

// Utility function for breadcrumb generation
export const getBreadcrumb = (pathname) => {
  const paths = pathname.split("/").filter(Boolean);
  return paths.map((path, index) => {
    const url = `/${paths.slice(0, index + 1).join("/")}`;
    return {
      path: url,
      breadcrumbName:
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
    };
  });
};
