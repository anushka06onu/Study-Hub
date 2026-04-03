import { useEffect, useState } from 'react';
import { SessionData, SubjectData } from '../types';

type Props = { selected: SubjectData | null; onStop: (session: SessionData) => void; };

export default function StudyTimer({ selected, onStop }: Props) {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [active]);

  function stop() {
    if (!selected) return;
    const minutes = Math.round(seconds/60);
    const session: SessionData = { id: `${Date.now()}`, subjectId: selected.id, startedAt: new Date(Date.now()-seconds*1000).toISOString(), endedAt: new Date().toISOString(), minutes };
    onStop(session);
    setSeconds(0);
    setActive(false);
  }

  if (!selected) return <div className="rounded-xl border p-4 text-center">Pick a subject first</div>;

  return (
    <div className="rounded-xl border p-4">
      <h4 className="mb-2 font-semibold">Timer for {selected.name}</h4>
      <div className="text-4xl font-bold">{`${Math.floor(seconds/3600).toString().padStart(2,'0')}:${Math.floor((seconds%3600)/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`}</div>
      <div className="mt-3 space-x-2">
        <button onClick={() => setActive(true)} className="rounded bg-green-500 px-3 py-1">Start</button>
        <button onClick={() => setActive(false)} className="rounded bg-yellow-500 px-3 py-1">Pause</button>
        <button onClick={stop} className="rounded bg-red-500 px-3 py-1">Stop</button>
      </div>
    </div>
  );
}
