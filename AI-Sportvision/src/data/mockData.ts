import { AssessmentResult, FitnessTestConfig, LeaderboardEntry, SportRecommendation, AchievementBadge, TrainingRoadmapWeek } from '../types';

export const FITNESS_TESTS: FitnessTestConfig[] = [
  {
    id: 'sit_up',
    title: 'Sit-Up Assessment AI',
    subtitle: 'Core Strength & Muscular Endurance Evaluation',
    purpose: 'Core strength evaluation through automated repetition tracking and hip-shoulder alignment validation.',
    difficulty: 'Beginner',
    duration: '60 Seconds',
    instructions: [
      'Lie flat on your back with knees bent at a 90-degree angle.',
      'Cross arms over chest with hands resting on shoulders.',
      'Ensure full body is visible in the side profile camera angle.',
      'Perform continuous valid repetitions until the 60s timer ends.'
    ],
    iconName: 'Activity',
    targetMetrics: ['Total Repetitions', 'Valid Form Count', 'Core Stability Index'],
    standardScore: 82
  },
  {
    id: 'push_up',
    title: 'Push-Up Assessment AI',
    subtitle: 'Upper Body Strength & Postural Alignment',
    purpose: 'Upper body strength evaluation analyzing shoulder, elbow, and wrist kinematics and trunk rigidity.',
    difficulty: 'Intermediate',
    duration: '60 Seconds',
    instructions: [
      'Position camera at a 45-degree angle showing head to heels.',
      'Maintain a rigid straight plank line from shoulders to ankles.',
      'Lower chest until elbow flexion reaches at least 90 degrees.',
      'Extend elbows fully at the top of each repetition.'
    ],
    iconName: 'Dumbbell',
    targetMetrics: ['Elbow Angle Flexion', 'Trunk Line Accuracy', 'Repetition Quality'],
    standardScore: 85
  },
  {
    id: 'vertical_jump',
    title: 'Vertical Jump Assessment AI',
    subtitle: 'Explosive Lower Body Power & Vertical Velocity',
    purpose: 'Explosive power evaluation measuring countermovement height and takeoff power index.',
    difficulty: 'Advanced',
    duration: '3 Repetitions',
    instructions: [
      'Stand facing sideways to camera with feet shoulder-width apart.',
      'Perform a countermovement dip and jump vertically as high as possible.',
      'Land softly on both feet within the frame.',
      'Perform 3 attempts; AI automatically records maximum apex height.'
    ],
    iconName: 'Zap',
    targetMetrics: ['Max Vertical Apex (cm)', 'Takeoff Power (Watts)', 'Explosive Force'],
    standardScore: 88
  }
];

export const MOCK_ASSESSMENTS: AssessmentResult[] = [
  {
    id: 'SAI-ASSESS-8921',
    athleteId: 'sai-ath-101',
    athleteName: 'Arjun Rathore',
    athleteDistrict: 'Bhiwani',
    athleteState: 'Haryana',
    testType: 'push_up',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoName: 'arjun_pushup_test_haryana.mp4',
    uploadDate: '2026-07-12',
    status: 'verified',
    talentScore: 94,
    authenticityScore: 98,
    movementQualityScore: 95,
    pushUpData: {
      totalPushups: 46,
      correctPushups: 44,
      formAccuracy: 95.6,
      elbowAlignmentScore: 96
    },
    metricsBreakdown: {
      strength: 95,
      power: 88,
      agility: 84,
      endurance: 92,
      form: 96
    },
    feedback: [
      'Excellent trunk stability throughout all 46 repetitions.',
      'Elbow flexion angle consistently exceeded 92° depth requirement.',
      'Minor pacing drop in the final 10 seconds; recommend lactic acid threshold training.'
    ],
    verifiedBy: 'Coach Rajesh Sharma (SAI Rohtak Centre)',
    verifiedAt: '2026-07-12 14:30'
  },
  {
    id: 'SAI-ASSESS-8919',
    athleteId: 'sai-ath-101',
    athleteName: 'Arjun Rathore',
    athleteDistrict: 'Bhiwani',
    athleteState: 'Haryana',
    testType: 'vertical_jump',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoName: 'arjun_vjump_test.mp4',
    uploadDate: '2026-07-10',
    status: 'verified',
    talentScore: 91,
    authenticityScore: 99,
    movementQualityScore: 90,
    verticalJumpData: {
      jumpHeightCm: 71.4,
      powerLevelWatts: 4320,
      explosivePowerScore: 91
    },
    metricsBreakdown: {
      strength: 90,
      power: 94,
      agility: 88,
      endurance: 85,
      form: 91
    },
    feedback: [
      'Peak vertical displacement reached 71.4 cm (Top 3% national standard for age 19).',
      'Explosive takeoff acceleration calculated at 4,320 Watts.',
      'Arm swing timing is optimal.'
    ],
    verifiedBy: 'Dr. Meenakshi Sundaram (SAI Bangalore)',
    verifiedAt: '2026-07-10 16:15'
  },
  {
    id: 'SAI-ASSESS-8905',
    athleteId: 'sai-ath-102',
    athleteName: 'Priya Devi',
    athleteDistrict: 'Imphal East',
    athleteState: 'Manipur',
    testType: 'sit_up',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoName: 'priya_situp_manipur.mp4',
    uploadDate: '2026-07-13',
    status: 'pending_verification',
    talentScore: 89,
    authenticityScore: 97,
    movementQualityScore: 88,
    sitUpData: {
      totalReps: 52,
      validReps: 49,
      invalidReps: 3,
      hipShoulderMovementScore: 91
    },
    metricsBreakdown: {
      strength: 86,
      power: 82,
      agility: 91,
      endurance: 94,
      form: 89
    },
    feedback: [
      'Outstanding endurance: 49 validated repetitions in 60 seconds.',
      '3 repetitions flagged for incomplete shoulder blade contact with ground on descent.'
    ]
  },
  {
    id: 'SAI-ASSESS-8874',
    athleteId: 'sai-ath-103',
    athleteName: 'Vikram Singh',
    athleteDistrict: 'Almora',
    athleteState: 'Uttarakhand',
    testType: 'vertical_jump',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4',
    videoName: 'vikram_almora_vjump.mp4',
    uploadDate: '2026-07-11',
    status: 'verified',
    talentScore: 96,
    authenticityScore: 99,
    movementQualityScore: 97,
    verticalJumpData: {
      jumpHeightCm: 76.8,
      powerLevelWatts: 4780,
      explosivePowerScore: 97
    },
    metricsBreakdown: {
      strength: 93,
      power: 98,
      agility: 94,
      endurance: 89,
      form: 96
    },
    feedback: [
      'Exceptional explosive leap of 76.8 cm identified from high-altitude rural talent pool.',
      'Prime candidate for National Centre of Excellence (NCOE) High Jump / Volleyball development.'
    ],
    verifiedBy: 'Coach Rajesh Sharma (SAI Rohtak Centre)',
    verifiedAt: '2026-07-11 11:45'
  }
];

export const MOCK_RECOMMENDATIONS: SportRecommendation[] = [
  {
    sport: 'Athletics (400m & Long Jump)',
    confidence: 96,
    reason: 'High explosive power index (94/100) combined with exceptional upper-trunk stability makes you a natural candidate for sprint acceleration and horizontal jumping.',
    strengthMatch: [
      'Explosive Takeoff Power (Top 3% national standard)',
      'High Trunk Rigidity & Core Endurance',
      'Optimal Height-to-Weight Power Ratio'
    ],
    improvementAreas: [
      'Ankle stiffness during deceleration phase',
      'Aerobic recovery between high-intensity intervals'
    ],
    icon: 'Flame'
  },
  {
    sport: 'Football (Forward / Winger)',
    confidence: 91,
    reason: 'Demonstrated burst velocity and lower-limb explosive power align strongly with elite football wingers and attacking forwards.',
    strengthMatch: [
      'Rapid directional acceleration',
      'Upper body shield strength under pressure'
    ],
    improvementAreas: [
      'Lateral change of direction agility drills',
      'First-touch reaction speed'
    ],
    icon: 'Trophy'
  },
  {
    sport: 'Kabaddi (Raider)',
    confidence: 88,
    reason: 'Exceptional core strength (52 valid sit-ups) and lower-body explosive power make you formidable during sudden raid breaks and escape maneuvers.',
    strengthMatch: [
      'Core endurance & breath hold efficiency',
      'Explosive jump escape power'
    ],
    improvementAreas: [
      'Ankle hold breakout leverage',
      'Lower stance squat endurance'
    ],
    icon: 'Target'
  },
  {
    sport: 'Volleyball (Outside Hitter)',
    confidence: 84,
    reason: '71.4 cm+ vertical jump height provides elite spike clearance above standard net height.',
    strengthMatch: [
      'Vertical apex jump height',
      'Shoulder extension power'
    ],
    improvementAreas: [
      'Block timing & multi-jump recovery',
      'Rotator cuff plyometric conditioning'
    ],
    icon: 'Zap'
  }
];

export const MOCK_ROADMAP: TrainingRoadmapWeek[] = [
  {
    weekNumber: 1,
    focusArea: 'Endurance & Core Conditioning Foundation',
    title: 'Aerobic Base & Trunk Stability',
    description: 'Establish a high cardiovascular aerobic base while strengthening deep transverse abdominis and lower spinal stabilization muscles.',
    exercises: [
      { name: 'Interval Tempo Run (400m repeats)', sets: '6 rounds', reps: '400m @ 75%', notes: '90s rest between intervals' },
      { name: 'Hollow Body Hold & V-Sit Progressions', sets: '4 sets', reps: '45 seconds', notes: 'Keep lower back pressed to floor' },
      { name: 'Tempo Push-Ups (3s eccentric descent)', sets: '4 sets', reps: '15 reps', notes: 'Focus on shoulder blade stability' }
    ]
  },
  {
    weekNumber: 2,
    focusArea: 'Explosive Power & Plyometrics',
    title: 'Neuromuscular Rate of Force Development',
    description: 'Transition core stability into rapid force production through plyometric jump training and medicine ball throws.',
    exercises: [
      { name: 'Depth Box Jumps (60cm drop to vertical leap)', sets: '5 sets', reps: '5 reps', notes: 'Minimize ground contact time (<200ms)' },
      { name: 'Explosive Clapping Push-Ups', sets: '4 sets', reps: '10 reps', notes: 'Drive through palms with maximum speed' },
      { name: 'Russian Twist with Medicine Ball', sets: '4 sets', reps: '30 reps', notes: 'Rotational core power development' }
    ]
  },
  {
    weekNumber: 3,
    focusArea: 'Agility & Sport-Specific Acceleration',
    title: 'Multi-Directional Velocity & Peak Assessment Prep',
    description: 'Fine-tune lateral agility, deceleration mechanics, and simulate official SAI AI evaluation tests.',
    exercises: [
      { name: 'Pro Agility 5-10-5 Shuttle Drill', sets: '6 sets', reps: 'Full sprint', notes: 'Touch line cleanly on turns' },
      { name: 'Max Effort AI Assessment Mock Test', sets: '1 round', reps: '60s timed', notes: 'Record video with side camera angle' },
      { name: 'Active Recovery & Hip Mobility Sequence', sets: '2 rounds', reps: '15 mins', notes: 'Foam roll calves, hamstrings, quads' }
    ]
  }
];

export const MOCK_BADGES: AchievementBadge[] = [
  {
    id: 'badge-1',
    title: 'Bronze Athlete',
    description: 'Completed first AI-verified fitness test with an authenticity score > 90%.',
    tier: 'Bronze',
    unlocked: true,
    unlockedAt: '2026-06-20',
    iconName: 'Award'
  },
  {
    id: 'badge-2',
    title: 'Silver Athlete',
    description: 'Achieved a talent score above 85 in two distinct fitness categories.',
    tier: 'Silver',
    unlocked: true,
    unlockedAt: '2026-07-02',
    iconName: 'Shield'
  },
  {
    id: 'badge-3',
    title: 'Gold Athlete',
    description: 'Ranked in the top 5% of athletes in your district.',
    tier: 'Gold',
    unlocked: true,
    unlockedAt: '2026-07-10',
    iconName: 'Trophy'
  },
  {
    id: 'badge-4',
    title: 'Elite Athlete',
    description: 'Invited for SAI National Talent Search / NCOE assessment.',
    tier: 'Elite',
    unlocked: true,
    unlockedAt: '2026-07-12',
    iconName: 'Crown'
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    athleteId: 'sai-ath-103',
    name: 'Vikram Singh',
    district: 'Almora',
    state: 'Uttarakhand',
    sport: 'Volleyball',
    talentScore: 96.4,
    tier: 'Elite'
  },
  {
    rank: 2,
    athleteId: 'sai-ath-101',
    name: 'Arjun Rathore',
    district: 'Bhiwani',
    state: 'Haryana',
    sport: 'Athletics',
    talentScore: 94.8,
    tier: 'Elite'
  },
  {
    rank: 3,
    athleteId: 'sai-ath-108',
    name: 'Tejaswin Kadam',
    district: 'Satara',
    state: 'Maharashtra',
    sport: 'Wrestling',
    talentScore: 93.5,
    tier: 'Elite'
  },
  {
    rank: 4,
    athleteId: 'sai-ath-105',
    name: 'Lakshmi Nair',
    district: 'Palakkad',
    state: 'Kerala',
    sport: 'Athletics (400m)',
    talentScore: 92.1,
    tier: 'Gold'
  },
  {
    rank: 5,
    athleteId: 'sai-ath-102',
    name: 'Priya Devi',
    district: 'Imphal East',
    state: 'Manipur',
    sport: 'Boxing',
    talentScore: 89.6,
    tier: 'Gold'
  },
  {
    rank: 6,
    athleteId: 'sai-ath-112',
    name: 'Deepak Choudhary',
    district: 'Sikar',
    state: 'Rajasthan',
    sport: 'Archery',
    talentScore: 88.3,
    tier: 'Silver'
  }
];

export const STATE_HEATMAP_DATA = [
  { state: 'Haryana', athletesCount: 8420, averageScore: 88.5, topSport: 'Wrestling & Athletics' },
  { state: 'Manipur', athletesCount: 6150, averageScore: 87.9, topSport: 'Boxing & Football' },
  { state: 'Maharashtra', athletesCount: 7890, averageScore: 86.2, topSport: 'Kabaddi & Athletics' },
  { state: 'Kerala', athletesCount: 5430, averageScore: 86.8, topSport: 'Athletics (Sprints)' },
  { state: 'Punjab', athletesCount: 6800, averageScore: 87.1, topSport: 'Hockey & Athletics' },
  { state: 'Uttarakhand', athletesCount: 3120, averageScore: 88.0, topSport: 'Volleyball & Distance Running' },
  { state: 'Odisha', athletesCount: 4950, averageScore: 85.4, topSport: 'Hockey & Rugby' },
  { state: 'Tamil Nadu', athletesCount: 5820, averageScore: 84.9, topSport: 'Fencing & Athletics' },
  { state: 'Rajasthan', athletesCount: 4600, averageScore: 83.7, topSport: 'Archery & Shooting' },
  { state: 'Assam', athletesCount: 3890, averageScore: 84.2, topSport: 'Boxing & Weightlifting' }
];
