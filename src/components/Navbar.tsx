import React from 'react';
import { Sparkles, Crown, Zap, BookOpen, Video, History, ChevronRight } from 'lucide-react';
import { PlanType, SpreadId } from '../types';
import { CelticAudioPlayer } from './CelticAudioPlayer';
import { UserAliasBadge } from './UserAliasBadge';

interface NavbarProps {
  currentPlan: PlanType;
  activeSpread: SpreadId;
  onSelectSpread: (spreadId: SpreadId) => void;
  onOpenPricing: () => void;
  onOpenHistory: () => void;
  onOpenViralStudio: () => void;
  savedReadingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPlan,
  activeSpread,
  onSelectSpread,
  onOpenPricing,
  onOpenHistory,
  onOpenViralStudio,
  savedReadingsCount,
}) => {
  const planBadges = {
    freemium: {
      label: 'Plan Gratuito',
      color: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      icon: Sparkles,
    },
    pro: {
      label: 'Místico Pro',
      color: 'bg-[#caa96b]/20 text-[#caa96b] border-[#caa96b]/40',
      icon: Zap,
    },
    elite: {
      label: 'Pase Élite',
      color: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
      icon: Crown,
    },
    test_fire: {
      label: 'Cruz Celta ($1)',
      color: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
      icon: Zap,
    },
  }[currentPlan];

  const PlanIcon = planBadges.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#caa96b]/20 bg-[#08090f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectSpread('daily_3')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-full border border-[#caa96b] flex items-center justify-center bg-[#15121c] shadow-[0_0_12px_rgba(202,169,107,0.3)] group-hover:scale-105 transition-transform">
              <span className="font-serif text-sm text-[#caa96b]">✦</span>
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-widest text-[#f5efe6] group-hover:text-[#caa96b] transition-colors">
                EL UMBRAL
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-zinc-400">
                Tarot & IA Oracular
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Spreads */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#121422]/70 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => onSelectSpread('daily_3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSpread === 'daily_3'
                ? 'bg-[#caa96b] text-black shadow-md font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            Tirada Diaria (3 Cartas)
          </button>

          <button
            onClick={() => onSelectSpread('celtic_cross')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSpread === 'celtic_cross'
                ? 'bg-[#caa96b] text-black shadow-md font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <span>Cruz Celta (10 Cartas)</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-[#caa96b] text-[9px] font-bold border border-[#caa96b]/30">
              PRO
            </span>
          </button>

          <button
            onClick={() => onSelectSpread('astrological')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSpread === 'astrological'
                ? 'bg-[#caa96b] text-black shadow-md font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <span>Tirada Astrológica (10 Planetas)</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
              ÉLITE
            </span>
          </button>

          <button
            onClick={() => onSelectSpread('mystic_cross')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSpread === 'mystic_cross'
                ? 'bg-[#caa96b] text-black shadow-md font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            Cruz Mística
          </button>
        </nav>

        {/* Right Actions: User Alias, Celtic Audio, Viral Studio, History, Pricing, Upgrade CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Private Local User Alias Badge (Sin Correos) */}
          <UserAliasBadge />

          {/* Celtic Mystical Ambient Audio Player */}
          <CelticAudioPlayer />

          {/* Viral TikTok/Reels Studio Button (Fase 2) */}
          <button
            onClick={onOpenViralStudio}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#3da9a9]/40 bg-[#0c242b]/60 text-[#3da9a9] hover:bg-[#3da9a9]/20 text-xs font-semibold transition-all shadow-sm"
            title="Estudio Viral de Redes (TikTok & Reels)"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Estudio Viral</span>
          </button>

          {/* Saved History */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Historial de lecturas guardadas"
            aria-label="Ver historial de lecturas"
          >
            <History className="w-4 h-4" />
            {savedReadingsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#caa96b] text-black text-[10px] font-bold flex items-center justify-center shadow-md">
                {savedReadingsCount}
              </span>
            )}
          </button>

          {/* Current Plan Badge & Upgrade Button */}
          <button
            onClick={onOpenPricing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all hover:scale-105 ${planBadges.color}`}
          >
            <PlanIcon className="w-3.5 h-3.5" />
            <span className="font-semibold">{planBadges.label}</span>
            {currentPlan === 'freemium' && (
              <span className="text-[10px] text-[#caa96b] font-bold underline ml-1 hidden sm:inline">
                Mejorar
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile subnav for spreads */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 gap-2 border-t border-zinc-800/60 no-scrollbar text-xs">
        <button
          onClick={() => onSelectSpread('daily_3')}
          className={`px-3 py-1 rounded-lg shrink-0 ${
            activeSpread === 'daily_3' ? 'bg-[#caa96b] text-black font-semibold' : 'bg-zinc-900 text-zinc-300'
          }`}
        >
          Diaria (3 Cartas)
        </button>
        <button
          onClick={() => onSelectSpread('celtic_cross')}
          className={`px-3 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
            activeSpread === 'celtic_cross' ? 'bg-[#caa96b] text-black font-semibold' : 'bg-zinc-900 text-zinc-300'
          }`}
        >
          <span>Cruz Celta (10)</span>
          <span className="text-[9px] px-1 bg-amber-400/20 text-[#caa96b] rounded">PRO</span>
        </button>
        <button
          onClick={() => onSelectSpread('astrological')}
          className={`px-3 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
            activeSpread === 'astrological' ? 'bg-[#caa96b] text-black font-semibold' : 'bg-zinc-900 text-zinc-300'
          }`}
        >
          <span>Astrológica</span>
          <span className="text-[9px] px-1 bg-purple-400/20 text-purple-300 rounded">ÉLITE</span>
        </button>
        <button
          onClick={() => onSelectSpread('mystic_cross')}
          className={`px-3 py-1 rounded-lg shrink-0 ${
            activeSpread === 'mystic_cross' ? 'bg-[#caa96b] text-black font-semibold' : 'bg-zinc-900 text-zinc-300'
          }`}
        >
          Cruz Mística
        </button>
      </div>
    </header>
  );
};
