import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, verifyRegister } = useAuth();

  const valid = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return setError('All fields are required.');
    if (!valid(email)) return setError('Enter a valid email.');
    if (password.length < 6) return setError('Password should be at least 6 characters.');
    
    setLoading(true);
    setError('');
    try {
      await register(email, password, name);
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp) return setError('OTP is required.');
    
    setLoading(true);
    setError('');
    try {
      await verifyRegister(email, otp);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-8 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900/80 dark:text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">Step {step} of 2</p>
        <h1 className="text-2xl font-semibold">{step === 1 ? 'Create your account' : 'Verify your email'}</h1>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="John Doe"
            />
          </div>
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
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
          >
            {loading ? 'Sending OTP...' : 'Next'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-slate-500">We've sent a 6-digit code to {email}. Check your console (Mock).</p>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">OTP Code</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="123456"
            />
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-400"
          >
            {loading ? 'Verifying...' : 'Complete Registration'}
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-slate-400 hover:underline">Change email/info</button>
        </form>
      )}

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-500 underline dark:text-indigo-300">
          Login
        </Link>
      </p>
    </div>
  );
}
