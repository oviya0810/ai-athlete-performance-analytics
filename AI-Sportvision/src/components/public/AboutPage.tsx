import React from 'react';
import { Target, Heart, Shield, Globe, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
            SPORTS AUTHORITY OF INDIA (SAI)
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-['Outfit']">
            Democratizing Sports Discovery in India
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between grassroots athletic potential and national sports excellence through AI, Computer Vision, and equitable digital infrastructure.
          </p>
        </div>

        {/* Problem Statement Deep Dive */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 text-red-400">
            <Target className="w-6 h-6" />
            <h2 className="text-2xl font-bold text-white font-['Outfit']">The Problem: Hidden Rural Talent</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            India possesses an extraordinary pool of athletic talent spread across more than 600 districts and 600,000 villages. However, traditional talent identification relies on physical screening camps that can only reach a fraction of these areas due to geographical distances, travel costs, and administrative bandwidth. As a result, naturally gifted athletes in remote districts often go unnoticed until they pass their peak development years.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-2xl font-black text-red-400 font-['Outfit']">70%+</span>
              <span className="text-xs text-slate-400">Athletic talent residing in rural & semi-urban districts</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-2xl font-black text-amber-400 font-['Outfit']">₹5,000+</span>
              <span className="text-xs text-slate-400">Average travel & stay expense for rural athlete trial participation</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-2xl font-black text-blue-400 font-['Outfit']">&lt; 15 mins</span>
              <span className="text-xs text-slate-400">Time required to record & upload AI assessment video remotely</span>
            </div>
          </div>
        </div>

        {/* Our Solution & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-8 border border-blue-500/30 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">Our Mission</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              To empower every aspiring Indian athlete with a standardized, transparent, and AI-audited fitness assessment platform that requires only a mobile phone camera and an internet connection.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-green-500/30 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-green-600/20 text-green-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">Social Impact & Vision</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              By eliminating subjective human bias and geographical barriers, SportVision AI ensures that selection into National Centres of Excellence (NCOE) is based purely on verified physical performance.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-6">
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 inline-flex items-center space-x-2"
          >
            <span>Start Your AI Evaluation Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
