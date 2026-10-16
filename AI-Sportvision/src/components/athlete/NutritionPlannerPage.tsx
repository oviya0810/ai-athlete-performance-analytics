import React, { useMemo } from 'react';
import { User } from '../../types';
import { computeNutritionPlan } from '../../lib/aiHeuristics';
import { Apple, Droplet, Flame, Beef, Wheat, Info } from 'lucide-react';

interface NutritionPlannerPageProps {
  user: User;
}

export const NutritionPlannerPage: React.FC<NutritionPlannerPageProps> = ({ user }) => {
  const plan = useMemo(() => computeNutritionPlan(user), [user]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/15 text-green-400 border border-green-500/30">
          AI Nutrition • Diet Planner
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Apple className="w-7 h-7 text-green-400" />
          Nutrition & Diet Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Personalized daily targets for {user.name || 'you'} based on body weight ({user.weight ?? '—'}kg) and{' '}
          {user.preferredSport || 'your'} training load.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <Flame className="w-5 h-5 text-amber-400 mb-2" />
          <span className="text-[11px] font-bold uppercase text-slate-400">Daily Calories</span>
          <div className="text-2xl font-black text-white font-['Outfit']">{plan.dailyCalories}</div>
          <span className="text-[10px] text-slate-500">kcal</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <Beef className="w-5 h-5 text-red-400 mb-2" />
          <span className="text-[11px] font-bold uppercase text-slate-400">Protein</span>
          <div className="text-2xl font-black text-white font-['Outfit']">{plan.proteinGrams}g</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <Wheat className="w-5 h-5 text-amber-300 mb-2" />
          <span className="text-[11px] font-bold uppercase text-slate-400">Carbs</span>
          <div className="text-2xl font-black text-white font-['Outfit']">{plan.carbsGrams}g</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <Droplet className="w-5 h-5 text-blue-400 mb-2" />
          <span className="text-[11px] font-bold uppercase text-slate-400">Water</span>
          <div className="text-2xl font-black text-white font-['Outfit']">{plan.waterLiters}L</div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Today's Meal Plan</h2>
        <div className="space-y-3">
          {plan.meals.map((meal) => (
            <div key={meal.meal} className="flex items-start justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{meal.meal}</span>
                  <span className="text-[10px] text-slate-500">{meal.time}</span>
                </div>
                <ul className="mt-1 space-y-0.5">
                  {meal.items.map((it, i) => (
                    <li key={i} className="text-xs text-slate-300">• {it}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
        <span className="text-[11px] font-bold uppercase text-slate-400">AI Notes</span>
        {plan.notes.map((n, i) => (
          <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
            <span>{n}</span>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>General sports-nutrition guidance, not a substitute for a registered dietitian — especially if you have any medical condition.</span>
      </div>
    </div>
  );
};
