import React, { useEffect, useMemo, useState } from 'react';
import { User } from '../../types';
import { Moon, BatteryMedium, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';

interface RecoveryTrackerPageProps {
  user: User;
}

interface RecoveryLog {
  date: string;
  sleepHours: number;
  soreness: number; // 1-10
  energyLevel: number; // 1-10
}

const storageKey = (userId: string) => `sportvision_recovery_${userId}`;

export const RecoveryTrackerPage: React.FC<RecoveryTrackerPageProps> = ({ user }) => {
  const [logs, setLogs] = useState<RecoveryLog[]>([]);
  const [sleepHours, setSleepHours] = useState(7);
  const [soreness, setSoreness] = useState(4);
  const [energyLevel, setEnergyLevel] = useState(6);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      if (raw) setLogs(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [user.id]);

  const saveLog = () => {
    const entry: RecoveryLog = { date: new Date().toLocaleDateString('en-IN'), sleepHours, soreness, energyLevel };
    const updated = [entry, ...logs].slice(0, 14);
    setLogs(updated);
    localStorage.setItem(storageKey(user.id), JSON.stringify(updated));
  };

  const avg = useMemo(() => {
    if (logs.length === 0) return null;
    const n = logs.length;
    return {
      sleep: Math.round((logs.reduce((s, l) => s + l.sleepHours, 0) / n) * 10) / 10,
      soreness: Math.round((logs.reduce((s, l) => s + l.soreness, 0) / n) * 10) / 10,
      energy: Math.round((logs.reduce((s, l) => s + l.energyLevel, 0) / n) * 10) / 10
    };
  }, [logs]);

  const recommendation = useMemo(() => {
    if (!avg) return null;
    if (avg.sleep < 6.5 || avg.soreness > 6.5) {
      return { level: 'high', text: 'High fatigue risk detected. Take a full rest day and prioritize 8+ hours of sleep tonight.' };
    }
    if (avg.sleep < 7.5 || avg.soreness > 5) {
      return { level: 'moderate', text: 'Moderate fatigue building up. Consider a lighter training session and active recovery (stretching, walk).' };
    }
    return { level: 'low', text: "You're well recovered — good to proceed with your normal training intensity." };
  }, [avg]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          Wellness • Recovery & Sleep Tracker
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Moon className="w-7 h-7 text-indigo-300" />
          Recovery & Sleep Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Log daily sleep and soreness — the AI flags overtraining risk before it becomes an injury.
        </p>
      </div>

      {/* Log entry form */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Log Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Sleep Hours: {sleepHours}h</label>
            <input type="range" min={3} max={11} step={0.5} value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Muscle Soreness: {soreness}/10</label>
            <input type="range" min={1} max={10} value={soreness} onChange={(e) => setSoreness(Number(e.target.value))} className="w-full accent-red-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Energy Level: {energyLevel}/10</label>
            <input type="range" min={1} max={10} value={energyLevel} onChange={(e) => setEnergyLevel(Number(e.target.value))} className="w-full accent-green-500" />
          </div>
        </div>
        <button
          onClick={saveLog}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Save Today's Log
        </button>
      </div>

      {/* AI recommendation */}
      {recommendation && (
        <div
          className={`glass-card rounded-2xl p-5 border space-y-2 ${
            recommendation.level === 'high'
              ? 'border-red-500/30'
              : recommendation.level === 'moderate'
              ? 'border-amber-500/30'
              : 'border-green-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {recommendation.level === 'low' ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className={`w-4 h-4 ${recommendation.level === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
            )}
            <span className="text-xs font-bold uppercase text-slate-300">AI Recovery Recommendation</span>
          </div>
          <p className="text-sm text-slate-200">{recommendation.text}</p>
          {avg && (
            <div className="flex gap-4 pt-2 text-[11px] text-slate-400">
              <span>Avg Sleep: <strong className="text-white">{avg.sleep}h</strong></span>
              <span>Avg Soreness: <strong className="text-white">{avg.soreness}/10</strong></span>
              <span>Avg Energy: <strong className="text-white">{avg.energy}/10</strong></span>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <BatteryMedium className="w-4 h-4 text-blue-400" /> Recent Logs
        </h2>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500">No logs yet — save your first entry above.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((l, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                <span className="text-slate-400">{l.date}</span>
                <span>Sleep: <strong className="text-white">{l.sleepHours}h</strong></span>
                <span>Soreness: <strong className="text-white">{l.soreness}/10</strong></span>
                <span>Energy: <strong className="text-white">{l.energyLevel}/10</strong></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
