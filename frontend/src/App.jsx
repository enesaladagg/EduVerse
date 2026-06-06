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
import PomodoroTimer from './components/PomodoroTimer';

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

  if (page === 'live') {
    return (
      <LiveSessionView
        user={displayUser}
        onNavigateHome={() => navigate('home')}
      />
    );
  }

  if (page === 'home') {
    return <HomeView onNavigate={navigate} />;
  }

  if (page === 'profile') {
    return <DashboardView user={displayUser} onNavigate={navigate} />;
  }

  if (page === 'instructor') {
    return <InstructorDashboardView onNavigate={navigate} />;
  }

  let content;
  switch (page) {
    case 'login':
      content = <LoginView onNavigate={navigate} />;
      break;
    case 'register':
      content = <RegisterView onNavigate={navigate} />;
      break;
    case 'courses':
      content = <CoursesPage onNavigate={navigate} />;
      break;
    case 'games':
      content = <GamesView onNavigate={navigate} />;
      break;
    case 'course-detail':
      content = <CourseDetailView onNavigate={navigate} />;
      break;
    case 'assignments':
      content = <AssignmentsView />;
      break;
    default:
      content = <HomeView onNavigate={navigate} />;
  }

  return (
    <EduFlowShell
      activePage={page}
      onNavigate={navigate}
      user={displayUser}
      isAuthenticated={isAuthenticated}
    >
      {content}
    </EduFlowShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <PomodoroTimer />
      </AuthProvider>
    </ThemeProvider>
  );
}
