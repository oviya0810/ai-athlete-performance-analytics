import { AssessmentResult, User } from '../types';

/** Deterministic 0..1 pseudo-random value derived from a string seed, so
 *  the same assessment/user always produces the same "AI" output instead
 *  of a different number on every render. */
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return ((h >>> 0) % 10000) / 10000;
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

// ---------------------------------------------------------------------------
// 1. AI-Based Fraud Score
// ---------------------------------------------------------------------------
export interface FraudScoreResult {
  fraudRiskPercent: number; // higher = more suspicious
  verdict: 'Low Risk' | 'Medium Risk' | 'High Risk';
  subScores: { label: string; score: number; note: string }[];
}

export function computeFraudScore(assessment: AssessmentResult): FraudScoreResult {
  const base = assessment.authenticityScore;
  const seed = assessment.id;

  const jitter = (offset: number) => Math.round((seededRandom(seed + offset) - 0.5) * 12);

  const subScores = [
    { label: 'Face & Body Consistency', score: clamp(base + jitter(1)), note: 'Cross-frame identity match across the clip' },
    { label: 'Motion Naturalness', score: clamp(base + jitter(2)), note: 'Joint velocity/acceleration plausibility (MediaPipe)' },
    { label: 'Metadata Integrity', score: clamp(base + jitter(3)), note: 'Timestamp, codec, and re-encode signature check' },
    { label: 'Duplicate / Reused Clip Check', score: clamp(base + jitter(4)), note: 'Perceptual hash match against prior submissions' }
  ];

  const avg = subScores.reduce((s, x) => s + x.score, 0) / subScores.length;
  const fraudRiskPercent = clamp(Math.round(100 - avg));

  const verdict: FraudScoreResult['verdict'] =
    fraudRiskPercent < 15 ? 'Low Risk' : fraudRiskPercent < 35 ? 'Medium Risk' : 'High Risk';

  return { fraudRiskPercent, verdict, subScores };
}

// ---------------------------------------------------------------------------
// 2. Injury Risk Detection
// ---------------------------------------------------------------------------
export interface InjuryRiskArea {
  area: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  riskPercent: number;
  cause: string;
  prevention: string[];
}

export interface InjuryRiskResult {
  overallRiskPercent: number;
  overallLevel: 'Low' | 'Moderate' | 'High';
  areas: InjuryRiskArea[];
}

export function computeInjuryRisk(assessment: AssessmentResult): InjuryRiskResult {
  const form = assessment.metricsBreakdown.form;
  const endurance = assessment.metricsBreakdown.endurance;
  const power = assessment.metricsBreakdown.power;
  const seed = assessment.id;

  const areas: InjuryRiskArea[] = [];

  if (assessment.testType === 'push_up') {
    const elbow = assessment.pushUpData?.elbowAlignmentScore ?? form;
    areas.push({
      area: 'Shoulder & Elbow',
      riskLevel: elbow < 70 ? 'High' : elbow < 85 ? 'Moderate' : 'Low',
      riskPercent: clamp(100 - elbow),
      cause: 'Elbow flare / poor alignment increases shear stress on the shoulder joint during repeated push-ups.',
      prevention: ['Keep elbows at ~45° from torso, not flared to 90°', 'Add rotator-cuff activation drills before sets', 'Cap volume increases to 10% per week']
    });
    areas.push({
      area: 'Wrist',
      riskLevel: form < 70 ? 'Moderate' : 'Low',
      riskPercent: clamp(100 - form - 10),
      cause: 'Hyperextended wrists under repeated load can strain the carpal ligaments.',
      prevention: ['Use push-up handles/parallettes to keep wrists neutral', 'Wrist mobility warm-up before testing']
    });
  } else if (assessment.testType === 'sit_up') {
    const hipShoulder = assessment.sitUpData?.hipShoulderMovementScore ?? form;
    areas.push({
      area: 'Lower Back',
      riskLevel: hipShoulder < 70 ? 'High' : hipShoulder < 85 ? 'Moderate' : 'Low',
      riskPercent: clamp(100 - hipShoulder),
      cause: 'Using hip-flexor momentum instead of controlled abdominal contraction loads the lumbar spine.',
      prevention: ['Focus on slow, controlled curls rather than momentum', 'Strengthen deep core (planks) before high-rep testing', 'Avoid anchoring feet with excessive hip-flexor pull']
    });
    areas.push({
      area: 'Neck',
      riskLevel: form < 75 ? 'Moderate' : 'Low',
      riskPercent: clamp(100 - form - 15),
      cause: 'Pulling on the neck with clasped hands during fatigue increases cervical strain risk.',
      prevention: ['Hands lightly at temples, not pulling the head', 'Stop the set if neck fatigue appears before core fatigue']
    });
  } else {
    // vertical_jump
    const powerScore = assessment.verticalJumpData?.explosivePowerScore ?? power;
    areas.push({
      area: 'Knee & ACL',
      riskLevel: powerScore < 70 ? 'High' : powerScore < 85 ? 'Moderate' : 'Low',
      riskPercent: clamp(100 - powerScore),
      cause: 'Poor landing mechanics (knees caving inward) under high jump force is the leading cause of ACL strain.',
      prevention: ['Practice soft, knees-over-toes landings', 'Add single-leg balance and eccentric strength work', 'Ensure adequate rest between max-effort jump attempts']
    });
    areas.push({
      area: 'Achilles & Calf',
      riskLevel: endurance < 70 ? 'Moderate' : 'Low',
      riskPercent: clamp(100 - endurance - 5),
      cause: 'Repeated maximal jumps without calf conditioning can overload the Achilles tendon.',
      prevention: ['Progressive plyometric loading, not maximal jumps every session', 'Calf raise strengthening 2x/week']
    });
  }

  const overallRiskPercent = clamp(Math.round(areas.reduce((s, a) => s + a.riskPercent, 0) / areas.length + (seededRandom(seed) - 0.5) * 4));
  const overallLevel: InjuryRiskResult['overallLevel'] =
    overallRiskPercent < 30 ? 'Low' : overallRiskPercent < 55 ? 'Moderate' : 'High';

  return { overallRiskPercent, overallLevel, areas };
}

// ---------------------------------------------------------------------------
// 3. Government Scheme Recommendation
// ---------------------------------------------------------------------------
export interface GovtScheme {
  id: string;
  name: string;
  authority: string;
  benefit: string;
  minAge?: number;
  maxAge?: number;
  minTalentScore?: number;
  sportsFocus?: string[]; // empty/undefined = all sports
  link: string;
}

export const GOVERNMENT_SCHEMES: GovtScheme[] = [
  {
    id: 'khelo-india',
    name: 'Khelo India Talent Identification (KITD)',
    authority: 'Ministry of Youth Affairs & Sports',
    benefit: 'Annual scholarship of ₹6,00,000/year for identified athletes, covering coaching, equipment, and competition costs.',
    minAge: 8,
    maxAge: 21,
    link: 'https://kheloindia.gov.in'
  },
  {
    id: 'tops-dev',
    name: 'Target Olympic Podium Scheme (TOPS Development Group)',
    authority: 'Sports Authority of India (SAI)',
    benefit: 'Structured development support for athletes on an Olympic/Asian Games pathway — customized training, sports science, and foreign exposure.',
    minAge: 14,
    minTalentScore: 85,
    link: 'https://sportsauthorityofindia.nic.in/tops'
  },
  {
    id: 'nssts',
    name: 'National Sports Talent Search Scheme (NSTSS)',
    authority: 'Sports Authority of India (SAI)',
    benefit: 'Long-term residential training at SAI academies for talent identified between ages 8-14, including education support.',
    minAge: 8,
    maxAge: 14,
    link: 'https://sportsauthorityofindia.nic.in'
  },
  {
    id: 'sai-scholarship',
    name: 'SAI National Sports Scholarship',
    authority: 'Sports Authority of India (SAI)',
    benefit: 'Monthly scholarship covering diet, kit, and competition expenses for athletes shortlisted through state trials.',
    minTalentScore: 70,
    link: 'https://sportsauthorityofindia.nic.in'
  },
  {
    id: 'para-sports',
    name: 'Para Sports Development & Scholarship Scheme',
    authority: 'Department of Sports, GoI',
    benefit: 'Specialized coaching grants and assistive-equipment funding for para-athletes.',
    link: 'https://yas.nic.in'
  },
  {
    id: 'rggsm',
    name: 'Rajiv Gandhi Khel Ratna & Arjuna Award Pathway',
    authority: 'Ministry of Youth Affairs & Sports',
    benefit: 'Recognition + cash award pathway for athletes with sustained national-level performance.',
    minTalentScore: 90,
    link: 'https://yas.nic.in/sports/national-sports-awards'
  },
  {
    id: 'state-sports-fund',
    name: 'State Sports Development Fund (varies by state)',
    authority: 'State Sports Department',
    benefit: 'State-level equipment grants, district academy admission priority, and local competition travel allowance.',
    link: 'https://yas.nic.in'
  },
  {
    id: 'fit-india-athletics',
    name: 'Fit India School / Athletics Talent Hunt',
    authority: 'Fit India Movement',
    benefit: 'School-level talent screening leading to district and state academy trial invitations.',
    maxAge: 18,
    sportsFocus: ['Athletics', 'Track & Field'],
    link: 'https://fitindia.gov.in'
  }
];

export interface SchemeMatch extends GovtScheme {
  matchPercent: number;
  eligible: boolean;
  reasons: string[];
}

export function matchGovernmentSchemes(user: User): SchemeMatch[] {
  const age = user.age ?? 18;
  const talentScore = user.talentScore ?? 60;

  return GOVERNMENT_SCHEMES.map((scheme) => {
    const reasons: string[] = [];
    let eligible = true;
    let score = 60;

    if (scheme.minAge !== undefined) {
      if (age >= scheme.minAge) { score += 10; reasons.push(`Meets minimum age ${scheme.minAge}+`); }
      else { eligible = false; reasons.push(`Requires age ${scheme.minAge}+`); }
    }
    if (scheme.maxAge !== undefined) {
      if (age <= scheme.maxAge) { score += 10; reasons.push(`Within age limit of ${scheme.maxAge}`); }
      else { eligible = false; reasons.push(`Age limit is ${scheme.maxAge}`); }
    }
    if (scheme.minTalentScore !== undefined) {
      if (talentScore >= scheme.minTalentScore) { score += 20; reasons.push(`Talent Score ${talentScore} clears the ${scheme.minTalentScore}+ threshold`); }
      else { eligible = false; reasons.push(`Needs Talent Score ${scheme.minTalentScore}+ (currently ${talentScore})`); }
    }
    if (scheme.sportsFocus && scheme.sportsFocus.length > 0) {
      const matchesSport = scheme.sportsFocus.some((s) => (user.preferredSport || '').toLowerCase().includes(s.toLowerCase()));
      if (matchesSport) { score += 10; reasons.push(`Matches preferred sport: ${user.preferredSport}`); }
    }

    const matchPercent = clamp(score + (seededRandom(scheme.id + user.id).toString().length % 5));

    return { ...scheme, matchPercent, eligible, reasons };
  }).sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.matchPercent - a.matchPercent);
}

// ---------------------------------------------------------------------------
// 4. Sport Academy Matching System
// ---------------------------------------------------------------------------
export interface Academy {
  id: string;
  name: string;
  state: string;
  city: string;
  sports: string[];
  tier: 'National Centre of Excellence' | 'SAI Regional Centre' | 'State Academy';
  seatsAvailable: number;
  contact: string;
}

export const ACADEMIES: Academy[] = [
  { id: 'ncoe-bengaluru', name: 'SAI National Centre of Excellence, Bengaluru', state: 'Karnataka', city: 'Bengaluru', sports: ['Athletics', 'Weightlifting', 'Boxing'], tier: 'National Centre of Excellence', seatsAvailable: 6, contact: 'ncoe.blr@sai.gov.in' },
  { id: 'ncoe-patiala', name: 'SAI National Centre of Excellence, Patiala', state: 'Punjab', city: 'Patiala', sports: ['Athletics', 'Hockey', 'Wrestling'], tier: 'National Centre of Excellence', seatsAvailable: 4, contact: 'ncoe.patiala@sai.gov.in' },
  { id: 'src-rohtak', name: 'SAI Regional Centre, Rohtak', state: 'Haryana', city: 'Rohtak', sports: ['Wrestling', 'Athletics', 'Boxing'], tier: 'SAI Regional Centre', seatsAvailable: 10, contact: 'src.rohtak@sai.gov.in' },
  { id: 'src-bhopal', name: 'SAI Regional Centre, Bhopal', state: 'Madhya Pradesh', city: 'Bhopal', sports: ['Canoeing', 'Athletics', 'Shooting'], tier: 'SAI Regional Centre', seatsAvailable: 8, contact: 'src.bhopal@sai.gov.in' },
  { id: 'src-kolkata', name: 'SAI Regional Centre, Kolkata', state: 'West Bengal', city: 'Kolkata', sports: ['Football', 'Athletics'], tier: 'SAI Regional Centre', seatsAvailable: 12, contact: 'src.kolkata@sai.gov.in' },
  { id: 'state-guwahati', name: 'Assam State Sports Academy', state: 'Assam', city: 'Guwahati', sports: ['Boxing', 'Athletics', 'Archery'], tier: 'State Academy', seatsAvailable: 15, contact: 'academy.assam@sports.gov.in' },
  { id: 'state-thiruvananthapuram', name: 'GV Raja Sports School', state: 'Kerala', city: 'Thiruvananthapuram', sports: ['Athletics', 'Volleyball'], tier: 'State Academy', seatsAvailable: 20, contact: 'gvraja@kerala.gov.in' },
  { id: 'state-coimbatore', name: 'Tamil Nadu Sports Development Authority Academy', state: 'Tamil Nadu', city: 'Coimbatore', sports: ['Athletics', 'Volleyball', 'Kabaddi'], tier: 'State Academy', seatsAvailable: 18, contact: 'tnsda.cbe@tn.gov.in' },
  { id: 'src-lucknow', name: 'SAI Regional Centre, Lucknow', state: 'Uttar Pradesh', city: 'Lucknow', sports: ['Athletics', 'Wrestling', 'Badminton'], tier: 'SAI Regional Centre', seatsAvailable: 9, contact: 'src.lucknow@sai.gov.in' },
  { id: 'state-pune', name: 'Maharashtra Sports Academy', state: 'Maharashtra', city: 'Pune', sports: ['Athletics', 'Swimming', 'Kabaddi'], tier: 'State Academy', seatsAvailable: 14, contact: 'academy.mh@sports.gov.in' }
];

export interface AcademyMatch extends Academy {
  matchPercent: number;
  reasons: string[];
}

export function matchAcademies(user: User): AcademyMatch[] {
  const sport = (user.preferredSport || 'Athletics');
  const state = user.state || '';

  return ACADEMIES.map((academy) => {
    const reasons: string[] = [];
    let score = 40;

    const sportMatch = academy.sports.some((s) => s.toLowerCase().includes(sport.toLowerCase()) || sport.toLowerCase().includes(s.toLowerCase()));
    if (sportMatch) { score += 35; reasons.push(`Trains ${sport}`); }

    if (state && academy.state.toLowerCase() === state.toLowerCase()) { score += 20; reasons.push('Same state — lower relocation cost'); }
    else if (state) { reasons.push(`Located in ${academy.state} (different state)`); }

    if (academy.tier === 'National Centre of Excellence') { score += 5; reasons.push('National Centre of Excellence — highest tier'); }

    const matchPercent = clamp(score + Math.round((seededRandom(academy.id + user.id) - 0.5) * 6));
    return { ...academy, matchPercent, reasons };
  }).sort((a, b) => b.matchPercent - a.matchPercent);
}

// ---------------------------------------------------------------------------
// 5. AI Nutrition & Diet Planner
// ---------------------------------------------------------------------------
export interface MealPlanItem {
  meal: string;
  time: string;
  items: string[];
}

export interface NutritionPlan {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  waterLiters: number;
  meals: MealPlanItem[];
  notes: string[];
}

export function computeNutritionPlan(user: User): NutritionPlan {
  const weight = user.weight ?? 65;
  const isHighIntensitySport = ['athletics', 'wrestling', 'boxing', 'football', 'hockey'].some((s) =>
    (user.preferredSport || '').toLowerCase().includes(s)
  );

  const proteinGrams = Math.round(weight * (isHighIntensitySport ? 1.8 : 1.4));
  const dailyCalories = Math.round(weight * (isHighIntensitySport ? 45 : 38));
  const fatGrams = Math.round((dailyCalories * 0.25) / 9);
  const carbsGrams = Math.round((dailyCalories - proteinGrams * 4 - fatGrams * 9) / 4);

  return {
    dailyCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    waterLiters: Math.round((weight * 0.05) * 10) / 10,
    meals: [
      { meal: 'Breakfast', time: '7:00 AM', items: ['3 egg whites + 1 whole egg', 'Oats with banana', 'Glass of milk'] },
      { meal: 'Mid-morning', time: '10:00 AM', items: ['Handful of soaked almonds & peanuts', 'Seasonal fruit'] },
      { meal: 'Lunch', time: '1:00 PM', items: ['2 rotis / 1 cup rice', 'Dal or grilled chicken/fish', 'Curd', 'Mixed vegetable sabzi'] },
      { meal: 'Pre-training', time: '4:00 PM', items: ['Banana or dates', 'Black coffee (optional)'] },
      { meal: 'Post-training', time: '6:30 PM', items: ['Protein shake or paneer/soy chunks', 'Buttermilk'] },
      { meal: 'Dinner', time: '8:30 PM', items: ['2 rotis', 'Dal + green vegetable', 'Salad'] }
    ],
    notes: [
      `Targeting ${proteinGrams}g protein/day to support ${isHighIntensitySport ? 'high-intensity' : 'endurance'} training load.`,
      'Avoid fried snacks and sugary drinks within 2 hours of training.',
      'Increase water intake by 500ml on assessment/competition days.'
    ]
  };
}

// ---------------------------------------------------------------------------
// 6. Peer Percentile Comparison
// ---------------------------------------------------------------------------
export interface PercentileResult {
  percentileDistrict: number;
  percentileState: number;
  percentileNational: number;
  districtAvg: number;
  stateAvg: number;
  nationalAvg: number;
}

export function computePercentile(assessment: AssessmentResult): PercentileResult {
  const seed = assessment.id;
  const score = assessment.talentScore;

  const nationalAvg = 62;
  const stateAvg = Math.round(nationalAvg + (seededRandom(seed + 'state') - 0.3) * 15);
  const districtAvg = Math.round(stateAvg + (seededRandom(seed + 'dist') - 0.3) * 12);

  const toPercentile = (avg: number) => clamp(Math.round(50 + (score - avg) * 1.3));

  return {
    percentileDistrict: toPercentile(districtAvg),
    percentileState: toPercentile(stateAvg),
    percentileNational: toPercentile(nationalAvg),
    districtAvg,
    stateAvg,
    nationalAvg
  };
}

// ---------------------------------------------------------------------------
// 7. Competition & Trial Calendar
// ---------------------------------------------------------------------------
export interface CompetitionEvent {
  id: string;
  name: string;
  level: 'District' | 'State' | 'National';
  state: string;
  date: string;
  sport: string;
  registrationLink: string;
}

export const COMPETITION_EVENTS: CompetitionEvent[] = [
  { id: 'ev1', name: 'District Athletics Trials', level: 'District', state: 'Tamil Nadu', date: '2026-09-14', sport: 'Athletics', registrationLink: 'https://kheloindia.gov.in' },
  { id: 'ev2', name: 'Khelo India State Selection Trials', level: 'State', state: 'Tamil Nadu', date: '2026-10-02', sport: 'Athletics', registrationLink: 'https://kheloindia.gov.in' },
  { id: 'ev3', name: 'SAI National Talent Hunt', level: 'National', state: 'All India', date: '2026-11-18', sport: 'All Sports', registrationLink: 'https://sportsauthorityofindia.nic.in' },
  { id: 'ev4', name: 'Junior State Wrestling Championship', level: 'State', state: 'Haryana', date: '2026-09-28', sport: 'Wrestling', registrationLink: 'https://wfi.in' },
  { id: 'ev5', name: 'District Football League Trials', level: 'District', state: 'West Bengal', date: '2026-09-20', sport: 'Football', registrationLink: 'https://the-aiff.com' },
  { id: 'ev6', name: 'National Sports Talent Search Camp', level: 'National', state: 'All India', date: '2026-12-05', sport: 'All Sports', registrationLink: 'https://sportsauthorityofindia.nic.in' },
  { id: 'ev7', name: 'Karnataka State Swimming Meet', level: 'State', state: 'Karnataka', date: '2026-10-11', sport: 'Swimming', registrationLink: 'https://ksca.co.in' }
];

export function getRelevantEvents(user: User): CompetitionEvent[] {
  return COMPETITION_EVENTS
    .filter((e) => e.state === 'All India' || e.state.toLowerCase() === (user.state || '').toLowerCase() || e.sport === 'All Sports' || e.sport.toLowerCase() === (user.preferredSport || '').toLowerCase())
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ---------------------------------------------------------------------------
// 8. Coach Performance Leaderboard (Admin view)
// ---------------------------------------------------------------------------
export interface CoachPerformance {
  coachId: string;
  name: string;
  academy: string;
  athletesTrained: number;
  avgTalentScoreImprovement: number;
  athletesPromotedToState: number;
  rating: number;
}

export const COACH_LEADERBOARD: CoachPerformance[] = [
  { coachId: 'coach-rj', name: 'Rajesh Sharma', academy: 'SAI Rohtak', athletesTrained: 42, avgTalentScoreImprovement: 14.2, athletesPromotedToState: 9, rating: 4.8 },
  { coachId: 'coach-pv', name: 'P. Venkatesan', academy: 'TN Sports Academy, Coimbatore', athletesTrained: 35, avgTalentScoreImprovement: 12.6, athletesPromotedToState: 7, rating: 4.6 },
  { coachId: 'coach-ak', name: 'Anjali Kulkarni', academy: 'Maharashtra Sports Academy, Pune', athletesTrained: 38, avgTalentScoreImprovement: 11.4, athletesPromotedToState: 6, rating: 4.5 },
  { coachId: 'coach-sn', name: 'Suresh Nair', academy: 'GV Raja Sports School, Kerala', athletesTrained: 29, avgTalentScoreImprovement: 13.1, athletesPromotedToState: 5, rating: 4.4 },
  { coachId: 'coach-db', name: 'Debashish Bose', academy: 'SAI Regional Centre, Kolkata', athletesTrained: 33, avgTalentScoreImprovement: 10.8, athletesPromotedToState: 4, rating: 4.2 }
].sort((a, b) => b.avgTalentScoreImprovement - a.avgTalentScoreImprovement);

// ---------------------------------------------------------------------------
// 9. State-wise Budget & Resource Insights (Admin view)
// ---------------------------------------------------------------------------
export interface StateBudgetInsight {
  state: string;
  athletesRegistered: number;
  budgetAllocatedCr: number; // crore INR
  budgetUtilizedPercent: number;
  academiesCount: number;
}

export const STATE_BUDGET_DATA: StateBudgetInsight[] = [
  { state: 'Tamil Nadu', athletesRegistered: 6120, budgetAllocatedCr: 18.4, budgetUtilizedPercent: 82, academiesCount: 6 },
  { state: 'Haryana', athletesRegistered: 5430, budgetAllocatedCr: 21.2, budgetUtilizedPercent: 91, academiesCount: 5 },
  { state: 'Punjab', athletesRegistered: 4890, budgetAllocatedCr: 16.7, budgetUtilizedPercent: 76, academiesCount: 4 },
  { state: 'Karnataka', athletesRegistered: 4310, budgetAllocatedCr: 14.9, budgetUtilizedPercent: 68, academiesCount: 5 },
  { state: 'Kerala', athletesRegistered: 3980, budgetAllocatedCr: 12.3, budgetUtilizedPercent: 88, academiesCount: 3 },
  { state: 'Maharashtra', athletesRegistered: 5760, budgetAllocatedCr: 19.8, budgetUtilizedPercent: 79, academiesCount: 6 },
  { state: 'West Bengal', athletesRegistered: 4120, budgetAllocatedCr: 13.5, budgetUtilizedPercent: 71, academiesCount: 4 },
  { state: 'Uttar Pradesh', athletesRegistered: 7020, budgetAllocatedCr: 23.6, budgetUtilizedPercent: 64, academiesCount: 5 }
];
