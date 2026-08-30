import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  SystemProfile,
  CharacterAttribute,
  DailyQuest,
  MainQuest,
  SkillItem,
  Achievement,
  InventoryItem,
  PersonalReward,
  SystemNotification,
  AiSystemAnalysis,
  ChatMessage,
  AuthUser,
  ActiveNavTab,
  RankGrade,
  QuestDifficulty,
  DailyCheckInSummary,
} from '../types';
import {
  INITIAL_SYSTEM_PROFILE,
  INITIAL_ATTRIBUTES,
  INITIAL_DAILY_QUESTS,
  INITIAL_MAIN_QUESTS,
  INITIAL_SKILLS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_INVENTORY,
  INITIAL_REWARDS,
  getXpRequiredForLevel,
  getRankFromLevel,
  generateDailyCheckInSummary,
} from '../utils/progression';
import { systemAudio } from '../utils/audio';

const STORAGE_KEY = 'ARAVIND_SYSTEM_V5_CLEAN_DATA';
const AUTH_KEY = 'ARAVIND_SYSTEM_AUTH_V2';

interface SystemContextType {
  // Navigation & User
  currentTab: ActiveNavTab;
  setCurrentTab: (tab: ActiveNavTab) => void;
  authUser: AuthUser | null;
  login: (email: string, name?: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;

  // Profile & Progression
  profile: SystemProfile;
  updateProfile: (updates: Partial<SystemProfile>) => void;
  addXp: (amount: number, reason?: string) => void;
  toggleSound: () => void;

  // Daily System Check-in
  dailyCheckIn: DailyCheckInSummary;
  performDailyCheckIn: () => { success: boolean; xpGained: number; message: string };
  regenerateCheckInBriefing: () => void;

  // Attributes
  attributes: CharacterAttribute[];
  addAttribute: (attr: Omit<CharacterAttribute, 'id' | 'history'>) => void;
  updateAttributeScore: (id: string, delta: number, reason: string) => void;
  deleteAttribute: (id: string) => void;

  // Daily Quests
  dailyQuests: DailyQuest[];
  toggleDailyQuest: (id: string) => void;
  addDailyQuest: (quest: Omit<DailyQuest, 'id' | 'createdAt' | 'completed'>) => void;
  deleteDailyQuest: (id: string) => void;
  acceptAiQuest: (quest: { title: string; description: string; xpReward: number; targetAttribute: string; difficulty: QuestDifficulty; aiReason: string }) => void;

  // Main Quests
  mainQuests: MainQuest[];
  addMainQuest: (quest: Omit<MainQuest, 'id' | 'createdAt' | 'progressPercent' | 'status'>) => void;
  toggleMainQuestObjective: (questId: string, objectiveId: string) => void;
  deleteMainQuest: (id: string) => void;

  // Skills
  skills: SkillItem[];
  addSkill: (skill: Omit<SkillItem, 'id' | 'history'>) => void;
  trainSkill: (id: string, xpAdded: number, note: string) => void;
  deleteSkill: (id: string) => void;

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;

  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  deleteInventoryItem: (id: string) => void;

  // Rewards
  rewards: PersonalReward[];
  addReward: (reward: Omit<PersonalReward, 'id' | 'isUnlocked' | 'redeemedCount'>) => void;
  redeemReward: (id: string) => boolean;
  deleteReward: (id: string) => void;

  // Notifications
  notifications: SystemNotification[];
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  activeLevelUpModal: { level: number; rank: RankGrade; title: string } | null;
  closeLevelUpModal: () => void;

  // AI System
  aiAnalysis: AiSystemAnalysis | null;
  isAnalyzingAi: boolean;
  runAiAnalysis: () => Promise<void>;
  chatMessages: ChatMessage[];
  sendAiChatMessage: (message: string) => Promise<void>;
  isAiChatTyping: boolean;

  // First time experience
  completeOnboarding: (config: {
    primaryGoal: string;
    skills: string[];
    dailyHours: number;
    difficulty: QuestDifficulty;
  }) => void;
  resetAllData: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<ActiveNavTab>('dashboard');

  // Auth
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'aravind-master',
      email: 'aravind@system.core',
      name: 'ARAVIND',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    };
  });

  // State slices
  const [profile, setProfile] = useState<SystemProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) return parsed.profile;
      }
    } catch {}
    return INITIAL_SYSTEM_PROFILE;
  });

  const [attributes, setAttributes] = useState<CharacterAttribute[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.attributes) return parsed.attributes;
      }
    } catch {}
    return INITIAL_ATTRIBUTES;
  });

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dailyQuests) return parsed.dailyQuests;
      }
    } catch {}
    return INITIAL_DAILY_QUESTS;
  });

  const [mainQuests, setMainQuests] = useState<MainQuest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mainQuests) return parsed.mainQuests;
      }
    } catch {}
    return INITIAL_MAIN_QUESTS;
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.skills) return parsed.skills;
      }
    } catch {}
    return INITIAL_SKILLS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.achievements) return parsed.achievements;
      }
    } catch {}
    return INITIAL_ACHIEVEMENTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.inventory) return parsed.inventory;
      }
    } catch {}
    return INITIAL_INVENTORY;
  });

  const [rewards, setRewards] = useState<PersonalReward[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rewards) return parsed.rewards;
      }
    } catch {}
    return INITIAL_REWARDS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-init',
      type: 'SYSTEM_MESSAGE',
      title: 'SYSTEM ONLINE',
      message: 'Welcome back, ARAVIND. Your real-life growth continues.',
      timestamp: new Date().toISOString(),
      read: false,
    },
  ]);

  const [activeLevelUpModal, setActiveLevelUpModal] = useState<{
    level: number;
    rank: RankGrade;
    title: string;
  } | null>(null);

  // AI State
  const [aiAnalysis, setAiAnalysis] = useState<AiSystemAnalysis | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'chat-init',
      role: 'assistant',
      content: `[SYSTEM ONLINE]\nGreetings, ARAVIND. I am your personal System Guide. All biometric and real-life progression channels are synchronized. You can ask for tactical counsel, custom quest calibration, or performance analysis at any time.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isAiChatTyping, setIsAiChatTyping] = useState(false);

  // Synchronize audio mute setting
  useEffect(() => {
    systemAudio.setMuted(!profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Persist State to LocalStorage
  useEffect(() => {
    try {
      const fullState = {
        profile,
        attributes,
        dailyQuests,
        mainQuests,
        skills,
        achievements,
        inventory,
        rewards,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullState));
    } catch (e) {
      console.error('Failed to persist System data:', e);
    }
  }, [profile, attributes, dailyQuests, mainQuests, skills, achievements, inventory, rewards]);

  // Notification helper
  const addNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 29)]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Progression Logic
  const addXp = (amount: number, reason?: string) => {
    setProfile((prev) => {
      let newXp = prev.xp + amount;
      let currentLevel = prev.level;
      let xpForNext = getXpRequiredForLevel(currentLevel);
      let didLevelUp = false;

      while (newXp >= xpForNext) {
        currentLevel += 1;
        didLevelUp = true;
        xpForNext = getXpRequiredForLevel(currentLevel);
      }

      const rankInfo = getRankFromLevel(currentLevel);

      if (didLevelUp) {
        systemAudio.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b'],
        });

        setActiveLevelUpModal({
          level: currentLevel,
          rank: rankInfo.rank,
          title: rankInfo.title,
        });

        addNotification({
          type: 'LEVEL_UP',
          title: 'SYSTEM LEVEL UP',
          message: `ARAVIND has reached Level ${currentLevel}. Rank evaluation: ${rankInfo.rank} (${rankInfo.title}). New capabilities unlocked.`,
          xpDelta: amount,
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: currentLevel,
        xpToNextLevel: xpForNext,
        rank: rankInfo.rank,
        rankTitle: rankInfo.title,
        rankEvaluation: rankInfo.evaluation,
        energy: Math.min(prev.maxEnergy, prev.energy + 5),
      };
    });
  };

  const [checkInSeed, setCheckInSeed] = useState(0);

  // Compute Daily Check-In Summary dynamically
  const dailyCheckIn = React.useMemo(() => {
    return generateDailyCheckInSummary(profile, dailyQuests, mainQuests, attributes, checkInSeed);
  }, [profile, dailyQuests, mainQuests, attributes, checkInSeed]);

  const performDailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastCheckInDate === today) {
      return { success: false, xpGained: 0, message: 'System already synchronized for today.' };
    }

    const bonusXp = 25;
    const currentStreak = profile.checkInStreak || 0;
    const nextStreak = currentStreak + 1;

    setProfile((prev) => ({
      ...prev,
      lastCheckInDate: today,
      checkInStreak: nextStreak,
      dailyStreak: Math.max(prev.dailyStreak, nextStreak),
    }));

    addXp(bonusXp, 'Daily System Check-in Protocol Completed');
    systemAudio.playQuestComplete();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#06b6d4', '#10b981', '#f59e0b'],
    });

    addNotification({
      type: 'SYSTEM_MESSAGE',
      title: 'DAILY SYSTEM CHECK-IN CONFIRMED',
      message: `Morning protocol synchronized for ARAVIND. +${bonusXp} XP granted. Priority vectors active for today.`,
      xpDelta: bonusXp,
    });

    return { success: true, xpGained: bonusXp, message: `System Check-in confirmed! +${bonusXp} XP awarded.` };
  };

  const regenerateCheckInBriefing = () => {
    setCheckInSeed((prev) => prev + 1);
    systemAudio.playClick();
  };

  const updateProfile = (updates: Partial<SystemProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleSound = () => {
    setProfile((prev) => {
      const nextSound = !prev.soundEnabled;
      systemAudio.setMuted(!nextSound);
      if (nextSound) systemAudio.playClick();
      return { ...prev, soundEnabled: nextSound };
    });
  };

  // Attributes Operations
  const addAttribute = (attr: Omit<CharacterAttribute, 'id' | 'history'>) => {
    const newAttr: CharacterAttribute = {
      ...attr,
      id: 'attr-' + Date.now(),
      history: [
        {
          id: 'h-' + Date.now(),
          timestamp: new Date().toISOString(),
          delta: attr.score,
          reason: 'Attribute node calibrated by ARAVIND',
        },
      ],
    };
    setAttributes((prev) => [...prev, newAttr]);
    systemAudio.playClick();
    addNotification({
      type: 'SYSTEM_ALERT',
      title: 'ATTRIBUTE NODE INITIALIZED',
      message: `Attribute [${attr.name}] has been permanently bound to ARAVIND SYSTEM.`,
    });
  };

  const updateAttributeScore = (id: string, delta: number, reason: string) => {
    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id === id) {
          const newScore = Math.min(attr.maxScore, Math.max(0, attr.score + delta));
          const newLevel = Math.max(1, Math.floor(newScore / 5) + 1);
          return {
            ...attr,
            score: newScore,
            level: newLevel,
            history: [
              {
                id: 'h-' + Date.now(),
                timestamp: new Date().toISOString(),
                delta,
                reason,
              },
              ...attr.history.slice(0, 15),
            ],
          };
        }
        return attr;
      })
    );
  };

  const deleteAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((a) => a.id !== id));
  };

  // Daily Quests Operations
  const toggleDailyQuest = (id: string) => {
    setDailyQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === id) {
          const willComplete = !quest.completed;
          if (willComplete) {
            systemAudio.playQuestComplete();
            confetti({
              particleCount: 30,
              spread: 50,
              origin: { y: 0.7 },
              colors: ['#06b6d4', '#10b981'],
            });

            // Add XP
            addXp(quest.xpReward, `Completed Daily Quest: ${quest.title}`);

            // Update attributes
            quest.attributeRewards.forEach((rew) => {
              updateAttributeScore(rew.attributeId, rew.delta, `Daily Quest Completed: ${quest.title}`);
            });

            // Notification
            const attrDeltas = quest.attributeRewards.map((r) => ({
              name: r.attributeName,
              delta: r.delta,
            }));
            addNotification({
              type: 'QUEST_COMPLETE',
              title: 'QUEST COMPLETE',
              message: `+${quest.xpReward} XP awarded to ARAVIND. ${attrDeltas.map((a) => `${a.name.toUpperCase()} +${a.delta}`).join(', ')}`,
              xpDelta: quest.xpReward,
              attributeDeltas: attrDeltas,
            });

            // Check if all daily quests completed to boost streak
            setTimeout(() => {
              checkStreakBonus();
            }, 500);
          } else {
            systemAudio.playClick();
          }

          return {
            ...quest,
            completed: willComplete,
            completedAt: willComplete ? new Date().toISOString() : undefined,
          };
        }
        return quest;
      })
    );
  };

  const checkStreakBonus = () => {
    setDailyQuests((currentQuests) => {
      const allDone = currentQuests.length > 0 && currentQuests.every((q) => q.completed);
      if (allDone) {
        systemAudio.playAchievement();
        setProfile((prev) => {
          const newStreak = prev.dailyStreak + 1;
          const isRecord = newStreak > prev.streakBest;
          addNotification({
            type: 'STREAK_RECORD',
            title: isRecord ? 'STREAK RECORD SHATTERED!' : 'DAILY PROTOCOL EXECUTED',
            message: `All daily quests cleared! Current streak: ${newStreak} Days${isRecord ? ' (New All-Time High!)' : ''}. HP and Energy fully restored.`,
          });
          return {
            ...prev,
            dailyStreak: newStreak,
            streakBest: isRecord ? newStreak : prev.streakBest,
            hp: 100,
            energy: 100,
          };
        });
      }
      return currentQuests;
    });
  };

  const addDailyQuest = (quest: Omit<DailyQuest, 'id' | 'createdAt' | 'completed'>) => {
    const newQuest: DailyQuest = {
      ...quest,
      id: 'dq-' + Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setDailyQuests((prev) => [newQuest, ...prev]);
    systemAudio.playClick();
    addNotification({
      type: 'SYSTEM_ALERT',
      title: 'NEW DAILY QUEST REGISTERED',
      message: `Quest [${quest.title}] registered with +${quest.xpReward} XP reward.`,
    });
  };

  const deleteDailyQuest = (id: string) => {
    setDailyQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const acceptAiQuest = (aiQuest: {
    title: string;
    description: string;
    xpReward: number;
    targetAttribute: string;
    difficulty: QuestDifficulty;
    aiReason: string;
  }) => {
    const targetAttr = attributes.find(
      (a) => a.name.toLowerCase() === aiQuest.targetAttribute.toLowerCase()
    ) || attributes[0];

    const newQuest: DailyQuest = {
      id: 'dq-ai-' + Date.now(),
      title: aiQuest.title,
      description: aiQuest.description,
      xpReward: aiQuest.xpReward,
      attributeRewards: [
        {
          attributeId: targetAttr.id,
          attributeName: targetAttr.name,
          delta: 2,
        },
      ],
      completed: false,
      category: 'AI Recommended',
      difficulty: aiQuest.difficulty,
      isAiGenerated: true,
      aiReason: aiQuest.aiReason,
      createdAt: new Date().toISOString(),
    };

    setDailyQuests((prev) => [newQuest, ...prev]);
    systemAudio.playQuestComplete();
    addNotification({
      type: 'AI_RECOMMENDATION',
      title: 'AI SYSTEM QUEST ACCEPTED',
      message: `Quest [${aiQuest.title}] locked into ARAVIND's daily directives. Target: ${targetAttr.name}.`,
    });
  };

  // Main Quests Operations
  const addMainQuest = (quest: Omit<MainQuest, 'id' | 'createdAt' | 'progressPercent' | 'status'>) => {
    const totalObjs = quest.objectives.length;
    const completedObjs = quest.objectives.filter((o) => o.completed).length;
    const progressPercent = totalObjs > 0 ? Math.round((completedObjs / totalObjs) * 100) : 0;

    const newMain: MainQuest = {
      ...quest,
      id: 'mq-' + Date.now(),
      progressPercent,
      status: progressPercent === 100 ? 'COMPLETED' : 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    setMainQuests((prev) => [...prev, newMain]);
    systemAudio.playClick();
    addNotification({
      type: 'SYSTEM_ALERT',
      title: 'MAIN QUEST INITIALIZED',
      message: `Epic campaign [${quest.title}] is now tracked by the System.`,
    });
  };

  const toggleMainQuestObjective = (questId: string, objectiveId: string) => {
    setMainQuests((prev) =>
      prev.map((mq) => {
        if (mq.id === questId) {
          const updatedObjectives = mq.objectives.map((obj) => {
            if (obj.id === objectiveId) {
              const willComplete = !obj.completed;
              if (willComplete) {
                systemAudio.playQuestComplete();
                if (obj.xpBonus) {
                  addXp(obj.xpBonus, `Main Quest Milestone: ${obj.text}`);
                }
              }
              return {
                ...obj,
                completed: willComplete,
                completedAt: willComplete ? new Date().toISOString() : undefined,
              };
            }
            return obj;
          });

          const total = updatedObjectives.length;
          const done = updatedObjectives.filter((o) => o.completed).length;
          const newProgress = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = newProgress === 100 && mq.status !== 'COMPLETED';

          if (isComplete) {
            systemAudio.playAchievement();
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
            });
            addXp(mq.xpReward, `Completed Main Quest Campaign: ${mq.title}`);
            mq.attributeRewards.forEach((r) => {
              updateAttributeScore(r.attributeId, r.delta, `Main Quest Completed: ${mq.title}`);
            });
            addNotification({
              type: 'ACHIEVEMENT_UNLOCKED',
              title: 'MAIN QUEST CONQUERED!',
              message: `ARAVIND has completed [${mq.title}]! +${mq.xpReward} XP awarded.`,
              xpDelta: mq.xpReward,
            });
          }

          return {
            ...mq,
            objectives: updatedObjectives,
            progressPercent: newProgress,
            status: newProgress === 100 ? 'COMPLETED' : 'ACTIVE',
            completedAt: isComplete ? new Date().toISOString() : mq.completedAt,
          };
        }
        return mq;
      })
    );
  };

  const deleteMainQuest = (id: string) => {
    setMainQuests((prev) => prev.filter((m) => m.id !== id));
  };

  // Skills Operations
  const addSkill = (skill: Omit<SkillItem, 'id' | 'history'>) => {
    const newSkill: SkillItem = {
      ...skill,
      id: 'sk-' + Date.now(),
      history: [
        {
          timestamp: new Date().toISOString(),
          note: 'Skill branch integrated into ARAVIND Matrix',
          xpAdded: skill.xp,
        },
      ],
    };
    setSkills((prev) => [...prev, newSkill]);
    systemAudio.playClick();
    addNotification({
      type: 'SYSTEM_ALERT',
      title: 'SKILL MATRIX UPDATED',
      message: `Skill [${skill.name}] registered at Level ${skill.level}.`,
    });
  };

  const trainSkill = (id: string, xpAdded: number, note: string) => {
    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id === id) {
          const newXp = skill.xp + xpAdded;
          let newLevel = skill.level;
          let newXpToNext = skill.xpToNext;

          if (newXp >= newXpToNext) {
            newLevel += 1;
            newXpToNext = Math.round(newXpToNext * 1.25);
            systemAudio.playLevelUp();
            addNotification({
              type: 'SYSTEM_ALERT',
              title: 'SKILL LEVEL UP',
              message: `ARAVIND's skill [${skill.name}] ascended to Level ${newLevel}!`,
            });
          } else {
            systemAudio.playQuestComplete();
          }

          // Compute mastery
          let mastery = skill.masteryRank;
          if (newLevel >= 30) mastery = 'Transcendent';
          else if (newLevel >= 25) mastery = 'Grandmaster';
          else if (newLevel >= 20) mastery = 'Master';
          else if (newLevel >= 15) mastery = 'Expert';
          else if (newLevel >= 10) mastery = 'Adept';
          else if (newLevel >= 5) mastery = 'Apprentice';

          // Award small player XP too
          addXp(Math.round(xpAdded * 0.5), `Trained Skill: ${skill.name}`);

          return {
            ...skill,
            level: newLevel,
            xp: newXp,
            xpToNext: newXpToNext,
            masteryRank: mastery,
            relatedQuestsCount: skill.relatedQuestsCount + 1,
            history: [
              {
                timestamp: new Date().toISOString(),
                note: note || 'Dedicated skill practice session',
                xpAdded,
              },
              ...skill.history.slice(0, 10),
            ],
          };
        }
        return skill;
      })
    );
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  // Achievements
  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id && !ach.unlocked) {
          systemAudio.playAchievement();
          confetti({
            particleCount: 90,
            spread: 60,
            origin: { y: 0.6 },
          });
          addXp(ach.rewardXp, `Unlocked Achievement: ${ach.title}`);
          addNotification({
            type: 'ACHIEVEMENT_UNLOCKED',
            title: 'ACHIEVEMENT UNLOCKED',
            message: `[${ach.title}] — ${ach.description} (+${ach.rewardXp} XP)`,
            xpDelta: ach.rewardXp,
          });
          return {
            ...ach,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
            progress: ach.progress ? { ...ach.progress, current: ach.progress.target } : undefined,
          };
        }
        return ach;
      })
    );
  };

  // Inventory
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: 'inv-' + Date.now(),
    };
    setInventory((prev) => [newItem, ...prev]);
    systemAudio.playRewardRedeem();
    addNotification({
      type: 'SYSTEM_ALERT',
      title: 'ITEM STORED IN INVENTORY',
      message: `Artifact [${item.title}] (${item.type}) cataloged in ARAVIND's vault.`,
    });
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  // Rewards
  const addReward = (reward: Omit<PersonalReward, 'id' | 'isUnlocked' | 'redeemedCount'>) => {
    const newRew: PersonalReward = {
      ...reward,
      id: 'rew-' + Date.now(),
      isUnlocked: true,
      redeemedCount: 0,
    };
    setRewards((prev) => [...prev, newRew]);
    systemAudio.playClick();
  };

  const redeemReward = (id: string): boolean => {
    const target = rewards.find((r) => r.id === id);
    if (!target) return false;

    if (profile.xp < target.costXp) {
      systemAudio.playAlert();
      addNotification({
        type: 'SYSTEM_WARNING',
        title: 'INSUFFICIENT XP',
        message: `Reward [${target.title}] requires ${target.costXp} XP. Current XP: ${profile.xp}.`,
        urgent: true,
      });
      return false;
    }

    // Deduct XP
    setProfile((prev) => ({
      ...prev,
      xp: Math.max(0, prev.xp - target.costXp),
    }));

    // Update reward count
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, redeemedCount: r.redeemedCount + 1 } : r))
    );

    systemAudio.playRewardRedeem();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#06b6d4'],
    });

    addNotification({
      type: 'REWARD_UNLOCKED',
      title: 'REWARD REDEEMED',
      message: `ARAVIND has unlocked: ${target.title} (-${target.costXp} XP). Enjoy your earned milestone!`,
    });
    return true;
  };

  const deleteReward = (id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const closeLevelUpModal = () => {
    setActiveLevelUpModal(null);
  };

  // AI System Analysis
  const runAiAnalysis = async () => {
    setIsAnalyzingAi(true);
    systemAudio.playClick();
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          attributes,
          quests: dailyQuests,
          mainQuests,
          skills,
          streak: {
            current: profile.dailyStreak,
            best: profile.streakBest,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis API failed');
      }

      const data = await response.json();
      setAiAnalysis({
        lastAnalyzedAt: new Date().toISOString(),
        summary: data.summary || 'System metrics calibrated. Real-life momentum optimal.',
        strongestAttribute: data.strongestAttribute || 'Intelligence',
        weakestAttribute: data.weakestAttribute || 'Consistency',
        streakEvaluation: data.streakEvaluation || 'Maintaining high operational consistency.',
        growthTrajectory: data.growthTrajectory || 'Optimal',
        systemAdvice: data.systemAdvice || 'Focus on high-impact algorithmic sessions.',
        recommendedQuests: data.recommendedQuests || [],
      });

      systemAudio.playAchievement();
      addNotification({
        type: 'AI_RECOMMENDATION',
        title: 'SYSTEM AUDIT COMPLETE',
        message: `System Guide has finalized ARAVIND's performance audit and generated tactical recommendations.`,
      });
    } catch (err) {
      console.error(err);
      // Fallback local intelligent generator
      setAiAnalysis({
        lastAnalyzedAt: new Date().toISOString(),
        summary: `SYSTEM STATUS: REAL-TIME OPTIMAL. ARAVIND, your intellectual and tactical attributes are advancing rapidly. Maintain your daily discipline cadence to reach S-Rank.`,
        strongestAttribute: 'Intelligence',
        weakestAttribute: 'Consistency',
        streakEvaluation: '14-day streak active. Zero failure tolerance maintained.',
        growthTrajectory: 'Exponential',
        systemAdvice: 'Execute deep work blocks during your peak morning energy window.',
        recommendedQuests: [
          {
            title: 'Neural Calibration: 45m DSA Trees & Graphs',
            description: 'Solve 2 complex graph algorithms to bolster algorithmic intuition.',
            xpReward: 85,
            targetAttribute: 'Intelligence',
            difficulty: 'B',
            aiReason: 'Accelerates path toward World-Class Software Engineer Main Quest.',
          },
          {
            title: 'Tactical Discipline: 30m Full Screen Digital Detox',
            description: 'Read physical book pages or execute physical conditioning with zero phone notifications.',
            xpReward: 60,
            targetAttribute: 'Discipline',
            difficulty: 'C',
            aiReason: 'Calibrates dopamine baseline and strengthens deep focus endurance.',
          },
        ],
      });
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // AI Chat
  const sendAiChatMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiChatTyping(true);
    systemAudio.playClick();

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages.slice(-8),
          context: {
            level: profile.level,
            rank: profile.rank,
            xp: profile.xp,
            activeQuestsCount: dailyQuests.filter((q) => !q.completed).length,
            streak: profile.dailyStreak,
            topAttributes: attributes.slice(0, 3).map((a) => `${a.name} (${a.score})`).join(', '),
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: data.reply || '[SYSTEM RESPONSE STREAMED]',
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
      systemAudio.playQuestComplete();
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: `[SYSTEM TRANSMISSION]\nARAVIND, telemetry received. Remember: a true Sovereign does not wait for motivation; they forge destiny through unyielding daily execution. Complete your daily quests to ascend.`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiChatTyping(false);
    }
  };

  // First time onboarding completion
  const completeOnboarding = (config: {
    primaryGoal: string;
    skills: string[];
    dailyHours: number;
    difficulty: QuestDifficulty;
  }) => {
    setProfile((prev) => ({
      ...prev,
      primaryGoal: config.primaryGoal,
      dailyAvailableHours: config.dailyHours,
      preferredDifficulty: config.difficulty,
      systemInitialized: true,
      firstTimeCompleted: true,
    }));
    systemAudio.playSystemBoot();
    addNotification({
      type: 'SYSTEM_MESSAGE',
      title: 'SYSTEM INITIALIZATION COMPLETE',
      message: `Welcome, ARAVIND. Your parameters are locked. The System is now live and monitoring your real-life ascension.`,
    });
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(INITIAL_SYSTEM_PROFILE);
    setAttributes(INITIAL_ATTRIBUTES);
    setDailyQuests(INITIAL_DAILY_QUESTS);
    setMainQuests(INITIAL_MAIN_QUESTS);
    setSkills(INITIAL_SKILLS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setInventory(INITIAL_INVENTORY);
    setRewards(INITIAL_REWARDS);
    setNotifications([
      {
        id: 'notif-reset',
        type: 'SYSTEM_MESSAGE',
        title: 'SYSTEM RESET COMPLETE',
        message: 'System calibrated to default master parameters for ARAVIND.',
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]);
    systemAudio.playSystemBoot();
  };

  const exportDataJson = () => {
    const data = {
      profile,
      attributes,
      dailyQuests,
      mainQuests,
      skills,
      achievements,
      inventory,
      rewards,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARAVIND_SYSTEM_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    systemAudio.playRewardRedeem();
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.attributes) setAttributes(parsed.attributes);
      if (parsed.dailyQuests) setDailyQuests(parsed.dailyQuests);
      if (parsed.mainQuests) setMainQuests(parsed.mainQuests);
      if (parsed.skills) setSkills(parsed.skills);
      if (parsed.achievements) setAchievements(parsed.achievements);
      if (parsed.inventory) setInventory(parsed.inventory);
      if (parsed.rewards) setRewards(parsed.rewards);
      systemAudio.playAchievement();
      addNotification({
        type: 'SYSTEM_ALERT',
        title: 'DATA RESTORED',
        message: 'ARAVIND SYSTEM data successfully synchronized from backup archive.',
      });
      return true;
    } catch {
      systemAudio.playAlert();
      return false;
    }
  };

  // Auth Methods
  const login = (email: string, name: string = 'ARAVIND') => {
    const user: AuthUser = {
      id: 'usr-' + Date.now(),
      email,
      name: 'ARAVIND',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    };
    setAuthUser(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    systemAudio.playSystemBoot();
  };

  const loginWithGoogle = () => {
    const user: AuthUser = {
      id: 'google-aravind',
      email: 'aravind@google.com',
      name: 'ARAVIND',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    };
    setAuthUser(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    systemAudio.playSystemBoot();
  };

  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem(AUTH_KEY);
    systemAudio.playClick();
  };

  return (
    <SystemContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        authUser,
        login,
        loginWithGoogle,
        logout,
        profile,
        updateProfile,
        addXp,
        toggleSound,
        dailyCheckIn,
        performDailyCheckIn,
        regenerateCheckInBriefing,
        attributes,
        addAttribute,
        updateAttributeScore,
        deleteAttribute,
        dailyQuests,
        toggleDailyQuest,
        addDailyQuest,
        deleteDailyQuest,
        acceptAiQuest,
        mainQuests,
        addMainQuest,
        toggleMainQuestObjective,
        deleteMainQuest,
        skills,
        addSkill,
        trainSkill,
        deleteSkill,
        achievements,
        unlockAchievement,
        inventory,
        addInventoryItem,
        deleteInventoryItem,
        rewards,
        addReward,
        redeemReward,
        deleteReward,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        activeLevelUpModal,
        closeLevelUpModal,
        aiAnalysis,
        isAnalyzingAi,
        runAiAnalysis,
        chatMessages,
        sendAiChatMessage,
        isAiChatTyping,
        completeOnboarding,
        resetAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
