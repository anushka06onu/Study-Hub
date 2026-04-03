import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasks, subjects } from '../utils/api';
import { SubjectData, TaskData } from '../types';
import TaskRow from '../components/TaskRow';

export default function SubjectDetail() {
  const { id } = useParams();
  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [taskList, setTaskList] = useState<TaskData[]>([]);
  const [taskName, setTaskName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    subjects.list().then((r)=>setSubject(r.data.find((x:SubjectData)=>x.id===id)||null)).catch(()=>{});
    tasks.list(id).then((r)=>setTaskList(r.data)).catch(()=>setTaskList([]));
  }, [id]);

  const saveTask = () => {
    if (!id || !taskName.trim()) return;
    const newTask: TaskData = { id: `${Date.now()}`, subjectId: id, title: taskName, done: false, dueDate: new Date().toISOString().slice(0,10) };
    tasks.create(id, newTask).then((r)=>setTaskList((p)=>[...p,r.data])).catch(()=>setTaskList((p)=>[...p,newTask]));
    setTaskName('');
  };

  if (!subject) return <div className="rounded-xl border p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/dashboard')} className="rounded bg-slate-700 px-3 py-1">Back</button>
      <h2 className="text-2xl font-bold">{subject.name}</h2>
      <div className="rounded-xl border bg-slate-900 p-4">
        <h3 className="text-lg">Tasks</h3>
        <div className="mt-2 flex gap-2">
          <input value={taskName} onChange={(e)=>setTaskName(e.target.value)} placeholder="Task" className="flex-1 rounded border px-2 py-1" />
          <button onClick={saveTask} className="rounded bg-indigo-500 px-3 py-1">Add</button>
        </div>
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={(tid) => {
                  tasks
                    .update(id, tid, { done: !task.done })
                    .then(() => setTaskList((p) => p.map((t) => (t.id === tid ? { ...t, done: !t.done } : t))));
                }}
                onEdit={(t) => {
                  const updated = prompt('title', t.title);
                  if (!updated) return;
                  tasks
                    .update(id, t.id, { ...t, title: updated })
                    .then(() => setTaskList((p) => p.map((x) => (x.id === t.id ? { ...x, title: updated } : x))));
                }}
                onDelete={(tid) => {
                  tasks.remove(id, tid).then(() => setTaskList((p) => p.filter((t) => t.id !== tid)));
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
