import React from 'react';
import { MOCK_ROADMAP } from '../../data/mockData';
import { Map, CheckCircle2, Clock, Dumbbell, Sparkles, ArrowRight } from 'lucide-react';

export const TrainingRoadmapPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-green-900/40 p-6 rounded-3xl border border-slate-800">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
          AI PERSONALIZED TRAINING ENGINE
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
          SAI NCOE Readiness Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Dynamically generated 3-Week progressive conditioning plan tailored to address feedback from your latest AI video assessment.
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-6">
        {MOCK_ROADMAP.map((week) => (
          <div
            key={week.weekNumber}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-lg">
                  W{week.weekNumber}
                </div>
                <div>
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                    {week.focusArea}
                  </span>
                  <h3 className="text-xl font-bold text-white font-['Outfit']">{week.title}</h3>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700">
                Active Phase
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {week.description}
            </p>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {week.exercises.map((ex, exIdx) => (
                <div key={exIdx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ex.name}</span>
                    <Dumbbell className="w-4 h-4 text-blue-400 shrink-0" />
                  </div>
                  <div className="text-[11px] font-semibold text-green-400">
                    {ex.sets} • {ex.reps}
                  </div>
                  <p className="text-[11px] text-slate-400">{ex.notes}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
