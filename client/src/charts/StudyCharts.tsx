import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SessionData, SubjectData } from '../types';

type Props = { sessions: SessionData[]; subjects: SubjectData[]; };

export default function StudyCharts({ sessions, subjects }: Props) {
  const daily = subjects.map((s) => ({ name: s.name, value: sessions.filter((x) => x.subjectId === s.id).reduce((a,c)=>a+c.minutes,0) }));
  const weekly = subjects.map((s) => ({ name: s.name, value: sessions.filter((x) => x.subjectId===s.id).reduce((a,c)=>a+c.minutes,0) }));
  const monthly = subjects.map((s)=>({ name:s.name, value: sessions.filter((x)=>x.subjectId===s.id).reduce((a,c)=>a+c.minutes,0)}));

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="rounded-xl border p-3"><h5 className="font-semibold">Daily</h5><ResponsiveContainer width="100%" height={180}><BarChart data={daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#7c3aed" /></BarChart></ResponsiveContainer></div>
      <div className="rounded-xl border p-3"><h5 className="font-semibold">Weekly</h5><ResponsiveContainer width="100%" height={180}><LineChart data={weekly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line dataKey="value" stroke="#38bdf8" /></LineChart></ResponsiveContainer></div>
      <div className="rounded-xl border p-3"><h5 className="font-semibold">Monthly</h5><ResponsiveContainer width="100%" height={180}><PieChart><Pie data={monthly} dataKey="value" nameKey="name" outerRadius={60}><>{monthly.map((v,i)=><Cell key={v.name} fill={[ '#7c3aed','#22c55e','#f97316'][i%3] } />)}</></Pie><Tooltip /></PieChart></ResponsiveContainer></div>
    </div>
  );
}
