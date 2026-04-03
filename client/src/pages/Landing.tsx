import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const featureList = [
  { title: 'Study Timer', desc: 'Log focused sessions that sync to your analytics.', icon: '⏱️' },
  { title: 'Project Planning', desc: 'Break work into milestones and deadlines.', icon: '📂' },
  { title: 'Focus Management', desc: 'Plan the next thing to do and stay on track.', icon: '🎯' },
  { title: 'AI Assistant', desc: 'Turn a syllabus into tasks in one click.', icon: '✨' }
];

export default function Landing() {
  return (
    <div className="space-y-12 pb-12">
      <HeroSection />

      <section className="grid gap-4 md:grid-cols-2">
        {featureList.map((f, i) => (
          <FeatureCard key={f.title} title={f.title} description={f.desc} icon={f.icon} delay={i * 0.05} />
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How it helps students</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard title="Stay organized" description="Subjects, tasks, and projects in one calm place." icon="📘" />
          <FeatureCard title="Focused planning" description="Plan the day, start the timer, see real minutes logged." icon="🧭" />
          <FeatureCard title="Smart features" description="AI drafting, reminders, and quick adds reduce busywork." icon="⚡" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Focused planning</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard title="Plan your week" description="Drag priorities, set due dates, and keep a calm weekly list." icon="🗓️" />
          <FeatureCard title="Study smarter" description="Run a timer for each subject and see where your minutes go." icon="📊" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Smart features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard title="AI assistant" description="Turn a syllabus into tasks in one click." icon="✨" />
          <FeatureCard title="Reminders" description="Stay on top of deadlines with gentle nudges." icon="🔔" />
          <FeatureCard title="Analytics" description="See real minutes logged per subject." icon="📈" />
        </div>
      </section>

      <Testimonials />
      <Footer />
    </div>
  );
}
