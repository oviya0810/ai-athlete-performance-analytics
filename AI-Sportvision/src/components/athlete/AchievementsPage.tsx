import React, { useState } from 'react';
import { MOCK_BADGES, MOCK_LEADERBOARD } from '../../data/mockData';
import { Award, Trophy, Shield, Crown, CheckCircle2, Star, MapPin } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const [leaderboardScope, setLeaderboardScope] = useState<'District' | 'State' | 'National'>('National');

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Elite':
        return Crown;
      case 'Gold':
        return Trophy;
      case 'Silver':
        return Shield;
      default:
        return Award;
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-green-900/40 p-6 rounded-3xl border border-slate-800">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
          GAMIFICATION & STANDINGS
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
          Achievements & Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Track your unlocked SAI performance tiers and compete across District, State, and National rankings.
        </p>
      </div>

      {/* Badges Showcase Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit']">Unlocked Performance Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_BADGES.map((badge) => {
            const Icon = getTierIcon(badge.tier);
            return (
              <div
                key={badge.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                      UNLOCKED
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-['Outfit']">{badge.title}</h3>
                    <span className="text-[10px] font-semibold uppercase text-amber-400">{badge.tier} Tier</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-400">
                  Unlocked on {badge.unlockedAt}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit']">SAI Talent Leaderboard</h2>
            <p className="text-xs text-slate-400">Verified athletes ranked by AI performance metrics</p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['District', 'State', 'National'] as const).map((scope) => (
              <button
                key={scope}
                onClick={() => setLeaderboardScope(scope)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  leaderboardScope === scope
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Athlete Name</th>
                <th className="py-3 px-4">District / State</th>
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4">Talent Score</th>
                <th className="py-3 px-4">Tier Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_LEADERBOARD.map((entry) => (
                <tr key={entry.athleteId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-black text-sm">
                    {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">{entry.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {entry.district}, <span className="text-slate-400">{entry.state}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-blue-400">{entry.sport}</td>
                  <td className="py-3.5 px-4 font-black text-green-400 text-sm">
                    {entry.talentScore} / 100
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {entry.tier} Tier
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
