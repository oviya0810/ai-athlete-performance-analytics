import React, { useEffect, useState } from 'react';
import { AssessmentResult } from '../../types';
import { ClipboardList, Plus, Trash2, Send } from 'lucide-react';

interface TrainingPlanBuilderPanelProps {
  assessments: AssessmentResult[];
  coachId: string;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

interface AssignedPlan {
  id: string;
  athleteId: string;
  athleteName: string;
  title: string;
  exercises: Exercise[];
  assignedAt: string;
}

const storageKey = (coachId: string) => `sportvision_coach_plans_${coachId}`;

export const TrainingPlanBuilderPanel: React.FC<TrainingPlanBuilderPanelProps> = ({ assessments, coachId }) => {
  const uniqueAthletes = Array.from(new Map(assessments.map((a) => [a.athleteId, a])).values());

  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: '3', reps: '10' }]);
  const [plans, setPlans] = useState<AssignedPlan[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(coachId));
      if (raw) setPlans(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [coachId]);

  const addExerciseRow = () => setExercises([...exercises, { name: '', sets: '3', reps: '10' }]);
  const updateExercise = (i: number, field: keyof Exercise, value: string) => {
    const next = [...exercises];
    next[i] = { ...next[i], [field]: value };
    setExercises(next);
  };
  const removeExercise = (i: number) => setExercises(exercises.filter((_, idx) => idx !== i));

  const assignPlan = () => {
    if (!selectedAthlete || !title.trim()) return;
    const athlete = uniqueAthletes.find((a) => a.athleteId === selectedAthlete);
    if (!athlete) return;

    const newPlan: AssignedPlan = {
      id: `plan-${Date.now()}`,
      athleteId: athlete.athleteId,
      athleteName: athlete.athleteName,
      title: title.trim(),
      exercises: exercises.filter((e) => e.name.trim()),
      assignedAt: new Date().toLocaleDateString('en-IN')
    };
    const updated = [newPlan, ...plans];
    setPlans(updated);
    localStorage.setItem(storageKey(coachId), JSON.stringify(updated));
    setTitle('');
    setExercises([{ name: '', sets: '3', reps: '10' }]);
    setSelectedAthlete('');
  };

  const deletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem(storageKey(coachId), JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/15 text-green-400 border border-green-500/30">
          Coach Tools • Custom Training Plan Builder
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-green-400" />
          Training Plan Builder
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Build a custom exercise plan and assign it directly to one of your athletes.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
          >
            <option value="">Select athlete...</option>
            {uniqueAthletes.map((a) => (
              <option key={a.athleteId} value={a.athleteId}>{a.athleteName}</option>
            ))}
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Plan title (e.g. Week 1 - Strength Base)"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
          />
        </div>

        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={ex.name}
                onChange={(e) => updateExercise(i, 'name', e.target.value)}
                placeholder="Exercise name"
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <input
                value={ex.sets}
                onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                placeholder="Sets"
                className="w-16 px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <input
                value={ex.reps}
                onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                placeholder="Reps"
                className="w-16 px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
              <button onClick={() => removeExercise(i)} className="text-red-400 hover:text-red-300 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={addExerciseRow} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Exercise
          </button>
          <button onClick={assignPlan} className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Assign to Athlete
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Assigned Plans ({plans.length})</h2>
        {plans.length === 0 ? (
          <p className="text-xs text-slate-500">No plans assigned yet.</p>
        ) : (
          plans.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <span className="text-[11px] text-slate-400">For {p.athleteName} • {p.assignedAt}</span>
                </div>
                <button onClick={() => deletePlan(p.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.exercises.map((e, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {e.name} — {e.sets}x{e.reps}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
