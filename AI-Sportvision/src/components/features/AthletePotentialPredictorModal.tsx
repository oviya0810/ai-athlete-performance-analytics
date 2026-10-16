import React, { useState } from 'react';
import { X, TrendingUp, Award, Calendar, Target, Sparkles, CheckCircle2 } from 'lucide-react';

interface AthletePotentialPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AthletePotentialPredictorModal: React.FC<AthletePotentialPredictorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [age, setAge] = useState<number>(16);
  const [height, setHeight] = useState<number>(172);
  const [weight, setWeight] = useState<number>(62);
  const [sitUpScore, setSitUpScore] = useState<number>(40);
  const [pushUpScore, setPushUpScore] = useState<number>(35);
  const [jumpHeight, setJumpHeight] = useState<number>(48);

  if (!isOpen) return null;

  // AI Predictive Logic
  const currentAverageScore = Math.round((sitUpScore * 1.5 + pushUpScore * 1.6 + jumpHeight * 1.3) / 3);
  const growthFactor = age < 18 ? (24 - age) * 2.8 : (26 - age) * 1.4;
  const projectedPeakScore = Math.min(99, Math.round(currentAverageScore * 0.75 + growthFactor + 18));
  
  const peakAge = age < 17 ? 22 : age < 20 ? 24 : 26;
  const targetOlympicCycle = age <= 17 ? 'Brisbane 2032 (Olympic Development Squad)' : 'Los Angeles 2028 (Target Olympic Podium Scheme)';

  let medalPotential = 'National Elite Tier';
  let badgeColor = 'from-blue-600 to-indigo-600';
  if (projectedPeakScore >= 92) {
    medalPotential = 'International / Olympic Potential ⭐⭐⭐⭐⭐';
    badgeColor = 'from-amber-500 to-yellow-600';
  } else if (projectedPeakScore >= 85) {
    medalPotential = 'Asian Games / Commonwealth Prospect ⭐⭐⭐⭐';
    badgeColor = 'from-green-600 to-emerald-600';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                Athlete Potential Prediction Engine
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  AI Projection
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Longitudinal athletic development & Olympic trajectory modeling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Inputs section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Athlete Current Biometrics
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Current Age</span>
                    <span className="text-white font-semibold">{age} years</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="25"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Height (cm)</span>
                    <span className="text-white font-semibold">{height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="140"
                    max="210"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Weight (kg)</span>
                    <span className="text-white font-semibold">{weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="105"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                Current Fitness Test Performance
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Sit-Ups (Reps / min)</span>
                    <span className="text-white font-semibold">{sitUpScore} reps</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    value={sitUpScore}
                    onChange={(e) => setSitUpScore(Number(e.target.value))}
                    className="w-full accent-green-500 bg-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Push-Ups (Valid Reps)</span>
                    <span className="text-white font-semibold">{pushUpScore} reps</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="65"
                    value={pushUpScore}
                    onChange={(e) => setPushUpScore(Number(e.target.value))}
                    className="w-full accent-green-500 bg-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Vertical Jump Height (cm)</span>
                    <span className="text-white font-semibold">{jumpHeight} cm</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="85"
                    value={jumpHeight}
                    onChange={(e) => setJumpHeight(Number(e.target.value))}
                    className="w-full accent-green-500 bg-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Prediction Output Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/70">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  AI Prediction Output
                </span>
                <h4 className="text-xl font-bold text-white mt-1">
                  {medalPotential}
                </h4>
              </div>
              <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${badgeColor} text-white font-bold text-sm shadow-lg`}>
                Peak Score Projection: {projectedPeakScore}/100
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Projected Peak Age</span>
                </div>
                <div className="text-2xl font-extrabold text-white">
                  {peakAge} Years Old
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  +{peakAge - age} years development timeline
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Target Olympic Cycle</span>
                </div>
                <div className="text-base font-bold text-white leading-tight">
                  {targetOlympicCycle}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Recommended Discipline</span>
                </div>
                <div className="text-base font-bold text-white">
                  {jumpHeight > 55 ? 'Athletics (Sprint / Jump)' : sitUpScore > 45 ? 'Combat Sports / Wrestling' : 'Team Sports / Hockey'}
                </div>
              </div>
            </div>

            {/* Development Roadmap */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Longitudinal Development Roadmap
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-blue-200 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Phase 1 (1-2 Yrs):</strong> Foundation strength & joint mobility optimization.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Phase 2 (2-4 Yrs):</strong> Explosive neuromuscular power & sport-specific drill mastery.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-950/30 border border-green-500/20 text-green-200 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Phase 3 (Peak Age):</strong> National Centre of Excellence (NCOE) international competition circuit.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
