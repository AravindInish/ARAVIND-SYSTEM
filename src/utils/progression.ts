import {
  CharacterAttribute,
  DailyQuest,
  MainQuest,
  SkillItem,
  Achievement,
  InventoryItem,
  PersonalReward,
  RankGrade,
  SystemProfile,
} from '../types';

/**
 * Progression Mathematics
 * Level 1 -> 100 XP
 * Level 2 -> 250 XP
 * Level 3 -> 500 XP
 * Level 4 -> 850 XP
 * Level 17 -> 10,000 XP
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 100;
  if (level === 2) return 250;
  if (level === 3) return 500;
  if (level === 4) return 850;
  // Quadratic scaling for higher levels
  return Math.round(50 * Math.pow(level, 1.85) + 100 * level);
}

export function getRankFromLevel(level: number): {
  rank: RankGrade;
  title: string;
  evaluation: string;
  color: string;
  bgGlow: string;
  borderGlow: string;
} {
  if (level >= 80) {
    return {
      rank: 'SSS',
      title: 'Transcendent Sovereign',
      evaluation: 'System Evaluation: Transcendent Supreme',
      color: 'text-amber-400',
      bgGlow: 'from-amber-500/20 to-yellow-600/10',
      borderGlow: 'border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    };
  }
  if (level >= 60) {
    return {
      rank: 'SS',
      title: 'Apex Vanguard',
      evaluation: 'System Evaluation: Legendary Apex',
      color: 'text-purple-400',
      bgGlow: 'from-purple-500/20 to-indigo-600/10',
      borderGlow: 'border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.35)]',
    };
  }
  if (level >= 40) {
    return {
      rank: 'S',
      title: 'S-Rank Monolith',
      evaluation: 'System Evaluation: Exceptional',
      color: 'text-cyan-400',
      bgGlow: 'from-cyan-500/20 to-blue-600/10',
      borderGlow: 'border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    };
  }
  if (level >= 25) {
    return {
      rank: 'A',
      title: 'Master Strategist',
      evaluation: 'System Evaluation: Elite Sovereign',
      color: 'text-emerald-400',
      bgGlow: 'from-emerald-500/20 to-teal-600/10',
      borderGlow: 'border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    };
  }
  if (level >= 16) {
    return {
      rank: 'B',
      title: 'Elite Specialist',
      evaluation: 'System Evaluation: High-Tier Performer',
      color: 'text-blue-400',
      bgGlow: 'from-blue-500/20 to-indigo-600/10',
      borderGlow: 'border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.25)]',
    };
  }
  if (level >= 10) {
    return {
      rank: 'C',
      title: 'Adept Operator',
      evaluation: 'System Evaluation: Competent Operator',
      color: 'text-teal-400',
      bgGlow: 'from-teal-500/15 to-emerald-600/10',
      borderGlow: 'border-teal-400/40 shadow-[0_0_12px_rgba(20,184,166,0.2)]',
    };
  }
  if (level >= 5) {
    return {
      rank: 'D',
      title: 'Apprentice Hunter',
      evaluation: 'System Evaluation: Awakening Initiate',
      color: 'text-slate-300',
      bgGlow: 'from-slate-500/15 to-zinc-600/10',
      borderGlow: 'border-slate-400/30',
    };
  }
  return {
    rank: 'E',
    title: 'Novice Initiate',
    evaluation: 'System Evaluation: Unawakened Potential',
    color: 'text-zinc-400',
    bgGlow: 'from-zinc-500/10 to-slate-700/10',
    borderGlow: 'border-zinc-500/30',
  };
}

export const INITIAL_ATTRIBUTES: CharacterAttribute[] = [
  {
    id: 'attr-strength',
    name: 'Strength',
    score: 15,
    level: 1,
    maxScore: 100,
    category: 'PHYSICAL',
    icon: 'Dumbbell',
    description: 'Physical endurance, athletic output, and structural vitality.',
    history: [],
  },
  {
    id: 'attr-intelligence',
    name: 'Intelligence',
    score: 20,
    level: 1,
    maxScore: 100,
    category: 'MENTAL',
    icon: 'Brain',
    description: 'Analytical reasoning, algorithmic comprehension, and mental agility.',
    history: [],
  },
  {
    id: 'attr-discipline',
    name: 'Discipline',
    score: 15,
    level: 1,
    maxScore: 100,
    category: 'TACTICAL',
    icon: 'Shield',
    description: 'Execution consistency, impulse resistance, and routine adherence.',
    history: [],
  },
  {
    id: 'attr-focus',
    name: 'Focus',
    score: 15,
    level: 1,
    maxScore: 100,
    category: 'TACTICAL',
    icon: 'Crosshair',
    description: 'Deep work endurance, single-task immersion, and attentional control.',
    history: [],
  },
  {
    id: 'attr-creativity',
    name: 'Creativity',
    score: 15,
    level: 1,
    maxScore: 100,
    category: 'CREATIVE',
    icon: 'Sparkles',
    description: 'Original synthesis, novel solution generation, and aesthetic craft.',
    history: [],
  },
  {
    id: 'attr-communication',
    name: 'Communication',
    score: 15,
    level: 1,
    maxScore: 100,
    category: 'SOCIAL',
    icon: 'MessageSquare',
    description: 'Clarity of articulation, empathetic listening, and technical writing.',
    history: [],
  },
  {
    id: 'attr-leadership',
    name: 'Leadership',
    score: 10,
    level: 1,
    maxScore: 100,
    category: 'SOCIAL',
    icon: 'Crown',
    description: 'Vision alignment, decision decisiveness, and inspiring momentum.',
    history: [],
  },
  {
    id: 'attr-knowledge',
    name: 'Knowledge',
    score: 20,
    level: 1,
    maxScore: 100,
    category: 'MENTAL',
    icon: 'BookOpen',
    description: 'Breadth and depth of mental models, literature, and domain facts.',
    history: [],
  },
  {
    id: 'attr-consistency',
    name: 'Consistency',
    score: 15,
    level: 1,
    maxScore: 100,
    category: 'TACTICAL',
    icon: 'Flame',
    description: 'Day-over-day quest completion fidelity and unbroken habits.',
    history: [],
  },
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'dq-1',
    title: 'Study DSA & Algorithmic Complexities',
    description: 'Solve 2 medium problems on Trees, Graphs, or Dynamic Programming with clean code and optimal time/space complexity.',
    xpReward: 30,
    attributeRewards: [
      { attributeId: 'attr-intelligence', attributeName: 'Intelligence', delta: 2 },
      { attributeId: 'attr-focus', attributeName: 'Focus', delta: 1 },
    ],
    completed: false,
    category: 'Technical',
    difficulty: 'C',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dq-2',
    title: 'Read 20 Pages of High-Level Literature',
    description: 'Engage in active reading, take digital notes, and summarize core insights into your personal knowledge repository.',
    xpReward: 20,
    attributeRewards: [
      { attributeId: 'attr-knowledge', attributeName: 'Knowledge', delta: 2 },
      { attributeId: 'attr-discipline', attributeName: 'Discipline', delta: 1 },
    ],
    completed: false,
    category: 'Learning',
    difficulty: 'D',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dq-3',
    title: 'Physical Conditioning Protocol (Workout)',
    description: 'Complete 40 minutes of progressive compound lifting, athletic conditioning, or high-cadence mobility exercises.',
    xpReward: 25,
    attributeRewards: [
      { attributeId: 'attr-strength', attributeName: 'Strength', delta: 2 },
      { attributeId: 'attr-discipline', attributeName: 'Discipline', delta: 1 },
    ],
    completed: false,
    category: 'Physical',
    difficulty: 'D',
    dueTime: '20:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dq-4',
    title: 'Work on Core Software Engineering Project',
    description: 'Ship a high-impact feature module, write unit tests, and review performance benchmarks on your application.',
    xpReward: 40,
    attributeRewards: [
      { attributeId: 'attr-intelligence', attributeName: 'Intelligence', delta: 2 },
      { attributeId: 'attr-creativity', attributeName: 'Creativity', delta: 2 },
      { attributeId: 'attr-focus', attributeName: 'Focus', delta: 2 },
    ],
    completed: false,
    category: 'Engineering',
    difficulty: 'B',
    dueTime: '22:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dq-5',
    title: 'Practice Clean Code Refactoring & Architecture',
    description: 'Refactor messy components, enforce strict TypeScript typing, and optimize runtime complexity.',
    xpReward: 25,
    attributeRewards: [
      { attributeId: 'attr-intelligence', attributeName: 'Intelligence', delta: 1 },
      { attributeId: 'attr-focus', attributeName: 'Focus', delta: 1 },
    ],
    completed: false,
    category: 'Engineering',
    difficulty: 'C',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_MAIN_QUESTS: MainQuest[] = [
  {
    id: 'mq-1',
    title: 'BECOME A COMPLETE INTELLECTUAL',
    description: 'Attain polymathic mastery across literature, mathematics, history, and profound technical sciences.',
    category: 'Intellect & Philosophy',
    progressPercent: 0,
    status: 'ACTIVE',
    xpReward: 2500,
    attributeRewards: [
      { attributeId: 'attr-intelligence', attributeName: 'Intelligence', delta: 10 },
      { attributeId: 'attr-knowledge', attributeName: 'Knowledge', delta: 12 },
      { attributeId: 'attr-discipline', attributeName: 'Discipline', delta: 8 },
    ],
    objectives: [
      { id: 'obj-1', text: 'Complete 10 foundational literature & non-fiction books', completed: false, xpBonus: 200 },
      { id: 'obj-2', text: 'Master Discrete Mathematics & Probability Foundations', completed: false, xpBonus: 300 },
      { id: 'obj-3', text: 'Internalize Core Computer Science & OS Concepts', completed: false, xpBonus: 400 },
      { id: 'obj-4', text: 'Study World History & Great Strategic Civilizations', completed: false, xpBonus: 250 },
      { id: 'obj-5', text: 'Master Persuasive Technical Writing & Public Rhetoric', completed: false, xpBonus: 300 },
      { id: 'obj-6', text: 'Build & Publish 3 Meaningful Open-Source Projects', completed: false, xpBonus: 500 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mq-2',
    title: 'BECOME A WORLD-CLASS SOFTWARE ENGINEER',
    description: 'Reach the pinnacle of systems architecture, full-stack scalability, AI integration, and distributed engineering.',
    category: 'Engineering Mastery',
    progressPercent: 0,
    status: 'ACTIVE',
    xpReward: 3500,
    attributeRewards: [
      { attributeId: 'attr-intelligence', attributeName: 'Intelligence', delta: 15 },
      { attributeId: 'attr-focus', attributeName: 'Focus', delta: 12 },
      { attributeId: 'attr-creativity', attributeName: 'Creativity', delta: 10 },
    ],
    objectives: [
      { id: 'obj-2-1', text: 'Solve 200+ LeetCode / DSA Problems across Trees, Graphs, DP', completed: false, xpBonus: 500 },
      { id: 'obj-2-2', text: 'Design and Deploy High-Throughput Microservice Architecture', completed: false, xpBonus: 600 },
      { id: 'obj-2-3', text: 'Integrate State-of-the-Art Generative AI & Vector Search into Production', completed: false, xpBonus: 700 },
      { id: 'obj-2-4', text: 'Publish a High-Performance TypeScript/Go Package to Global Registry', completed: false, xpBonus: 500 },
      { id: 'obj-2-5', text: 'Lead and Mentor an Engineering Pod on Cloud-Native Systems', completed: false, xpBonus: 600 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mq-3',
    title: 'PEAK PHYSICAL ATHLETICISM & STAMINA',
    description: 'Transform physiology into a resilient powerhouse with low body fat, elite VO2 max, and 100kg+ compound lift thresholds.',
    category: 'Physical Calibration',
    progressPercent: 0,
    status: 'ACTIVE',
    xpReward: 1800,
    attributeRewards: [
      { attributeId: 'attr-strength', attributeName: 'Strength', delta: 12 },
      { attributeId: 'attr-discipline', attributeName: 'Discipline', delta: 10 },
      { attributeId: 'attr-consistency', attributeName: 'Consistency', delta: 8 },
    ],
    objectives: [
      { id: 'obj-3-1', text: 'Maintain 60 days of clean nutrition macro tracking', completed: false, xpBonus: 300 },
      { id: 'obj-3-2', text: 'Run 10km under 50 minutes endurance threshold', completed: false, xpBonus: 400 },
      { id: 'obj-3-3', text: 'Hit 25 consecutive strict pull-ups without dropping', completed: false, xpBonus: 350 },
      { id: 'obj-3-4', text: 'Reach 12% body composition with optimal hormone profile', completed: false, xpBonus: 450 },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'sk-1',
    name: 'Programming & Software Eng',
    level: 1,
    xp: 0,
    xpToNext: 100,
    category: 'Engineering',
    icon: 'Code',
    description: 'Proficiency in TypeScript, Python, backend microservices, and reactive frontends.',
    masteryRank: 'Novice',
    relatedQuestsCount: 0,
    history: [],
  },
  {
    id: 'sk-2',
    name: 'DSA (Data Structures & Algorithms)',
    level: 1,
    xp: 0,
    xpToNext: 100,
    category: 'Engineering',
    icon: 'Cpu',
    description: 'Trees, Graphs, DP, Tries, Matrix traversal, and algorithmic efficiency.',
    masteryRank: 'Novice',
    relatedQuestsCount: 0,
    history: [],
  },
  {
    id: 'sk-3',
    name: 'Artificial Intelligence & ML',
    level: 1,
    xp: 0,
    xpToNext: 100,
    category: 'Engineering',
    icon: 'Bot',
    description: 'LLM agents, vector embeddings, Gemini 3 API, prompt architecture, and neural frameworks.',
    masteryRank: 'Novice',
    relatedQuestsCount: 0,
    history: [],
  },
  {
    id: 'sk-4',
    name: 'Mathematics & Logic',
    level: 1,
    xp: 0,
    xpToNext: 100,
    category: 'Intellect',
    icon: 'Calculator',
    description: 'Linear algebra, probability matrices, combinatorics, and discrete structures.',
    masteryRank: 'Novice',
    relatedQuestsCount: 0,
    history: [],
  },
  {
    id: 'sk-5',
    name: 'Problem Solving & Analysis',
    level: 1,
    xp: 0,
    xpToNext: 100,
    category: 'Intellect',
    icon: 'Search',
    description: 'Root cause decomposition, first-principles deduction, and edge-case modeling.',
    masteryRank: 'Novice',
    relatedQuestsCount: 0,
    history: [],
  },
  {
    id: 'sk-6',
    name: 'Communication & Technical Writing',
    level: 1,
    xp: 0,
    xpToNext: 100,
    category: 'Social',
    icon: 'MessageSquare',
    description: 'High-leverage documentation, engineering RFCs, and crisp articulation.',
    masteryRank: 'Novice',
    relatedQuestsCount: 0,
    history: [],
  },
  {
    id: 'sk-7',
    name: 'Leadership & Project Command',
    level: 1,
    xp: 0,
    xpToNext: 100,
    category: 'Social',
    icon: 'Crown',
    description: 'Sprint orchestration, high-velocity decision making, and team mentorship.',
    masteryRank: 'Novice',
    relatedQuestsCount: 0,
    history: [],
  },
  {
    id: 'sk-8',
    name: 'Public Speaking & Presentation',
    level: 1,
    xp: 0,
    xpToNext: 100,
    category: 'Social',
    icon: 'Mic',
    description: 'Keynote delivery, confidence projection, storytelling, and audience engagement.',
    masteryRank: 'Novice',
    relatedQuestsCount: 0,
    history: [],
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'FIRST QUEST',
    description: 'Complete your first official real-life quest recorded by the System.',
    category: 'PROGRESSION',
    icon: 'Flag',
    unlocked: false,
    rewardXp: 100,
    badgeGrade: 'E',
    progress: { current: 0, target: 1, unit: 'Quests' },
  },
  {
    id: 'ach-2',
    title: '7 DAY WARRIOR',
    description: 'Maintain an unbroken 7-day daily quest completion streak.',
    category: 'STREAK',
    icon: 'Flame',
    unlocked: false,
    rewardXp: 300,
    badgeGrade: 'D',
    progress: { current: 1, target: 7, unit: 'Days' },
  },
  {
    id: 'ach-3',
    title: 'KNOWLEDGE SEEKER',
    description: 'Complete 10 high-level learning and intellectual quests.',
    category: 'INTELLECT',
    icon: 'BookOpen',
    unlocked: false,
    rewardXp: 500,
    badgeGrade: 'C',
    progress: { current: 0, target: 10, unit: 'Quests' },
  },
  {
    id: 'ach-4',
    title: 'BUILDER',
    description: 'Complete and ship 5 substantial software engineering projects.',
    category: 'CREATION',
    icon: 'Hammer',
    unlocked: false,
    rewardXp: 800,
    badgeGrade: 'B',
    progress: { current: 0, target: 5, unit: 'Projects' },
  },
  {
    id: 'ach-5',
    title: 'DISCIPLINED SOVEREIGN',
    description: 'Complete all assigned daily quests for 30 consecutive days without failure.',
    category: 'DISCIPLINE',
    icon: 'ShieldCheck',
    unlocked: false,
    rewardXp: 1500,
    badgeGrade: 'A',
    progress: { current: 1, target: 30, unit: 'Days' },
  },
  {
    id: 'ach-6',
    title: 'S-RANK ASCENSION',
    description: 'Reach Level 40 and attain the coveted S-Rank hunter/operator tier.',
    category: 'PROGRESSION',
    icon: 'Sparkles',
    unlocked: false,
    rewardXp: 3000,
    badgeGrade: 'S',
    progress: { current: 1, target: 40, unit: 'Levels' },
  },
  {
    id: 'ach-7',
    title: 'CENTURION CODER',
    description: 'Log over 100 hours of deep programming and software development quests.',
    category: 'MASTERY',
    icon: 'Terminal',
    unlocked: false,
    rewardXp: 750,
    badgeGrade: 'B',
    progress: { current: 0, target: 100, unit: 'Hours' },
  },
  {
    id: 'ach-8',
    title: 'POLYGLOT SCHOLAR',
    description: 'Level up 5 different attributes to Level 15 or higher.',
    category: 'INTELLECT',
    icon: 'BrainCircuit',
    unlocked: false,
    rewardXp: 1000,
    badgeGrade: 'A',
    progress: { current: 0, target: 5, unit: 'Attributes' },
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-starter-1',
    title: 'ARAVIND Neural Interface // System Access Key',
    type: 'ARTIFACT',
    rarity: 'COMMON',
    description: 'Personal cryptographic node calibrated for ARAVIND. Links real-life biometric progression directly to the System.',
    dateAcquired: new Date().toISOString().split('T')[0],
    tags: ['System Artifact', 'Core Node', 'Starter'],
  },
];

export const INITIAL_REWARDS: PersonalReward[] = [
  {
    id: 'rew-1',
    title: 'Watch a Premium Cinema / Movie Night',
    description: 'Take 2 guilt-free hours to relax and enjoy a top-tier cinematic masterpiece or documentary.',
    costXp: 500,
    icon: 'Film',
    category: 'Entertainment',
    isUnlocked: true,
    redeemedCount: 0,
  },
  {
    id: 'rew-2',
    title: 'Buy a Hardcover Intellectual Book',
    description: 'Purchase a new physical book for your personal knowledge repository.',
    costXp: 1000,
    icon: 'BookOpen',
    category: 'Intellect',
    isUnlocked: true,
    redeemedCount: 0,
  },
  {
    id: 'rew-3',
    title: 'High-End Dining & Gastronomy Experience',
    description: 'Treat yourself to a luxurious, high-nutrition meal at a premium culinary venue.',
    costXp: 2500,
    icon: 'Utensils',
    category: 'Lifestyle',
    isUnlocked: true,
    redeemedCount: 0,
  },
  {
    id: 'rew-4',
    title: 'New Hardware / Tech Gear Upgrade',
    description: 'Invest in a premium mechanical keyboard, ergonomic accessory, or high-tier audio monitors.',
    costXp: 5000,
    icon: 'Cpu',
    category: 'Tech Gear',
    isUnlocked: true,
    redeemedCount: 0,
  },
  {
    id: 'rew-5',
    title: 'Weekend Rejuvenation Retreat / Travel',
    description: 'A 2-day nature or luxury getaway to completely recharge physiological and neural faculties.',
    costXp: 10000,
    icon: 'Compass',
    category: 'Travel',
    isUnlocked: false,
    redeemedCount: 0,
  },
];

export const INITIAL_SYSTEM_PROFILE: SystemProfile = {
  id: 'aravind-core',
  name: 'ARAVIND',
  title: 'Novice Initiate',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  currentLevelXpBase: 0,
  rank: 'E',
  rankTitle: 'Novice Initiate',
  rankEvaluation: 'System Evaluation: Unawakened Potential',
  hp: 100,
  maxHp: 100,
  energy: 100,
  maxEnergy: 100,
  dailyStreak: 1,
  weeklyStreak: 1,
  monthlyConsistencyRate: 100,
  streakBest: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  lastCheckInDate: undefined,
  checkInStreak: 0,
  systemInitialized: true,
  soundEnabled: true,
  firstTimeCompleted: true,
  primaryGoal: 'Master software engineering, algorithms, and build transformative scalable systems.',
  dailyAvailableHours: 4,
  preferredDifficulty: 'C',
  createdAt: new Date().toISOString(),
};

/**
 * Generates a dynamic, randomized Morning System Check-in Briefing
 */
export function generateDailyCheckInSummary(
  profile: SystemProfile,
  dailyQuests: DailyQuest[],
  mainQuests: MainQuest[],
  attributes: CharacterAttribute[],
  seedVariation: number = 0
): import('../types').DailyCheckInSummary {
  const todayDate = new Date().toISOString().split('T')[0];
  const hour = new Date().getHours();
  
  let timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' = 'MORNING';
  let greetingPrefix = 'GOOD MORNING';
  if (hour >= 12 && hour < 17) {
    timeOfDay = 'AFTERNOON';
    greetingPrefix = 'TACTICAL AFTERNOON BRIEF';
  } else if (hour >= 17 || hour < 5) {
    timeOfDay = 'EVENING';
    greetingPrefix = 'EVENING PROTOCOL SYNCHRONIZATION';
  }

  const morningDirectives = [
    'The gap between an unawakened initiate and an S-Rank Sovereign is forged in the first two hours of execution. Initiate your priority blocks without hesitation.',
    'System telemetry indicates maximum cognitive bandwidth in the morning cycle. Allocate your peak focus to DSA and core architecture.',
    'Discipline is the only currency that never depreciates. Complete your daily quest nodes to fortify your character matrix.',
    'A sovereign does not wait for motivation. Every line of code written and every physical rep executed updates your permanent rank.',
    'Clear all secondary distractions. Zero in on today’s critical priorities to maintain unbroken daily momentum.',
    'Precision and consistency compound exponentially. Treat each quest as an immutable system requirement.'
  ];

  const goalReflections = [
    `Your primary directive is locked: "${profile.primaryGoal}". Today is an active iteration towards total mastery.`,
    `Alignment Check: Progressing on "${profile.primaryGoal}". Ensure today's high-leverage engineering tasks are completed first.`,
    `Focus Vector: "${profile.primaryGoal}". Every daily milestone directly fuels this long-term campaign.`
  ];

  // Pick directives with variation
  const directiveIndex = (new Date().getDate() + seedVariation) % morningDirectives.length;
  const reflectionIndex = (new Date().getDate() + seedVariation) % goalReflections.length;

  // Synthesize top 3 priorities for today
  const priorities: import('../types').DailyCheckInPriority[] = [];

  // Priority 1: First incomplete daily quest or main quest
  const incompleteDaily = dailyQuests.filter((q) => !q.completed);
  if (incompleteDaily.length > 0) {
    const topQuest = incompleteDaily[0];
    priorities.push({
      id: 'priority-daily-1',
      category: topQuest.category || 'Core Quest',
      title: topQuest.title,
      description: topQuest.description,
      xpEstimate: topQuest.xpReward,
      difficulty: topQuest.difficulty,
      type: 'DAILY_QUEST',
    });
  }

  // Priority 2: Secondary incomplete quest or physical workout
  if (incompleteDaily.length > 1) {
    const secondQuest = incompleteDaily[1];
    priorities.push({
      id: 'priority-daily-2',
      category: secondQuest.category || 'Secondary Objective',
      title: secondQuest.title,
      description: secondQuest.description,
      xpEstimate: secondQuest.xpReward,
      difficulty: secondQuest.difficulty,
      type: 'DAILY_QUEST',
    });
  } else if (mainQuests.length > 0) {
    const activeMain = mainQuests[0];
    const incompleteObj = activeMain.objectives.find((o) => !o.completed);
    priorities.push({
      id: 'priority-main-1',
      category: 'Main Campaign',
      title: incompleteObj ? `${activeMain.title}: ${incompleteObj.text}` : activeMain.title,
      description: activeMain.description,
      xpEstimate: incompleteObj?.xpBonus || 300,
      difficulty: 'A',
      type: 'MAIN_QUEST',
    });
  }

  // Priority 3: Lowest attribute or tactical habit
  const sortedAttrs = [...attributes].sort((a, b) => a.score - b.score);
  const lowestAttr = sortedAttrs[0] || attributes[0];
  priorities.push({
    id: 'priority-attr-1',
    category: 'Attribute Calibration',
    title: `Fortify ${lowestAttr.name} Attribute (Current: ${lowestAttr.score}/100)`,
    description: `Target ${lowestAttr.name} through focused training to eliminate character matrix bottlenecks.`,
    xpEstimate: 25,
    difficulty: 'C',
    type: 'ATTRIBUTE_FOCUS',
  });

  const isCheckedInToday = profile.lastCheckInDate === todayDate;

  return {
    date: todayDate,
    greeting: `${greetingPrefix}, ARAVIND`,
    timeOfDay,
    systemDirective: morningDirectives[directiveIndex],
    primaryGoalReflection: goalReflections[reflectionIndex],
    priorities: priorities.slice(0, 3),
    recommendedFocusAttribute: lowestAttr?.name || 'Intelligence',
    isCheckedInToday,
    checkInBonusXp: 25,
  };
}
