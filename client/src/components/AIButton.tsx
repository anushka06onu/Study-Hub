import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tasks, subjects as subjectApi, ai } from '../utils/api';
import { SubjectData, TaskData } from '../types';

type Suggestion = { title: string; subject?: string; due?: string };

export default function AIButton() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [subs, setSubs] = useState<SubjectData[]>([]);
  const [selectedSub, setSelectedSub] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      subjectApi.list().then(r => {
        setSubs(r.data || []);
        if (r.data?.length > 0) setSelectedSub(r.data[0]._id || r.data[0].id);
      }).catch(() => {});
    }
  }, [open]);

  const submit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await ai.suggest({ task: prompt });
      if (data && data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        throw new Error('No suggestions returned');
      }
    } catch (e: any) {
      console.error('AI Button Error:', e);
      setError('AI is busy right now. Please try again or use manual planning.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (s: Suggestion) => {
    try {
      const payload: TaskData = {
        title: s.title,
        subjectId: selectedSub,
        dueDate: new Date().toISOString().split('T')[0],
        done: false,
        priority: 'Medium'
      };
      await tasks.create(payload);
      setSuggestions(prev => prev.filter(item => item.title !== s.title));
    } catch (err) {
      setError('Failed to create task');
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
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Suggested tasks</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">To Subject:</span>
                      <select 
                        value={selectedSub}
                        onChange={e => setSelectedSub(e.target.value)}
                        className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] text-white focus:outline-none"
                      >
                        <option value="">No subject</option>
                        {subs.map(sb => <option key={sb._id || sb.id} value={sb._id || sb.id}>{sb.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {suggestions.map((s, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">{s.title}</p>
                          <p className="text-[10px] text-slate-500">{s.due || 'Upcoming'}</p>
                        </div>
                        <button 
                          onClick={() => addTask(s)}
                          className="rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-bold text-white shadow hover:bg-indigo-400"
                        >
                          Add
                        </button>
                      </div>
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

