import React, { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import EduFlowShell from './layouts/EduFlowShell';
import HomeView from './views/HomeView';
import LiveSessionView from './views/LiveSessionView';
import DashboardView from './views/DashboardView';
import InstructorDashboardView from './views/instructor/InstructorDashboardView';
import AdminDashboardView from './views/admin/AdminDashboardView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import AssignmentsView from './views/AssignmentsView';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './views/CheckoutView';
import CoursesPage from './views/CoursesPage';
import GamesView from './views/GamesView';
import CourseDetailView from './views/CourseDetailView';
import ComingSoonView from './views/ComingSoonView';
import PomodoroTimer from './components/PomodoroTimer';
import CertificatesView from './views/CertificatesView';
import RoadmapsView from './views/RoadmapsView';
import CommunityView from './views/CommunityView';
import CorporateView from './views/CorporateView';
import PlannerPage from './views/PlannerPage';
import MessagingPage from './views/MessagingPage';
import SettingsView from './views/SettingsView';

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
  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('page')) return params.get('page');
      if (params.get('payment') === 'success') return 'profile';
    }
    return 'home';
  });

  // URL'yi temizle
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const navigate = useCallback((id) => setPage(id), []);
  const displayUser = user || GUEST_USER;

  let content;
  switch (page) {
    case 'login': content = <LoginView onNavigate={navigate} />; break;
    case 'register': content = <RegisterView onNavigate={navigate} />; break;
    case 'courses': content = <CoursesPage onNavigate={navigate} />; break;
    case 'games': content = <GamesView onNavigate={navigate} />; break;
    case 'course-detail': content = <CourseDetailView onNavigate={navigate} />; break;
    case 'checkout': content = <CheckoutView onNavigate={navigate} />; break;
    case 'assignments': content = <AssignmentsView />; break;
    case 'calendar': content = <PlannerPage />; break;
    case 'messages': content = <MessagingPage />; break;
    case 'certificates': content = <CertificatesView onNavigate={navigate} />; break;
    case 'h-paths': content = <RoadmapsView onNavigate={navigate} />; break;
    case 'h-community': content = <CommunityView onNavigate={navigate} />; break;
    case 'h-corporate': content = <CorporateView onNavigate={navigate} />; break;
    case 'live': content = <LiveSessionView user={displayUser} onNavigateHome={() => navigate('home')} />; break;
    case 'home': content = <HomeView onNavigate={navigate} />; break;
    case 'profile': 
      if (displayUser.role === 'admin') content = <AdminDashboardView onNavigate={navigate} />;
      else if (displayUser.role === 'teacher') content = <InstructorDashboardView onNavigate={navigate} />;
      else content = <DashboardView user={displayUser} onNavigate={navigate} />; 
      break;
    case 'settings': content = <SettingsView onNavigate={navigate} />; break;
    case 'instructor': 
      if (displayUser.role === 'teacher' || displayUser.role === 'admin') content = <InstructorDashboardView onNavigate={navigate} />;
      else { setPage('home'); content = <HomeView onNavigate={navigate} />; }
      break;
    case 'admin': 
      if (displayUser.role === 'admin') content = <AdminDashboardView onNavigate={navigate} />;
      else { setPage('home'); content = <HomeView onNavigate={navigate} />; }
      break;
    default: content = <HomeView onNavigate={navigate} />;
  }

  const isShellPage = !['home', 'profile', 'settings', 'instructor', 'admin', 'live', 'login', 'register', 'certificates', 'h-paths', 'h-community', 'h-corporate'].includes(page);

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
      <CartDrawer onNavigate={navigate} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
