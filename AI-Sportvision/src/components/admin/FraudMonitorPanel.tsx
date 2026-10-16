import React, { useMemo } from 'react';
import { AssessmentResult } from '../../types';
import { computeFraudScore } from '../../lib/aiHeuristics';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface FraudMonitorPanelProps {
  assessments: AssessmentResult[];
  onSelectAssessment: (a: AssessmentResult) => void;
}

export const FraudMonitorPanel: React.FC<FraudMonitorPanelProps> = ({ assessments, onSelectAssessment }) => {
  const ranked = useMemo(() => {
    return assessments
      .map((a) => ({ assessment: a, fraud: computeFraudScore(a) }))
      .sort((a, b) => b.fraud.fraudRiskPercent - a.fraud.fraudRiskPercent);
  }, [assessments]);

  const highRiskCount = ranked.filter((r) => r.fraud.verdict === 'High Risk').length;
  const mediumRiskCount = ranked.filter((r) => r.fraud.verdict === 'Medium Risk').length;

  const verdictStyle = (v: string) =>
    v === 'Low Risk'
      ? 'bg-green-500/15 text-green-400 border-green-500/30'
      : v === 'Medium Risk'
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      : 'bg-red-500/15 text-red-400 border-red-500/30';

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
          Admin Tools • Fraud & Anomaly Monitor
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-red-400" />
          Fraud & Anomaly Monitor
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          All submissions ranked by AI-estimated fraud risk, so reviewers can prioritize the most suspicious first.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-red-500/20">
          <span className="text-[11px] font-bold uppercase text-slate-400">High Risk</span>
          <div className="text-2xl font-black text-red-400 font-['Outfit']">{highRiskCount}</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-amber-500/20">
          <span className="text-[11px] font-bold uppercase text-slate-400">Medium Risk</span>
          <div className="text-2xl font-black text-amber-400 font-['Outfit']">{mediumRiskCount}</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-green-500/20">
          <span className="text-[11px] font-bold uppercase text-slate-400">Low Risk</span>
          <div className="text-2xl font-black text-green-400 font-['Outfit']">{ranked.length - highRiskCount - mediumRiskCount}</div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Ranked by Fraud Risk</h2>
        {ranked.map(({ assessment, fraud }) => (
          <button
            key={assessment.id}
            onClick={() => onSelectAssessment(assessment)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              {fraud.verdict === 'High Risk' && <AlertTriangle className="w-4 h-4 text-red-400" />}
              <div>
                <div className="text-sm font-bold text-white">{assessment.athleteName}</div>
                <div className="text-[10px] text-slate-500">{assessment.athleteDistrict}, {assessment.athleteState} • {assessment.testType.replace('_', ' ').toUpperCase()}</div>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${verdictStyle(fraud.verdict)}`}>
              {fraud.verdict} ({fraud.fraudRiskPercent}%)
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
