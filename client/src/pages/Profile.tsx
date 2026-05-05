import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { subjects, tasks, auth } from '../utils/api';
import { useLocation } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
  const [name, setName] = useState(user?.name || user?.email?.split('@')[0] || '');
  const [email] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({ subjects: 0, tasks: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    subjects.list().then(r => setStats(s => ({ ...s, subjects: r.data?.length || 0 })));
    tasks.list().then(r => setStats(s => ({ ...s, tasks: r.data?.filter((t: any) => t.completed || t.done).length || 0 })));
    
    const savedAvatar = localStorage.getItem(`avatar_${user?.email}`);
    if (savedAvatar) setAvatar(savedAvatar);
  }, [user, location.pathname]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        if (user?.email) localStorage.setItem(`avatar_${user.email}`, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
      const { data } = await auth.updateProfile({ 
        name, 
        currentPassword: currentPassword || undefined, 
        newPassword: password || undefined 
      });
      setMsg({ type: 'success', text: data.message });
      setPassword('');
      setCurrentPassword('');
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <div className="text-xs uppercase tracking-widest text-slate-500">Member since 2026</div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: Avatar & Quick Info */}
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-indigo-500/20 bg-slate-100 dark:bg-slate-800">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-slate-400">
                    {name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100"
              >
                <span className="text-xs font-semibold text-white">Change Photo</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>
          
          <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subjects</span>
              <span className="font-semibold">{stats.subjects}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Tasks Completed</span>
              <span className="font-semibold">{stats.tasks}</span>
            </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Display Name</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Email Address</label>
                <input 
                  disabled 
                  value={email}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Current Password</label>
                <input 
                  type="password"
                  placeholder="Required to change password"
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">New Password</label>
                <input 
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            {msg.text && (
              <div className={`rounded-xl p-3 text-sm ${msg.type === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700'}`}>
                {msg.text}
              </div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

