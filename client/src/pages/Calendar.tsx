import { motion } from 'framer-motion';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const entries = [
  { day: 'Tue', label: 'Study group', time: '4:30p' },
  { day: 'Thu', label: 'Quiz review', time: '9:00a' },
  { day: 'Sat', label: 'Thesis block', time: '11:00a' }
];

export default function Calendar() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Calendar</p>
          <h2 className="text-2xl font-semibold text-white">Anchor tasks to your week</h2>
        </div>
        <button className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Add event</button>
      </div>

      <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-lg">
        <div className="grid grid-cols-7 gap-3 text-center text-sm text-slate-300">
          {days.map((d) => (
            <div key={d} className="rounded-xl border border-slate-800/60 bg-slate-950/50 px-2 py-3">
              <div className="mb-2 text-xs text-slate-500">{d}</div>
              <div className="flex flex-col gap-2">
                {entries
                  .filter((e) => e.day === d)
                  .map((e) => (
                    <motion.div
                      key={e.label}
                      whileHover={{ scale: 1.02 }}
                      className="rounded-lg bg-indigo-500/80 px-2 py-1 text-xs text-white shadow"
                    >
                      <div className="font-semibold">{e.label}</div>
                      <div className="text-[10px] uppercase tracking-wide">{e.time}</div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
