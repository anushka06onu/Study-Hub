import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await auth.forgotPassword(email);
      setMsg({ type: 'success', text: 'OTP sent! Check your console (Mock).' });
      setStep(2);
    } catch (err: any) {
      setMsg({ type: 'error', text: 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await auth.resetPassword({ email, otp, newPassword });
      setMsg({ type: 'success', text: 'Password reset successful!' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Reset failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 sm:mt-16 space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900/80">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      
      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Enter your email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <button disabled={loading} className="w-full rounded-xl bg-indigo-500 py-2 font-semibold text-white">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">OTP Code</label>
            <input 
              required 
              value={otp} 
              onChange={e => setOtp(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">New Password</label>
            <input 
              type="password" 
              required 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <button disabled={loading} className="w-full rounded-xl bg-emerald-500 py-2 font-semibold text-white">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {msg.text && (
        <p className={`text-sm ${msg.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>{msg.text}</p>
      )}

      <p className="text-sm text-center">
        Remembered? <Link to="/login" className="text-indigo-500 underline">Back to Login</Link>
      </p>
    </div>
  );
}
