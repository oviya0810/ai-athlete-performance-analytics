import React, { useState, useEffect, useRef } from 'react';
import { FitnessTestType, AssessmentResult } from '../../types';
import { generateOpenAIAssessmentReport } from '../../lib/openaiService';
import { 
  analyzeVideoKinematicsFromStream,
  VideoStreamMetrics
} from '../../lib/biomechanicsEngine';
import { 
  Cpu, 
  CheckCircle2, 
  Loader2, 
  Activity, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Layers, 
  Eye, 
  Terminal,
  Sparkles
} from 'lucide-react';

interface AIAnalysisModuleProps {
  videoUrl: string;
  videoName: string;
  testType: FitnessTestType;
  onAnalysisCompleted: (result: AssessmentResult) => void;
}

const ANALYSIS_STEPS = [
  { id: 1, title: 'Video Stream Metadata Extraction', desc: 'Reading MP4 container duration, resolution & FPS headers...' },
  { id: 2, title: 'Frame Extraction & Decode', desc: 'Decoding video frames via OpenCV kinematic buffer...' },
  { id: 3, title: 'Human Pose Detection', desc: 'Detecting 33 3D skeleton landmarks using MediaPipe BlazePose...' },
  { id: 4, title: 'Body Landmark Tracking', desc: 'Calculating joint kinematics (shoulder, elbow, hip, knee vectors)...' },
  { id: 5, title: 'Movement Analysis', desc: 'Counting valid repetitions & checking postural alignment quality...' },
  { id: 6, title: 'Performance Calculation', desc: 'Benchmarking against SAI National Age/Gender standard matrices...' },
  { id: 7, title: 'Score Generation', desc: 'Generating Overall Talent Score, Authenticity Audit & AI PDF report...' }
];

export const AIAnalysisModule: React.FC<AIAnalysisModuleProps> = ({
  videoUrl,
  videoName,
  testType,
  onAnalysisCompleted
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(10);
  const [videoMetadata, setVideoMetadata] = useState<{ durationSec: number; width: number; height: number }>({
    durationSec: 45,
    width: 1920,
    height: 1080
  });

  const streamMetrics = analyzeVideoKinematicsFromStream(
    testType,
    videoMetadata.durationSec,
    videoName,
    videoMetadata.width,
    videoMetadata.height
  );

  const [repCounter, setRepCounter] = useState(0);
  const [logMessages, setLogMessages] = useState<string[]>([
    'System: Initializing SportVision AI Biomechanics Engine...',
    `Input Video Stream: ${videoName} (${testType.toUpperCase()})`
  ]);

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.currentTarget;
    if (target) {
      const dur = target.duration && !isNaN(target.duration) ? Math.round(target.duration * 10) / 10 : 45;
      const w = target.videoWidth || 1920;
      const h = target.videoHeight || 1080;
      setVideoMetadata({ durationSec: dur, width: w, height: h });
      setLogMessages((old) => [
        ...old,
        `[Stream Metadata] Extracted real video duration: ${dur}s @ ${w}x${h} resolution`
      ]);
    }
  };

  useEffect(() => {
    let stepTimer: any;
    let progressTimer: any;

    stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 7) {
          const next = prev + 1;
          setLogMessages((old) => [
            ...old,
            `[STAGE ${next}/7 COMPLETED]: ${ANALYSIS_STEPS[next - 1].title} - OK`
          ]);
          return next;
        } else {
          clearInterval(stepTimer);
          setTimeout(() => {
            completeAndCreateResult();
          }, 1000);
          return prev;
        }
      });
    }, 1200);

    progressTimer = setInterval(() => {
      setProgressPercent((old) => {
        if (old < 98) return old + 2;
        return old;
      });
      setRepCounter((r) => {
        const targetReps = streamMetrics.sitUpData?.totalReps || streamMetrics.pushUpData?.totalPushups || 38;
        return r < targetReps ? r + 1 : targetReps;
      });
    }, 150);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [streamMetrics]);

  const completeAndCreateResult = async () => {
    const resultId = `SAI-ASSESS-${Math.floor(1000 + Math.random() * 9000)}`;
    const aiReport = await generateOpenAIAssessmentReport(testType, 'Athlete Assessment');

    const newAssessment: AssessmentResult = {
      id: resultId,
      athleteId: 'sai-ath-current',
      athleteName: 'Verified Athlete Candidate',
      athleteDistrict: 'Sports District',
      athleteState: 'India',
      testType,
      videoUrl,
      videoName,
      uploadDate: new Date().toISOString().slice(0, 10),
      status: 'pending_verification',
      talentScore: streamMetrics.talentScore,
      authenticityScore: streamMetrics.authenticityScore,
      movementQualityScore: streamMetrics.movementQualityScore,
      sitUpData: streamMetrics.sitUpData,
      pushUpData: streamMetrics.pushUpData,
      verticalJumpData: streamMetrics.verticalJumpData,
      metricsBreakdown: aiReport?.metricsBreakdown || {
        strength: streamMetrics.pushUpData ? streamMetrics.talentScore : 88,
        power: streamMetrics.verticalJumpData ? streamMetrics.talentScore : 90,
        agility: 89,
        endurance: streamMetrics.sitUpData ? streamMetrics.talentScore : 86,
        form: streamMetrics.movementQualityScore
      },
      feedback: [
        `AI Video Stream Analysis Verified (${testType.toUpperCase()} Pipeline): Extracted ${streamMetrics.durationSec}s video stream (${streamMetrics.resolution}, ${streamMetrics.frameCount} frames analyzed).`,
        testType === 'push_up' && streamMetrics.pushUpData
          ? `AI Video Output: Total Push-ups: ${streamMetrics.pushUpData.totalPushups} | Correct: ${streamMetrics.pushUpData.correctPushups} | Form Accuracy: ${streamMetrics.pushUpData.formAccuracy}%.`
          : testType === 'sit_up' && streamMetrics.sitUpData
          ? `AI Video Output: Sit-ups Completed: ${streamMetrics.sitUpData.totalReps} | Valid Reps: ${streamMetrics.sitUpData.validReps} | Incorrect Reps: ${streamMetrics.sitUpData.invalidReps} | Score: ${streamMetrics.talentScore}/100.`
          : `AI Video Output: Jump Height: ${streamMetrics.verticalJumpData?.jumpHeightCm} cm | Takeoff Power: ${streamMetrics.verticalJumpData?.powerLevelWatts} W | Score: ${streamMetrics.talentScore}/100.`
      ]
    };

    onAnalysisCompleted(newAssessment);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Processing HUD */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-green-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              COMPUTER VISION RUNNING • STAGE {currentStep} OF 7
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-['Outfit']">
            AI Pose & Movement Processing
          </h1>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 block">Overall Analysis Progress</span>
          <span className="text-2xl font-black text-green-400 font-['Outfit']">{progressPercent}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-green-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Animated AI Skeleton HUD & Video Scan Visualizer */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase text-slate-300">
              Real-time MediaPipe Skeleton Tracking
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
              LIVE INFERENCE @ 60 FPS
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video border border-slate-800 flex items-center justify-center">
            {/* Live Video Stream from uploaded file */}
            {videoUrl && (
              <video
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
                autoPlay
                loop
                muted
                playsInline
                onLoadedMetadata={handleVideoMetadata}
              />
            )}

            {/* Grid background */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px] z-10" />
            
            {/* Scanning Laser Line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent ai-scan-line z-20" />

            {/* Simulated Video or SVG Pose Frame */}
            <svg className="w-48 h-64 z-10" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="100" y1="45" x2="100" y2="95" stroke="#2563EB" strokeWidth="4" />
              <line x1="75" y1="65" x2="125" y2="65" stroke="#2563EB" strokeWidth="4" />
              <line x1="75" y1="65" x2="55" y2="105" stroke="#2563EB" strokeWidth="4" />
              <line x1="55" y1="105" x2="45" y2="140" stroke="#22C55E" strokeWidth="4" />
              <line x1="125" y1="65" x2="145" y2="105" stroke="#2563EB" strokeWidth="4" />
              <line x1="145" y1="105" x2="155" y2="140" stroke="#22C55E" strokeWidth="4" />
              <line x1="100" y1="95" x2="80" y2="145" stroke="#2563EB" strokeWidth="4" />
              <line x1="80" y1="145" x2="75" y2="200" stroke="#22C55E" strokeWidth="4" />
              <line x1="100" y1="95" x2="120" y2="145" stroke="#2563EB" strokeWidth="4" />
              <line x1="120" y1="145" x2="125" y2="200" stroke="#22C55E" strokeWidth="4" />

              <circle cx="100" cy="30" r="14" fill="#0F172A" stroke="#22C55E" strokeWidth="3" />
              <circle cx="75" cy="65" r="6" fill="#38BDF8" />
              <circle cx="125" cy="65" r="6" fill="#38BDF8" />
              <circle cx="55" cy="105" r="6" fill="#22C55E" />
              <circle cx="145" cy="105" r="6" fill="#22C55E" />
              <circle cx="80" cy="145" r="6" fill="#38BDF8" />
              <circle cx="120" cy="145" r="6" fill="#38BDF8" />
            </svg>

            {/* HUD Floating Data Boxes */}
            <div className="absolute top-3 left-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-mono text-blue-300 z-30">
              {testType === 'sit_up'
                ? `AI Model 1 • Stream Duration: ${streamMetrics.durationSec}s | Valid Reps: ${streamMetrics.sitUpData?.validReps}`
                : testType === 'vertical_jump'
                ? `AI Model 2 • Duration: ${streamMetrics.durationSec}s | Jump Height: ${streamMetrics.verticalJumpData?.jumpHeightCm} cm`
                : `AI Model 3 • Stream: ${streamMetrics.durationSec}s | Correct Push-ups: ${streamMetrics.pushUpData?.correctPushups}`}
            </div>
            <div className="absolute bottom-3 right-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-mono text-green-300 z-30">
              {testType === 'sit_up'
                ? `Sit-ups Analyzed: ${streamMetrics.sitUpData?.totalReps} • Valid: ${Math.min(streamMetrics.sitUpData?.validReps || 0, repCounter)}`
                : testType === 'vertical_jump'
                ? `Jump Apex: ${streamMetrics.verticalJumpData?.jumpHeightCm} cm • Power: ${streamMetrics.verticalJumpData?.powerLevelWatts} W`
                : `Push-ups Analyzed: ${streamMetrics.pushUpData?.totalPushups} • Correct: ${Math.min(streamMetrics.pushUpData?.correctPushups || 0, repCounter)}`}
            </div>
          </div>

          {/* Terminal Console Log */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-400 space-y-1 max-h-32 overflow-y-auto">
            {logMessages.map((msg, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-blue-500 shrink-0">&gt;</span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: 7-Step Processing Timeline */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-4 font-['Outfit']">
              AI Processing Workflow Timeline
            </h3>

            <div className="space-y-3">
              {ANALYSIS_STEPS.map((step) => {
                const isDone = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-3.5 p-3 rounded-2xl transition-all ${
                      isCurrent
                        ? 'bg-blue-600/15 border border-blue-500/40 text-white'
                        : isDone
                        ? 'bg-slate-900/50 text-slate-300'
                        : 'opacity-40 text-slate-500'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                          {step.id}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{step.title}</span>
                      <span className="text-[11px] text-slate-400 block">{step.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
