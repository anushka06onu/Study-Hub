import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { tasks, subjects } from '../utils/api';
import { TaskData, SubjectData } from '../types';

export default function Tasks() {
  const [list, setList] = useState<TaskData[]>([]);
  const [subs, setSubs] = useState<SubjectData[]>([]);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const { user } = useAuth();
  const isTestAccount = user?.email === 'test@example.com';

  useEffect(() => {
    tasks.list().then((r) => setList(r.data || [])).catch(() => setList([]));
    subjects.list().then((r) => {
      let data = r.data || [];
      if (isTestAccount && data.length === 0) {
        data = [
          { name: 'Physics', _id: 'mock1', id: 'mock1' },
          { name: 'Math', _id: 'mock2', id: 'mock2' },
          { name: 'History', _id: 'mock3', id: 'mock3' },
          { name: 'English', _id: 'mock4', id: 'mock4' }
        ];
      }
      setSubs(data);
      if (data.length > 0) setSubjectId(data[0]._id || data[0].id);
    }).catch(() => setSubs([]));
  }, [isTestAccount]);

  const addTask = async () => {
    if (!title.trim()) return;
    const payload: TaskData = { title, subjectId, priority, done: false, dueDate: new Date().toISOString().slice(0, 10) };
    try {
      const { data } = await tasks.create(payload);
      setList((prev) => [data, ...prev]);
      setTitle('');
      setSubjectId('');
    } catch {
      setList((prev) => [{ ...payload, id: `${Date.now()}` }, ...prev]);
      setTitle('');
      setSubjectId('');
    }
  };

  const priorityColor = (p?: string) => {
    if (p === 'High') return 'bg-rose-500 text-white border-rose-600 shadow-sm';
    if (p === 'Low') return 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
    return 'bg-amber-500 text-white border-amber-600 shadow-sm';
  };

  const renderTask = (task: TaskData, i: number) => (
    <motion.div
      key={task._id || task.id || i}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg transition-all hover:shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-white"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{task.title || task.name || 'Untitled task'}</h3>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {subs.find(s => (s._id === task.subjectId || s.id === task.subjectId))?.name || 'Study Block'}
        </p>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-white/5 dark:text-slate-400">Due {task.dueDate || 'Soon'}</span>
          <span className={`rounded-full px-2 py-1 font-bold uppercase tracking-wider text-[10px] ${priorityColor(task.priority)}`}>{task.priority || 'Medium'}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={async () => {
            const next = !(task.completed || task.done);
            setList((prev) => prev.map((t) => (t._id === task._id ? { ...t, completed: next, done: next } : t)));
            try {
              await tasks.update(task._id || task.id || '', { ...task, completed: next, done: next });
            } catch { /* ignore */ }
          }}
          className="rounded-full border border-slate-400 px-3 py-1 text-xs font-semibold text-slate-800 transition-all hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {task.completed || task.done ? 'Mark todo' : 'Mark done'}
        </button>
        <button
          onClick={async () => {
            setList(prev => prev.filter(t => t._id !== task._id && t.id !== task.id));
            try { await tasks.remove(task._id || task.id || ''); } catch { /* ignore */ }
          }}
          className="rounded-full border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-50 dark:border-rose-500/50 dark:text-rose-300 dark:hover:bg-rose-950/30"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">Taskboard</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Break down work into doable pieces</h2>
        </div>
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task"
            className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="">Select Subject</option>
            {subs.map((s) => (
              <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            onClick={addTask}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-400"
          >
            Add
          </button>
        </div>
      </div>

      {list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          No tasks yet. Add one to get started.
        </div>
      )}
      
      {list.filter(t => !t.completed && !t.done).length > 0 && (
        <div className="mb-4">
          <h3 className="mb-3 font-semibold text-slate-700 dark:text-slate-300">Pending</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {list.filter(t => !t.completed && !t.done).map((task, i) => renderTask(task, i))}
          </div>
        </div>
      )}

      {list.filter(t => t.completed || t.done).length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 font-semibold text-slate-700 dark:text-slate-300">Completed</h3>
          <div className="grid gap-3 md:grid-cols-2 opacity-70">
            {list.filter(t => t.completed || t.done).map((task, i) => renderTask(task, i))}
          </div>
        </div>
      )}
    </section>
  );
}
