import { motion } from 'framer-motion';

type Props = {
  title: string;
  description: string;
  icon?: string;
  delay?: number;
};

export default function FeatureCard({ title, description, icon = '✨', delay = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-sky-500/5 to-purple-500/5" />
      <div className="relative space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-white/10 dark:text-indigo-100">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </motion.article>
  );
}
