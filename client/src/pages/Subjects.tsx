import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { subjects } from '../utils/api';
import { SubjectData } from '../types';

export default function Subjects() {
  const [list, setList] = useState<SubjectData[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    subjects
      .list()
      .then((r) => setList(r.data || []))
      .catch(() => setList([]));
  }, []);

  const addSubject = async () => {
    if (!name.trim()) return;
    try {
      const { data } = await subjects.create({ name });
      setList((prev) => [data, ...prev]);
    } catch {
      setList((prev) => [{ id: `${Date.now()}`, name }, ...prev]);
    }
    setName('');
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">Subjects</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Organize courses & study areas</h2>
        </div>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New subject"
            className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-400" onClick={addSubject}>
            Add
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No subjects yet. Create one to start tracking.
          </div>
        ) : (
          list.map((sub, i) => (
            <motion.div
              key={sub._id || sub.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-white"
            >
              <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-br from-indigo-500 to-sky-500" />
              <div className="relative space-y-2">
                <h3 className="text-lg font-semibold">{sub.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{sub.description || 'Focus block for this course.'}</p>
                <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/5">Total time: {sub.totalStudyTime || sub.totalMinutes || 0}m</span>
                  <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/5">Status: Active</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
