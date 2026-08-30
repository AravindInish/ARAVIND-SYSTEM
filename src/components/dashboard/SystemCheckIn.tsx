import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Zap,
  Target,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  Compass,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const SystemCheckIn: React.FC = () => {
  const {
    profile,
    dailyCheckIn,
    performDailyCheckIn,
    regenerateCheckInBriefing,
    setCurrentTab,
  } = useSystem();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCheckIn = () => {
    setIsSubmitting(true);
    const result = performDailyCheckIn();
    if (result.success) {
      setJustCheckedIn(true);
      setTimeout(() => setJustCheckedIn(false), 4000);
    }
    setIsSubmitting(false);
  };

  const isCheckedIn = dailyCheckIn.isCheckedInToday || justCheckedIn;

  return (
    <section
      id="daily-system-checkin-module"
      aria-label="Daily System Check-in"
      className="relative overflow-hidden rounded-lg bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/90 backdrop-blur-xl border border-slate-800/80 p-4 sm:p-5 shadow-xl transition-all"
    >
      {/* Background Accent Grid / Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

      {/* Top Header / Status Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                SYSTEM PROTOCOL // DAILY CHECK-IN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {formattedDate} • 08:00 CYCLE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className={`text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded flex items-center gap-1.5 tracking-wider uppercase ${
              isCheckedIn
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse'
            }`}
          >
            {isCheckedIn ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SYNCHRONIZED TODAY (+{dailyCheckIn.checkInBonusXp} XP)</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>AWAITING CHECK-IN (+{dailyCheckIn.checkInBonusXp} XP)</span>
              </>
            )}
          </div>

          <button
            id="refresh-daily-briefing-btn"
            onClick={regenerateCheckInBriefing}
            title="Generate fresh randomized morning summary & directives"
            className="p-1.5 rounded bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Grid: Operator Greeting + Directives & Priorities */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left 7 Cols: Greeting & System Directive */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <h3 className="text-lg sm:text-xl font-light tracking-tight text-white uppercase font-sans">
              {dailyCheckIn.greeting}
            </h3>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Your real-life character telemetry is online. Level <strong className="text-cyan-400">{profile.level}</strong> ({profile.rank} Rank).
            </p>
          </div>

          {/* System Directive Quote Box */}
          <div className="p-3 sm:p-3.5 rounded-lg bg-black/40 border border-cyan-500/20 shadow-inner relative">
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>&gt; MORNING SYSTEM DIRECTIVE:</span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans italic">
              "{dailyCheckIn.systemDirective}"
            </p>
          </div>

          {/* Primary Goal Alignment */}
          <div className="p-3 rounded bg-slate-800/30 border border-slate-700/40 flex items-start gap-2.5">
            <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
              <Target className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                PRIMARY GOAL VECTOR
              </div>
              <div className="text-xs font-medium text-slate-200">
                {profile.primaryGoal}
              </div>
              <div className="text-[10px] text-cyan-300/80 font-mono pt-0.5">
                {dailyCheckIn.primaryGoalReflection}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Top Priorities for Today + Check-In Action Button */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/40 pb-1">
              <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5 text-cyan-400">
                <Compass className="w-3.5 h-3.5" /> TODAY'S TOP PRIORITIES
              </span>
              <span className="text-[10px] text-slate-500">{dailyCheckIn.priorities.length} KEY NODES</span>
            </div>

            <div className="space-y-1.5">
              {dailyCheckIn.priorities.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-2 rounded bg-black/40 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-4 h-4 rounded bg-slate-800/80 border border-slate-700 text-[9px] font-mono font-bold flex items-center justify-center text-cyan-400 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-slate-200 truncate font-medium font-sans text-xs">
                        {item.title}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono uppercase">
                        {item.category} • TIER {item.difficulty}
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0 font-bold">
                    +{item.xpEstimate} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Check-in Button or Confirmation Banner */}
          <div className="pt-1">
            {!isCheckedIn ? (
              <button
                id="execute-daily-checkin-btn"
                onClick={handleCheckIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-mono font-bold text-[11px] tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all cursor-pointer disabled:opacity-50 uppercase"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>CONFIRM DAILY SYSTEM CHECK-IN (+{dailyCheckIn.checkInBonusXp} XP)</span>
              </button>
            ) : (
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs font-mono text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px]">MORNING PROTOCOL ACTIVE // +25 XP</span>
                </div>
                <button
                  onClick={() => setCurrentTab('quests')}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Quests</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
