import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sessions } from '../utils/api';
import { SubjectData } from '../types';

type Props = { label?: string; subjectId?: string; subjects?: SubjectData[]; onStop?: (seconds: number) => void };

export default function Timer({ label = 'Current Session', subjectId: initialSubjectId, subjects, onStop }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(initialSubjectId || '');

  useEffect(() => {
    if (initialSubjectId && !selectedSubject) setSelectedSubject(initialSubjectId);
  }, [initialSubjectId]);
  const [running, setRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = async () => {
    setError('');
    const idToUse = selectedSubject || initialSubjectId;
    if (!idToUse) {
      setError('Pick a subject to start tracking.');
      return;
    }
    try {
      const { data } = await sessions.start(idToUse);
      setSessionId(data._id || data.id);
    } catch {
      // ignore, still start locally
    }
    setRunning(true);
  };

  const pause = async () => {
    setRunning(false);
    if (sessionId) {
      try {
        await sessions.pause(sessionId, Math.round(seconds / 60));
      } catch {
        /* silent */
      }
    }
  };

  const stop = async () => {
    setRunning(false);
    if (sessionId) {
      try {
        await sessions.end(sessionId, Math.round(seconds / 60));
      } catch {
        /* silent */
      }
    }
    onStop?.(seconds);
    setSeconds(0);
    setSessionId(null);
  };

  const clock = new Date(seconds * 1000).toISOString().substring(11, 19);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-white">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">{label}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Focus timer</h3>
            {subjects && subjects.length > 0 && !running && (
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="appearance-none mt-1 sm:mt-0 w-full sm:w-40 rounded-full border-2 border-indigo-500/20 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold text-indigo-700 transition-all hover:border-indigo-500/40 hover:bg-indigo-50 focus:border-indigo-500 focus:outline-none dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                >
                  <option value="">Select subject...</option>
                  {subjects.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}
            {subjects && subjects.length > 0 && running && (
               <div className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1.5 border border-indigo-500/20">
                 <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
                    {subjects.find(s => String(s._id || s.id) === String(selectedSubject))?.name || 'Focusing'}
                  </span>
               </div>
            )}
          </div>
          {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}
        </div>
        <motion.div
          animate={{ scale: running ? 1.05 : 1, opacity: running ? 1 : 0.7 }}
          className="rounded-full bg-slate-900/5 px-4 py-2 text-lg font-mono text-indigo-600 dark:bg-white/5 dark:text-indigo-100"
        >
          {clock}
        </motion.div>
      </div>
      <div className="mt-4 flex gap-2">
        {!running && (
          <button
            onClick={start}
            className="flex-1 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-950 shadow hover:brightness-105"
          >
            Start
          </button>
        )}
        {running && (
          <>
            <button
              onClick={pause}
              className="flex-1 rounded-full border border-amber-400 px-3 py-2 text-sm font-semibold text-amber-100 hover:border-amber-300"
            >
              Pause
            </button>
            <button
              onClick={stop}
              className="flex-1 rounded-full border border-rose-500 px-3 py-2 text-sm font-semibold text-rose-100 hover:border-rose-400"
            >
              End
            </button>
          </>
        )}
        {!running && sessionId && (
          <button
            onClick={stop}
            className="flex-1 rounded-full border border-rose-500 px-3 py-2 text-sm font-semibold text-rose-100 hover:border-rose-400"
          >
            End
          </button>
        )}
      </div>
    </div>
  );
}
