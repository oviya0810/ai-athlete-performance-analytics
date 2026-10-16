import React, { useState, useMemo } from 'react';
import { AssessmentResult } from '../../types';
import { computeFraudScore } from '../../lib/aiHeuristics';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  FileVideo, 
  User, 
  MapPin, 
  Activity,
  Award,
  ShieldAlert
} from 'lucide-react';

interface VideoVerificationCenterProps {
  assessment: AssessmentResult;
  onUpdateStatus: (id: string, status: AssessmentResult['status'], verifierName?: string) => void;
  onBack: () => void;
}

export const VideoVerificationCenter: React.FC<VideoVerificationCenterProps> = ({
  assessment,
  onUpdateStatus,
  onBack
}) => {
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const fraud = useMemo(() => computeFraudScore(assessment), [assessment]);
  const verdictStyle =
    fraud.verdict === 'Low Risk'
      ? 'bg-green-500/15 text-green-400 border-green-500/30'
      : fraud.verdict === 'Medium Risk'
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      : 'bg-red-500/15 text-red-400 border-red-500/30';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-white"
        >
          ← Back to Assessments Queue
        </button>
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
          OFFICIAL SAI VIDEO AUDIT CONSOLE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Video Player */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">{assessment.videoName}</h3>
              <span className="text-xs text-slate-400">Recorded: {assessment.uploadDate}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30">
              AI VERIFIED STREAM
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 shadow-2xl relative">
            <video
              src={assessment.videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Authenticity Score: <strong className="text-white">{assessment.authenticityScore}%</strong></span>
            <span>Movement Accuracy: <strong className="text-white">{assessment.movementQualityScore}%</strong></span>
          </div>

          {/* AI-Based Fraud Score */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                AI-Based Fraud Score
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${verdictStyle}`}>
                {fraud.verdict} ({fraud.fraudRiskPercent}%)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {fraud.subScores.map((s) => (
                <div key={s.label} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{s.label}</span>
                    <span className="text-xs font-bold text-white">{s.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full ${s.score > 70 ? 'bg-green-500' : s.score > 45 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI Report Review & Official Action Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Candidate Dossier</span>
              <h2 className="text-xl font-bold text-white mt-1 font-['Outfit']">{assessment.athleteName}</h2>
              <span className="text-xs text-slate-400">
                District: {assessment.athleteDistrict}, {assessment.athleteState}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 uppercase">Overall AI Score</span>
                <div className="text-3xl font-black text-green-400 font-['Outfit']">
                  {assessment.talentScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-amber-400">Status</span>
                <div className="text-xs font-bold uppercase text-white mt-0.5">
                  {assessment.status.replace('_', ' ')}
                </div>
              </div>
            </div>

            {/* AI Feedback Summary */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400">AI Kinematic Log:</span>
              <ul className="space-y-1.5">
                {assessment.feedback.map((msg, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Verdict Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="block text-xs font-bold text-white uppercase tracking-wider">
                Official Evaluation Verdict:
              </span>

              <button
                onClick={() => {
                  onUpdateStatus(assessment.id, 'verified');
                  onBack();
                }}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-green-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Verify Athlete Score</span>
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(assessment.id, 'retest_requested');
                  onBack();
                }}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Request Video Retest (Poor Angle/Lighting)</span>
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(assessment.id, 'rejected');
                  onBack();
                }}
                className="w-full py-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Assessment Submission</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
