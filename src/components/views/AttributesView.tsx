import React, { useState } from 'react';
import {
  BarChart3,
  Plus,
  Zap,
  TrendingUp,
  Award,
  Dumbbell,
  Brain,
  ShieldCheck,
  Eye,
  Lightbulb,
  MessageSquare,
  Crown,
  BookOpen,
  Flame,
  X,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { CharacterAttribute } from '../../types';
import { systemAudio } from '../../utils/audio';

export const AttributesView: React.FC = () => {
  const { attributes, updateAttributeScore, addAttribute } = useSystem();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [trainingAttr, setTrainingAttr] = useState<CharacterAttribute | null>(null);
  const [trainDelta, setTrainDelta] = useState<number>(3);
  const [trainNotes, setTrainNotes] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  // Custom attribute form
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrDesc, setNewAttrDesc] = useState('');
  const [newAttrCategory, setNewAttrCategory] = useState<CharacterAttribute['category']>('MENTAL');

  const categories = ['ALL', 'MENTAL', 'PHYSICAL', 'TACTICAL', 'SOCIAL', 'CREATIVE'];

  const filteredAttributes = attributes.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  const getAttributeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-rose-400" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-indigo-400" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-teal-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      default:
        return <Zap className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleTrainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingAttr) return;

    systemAudio.playAttributeUpgrade();
    updateAttributeScore(trainingAttr.id, Number(trainDelta), trainNotes || 'Attribute practice session');
    setTrainingAttr(null);
    setTrainNotes('');
    setTrainDelta(3);
  };

  const handleCreateCustomAttr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttrName.trim()) return;

    addAttribute({
      name: newAttrName.trim(),
      description: newAttrDesc.trim() || 'Custom attribute calibrated by ARAVIND.',
      category: newAttrCategory,
      score: 10,
      maxScore: 100,
      level: 1,
      icon: 'Zap',
    });

    setNewAttrName('');
    setNewAttrDesc('');
    setIsCreateOpen(false);
  };

  const totalAttributeScore = attributes.reduce((sum, a) => sum + a.score, 0);
  const averageAttributeLevel = (
    attributes.reduce((sum, a) => sum + a.level, 0) / attributes.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <BarChart3 className="w-4 h-4" />
            <span>CHARACTER ATTRIBUTES MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">PROGRESSION METRICS</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Every real-world action feeds directly into your core psychological and physiological attribute vectors.
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
          <span>ADD ATTRIBUTE</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">TOTAL ATTRIBUTE POINTS</span>
            <div className="text-xl font-bold text-cyan-400 mt-0.5">
              {totalAttributeScore} <span className="text-xs text-slate-400 font-normal">PTS</span>
            </div>
          </div>
          <Zap className="w-7 h-7 text-cyan-400 opacity-50" />
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">AVERAGE STAT LEVEL</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              LVL {averageAttributeLevel}
            </div>
          </div>
          <Award className="w-7 h-7 text-emerald-400 opacity-50" />
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">TRACKED VECTORS</span>
            <div className="text-xl font-bold text-indigo-400 mt-0.5">
              {attributes.length} ACTIVE
            </div>
          </div>
          <BarChart3 className="w-7 h-7 text-indigo-400 opacity-50" />
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

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAttributes.map((attr) => {
          const scorePercent = Math.min(100, Math.round((attr.score / attr.maxScore) * 100));

          return (
            <div
              key={attr.id}
              className="p-5 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded bg-black/40 border border-slate-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      {getAttributeIcon(attr.icon)}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold font-mono text-white">
                        {attr.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        CATEGORY // {attr.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      LVL {attr.level}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed min-h-[36px]">
                  {attr.description}
                </p>
              </div>

              {/* Progress Bar & Training CTA */}
              <div className="space-y-3 font-mono pt-2 border-t border-slate-800/60">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 uppercase text-[10px] tracking-wider">SCORE CALIBRATION</span>
                    <span className="font-bold text-slate-200">
                      {attr.score} / {attr.maxScore} <span className="text-[10px] text-cyan-400">({scorePercent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    systemAudio.playClick();
                    setTrainingAttr(attr);
                  }}
                  className="w-full py-2 rounded bg-black/40 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LOG PRACTICE / TRAIN STAT</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Train / Calibrate Modal */}
      {trainingAttr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                CALIBRATE: {trainingAttr.name}
              </h3>
              <button
                onClick={() => setTrainingAttr(null)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTrainSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">SCORE INCREMENT (+POINTS)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={trainDelta}
                    onChange={(e) => setTrainDelta(Number(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-emerald-400 bg-black/60 px-3 py-1 rounded border border-slate-800">
                    +{trainDelta} PTS
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">EXECUTION LOG / REFLECTION</label>
                <textarea
                  rows={2}
                  value={trainNotes}
                  onChange={(e) => setTrainNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
                  placeholder="e.g. Read 40 pages of distributed systems, deep focus without phone."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTrainingAttr(null)}
                  className="px-4 py-2 rounded bg-slate-900 text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  INJECT SCORE GAIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Attribute Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" />
                CREATE CUSTOM ATTRIBUTE VECTOR
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomAttr} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">ATTRIBUTE NAME</label>
                <input
                  type="text"
                  required
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  placeholder="e.g. Algorithmic Intuition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={newAttrDesc}
                  onChange={(e) => setNewAttrDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
                  placeholder="What does this stat measure for ARAVIND?"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">CORE DOMAIN</label>
                <select
                  value={newAttrCategory}
                  onChange={(e) => setNewAttrCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                >
                  <option value="MENTAL">MENTAL</option>
                  <option value="PHYSICAL">PHYSICAL</option>
                  <option value="TACTICAL">TACTICAL</option>
                  <option value="SOCIAL">SOCIAL</option>
                  <option value="CREATIVE">CREATIVE</option>
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
                  CALIBRATE NEW VECTOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
