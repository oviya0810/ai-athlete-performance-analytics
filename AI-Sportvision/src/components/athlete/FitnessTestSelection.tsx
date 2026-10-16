import React from 'react';
import { FITNESS_TESTS } from '../../data/mockData';
import { FitnessTestConfig, FitnessTestType } from '../../types';
import { Activity, Dumbbell, Zap, Clock, CheckCircle2, UploadCloud, ShieldAlert } from 'lucide-react';

interface FitnessTestSelectionProps {
  onSelectTestToUpload: (testType: FitnessTestType) => void;
}

export const FitnessTestSelection: React.FC<FitnessTestSelectionProps> = ({ onSelectTestToUpload }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return Activity;
      case 'Dumbbell':
        return Dumbbell;
      default:
        return Zap;
    }
  };

  return (
    <div className="space-y-8">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-green-900/40 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
            FITNESS ASSESSMENT MODULE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
            Select Standardized Fitness Test
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Standardized for National SAI / Smart India Hackathon evaluation. Only recorded videos are accepted to ensure high-resolution kinematic analysis.
          </p>
        </div>
      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {FITNESS_TESTS.map((test) => {
          const Icon = getIcon(test.iconName);
          return (
            <div
              key={test.id}
              className="glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    test.difficulty === 'Beginner'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                      : test.difficulty === 'Intermediate'
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {test.difficulty} Tier
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-['Outfit']">{test.title}</h3>
                  <p className="text-xs font-semibold text-green-400 mt-0.5">{test.subtitle}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {test.purpose}
                </p>

                <div className="flex items-center space-x-4 pt-2 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Duration: {test.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span>Standard: {test.standardScore}+ Pts</span>
                  </div>
                </div>

                {/* Instructions Box */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Recording Instructions:
                  </span>
                  <ul className="space-y-1.5">
                    {test.instructions.map((ins, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Upload Video Button */}
              <button
                onClick={() => onSelectTestToUpload(test.id)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition-transform active:scale-95"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload Video for Assessment</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
