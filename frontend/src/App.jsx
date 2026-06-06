import React, { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import EduFlowShell from './layouts/EduFlowShell';
import HomeView from './views/HomeView';
import LiveSessionView from './views/LiveSessionView';
import DashboardView from './views/DashboardView';
import InstructorDashboardView from './views/InstructorDashboardView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import AssignmentsView from './views/AssignmentsView';
import CoursesPage from './views/CoursesPage';
import GamesView from './views/GamesView';
import CourseDetailView from './views/CourseDetailView';
import ComingSoonView from './views/ComingSoonView';
import PomodoroTimer from './components/PomodoroTimer';
import CertificatesView from './views/CertificatesView';
import RoadmapsView from './views/RoadmapsView';
import CommunityView from './views/CommunityView';
import CorporateView from './views/CorporateView';

const GUEST_USER = {
  name: 'Misafir',
  role: 'student',
  points: 0,
  xp: 0,
  badges: [],
  earnedIds: [],
  avatarInitials: '?',
};

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState('home');

  const navigate = useCallback((id) => setPage(id), []);
  const displayUser = user || GUEST_USER;

  let content;
  switch (page) {
    case 'login': content = <LoginView onNavigate={navigate} />; break;
    case 'register': content = <RegisterView onNavigate={navigate} />; break;
    case 'courses': content = <CoursesPage onNavigate={navigate} />; break;
    case 'games': content = <GamesView onNavigate={navigate} />; break;
    case 'course-detail': content = <CourseDetailView onNavigate={navigate} />; break;
    case 'assignments': content = <AssignmentsView />; break;
    case 'calendar': content = <ComingSoonView title="Takvim & Plan" description="Kişisel öğrenme takviminiz ve planlama araçlarınız çok yakında burada olacak." />; break;
    case 'messages': content = <ComingSoonView title="Mesajlar" description="Eğitmenler ve diğer öğrencilerle iletişime geçebileceğiniz mesajlaşma modülü yapım aşamasında." />; break;
    case 'certificates': content = <CertificatesView onNavigate={navigate} />; break;
    case 'h-paths': content = <RoadmapsView onNavigate={navigate} />; break;
    case 'h-community': content = <CommunityView onNavigate={navigate} />; break;
    case 'h-corporate': content = <CorporateView onNavigate={navigate} />; break;
    case 'live': content = <LiveSessionView user={displayUser} onNavigateHome={() => navigate('home')} />; break;
    case 'home': content = <HomeView onNavigate={navigate} />; break;
    case 'profile': content = <DashboardView user={displayUser} onNavigate={navigate} />; break;
    case 'instructor': content = <InstructorDashboardView onNavigate={navigate} />; break;
    default: content = <HomeView onNavigate={navigate} />;
  }

  const isShellPage = !['home', 'profile', 'instructor', 'live', 'login', 'register', 'certificates', 'h-paths', 'h-community', 'h-corporate'].includes(page);

  return (
    <>
      <style>
        {`
          @keyframes pageFadeIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div key={page} style={{ animation: 'pageFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {isShellPage ? (
          <EduFlowShell
            activePage={page}
            onNavigate={navigate}
            user={displayUser}
            isAuthenticated={isAuthenticated}
          >
            {content}
          </EduFlowShell>
        ) : (
          content
        )}
      </div>
      {page !== 'login' && page !== 'register' && page !== 'live' && <PomodoroTimer />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
