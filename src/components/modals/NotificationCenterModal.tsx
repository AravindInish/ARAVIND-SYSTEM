import React from 'react';
import { X, Bell, Trash2, CheckCircle2, AlertTriangle, Sparkles, Flame, Shield, Gift } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useSystem();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'LEVEL_UP':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'QUEST_COMPLETE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'ACHIEVEMENT_UNLOCKED':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'STREAK_RECORD':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'REWARD_UNLOCKED':
        return <Gift className="w-4 h-4 text-pink-400" />;
      case 'SYSTEM_WARNING':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Shield className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0a0a0c] border border-slate-800/80 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold font-mono text-white tracking-wider uppercase">
                SYSTEM TELEMETRY LOGS
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Live transmissions for ARAVIND
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                title="Clear Logs"
                className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              <Shield className="w-8 h-8 mx-auto mb-2 opacity-30 text-cyan-400" />
              NO LOGS DETECTED. ALL SYSTEM CHANNELS CLEAR.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3 rounded border transition-all cursor-pointer font-mono text-xs ${
                  notif.read
                    ? 'bg-black/30 border-slate-800/40 text-slate-500'
                    : 'bg-slate-900/50 border-cyan-900/50 text-slate-200 shadow-[0_0_10px_rgba(34,211,238,0.05)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 font-semibold">
                    {getIcon(notif.type)}
                    <span className="tracking-wide text-slate-200 uppercase">
                      {notif.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-6 font-sans">
                  {notif.message}
                </p>

                {notif.xpDelta && (
                  <div className="mt-2 pl-6 flex items-center gap-2">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      +{notif.xpDelta} XP
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/40 border-t border-slate-800/60 text-center text-[10px] font-mono text-slate-500">
          SYSTEM IDENTIFIER: ARAVIND-CORE-9000 // AES-256 ENCRYPTED
        </div>
      </div>
    </div>
  );
};
