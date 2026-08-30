import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Zap,
  TrendingUp,
  Clock,
  Award,
  Code,
  X,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { SkillItem } from '../../types';
import { systemAudio } from '../../utils/audio';

export const SkillsView: React.FC = () => {
  const { skills, trainSkill, addSkill } = useSystem();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePracticeSkill, setActivePracticeSkill] = useState<SkillItem | null>(null);
  const [practiceHours, setPracticeHours] = useState<number>(1.5);
  const [practiceNotes, setPracticeNotes] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  // New Skill Form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<string>('TECH');

  const categories = ['ALL', 'TECH', 'INTELLECT', 'COMMUNICATION', 'LEADERSHIP'];

  const filteredSkills = skills.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.category.toUpperCase() === selectedCategory;
  });

  const getRankBadgeClass = (rank: SkillItem['masteryRank']) => {
    switch (rank) {
      case 'Transcendent':
      case 'Grandmaster':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
      case 'Master':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
      case 'Expert':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
      case 'Adept':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/50';
      case 'Apprentice':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePracticeSkill) return;

    systemAudio.playAttributeUpgrade();
    const xpToAdd = Math.round(Number(practiceHours) * 100);
    trainSkill(activePracticeSkill.id, xpToAdd, practiceNotes || 'Dedicated practice session');
    setActivePracticeSkill(null);
    setPracticeNotes('');
    setPracticeHours(1.5);
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: 1,
      xp: 0,
      xpToNext: 500,
      masteryRank: 'Novice',
      description: newSkillDesc.trim() || 'Custom skill mastered by ARAVIND.',
      icon: 'Code',
      relatedQuestsCount: 0,
    });

    setNewSkillName('');
    setNewSkillDesc('');
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>SKILLS & MASTERY MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">DOMAIN TREES</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Log intentional hours to level up programming, algorithmic dominance, intellect, and leadership trees.
          </p>
        </div>

        <button
          onClick={() => {
            systemAudio.playClick();
            setIsCreateOpen(true);
          }}
          className="px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all cursor-pointer shrink-0 uppercase"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW SKILL</span>
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">ACCUMULATED SKILL XP</span>
            <div className="text-xl font-bold text-cyan-400 mt-0.5">
              {skills.reduce((sum, s) => sum + s.xp, 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">XP</span>
            </div>
          </div>
          <Clock className="w-7 h-7 text-cyan-400 opacity-50" />
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">EXPERT+ TIERS</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {skills.filter((s) => ['Expert', 'Master', 'Grandmaster', 'Transcendent'].includes(s.masteryRank)).length} DOMAINS
            </div>
          </div>
          <Award className="w-7 h-7 text-amber-400 opacity-50" />
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">ACTIVE TREES</span>
            <div className="text-xl font-bold text-indigo-400 mt-0.5">
              {skills.length} SPECIALIZATIONS
            </div>
          </div>
          <BookOpen className="w-7 h-7 text-indigo-400 opacity-50" />
        </div>
      </div>

      {/* Category filter */}
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

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const xpPercent = Math.min(100, Math.round((skill.xp / skill.xpToNext) * 100));

          return (
            <div
              key={skill.id}
              className="p-5 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold font-mono text-white">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      DOMAIN // {skill.category}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getRankBadgeClass(
                      skill.masteryRank
                    )}`}
                  >
                    {skill.masteryRank}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed min-h-[36px]">
                  {skill.description}
                </p>
              </div>

              {/* Progress & Actions */}
              <div className="space-y-3 font-mono pt-2 border-t border-slate-800/60">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 uppercase text-[10px] tracking-wider">MASTERY LEVEL {skill.level}</span>
                    <span className="font-bold text-slate-200">
                      {skill.xp} / {skill.xpToNext} XP
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{skill.history.length} Sessions Logged</span>
                    <span>{xpPercent}% TO NEXT LVL</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    systemAudio.playClick();
                    setActivePracticeSkill(skill);
                  }}
                  className="w-full py-2 rounded bg-black/40 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LOG PRACTICE TIME</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Practice Logger Modal */}
      {activePracticeSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                LOG SESSION: {activePracticeSkill.name}
              </h3>
              <button
                onClick={() => setActivePracticeSkill(null)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePracticeSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">DURATION (HOURS)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={practiceHours}
                    onChange={(e) => setPracticeHours(Number(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-cyan-400 bg-black/60 px-3 py-1 rounded border border-slate-800">
                    {practiceHours} Hrs (+{Math.round(practiceHours * 100)} XP)
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">WORK LOG / SYNOPSIS</label>
                <textarea
                  rows={2}
                  value={practiceNotes}
                  onChange={(e) => setPracticeNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
                  placeholder="e.g. Solved 3 Hard LeetCode problems (Graphs & DP), benchmarked complexity."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActivePracticeSkill(null)}
                  className="px-4 py-2 rounded bg-slate-900 text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  INJECT PRACTICE EXP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Skill Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" />
                FORGE NEW SKILL TREE
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">SKILL NAME</label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  placeholder="e.g. Distributed Consensus (Raft/Paxos)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
                  placeholder="Scope and target proficiency."
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">DOMAIN CATEGORY</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                >
                  <option value="TECH">TECH</option>
                  <option value="INTELLECT">INTELLECT</option>
                  <option value="COMMUNICATION">COMMUNICATION</option>
                  <option value="LEADERSHIP">LEADERSHIP</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded bg-slate-900 text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  INITIALIZE TREE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
