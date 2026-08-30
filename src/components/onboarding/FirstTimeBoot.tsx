import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Zap,
  Target,
  Clock,
  Flame,
  ArrowRight,
  CheckCircle,
  Terminal,
  Cpu,
  Brain,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { QuestDifficulty } from '../../types';
import { systemAudio } from '../../utils/audio';

export const FirstTimeBoot: React.FC = () => {
  const { completeOnboarding } = useSystem();

  const [bootStep, setBootStep] = useState<number>(0);
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    'Master high-level software engineering, algorithmic dominance, and polymathic intellect.'
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Programming & Software Eng',
    'DSA',
    'Artificial Intelligence',
    'Communication',
  ]);
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('B');

  // Boot sequence timer
  useEffect(() => {
    systemAudio.playSystemBoot();
    const timers = [
      setTimeout(() => setBootStep(1), 1200), // SYSTEM INITIALIZATION
      setTimeout(() => setBootStep(2), 2600), // USER IDENTIFIED: ARAVIND
      setTimeout(() => setBootStep(3), 4000), // SYSTEM ONLINE / WELCOME
      setTimeout(() => setBootStep(4), 5400), // CONFIG FORM
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const availableSkills = [
    'Programming & Software Eng',
    'DSA',
    'Artificial Intelligence',
    'Mathematics & Logic',
    'Problem Solving',
    'Communication',
    'Leadership',
    'Public Speaking',
    'System Architecture',
    'Physical Athletics',
  ];

  const toggleSkill = (skill: string) => {
    systemAudio.playClick();
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFinish = () => {
    systemAudio.playLevelUp();
    completeOnboarding({
      primaryGoal,
      skills: selectedSkills,
      dailyHours,
      difficulty,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060709] text-slate-100 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background Matrix Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

      <div className="relative w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.8)] p-6 sm:p-10 my-8">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-6">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span>ARAVIND SYSTEM BOOT PROTOCOL</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">ID: ARAVIND-001</span>
        </div>

        {/* Phase 1-3: Boot Cinematic Stream */}
        {bootStep < 4 && (
          <div className="min-h-[260px] flex flex-col items-center justify-center text-center space-y-6 py-8 font-mono">
            <div className="relative flex items-center justify-center w-20 h-20 rounded bg-cyan-500/10 border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-3">
              {bootStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-cyan-300/80 tracking-widest uppercase"
                >
                  &gt; SYSTEM INITIALIZATION... Initializing ARAVIND SYSTEM...
                </motion.div>
              )}

              {bootStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl sm:text-3xl font-light text-white tracking-tight"
                >
                  &gt; USER IDENTIFIED: <span className="text-cyan-400 font-semibold">ARAVIND</span>
                </motion.div>
              )}

              {bootStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 pt-2"
                >
                  <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded">
                    SYSTEM ONLINE
                  </div>
                  <p className="text-base text-slate-300 font-sans">
                    Welcome, <span className="text-cyan-400 font-bold font-mono">ARAVIND</span>. Your journey begins now.
                  </p>
                </motion.div>
              )}
            </div>

            <button
              onClick={() => setBootStep(4)}
              className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono underline cursor-pointer"
            >
              [Skip Boot Animation]
            </button>
          </div>
        )}

        {/* Phase 4: Initial Configuration Calibration Form */}
        {bootStep >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 font-sans"
          >
            <div>
              <h2 className="text-xl font-light font-mono text-white tracking-tight uppercase flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                SYSTEM CALIBRATION FOR <span className="text-cyan-400 font-semibold">ARAVIND</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Configure your baseline parameters to initialize the progression engine.
              </p>
            </div>

            {/* Field 1: Primary Goal */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                1. PRIMARY ASCENSION GOAL
              </label>
              <textarea
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 text-sm font-mono placeholder-slate-600 focus:outline-none transition-colors"
                placeholder="e.g. Master algorithms, build scalable software, maintain top physical fitness."
              />
            </div>

            {/* Field 2: Target Focus Skills */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                2. CORE FOCUS SKILLS
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.15)] font-semibold'
                          : 'bg-black/40 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 3: Daily Available Hours & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  DAILY WORK CAPACITY
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={2}
                    max={14}
                    step={1}
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-black/60 px-2.5 py-1 rounded border border-slate-800">
                    {dailyHours} Hours/Day
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  QUEST DIFFICULTY
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['E', 'D', 'C', 'B'] as QuestDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => {
                        systemAudio.playClick();
                        setDifficulty(diff);
                      }}
                      className={`py-1.5 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                        difficulty === diff
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                          : 'bg-black/40 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Tier {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-4 border-t border-slate-800/60">
              <button
                onClick={handleFinish}
                className="w-full py-3.5 px-6 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-all cursor-pointer uppercase"
              >
                <span>GENERATE ARAVIND SYSTEM PROFILE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
