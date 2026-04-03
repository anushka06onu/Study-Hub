import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ai } from '../utils/api';
import TaskCard from './TaskCard';

type Suggestion = { title: string; subject?: string; due?: string };

export default function AIButton() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await ai.suggest({ task: prompt });
      setSuggestions(data?.suggestions || []);
    } catch (e) {
      setError('Could not fetch suggestions right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110"
      >
        ✨ Ask AI
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI task suggestions</h3>
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-white">✕</button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Describe what you need. Example: "My exam is tomorrow for Math, create tasks for this syllabus".</p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Tell StudyHub AI what to plan..."
              />
              {error && <p className="text-sm text-rose-500">{error}</p>}
              <div className="flex justify-end gap-2">
                <button onClick={() => setOpen(false)} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">Cancel</button>
                <button
                  onClick={submit}
                  disabled={loading}
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400 disabled:opacity-60"
                >
                  {loading ? 'Thinking...' : 'Generate'}
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Suggested tasks</p>
                  <div className="grid gap-2">
                    {suggestions.map((s, i) => (
                      <TaskCard key={`${s.title}-${i}`} title={s.title} subject={s.subject || 'AI'} due={s.due || 'Soon'} status="todo" />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

