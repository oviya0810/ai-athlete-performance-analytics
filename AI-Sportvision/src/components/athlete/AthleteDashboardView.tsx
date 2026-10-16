import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AssessmentResult } from '../../types';
import { 
  Activity, 
  Trophy, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Play,
  Zap,
  ShieldCheck,
  Bot,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { AthletePotentialPredictorModal } from '../features/AthletePotentialPredictorModal';
import { AICoachAssistantModal } from '../features/AICoachAssistantModal';

interface AthleteDashboardViewProps {
  assessments: AssessmentResult[];
  onNavigateTab: (tab: string) => void;
  onSelectAssessment: (assessment: AssessmentResult) => void;
}

export const AthleteDashboardView: React.FC<AthleteDashboardViewProps> = ({
  assessments,
  onNavigateTab,
  onSelectAssessment
}) => {
  const { user } = useAuth();
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const latest = assessments[0];

  const PERFORMANCE_TREND = [
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 82 },
    { month: 'May', score: 86 },
    { month: 'Jun', score: 91 },
    { month: 'Jul', score: 94.8 }
  ];

  const RADAR_DATA = [
    { subject: 'Strength', A: latest?.metricsBreakdown?.strength || 92, fullMark: 100 },
    { subject: 'Power', A: latest?.metricsBreakdown?.power || 88, fullMark: 100 },
    { subject: 'Agility', A: latest?.metricsBreakdown?.agility || 85, fullMark: 100 },
    { subject: 'Endurance', A: latest?.metricsBreakdown?.endurance || 94, fullMark: 100 },
    { subject: 'Form Quality', A: latest?.metricsBreakdown?.form || 96, fullMark: 100 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-green-900/40 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
              SAI ID: {user?.saiId || 'SAI-IND-2026-8942'}
            </span>
            <span className="text-xs text-slate-400">
              District: {user?.district}, {user?.state}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-['Outfit']">
            Welcome Back, {user?.name || 'Athlete'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Your physical assessment data is synchronized with the Sports Authority of India national database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPredictorOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center space-x-2 transition-all"
          >
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>AI Potential Prediction</span>
          </button>

          <button
            onClick={() => setIsCoachOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center space-x-2 transition-all"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Coach Assistant</span>
          </button>

          <button
            onClick={() => onNavigateTab('upload_video')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Upload New Test Video</span>
          </button>
        </div>
      </div>

      {/* Primary Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Overall Talent Score Widget */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overall Talent Score
            </span>
            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 font-['Outfit']">
                94.8
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-green-400 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Top 2% National</span>
            </span>
            <span className="text-slate-400">Grade A+</span>
          </div>
        </div>

        {/* Latest Assessment Widget */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Latest Assessment
            </span>
            <div className="mt-3">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {latest ? latest.testType.replace('_', ' ').toUpperCase() : 'Push-Up Assessment AI'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Uploaded: {latest?.uploadDate || '2026-07-12'}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified by SAI</span>
            </span>
            <span className="font-bold text-white">{latest?.talentScore || 94} Pts</span>
          </div>
        </div>

        {/* Fitness Level Widget */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fitness Level
            </span>
            <div className="mt-3">
              <span className="text-2xl font-black text-white font-['Outfit']">Elite National Tier</span>
              <p className="text-xs text-slate-400 mt-1">
                Prime match for Athletics & High Jump NCOE Academy induction.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-blue-400 font-semibold">Ready for Nationals</span>
            <button
              onClick={() => onNavigateTab('recommendations')}
              className="text-white underline hover:text-blue-400"
            >
              View Sports
            </button>
          </div>
        </div>

        {/* Achievement Badges Widget */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Achievement Badges
            </span>
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm" title="Elite Athlete">
                🏆
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm" title="Silver Athlete">
                🛡️
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-bold text-sm" title="Form Master">
                ⚡
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs">
                +4
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">4 Unlocked</span>
            <button
              onClick={() => onNavigateTab('achievements')}
              className="text-white font-semibold hover:text-blue-400"
            >
              All Badges →
            </button>
          </div>
        </div>

      </div>

      {/* Graphs Section: Performance Graph & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Trend Graph */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Talent Score Progression</h3>
              <p className="text-xs text-slate-400">Monthly AI assessment trajectory (SAI benchmarks)</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold">
              +16.8% Gain
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_TREND}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} domain={[60, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Radar Skill Breakdown */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Physical Attribute Matrix</h3>
              <p className="text-xs text-slate-400">Multi-axis AI pose analysis breakdown</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Athlete Score" dataKey="A" stroke="#22C55E" fill="#22C55E" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Assessment History Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Assessment History</h3>
            <p className="text-xs text-slate-400">Past AI-processed fitness test reports</p>
          </div>
          <button
            onClick={() => onNavigateTab('my_results')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            View Full Reports →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-4">Assessment ID</th>
                <th className="py-3 px-4">Test Type</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Talent Score</th>
                <th className="py-3 px-4">AI Authenticity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-300">{a.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white uppercase">{a.testType.replace('_', ' ')}</td>
                  <td className="py-3.5 px-4 text-slate-400">{a.uploadDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-green-400 text-sm">{a.talentScore}</span> / 100
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-blue-400 font-semibold">{a.authenticityScore}% Verified</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      a.status === 'verified'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : a.status === 'pending_verification'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectAssessment(a)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 text-xs font-semibold transition-all"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modals */}
      <AthletePotentialPredictorModal
        isOpen={isPredictorOpen}
        onClose={() => setIsPredictorOpen(false)}
      />
      <AICoachAssistantModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
      />
    </div>
  );
};
