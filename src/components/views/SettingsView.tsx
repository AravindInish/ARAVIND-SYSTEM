import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RotateCcw,
  User,
  Save,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { systemAudio } from '../../utils/audio';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    toggleSound,
    resetAllData,
    exportDataJson,
    importDataJson,
  } = useSystem();

  const [userName, setUserName] = useState(profile.name);
  const [primaryGoal, setPrimaryGoal] = useState(profile.primaryGoal || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: userName || 'ARAVIND',
      primaryGoal: primaryGoal,
    });
    systemAudio.playNotification();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importDataJson(content);
          if (success) {
            systemAudio.playNotification();
            alert('SYSTEM RESTORE COMPLETED SUCCESSFULLY FOR ARAVIND.');
          } else {
            alert('Invalid backup schema.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <Settings className="w-4 h-4" />
            <span>SYSTEM CONFIGURATION & CALIBRATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">SYSTEM SETTINGS</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manage audio telemetry, system identity, cryptographic backups, and engine resets.
          </p>
        </div>
      </div>

      {/* Operator Identity Form */}
      <div className="p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4" />
          OPERATOR PROFILE
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase">IDENTIFIER NAME</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase">PRIMARY ASCENSION OBJECTIVE</label>
            <textarea
              rows={2}
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-4 h-4" /> OPERATOR PROFILE SYNCHRONIZED
              </span>
            ) : (
              <span className="text-slate-500">Changes persist directly to System Core</span>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer uppercase"
            >
              <Save className="w-4 h-4" />
              <span>SAVE CONFIGURATION</span>
            </button>
          </div>
        </form>
      </div>

      {/* Audio & Telemetry */}
      <div className="p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          SYSTEM SOUND SYNTHESIZER
        </h3>

        <div className="flex items-center justify-between p-4 rounded bg-black/40 border border-slate-800">
          <div>
            <div className="font-bold text-slate-200">Sci-Fi Web Audio Feedback</div>
            <div className="text-slate-400 text-[11px]">
              Plays synthetic frequencies for level ups, quest completes, and system clicks.
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded font-bold flex items-center gap-2 cursor-pointer transition-all uppercase ${
              profile.soundEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                : 'bg-black/60 text-slate-500 border border-slate-800'
            }`}
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{profile.soundEnabled ? 'ENABLED' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Data Backup & Cloud Portability */}
      <div className="p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4" />
          BACKUP & TELEMETRY MIGRATION
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={exportDataJson}
            className="p-4 rounded bg-black/40 border border-slate-800 hover:border-cyan-500/40 text-left space-y-1 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase">
              <Download className="w-4 h-4" />
              <span>EXPORT JSON SYSTEM SNAPSHOT</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Download complete profile, attributes, quests, and achievements data.
            </div>
          </button>

          <label className="p-4 rounded bg-black/40 border border-slate-800 hover:border-cyan-500/40 text-left space-y-1 cursor-pointer transition-all block">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase">
              <Upload className="w-4 h-4" />
              <span>IMPORT SYSTEM SNAPSHOT</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Restore state from an existing ARAVIND SYSTEM backup JSON file.
            </div>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportBackup}
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Engine Reset */}
      <div className="p-6 rounded-lg bg-red-950/10 border border-red-900/30 space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          SYSTEM CALIBRATION PURGE
        </h3>
        <p className="text-slate-400 font-sans">
          Reset all quests, attributes, XP, and achievements to default baseline. This action is irreversible.
        </p>

        {isResetConfirmOpen ? (
          <div className="p-4 rounded bg-black/60 border border-red-900/60 space-y-3">
            <div className="text-red-300 font-bold">
              WARNING: CONFIRM RE-INITIALIZATION FOR ARAVIND?
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetAllData}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer uppercase"
              >
                CONFIRM PURGE & RESET
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded bg-slate-900 text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded bg-red-950/50 text-red-400 border border-red-800/40 hover:bg-red-900/30 font-bold cursor-pointer transition-all flex items-center gap-2 uppercase"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PURGE SYSTEM AND RE-INITIALIZE</span>
          </button>
        )}
      </div>
    </div>
  );
};
