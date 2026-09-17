import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Compass, Video, History, HelpCircle } from 'lucide-react';
import { PlanType, SpreadId, TarotCard, SavedReading } from './types';
import { SPREADS } from './data/spreadDefinitions';
import { Navbar } from './components/Navbar';
import { DailyThreeCardSpread } from './components/DailyThreeCardSpread';
import { CelticCrossSpread } from './components/CelticCrossSpread';
import { AstrologicalSpread } from './components/AstrologicalSpread';
import { MysticCrossSpread } from './components/MysticCrossSpread';
import { PricingModal } from './components/PricingModal';
import { PricingSection } from './components/PricingSection';
import { CardInspectorModal } from './components/CardInspectorModal';
import { SavedReadingsModal } from './components/SavedReadingsModal';
import { ViralContentStudio } from './components/ViralContentStudio';
import { ArcanaGallery } from './components/ArcanaGallery';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>(() => {
    return (localStorage.getItem('el_umbral_plan') as PlanType) || 'freemium';
  });

  const [activeSpread, setActiveSpread] = useState<SpreadId>('daily_3');
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [pricingTargetSpread, setPricingTargetSpread] = useState<string | undefined>(undefined);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showViralStudio, setShowViralStudio] = useState(false);
  const [inspectedCard, setInspectedCard] = useState<TarotCard | null>(null);

  const [savedReadings, setSavedReadings] = useState<SavedReading[]>(() => {
    try {
      const stored = localStorage.getItem('el_umbral_saved_readings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleSelectPlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    localStorage.setItem('el_umbral_plan', plan);
  };

  const handleOpenPricingForSpread = (targetSpreadName?: string) => {
    setPricingTargetSpread(targetSpreadName);
    setIsPricingOpen(true);
  };

  const handleSaveReading = (newReadingData: Omit<SavedReading, 'id' | 'date'>) => {
    const newEntry: SavedReading = {
      ...newReadingData,
      id: `reading_${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = [newEntry, ...savedReadings];
    setSavedReadings(updated);
    localStorage.setItem('el_umbral_saved_readings', JSON.stringify(updated));
  };

  const handleDeleteReading = (id: string) => {
    const updated = savedReadings.filter((r) => r.id !== id);
    setSavedReadings(updated);
    localStorage.setItem('el_umbral_saved_readings', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-[#f4efe6] flex flex-col selection:bg-[#caa96b]/30 selection:text-[#fae5b9]">
      {/* Top Navbar */}
      <Navbar
        currentPlan={currentPlan}
        activeSpread={activeSpread}
        onSelectSpread={(spreadId) => {
          setActiveSpread(spreadId);
          setShowViralStudio(false);
        }}
        onOpenPricing={() => handleOpenPricingForSpread()}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenViralStudio={() => setShowViralStudio(true)}
        savedReadingsCount={savedReadings.length}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {/* VIRAL STUDIO VIEW (Fase 2 Comercialización) */}
        {showViralStudio ? (
          <div className="px-4 sm:px-6 py-6">
            <ViralContentStudio />
          </div>
        ) : (
          <>
            {/* HERO BANNER SECTION - GOTHIC CELTIC ALTAR */}
            <div className="relative overflow-hidden border-b border-zinc-800/80 bg-[#07080d] py-14 sm:py-24 px-4 sm:px-6">
              {/* Sacred Dark Gothic Celtic Altar Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="/gothic-celtic-altar.jpg"
                  alt="Altar Sagrado Celta Gótico - El Umbral"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-45 sm:opacity-55 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
                />
                {/* Mystical atmospheric gradient overlays for solemn dark contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/85 to-[#07080d]/65" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#07080d]/90 via-transparent to-[#07080d]/90" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#07080d]/60 to-[#07080d]" />
              </div>

              {/* Subtle mystical ambient glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#caa96b]/15 to-transparent blur-3xl pointer-events-none" />
              <div className="absolute -top-24 right-10 w-80 h-80 bg-[#38bdf8]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#caa96b]/40 bg-[#121422]/90 backdrop-blur-md text-[#caa96b] text-xs font-semibold uppercase tracking-widest shadow-xl">
                  <span>✦</span>
                  <span className="gothic-ui-text tracking-widest text-sm">El Umbral · Altar Sagrado & Claridad</span>
                  <span>✦</span>
                </div>

                <h1 className="gothic-title text-4xl sm:text-6xl text-zinc-100 leading-tight drop-shadow-2xl">
                  Escucha lo que ya sabes.
                </h1>

                <p className="gothic-ui-text text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                  Una plataforma oracular privada sobre el altar sagrado de la tradición celta y Rider-Waite, potenciada con la profundidad de la Inteligencia Artificial.
                </p>

                {/* Quick Action Selector Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                  <button
                    onClick={() => setActiveSpread('daily_3')}
                    className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg gothic-ui-text tracking-wide ${
                      activeSpread === 'daily_3'
                        ? 'bg-[#caa96b] text-black font-bold scale-105 shadow-[#caa96b]/20'
                        : 'bg-[#151726]/90 text-zinc-300 hover:text-white border border-zinc-700 hover:border-[#caa96b]/40'
                    }`}
                  >
                    <span>Tirada Diaria (3 Cartas Gratis)</span>
                  </button>

                  <button
                    onClick={() => setActiveSpread('celtic_cross')}
                    className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg gothic-ui-text tracking-wide ${
                      activeSpread === 'celtic_cross'
                        ? 'bg-[#caa96b] text-black font-bold scale-105 shadow-[#caa96b]/20'
                        : 'bg-[#151726]/90 text-zinc-300 hover:text-white border border-zinc-700 hover:border-[#caa96b]/40'
                    }`}
                  >
                    <span>Cruz Celta (10 Cartas)</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[#caa96b] text-[10px] font-sans font-bold border border-[#caa96b]/30">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveSpread('astrological')}
                    className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg gothic-ui-text tracking-wide ${
                      activeSpread === 'astrological'
                        ? 'bg-[#caa96b] text-black font-bold scale-105 shadow-[#caa96b]/20'
                        : 'bg-[#151726]/90 text-zinc-300 hover:text-white border border-zinc-700 hover:border-[#caa96b]/40'
                    }`}
                  >
                    <span>Tirada Astrológica (Sol a Plutón)</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-sans font-bold border border-purple-500/30">
                      ÉLITE
                    </span>
                  </button>
                </div>

                {/* Trust cues */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#caa96b]" />
                    <span>Lecturas 100% privadas y confidenciales</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                    <span>IA Arquetípica Gemini 3.8 Flash</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#caa96b]" />
                    <span>Sin fatalismos ni predicciones dogmáticas</span>
                  </span>
                </div>
              </div>
            </div>

            {/* SPREAD INTERACTIVE BOARD WITH GOTHIC CELTIC ALTAR BACKGROUND */}
            <div className="celtic-altar-bg relative min-h-screen text-gray-200 antialiased border-b border-zinc-800/80">
              {/* Capa de oscurecimiento místico y blur para legibilidad superior */}
              <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"></div>

              {/* Contenido de la tirada y cartas */}
              <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-14">
                {activeSpread === 'daily_3' && (
                  <DailyThreeCardSpread
                    spread={SPREADS.daily_3}
                    userPlan={currentPlan}
                    onOpenPricing={handleOpenPricingForSpread}
                    onInspectCard={(c) => setInspectedCard(c)}
                    onSaveReading={handleSaveReading}
                  />
                )}

                {activeSpread === 'celtic_cross' && (
                  <CelticCrossSpread
                    spread={SPREADS.celtic_cross}
                    userPlan={currentPlan}
                    onOpenPricing={handleOpenPricingForSpread}
                    onInspectCard={(c) => setInspectedCard(c)}
                    onSaveReading={handleSaveReading}
                  />
                )}

                {activeSpread === 'astrological' && (
                  <AstrologicalSpread
                    spread={SPREADS.astrological}
                    userPlan={currentPlan}
                    onOpenPricing={handleOpenPricingForSpread}
                    onInspectCard={(c) => setInspectedCard(c)}
                    onSaveReading={handleSaveReading}
                  />
                )}

                {activeSpread === 'mystic_cross' && (
                  <MysticCrossSpread
                    spread={SPREADS.mystic_cross}
                    userPlan={currentPlan}
                    onOpenPricing={handleOpenPricingForSpread}
                    onInspectCard={(c) => setInspectedCard(c)}
                    onSaveReading={handleSaveReading}
                  />
                )}
              </main>
            </div>

            {/* PRICING SECTION (LANDING) */}
            <PricingSection
              currentPlan={currentPlan}
              onSelectPlan={handleSelectPlan}
              onOpenCheckout={(plan) => {
                setPricingTargetSpread(undefined);
                setIsPricingOpen(true);
              }}
            />

            {/* 22 MAJOR ARCANA GALLERY */}
            <ArcanaGallery onInspectCard={(card) => setInspectedCard(card)} />
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-[#05060a] py-10 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-serif tracking-widest text-zinc-300 font-semibold block">
              ✦ EL UMBRAL
            </span>
            <p className="max-w-md text-zinc-500">
              El tarot es una herramienta de reflexión, autoconocimiento y entretenimiento. No sustituye atención médica, psicológica ni legal.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
            <button
              onClick={() => handleOpenPricingForSpread()}
              className="hover:text-[#caa96b] transition-colors"
            >
              Planes y Precios
            </button>
            <span>·</span>
            <button
              onClick={() => setShowViralStudio(true)}
              className="hover:text-[#3da9a9] transition-colors"
            >
              Estudio Viral TikTok / Reels
            </button>
            <span>·</span>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-white transition-colors"
            >
              Mi Historial ({savedReadings.length})
            </button>
          </div>

          <div className="text-zinc-600 text-[11px]">
            © {new Date().getFullYear()} El Umbral. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Pricing & Checkout Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentPlan={currentPlan}
        onSelectPlan={handleSelectPlan}
        targetSpreadName={pricingTargetSpread}
      />

      {/* 2. Card Details Inspector */}
      <CardInspectorModal
        card={inspectedCard}
        onClose={() => setInspectedCard(null)}
      />

      {/* 3. Saved Readings / Profile Journal */}
      <SavedReadingsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedReadings={savedReadings}
        onDeleteReading={handleDeleteReading}
        userPlan={currentPlan}
        onOpenPricing={() => {
          setIsHistoryOpen(false);
          setIsPricingOpen(true);
        }}
      />
    </div>
  );
}
