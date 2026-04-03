import { SunIcon, MoonIcon } from '@radix-ui/react-icons';

type Props = { mode: 'dark' | 'light'; onToggle: () => void };

export default function ThemeToggle({ mode, onToggle }: Props) {
  const dark = mode === 'dark';
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center rounded-full border border-slate-300 bg-white p-2 text-slate-800 shadow-sm transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100"
      aria-label="Toggle theme"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
