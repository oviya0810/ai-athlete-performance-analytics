import React from 'react';
import { STATE_BUDGET_DATA } from '../../lib/aiHeuristics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Landmark, TrendingUp } from 'lucide-react';

export const BudgetInsightsPanel: React.FC = () => {
  const totalBudget = STATE_BUDGET_DATA.reduce((s, d) => s + d.budgetAllocatedCr, 0);
  const totalAthletes = STATE_BUDGET_DATA.reduce((s, d) => s + d.athletesRegistered, 0);
  const avgUtilization = Math.round(STATE_BUDGET_DATA.reduce((s, d) => s + d.budgetUtilizedPercent, 0) / STATE_BUDGET_DATA.length);

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
          Admin Tools • Budget & Resource Insights
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Landmark className="w-7 h-7 text-amber-400" />
          State-wise Budget & Resource Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Compare allocated budget, utilization, and academy capacity across states to guide resource decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Allocated Budget</span>
          <div className="text-2xl font-black text-white font-['Outfit']">₹{totalBudget.toFixed(1)} Cr</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Athletes Covered</span>
          <div className="text-2xl font-black text-blue-400 font-['Outfit']">{totalAthletes.toLocaleString()}</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Avg Utilization</span>
          <div className="text-2xl font-black text-green-400 font-['Outfit']">{avgUtilization}%</div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800" style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={STATE_BUDGET_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="state" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" interval={0} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="budgetAllocatedCr" name="Budget Allocated (₹Cr)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="budgetUtilizedPercent" name="Utilization %" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-800">
              <th className="pb-2 pr-4">State</th>
              <th className="pb-2 pr-4">Athletes</th>
              <th className="pb-2 pr-4">Budget (₹Cr)</th>
              <th className="pb-2 pr-4">Utilization</th>
              <th className="pb-2">Academies</th>
            </tr>
          </thead>
          <tbody>
            {STATE_BUDGET_DATA.map((d) => (
              <tr key={d.state} className="border-b border-slate-800/60">
                <td className="py-2 pr-4 text-white font-semibold">{d.state}</td>
                <td className="py-2 pr-4 text-slate-300">{d.athletesRegistered.toLocaleString()}</td>
                <td className="py-2 pr-4 text-slate-300">₹{d.budgetAllocatedCr}</td>
                <td className="py-2 pr-4">
                  <span className={d.budgetUtilizedPercent > 85 ? 'text-green-400' : d.budgetUtilizedPercent > 70 ? 'text-amber-400' : 'text-red-400'}>
                    {d.budgetUtilizedPercent}%
                  </span>
                </td>
                <td className="py-2 text-slate-300">{d.academiesCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
