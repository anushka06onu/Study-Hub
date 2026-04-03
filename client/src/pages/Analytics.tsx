import { motion } from 'framer-motion';

const stats = [
  { label: 'Daily average', value: '54 min', detail: 'Across last 7 days' },
  { label: 'Weekly total', value: '6.3 h', detail: 'Week 14 · Spring' },
  { label: 'Monthly focus', value: '24 sessions', detail: 'Logged in March' }
];

const spark = [40, 55, 70, 60, 90, 75, 88];

export default function Analytics() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Analytics</p>
          <h2 className="text-2xl font-semibold text-white">See how your study time stacks up</h2>
        </div>
        <button className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-400">Export</button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-lg"
          >
            <p className="text-sm text-slate-400">{item.label}</p>
            <div className="mt-2 text-3xl font-semibold text-white">{item.value}</div>
            <p className="text-xs text-slate-500">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Focus curve</h3>
          <span className="text-xs text-slate-400">Last 7 days</span>
        </div>
        <div className="mt-4 flex h-32 items-end gap-2">
          {spark.map((h, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 120 }}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-slate-700 to-indigo-500"
              style={{ minHeight: '20%' }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
