import React, { useMemo, useState } from 'react';
import { AssessmentResult } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ProgressComparisonPanelProps {
  assessments: AssessmentResult[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#a855f7'];

export const ProgressComparisonPanel: React.FC<ProgressComparisonPanelProps> = ({ assessments }) => {
  const uniqueAthletes = Array.from(new Map(assessments.map((a) => [a.athleteId, a])).values());
  const [selected, setSelected] = useState<string[]>(uniqueAthletes.slice(0, 3).map((a) => a.athleteId));

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev));
  };

  const chartData = useMemo(() => {
    // Build a synthetic weekly progression per selected athlete (demo data only —
    // this app stores single-snapshot assessments, not longitudinal series)
    return Array.from({ length: 6 }, (_, week) => {
      const point: Record<string, number | string> = { week: `Week ${week + 1}` };
      selected.forEach((id) => {
        const a = assessments.find((x) => x.athleteId === id);
        if (a) {
          const base = a.talentScore - 12;
          point[a.athleteName] = Math.round(base + (12 / 5) * week + (week % 2 === 0 ? 1 : -1));
        }
      });
      return point;
    });
  }, [selected, assessments]);

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Coach Tools • Athlete Progress Comparison
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-blue-400" />
          Athlete Progress Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Select up to 5 athletes to compare Talent Score trends side-by-side.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {uniqueAthletes.map((a) => (
          <button
            key={a.athleteId}
            onClick={() => toggle(a.athleteId)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selected.includes(a.athleteId)
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            {a.athleteName}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800" style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} domain={[40, 100]} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {selected.map((id, i) => {
              const a = assessments.find((x) => x.athleteId === id);
              if (!a) return null;
              return (
                <Line key={id} type="monotone" dataKey={a.athleteName} stroke={COLORS[i % COLORS.length]} strokeWidth={2.5} dot={{ r: 3 }} />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-slate-500">
        Demo trend lines interpolated from each athlete's current Talent Score — connect real historical assessments for
        production use.
      </p>
    </div>
  );
};
