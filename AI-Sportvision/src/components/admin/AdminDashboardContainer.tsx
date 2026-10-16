import React, { useState } from 'react';
import { AssessmentResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AthleteManagementTable } from './AthleteManagementTable';
import { VideoVerificationCenter } from './VideoVerificationCenter';
import { TalentAnalyticsDashboard } from './TalentAnalyticsDashboard';
import { UserManagementPanel } from './UserManagementPanel';
import { FraudMonitorPanel } from './FraudMonitorPanel';
import { BudgetInsightsPanel } from './BudgetInsightsPanel';
import { BroadcastPanel } from './BroadcastPanel';
import { AuditLogPanel } from './AuditLogPanel';
import { CoachLeaderboardPanel } from './CoachLeaderboardPanel';
import { SquadManagementPanel } from '../coach/SquadManagementPanel';
import { ProgressComparisonPanel } from '../coach/ProgressComparisonPanel';
import { TrainingPlanBuilderPanel } from '../coach/TrainingPlanBuilderPanel';
import { VideoAnnotationPanel } from '../coach/VideoAnnotationPanel';
import { ScoutingReportPanel } from '../coach/ScoutingReportPanel';
import { addAuditEntry } from '../../lib/auditLog';
import { STATE_BUDGET_DATA } from '../../lib/aiHeuristics';
import jsPDF from 'jspdf';
import { 
  Users, 
  Video, 
  FileCheck, 
  CheckCircle2, 
  Trophy, 
  TrendingUp, 
  ShieldCheck,
  Search,
  Download
} from 'lucide-react';

interface AdminDashboardContainerProps {
  assessments: AssessmentResult[];
  onUpdateAssessmentStatus: (id: string, status: AssessmentResult['status'], verifierName?: string) => void;
  portalMode?: 'admin' | 'coach';
}

export const AdminDashboardContainer: React.FC<AdminDashboardContainerProps> = ({
  assessments,
  onUpdateAssessmentStatus,
  portalMode = 'admin'
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAssessmentForReview, setSelectedAssessmentForReview] = useState<AssessmentResult | null>(null);
  const { user } = useAuth();
  const actorId = user?.id || (portalMode === 'admin' ? 'admin001' : 'coach001');
  const actorName = user?.name || (portalMode === 'admin' ? 'Admin' : 'Coach');

  const totalAthletes = 50240;
  const uploadedVideos = 68412;
  const verifiedCount = assessments.filter(a => a.status === 'verified').length + 47800;
  const pendingCount = assessments.filter(a => a.status === 'pending_verification').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B1120] text-slate-100 flex">
      <AdminSidebar
        currentTab={activeTab}
        portalMode={portalMode}
        onSelectTab={(tab) => {
          setSelectedAssessmentForReview(null);
          setActiveTab(tab);
        }}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && !selectedAssessmentForReview && (
          <div className="space-y-8">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-amber-900/40 via-slate-900/80 to-blue-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {portalMode === 'admin' ? 'SAI HEADQUARTERS COMMAND CENTER' : 'SAI NATIONAL COACH & EVALUATOR DASHBOARD'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
                  {portalMode === 'admin' ? 'National Talent Discovery Control Panel' : 'Evaluation & Roster Verification Panel'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Real-time Computer Vision assessment intake, fraud detection audit, and national athlete roster management.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveTab('video_verification')}
                  className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 flex items-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Review Pending Videos ({pendingCount})</span>
                </button>
              </div>
            </div>

            {/* Enterprise Dashboard Top Stats Widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400">Total Athletes</span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
                  {totalAthletes.toLocaleString()}
                </div>
                <span className="text-[10px] text-green-400 font-semibold">+1,240 this week</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400">Uploaded Videos</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-2 font-['Outfit']">
                  {uploadedVideos.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">100% cloud stored</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400">AI Processed Tests</span>
                <div className="text-2xl sm:text-3xl font-black text-green-400 mt-2 font-['Outfit']">
                  99.4%
                </div>
                <span className="text-[10px] text-green-400 font-semibold">MediaPipe pose tracking</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400">Verified Results</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2 font-['Outfit']">
                  {verifiedCount.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">SAI certified</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold uppercase text-slate-400">Top Performers</span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
                  Top 3%
                </div>
                <span className="text-[10px] text-blue-400 font-semibold">Invited for NCOE</span>
              </div>
            </div>

            {/* Quick Pending Verification Queue */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">Pending Video Verification Queue</h3>
                  <p className="text-xs text-slate-400">Recent AI assessments requiring human evaluator sign-off</p>
                </div>
                <button
                  onClick={() => setActiveTab('video_verification')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  View All Pending →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assessments.map((a) => (
                  <div key={a.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">{a.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        a.status === 'verified' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {a.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{a.athleteName}</h4>
                      <span className="text-xs text-slate-400">
                        {a.athleteDistrict}, {a.athleteState} • {a.testType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs font-black text-green-400">{a.talentScore} Pts</span>
                      <button
                        onClick={() => {
                          setSelectedAssessmentForReview(a);
                          setActiveTab('review_video');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                      >
                        Audit Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Preview Analytics */}
            <TalentAnalyticsDashboard />
          </div>
        )}

        {activeTab === 'user_management' && portalMode === 'admin' && (
          <UserManagementPanel />
        )}
        {activeTab === 'fraud_monitor' && portalMode === 'admin' && (
          <FraudMonitorPanel
            assessments={assessments}
            onSelectAssessment={(a) => {
              setSelectedAssessmentForReview(a);
              setActiveTab('review_video');
            }}
          />
        )}
        {activeTab === 'budget_insights' && portalMode === 'admin' && <BudgetInsightsPanel />}
        {activeTab === 'broadcast' && portalMode === 'admin' && <BroadcastPanel postedBy={actorId} />}
        {activeTab === 'audit_log' && portalMode === 'admin' && <AuditLogPanel />}
        {activeTab === 'coach_leaderboard' && portalMode === 'admin' && <CoachLeaderboardPanel />}

        {activeTab === 'squad_management' && portalMode === 'coach' && (
          <SquadManagementPanel assessments={assessments} coachId={actorId} />
        )}
        {activeTab === 'progress_comparison' && portalMode === 'coach' && (
          <ProgressComparisonPanel assessments={assessments} />
        )}
        {activeTab === 'training_plan_builder' && portalMode === 'coach' && (
          <TrainingPlanBuilderPanel assessments={assessments} coachId={actorId} />
        )}
        {activeTab === 'video_annotation' && portalMode === 'coach' && (
          <VideoAnnotationPanel assessments={assessments} coachId={actorId} />
        )}
        {activeTab === 'scouting_report' && portalMode === 'coach' && (
          <ScoutingReportPanel assessments={assessments} coachName={actorName} />
        )}

        {/* Sub tabs */}
        {activeTab === 'athletes' && !selectedAssessmentForReview && (
          <AthleteManagementTable
            assessments={assessments}
            onSelectAthleteAssessment={(a) => {
              setSelectedAssessmentForReview(a);
              setActiveTab('review_video');
            }}
          />
        )}

        {(activeTab === 'assessments' || activeTab === 'video_verification') && !selectedAssessmentForReview && (
          <AthleteManagementTable
            assessments={assessments}
            onSelectAthleteAssessment={(a) => {
              setSelectedAssessmentForReview(a);
              setActiveTab('review_video');
            }}
          />
        )}

        {activeTab === 'review_video' && selectedAssessmentForReview && (
          <VideoVerificationCenter
            assessment={selectedAssessmentForReview}
            onUpdateStatus={(id, st, verName) => {
              onUpdateAssessmentStatus(id, st, verName);
              addAuditEntry(actorId, `Marked assessment ${id} as "${st.replace('_', ' ')}"`, 'verification');
              setSelectedAssessmentForReview(null);
              setActiveTab('dashboard');
            }}
            onBack={() => {
              setSelectedAssessmentForReview(null);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'analytics' && <TalentAnalyticsDashboard />}
        {activeTab === 'heatmap' && <TalentAnalyticsDashboard />}

        {activeTab === 'reports' && (
          <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-4">
            <h2 className="text-2xl font-bold text-white font-['Outfit']">National SAI Assessment Reports</h2>
            <p className="text-sm text-slate-300">
              Download complete state-by-state AI assessment CSV and PDF summaries.
            </p>
            <button
              onClick={() => {
                const doc = new jsPDF();
                doc.setFontSize(18);
                doc.text('SAI National Assessment Report Bundle', 14, 20);
                doc.setFontSize(10);
                doc.text(`Generated ${new Date().toLocaleDateString('en-IN')}`, 14, 27);
                doc.line(14, 31, 196, 31);

                let y = 42;
                doc.setFontSize(13);
                doc.text('State-wise Summary', 14, y);
                y += 8;
                doc.setFontSize(9);
                STATE_BUDGET_DATA.forEach((s) => {
                  doc.text(
                    `${s.state}  |  Athletes: ${s.athletesRegistered}  |  Budget: Rs.${s.budgetAllocatedCr}Cr  |  Utilization: ${s.budgetUtilizedPercent}%  |  Academies: ${s.academiesCount}`,
                    14,
                    y
                  );
                  y += 6;
                });

                y += 8;
                doc.setFontSize(13);
                doc.text('Assessment Log', 14, y);
                y += 8;
                doc.setFontSize(9);
                assessments.forEach((a) => {
                  doc.text(
                    `${a.uploadDate}  |  ${a.athleteName} (${a.athleteState})  |  ${a.testType.replace('_', ' ').toUpperCase()}  |  Score: ${a.talentScore}  |  Status: ${a.status.replace('_', ' ')}`,
                    14,
                    y
                  );
                  y += 6;
                  if (y > 270) {
                    doc.addPage();
                    y = 20;
                  }
                });

                doc.save(`SAI_National_Report_Bundle_${new Date().toISOString().slice(0, 10)}.pdf`);
                addAuditEntry(actorId, 'Downloaded National Report Bundle', 'system');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Complete National Report Bundle
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
