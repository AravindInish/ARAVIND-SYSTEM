import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Terminal,
  Sparkles,
  Send,
  RefreshCw,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { systemAudio } from '../../utils/audio';

export const AiSystemView: React.FC = () => {
  const {
    aiAnalysis,
    runAiAnalysis,
    isAnalyzingAi,
    acceptAiQuest,
    chatMessages,
    sendAiChatMessage,
    isAiChatTyping,
  } = useSystem();

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiChatTyping]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim() || isAiChatTyping) return;

    systemAudio.playClick();
    setInputQuery('');
    await sendAiChatMessage(textToSend);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <Bot className="w-4 h-4" />
            <span>AI TACTICAL GUIDANCE CORE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">SYSTEM INTELLIGENCE</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous tactical coach analyzing your real-life behavioral telemetry, weaknesses, and rank trajectories.
          </p>
        </div>

        <button
          onClick={runAiAnalysis}
          disabled={isAnalyzingAi}
          className="px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all cursor-pointer shrink-0 disabled:opacity-50 uppercase"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzingAi ? 'animate-spin' : ''}`} />
          <span>{isAnalyzingAi ? 'RUNNING SYSTEM AUDIT...' : 'RE-CALIBRATE AUDIT'}</span>
        </button>
      </div>

      {/* Structured Telemetry Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Tactical Analysis Report */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>ACTIVE TELEMETRY AUDIT</span>
              </div>
              <span className="text-[10px] text-slate-500">OPERATOR: ARAVIND</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">EXECUTIVE SUMMARY</div>
              <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {aiAnalysis?.summary ||
                  'ARAVIND is exhibiting high intellectual momentum. To balance the character tree and secure S-Tier Ascension, intensify physical endurance protocols and daily deep work focus blocks.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded bg-black/40 border border-slate-800/60 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> APEX TRAIT
                </span>
                <div className="text-sm font-semibold text-white">
                  {aiAnalysis?.strongestAttribute || 'Intelligence'}
                </div>
              </div>

              <div className="p-3 rounded bg-black/40 border border-slate-800/60 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> GROWTH VECTOR
                </span>
                <div className="text-sm font-semibold text-white">
                  {aiAnalysis?.weakestAttribute || 'Endurance & Athletics'}
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommended Quests */}
          <div className="p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 space-y-4 font-mono">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>RECOMMENDED TACTICAL DIRECTIVES</span>
            </div>

            <div className="space-y-3">
              {(aiAnalysis?.recommendedQuests || []).map((quest, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded bg-black/40 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-white">{quest.title}</div>
                      <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                        {quest.description}
                      </p>
                      <div className="text-[10px] text-cyan-400 mt-1">
                        &gt; {quest.aiReason}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shrink-0">
                      +{quest.xpReward} XP
                    </span>
                  </div>

                  <button
                    onClick={() => acceptAiQuest(quest)}
                    className="w-full py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
                  >
                    + ACCEPT INTO DAILY MATRIX
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Interactive System Terminal Chat */}
        <div className="lg:col-span-6 flex flex-col h-[600px] rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 overflow-hidden shadow-2xl">
          {/* Terminal Title Bar */}
          <div className="p-3.5 bg-black/40 border-b border-slate-800/60 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400">
              <Terminal className="w-4 h-4" />
              <span className="font-bold">SYSTEM TERMINAL // ARAVIND-CORE</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ONLINE
            </span>
          </div>

          {/* Quick Prompts Shelf */}
          <div className="p-2 bg-black/30 border-b border-slate-800/60 flex gap-2 overflow-x-auto scrollbar-none font-mono text-[10px]">
            {[
              'Analyze my weaknesses',
              'Optimal study schedule',
              'Next rank strategy',
              'Boost my discipline',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded bg-black/50 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 whitespace-nowrap cursor-pointer transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs scrollbar-thin">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-500">
                  <span>{msg.role === 'user' ? 'ARAVIND' : 'SYSTEM CORE'}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div
                  className={`p-3.5 rounded-lg max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-bold rounded-tr-none shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                      : 'bg-black/60 border border-slate-800 text-slate-200 rounded-tl-none font-sans text-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isAiChatTyping && (
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>SYSTEM CORE SYNTHESIZING RESPONSE FOR ARAVIND...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-black/40 border-t border-slate-800/60 flex gap-2 font-mono text-xs"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Enter directive or query for System..."
              className="flex-1 px-3.5 py-2.5 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none placeholder-slate-600"
            />
            <button
              type="submit"
              disabled={isAiChatTyping || !inputQuery.trim()}
              className="px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
