/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { SystemNavbar } from './components/layout/SystemNavbar';
import { SystemSidebar } from './components/layout/SystemSidebar';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { NotificationCenterModal } from './components/modals/NotificationCenterModal';
import { FirstTimeBoot } from './components/onboarding/FirstTimeBoot';
import { AuthScreen } from './components/auth/AuthScreen';
import { DashboardView } from './components/views/DashboardView';
import { DailyQuestsView } from './components/views/DailyQuestsView';
import { MainQuestsView } from './components/views/MainQuestsView';
import { AttributesView } from './components/views/AttributesView';
import { SkillsView } from './components/views/SkillsView';
import { AchievementsView } from './components/views/AchievementsView';
import { InventoryView } from './components/views/InventoryView';
import { RewardsView } from './components/views/RewardsView';
import { AiSystemView } from './components/views/AiSystemView';
import { SettingsView } from './components/views/SettingsView';

const SystemAppContent: React.FC = () => {
  const { authUser, profile, currentTab } = useSystem();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // 1. If not authenticated, show futuristic access gateway
  if (!authUser) {
    return <AuthScreen />;
  }

  // 2. If authenticated but first time boot not completed, show boot onboarding
  if (!profile.systemInitialized) {
    return <FirstTimeBoot />;
  }

  // 3. Render active navigation view
  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'quests':
        return <DailyQuestsView />;
      case 'mainQuests':
        return <MainQuestsView />;
      case 'attributes':
        return <AttributesView />;
      case 'skills':
        return <SkillsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'inventory':
        return <InventoryView />;
      case 'rewards':
        return <RewardsView />;
      case 'aiSystem':
        return <AiSystemView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Top HUD Bar */}
      <SystemNavbar onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main Grid: Sidebar + View Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        <SystemSidebar />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Elegant Dark Terminal Status Bar */}
      <div className="h-9 border-t border-slate-800/40 bg-[#070709] px-6 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-slate-400">OPERATOR: <strong className="text-slate-200">ARAVIND</strong></span>
          <span className="text-slate-700">|</span>
          <span>SYSTEM INTERFACE v4.0.2</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cyan-400/80">STATUS: OPTIMIZED</span>
          <span className="hidden sm:inline text-slate-600">ENCRYPTION: QUANTUM-VERIFIED</span>
        </div>
      </div>

      {/* Level Up Announcement Overlay */}
      <LevelUpModal />

      {/* Telemetry & Notification Center */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SystemProvider>
      <SystemAppContent />
    </SystemProvider>
  );
}
