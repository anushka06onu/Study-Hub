import { useState } from 'react';
import { ai } from '../utils/api';

type Suggestion = { title: string; due: string; effort: string };

export default function SuggestTasks() {
  const [subject, setSubject] = useState('');
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState('');

  const fetchSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await ai.suggest({ subject, task });
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">AI task ideas</h3>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="rounded-lg bg-indigo-500 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
        >
          {loading ? 'Thinking…' : 'Suggest'}
        </button>
      </div>
      <div className="flex gap-2">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (e.g., Linear Algebra)"
          className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        />
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Task focus (e.g., proofs)"
          className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div key={i} className="rounded-xl border border-slate-800/70 bg-slate-800/60 px-3 py-2 text-sm text-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{s.title}</span>
              <span className="text-xs text-slate-400">{s.due}</span>
            </div>
            <p className="text-xs text-slate-300">Effort: {s.effort}</p>
          </div>
        ))}
        {!suggestions.length && <p className="text-sm text-slate-500">No suggestions yet.</p>}
      </div>
    </div>
  );
}
