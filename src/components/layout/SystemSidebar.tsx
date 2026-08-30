import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  BarChart3,
  BookOpen,
  Trophy,
  Package,
  Gift,
  Bot,
  Settings,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { ActiveNavTab } from '../../types';
import { systemAudio } from '../../utils/audio';

interface NavItem {
  id: ActiveNavTab;
  label: string;
  subLabel?: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const SystemSidebar: React.FC = () => {
  const { currentTab, setCurrentTab, dailyQuests, achievements, rewards, profile } = useSystem();

  const pendingQuestsCount = dailyQuests.filter((q) => !q.completed).length;
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'System Status',
      subLabel: 'Overview & HUD',
      icon: LayoutDashboard,
    },
    {
      id: 'quests',
      label: 'Daily Quests',
      subLabel: 'Habits & Protocols',
      icon: CheckSquare,
      badge: pendingQuestsCount > 0 ? pendingQuestsCount : undefined,
    },
    {
      id: 'mainQuests',
      label: 'Main Quests',
      subLabel: 'Long-term Campaigns',
      icon: Target,
    },
    {
      id: 'attributes',
      label: 'Stats & Attributes',
      subLabel: 'RPG Attribute Matrix',
      icon: BarChart3,
    },
    {
      id: 'skills',
      label: 'Skills Matrix',
      subLabel: 'Tech & Intellect Trees',
      icon: BookOpen,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      subLabel: 'Trophies & Milestones',
      icon: Trophy,
      badge: `${unlockedAchievementsCount}/${achievements.length}`,
    },
    {
      id: 'inventory',
      label: 'Inventory Vault',
      subLabel: 'Certs, Projects & Items',
      icon: Package,
    },
    {
      id: 'rewards',
      label: 'Rewards Store',
      subLabel: 'XP Redemption Milestones',
      icon: Gift,
    },
    {
      id: 'aiSystem',
      label: 'AI System Guide',
      subLabel: 'Sentient Tactical Counsel',
      icon: Bot,
    },
    {
      id: 'settings',
      label: 'System Settings',
      subLabel: 'Data & Calibration',
      icon: Settings,
    },
  ];

  const handleSelectTab = (tabId: ActiveNavTab) => {
    systemAudio.playClick();
    setCurrentTab(tabId);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-black/40 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-slate-800/50 flex flex-col lg:justify-between p-2 lg:p-4">
      {/* Navigation List */}
      <div className="space-y-1 w-full">
        <div className="px-3 py-1.5 hidden lg:block">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            SYSTEM DIRECTIVES
          </span>
        </div>

        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible py-1 lg:py-0 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`group relative flex items-center justify-between shrink-0 lg:shrink lg:w-full px-3 py-2 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900/80 text-white border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-slate-800/40 lg:border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-black/40 text-slate-400 border border-slate-800/60 group-hover:text-slate-200 group-hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-medium tracking-wide whitespace-nowrap">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans hidden lg:block">
                      {item.subLabel}
                    </div>
                  </div>
                </div>

                {/* Badge or chevron */}
                {item.badge !== undefined ? (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-medium ml-2 shrink-0 ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 hidden lg:block shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footnote */}
      <div className="hidden lg:block pt-4 mt-4 border-t border-slate-800/50">
        <div className="p-3 rounded-lg bg-black/40 border border-slate-800/60 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="uppercase tracking-widest text-slate-500">CORE PROTOCOL</span>
            <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OPTIMIZED
            </span>
          </div>
          <div className="text-[11px] text-slate-300 line-clamp-2">
            Target: {profile.primaryGoal || 'Polymathic Self-Mastery & Peak Engineering'}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/40">
            <span>OPERATOR: ARAVIND</span>
            <span className="text-cyan-400 font-bold">RANK: {profile.rank}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
