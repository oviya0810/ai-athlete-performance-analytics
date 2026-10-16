import React, { useMemo } from 'react';
import { AssessmentResult } from '../../types';
import { computePercentile } from '../../lib/aiHeuristics';
import { BarChart3, Trophy, Info } from 'lucide-react';

interface PeerComparisonPageProps {
  assessments: AssessmentResult[];
}

const Bar: React.FC<{ label: string; percentile: number; avg: number; you: number }> = ({ label, percentile, avg, you }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="font-bold text-white">{label}</span>
      <span className="text-slate-400">
        You: <strong className="text-green-400">{you}</strong> vs Avg: <strong className="text-slate-300">{avg}</strong>
      </span>
    </div>
    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
      <div className="h-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: `${percentile}%` }} />
    </div>
    <span className="text-[10px] text-slate-500">Top {100 - percentile}% among peers ({percentile}th percentile)</span>
  </div>
);

export const PeerComparisonPage: React.FC<PeerComparisonPageProps> = ({ assessments }) => {
  const latest = assessments[0];
  const result = useMemo(() => (latest ? computePercentile(latest) : null), [latest]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Analytics • Peer Percentile Comparison
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-blue-400" />
          Peer Percentile Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          See how your latest Talent Score stacks up against athletes in your district, state, and across India.
        </p>
      </div>

      {!latest || !result ? (
        <div className="glass-card rounded-3xl p-10 border border-slate-800 text-center text-sm text-slate-400">
          Complete a fitness test first to unlock your percentile comparison.
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-3xl font-black text-white font-['Outfit']">{latest.talentScore}</div>
              <span className="text-[11px] text-slate-400">Your Talent Score ({latest.testType.replace('_', ' ').toUpperCase()})</span>
            </div>
          </div>

          <Bar label="District Ranking" percentile={result.percentileDistrict} avg={result.districtAvg} you={latest.talentScore} />
          <Bar label="State Ranking" percentile={result.percentileState} avg={result.stateAvg} you={latest.talentScore} />
          <Bar label="National Ranking" percentile={result.percentileNational} avg={result.nationalAvg} you={latest.talentScore} />
        </div>
      )}

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Comparison averages are AI-estimated from aggregate regional assessment data for this demo.</span>
      </div>
    </div>
  );
};
