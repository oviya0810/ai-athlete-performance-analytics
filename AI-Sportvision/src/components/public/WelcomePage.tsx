import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Sparkles,
  Volume2,
  VolumeX,
  User as UserIcon,
  Trophy,
  Shield,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { AuthPage } from '../auth/AuthPage';
import { UserRole } from '../../types';

interface WelcomePageProps {
  onNavigate: (view: string) => void;
}

const ROLE_META: Record<UserRole, { label: string; icon: React.ReactNode; accent: string; ring: string }> = {
  athlete: {
    label: 'Athlete',
    icon: <UserIcon className="w-5 h-5" />,
    accent: 'from-green-600 to-green-500',
    ring: 'border-green-500/40 hover:border-green-400'
  },
  coach: {
    label: 'Coach',
    icon: <Trophy className="w-5 h-5" />,
    accent: 'from-blue-600 to-blue-500',
    ring: 'border-blue-500/40 hover:border-blue-400'
  },
  admin: {
    label: 'Admin',
    icon: <Shield className="w-5 h-5" />,
    accent: 'from-amber-600 to-amber-500',
    ring: 'border-amber-500/40 hover:border-amber-400'
  }
};

export const WelcomePage: React.FC<WelcomePageProps> = ({ onNavigate }) => {
  // Step 1: pick role. Step 2: show the Sign In form. (No public self sign-up —
  // Admin creates every Athlete/Coach account.)
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>('athlete');
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Video keeps playing continuously in the background through the
    // entire sign-in flow, right up until login succeeds.
    videoRef.current?.play().catch(() => {
      /* autoplay may be blocked until user interaction; muted covers most browsers */
    });
  }, []);

  const chooseRole = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B1120] text-slate-100">
      {/* Full-bleed background video — stays running through the whole auth flow */}
      <video
        ref={videoRef}
        src="/videos/welcome-hero.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Cinematic gradient overlays for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#0B1120]/50 to-[#0B1120]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120]/80 via-transparent to-[#0B1120]/80" />

      {/* Animated accent glows, matching brand */}
      <motion.div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-500/20 blur-[130px] rounded-full pointer-events-none"
        animate={{ opacity: [0.5, 0.25, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Animated scan-line accent, reused from the AI-theme visuals elsewhere in the app */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent ai-scan-line pointer-events-none" />

      {/* Mute / Unmute control */}
      <button
        onClick={() => setIsMuted((m) => !m)}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
        title={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Skip straight to the marketing site */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-5 left-5 z-20 flex items-center space-x-2 px-3.5 py-2 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-slate-200 hover:bg-black/60 transition-colors backdrop-blur-sm"
      >
        <Activity className="w-4 h-4 text-green-400" />
        <span>Explore Full Site</span>
      </button>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-2xl mb-10"
        >
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-300 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            <span>SPORTS AUTHORITY OF INDIA • AI TALENT NETWORK</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] font-['Outfit']">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-green-400">
              SportVision AI
            </span>
          </h1>
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl space-y-4"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 text-center mb-2">
                Sign in as...
              </h2>

              <div className="space-y-3">
                {(Object.keys(ROLE_META) as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => chooseRole(role)}
                    className={`w-full py-3.5 px-4 rounded-2xl bg-slate-900/70 border ${ROLE_META[role].ring} flex items-center justify-between text-sm font-bold text-white transition-all hover:scale-[1.01]`}
                  >
                    <span className="flex items-center space-x-3">
                      <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${ROLE_META[role].accent} flex items-center justify-center`}>
                        {ROLE_META[role].icon}
                      </span>
                      <span>{ROLE_META[role].label}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl glass-card rounded-3xl p-4 sm:p-6 border border-slate-700/60 shadow-2xl"
            >
              <button
                onClick={() => setStep('role')}
                className="mb-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                ← Change role
              </button>
              <AuthPage onNavigate={onNavigate} embedded initialRole={selectedRole} />
            </motion.div>
          )}
        </AnimatePresence>

        {step === 'role' && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-12 flex flex-col items-center text-slate-400"
          >
            <span className="text-[11px] uppercase tracking-widest font-semibold">Athlete • Coach • Admin</span>
            <ChevronDown className="w-4 h-4 mt-1" />
          </motion.div>
        )}
      </div>
    </div>
  );
};
