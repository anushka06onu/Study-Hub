const fs = require('fs');
const file = 'client/src/pages/Tasks.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const [subjectId, setSubjectId] = useState('');",
  "const [subjectId, setSubjectId] = useState('');\n  const [priority, setPriority] = useState('Medium');"
);

code = code.replace(
  "const payload: TaskData = { title, subjectId, done: false, dueDate: new Date().toISOString().slice(0, 10) };",
  "const payload: TaskData = { title, subjectId, priority, done: false, dueDate: new Date().toISOString().slice(0, 10) };"
);

const selectHTML = `          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="">Select Subject</option>
            {subs.map((s) => (
              <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>`;

code = code.replace(
  /<select[\s\S]*?<\/select>/,
  selectHTML
);

const renderList = `  const priorityColor = (p?: string) => {
    if (p === 'High') return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
    if (p === 'Low') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
  };

  const renderTask = (task: TaskData, i: number) => (
    <motion.div
      key={task._id || task.id || i}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-white"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{task.title || task.name || 'Untitled task'}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {subs.find(s => (s._id === task.subjectId || s.id === task.subjectId))?.name || 'No subject'}
        </p>
        <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/5">Due {task.dueDate || 'Soon'}</span>
          <span className={\`rounded-full px-2 py-1 \${priorityColor(task.priority)}\`}>{task.priority || 'Medium'}</span>
        </div>
      </div>
      <button
        onClick={async () => {
          const next = !(task.completed || task.done);
          setList((prev) => prev.map((t) => (t._id === task._id ? { ...t, completed: next, done: next } : t)));
          try {
            await tasks.update(task._id || task.id || '', { ...task, completed: next, done: next });
          } catch { /* ignore */ }
        }}
        className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-800 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200"
      >
        {task.completed || task.done ? 'Mark todo' : 'Mark done'}
      </button>
    </motion.div>
  );

  return (`;

code = code.replace("  return (", renderList);

const listHTML = `      {list.length === 0 && (
        <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          No tasks yet. Add one to get started.
        </div>
      )}
      
      {list.filter(t => !t.completed && !t.done).length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-slate-700 dark:text-slate-300">Pending</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {list.filter(t => !t.completed && !t.done).map((task, i) => renderTask(task, i))}
          </div>
        </div>
      )}

      {list.filter(t => t.completed || t.done).length > 0 && (
        <div className="mt-8">
          <h3 className="mb-2 font-semibold text-slate-700 dark:text-slate-300">Completed</h3>
          <div className="grid gap-3 md:grid-cols-2 opacity-70">
            {list.filter(t => t.completed || t.done).map((task, i) => renderTask(task, i))}
          </div>
        </div>
      )}`;

code = code.replace(
  /<div className="grid gap-3 md:grid-cols-2">[\s\S]*?<\/div>\n    <\/section>/,
  listHTML + "\n    </section>"
);

fs.writeFileSync(file, code);
