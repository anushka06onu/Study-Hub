import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

type Props = { mode: 'dark' | 'light'; onToggleTheme: () => void };

export default function Navbar({ mode, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { user, token } = useAuth();
  const links = token
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/subjects', label: 'Subjects' },
        { to: '/tasks', label: 'Tasks' },
        { to: '/analytics', label: 'Analytics' },
        { to: '/calendar', label: 'Calendar' },
        { to: '/settings', label: 'Settings' }
      ]
    : [];

  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (user?.email) setUserEmail(user.email);
    else setUserEmail(null);
  }, [user]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 text-slate-900 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-3 py-1 text-sm font-semibold text-white shadow-lg"
          >
            <span className="text-lg">📚</span>
            <Link to="/" className="hover:underline">
              StudyHub
            </Link>
          </motion.div>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 md:block">Stay on top of courses, tasks, and study time.</p>
        </div>

        {token && (
          <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-2 py-1 text-sm text-slate-700 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-200 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition ${
                    isActive
                      ? 'bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white'
                      : 'hover:bg-slate-900/5 text-slate-600 dark:hover:bg-white/5 dark:text-slate-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle mode={mode} onToggle={onToggleTheme} />
          {token && userEmail && (
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white">
                {userEmail.slice(0, 1).toUpperCase()}
              </div>
              {userEmail}
            </div>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-800 transition hover:border-indigo-400 dark:border-slate-700 dark:text-slate-100 md:hidden"
          >
            Menu
          </button>
          {!token && (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-800 transition hover:border-indigo-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-indigo-500 px-3 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-400"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 bg-white/95 text-slate-900 dark:border-slate-800/70 dark:bg-slate-950/95 dark:text-slate-100 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm text-slate-800 dark:text-slate-200">
              {token ? (
                links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 ${
                        isActive
                          ? 'bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white'
                          : 'hover:bg-slate-900/5 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-center dark:border-slate-700">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-indigo-500 px-3 py-2 text-center font-semibold text-white"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
