import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy, createContext } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Learning from './pages/Learning';
import { useTranslation } from 'react-i18next';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import './i18n';
import Scholarships from './pages/Scholarships';
import Chatbot from './pages/Chatbot';
import Loading from './components/Loading';
import CareerQuiz from './pages/CareerQuiz';
import GamificationPage from './pages/Gamification';
import Profile from './pages/Profile';
import JobLocations from './pages/JobLocations';
import Calendar from './pages/Calendar';
import Auth from './pages/Auth';
import ResumeBuilder from './pages/ResumeBuilder';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import CSS files
import './styles/advanced-ui.css';
import './styles/mobile.css';

// Create theme context
export const ThemeContext = createContext({
  darkMode: true,
  toggleTheme: () => {}
});

const App = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => {
    // Get user's preferred theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Function to toggle theme
  const toggleTheme = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  // Apply theme to the document on mount and when theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setDarkMode(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme ? 'dark' : 'light');
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <Router>
        <AuthProvider>
          <div className="app-container custom-scrollbar" style={{ 
            backgroundColor: 'var(--background)',
            color: 'var(--text)',
            minHeight: '100vh',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}>
            <Navbar darkMode={darkMode} setDarkMode={toggleTheme} />
            <div style={{ 
              paddingTop: '2px',
              minHeight: '100vh',
              backgroundColor: 'var(--background)',
              color: 'var(--text)'
            }}>
              <Suspense fallback={<Loading />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/scholarships" element={<Scholarships />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/career-quiz" element={<CareerQuiz />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/resume-builder" element={<ResumeBuilder />} />
                  
                  {/* Protected routes that require authentication */}
                  <Route path="/achievements" element={
                    <ProtectedRoute>
                      <GamificationPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/job-locations" element={
                    <ProtectedRoute>
                      <JobLocations />
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Suspense>
            </div>

            {/* Floating Chatbot Button - Present on all pages */}
            <button
              onClick={toggleChat}
              className="liquid-button"
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                zIndex: 50,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <ChatBubbleLeftRightIcon width={24} height={24} />
            </button>

            {/* Chatbot Modal */}
            {isChatOpen && (
              <div className="glass-card chat-modal" style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: window.innerWidth < 768 ? '90%' : '350px',
                height: window.innerWidth < 768 ? '450px' : '500px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 1000,
                maxWidth: '450px',
              }}>
                {/* Chat Header */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--background-lighter)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px' 
                  }}>
                    <ChatBubbleLeftRightIcon width={20} height={20} color="var(--primary)" />
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '16px', 
                      fontWeight: 600,
                      color: 'var(--text)'
                    }}>
                      {t('chatbot.title', 'STEM Assist')}
                    </h3>
                  </div>
                  <button
                    onClick={toggleChat}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      minHeight: '44px',
                      minWidth: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                {/* Chat Content - using iframe to embed the actual chatbot */}
                <div className="mobile-scroll" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <iframe 
                    src="/chatbot" 
                    title="STEM Assist Chatbot"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </AuthProvider>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;
