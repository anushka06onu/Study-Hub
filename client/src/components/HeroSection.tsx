import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-600/90 via-indigo-500/80 to-sky-500/80 px-6 py-12 text-white shadow-2xl dark:border-slate-800">
      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-100/80">StudyHub</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Plan, focus, and finish with confidence.</h1>
        <p className="max-w-2xl text-lg text-indigo-50/90">
          A calm, Todoist-inspired workspace for students. Capture tasks, run focus sessions, and see your study time turn into progress.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white/15 px-3 py-1">Focus timer</span>
          <span className="rounded-full bg-white/15 px-3 py-1">Projects & subjects</span>
          <span className="rounded-full bg-white/15 px-3 py-1">AI task drafting</span>
          <span className="rounded-full bg-white/15 px-3 py-1">Smart analytics</span>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/register"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
          >
            Get started free
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

