import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  UploadCloud, 
  FileText, 
  Target, 
  Map, 
  UserCheck, 
  Award, 
  Trophy, 
  Settings,
  ChevronRight,
  HeartPulse,
  Landmark,
  Building2,
  Apple,
  BarChart3,
  Moon,
  CalendarDays,
  Brain
} from 'lucide-react';

interface AthleteSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const AthleteSidebar: React.FC<AthleteSidebarProps> = ({ currentTab, onSelectTab }) => {
  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fitness_tests', label: 'Fitness Tests', icon: Activity },
    { id: 'upload_video', label: 'Upload Video', icon: UploadCloud },
    { id: 'my_results', label: 'My Results', icon: FileText },
    { id: 'recommendations', label: 'Sports Recommendation', icon: Target },
    { id: 'injury_risk', label: 'Injury Risk Detection', icon: HeartPulse },
    { id: 'training_roadmap', label: 'Training Roadmap', icon: Map },
    { id: 'govt_schemes', label: 'Government Schemes', icon: Landmark },
    { id: 'academy_matching', label: 'Academy Matching', icon: Building2 },
    { id: 'nutrition', label: 'Nutrition Planner', icon: Apple },
    { id: 'peer_comparison', label: 'Peer Comparison', icon: BarChart3 },
    { id: 'recovery_tracker', label: 'Recovery & Sleep', icon: Moon },
    { id: 'competition_calendar', label: 'Competition Calendar', icon: CalendarDays },
    { id: 'mental_performance', label: 'Mental Performance', icon: Brain },
    { id: 'portfolio', label: 'Digital Portfolio', icon: UserCheck },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800/80 shrink-0 hidden lg:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Athlete Portal Navigation
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
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25'
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

      {/* Bottom Garmin Connect Inspired Status Box */}
      <div className="p-4 m-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">SAI Status:</span>
          <span className="text-green-400 font-bold">Verified Athlete</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 h-full w-[94%]" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Overall Talent Score</span>
          <span className="font-bold text-white">94.8 / 100</span>
        </div>
      </div>
    </aside>
  );
};
