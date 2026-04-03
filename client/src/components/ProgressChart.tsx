import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

type Props = { data?: { label: string; minutes: number }[] };

const colors = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b'];

export default function ProgressChart({ data = [] }: Props) {
  const empty = !data.length;

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Weekly focus time</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">updated from your sessions</span>
      </div>

      {empty ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <span>No sessions tracked yet.</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Start a focus timer to see your chart fill up.</span>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-slate-600 dark:text-slate-300">Minutes logged per day</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', color: '#e2e8f0' }} labelStyle={{ color: '#e2e8f0' }} />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={colors[idx % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
