import React from 'react';
import { STATE_HEATMAP_DATA } from '../../data/mockData';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Map, BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export const TalentAnalyticsDashboard: React.FC = () => {
  const SPORT_DISTRIBUTION = [
    { name: 'Athletics (Sprints & Jumps)', value: 34, color: '#2563EB' },
    { name: 'Wrestling & Kabaddi', value: 26, color: '#22C55E' },
    { name: 'Football & Hockey', value: 22, color: '#F59E0B' },
    { name: 'Volleyball & Basketball', value: 18, color: '#8B5CF6' }
  ];

  const AGE_DISTRIBUTION = [
    { ageGroup: '12-14 Yrs', athletes: 12400 },
    { ageGroup: '15-17 Yrs', athletes: 21800 },
    { ageGroup: '18-20 Yrs', athletes: 11900 },
    { ageGroup: '21-23 Yrs', athletes: 4800 }
  ];

  const PERFORMANCE_TRENDS = [
    { quarter: 'Q1 2025', avgScore: 81.2 },
    { quarter: 'Q2 2025', avgScore: 83.5 },
    { quarter: 'Q3 2025', avgScore: 85.9 },
    { quarter: 'Q4 2025', avgScore: 87.4 },
    { quarter: 'Q1 2026', avgScore: 89.1 },
    { quarter: 'Q2 2026', avgScore: 91.3 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            NATIONAL INTELLIGENCE & ANALYTICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
            India Talent Heatmap & Demographics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Aggregated sports performance statistics across 28+ states and 600+ districts.
          </p>
        </div>
      </div>

      {/* Heatmap & State Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Table: India State Heatmap */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">India State Talent Density</h3>
            <span className="text-xs text-slate-400">Top 10 High-Yield States</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase">
                  <th className="py-3 px-3">State</th>
                  <th className="py-3 px-3">Athletes Assessed</th>
                  <th className="py-3 px-3">Avg AI Score</th>
                  <th className="py-3 px-3">Dominant Discipline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {STATE_HEATMAP_DATA.map((st) => (
                  <tr key={st.state} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-white">{st.state}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{st.athletesCount.toLocaleString()}</td>
                    <td className="py-3 px-3 font-black text-green-400">{st.averageScore}</td>
                    <td className="py-3 px-3 text-blue-400 font-semibold">{st.topSport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Pie Chart: Sport Distribution */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">National Sport Distribution</h3>
            <p className="text-xs text-slate-400">AI recommended pathways across all candidates</p>
          </div>

          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SPORT_DISTRIBUTION}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {SPORT_DISTRIBUTION.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {SPORT_DISTRIBUTION.map((s) => (
              <div key={s.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-300 truncate">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Graphs Grid: Age Distribution & Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Age Distribution Bar Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-['Outfit']">Athlete Age Demographics</h3>
          <p className="text-xs text-slate-400">Concentration of talent in grassroots age brackets</p>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGE_DISTRIBUTION}>
                <XAxis dataKey="ageGroup" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="athletes" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Trends Line Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-['Outfit']">Quarterly National Performance Trend</h3>
          <p className="text-xs text-slate-400">Average AI talent index improvement over 6 quarters</p>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PERFORMANCE_TRENDS}>
                <XAxis dataKey="quarter" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" domain={[70, 100]} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="avgScore" stroke="#22C55E" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
