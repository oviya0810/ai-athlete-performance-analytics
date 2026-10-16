import React, { useMemo, useState } from 'react';
import { User } from '../../types';
import { matchGovernmentSchemes } from '../../lib/aiHeuristics';
import { Landmark, CheckCircle2, XCircle, ExternalLink, Info } from 'lucide-react';

interface GovernmentSchemeRecommendationPageProps {
  user: User;
}

export const GovernmentSchemeRecommendationPage: React.FC<GovernmentSchemeRecommendationPageProps> = ({ user }) => {
  const [showIneligible, setShowIneligible] = useState(false);
  const matches = useMemo(() => matchGovernmentSchemes(user), [user]);

  const eligible = matches.filter((m) => m.eligible);
  const ineligible = matches.filter((m) => !m.eligible);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          AI Matching • Government Scheme Recommendation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Landmark className="w-7 h-7 text-blue-400" />
          Government Scheme Recommendation
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Matched against your profile — age {user.age ?? '—'}, Talent Score {user.talentScore ?? '—'}, preferred sport{' '}
          {user.preferredSport || '—'}.
        </p>
      </div>

      <div className="space-y-4">
        {eligible.map((scheme) => (
          <div key={scheme.id} className="glass-card rounded-2xl p-5 border border-green-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white">{scheme.name}</h3>
                <span className="text-[11px] text-slate-400">{scheme.authority}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-lg font-black text-green-400 font-['Outfit']">{scheme.matchPercent}%</span>
                  <div className="text-[10px] text-slate-500">Match</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Eligible
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300">{scheme.benefit}</p>
            <div className="flex flex-wrap gap-1.5">
              {scheme.reasons.map((r, i) => (
                <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400">
                  {r}
                </span>
              ))}
            </div>
            <a
              href={scheme.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-1"
            >
              Visit official scheme page <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}

        {eligible.length === 0 && (
          <div className="glass-card rounded-2xl p-6 border border-slate-800 text-center text-sm text-slate-400">
            No schemes fully match yet — complete your profile and improve your Talent Score to unlock eligibility.
          </div>
        )}
      </div>

      {ineligible.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowIneligible((s) => !s)}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5" />
            {showIneligible ? 'Hide' : 'Show'} {ineligible.length} scheme(s) you're not yet eligible for
          </button>

          {showIneligible && (
            <div className="space-y-3">
              {ineligible.map((scheme) => (
                <div key={scheme.id} className="glass-card rounded-2xl p-5 border border-slate-800 opacity-70 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-300">{scheme.name}</h3>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Not yet eligible
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.reasons.map((r, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-500">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-slate-400">
        Eligibility is an AI-estimated match based on publicly available scheme criteria. Always confirm final eligibility
        and application steps on the official scheme page before applying.
      </div>
    </div>
  );
};
