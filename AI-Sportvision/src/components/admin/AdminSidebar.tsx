import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Video, 
  BarChart3, 
  Map, 
  FileText, 
  ShieldCheck,
  ChevronRight,
  UserCog,
  ShieldAlert,
  Landmark,
  Megaphone,
  History,
  Trophy,
  ClipboardList,
  PenTool,
  FileBarChart,
  TrendingUp
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  portalMode?: 'admin' | 'coach';
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentTab, onSelectTab, portalMode = 'admin' }) => {
  const ADMIN_ONLY_ITEMS = [
    { id: 'user_management', label: 'User Management', icon: UserCog },
    { id: 'fraud_monitor', label: 'Fraud & Anomaly Monitor', icon: ShieldAlert },
    { id: 'budget_insights', label: 'Budget & Resource Insights', icon: Landmark },
    { id: 'broadcast', label: 'Broadcast Announcements', icon: Megaphone },
    { id: 'audit_log', label: 'Audit Log', icon: History },
    { id: 'coach_leaderboard', label: 'Coach Leaderboard', icon: Trophy }
  ];

  const COACH_ONLY_ITEMS = [
    { id: 'squad_management', label: 'Squad Management', icon: Users },
    { id: 'progress_comparison', label: 'Progress Comparison', icon: TrendingUp },
    { id: 'training_plan_builder', label: 'Training Plan Builder', icon: ClipboardList },
    { id: 'video_annotation', label: 'Video Annotation', icon: PenTool },
    { id: 'scouting_report', label: 'Scouting Report (PDF)', icon: FileBarChart }
  ];

  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(portalMode === 'admin' ? ADMIN_ONLY_ITEMS : COACH_ONLY_ITEMS),
    { id: 'athletes', label: 'Athletes', icon: Users },
    { id: 'assessments', label: 'Assessments', icon: FileCheck },
    { id: 'video_verification', label: 'Video Verification', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'heatmap', label: 'India Heatmap', icon: Map },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800/80 shrink-0 hidden lg:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
          SAI National HQ Control Panel
        </div>
        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/25'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>HQ Auditor Clearance</span>
        </div>
        <p className="text-[10px] text-slate-400">
          Full audit access to 50,000+ AI assessment logs across 28 states.
        </p>
      </div>
    </aside>
  );
};
