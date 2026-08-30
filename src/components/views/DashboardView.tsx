import React from 'react';
import {
  Shield,
  Zap,
  Flame,
  Activity,
  Trophy,
  CheckSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  Bot,
  Plus,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { getRankFromLevel } from '../../utils/progression';
import { SystemCheckIn } from '../dashboard/SystemCheckIn';

export const DashboardView: React.FC = () => {
  const {
    profile,
    attributes,
    dailyQuests,
    mainQuests,
    achievements,
    toggleDailyQuest,
    setCurrentTab,
    runAiAnalysis,
    isAnalyzingAi,
    aiAnalysis,
  } = useSystem();

  const rankInfo = getRankFromLevel(profile.level);

  // Math for XP Progress Bar
  const xpCurrent = profile.xp;
  const xpGoal = profile.xpToNextLevel;
  const xpLeft = Math.max(0, xpGoal - xpCurrent);
  const xpProgressPercent = Math.min(100, Math.max(0, Math.round((xpCurrent / xpGoal) * 100)));

  const completedQuestsCount = dailyQuests.filter((q) => q.completed).length;
  const activeQuestsCount = dailyQuests.filter((q) => !q.completed).length;
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-800/50 pb-3 gap-3">
        <div>
          <h1 className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase mb-0.5">
            System Interface v4.0.2 // PROTOCOL ONLINE
          </h1>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tighter text-white uppercase">
            ARAVIND <span className="text-slate-500">SYSTEM</span>
          </h2>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-[10px] font-mono text-slate-500 uppercase">
            UPTIME: {Math.max(1, profile.dailyStreak * 24)}H 12M 04S • LEVEL {profile.level}
          </div>
          <div className="text-cyan-400 font-mono text-xs sm:text-sm">
            STATUS: <span className="animate-pulse font-bold">OPTIMIZED</span>
          </div>
        </div>
      </header>

      {/* Daily System Check-in Protocol */}
      <SystemCheckIn />

      {/* Main Experience Matrix & Character Hero */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-4 sm:p-5 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2.5 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          HOST_ID: #4092-A // OPERATOR ARAVIND
        </div>

        <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6 mb-5">
          {/* Circular Level Ring */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-cyan-500/20 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <div className="w-full h-full rounded-full border-3 border-cyan-400 border-t-transparent animate-spin duration-[10s]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-white font-mono">{profile.level}</span>
                <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-wider">Level</span>
              </div>
            </div>
          </div>

          {/* XP Matrix & Quick Stat Panels */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Experience Matrix</span>
              <span className="text-[11px] font-mono text-cyan-400">
                {xpCurrent.toLocaleString()} / {xpGoal.toLocaleString()} XP ({xpProgressPercent}%)
              </span>
            </div>
            <div className="h-2 bg-slate-800 w-full rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-700 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ width: `${xpProgressPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 font-mono">
              <div className="bg-black/30 p-2.5 border-l-2 border-cyan-500 rounded-r">
                <div className="text-[9px] text-slate-500 uppercase mb-0.5">Global Rank</div>
                <div className="text-lg font-light text-white tracking-widest">
                  {rankInfo.rank} <span className="text-[9px] text-cyan-400 font-normal">{rankInfo.title}</span>
                </div>
              </div>

              <div className="bg-black/30 p-2.5 border-l-2 border-emerald-500 rounded-r">
                <div className="text-[9px] text-slate-500 uppercase mb-0.5">Current Streak</div>
                <div className="text-lg font-light text-white tracking-widest">
                  {profile.dailyStreak} <span className="text-[10px] text-slate-500">DAYS</span>
                </div>
              </div>

              <div className="bg-black/30 p-2.5 border-l-2 border-rose-500 rounded-r">
                <div className="text-[9px] text-slate-500 uppercase mb-0.5">Vitals / HP</div>
                <div className="text-lg font-light text-emerald-400 tracking-widest">
                  {profile.hp}%
                </div>
              </div>

              <div className="bg-black/30 p-2.5 border-l-2 border-amber-500 rounded-r">
                <div className="text-[9px] text-slate-500 uppercase mb-0.5">Quests Cleared</div>
                <div className="text-lg font-light text-white tracking-widest">
                  {completedQuestsCount} <span className="text-[10px] text-slate-500">/ {dailyQuests.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Attributes Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {attributes.slice(0, 6).map((attr) => {
            const pct = Math.min(100, Math.round((attr.score / attr.maxScore) * 100));
            return (
              <div key={attr.id} className="bg-slate-800/30 p-2.5 rounded border border-slate-700/50">
                <div className="flex justify-between text-[9px] uppercase mb-1.5 text-slate-400 font-mono">
                  <span className="truncate pr-1">{attr.name}</span>
                  <span className="text-cyan-400 font-bold">{attr.score}</span>
                </div>
                <div className="h-1 bg-slate-700 w-full rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Message Banner */}
        <div className="mt-4 p-3 rounded bg-black/40 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">&gt; SYSTEM MESSAGE:</span>
            <span>Welcome back, <strong className="text-white font-semibold">ARAVIND</strong>. Your growth continues. All daily quest nodes are active.</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase hidden md:inline">NODE_01_SYNCHRONIZED</span>
        </div>
      </div>

      {/* Main Grid: Active Quests Hub + Right AI Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left: Active Daily Quests Hub (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                Active Quests ({dailyQuests.length})
              </h3>
              <button
                onClick={() => setCurrentTab('quests')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Full Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {dailyQuests.slice(0, 5).map((quest) => {
                return (
                  <div
                    key={quest.id}
                    onClick={() => toggleDailyQuest(quest.id)}
                    className={`group bg-black/40 p-4 border rounded transition-all flex items-center justify-between cursor-pointer ${
                      quest.completed
                        ? 'border-slate-800/60 opacity-60'
                        : 'border-slate-800 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                          quest.completed
                            ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px]'
                            : 'border border-cyan-500/50 group-hover:border-cyan-400'
                        }`}
                      >
                        {quest.completed && '✓'}
                      </div>
                      <div>
                        <div
                          className={`text-sm text-slate-200 font-sans ${
                            quest.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {quest.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {quest.completed ? 'COMPLETED' : 'INCOMPLETE'} • +{quest.xpReward} XP • TIER {quest.difficulty}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-[10px] font-mono px-2 py-1 uppercase rounded ${
                        quest.completed
                          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                          : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                      }`}
                    >
                      {quest.completed ? 'DONE' : 'IN PROGRESS'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Long-Term Campaign Snapshot */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-lg space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">
                ACTIVE MAIN QUEST CAMPAIGN
              </span>
              <span className="text-slate-400">
                {mainQuests[0]?.progressPercent || 0}% Complete
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 uppercase">
              {mainQuests[0]?.title || 'POLYMATHIC TRANSCENDENCE'}
            </h4>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                style={{ width: `${mainQuests[0]?.progressPercent || 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Reward: +{mainQuests[0]?.xpReward || 2500} XP</span>
              <button
                onClick={() => setCurrentTab('mainQuests')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Manage Roadmaps &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI System Analyst & Achievements (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* AI System Analyst Box */}
          <div className="bg-cyan-500/5 border border-cyan-500/30 p-5 rounded-lg">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-tighter mb-3 border-b border-cyan-500/20 pb-2 flex justify-between items-center">
              <span className="font-bold flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> SYSTEM ANALYST
              </span>
              <button
                onClick={runAiAnalysis}
                disabled={isAnalyzingAi}
                className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 cursor-pointer"
              >
                {isAnalyzingAi ? 'AUDITING...' : 'AI-V1.0 RUN'}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-cyan-100 font-light italic">
              "{aiAnalysis?.summary ||
                'Welcome back, ARAVIND. Your Intellect attribute is progressing rapidly, but Consistency has shown a 4% decline. I recommend a Focus-based quest within the next 2 hours to maintain Rank A status.'}"
            </p>
            <div className="mt-3 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-cyan-400/80">
              <span>STRONGEST: {aiAnalysis?.strongestAttribute || 'INTELLIGENCE'}</span>
              <button
                onClick={() => setCurrentTab('aiSystem')}
                className="hover:underline cursor-pointer"
              >
                Terminal &gt;
              </button>
            </div>
          </div>

          {/* Achievements Unlocked Grid */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase">
                Achievements Unlocked ({unlockedAchievementsCount}/{achievements.length})
              </h3>
              <button
                onClick={() => setCurrentTab('achievements')}
                className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((ach) => {
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded flex flex-col items-center text-center transition-all ${
                      ach.unlocked
                        ? 'bg-black/40 border border-slate-800 shadow-[0_0_10px_rgba(234,179,8,0.05)]'
                        : 'bg-black/40 border border-slate-800/60 opacity-40'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center ${
                        ach.unlocked
                          ? 'border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                          : 'border border-slate-700'
                      }`}
                    >
                      {ach.unlocked ? (
                        <div className="w-6 h-6 bg-yellow-500/20 rounded-full border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-xs">
                          ★
                        </div>
                      ) : (
                        <span className="text-sm text-slate-600">🔒</span>
                      )}
                    </div>
                    <div
                      className={`text-[9px] uppercase font-bold font-mono truncate max-w-full ${
                        ach.unlocked ? 'text-yellow-500' : 'text-slate-500'
                      }`}
                    >
                      {ach.title}
                    </div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">
                      +{ach.xpReward} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Resource Gauges */}
          <div className="mt-auto flex flex-col gap-2 font-mono text-[10px] text-slate-500 p-4 rounded-lg bg-black/40 border border-slate-800/60">
            <div className="flex justify-between items-center">
              <span>SYSTEM LOAD</span>
              <span className="text-cyan-400">12%</span>
            </div>
            <div className="h-1 bg-slate-800 w-full overflow-hidden rounded-full">
              <div className="h-full bg-cyan-500/40 w-[12%]"></div>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/40">
              <span>MEM SYNC</span>
              <span className="text-emerald-400">STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
