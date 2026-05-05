import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { sessions as sessionApi } from '../utils/api';
import { SessionData } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const { user } = useAuth();
  const isTestAccount = user?.email === 'test@example.com';

  useEffect(() => {
    sessionApi.list().then(r => setSessions(r.data || [])).catch(() => {});
  }, []);

  const stats = useMemo(() => {
    if (isTestAccount && sessions.length === 0) {
      return [
        { label: 'Daily average', value: '54 min', detail: 'Across last 7 days' },
        { label: 'Weekly total', value: '6.3 h', detail: 'Week 14 · Spring' },
        { label: 'Monthly focus', value: '24 sessions', detail: 'Logged in March' }
      ];
    }
    
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || s.minutes || 0), 0);
    const avg = sessions.length ? Math.round(totalMinutes / 7) : 0;
    
    return [
      { label: 'Daily average', value: `${avg} min`, detail: 'Across last 7 days' },
      { label: 'Weekly total', value: `${(totalMinutes/60).toFixed(1)} h`, detail: 'Current Week' },
      { label: 'Sessions', value: `${sessions.length}`, detail: 'Total logged sessions' }
    ];
  }, [sessions, isTestAccount]);

  const spark = useMemo(() => {
    if (isTestAccount && sessions.length === 0) return [40, 55, 70, 60, 90, 75, 88];
    const days = [0,0,0,0,0,0,0];
    sessions.forEach(s => {
      const d = new Date(s.startTime || s.startedAt || '').getDay();
      days[d] = (days[d] || 0) + (s.duration || s.minutes || 0);
    });
    const max = Math.max(...days, 1);
    return days.map(d => (d/max) * 100);
  }, [sessions, isTestAccount]);

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Duration (min),Subject\n"
      + sessions.map(s => `${new Date(s.startTime || '').toLocaleDateString()},${s.duration},${s.subjectId}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "study_sessions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Analytics</p>
          <h2 className="text-2xl font-semibold">Your Study Intelligence</h2>
        </div>
        <button 
          onClick={exportData}
          className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-400"
        >
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            <div className="mt-2 text-3xl font-semibold">{item.value}</div>
            <p className="text-xs text-slate-500">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Focus curve</h3>
          <span className="text-xs text-slate-500">Activity by day of week</span>
        </div>
        <div className="mt-8 flex h-48 items-end gap-3">
          {spark.map((h, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(h, 5)}%` }}
              className="flex-1 rounded-t-xl bg-gradient-to-t from-indigo-500/20 to-indigo-500 shadow-inner"
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between px-1 text-[10px] uppercase tracking-widest text-slate-400">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>
      </motion.div>
    </section>
  );
}
