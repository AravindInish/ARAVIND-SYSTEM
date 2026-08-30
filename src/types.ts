export type RankGrade = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export type QuestDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface AttributeHistoryEntry {
  id: string;
  timestamp: string;
  delta: number;
  reason: string;
}

export interface CharacterAttribute {
  id: string;
  name: string;
  score: number;
  level: number;
  maxScore: number;
  category: 'PHYSICAL' | 'MENTAL' | 'TACTICAL' | 'SOCIAL' | 'CREATIVE';
  icon: string;
  description: string;
  history: AttributeHistoryEntry[];
}

export interface AttributeReward {
  attributeId: string;
  attributeName: string;
  delta: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  attributeRewards: AttributeReward[];
  completed: boolean;
  completedAt?: string;
  category: string;
  difficulty: QuestDifficulty;
  isAiGenerated?: boolean;
  aiReason?: string;
  dueTime?: string;
  createdAt: string;
}

export interface MainQuestObjective {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
  xpBonus?: number;
}

export interface MainQuest {
  id: string;
  title: string;
  description: string;
  category: string;
  progressPercent: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  xpReward: number;
  attributeRewards: AttributeReward[];
  objectives: MainQuestObjective[];
  deadline?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SkillHistoryEntry {
  timestamp: string;
  note: string;
  xpAdded: number;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  category: string;
  icon: string;
  description: string;
  masteryRank: 'Novice' | 'Apprentice' | 'Adept' | 'Expert' | 'Master' | 'Grandmaster' | 'Transcendent';
  relatedQuestsCount: number;
  history: SkillHistoryEntry[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'PROGRESSION' | 'STREAK' | 'INTELLECT' | 'MASTERY' | 'DISCIPLINE' | 'CREATION';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rewardXp: number;
  badgeGrade: RankGrade;
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
}

export type InventoryItemType = 'CERTIFICATE' | 'BADGE' | 'PROJECT' | 'BOOK' | 'SPECIAL_UNLOCK' | 'ARTIFACT';
export type ItemRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export interface InventoryItem {
  id: string;
  title: string;
  type: InventoryItemType;
  rarity: ItemRarity;
  description: string;
  dateAcquired: string;
  associatedSkillId?: string;
  associatedSkillName?: string;
  associatedAchievementId?: string;
  fileUrl?: string; // base64 preview or mock URL
  fileName?: string;
  fileSize?: string;
  tags: string[];
}

export interface PersonalReward {
  id: string;
  title: string;
  description: string;
  costXp: number;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  redeemedCount: number;
}

export interface SystemNotification {
  id: string;
  type: 'SYSTEM_ALERT' | 'QUEST_COMPLETE' | 'LEVEL_UP' | 'ACHIEVEMENT_UNLOCKED' | 'SYSTEM_WARNING' | 'REWARD_UNLOCKED' | 'AI_RECOMMENDATION' | 'STREAK_RECORD' | 'SYSTEM_MESSAGE';
  title: string;
  message: string;
  timestamp: string;
  xpDelta?: number;
  attributeDeltas?: { name: string; delta: number }[];
  read: boolean;
  urgent?: boolean;
}

export interface SystemProfile {
  id: string;
  name: string; // Strictly "ARAVIND"
  title: string; // e.g. "Shadow Monarch of Self-Mastery", "S-Rank Intellectual Architect"
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentLevelXpBase: number;
  rank: RankGrade;
  rankTitle: string;
  rankEvaluation: string;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  dailyStreak: number;
  weeklyStreak: number;
  monthlyConsistencyRate: number; // e.g. 94%
  streakBest: number;
  lastActiveDate: string;
  lastCheckInDate?: string;
  checkInStreak?: number;
  systemInitialized: boolean;
  soundEnabled: boolean;
  firstTimeCompleted: boolean;
  primaryGoal: string;
  dailyAvailableHours: number;
  preferredDifficulty: QuestDifficulty;
  createdAt: string;
}

export interface DailyCheckInPriority {
  id: string;
  category: string;
  title: string;
  description?: string;
  xpEstimate: number;
  difficulty: QuestDifficulty;
  type: 'DAILY_QUEST' | 'MAIN_QUEST' | 'ATTRIBUTE_FOCUS' | 'DISCIPLINE';
}

export interface DailyCheckInSummary {
  date: string;
  greeting: string;
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING';
  systemDirective: string;
  primaryGoalReflection: string;
  priorities: DailyCheckInPriority[];
  recommendedFocusAttribute: string;
  isCheckedInToday: boolean;
  checkInBonusXp: number;
}

export interface AiSystemAnalysis {
  lastAnalyzedAt: string;
  summary: string;
  strongestAttribute: string;
  weakestAttribute: string;
  streakEvaluation: string;
  growthTrajectory: string;
  systemAdvice: string;
  recommendedQuests: {
    title: string;
    description: string;
    xpReward: number;
    targetAttribute: string;
    difficulty: QuestDifficulty;
    aiReason: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isGuest?: boolean;
  avatarUrl?: string;
}

export type ActiveNavTab = 
  | 'dashboard' 
  | 'quests' 
  | 'mainQuests' 
  | 'attributes' 
  | 'skills' 
  | 'achievements' 
  | 'inventory' 
  | 'rewards' 
  | 'aiSystem' 
  | 'settings';
