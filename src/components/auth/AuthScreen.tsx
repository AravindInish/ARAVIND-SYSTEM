import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { systemAudio } from '../../utils/audio';

export const AuthScreen: React.FC = () => {
  const { login, loginWithGoogle } = useSystem();
  const [email, setEmail] = useState('aravind@system.core');
  const [password, setPassword] = useState('••••••••••••');
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'ARAVIND');
  };

  const handleInstantAravindLogin = () => {
    systemAudio.playSystemBoot();
    login('aravind@system.core', 'ARAVIND');
  };

  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow & scanline */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

      <div className="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-8">
        {/* System Emblem */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded bg-cyan-500/10 border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
            <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
              SECURE SYSTEM ACCESS GATE
            </div>
            <h1 className="text-2xl font-light font-mono tracking-tight text-white uppercase mt-1">
              ARAVIND <span className="text-slate-500">SYSTEM</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Biometric & Telemetry Synchronization
            </p>
          </div>
        </div>

        {/* Quick Instant Pass for ARAVIND */}
        <div className="mb-6 p-4 rounded bg-black/40 border border-cyan-500/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-mono font-bold text-slate-200 uppercase">
                  ARAVIND MASTER ACCESS
                </div>
                <div className="text-[10px] font-mono text-cyan-300">
                  Direct Biometric Authorization
                </div>
              </div>
            </div>
            <button
              onClick={handleInstantAravindLogin}
              className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)] cursor-pointer uppercase"
            >
              INITIALIZE
            </button>
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            OR AUTHENTICATE VIA
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold tracking-wider uppercase">
              OPERATOR IDENTIFIER (EMAIL)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
                placeholder="aravind@system.core"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold tracking-wider uppercase">
              ACCESS CIPHER (PASSWORD)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 text-cyan-300 font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer mt-2 uppercase"
          >
            <span>{mode === 'LOGIN' ? 'AUTHENTICATE PROTOCOL' : 'REGISTER OPERATOR'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google Auth Button */}
        <div className="mt-4">
          <button
            onClick={loginWithGoogle}
            className="w-full py-2.5 rounded bg-black/40 hover:bg-slate-900/60 border border-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span>Continue with Google Identity</span>
          </button>
        </div>

        {/* Switch Mode */}
        <div className="mt-6 text-center text-[11px] font-mono text-slate-400">
          {mode === 'LOGIN' ? (
            <span>
              New hunter to the System?{' '}
              <button
                onClick={() => setMode('SIGNUP')}
                className="text-cyan-400 hover:underline font-bold cursor-pointer"
              >
                Register Identity
              </button>
            </span>
          ) : (
            <span>
              Already identified?{' '}
              <button
                onClick={() => setMode('LOGIN')}
                className="text-cyan-400 hover:underline font-bold cursor-pointer"
              >
                Enter System
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
