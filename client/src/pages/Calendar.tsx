import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { tasks as taskApi, subjects as subjectApi } from '../utils/api';
import { TaskData, SubjectData } from '../types';
import { useAuth } from '../context/AuthContext';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Calendar() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newSub, setNewSub] = useState('');
  const { user } = useAuth();
  const isTestAccount = user?.email === 'test@example.com';

  useEffect(() => {
    taskApi.list().then(r => setTasks(r.data || [])).catch(() => {});
    subjectApi.list().then(r => setSubjects(r.data || [])).catch(() => {});
  }, []);

  const entries = useMemo(() => {
    if (isTestAccount && tasks.length === 0) {
      return [
        { day: 'Tue', label: 'Study group', time: '4:30p' },
        { day: 'Thu', label: 'Quiz review', time: '9:00a' },
        { day: 'Sat', label: 'Thesis block', time: '11:00a' }
      ];
    }
    
    return tasks.filter(t => t.dueDate).map(t => {
      const d = new Date(t.dueDate!);
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        label: t.title || t.name,
        time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
      };
    });
  }, [tasks, isTestAccount]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await taskApi.create({ title: newTitle, dueDate: newDate, subjectId: newSub });
      setTasks([...tasks, data]);
      setShowModal(false);
      setNewTitle('');
    } catch (err) {
      alert('Failed to add task');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Calendar</p>
          <h2 className="text-2xl font-semibold">Weekly Study Anchor</h2>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-400 transition"
        >
          Add event
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70 overflow-x-auto">
        <div className="grid grid-cols-7 gap-4 min-w-[700px] text-center text-sm">
          {days.map((d) => (
            <div key={d} className="rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/30 p-2 min-h-[300px]">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{d}</div>
              <div className="flex flex-col gap-2">
                {entries
                  .filter((e) => e.day === d)
                  .map((e, i) => (
                    <motion.div
                      key={`${e.label}-${i}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-xl bg-indigo-500 p-2 text-left text-xs text-white shadow-md cursor-default"
                    >
                      <div className="font-bold truncate">{e.label}</div>
                      <div className="mt-1 text-[10px] opacity-80">{e.time}</div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.form 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onSubmit={addTask}
              className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900"
            >
              <h3 className="text-xl font-bold">New Scheduled Task</h3>
              <div className="space-y-4">
                <input 
                  required
                  placeholder="Task Name"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
                />
                <input 
                  required
                  type="datetime-local"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
                />
                <select 
                  required
                  value={newSub}
                  onChange={e => setNewSub(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-slate-300 py-2">Cancel</button>
                <button type="submit" className="flex-1 rounded-xl bg-indigo-500 py-2 text-white font-bold">Add to Calendar</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
