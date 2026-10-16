import React, { useEffect, useState } from 'react';
import { getAuditLog, AuditEntry } from '../../lib/auditLog';
import { History, LogIn, UserPlus, ShieldCheck, Megaphone, Settings2 } from 'lucide-react';

const categoryMeta: Record<AuditEntry['category'], { icon: React.ReactNode; color: string }> = {
  auth: { icon: <LogIn className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  user_management: { icon: <UserPlus className="w-3.5 h-3.5" />, color: 'text-green-400' },
  verification: { icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  broadcast: { icon: <Megaphone className="w-3.5 h-3.5" />, color: 'text-purple-300' },
  system: { icon: <Settings2 className="w-3.5 h-3.5" />, color: 'text-slate-400' }
};

export const AuditLogPanel: React.FC = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState<AuditEntry['category'] | 'all'>('all');

  useEffect(() => {
    setEntries(getAuditLog());
  }, []);

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-500/15 text-slate-300 border border-slate-500/30">
          Admin Tools • Audit Log
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <History className="w-7 h-7 text-slate-300" />
          Audit Log / Activity Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Full accountability trail — logins, account creation, verifications, and announcements across the platform.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'auth', 'user_management', 'verification', 'broadcast'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border capitalize ${
              filter === f ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            No activity logged yet — logins, account creation, and video verdicts will appear here as they happen.
          </p>
        ) : (
          filtered.map((e) => (
            <div key={e.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className={categoryMeta[e.category].color}>{categoryMeta[e.category].icon}</span>
                <div>
                  <div className="text-xs text-slate-200">{e.action}</div>
                  <div className="text-[10px] text-slate-500">by {e.actor}</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">{e.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
