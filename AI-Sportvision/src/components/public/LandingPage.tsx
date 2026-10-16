import React from 'react';
import { 
  Activity, 
  Sparkles, 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  Shield, 
  TrendingUp, 
  Award, 
  Cpu, 
  Eye, 
  Globe2, 
  Users, 
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Futuristic Gradient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/25 via-blue-500/15 to-green-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400">
                <Sparkles className="w-3.5 h-3.5 text-green-400" />
                <span>SPORTS AUTHORITY OF INDIA • AI EVALUATION ENGINE v3.4</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-['Outfit']">
                AI-Powered Sports{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-green-400">
                  Talent Discovery
                </span>{' '}
                Platform
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light max-w-2xl">
                Transforming athletic evaluation through Artificial Intelligence and Computer Vision. Enabling athletes from remote and rural areas across India to demonstrate their physical abilities and get discovered by SAI officials.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-base shadow-xl shadow-blue-500/30 flex items-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Assessment (Login / Register)</span>
                </button>
                <button
                  onClick={() => onNavigate('features')}
                  className="px-8 py-4 rounded-2xl glass-card hover:bg-slate-800/80 text-white font-bold text-base border border-slate-700/80 flex items-center space-x-2 transition-all"
                >
                  <span>Explore AI Features</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Quick Key Highlights */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-300">Remote Video Verification</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-300">MediaPipe Pose Detection</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-300">SIH National Standard</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Interactive AI Pose Skeleton & Dashboard Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border frame */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-500 via-green-500 to-blue-600 rounded-3xl blur-md opacity-40 animate-pulse-slow" />
                
                <div className="relative rounded-2xl glass-card p-5 border border-slate-700/80 shadow-2xl overflow-hidden">
                  {/* Visual Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-200 tracking-wider">LIVE COMPUTER VISION TRACKER</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                      98.4% LANDMARK ACCURACY
                    </span>
                  </div>

                  {/* Pose Visualization Graphic Box */}
                  <div className="my-4 relative h-64 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* Animated Scanning Line */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent ai-scan-line" />

                    {/* SVG Athlete Pose Skeleton Visual */}
                    <svg className="w-44 h-56 z-10" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Skeleton Lines */}
                      <line x1="100" y1="45" x2="100" y2="95" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                      <line x1="75" y1="65" x2="125" y2="65" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                      <line x1="75" y1="65" x2="55" y2="105" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                      <line x1="55" y1="105" x2="45" y2="140" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
                      <line x1="125" y1="65" x2="145" y2="105" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                      <line x1="145" y1="105" x2="155" y2="140" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
                      <line x1="100" y1="95" x2="80" y2="145" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                      <line x1="80" y1="145" x2="75" y2="200" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
                      <line x1="100" y1="95" x2="120" y2="145" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                      <line x1="120" y1="145" x2="125" y2="200" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />

                      {/* Joint Landmark Circles */}
                      <circle cx="100" cy="30" r="14" fill="#0F172A" stroke="#22C55E" strokeWidth="3" />
                      <circle cx="100" cy="45" r="5" fill="#22C55E" />
                      <circle cx="75" cy="65" r="6" fill="#2563EB" />
                      <circle cx="125" cy="65" r="6" fill="#2563EB" />
                      <circle cx="55" cy="105" r="6" fill="#22C55E" />
                      <circle cx="145" cy="105" r="6" fill="#22C55E" />
                      <circle cx="45" cy="140" r="5" fill="#38BDF8" />
                      <circle cx="155" cy="140" r="5" fill="#38BDF8" />
                      <circle cx="100" cy="95" r="6" fill="#2563EB" />
                      <circle cx="80" cy="145" r="6" fill="#22C55E" />
                      <circle cx="120" cy="145" r="6" fill="#22C55E" />
                      <circle cx="75" cy="200" r="5" fill="#38BDF8" />
                      <circle cx="125" cy="200" r="5" fill="#38BDF8" />
                    </svg>

                    {/* HUD Overlay Labels */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10px] font-mono text-blue-300">
                      Elbow Flexion: 94.2° (OK)
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10px] font-mono text-green-300">
                      Spinal Rigidity: 98.7%
                    </div>
                  </div>

                  {/* Real-time Metrics Card inside HUD */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-center">
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Rep Count</span>
                      <span className="text-xl font-black text-white font-['Outfit']">46 / 48</span>
                    </div>
                    <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-center">
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">AI Talent Score</span>
                      <span className="text-xl font-black text-green-400 font-['Outfit']">94.8</span>
                    </div>
                    <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-center">
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Authenticity</span>
                      <span className="text-xl font-black text-blue-400 font-['Outfit']">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
                50,000+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">
                Athletes Assessed
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-blue-400 font-['Outfit']">
                500+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">
                Training Programs
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-green-400 font-['Outfit']">
                28+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">
                States Connected
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
                95%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">
                AI Analysis Accuracy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-['Outfit']">
            Bridging India's Rural Talent Gap
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Millions of naturally gifted athletes in remote districts lack access to SAI training centers. SportVision AI democratizes identification using any smartphone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="rounded-2xl glass-card p-8 border border-red-500/20 bg-gradient-to-br from-red-950/20 to-slate-900/60 relative overflow-hidden">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-6">
              <span>The Problem</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 font-['Outfit']">
              Geographic & Logistics Barrier
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>Rural athletes travel hundreds of kilometers to district trials, bearing heavy travel and lodging costs.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>Manual subjective grading by local scouts can lead to inconsistency or overlooked endurance potential.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>Lack of a centralized verified video repository for SAI officials to review talent continuously.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="rounded-2xl glass-card p-8 border border-green-500/30 bg-gradient-to-br from-green-950/20 to-slate-900/60 relative overflow-hidden ai-glow-green">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-bold uppercase tracking-wider mb-6">
              <span>Our AI Solution</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 font-['Outfit']">
              Remote AI Evaluation & Verified Portfolio
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>Athletes record and upload standard fitness test videos directly from their village field or school.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>Computer vision detects 33 3D skeleton landmarks, validating repetitions, form angles, and power velocity.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>SAI Evaluator & Admin dashboards automatically rank athletes and recommend tailored sports pathways.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-['Outfit']">
              How SportVision AI Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              End-to-end automated pipeline from video recording to SAI national team scouting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative group hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">Record & Upload</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Athlete records standardized Sit-Up, Push-Up, or Vertical Jump video and uploads securely to the platform.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative group hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">Skeleton Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI extracts frame-by-frame 33 human pose landmarks using MediaPipe & OpenCV kinematic algorithms.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative group hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-600/20 text-green-400 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">Score & Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates repetition counts, form quality, explosive power, and checks video authenticity score.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative group hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">SAI Scouting & NCOE</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Top performers surface on SAI national heatmap for academy induction and scholarship grants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Portals Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900/90 to-green-900/60 p-8 sm:p-12 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400">
              EXPLORE ALL 3 PORTALS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              Ready to evaluate or upload a fitness video?
            </h3>
            <p className="text-slate-300 text-sm">
              Experience the full ecosystem tailored for Athletes, SAI Coaches/Evaluators, and Regional Administrators.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('athlete_dashboard')}
              className="px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm shadow-lg shadow-green-600/20"
            >
              Athlete Dashboard
            </button>
            <button
              onClick={() => onNavigate('coach_portal')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20"
            >
              Coach Portal
            </button>
            <button
              onClick={() => onNavigate('admin_portal')}
              className="px-6 py-3.5 rounded-xl glass-card hover:bg-slate-800 text-white font-bold text-sm border border-slate-700"
            >
              SAI Admin Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
