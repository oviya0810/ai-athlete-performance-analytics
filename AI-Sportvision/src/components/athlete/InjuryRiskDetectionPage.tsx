import React, { useMemo } from 'react';
import { AssessmentResult } from '../../types';
import { computeInjuryRisk } from '../../lib/aiHeuristics';
import { HeartPulse, AlertTriangle, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

interface InjuryRiskDetectionPageProps {
  assessments: AssessmentResult[];
}

const levelStyles: Record<string, { badge: string; bar: string; icon: React.ReactNode }> = {
  Low: { badge: 'bg-green-500/15 text-green-400 border-green-500/30', bar: 'bg-green-500', icon: <ShieldCheck className="w-4 h-4 text-green-400" /> },
  Moderate: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', bar: 'bg-amber-500', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
  High: { badge: 'bg-red-500/15 text-red-400 border-red-500/30', bar: 'bg-red-500', icon: <ShieldAlert className="w-4 h-4 text-red-400" /> }
};

export const InjuryRiskDetectionPage: React.FC<InjuryRiskDetectionPageProps> = ({ assessments }) => {
  const latest = assessments[0];
  const risk = useMemo(() => (latest ? computeInjuryRisk(latest) : null), [latest]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
          AI Biomechanics • Injury Risk Detection
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <HeartPulse className="w-7 h-7 text-red-400" />
          Injury Risk Detection
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Movement-pattern analysis from your most recent AI assessment, flagging joints and muscle groups under elevated
          mechanical stress — with concrete prevention steps for each.
        </p>
      </div>

      {!latest || !risk ? (
        <div className="glass-card rounded-3xl p-10 border border-slate-800 text-center space-y-2">
          <Info className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm text-slate-400">
            Upload and complete a fitness test first — injury risk is derived from your movement quality data.
          </p>
        </div>
      ) : (
        <>
          {/* Overall risk banner */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400">Overall Injury Risk</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-white font-['Outfit']">{risk.overallRiskPercent}%</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${levelStyles[risk.overallLevel].badge}`}>
                  {risk.overallLevel} Risk
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Based on: {latest.testType.replace('_', ' ').toUpperCase()} • {latest.uploadDate}
              </p>
            </div>
            <div className="w-full sm:w-56 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className={`h-full ${levelStyles[risk.overallLevel].bar}`} style={{ width: `${risk.overallRiskPercent}%` }} />
            </div>
          </div>

          {/* Per-area breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risk.areas.map((area) => (
              <div key={area.area} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {levelStyles[area.riskLevel].icon}
                    {area.area}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${levelStyles[area.riskLevel].badge}`}>
                    {area.riskLevel} ({area.riskPercent}%)
                  </span>
                </div>
                <p className="text-xs text-slate-400">{area.cause}</p>
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Prevention Steps</span>
                  {area.prevention.map((tip, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-slate-400">
            This is an AI-generated movement-pattern estimate for training guidance, not a medical diagnosis. Consult a
            certified sports physiotherapist for a full assessment before changing your training load.
          </div>
        </>
      )}
    </div>
  );
};
