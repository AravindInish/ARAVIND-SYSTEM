import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { getRankFromLevel } from '../../utils/progression';

export const LevelUpModal: React.FC = () => {
  const { activeLevelUpModal, closeLevelUpModal } = useSystem();

  if (!activeLevelUpModal) return null;

  const rankInfo = getRankFromLevel(activeLevelUpModal.level);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Animated Background glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-lg overflow-hidden rounded-lg bg-[#0a0a0c] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-center backdrop-blur-xl"
        >
          {/* Top System Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            SYSTEM ANNOUNCEMENT // ASCENSION
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', damping: 15 }}
            className="mb-4"
          >
            <h2 className="text-4xl sm:text-5xl font-light font-mono tracking-tight text-white uppercase">
              LEVEL UP
            </h2>
            <p className="mt-2 text-sm text-slate-400 font-mono">
              ARAVIND has ascended to <span className="text-cyan-400 font-bold">LEVEL {activeLevelUpModal.level}</span>
            </p>
          </motion.div>

          {/* Rank Badge Container */}
          <div className="my-6 p-4 rounded bg-black/40 border border-cyan-500/30 flex flex-col items-center justify-center relative">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
              CURRENT RANK STATUS
            </div>
            <div className="text-5xl font-light font-mono text-cyan-400 tracking-tight my-1 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              {rankInfo.rank}
            </div>
            <div className="text-sm font-mono text-slate-200 font-semibold uppercase tracking-wider">
              {rankInfo.title}
            </div>
            <div className="text-xs text-cyan-300/80 font-mono mt-1">
              "{rankInfo.evaluation}"
            </div>
          </div>

          {/* Unlocked Perks List */}
          <div className="space-y-2 mb-6 text-left font-mono text-xs">
            <div className="flex items-center gap-2.5 p-2.5 rounded bg-black/40 border border-slate-800 text-slate-200">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Energy and Vitality capacities expanded (+10 Max).</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded bg-black/40 border border-slate-800 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Attribute multiplier enhanced for upcoming quests.</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded bg-black/40 border border-slate-800 text-slate-200">
              <Trophy className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>New high-tier milestone rewards unlocked in Store.</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={closeLevelUpModal}
            className="w-full py-3 px-6 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer uppercase"
          >
            <span>ACKNOWLEDGE SYSTEM ASCENSION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
