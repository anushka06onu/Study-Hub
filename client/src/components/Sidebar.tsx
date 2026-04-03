import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const items = [
  { to: '/', label: 'Dashboard' },
  { to: '/subjects', label: 'Subjects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/settings', label: 'Settings' }
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/70 px-4 py-6 text-slate-800 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60 dark:text-slate-200 md:block">
      <div className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Navigate</div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    layout
                    className={`absolute left-0 h-8 w-1 rounded-full ${
                      isActive ? 'bg-indigo-500' : 'bg-transparent group-hover:bg-indigo-500/60'
                    }`}
                  />
                  <span className="ml-3">{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
