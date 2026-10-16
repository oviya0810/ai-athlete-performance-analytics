import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { addAuditEntry } from '../../lib/auditLog';
import { 
  Activity, 
  Shield, 
  User, 
  Trophy, 
  Menu, 
  X, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  Award,
  ChevronDown,
  Database
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSupabaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSupabaseModal }) => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case 'athlete':
        return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'coach':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'admin':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'athlete':
        return 'Athlete Portal';
      case 'coach':
        return 'SAI Coach / Evaluator';
      case 'admin':
        return 'SAI Administrator';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0B1120]/85 backdrop-blur-xl">
      {/* Top SAI Official Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/60 to-green-900/40 px-4 py-1.5 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600/30 text-blue-300 border border-blue-500/30">
              GOVT. OF INDIA INITIATIVE
            </span>
            <span>Sports Authority of India (SAI) • AI Talent Evaluation Network</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('landing')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                  SportVision
                </span>
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 font-['Outfit']">
                  AI
                </span>
              </div>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                Sports Authority of India
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'landing'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'about'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              About
            </button>
            <button
              onClick={() => onNavigate('features')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'features'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              AI Features
            </button>

            {/* Role specific link - only shown when logged in */}
            {user && role === 'athlete' && (
              <button
                onClick={() => onNavigate('athlete_dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView.startsWith('athlete_')
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                Athlete Portal
              </button>
            )}
            {user && role === 'coach' && (
              <button
                onClick={() => onNavigate('coach_portal')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'coach_portal'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                Coach Portal
              </button>
            )}
            {user && role === 'admin' && (
              <button
                onClick={() => onNavigate('admin_portal')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'admin_portal'
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                Admin Portal
              </button>
            )}
          </nav>

          {/* User Profile & Auth Button */}
          <div className="hidden md:flex items-center space-x-3">
            {onOpenSupabaseModal && (
              <button
                onClick={onOpenSupabaseModal}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800"
                title="Connect Supabase Database"
              >
                <Database className="w-4 h-4" />
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-green-500 flex items-center justify-center font-bold text-xs text-white">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-100 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {user.district ? `${user.district}, ${user.state}` : user.email}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('auth')}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Account Settings"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (user) addAuditEntry(user.email, `Logged out (${user.role.toUpperCase()})`, 'auth');
                    logout();
                    onNavigate('welcome');
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B1120]/95 backdrop-blur-2xl px-4 py-4 space-y-2">
          <button
            onClick={() => { onNavigate('landing'); setIsMobileOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('about'); setIsMobileOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            About Project
          </button>
          <button
            onClick={() => { onNavigate('features'); setIsMobileOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            AI Features
          </button>
          <button
            onClick={() => { onNavigate('athlete_dashboard'); setIsMobileOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-green-400 hover:bg-slate-800"
          >
            Athlete Portal
          </button>
          <button
            onClick={() => { onNavigate('coach_portal'); setIsMobileOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-blue-400 hover:bg-slate-800"
          >
            SAI Coach Portal
          </button>
          <button
            onClick={() => { onNavigate('admin_portal'); setIsMobileOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-slate-800"
          >
            SAI Admin Portal
          </button>
          <div className="pt-3 border-t border-slate-800 space-y-2">
            {onOpenSupabaseModal && (
              <button
                onClick={() => { onOpenSupabaseModal(); setIsMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700"
              >
                <Database className="w-4 h-4" /> Connect Supabase
              </button>
            )}
            {user ? (
              <button
                onClick={() => {
                  if (user) addAuditEntry(user.email, `Logged out (${user.role.toUpperCase()})`, 'auth');
                  logout();
                  onNavigate('welcome');
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600/20 text-red-400 font-semibold text-sm border border-red-500/30"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <button
                onClick={() => { onNavigate('auth'); setIsMobileOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
