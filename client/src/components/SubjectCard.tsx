import { motion } from 'framer-motion';
import { SubjectData } from '../types';

type Props = {
  subject: SubjectData | { id?: string; name: string; description?: string; totalMinutes?: number };
  onSelect?: (subject: SubjectData | { id?: string; name: string }) => void;
  onDelete?: (id?: string) => void;
  onEdit?: (subject: SubjectData | { id?: string; name: string }) => void;
};

export default function SubjectCard({ subject, onSelect, onDelete, onEdit }: Props) {
  const minutes = subject.totalMinutes ?? 0;
  const hoursLabel = `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-purple-500/10 opacity-70" />
      <div className="relative flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{subject.name}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">{subject.description || 'Focus block for this course.'}</p>
        </div>
        <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-white/5 dark:text-indigo-100">{hoursLabel}</span>
      </div>
      <div className="relative mt-4 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
        <button
          onClick={() => onSelect?.(subject)}
          className="rounded-full border border-slate-700 px-3 py-1 transition hover:border-indigo-400 hover:text-white"
        >
          Open
        </button>
        <button
          onClick={() => onEdit?.(subject)}
          className="rounded-full border border-amber-400/60 px-3 py-1 text-amber-100 transition hover:border-amber-300"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(subject.id)}
          className="rounded-full border border-rose-500/60 px-3 py-1 text-rose-100 transition hover:border-rose-400"
        >
          Delete
        </button>
      </div>
    </motion.article>
  );
}
