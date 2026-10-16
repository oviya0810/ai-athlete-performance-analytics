import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Dumbbell, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Target, 
  UserCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Bot,
  Sparkles
} from 'lucide-react';
import { AthletePotentialPredictorModal } from '../features/AthletePotentialPredictorModal';
import { AICoachAssistantModal } from '../features/AICoachAssistantModal';

interface FeaturesPageProps {
  onNavigate: (view: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const AI_FEATURES = [
    {
      title: 'AI Pose Detection',
      category: 'Computer Vision Core',
      description: 'Detects 33 human body landmarks in 3D space using MediaPipe & OpenCV kinematic modeling to track joint coordinates and movement arcs.',
      icon: Cpu,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      highlights: ['Frame-by-frame coordinate extraction', 'Real-time joint angle calculation', 'Spinal alignment tracking']
    },
    {
      title: 'Sit-Up Analysis AI',
      category: 'Core Endurance Engine',
      description: 'Automatically counts repetitions and validates movement by measuring shoulder-blade elevation and hip-flexion depth.',
      icon: Activity,
      badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30',
      highlights: ['Automatic valid repetition counting', 'Flags partial or incomplete repetitions', 'Core stability index generation']
    },
    {
      title: 'Push-Up Analysis AI',
      category: 'Upper Body Strength Engine',
      description: 'Analyzes posture alignment, counts repetitions, and verifies 90-degree elbow flexion and rigid trunk line quality.',
      icon: Dumbbell,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      highlights: ['Shoulder-elbow-wrist angle verification', 'Trunk sagging detection', 'Form accuracy percentage']
    },
    {
      title: 'Vertical Jump Analysis AI',
      category: 'Explosive Power Engine',
      description: 'Estimates vertical jump apex height and calculates explosive takeoff power in Watts using countermovement kinematics.',
      icon: Zap,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      highlights: ['Jump apex height estimation (cm)', 'Takeoff velocity & force calculation', 'Peak explosive power rating']
    },
    {
      title: 'AI Video Verification',
      category: 'Anti-Fraud Guard',
      description: 'Validates athlete visibility, lighting adequacy, frame integrity, and movement authenticity to prevent manipulated submissions.',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      highlights: ['Camera angle & lighting check', 'Digital tampering detection', 'Full-body visibility audit']
    },
    {
      title: 'Performance Benchmarking',
      category: 'National Analytics',
      description: 'Compares athlete test scores against SAI age and gender national percentiles across India.',
      icon: BarChart3,
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      highlights: ['Age & gender normalized rankings', 'District & State talent percentile', 'Radar chart skill breakdown']
    },
    {
      title: 'Sports Recommendation Engine',
      category: 'Machine Learning Advisor',
      description: 'Matches physical strengths (explosiveness, core stability, endurance) to optimal sports disciplines like Athletics, Football, Kabaddi, and Volleyball.',
      icon: Target,
      badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30',
      highlights: ['Discipline confidence scoring (%)', 'Clear physical suitability rationale', 'Tailored improvement areas']
    },
    {
      title: 'Athlete Digital Portfolio',
      category: 'SAI Verified Identity',
      description: 'Maintains a verifiable LinkedIn-style athlete career history with downloadable QR-code official SAI Identity Cards.',
      icon: UserCheck,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      highlights: ['Official SAI Digital QR ID Card', 'Downloadable PDF performance reports', 'Gamified badge showcase']
    },
    {
      title: 'Athlete Potential Prediction',
      category: 'Olympic Peak Forecasting Engine',
      description: 'Predicts long-term biometric trajectories, medal probabilities, and peak athletic age using longitudinal regression modeling.',
      icon: TrendingUp,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      highlights: ['Olympic Cycle mapping (LA 2028 / Brisbane 2032)', 'Longitudinal peak score projection', 'SAI NCOE discipline transition mapping'],
      actionLabel: 'Launch AI Predictor Engine',
      onAction: () => setIsPredictorOpen(true)
    },
    {
      title: 'AI Coach Assistant',
      category: 'Interactive Biomechanics Chat',
      description: 'An interactive virtual coaching assistant offering real-time form correction tips, drill prescriptions, and SAI selection standards.',
      icon: Bot,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      highlights: ['Interactive training & drill prescriptions', 'Real-time biomechanical correction advice', 'Personalized recovery & nutrition guidance'],
      actionLabel: 'Open AI Coach Assistant',
      onAction: () => setIsCoachOpen(true)
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
            TECHNOLOGY STACK & AI MODELS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-['Outfit']">
            AI Assessment Modules & Core Capabilities
          </h1>
          <p className="text-base sm:text-lg text-slate-300">
            Powered by MediaPipe 3D Landmark Tracking, OpenCV frame extraction, and customized sports biomechanics models.
          </p>
        </div>

        {/* Interactive Sandbox Launch Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <TrendingUp className="w-3.5 h-3.5" />
                NEW FEATURE
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">Athlete Potential Prediction Engine</h3>
              <p className="text-xs text-slate-300">Forecast long-term growth, Olympic target cycles, and peak talent score.</p>
            </div>
            <button
              onClick={() => setIsPredictorOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 shrink-0 transition-all"
            >
              Test AI Predictor →
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Bot className="w-3.5 h-3.5" />
                NEW FEATURE
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">AI Coach Assistant Chatbot</h3>
              <p className="text-xs text-slate-300">Ask interactive coaching questions, get biomechanical corrections & drill advice.</p>
            </div>
            <button
              onClick={() => setIsCoachOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 shrink-0 transition-all"
            >
              Chat With Coach →
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="rounded-2xl glass-card-hover p-6 flex flex-col justify-between border border-slate-800"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${feat.badgeColor}`}>
                      {feat.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-['Outfit']">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                    {feat.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {(feat as any).actionLabel && (
                    <div className="pt-3 border-t border-slate-800/80">
                      <button
                        onClick={(feat as any).onAction}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white text-xs font-bold transition-all border border-slate-700/80"
                      >
                        {(feat as any).actionLabel} →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="rounded-3xl glass-card p-8 border border-slate-800 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white font-['Outfit']">
            Test our AI models on your own video
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Upload a Sit-Up, Push-Up, or Vertical Jump recording and receive a complete pose skeleton overlay and verified talent score.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm inline-flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/25"
          >
            <span>Proceed to Fitness Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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
