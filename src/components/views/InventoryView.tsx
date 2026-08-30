import React, { useState } from 'react';
import {
  Package,
  Plus,
  Sparkles,
  ExternalLink,
  Award,
  FileText,
  Book,
  Code,
  Shield,
  Trash2,
  X,
  Upload,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { InventoryItem, InventoryItemType, ItemRarity } from '../../types';
import { systemAudio } from '../../utils/audio';

export const InventoryView: React.FC = () => {
  const { inventory, addInventoryItem, deleteInventoryItem } = useSystem();

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New item state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState<InventoryItemType>('CERTIFICATE');
  const [rarity, setRarity] = useState<ItemRarity>('RARE');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [tagInput, setTagInput] = useState('');

  const types = ['ALL', 'CERTIFICATE', 'BADGE', 'PROJECT', 'BOOK', 'SPECIAL_UNLOCK', 'ARTIFACT'];

  const filteredItems = inventory.filter((item) => {
    if (selectedType === 'ALL') return true;
    return item.type === selectedType;
  });

  const getRarityBadge = (r: ItemRarity) => {
    switch (r) {
      case 'MYTHIC':
      case 'LEGENDARY':
        return 'bg-amber-950 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.35)]';
      case 'EPIC':
        return 'bg-purple-950 text-purple-300 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
      case 'RARE':
        return 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  const getItemTypeIcon = (type: InventoryItemType) => {
    switch (type) {
      case 'CERTIFICATE':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'BADGE':
        return <Shield className="w-5 h-5 text-cyan-400" />;
      case 'PROJECT':
        return <Code className="w-5 h-5 text-emerald-400" />;
      case 'BOOK':
        return <Book className="w-5 h-5 text-indigo-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addInventoryItem({
      title: title.trim(),
      description: description.trim() || 'Verified artifact archived by ARAVIND.',
      type: itemType,
      rarity: rarity,
      dateAcquired: new Date().toISOString().split('T')[0],
      fileUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      fileSize: fileName ? '1.2 MB' : undefined,
      tags: tags.length > 0 ? tags : ['Verified', 'SystemVault'],
    });

    setTitle('');
    setDescription('');
    setFileUrl('');
    setFileName('');
    setTagInput('');
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">
            <Package className="w-4 h-4" />
            <span>ARTIFACT VAULT & CREDENTIALS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono uppercase mt-1">
            ARAVIND <span className="text-slate-500">INVENTORY & VAULT</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Upload and safeguard certificates, project deliverables, book completions, and special system unlock relics.
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
          <span>DEPOSIT ARTIFACT</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-1 scrollbar-none">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => {
              systemAudio.playClick();
              setSelectedType(type);
            }}
            className={`px-3.5 py-1.5 rounded border transition-all cursor-pointer whitespace-nowrap ${
              selectedType === type
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/50 font-bold shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                : 'bg-black/40 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    {getItemTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {item.type} // {item.dateAcquired}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRarityBadge(
                    item.rarity
                  )}`}
                >
                  {item.rarity}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed min-h-[36px]">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] bg-black/60 text-slate-400 border border-slate-800/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions / Attachments */}
            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-bold"
                >
                  <FileText className="w-4 h-4" />
                  <span>VIEW CERTIFICATE PROOF</span>
                </a>
              ) : (
                <span className="text-[11px] text-slate-500 font-sans italic">
                  Cryptographically verified
                </span>
              )}

              <button
                onClick={() => deleteInventoryItem(item.id)}
                className="text-slate-600 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deposit Artifact Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" />
                DEPOSIT NEW ARTIFACT
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
                <label className="text-slate-300 font-bold uppercase">ARTIFACT TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  placeholder="e.g. AWS Solutions Architect Professional"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">ARTIFACT TYPE</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  >
                    <option value="CERTIFICATE">CERTIFICATE</option>
                    <option value="PROJECT">PROJECT</option>
                    <option value="BADGE">BADGE</option>
                    <option value="BOOK">BOOK</option>
                    <option value="SPECIAL_UNLOCK">SPECIAL_UNLOCK</option>
                    <option value="ARTIFACT">ARTIFACT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">RARITY GRADE</label>
                  <select
                    value={rarity}
                    onChange={(e) => setRarity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  >
                    <option value="COMMON">COMMON</option>
                    <option value="RARE">RARE</option>
                    <option value="EPIC">EPIC</option>
                    <option value="LEGENDARY">LEGENDARY</option>
                    <option value="MYTHIC">MYTHIC</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">ATTACH PROOF (PDF / PNG)</label>
                <label className="flex items-center gap-2 px-3 py-2 rounded bg-black/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer text-slate-300">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{fileName || 'Choose credential file...'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none font-sans"
                  placeholder="Verification notes, credential ID, or project impact."
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-800 focus:border-cyan-500 text-slate-200 focus:outline-none"
                  placeholder="Cloud, Architecture, S-Tier"
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
                  LOCK INTO VAULT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
