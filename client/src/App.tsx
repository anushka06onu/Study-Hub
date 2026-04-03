import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

function Shell() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const { token } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('studyhub-theme') as 'dark' | 'light' | null;
    if (saved) setMode(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('studyhub-theme', mode);
  }, [mode]);

  const shellClasses =
    mode === 'dark'
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50'
      : 'bg-gradient-to-br from-white via-slate-50 to-sky-50 text-slate-900';

  return (
    <div className={`min-h-screen ${shellClasses} transition-colors`}>
      <Navbar mode={mode} onToggleTheme={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))} />
      <div className={`mx-auto w-full ${isLanding ? 'max-w-6xl' : 'max-w-7xl'} px-4 md:px-6`}>
        {isLanding ? (
          <main className="py-8">
            <Landing />
          </main>
        ) : isAuthRoute ? (
          <main className="py-10">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        ) : (
          <div className="flex">
            <Sidebar />
            <main className="flex-1 py-6">
              <Routes>
                <Route path="/dashboard" element={<Protected component={<Dashboard />} token={token} />} />
                <Route path="/subjects" element={<Protected component={<Subjects />} token={token} />} />
                <Route path="/tasks" element={<Protected component={<Tasks />} token={token} />} />
                <Route path="/analytics" element={<Protected component={<Analytics />} token={token} />} />
                <Route path="/calendar" element={<Protected component={<Calendar />} token={token} />} />
                <Route path="/settings" element={<Protected component={<Settings mode={mode} />} token={token} />} />
              </Routes>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

function Protected({ component, token }: { component: JSX.Element; token: string | null }) {
  if (!token) return <Navigate to="/login" replace />;
  return component;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Shell />} />
      </Routes>
    </Router>
  );
}
