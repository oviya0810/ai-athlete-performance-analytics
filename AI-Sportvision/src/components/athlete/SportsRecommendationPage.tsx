import React from 'react';
import { MOCK_RECOMMENDATIONS } from '../../data/mockData';
import { Target, Flame, Trophy, Zap, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface SportsRecommendationPageProps {
  onProceedToPortfolio?: () => void;
  onApplyForAcademyTrial?: () => void;
}

export const SportsRecommendationPage: React.FC<SportsRecommendationPageProps> = ({ onProceedToPortfolio, onApplyForAcademyTrial }) => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'Flame':
        return Flame;
      case 'Trophy':
        return Trophy;
      default:
        return Zap;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Action Banner for Workflow */}
      {onProceedToPortfolio && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-600/15 border border-blue-500/30">
          <span className="text-xs font-bold text-blue-300">
            ✓ AI Benchmark Comparison Complete — Recommendations Calibrated
          </span>
          <button
            onClick={onProceedToPortfolio}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center space-x-2"
          >
            <span>Next Workflow Step: Update Athlete Portfolio →</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-green-900/40 p-6 rounded-3xl border border-slate-800">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
          AI RECOMMENDATION ENGINE
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
          AI Sports Discipline Match
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Based on your verified AI kinematic profile (explosive power, core endurance, upper trunk rigidity), our machine learning model recommends optimal sporting disciplines for national development.
        </p>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_RECOMMENDATIONS.map((rec, idx) => {
          const Icon = getIcon(rec.icon);
          return (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-['Outfit']">{rec.sport}</h3>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black bg-green-500/20 text-green-400 border border-green-500/30">
                    {rec.confidence}% Confidence
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rec.reason}
                </p>

                {/* Strength Match */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Strength Matches:
                  </span>
                  <ul className="space-y-1">
                    {rec.strengthMatch.map((m, mIdx) => (
                      <li key={mIdx} className="flex items-center space-x-2 text-xs text-green-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Areas */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Target Improvement Areas:
                  </span>
                  <ul className="space-y-1">
                    {rec.improvementAreas.map((imp, impIdx) => (
                      <li key={impIdx} className="flex items-center space-x-2 text-xs text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">SAI Pathway Available</span>
                <button
                  onClick={onApplyForAcademyTrial}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <span>Apply for Academy Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
