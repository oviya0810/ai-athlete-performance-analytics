import React from 'react';
import { COACH_LEADERBOARD } from '../../lib/aiHeuristics';
import { Trophy, Star, TrendingUp, Users } from 'lucide-react';

const rankColor = (i: number) => (i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-700' : 'text-slate-500');

export const CoachLeaderboardPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
          Admin Tools • Coach Performance Leaderboard
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-400" />
          Coach Performance Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Ranked by average Talent Score improvement across all athletes each coach trains.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
        {COACH_LEADERBOARD.map((c, i) => (
          <div key={c.coachId} className="flex items-center justify-between px-4 py-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-black font-['Outfit'] w-8 ${rankColor(i)}`}>#{i + 1}</span>
              <div>
                <h3 className="text-sm font-bold text-white">{c.name}</h3>
                <span className="text-[11px] text-slate-400">{c.academy}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-right">
              <div>
                <div className="text-sm font-black text-green-400 flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3.5 h-3.5" /> +{c.avgTalentScoreImprovement}
                </div>
                <span className="text-[10px] text-slate-500">Avg Score Gain</span>
              </div>
              <div>
                <div className="text-sm font-black text-blue-400 flex items-center gap-1 justify-end">
                  <Users className="w-3.5 h-3.5" /> {c.athletesTrained}
                </div>
                <span className="text-[10px] text-slate-500">Athletes Trained</span>
              </div>
              <div>
                <div className="text-sm font-black text-amber-400">{c.athletesPromotedToState}</div>
                <span className="text-[10px] text-slate-500">Promoted to State</span>
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1 justify-end">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {c.rating}
                </div>
                <span className="text-[10px] text-slate-500">Rating</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
