import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Award,
  Ruler,
  Weight
} from 'lucide-react';

interface AthleteProfileCreationProps {
  onCompleteProfile: () => void;
}

const INDIAN_STATES = [
  'Haryana', 'Punjab', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 
  'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Kerala', 'Odisha',
  'Assam', 'Manipur', 'West Bengal', 'Gujarat', 'Delhi'
];

export const AthleteProfileCreation: React.FC<AthleteProfileCreationProps> = ({ onCompleteProfile }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Arjun Rathore',
    age: 19,
    gender: 'Male',
    heightCm: 178,
    weightKg: 68,
    state: 'Haryana',
    district: 'Bhiwani',
    villageOrBlock: 'Bhiwani Rural',
    preferredSport: 'Athletics (Sprints & Jumps)',
    experienceYears: 2
  });

  const [step, setStep] = useState<1 | 2>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile details to localStorage for persistence across steps
    localStorage.setItem('sportvision_athlete_profile', JSON.stringify(formData));
    onCompleteProfile();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Workflow Progress Breadcrumb */}
      <div className="mb-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs overflow-x-auto">
        <div className="flex items-center space-x-2 text-green-400 font-bold shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>1. Registration</span>
        </div>
        <span className="text-slate-600 mx-2">→</span>
        <div className="flex items-center space-x-2 text-blue-400 font-bold shrink-0">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
          <span>Profile Creation</span>
        </div>
        <span className="text-slate-600 mx-2">→</span>
        <div className="text-slate-500 shrink-0">3. Select Fitness Test</div>
        <span className="text-slate-600 mx-2">→</span>
        <div className="text-slate-500 shrink-0">4. Video Upload & AI Analysis</div>
      </div>

      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-8 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              STEP 2 OF WORKFLOW • ATHLETE ONBOARDING
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
              Create Your SAI Athlete Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Enter physical biometrics and district details to calibrate SAI benchmark percentiles accurately.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
            <User className="w-6 h-6" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 ? (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <span>Personal & Biometric Data</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Age (Years)</label>
                  <input
                    type="number"
                    min={10}
                    max={35}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                    <Ruler className="w-3.5 h-3.5 text-blue-400" />
                    <span>Height (cm)</span>
                  </label>
                  <input
                    type="number"
                    min={120}
                    max={220}
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                    <Weight className="w-3.5 h-3.5 text-green-400" />
                    <span>Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={130}
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center space-x-2"
                >
                  <span>Next: Geographic & Sport Pathway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>State, District & Sporting Discipline</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">State / Union Territory</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Bhiwani, Rohtak, Patiala"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-2">Primary Sport Interest</label>
                  <select
                    value={formData.preferredSport}
                    onChange={(e) => setFormData({ ...formData, preferredSport: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Athletics (Sprints & Jumps)">Athletics (Sprints & Jumps)</option>
                    <option value="Wrestling & Kabaddi">Wrestling & Kabaddi</option>
                    <option value="Football">Football</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Boxer & Combat Sports">Boxing & Combat Sports</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  ← Back to Biometrics
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save Profile & Proceed to Select Fitness Test →</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
