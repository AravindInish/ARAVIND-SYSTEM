import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Flame,
  Sparkles,
  Clock,
  Trash2,
  Bot,
  Zap,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { QuestDifficulty } from '../../types';
import { systemAudio } from '../../utils/audio';

export const DailyQuestsView: React.FC = () => {
  const {
    dailyQuests,
    toggleDailyQuest,
    addDailyQuest,
    deleteDailyQuest,
    attributes,
    acceptAiQuest,
    aiAnalysis,
  } = useSystem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(50);
  const [selectedAttrId, setSelectedAttrId] = useState(attributes[0]?.id || 'attr-discipline');
  const [attrDelta, setAttrDelta] = useState(1);
  const [category, setCategory] = useState('Personal Growth');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('C');
  const [dueTime, setDueTime] = useState('');

  const completedCount = dailyQuests.filter((q) => q.completed).length;
  const totalXpAvailable = dailyQuests.reduce((sum, q) => sum + q.xpReward, 0);
  const earnedXpToday = dailyQuests
    .filter((q) => q.completed)
    .reduce((sum, q) => sum + q.xpReward, 0);

  const filteredQuests = dailyQuests.filter((q) => {
    if (filter === 'ACTIVE') return !q.completed;
    if (filter === 'COMPLETED') return q.completed;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetAttr = attributes.find((a) => a.id === selectedAttrId) || attributes[0];

    addDailyQuest({
      title,
      description,
      xpReward: Number(xpReward),
      attributeRewards: [
        {
          attributeId: targetAttr.id,
          attributeName: targetAttr.name,
          delta: Number(attrDelta),
        },
      ],
      category,
      difficulty,
      dueTime: dueTime || undefined,
    });

    setTitle('');
    setDescription('');
    setXpReward(50);
    setDueTime('');
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <CheckSquare className="w-4 h-4" />
            <span>DAILY QUEST DIRECTIVES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">HABITS & EXECUTION MATRIX</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Completing daily directives increments your core attributes and unlocks rank progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              systemAudio.playClick();
              setIsCreateOpen(true);
            }}
            className="px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all cursor-pointer uppercase"
          >
            <Plus className="w-4 h-4" />
            <span>NEW DAILY QUEST</span>
          </button>
        </div>
      </div>

      {/* Daily Stats Telemetry Pill */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">QUEST CLEARANCE</span>
            <div className="text-lg font-bold text-cyan-400">
              {completedCount} / {dailyQuests.length} <span className="text-xs text-slate-400 font-normal">CLEARED</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 bg-cyan-500/5">
            {dailyQuests.length > 0
              ? `${Math.round((completedCount / dailyQuests.length) * 100)}%`
              : '0%'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">DAILY XP YIELD</span>
            <div className="text-lg font-bold text-emerald-400">
              +{earnedXpToday} <span className="text-xs text-slate-400 font-normal">/ +{totalXpAvailable} XP</span>
            </div>
          </div>
          <Zap className="w-7 h-7 text-emerald-400 opacity-60" />
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">RESET PROTOCOL</span>
            <div className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> MIDNIGHT 00:00
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">AUTO-CYCLE</span>
        </div>
      </div>

      {/* AI Recommended Quests Quick Shelf */}
      {aiAnalysis && aiAnalysis.recommendedQuests?.length > 0 && (
        <div className="p-5 rounded-lg bg-cyan-500/5 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
            <Bot className="w-4 h-4 animate-pulse" />
            <span>AI SYSTEM RECOMMENDED QUESTS FOR TODAY</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiAnalysis.recommendedQuests.map((recQuest, index) => (
              <div
                key={index}
                className="p-3.5 rounded bg-black/40 border border-slate-800 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-100">{recQuest.title}</span>
                    <span className="text-cyan-400 font-bold">+{recQuest.xpReward} XP</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 mt-1">
                    {recQuest.description}
                  </p>
                  <div className="text-[10px] font-mono text-cyan-300/80 mt-1">
                    Reason: {recQuest.aiReason}
                  </div>
                </div>
                <button
                  onClick={() => acceptAiQuest(recQuest)}
                  className="w-full py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono font-bold transition-all cursor-pointer uppercase"
                >
                  + ACCEPT AI QUEST
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              systemAudio.playClick();
              setFilter(mode);
            }}
            className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
              filter === mode
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/50 font-bold shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                : 'bg-black/40 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {mode} ({mode === 'ALL' ? dailyQuests.length : mode === 'ACTIVE' ? dailyQuests.length - completedCount : completedCount})
          </button>
        ))}
      </div>

      {/* Quests List */}
      <div className="space-y-3 font-mono">
        {filteredQuests.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs rounded-lg bg-black/40 border border-slate-800/60">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30 text-cyan-400" />
            NO QUESTS MATCH THE ACTIVE FILTER.
          </div>
        ) : (
          filteredQuests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 sm:p-5 rounded-lg border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                quest.completed
                  ? 'bg-black/20 border-slate-800/60 text-slate-500 opacity-60'
                  : 'bg-slate-900/40 backdrop-blur-xl border-slate-800/80 hover:border-cyan-500/50 text-slate-100'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Custom Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleDailyQuest(quest.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 mt-0.5 ${
                    quest.completed
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 text-[10px]'
                      : 'border-cyan-500/50 bg-black/40 hover:border-cyan-400'
                  }`}
                >
                  {quest.completed && '✓'}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-semibold tracking-wide ${
                        quest.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {quest.title}
                    </span>
                    {quest.isAiGenerated && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        AI DIRECTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {quest.description}
                  </p>

                  {/* Attribute Rewards Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-cyan-400">
                      +{quest.xpReward} XP
                    </span>
                    {quest.attributeRewards.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/40 text-emerald-300 border border-emerald-500/30"
                      >
                        {r.attributeName.toUpperCase()} +{r.delta}
                      </span>
                    ))}
                    {quest.dueTime && (
                      <span className="px-2 py-0.5 rounded text-[10px] text-slate-400 bg-black/40 border border-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Due {quest.dueTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-black/40 text-slate-400 border border-slate-800">
                  TIER {quest.difficulty}
                </span>
                <button
                  onClick={() => deleteDailyQuest(quest.id)}
                  title="Delete Quest"
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0a0a0c] border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" />
                REGISTER NEW DAILY DIRECTIVE
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">QUEST TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  placeholder="e.g. Study 30m Systems Architecture"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">DESCRIPTION / CRITERIA</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
                  placeholder="Execution guidelines and specific output target."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">XP REWARD</label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-cyan-400 font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">DIFFICULTY</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  >
                    <option value="E">Tier E (Novice)</option>
                    <option value="D">Tier D (Apprentice)</option>
                    <option value="C">Tier C (Adept)</option>
                    <option value="B">Tier B (Elite)</option>
                    <option value="A">Tier A (Master)</option>
                    <option value="S">Tier S (Monolith)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">PRIMARY ATTRIBUTE</label>
                  <select
                    value={selectedAttrId}
                    onChange={(e) => setSelectedAttrId(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  >
                    {attributes.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">ATTRIBUTE BOOST</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={attrDelta}
                    onChange={(e) => setAttrDelta(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-emerald-400 font-bold focus:outline-none"
                  />
                </div>
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
                  LOCK QUEST INTO MATRIX
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
