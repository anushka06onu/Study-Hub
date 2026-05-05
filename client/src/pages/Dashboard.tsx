import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import SubjectCard from '../components/SubjectCard';
import TaskCard from '../components/TaskCard';
import Timer from '../components/Timer';
import ProgressChart from '../components/ProgressChart';
import { subjects as subjectApi, tasks as taskApi, sessions as sessionApi, projects as projectApi } from '../utils/api';
import { SessionData, SubjectData, TaskData } from '../types';
import AIButton from '../components/AIButton';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const { user } = useAuth();
  const isTestAccount = user?.email === 'test@example.com';

  useEffect(() => {
    subjectApi.list().then((r) => setSubjects(r.data || [])).catch(() => setSubjects([]));
    taskApi.list().then((r) => setTasks(r.data || [])).catch(() => setTasks([]));
    sessionApi.list().then((r) => setSessions(r.data || [])).catch(() => setSessions([]));
    projectApi.list().catch(() => undefined);
  }, []);

  const chartData = useMemo(() => {
    if (!sessions.length && !isTestAccount) return [];
    if (isTestAccount && sessions.length === 0) {
      return [
        { label: 'Mon', minutes: 45 },
        { label: 'Tue', minutes: 90 },
        { label: 'Wed', minutes: 60 },
        { label: 'Thu', minutes: 120 },
        { label: 'Fri', minutes: 30 }
      ];
    }
    const map = new Map<string, number>();
    sessions.forEach((s) => {
      const start = s.startTime || s.startedAt;
      if (!start) return;
      const day = new Date(start).toLocaleDateString('en-US', { weekday: 'short' });
      map.set(day, (map.get(day) || 0) + (s.duration || s.minutes || 0));
    });
    return Array.from(map.entries()).map(([label, minutes]) => ({ label, minutes }));
  }, [sessions, isTestAccount]);

  const totalDuration = useMemo(() => {
    if (isTestAccount && sessions.length === 0) return '3h 40m';
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || s.minutes || 0), 0);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [sessions, isTestAccount]);

  const handleTaskComplete = async (id?: string) => {
    if (!id) return;
    setTasks((prev) => prev.map((t) => (t._id === id || t.id === id ? { ...t, completed: !t.completed, done: !t.completed } : t)));
    try { await taskApi.complete(id); } catch { /* ignore */ }
  };

  const handleTaskDelete = async (id?: string) => {
    if (!id) return;
    setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    try { await taskApi.remove(id); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-600/90 via-indigo-500/70 to-sky-500/60 px-6 py-5 text-white shadow-2xl dark:border-slate-800/70"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-indigo-100/80">Today</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Welcome back, {user?.name || 'Scholar'}.</h1>
            <p className="text-sm text-indigo-100/90">Plan, track, and review your study sessions in one hub.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-indigo-50 shadow-inner backdrop-blur">
            <span className="text-4xl font-bold">{totalDuration}</span>
            <div className="text-xs uppercase tracking-wide text-indigo-100/80">logged this week</div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70 md:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Subjects</h3>
            <div className="flex items-center gap-2">
              <AIButton />
              <span className="text-xs text-slate-500 dark:text-slate-400">{subjects.length} subjects</span>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {subjects.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                No subjects yet. Add one in the Subjects tab!
              </div>
            ) : (
              subjects.map((subject, i) => (
                <motion.div key={subject._id || subject.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <SubjectCard subject={subject} />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70"
        >
          <Timer subjectId={(subjects[0]?._id as string) || subjects[0]?.id} onStop={() => sessionApi.list().then((r) => setSessions(r.data || []))} />
        </motion.div>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <motion.div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70 md:col-span-2">
          <h3 className="text-lg font-semibold">Next tasks</h3>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {tasks.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                No tasks yet.
              </div>
            ) : (
              tasks.slice(0, 4).map((task) => (
                <TaskCard
                  key={task._id || task.id}
                  title={task.title || task.name || 'Untitled task'}
                  subject={subjects.find((s) => s._id === task.subjectId || s.id === task.subjectId)?.name || 'Task'}
                  status={task.completed || task.done ? 'done' : 'todo'}
                  due={task.dueDate || 'Soon'}
                  onComplete={() => handleTaskComplete(task._id || task.id)}
                  onDelete={() => handleTaskDelete(task._id || task.id)}
                />
              ))
            )}
          </div>
        </motion.div>

        <motion.div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70">
          <ProgressChart data={chartData} />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
