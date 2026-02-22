import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import MeetingNotes from './pages/MeetingNotes';
import Tasks from './pages/Tasks';
import CalendarPage from './pages/CalendarPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pages = {
  dashboard: Dashboard,
  meetings: MeetingNotes,
  tasks: Tasks,
  calendar: CalendarPage,
  analytics: Analytics,
  settings: Settings,
};

export default function App() {
  const { darkMode, activePage } = useStore();

  // Apply dark class on mount if persisted
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey) {
        const keyMap = { '1': 'dashboard', '2': 'meetings', '3': 'tasks', '4': 'calendar', '5': 'analytics', '6': 'settings' };
        if (keyMap[e.key]) {
          useStore.getState().setActivePage(keyMap[e.key]);
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: darkMode ? '#1e293b' : '#ffffff',
            color: darkMode ? '#f1f5f9' : '#0f172a',
            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
            fontSize: '13px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
          },
        }}
      />
    </div>
  );
}
