export default function Footer() {
  return (
    <footer className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">StudyHub</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Designed &amp; built by{' '}
            <a href="https://fatehahossainanushka.vercel.app/" className="text-indigo-500 underline" target="_blank" rel="noreferrer">
              Fateha Hossain Anushka
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-semibold">Features</p>
            <p className="text-slate-500 dark:text-slate-400">Timer · Tasks · Projects · Analytics</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Resources</p>
            <p className="text-slate-500 dark:text-slate-400">Docs · Changelog · Support</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
