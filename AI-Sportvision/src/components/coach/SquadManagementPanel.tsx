import React, { useEffect, useState } from 'react';
import { AssessmentResult } from '../../types';
import { Users, Star, Trash2, Plus } from 'lucide-react';

interface SquadManagementPanelProps {
  assessments: AssessmentResult[];
  coachId: string;
}

interface SquadEntry {
  athleteName: string;
  athleteId: string;
  group: string;
}

const storageKey = (coachId: string) => `sportvision_squad_${coachId}`;

const GROUPS = ['A - Sprint Squad', 'B - Endurance Squad', 'C - Power/Jump Squad', 'Trial Watchlist'];

export const SquadManagementPanel: React.FC<SquadManagementPanelProps> = ({ assessments, coachId }) => {
  const [squad, setSquad] = useState<SquadEntry[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(GROUPS[0]);

  const uniqueAthletes = Array.from(new Map(assessments.map((a) => [a.athleteId, a])).values());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(coachId));
      if (raw) setSquad(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [coachId]);

  const persist = (next: SquadEntry[]) => {
    setSquad(next);
    localStorage.setItem(storageKey(coachId), JSON.stringify(next));
  };

  const addToSquad = () => {
    if (!selectedAthlete) return;
    const athlete = uniqueAthletes.find((a) => a.athleteId === selectedAthlete);
    if (!athlete) return;
    if (squad.some((s) => s.athleteId === selectedAthlete && s.group === selectedGroup)) return;
    persist([...squad, { athleteName: athlete.athleteName, athleteId: athlete.athleteId, group: selectedGroup }]);
  };

  const removeFromSquad = (athleteId: string, group: string) => {
    persist(squad.filter((s) => !(s.athleteId === athleteId && s.group === group)));
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Coach Tools • Squad Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-400" />
          Squad / Team Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Organize the athletes you coach into training groups for structured session planning.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Add Athlete to a Group</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
          >
            <option value="">Select athlete...</option>
            {uniqueAthletes.map((a) => (
              <option key={a.athleteId} value={a.athleteId}>{a.athleteName} — {a.athleteDistrict}</option>
            ))}
          </select>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
          >
            {GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <button onClick={addToSquad} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GROUPS.map((group) => {
          const members = squad.filter((s) => s.group === group);
          return (
            <div key={group} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> {group}
                <span className="text-[10px] text-slate-500 font-normal">({members.length})</span>
              </h3>
              {members.length === 0 ? (
                <p className="text-xs text-slate-500">No athletes assigned yet.</p>
              ) : (
                members.map((m) => (
                  <div key={m.athleteId} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800">
                    <span className="text-xs text-slate-200">{m.athleteName}</span>
                    <button onClick={() => removeFromSquad(m.athleteId, m.group)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
