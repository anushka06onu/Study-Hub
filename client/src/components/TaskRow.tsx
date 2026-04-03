import { TaskData } from '../types';

type Props = { task: TaskData; onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (task: TaskData) => void; };

export default function TaskRow({ task, onToggle, onDelete, onEdit }: Props) {
  return (
    <tr className={task.done ? 'opacity-60' : ''}>
      <td className="px-2 py-1">{task.title}</td>
      <td className="px-2 py-1">{task.dueDate}</td>
      <td className="px-2 py-1">{task.done ? 'Done' : 'Todo'}</td>
      <td className="px-2 py-1 space-x-1">
        <button onClick={() => onToggle(task.id)} className="rounded bg-slate-700 px-2 py-1 text-xs">Toggle</button>
        <button onClick={() => onEdit(task)} className="rounded bg-amber-500 px-2 py-1 text-xs">Edit</button>
        <button onClick={() => onDelete(task.id)} className="rounded bg-rose-500 px-2 py-1 text-xs">Delete</button>
      </td>
    </tr>
  );
}
