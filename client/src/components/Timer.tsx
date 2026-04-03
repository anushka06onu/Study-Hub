import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sessions } from '../utils/api';

type Props = { label?: string; subjectId?: string; onStop?: (seconds: number) => void };

export default function Timer({ label = 'Current Session', subjectId, onStop }: Props) {
  const [seconds, setSeconds] = useState(0);
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
    if (!subjectId) {
      setError('Pick a subject to start tracking.');
      return;
    }
    try {
      const { data } = await sessions.start(subjectId);
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">{label}</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Focus timer</h3>
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
