import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssessmentResult } from './types';
import { getStoredAssessments, storeAssessment, updateAssessmentStatus } from './lib/supabase';
import { fetchAssessmentsFromSupabase } from './lib/supabaseService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SupabaseConnectionModal } from './components/common/SupabaseConnectionModal';
import { LandingPage } from './components/public/LandingPage';
import { WelcomePage } from './components/public/WelcomePage';
import { AboutPage } from './components/public/AboutPage';
import { FeaturesPage } from './components/public/FeaturesPage';
import { AuthPage } from './components/auth/AuthPage';
import { AthleteDashboardContainer } from './components/athlete/AthleteDashboardContainer';
import { AdminDashboardContainer } from './components/admin/AdminDashboardContainer';
import { clearAllAuthAndHistory, seedMasterAdminIfNeeded } from './lib/authStore';
import { VoiceAssistantWidget } from './components/common/VoiceAssistantWidget';

export function AppContent() {
  const [currentView, setCurrentView] = useState<string>('welcome');
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // One-time cleanup: wipe any legacy demo accounts / session / history
    // from earlier builds, then guarantee exactly one master Admin account
    // exists so the platform is never locked out. Runs once per browser.
    const RESET_FLAG = 'sportvision_reset_v3_admin_only_model';
    if (!localStorage.getItem(RESET_FLAG)) {
      clearAllAuthAndHistory();
      localStorage.setItem(RESET_FLAG, '1');
    }
    seedMasterAdminIfNeeded();
  }, []);

  useEffect(() => {
    const local = getStoredAssessments();
    setAssessments(local);

    // Synchronize live assessments from Supabase PostgreSQL database
    fetchAssessmentsFromSupabase().then((liveData) => {
      if (liveData && liveData.length > 0) {
        setAssessments(liveData);
      }
    });
  }, []);

  const handleAddAssessment = (newAssessment: AssessmentResult) => {
    const updated = storeAssessment(newAssessment);
    setAssessments(updated);
  };

  const handleUpdateStatus = (
    id: string,
    status: AssessmentResult['status'],
    verifierName?: string
  ) => {
    const updated = updateAssessmentStatus(id, status, verifierName);
    setAssessments(updated);
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navbar — hidden on the cinematic Welcome screen for a full-bleed video experience */}
      {currentView !== 'welcome' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />
      )}

      <SupabaseConnectionModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onDataSynced={(synced) => setAssessments(synced)}
      />

      {/* Main Dynamic View Content */}
      <div className="flex-1">
        {currentView === 'welcome' && (
          <WelcomePage onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'landing' && (
          <LandingPage onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'about' && (
          <AboutPage onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'features' && (
          <FeaturesPage onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'auth' && (
          <AuthPage onNavigate={(view) => setCurrentView(view)} />
        )}

        {/* Athlete Portal */}
        {currentView.startsWith('athlete_') && (
          <AthleteDashboardContainer
            assessments={assessments}
            onAddAssessment={handleAddAssessment}
            onNavigatePortal={(view) => setCurrentView(view)}
            initialTab={currentView === 'athlete_dashboard' ? 'dashboard' : currentView.replace('athlete_', '')}
          />
        )}

        {/* SAI Coach Portal */}
        {currentView === 'coach_portal' && (
          <AdminDashboardContainer
            assessments={assessments}
            onUpdateAssessmentStatus={handleUpdateStatus}
            portalMode="coach"
          />
        )}

        {/* SAI Admin Portal */}
        {currentView === 'admin_portal' && (
          <AdminDashboardContainer
            assessments={assessments}
            onUpdateAssessmentStatus={handleUpdateStatus}
            portalMode="admin"
          />
        )}
      </div>

      {/* Footer */}
      {currentView !== 'welcome' && <Footer onNavigate={(view) => setCurrentView(view)} />}

      {/* Global floating multi-language voice assistant — available on every logged-in view */}
      {user && currentView !== 'welcome' && <VoiceAssistantWidget userName={user.name} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
