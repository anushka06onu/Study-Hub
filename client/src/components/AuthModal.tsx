import { useState } from 'react';
import { auth } from '../utils/api';

type Props = { onClose: () => void; onSuccess: () => void };

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    try {
      if (mode === 'login') {
        const res = await auth.login({ email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        const res = await auth.register({ name, email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      onSuccess();
      onClose();
    } catch (e) {
      setError('Auth failed. Check credentials.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{mode === 'login' ? 'Login' : 'Register'}</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            x
          </button>
        </div>
        {mode === 'register' && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="mb-2 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-2 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-3 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
        />
        {error && <p className="mb-2 text-sm text-rose-400">{error}</p>}
        <button onClick={submit} className="w-full rounded bg-indigo-600 px-3 py-2 text-white">
          {mode === 'login' ? 'Login' : 'Create account'}
        </button>
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="mt-2 w-full rounded border border-slate-700 px-3 py-2 text-sm text-slate-300"
        >
          {mode === 'login' ? "Don't have account? Register" : 'Already have account? Login'}
        </button>
      </div>
    </div>
  );
}
