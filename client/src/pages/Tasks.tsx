import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { tasks } from '../utils/api';
import { TaskData } from '../types';

export default function Tasks() {
  const [list, setList] = useState<TaskData[]>([]);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');

  useEffect(() => {
    tasks
      .list()
      .then((r) => setList(r.data || []))
      .catch(() => setList([]));
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    const payload: TaskData = { title, subjectId, done: false, dueDate: new Date().toISOString().slice(0, 10) };
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
          <input
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            placeholder="Subject id (optional)"
            className="w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button
            onClick={addTask}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-400"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No tasks yet. Add one to get started.
          </div>
        ) : (
          list.map((task, i) => (
            <motion.div
              key={task._id || task.id || i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-white"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{task.title || task.name || 'Untitled task'}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{task.subjectId || 'No subject'}</p>
                <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/5">Due {task.dueDate || 'Soon'}</span>
                  <span className={`rounded-full px-2 py-1 ${task.completed || task.done ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500 dark:text-emerald-950' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100'}`}>
                    {task.completed || task.done ? 'done' : 'todo'}
                  </span>
                </div>
              </div>
              <button
                onClick={async () => {
                  const next = !(task.completed || task.done);
                  setList((prev) => prev.map((t) => (t._id === task._id ? { ...t, completed: next, done: next } : t)));
                  try {
                    await tasks.update(task._id || task.id || '', { ...task, completed: next, done: next });
                  } catch {
                    /* ignore */
                  }
                }}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-800 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200"
              >
                {task.completed || task.done ? 'Mark todo' : 'Mark done'}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
