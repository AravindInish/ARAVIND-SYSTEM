import React from 'react';
import {
  Shield,
  Volume2,
  VolumeX,
  Bell,
  Zap,
  Flame,
  Activity,
  User,
  LogOut,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { getRankFromLevel } from '../../utils/progression';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const SystemNavbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const { profile, toggleSound, notifications, logout } = useSystem();
  const rankInfo = getRankFromLevel(profile.level);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-slate-800/50 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & System Moniker */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <span className="text-cyan-400 font-bold font-mono text-lg">A</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-cyan-500 font-semibold uppercase">
                SYSTEM INTERFACE v4.0.2
              </span>
              <span className="inline-block px-1.5 py-0.2 text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                LIVE
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-light tracking-tight text-white font-mono flex items-center gap-1.5 uppercase">
              <span>ARAVIND</span>
              <span className="text-slate-500">SYSTEM</span>
            </h1>
          </div>
        </div>

        {/* Live HUD Telemetry (Desktop) */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded border border-slate-800/60">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-500 text-[10px] uppercase">STREAK:</span>
            <span className="text-amber-400 font-bold">{profile.dailyStreak}D</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded border border-slate-800/60">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-500 text-[10px] uppercase">HP:</span>
            <span className="text-emerald-400 font-bold">{profile.hp}%</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded border border-slate-800/60">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-500 text-[10px] uppercase">ENERGY:</span>
            <span className="text-cyan-400 font-bold">{profile.energy}%</span>
          </div>

          <div className="text-[10px] font-mono text-cyan-400/90 pl-2">
            STATUS: <span className="animate-pulse text-cyan-400 font-bold">OPTIMIZED</span>
          </div>
        </div>

        {/* Actions & Profile Pill */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={profile.soundEnabled ? 'Mute System Audio' : 'Unmute System Audio'}
            className="p-2 rounded-lg bg-black/40 border border-slate-800/80 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            title="System Telemetry & Alerts"
            className="relative p-2 rounded-lg bg-black/40 border border-slate-800/80 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] text-[9px] font-bold font-mono text-slate-950 bg-cyan-400 rounded-full px-1 shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Rank Chip */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800/60">
            <div className="flex flex-col items-end text-right">
              <span className="text-xs font-bold font-mono text-slate-200 tracking-wider">
                ARAVIND
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-medium text-cyan-400">
                  LVL {profile.level}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold border ${rankInfo.borderGlow} ${rankInfo.color} bg-black/60`}>
                  RANK {rankInfo.rank}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
