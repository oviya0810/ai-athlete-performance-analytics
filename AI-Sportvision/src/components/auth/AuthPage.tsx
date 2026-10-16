import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { User as UserIcon, Shield, Trophy, AlertCircle, Loader2, Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { verifyLogin } from '../../lib/authStore';
import { addAuditEntry } from '../../lib/auditLog';

interface AuthPageProps {
  onNavigate: (view: string) => void;
  embedded?: boolean;
  initialRole?: UserRole;
}

const ROLE_TABS: { role: UserRole; label: string; icon: React.ReactNode; activeClass: string }[] = [
  { role: 'athlete', label: 'Athlete', icon: <UserIcon className="w-4 h-4" />, activeClass: 'bg-green-600 text-white shadow-lg' },
  { role: 'coach', label: 'Coach', icon: <Trophy className="w-4 h-4" />, activeClass: 'bg-blue-600 text-white shadow-lg' },
  { role: 'admin', label: 'Admin', icon: <Shield className="w-4 h-4" />, activeClass: 'bg-amber-600 text-white shadow-lg' }
];

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, embedded = false, initialRole = 'athlete' }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    const result = await verifyLogin(userId, password);

    if (!result.success) {
      setAuthError(
        result.error === 'EMAIL_NOT_FOUND'
          ? 'No account found with this User ID. Please contact your Admin to get an account created.'
          : 'Incorrect password. Please try again.'
      );
      setIsSubmitting(false);
      return;
    }

    if (result.user.role !== selectedRole) {
      setAuthError(`This User ID belongs to a ${result.user.role.toUpperCase()} account, not ${selectedRole.toUpperCase()}. Please select the correct role tab.`);
      setIsSubmitting(false);
      return;
    }

    login(result.user);
    addAuditEntry(result.user.email, `Logged in as ${result.user.role.toUpperCase()}`, 'auth');
    setIsSubmitting(false);
    if (result.user.role === 'athlete') onNavigate('athlete_dashboard');
    else if (result.user.role === 'coach') onNavigate('coach_portal');
    else onNavigate('admin_portal');
  };

  return (
    <div
      className={
        embedded
          ? 'w-full py-4'
          : 'min-h-screen bg-[#0B1120] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'
      }
    >
      <div className="max-w-3xl w-full mx-auto">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center space-x-2 mb-1">
            <KeyRound className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Portal Authentication</span>
          </div>
          <h1 className="text-2xl font-black text-white font-['Outfit'] mb-1">Access SportVision AI</h1>
          <p className="text-xs text-slate-400 mb-6">
            Accounts are created by your SAI Administrator. Sign in with the User ID and password issued to you.
          </p>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
            {ROLE_TABS.map(({ role, label, icon, activeClass }) => (
              <button
                key={role}
                type="button"
                onClick={() => { setSelectedRole(role); setAuthError(null); }}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  selectedRole === role ? activeClass : 'text-slate-400 hover:text-white'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">User ID</label>
              <input
                type="text"
                required
                autoComplete="username"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder={selectedRole === 'athlete' ? 'e.g. athlete001' : selectedRole === 'coach' ? 'e.g. coach001' : 'e.g. admin001'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying...' : `Sign In to ${selectedRole.toUpperCase()} Portal`}</span>
            </button>

            <p className="text-[11px] text-slate-500 text-center pt-1">
              Don't have a User ID? Only an Admin can create Athlete and Coach accounts.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
