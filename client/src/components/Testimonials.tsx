import { motion } from 'framer-motion';

const quotes = [
  {
    name: 'Amina · CS undergrad',
    text: 'StudyHub keeps me honest with my focus time and makes planning finals week way less scary.'
  },
  {
    name: 'Luis · Med student',
    text: 'The timer + tasks combo feels like a calm Todoist for school. Dark mode is 🔥.'
  },
  {
    name: 'Priya · MBA',
    text: 'I drop the syllabus in AI and get a ready-to-go task list. Huge time saver.'
  }
];

export default function Testimonials() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">What students say</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">Built for real study weeks</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map((q, i) => (
          <motion.blockquote
            key={q.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/3 to-indigo-500/5" />
            <div className="relative space-y-3">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">“{q.text}”</p>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-200">{q.name}</span>
            </div>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

