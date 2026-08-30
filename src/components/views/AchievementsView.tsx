import React, { useState } from 'react';
import {
  Trophy,
  Lock,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { Achievement, RankGrade } from '../../types';
import { systemAudio } from '../../utils/audio';

export const AchievementsView: React.FC = () => {
  const { achievements } = useSystem();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'PROGRESSION', 'STREAK', 'INTELLECT', 'MASTERY', 'DISCIPLINE', 'CREATION'];

  const filteredAchievements = achievements.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const unlockPercentage = Math.round((unlockedCount / achievements.length) * 100);
  const totalXpGranted = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.rewardXp, 0);

  const getTierColor = (grade: RankGrade) => {
    switch (grade) {
      case 'SSS':
      case 'SS':
      case 'S':
        return 'text-amber-300 border-amber-500/60 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]';
      case 'A':
      case 'B':
        return 'text-purple-300 border-purple-500/60 bg-purple-950/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]';
      case 'C':
      case 'D':
        return 'text-cyan-300 border-cyan-500/50 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-900/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <Trophy className="w-4 h-4" />
            <span>HALL OF TRIUMPHS & ACHIEVEMENTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">MILESTONE CODEX</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Permanent legacy records documenting character ascension, streak longevity, and intellectual breakthroughs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded bg-black/40 border border-slate-800/60 font-mono text-xs text-right">
            <div className="text-slate-500 uppercase tracking-widest text-[10px]">CODEX COMPLETION</div>
            <div className="text-base font-bold text-amber-400">
              {unlockedCount} / {achievements.length} <span className="text-xs text-slate-400">({unlockPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">UNLOCKED MILESTONES</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {unlockedCount} TROPHIES
            </div>
          </div>
          <Trophy className="w-7 h-7 text-amber-400 opacity-60" />
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">BONUS XP HARVESTED</span>
            <div className="text-xl font-bold text-cyan-400 mt-0.5">
              +{totalXpGranted.toLocaleString()} XP
            </div>
          </div>
          <Zap className="w-7 h-7 text-cyan-400 opacity-60" />
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">LOCKED AWAITING ASCENSION</span>
            <div className="text-xl font-bold text-slate-400 mt-0.5">
              {achievements.length - unlockedCount} REMAINING
            </div>
          </div>
          <Lock className="w-7 h-7 text-slate-600" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              systemAudio.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded border transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/50 font-bold shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                : 'bg-black/40 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = achievement.unlocked;

          return (
            <div
              key={achievement.id}
              className={`p-5 rounded-lg border transition-all duration-200 flex flex-col justify-between space-y-4 backdrop-blur-xl ${
                isUnlocked
                  ? 'bg-slate-900/40 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                  : 'bg-black/40 border-slate-800/60 text-slate-500 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded border flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-black/60 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-black/40 border-slate-800 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-sm sm:text-base font-semibold tracking-wide ${
                          isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        GRADE {achievement.badgeGrade} // {achievement.category}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-cyan-400 border border-slate-800 shrink-0">
                    +{achievement.rewardXp} XP
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed min-h-[36px]">
                  {achievement.description}
                </p>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-slate-800/60 text-[11px]">
                {isUnlocked ? (
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED & RECORDED
                    </span>
                    {achievement.unlockedAt && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>OBJECTIVE INCOMPLETE</span>
                      {achievement.progress && (
                        <span>
                          {achievement.progress.current} / {achievement.progress.target} {achievement.progress.unit}
                        </span>
                      )}
                    </div>
                    {achievement.progress && (
                      <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-slate-700 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (achievement.progress.current / achievement.progress.target) * 100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
