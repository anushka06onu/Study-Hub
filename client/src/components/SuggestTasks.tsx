import { useState, useEffect } from 'react';
import { tasks, subjects as subjectApi, ai } from '../utils/api';
import { TaskData, SubjectData } from '../types';

type Suggestion = { title: string; due: string; effort: string; subject?: string };

export default function SuggestTasks() {
  const [subject, setSubject] = useState('');
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [subs, setSubs] = useState<SubjectData[]>([]);
  const [selectedSub, setSelectedSub] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    subjectApi.list().then(r => {
      setSubs(r.data || []);
      if (r.data?.length > 0) setSelectedSub(r.data[0]._id || r.data[0].id);
    }).catch(() => {});
  }, []);

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

  const addTaskFromAI = async (s: Suggestion) => {
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
      // Optionally notify user or refresh dashboard
    } catch (err) {
      setError('Failed to create task from suggestion');
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
        {suggestions.length > 0 && (
          <div className="mb-2">
            <label className="text-xs text-slate-400">Assign to Subject:</label>
            <select
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
            >
              <option value="">No subject</option>
              {subs.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
            </select>
          </div>
        )}
        {suggestions.map((s, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-slate-800/70 bg-slate-800/60 px-3 py-2 text-sm text-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{s.title}</span>
              <button 
                onClick={() => addTaskFromAI(s)}
                className="rounded bg-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300 hover:bg-indigo-500 hover:text-white"
              >
                Add
              </button>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{s.due}</span>
              <span>Effort: {s.effort}</span>
            </div>
          </div>
        ))}
        {!suggestions.length && <p className="text-sm text-slate-500">No suggestions yet.</p>}
      </div>
    </div>
  );
}
