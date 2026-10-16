import React, { useMemo } from 'react';
import { User } from '../../types';
import { matchAcademies } from '../../lib/aiHeuristics';
import { Building2, MapPin, Users, Mail, Star } from 'lucide-react';

interface SportAcademyMatchingPageProps {
  user: User;
}

const tierBadge: Record<string, string> = {
  'National Centre of Excellence': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'SAI Regional Centre': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'State Academy': 'bg-green-500/15 text-green-400 border-green-500/30'
};

export const SportAcademyMatchingPage: React.FC<SportAcademyMatchingPageProps> = ({ user }) => {
  const matches = useMemo(() => matchAcademies(user), [user]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/15 text-green-400 border border-green-500/30">
          AI Matching • Sport Academy Matching System
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Building2 className="w-7 h-7 text-green-400" />
          Sport Academy Matching
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          SAI and state academies ranked for you based on your preferred sport ({user.preferredSport || 'Athletics'}) and
          home state ({user.state || 'not set'}).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.slice(0, 8).map((academy, idx) => (
          <div key={academy.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  {idx === 0 && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  <h3 className="text-sm font-bold text-white">{academy.name}</h3>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {academy.city}, {academy.state}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-black text-green-400 font-['Outfit']">{academy.matchPercent}%</span>
                <div className="text-[10px] text-slate-500">Match</div>
              </div>
            </div>

            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tierBadge[academy.tier]}`}>
              {academy.tier}
            </span>

            <div className="flex flex-wrap gap-1.5">
              {academy.sports.map((s) => (
                <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {academy.seatsAvailable} seats open
              </span>
              <a href={`mailto:${academy.contact}`} className="text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-semibold">
                <Mail className="w-3.5 h-3.5" /> Contact
              </a>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {academy.reasons.map((r, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-800/80 text-slate-500">
                  {r}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-slate-400">
        Seat availability and contact details are illustrative for this demo. Confirm current trial dates and admission
        criteria directly with the academy before applying.
      </div>
    </div>
  );
};
