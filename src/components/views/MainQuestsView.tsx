import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckSquare,
  Sparkles,
  Trophy,
  Trash2,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { systemAudio } from '../../utils/audio';

export const MainQuestsView: React.FC = () => {
  const {
    mainQuests,
    toggleMainQuestObjective,
    addMainQuest,
    deleteMainQuest,
    attributes,
  } = useSystem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Intellect & Mastery');
  const [xpReward, setXpReward] = useState(3000);
  const [selectedAttrId, setSelectedAttrId] = useState(attributes[0]?.id || 'attr-intelligence');
  const [attrDelta, setAttrDelta] = useState(10);
  const [objectivesList, setObjectivesList] = useState<string[]>([
    'Master foundational core literature',
    'Build & deploy production architecture',
    'Publish comprehensive technical report',
  ]);
  const [newObjInput, setNewObjInput] = useState('');

  const addObjectiveToForm = () => {
    if (!newObjInput.trim()) return;
    setObjectivesList([...objectivesList, newObjInput.trim()]);
    setNewObjInput('');
  };

  const removeObjectiveFromForm = (idx: number) => {
    setObjectivesList(objectivesList.filter((_, i) => i !== idx));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || objectivesList.length === 0) return;

    const targetAttr = attributes.find((a) => a.id === selectedAttrId) || attributes[0];

    addMainQuest({
      title: title.toUpperCase(),
      description,
      category,
      xpReward: Number(xpReward),
      attributeRewards: [
        {
          attributeId: targetAttr.id,
          attributeName: targetAttr.name,
          delta: Number(attrDelta),
        },
      ],
      objectives: objectivesList.map((text, idx) => ({
        id: `obj-new-${Date.now()}-${idx}`,
        text,
        completed: false,
        xpBonus: Math.round(Number(xpReward) / (objectivesList.length * 2)),
      })),
    });

    setTitle('');
    setDescription('');
    setXpReward(3000);
    setObjectivesList(['Complete stage 1 milestone', 'Complete stage 2 milestone']);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <Target className="w-4 h-4" />
            <span>MAIN QUEST CAMPAIGNS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">LONG-TERM ROADMAPS</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Transform macro life ambitions into structured RPG milestones with multi-stage objective tracks.
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
          <span>NEW MAIN QUEST</span>
        </button>
      </div>

      {/* Main Quests List */}
      <div className="space-y-6">
        {mainQuests.map((quest) => {
          const completedObjs = quest.objectives.filter((o) => o.completed).length;
          const totalObjs = quest.objectives.length;

          return (
            <div
              key={quest.id}
              className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                quest.status === 'COMPLETED'
                  ? 'bg-slate-900/40 backdrop-blur-xl border-emerald-500/40'
                  : 'bg-slate-900/40 backdrop-blur-xl border-slate-800/80'
              }`}
            >
              {/* Campaign Header */}
              <div className="p-5 sm:p-6 border-b border-slate-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {quest.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        quest.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-black/40 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {quest.status === 'COMPLETED' ? '✓ CAMPAIGN CONQUERED' : 'IN PROGRESS'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-light font-mono tracking-wide text-white">
                    {quest.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-3xl leading-relaxed">
                    {quest.description}
                  </p>
                </div>

                <div className="flex flex-col lg:items-end gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">PROGRESS MATRIX</div>
                    <div className="text-2xl font-bold font-mono text-cyan-400">
                      {quest.progressPercent}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-black/40 text-amber-300 border border-amber-500/30">
                      +{quest.xpReward} XP TOTAL
                    </span>
                    <button
                      onClick={() => deleteMainQuest(quest.id)}
                      title="Delete Main Quest"
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-5 sm:px-6 pt-4 pb-2">
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      quest.status === 'COMPLETED'
                        ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                        : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                    }`}
                    style={{ width: `${quest.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-1.5">
                  <span>{completedObjs} of {totalObjs} Objectives Executed</span>
                  <span>
                    {quest.attributeRewards.map((a) => `${a.attributeName.toUpperCase()} +${a.delta}`).join(' • ')}
                  </span>
                </div>
              </div>

              {/* Objectives Checklist */}
              <div className="p-5 sm:p-6 space-y-2.5">
                <div className="text-xs font-mono font-bold text-slate-400 tracking-wider mb-2 uppercase">
                  STRATEGIC OBJECTIVES:
                </div>

                {quest.objectives.map((obj) => (
                  <div
                    key={obj.id}
                    onClick={() => toggleMainQuestObjective(quest.id, obj.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer font-mono flex items-center justify-between gap-3 text-xs ${
                      obj.completed
                        ? 'bg-black/20 border-slate-900 text-slate-500 line-through'
                        : 'bg-black/40 border-slate-800/80 hover:border-cyan-500/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                          obj.completed
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 text-[10px]'
                            : 'border-slate-700 bg-black/40'
                        }`}
                      >
                        {obj.completed && '✓'}
                      </div>
                      <span className={obj.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {obj.text}
                      </span>
                    </div>

                    {obj.xpBonus && (
                      <span className="text-[10px] text-cyan-400 font-bold shrink-0">
                        +{obj.xpBonus} XP
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0a0a0c] border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 font-mono text-xs my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" />
                FORGE NEW MAIN QUEST ROADMAP
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
                <label className="text-slate-300 font-bold uppercase">CAMPAIGN TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  placeholder="e.g. BECOME AN APEX DISTRIBUTED SYSTEMS ARCHITECT"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">VISION & SCOPE</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
                  placeholder="High-level definition of what full conquest entails."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">TOTAL XP PAYOUT</label>
                  <input
                    type="number"
                    min={500}
                    max={20000}
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-cyan-400 font-bold focus:outline-none"
                  />
                </div>

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
              </div>

              {/* Sub-objectives builder */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-slate-300 font-bold uppercase">
                  SUB-OBJECTIVES ({objectivesList.length})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newObjInput}
                    onChange={(e) => setNewObjInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addObjectiveToForm();
                      }
                    }}
                    placeholder="Add specific objective and press enter"
                    className="flex-1 px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addObjectiveToForm}
                    className="px-3 py-2 rounded bg-slate-900 text-cyan-400 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {objectivesList.map((objText, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-black/40 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <span className="text-slate-300 truncate">{objText}</span>
                      <button
                        type="button"
                        onClick={() => removeObjectiveFromForm(idx)}
                        className="text-slate-500 hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
                  INITIALIZE MAIN QUEST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
