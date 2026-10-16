import React from 'react';
import { Activity, Shield, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#090E1A] border-t border-slate-800/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white font-['Outfit']">SportVision AI</span>
                <span className="block text-[10px] text-green-400 font-semibold tracking-wider uppercase">
                  Sports Authority of India
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Democratizing sports talent discovery across rural and urban India using state-of-the-art Computer Vision, pose detection, and automated assessment scoring.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>SIH / SAI Project Demonstration Ready</span>
            </div>
          </div>

          {/* Platform Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-['Outfit']">
              Portals & Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('athlete_dashboard')} className="hover:text-green-400 transition-colors">
                  Athlete Talent Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('coach_portal')} className="hover:text-blue-400 transition-colors">
                  SAI Coach & Evaluator Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin_portal')} className="hover:text-amber-400 transition-colors">
                  SAI Administrator Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('auth')} className="hover:text-white transition-colors">
                  Role Registration & Login
                </button>
              </li>
            </ul>
          </div>

          {/* AI Assessment Modules */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-['Outfit']">
              AI Assessment Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Sit-Up Core Analysis AI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Push-Up Kinematic Form AI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Vertical Jump Power Estimation AI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Video Authenticity & Fraud Guard
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-['Outfit']">
              SAI Connect
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Jawaharlal Nehru Stadium Complex, Lodhi Road, New Delhi - 110003</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <span>talent.ai@sai.gov.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>1800-209-0101 (Toll Free Helpline)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Sports Authority of India (SAI) & SportVision AI Platform. Built for Smart India Hackathon & National Talent Discovery.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">AI Ethical Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
