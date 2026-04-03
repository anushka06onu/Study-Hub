type Props = { mode: 'dark' | 'light' };

export default function Settings({ mode }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Settings</p>
        <h2 className="text-2xl font-semibold text-white">Tune StudyHub to your flow</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow">
          <h3 className="text-lg font-semibold text-white">Theme</h3>
          <p className="text-sm text-slate-300">Current mode: {mode === 'dark' ? 'Dark' : 'Light'}. Toggle from the navbar.</p>
        </div>
        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <p className="text-sm text-slate-300">Browser reminders and daily digest (coming soon).</p>
        </div>
      </div>
    </section>
  );
}
