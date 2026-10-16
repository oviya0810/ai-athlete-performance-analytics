import React, { useEffect, useRef, useState } from 'react';
import { Brain, Wind, Play, Square, Sparkles } from 'lucide-react';

const TECHNIQUES = [
  {
    title: 'Box Breathing (Pre-Competition Calm)',
    description: 'Used by elite athletes to lower heart rate and sharpen focus before a competition or trial.',
    steps: ['Inhale for 4 seconds', 'Hold for 4 seconds', 'Exhale for 4 seconds', 'Hold for 4 seconds', 'Repeat 4-6 times']
  },
  {
    title: 'Visualization Routine',
    description: 'Mentally rehearse your event start-to-finish to build confidence and reduce surprise-anxiety.',
    steps: ['Close your eyes, picture the venue', 'Visualize your warm-up routine', 'Visualize a perfect execution of your event', 'Visualize the feeling of success at the finish']
  },
  {
    title: 'Self-Talk Reset',
    description: 'Replace negative self-talk with short, specific cue words during high-pressure moments.',
    steps: ['Notice the negative thought ("I might fail")', 'Say a cue word out loud/in your head ("Strong", "Ready")', 'Refocus on your very next action, not the outcome']
  }
];

export const MentalPerformancePage: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold 2'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phases: ('Inhale' | 'Hold' | 'Exhale' | 'Hold 2')[] = ['Inhale', 'Hold', 'Exhale', 'Hold 2'];

  useEffect(() => {
    if (!isBreathing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setPhase((p) => phases[(phases.indexOf(p) + 1) % phases.length]);
          return 4;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreathing]);

  const startBreathing = () => {
    setPhase('Inhale');
    setSecondsLeft(4);
    setIsBreathing(true);
  };

  const stopBreathing = () => setIsBreathing(false);

  const circleScale = phase === 'Inhale' ? 'scale-125' : phase === 'Exhale' ? 'scale-75' : 'scale-100';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          Sports Psychology • Mental Performance Assistant
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Brain className="w-7 h-7 text-indigo-300" />
          Mental Performance Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Simple, evidence-based mental techniques to manage competition anxiety and build focus.
        </p>
      </div>

      {/* Interactive box-breathing timer */}
      <div className="glass-card rounded-3xl p-8 border border-slate-800 flex flex-col items-center space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Wind className="w-4 h-4 text-blue-400" /> Box Breathing Timer
        </h2>
        <div
          className={`w-40 h-40 rounded-full bg-gradient-to-br from-blue-600/40 to-indigo-500/40 border-2 border-blue-500/50 flex items-center justify-center transition-transform duration-[1000ms] ${
            isBreathing ? circleScale : 'scale-100'
          }`}
        >
          <div className="text-center">
            <div className="text-xl font-black text-white font-['Outfit']">{isBreathing ? phase : 'Ready'}</div>
            {isBreathing && <div className="text-3xl font-black text-blue-300">{secondsLeft}</div>}
          </div>
        </div>
        {!isBreathing ? (
          <button onClick={startBreathing} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2">
            <Play className="w-4 h-4" /> Start Breathing Exercise
          </button>
        ) : (
          <button onClick={stopBreathing} className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-2">
            <Square className="w-4 h-4" /> Stop
          </button>
        )}
      </div>

      {/* Technique cards */}
      <div className="space-y-4">
        {TECHNIQUES.map((t) => (
          <div key={t.title} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-400" /> {t.title}
            </h3>
            <p className="text-xs text-slate-400">{t.description}</p>
            <ol className="space-y-1 pt-1">
              {t.steps.map((s, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-[10px] font-bold text-blue-400 mt-0.5">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};
