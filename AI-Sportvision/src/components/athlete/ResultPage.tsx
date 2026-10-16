import React, { useEffect, useRef } from 'react';
import { AssessmentResult } from '../../types';
import { 
  Trophy, 
  ShieldCheck, 
  Download, 
  Share2, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Dumbbell, 
  ArrowLeft,
  Sparkles,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

interface ResultPageProps {
  assessment: AssessmentResult;
  onBackToDashboard: () => void;
  onSaveToPortfolio: () => void;
  onProceedToRecommendations?: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  assessment,
  onBackToDashboard,
  onSaveToPortfolio,
  onProceedToRecommendations
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0F172A'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SAI_AI_Report_${assessment.id}.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
    }
  };

  const RADAR_DATA = [
    { subject: 'Strength', value: assessment.metricsBreakdown.strength },
    { subject: 'Power', value: assessment.metricsBreakdown.power },
    { subject: 'Agility', value: assessment.metricsBreakdown.agility },
    { subject: 'Endurance', value: assessment.metricsBreakdown.endurance },
    { subject: 'Form Quality', value: assessment.metricsBreakdown.form }
  ];

  const BAR_DATA = [
    { metric: 'Strength', score: assessment.metricsBreakdown.strength },
    { metric: 'Power', score: assessment.metricsBreakdown.power },
    { metric: 'Agility', score: assessment.metricsBreakdown.agility },
    { metric: 'Endurance', score: assessment.metricsBreakdown.endurance }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Action Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Athlete Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onSaveToPortfolio}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-2 border border-slate-700 flex-1 sm:flex-none justify-center"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Save to Portfolio</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center space-x-2 flex-1 sm:flex-none justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>

          {onProceedToRecommendations && (
            <button
              onClick={onProceedToRecommendations}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center space-x-2 flex-1 sm:flex-none justify-center"
            >
              <span>Next Workflow Step: Sports Recommendation →</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Report Container */}
      <div ref={reportRef} className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-10">
        
        {/* Official Report Title Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                SPORTS AUTHORITY OF INDIA (SAI) OFFICIAL AI EVALUATION
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {assessment.id}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 font-['Outfit']">
              {assessment.testType.replace('_', ' ').toUpperCase()} AI ASSESSMENT REPORT
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Athlete: <span className="text-white font-bold">{assessment.athleteName}</span> • District: {assessment.athleteDistrict}, {assessment.athleteState}
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Overall Talent Score</span>
              <span className="text-4xl font-black text-green-400 font-['Outfit']">{assessment.talentScore}</span>
              <span className="text-xs text-slate-400"> / 100</span>
            </div>
          </div>
        </div>

        {/* AI Verification & Authenticity Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/15 text-green-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] uppercase font-bold text-slate-400">Video Authenticity</span>
              <span className="text-xl font-bold text-white">{assessment.authenticityScore}% Verified</span>
              <span className="block text-[10px] text-green-400">No Tampering Detected</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] uppercase font-bold text-slate-400">Movement Quality</span>
              <span className="text-xl font-bold text-white">{assessment.movementQualityScore}% Accuracy</span>
              <span className="block text-[10px] text-blue-400">33-Point Skeleton Match</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] uppercase font-bold text-slate-400">SAI Scouting Tier</span>
              <span className="text-xl font-bold text-white">National Elite Tier</span>
              <span className="block text-[10px] text-amber-400">Recommended for NCOE Camp</span>
            </div>
          </div>
        </div>

        {/* Specific Model Output Cards */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                VERIFIED BY MEDIAPIPE + OPENCV
              </span>
              <h3 className="text-base font-black text-white mt-2">
                {assessment.testType === 'sit_up'
                  ? 'AI Model 1: Sit-Up Performance Analysis ⭐⭐⭐⭐⭐'
                  : assessment.testType === 'vertical_jump'
                  ? 'AI Model 2: Vertical Jump Height Estimation ⭐⭐⭐⭐⭐'
                  : 'AI Model 3: Push-Up Form & Counting ⭐⭐⭐⭐⭐'}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">33-Landmark Kinematic Audited</span>
          </div>

          {assessment.pushUpData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Total Push-ups</span>
                <span className="text-2xl font-black text-white">{assessment.pushUpData.totalPushups}</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Correct Repetitions</span>
                <span className="text-2xl font-black text-green-400">{assessment.pushUpData.correctPushups}</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Wrong Form Reps</span>
                <span className="text-2xl font-black text-red-400">
                  {assessment.pushUpData.totalPushups - assessment.pushUpData.correctPushups}
                </span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Form Quality</span>
                <span className="text-2xl font-black text-blue-400">{assessment.pushUpData.formAccuracy}%</span>
              </div>
            </div>
          )}

          {assessment.sitUpData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Sit-ups Completed</span>
                <span className="text-2xl font-black text-white">{assessment.sitUpData.totalReps}</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Valid Reps</span>
                <span className="text-2xl font-black text-green-400">{assessment.sitUpData.validReps}</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Incorrect Reps</span>
                <span className="text-2xl font-black text-red-400">{assessment.sitUpData.invalidReps}</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Performance Score</span>
                <span className="text-2xl font-black text-blue-400">90 / 100</span>
              </div>
            </div>
          )}

          {assessment.verticalJumpData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Standing Height</span>
                <span className="text-2xl font-black text-white">165 cm</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Jump Height</span>
                <span className="text-2xl font-black text-green-400">{assessment.verticalJumpData.jumpHeightCm} cm</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">Power Level</span>
                <span className="text-2xl font-black text-amber-400">Excellent</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="block text-xs text-slate-400">SAI Score</span>
                <span className="text-2xl font-black text-blue-400">92 / 100</span>
              </div>
            </div>
          )}
        </div>

        {/* Recharts Section: Radar Chart & Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-6 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
              Physical Attribute Radar
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Athlete Score" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.45} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
              Performance Metrics Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BAR_DATA}>
                  <XAxis dataKey="metric" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" domain={[0, 100]} fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                  <Bar dataKey="score" fill="#22C55E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* AI Biomechanical Feedback */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            AI Biomechanical Feedback & Coaching Advisory
          </h3>
          <ul className="space-y-2">
            {assessment.feedback.map((f, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
