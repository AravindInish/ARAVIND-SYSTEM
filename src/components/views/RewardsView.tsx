import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Zap,
  Sparkles,
  CheckCircle2,
  Lock,
  Trash2,
  X,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { PersonalReward } from '../../types';
import { systemAudio } from '../../utils/audio';

export const RewardsView: React.FC = () => {
  const { profile, rewards, redeemReward, addReward, deleteReward } = useSystem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [costXp, setCostXp] = useState(1000);
  const [category, setCategory] = useState<string>('ENTERTAINMENT');

  const handleRedeem = (reward: PersonalReward) => {
    if (profile.xp < reward.costXp) return;
    redeemReward(reward.id);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReward({
      title: title.trim(),
      description: description.trim() || 'Custom real-life bounty unlocked by ARAVIND.',
      costXp: Number(costXp),
      category,
      icon: 'Gift',
    });

    setTitle('');
    setDescription('');
    setCostXp(1000);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <Gift className="w-4 h-4" />
            <span>SYSTEM REWARD EXCHANGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">XP REDEMPTION VAULT</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Convert accumulated hard-earned XP into guilt-free real-world rewards and rest milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded bg-black/40 border border-slate-800/60 font-mono text-xs text-right">
            <div className="text-slate-500 uppercase tracking-widest text-[10px]">AVAILABLE XP BALANCE</div>
            <div className="text-base font-bold text-cyan-400">
              {profile.xp.toLocaleString()} XP
            </div>
          </div>

          <button
            onClick={() => {
              systemAudio.playClick();
              setIsCreateOpen(true);
            }}
            className="px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all cursor-pointer shrink-0 uppercase"
          >
            <Plus className="w-4 h-4" />
            <span>ADD REWARD</span>
          </button>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {rewards.map((reward) => {
          const canAfford = profile.xp >= reward.costXp;
          const isClaimed = reward.isUnlocked;

          return (
            <div
              key={reward.id}
              className={`p-5 rounded-lg border transition-all duration-200 flex flex-col justify-between space-y-4 backdrop-blur-xl ${
                isClaimed
                  ? 'bg-black/40 border-slate-800/60 text-slate-500 opacity-60'
                  : canAfford
                  ? 'bg-slate-900/40 border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.08)]'
                  : 'bg-black/40 border-slate-800/60 text-slate-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded border flex items-center justify-center ${
                        isClaimed
                          ? 'bg-black/60 border-slate-800 text-slate-600'
                          : canAfford
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-black/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-white">
                        {reward.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {reward.category}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-black/60 text-cyan-400 border border-slate-800 shrink-0">
                    {reward.costXp.toLocaleString()} XP
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed min-h-[36px]">
                  {reward.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                {isClaimed ? (
                  <div className="flex-1 flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs py-2 bg-black/40 border border-slate-800 rounded">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CLAIMED ({reward.redeemedCount}x)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`flex-1 py-2.5 rounded font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer uppercase ${
                      canAfford
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                        : 'bg-slate-900/60 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>CLAIM BOUNTY (-{reward.costXp} XP)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>NEED {reward.costXp - profile.xp} MORE XP</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => deleteReward(reward.id)}
                  className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Reward Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" />
                CREATE REAL-LIFE BOUNTY
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
                <label className="text-slate-300 font-bold uppercase">REWARD TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  placeholder="e.g. Weekend Sci-Fi Movie Marathon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">XP COST</label>
                  <input
                    type="number"
                    min={100}
                    max={50000}
                    value={costXp}
                    onChange={(e) => setCostXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-cyan-400 font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  >
                    <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                    <option value="EXPERIENCE">EXPERIENCE</option>
                    <option value="PURCHASE">PURCHASE</option>
                    <option value="REST">REST</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">DESCRIPTION / CRITERIA</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
                  placeholder="e.g. 2 hours of movie time after completing all Tier A Daily Quests."
                />
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
                  LOCK REWARD INTO STORE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
