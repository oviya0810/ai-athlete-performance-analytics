export type UserRole = 'athlete' | 'coach' | 'admin';

export type FitnessTestType = 'sit_up' | 'push_up' | 'vertical_jump';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // Athlete specific
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  height?: number; // cm
  weight?: number; // kg
  district?: string;
  state?: string;
  preferredSport?: string;
  talentScore?: number;
  saiId?: string;
  // Coach specific
  academyName?: string;
  specialization?: string;
  licenseId?: string;
  // Admin specific
  officialId?: string;
}

export interface FitnessTestConfig {
  id: FitnessTestType;
  title: string;
  subtitle: string;
  purpose: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructions: string[];
  iconName: string;
  targetMetrics: string[];
  standardScore: number;
}

export interface AssessmentResult {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteDistrict: string;
  athleteState: string;
  testType: FitnessTestType;
  videoUrl: string;
  videoName: string;
  uploadDate: string;
  status: 'pending_verification' | 'verified' | 'rejected' | 'retest_requested';
  talentScore: number;
  // AI Metrics
  authenticityScore: number;
  movementQualityScore: number;
  // Specific model outputs
  sitUpData?: {
    totalReps: number;
    validReps: number;
    invalidReps: number;
    hipShoulderMovementScore: number;
  };
  pushUpData?: {
    totalPushups: number;
    correctPushups: number;
    formAccuracy: number; // percentage
    elbowAlignmentScore: number;
  };
  verticalJumpData?: {
    jumpHeightCm: number;
    powerLevelWatts: number;
    explosivePowerScore: number;
  };
  // Breakdown
  metricsBreakdown: {
    strength: number;
    power: number;
    agility: number;
    endurance: number;
    form: number;
  };
  feedback: string[];
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface SportRecommendation {
  sport: string;
  confidence: number; // percentage
  reason: string;
  strengthMatch: string[];
  improvementAreas: string[];
  icon: string;
}

export interface TrainingRoadmapWeek {
  weekNumber: number;
  focusArea: string;
  title: string;
  description: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    notes: string;
  }[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Elite';
  unlocked: boolean;
  unlockedAt?: string;
  iconName: string;
}

export interface LeaderboardEntry {
  rank: number;
  athleteId: string;
  name: string;
  district: string;
  state: string;
  sport: string;
  talentScore: number;
  avatar?: string;
  tier: 'Elite' | 'Gold' | 'Silver' | 'Bronze';
}
