import React, { useMemo } from 'react';
import { User } from '../../types';
import { getRelevantEvents } from '../../lib/aiHeuristics';
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react';

interface CompetitionCalendarPageProps {
  user: User;
}

const levelBadge: Record<string, string> = {
  District: 'bg-green-500/15 text-green-400 border-green-500/30',
  State: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  National: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
};

export const CompetitionCalendarPage: React.FC<CompetitionCalendarPageProps> = ({ user }) => {
  const events = useMemo(() => getRelevantEvents(user), [user]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
          Opportunities • Competition & Trial Calendar
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-amber-400" />
          Competition & Trial Calendar
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Upcoming trials and competitions matched to your sport ({user.preferredSport || 'Athletics'}) and state ({user.state || '—'}).
        </p>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center text-sm text-slate-400">
            No upcoming events matched yet — update your profile's state and preferred sport to see relevant trials.
          </div>
        ) : (
          events.map((e) => (
            <div key={e.id} className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">{e.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${levelBadge[e.level]}`}>{e.level}</span>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {e.state} • {e.sport}
                </span>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-white">
                  {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <a
                  href={e.registrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 justify-end mt-1"
                >
                  Register <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
