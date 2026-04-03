import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const valid = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError('Email and password are required.');
    if (!valid(email)) return setError('Enter a valid email.');
    if (password.length < 6) return setError('Password should be at least 6 characters.');
    setError('');
    try {
      await register(email, password);
      setSuccess('Registration Successful');
      setTimeout(() => navigate('/dashboard', { replace: true }), 300);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-8 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900/80 dark:text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">Join StudyHub</p>
        <h1 className="text-2xl font-semibold">Create your account</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="you@school.edu"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        {success && <p className="text-sm text-emerald-500">{success}</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
        >
          Sign up
        </button>
      </form>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-500 underline dark:text-indigo-300">
          Login
        </Link>
      </p>
    </div>
  );
}
