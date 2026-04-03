import { motion } from 'framer-motion';

type Props = {
  title: string;
  subject: string;
  status?: 'todo' | 'in-progress' | 'done';
  due?: string;
  onComplete?: () => void;
  onDelete?: () => void;
};

const statusColor: Record<NonNullable<Props['status']>, string> = {
  todo: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
  'in-progress': 'bg-amber-100 text-amber-900 dark:bg-amber-500 dark:text-amber-950',
  done: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500 dark:text-emerald-950'
};

export default function TaskCard({ title, subject, status = 'todo', due = 'Today', onComplete, onDelete }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-white"
    >
      <div className="space-y-1">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-300">{subject}</p>
        <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/5">Due {due}</span>
          <span className={`rounded-full px-2 py-1 ${statusColor[status]}`}>{status}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onComplete}
          className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-800 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:text-white"
        >
          {status === 'done' ? 'Mark todo' : 'Mark done'}
        </button>
        <button
          onClick={onDelete}
          className="rounded-full border border-rose-300 px-3 py-1 text-xs text-rose-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-rose-500/70 dark:text-rose-200"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
