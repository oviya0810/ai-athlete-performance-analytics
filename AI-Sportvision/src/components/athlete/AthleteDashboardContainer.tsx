import React, { useState } from 'react';
import { AssessmentResult, FitnessTestType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AthleteSidebar } from './AthleteSidebar';
import { AthleteDashboardView } from './AthleteDashboardView';
import { AthleteProfileCreation } from './AthleteProfileCreation';
import { FitnessTestSelection } from './FitnessTestSelection';
import { VideoUploadModule } from './VideoUploadModule';
import { AIAnalysisModule } from './AIAnalysisModule';
import { ResultPage } from './ResultPage';
import { SportsRecommendationPage } from './SportsRecommendationPage';
import { AthletePortfolioPage } from './AthletePortfolioPage';
import { TrainingRoadmapPage } from './TrainingRoadmapPage';
import { AchievementsPage } from './AchievementsPage';
import { InjuryRiskDetectionPage } from './InjuryRiskDetectionPage';
import { GovernmentSchemeRecommendationPage } from './GovernmentSchemeRecommendationPage';
import { SportAcademyMatchingPage } from './SportAcademyMatchingPage';
import { NutritionPlannerPage } from './NutritionPlannerPage';
import { PeerComparisonPage } from './PeerComparisonPage';
import { RecoveryTrackerPage } from './RecoveryTrackerPage';
import { CompetitionCalendarPage } from './CompetitionCalendarPage';
import { MentalPerformancePage } from './MentalPerformancePage';

interface AthleteDashboardContainerProps {
  assessments: AssessmentResult[];
  onAddAssessment: (newAssessment: AssessmentResult) => void;
  onNavigatePortal?: (view: string) => void;
  initialTab?: string;
}

export const AthleteDashboardContainer: React.FC<AthleteDashboardContainerProps> = ({
  assessments,
  onAddAssessment,
  onNavigatePortal,
  initialTab = 'dashboard'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedAssessmentForView, setSelectedAssessmentForView] = useState<AssessmentResult | null>(null);
  const { user } = useAuth();

  // Upload workflow state
  const [uploadTestType, setUploadTestType] = useState<FitnessTestType>('push_up');
  const [analysisData, setAnalysisData] = useState<{
    videoUrl: string;
    videoName: string;
    testType: FitnessTestType;
  } | null>(null);

  const handleSelectTestToUpload = (testType: FitnessTestType) => {
    setUploadTestType(testType);
    setActiveTab('upload_video');
  };

  const handleStartAIAnalysis = (data: {
    videoUrl: string;
    videoName: string;
    testType: FitnessTestType;
  }) => {
    setAnalysisData(data);
    setActiveTab('ai_processing');
  };

  const handleAnalysisCompleted = (newAssessment: AssessmentResult) => {
    onAddAssessment(newAssessment);
    setSelectedAssessmentForView(newAssessment);
    setActiveTab('view_result');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B1120] text-slate-100 flex">
      {/* Sidebar */}
      <AthleteSidebar
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedAssessmentForView(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <AthleteDashboardView
            assessments={assessments}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectAssessment={(assessment) => {
              setSelectedAssessmentForView(assessment);
              setActiveTab('view_result');
            }}
          />
        )}

        {activeTab === 'create_profile' && (
          <AthleteProfileCreation onCompleteProfile={() => setActiveTab('fitness_tests')} />
        )}

        {activeTab === 'fitness_tests' && (
          <FitnessTestSelection onSelectTestToUpload={handleSelectTestToUpload} />
        )}

        {activeTab === 'upload_video' && (
          <VideoUploadModule
            initialTestType={uploadTestType}
            onStartAIAnalysis={handleStartAIAnalysis}
          />
        )}

        {activeTab === 'ai_processing' && analysisData && (
          <AIAnalysisModule
            videoUrl={analysisData.videoUrl}
            videoName={analysisData.videoName}
            testType={analysisData.testType}
            onAnalysisCompleted={handleAnalysisCompleted}
          />
        )}

        {activeTab === 'view_result' && selectedAssessmentForView && (
          <ResultPage
            assessment={selectedAssessmentForView}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onSaveToPortfolio={() => setActiveTab('portfolio')}
            onProceedToRecommendations={() => setActiveTab('recommendations')}
          />
        )}

        {activeTab === 'my_results' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white font-['Outfit']">All Assessment Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((a) => (
                <div key={a.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">{a.id}</span>
                    <span className="text-xs text-slate-400">{a.uploadDate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{a.testType.replace('_', ' ').toUpperCase()}</h3>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-2xl font-black text-green-400">{a.talentScore} Pts</span>
                    <button
                      onClick={() => {
                        setSelectedAssessmentForView(a);
                        setActiveTab('view_result');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <SportsRecommendationPage
            onProceedToPortfolio={() => setActiveTab('portfolio')}
            onApplyForAcademyTrial={() => setActiveTab('academy_matching')}
          />
        )}
        {activeTab === 'injury_risk' && <InjuryRiskDetectionPage assessments={assessments} />}
        {activeTab === 'training_roadmap' && <TrainingRoadmapPage />}
        {activeTab === 'govt_schemes' && user && <GovernmentSchemeRecommendationPage user={user} />}
        {activeTab === 'academy_matching' && user && <SportAcademyMatchingPage user={user} />}
        {activeTab === 'nutrition' && user && <NutritionPlannerPage user={user} />}
        {activeTab === 'peer_comparison' && <PeerComparisonPage assessments={assessments} />}
        {activeTab === 'recovery_tracker' && user && <RecoveryTrackerPage user={user} />}
        {activeTab === 'competition_calendar' && user && <CompetitionCalendarPage user={user} />}
        {activeTab === 'mental_performance' && <MentalPerformancePage />}
        {activeTab === 'portfolio' && (
          <AthletePortfolioPage
            assessments={assessments}
            onProceedToSAIDashboard={() => {
              if (onNavigatePortal) {
                onNavigatePortal('admin_portal');
              } else {
                setActiveTab('dashboard');
              }
            }}
          />
        )}
        {activeTab === 'achievements' && <AchievementsPage />}
        {activeTab === 'leaderboard' && <AchievementsPage />}

        {activeTab === 'settings' && (
          <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold text-white font-['Outfit']">Athlete Profile Settings</h2>
            <p className="text-xs text-slate-400">
              Update your preferred sport, village/district details, and camera frame preferences.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              Profile synchronized with Sports Authority of India National Database.
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
