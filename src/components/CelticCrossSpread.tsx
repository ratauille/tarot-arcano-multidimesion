import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Lock, RotateCcw, Save, CheckCircle2, ChevronDown, Compass, Eye, ShieldAlert, ArrowRight, Flame, Shield } from 'lucide-react';
import { TarotCard, SpreadConfig, PlanType, AIReadingResult, SavedReading } from '../types';
import { drawUniqueCards } from '../data/tarotCards';
import { TarotCardView } from './TarotCardView';
import { OracleAgentStream } from './OracleAgentStream';
import { sound } from '../utils/sound';
import { useUserAlias } from '../utils/userAlias';

interface CelticCrossSpreadProps {
  spread: SpreadConfig;
  userPlan: PlanType;
  onOpenPricing: (targetSpread?: string) => void;
  onInspectCard: (card: TarotCard) => void;
  onSaveReading: (reading: Omit<SavedReading, 'id' | 'date'>) => void;
}

export const CelticCrossSpread: React.FC<CelticCrossSpreadProps> = ({
  spread,
  userPlan,
  onOpenPricing,
  onInspectCard,
  onSaveReading,
}) => {
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<Array<{ card: TarotCard; revealed: boolean }>>([]);
  const [isReadingStarted, setIsReadingStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [readingResult, setReadingResult] = useState<AIReadingResult | null>(null);
  const [activeTab, setActiveTab] = useState<'synthesis' | 'cross_analysis' | 'card_by_card' | 'live_agent'>('synthesis');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { alias } = useUserAlias();

  const isLocked = userPlan === 'freemium';

  const handleStartDraw = () => {
    if (isLocked) {
      onOpenPricing('Cruz Celta Completa (10 Cartas)');
      return;
    }

    const cards = drawUniqueCards(10);
    setDrawnCards(cards.map((card) => ({ card, revealed: false })));
    setIsReadingStarted(true);
    setReadingResult(null);
    setSavedSuccess(false);
    sound.playChime();
  };

  const handleRevealCard = (index: number) => {
    setDrawnCards((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, revealed: true } : item))
    );
  };

  const handleRevealAll = () => {
    setDrawnCards((prev) => prev.map((item) => ({ ...item, revealed: true })));
    sound.playChime();
  };

  const allRevealed = drawnCards.length === 10 && drawnCards.every((c) => c.revealed);

  // Trigger deep AI interpretation
  useEffect(() => {
    if (allRevealed && !readingResult && !isAnalyzing) {
      setIsAnalyzing(true);
      fetch('/api/tarot/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim() || 'Consulta profunda con la Cruz Celta',
          spreadType: 'celtic_cross',
          cards: drawnCards.map((dc, i) => ({
            id: dc.card.id,
            name: dc.card.name,
            position: spread.positions[i]?.title || `Posición ${i + 1}`,
            upright: true,
            planetaryRuler: dc.card.planetaryRuler,
          })),
          userPlan,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setReadingResult(data);
          setIsAnalyzing(false);
        })
        .catch(() => {
          // Curated deep fallback
          setReadingResult({
            synthesis: `La Cruz Celta se abre con ${drawnCards[0].card.name} en el centro desafiada por ${drawnCards[1].card.name}. Este cruce revela que tu mayor obstáculo no proviene del exterior, sino de una resistencia a integrar la transformación que la raíz (${drawnCards[2].card.name}) viene gestando desde hace tiempo. La corona (${drawnCards[4].card.name}) proyecta ideales elevados, mientras el desenlace final con ${drawnCards[9].card.name} sella la integración definitiva si mantienes la sobriedad en tus decisiones.`,
            crossCardDynamics: `Existe una tensión directa entre la carta central (${drawnCards[0].card.name}) y la carta que cruza (${drawnCards[1].card.name}): mientras el centro pide acción y presencia, el obstáculo exige pausar y revisar motivaciones ocultas. A su vez, el eje vertical (Raíz: ${drawnCards[2].card.name} a Corona: ${drawnCards[4].card.name}) muestra que tus aspiraciones conscientes aún chocan con un miedo ancestral a perder el control. El desenlace (${drawnCards[9].card.name}) resuelve esta polaridad ofreciendo un despertar integral.`,
            obstacleAction: `Frente al bloqueo revelado por ${drawnCards[1].card.name}, desactiva la reactividad impulsiva. Acepta que el obstáculo es tu mayor maestro en esta etapa.`,
            oracleAffirmation: `"No temo a la sombra del camino, pues cada piedra en la cruz celta sostiene el peso de mi renacimiento."`,
            positionInsights: drawnCards.map((c, i) => ({
              cardName: c.card.name,
              position: spread.positions[i]?.title || `Posición ${i + 1}`,
              interpretation: `En ${spread.positions[i]?.title}, ${c.card.name} manifiesta su energía arquetípica: ${c.card.core}`,
              advice: c.card.prompt,
            })),
          });
          setIsAnalyzing(false);
        });
    }
  }, [allRevealed, drawnCards, question, spread, userPlan]);

  const handleSave = () => {
    if (drawnCards.length === 10) {
      onSaveReading({
        question: question || 'Consulta con Cruz Celta',
        alias,
        spreadId: 'celtic_cross',
        spreadName: spread.name,
        cards: drawnCards.map((dc, idx) => ({
          name: dc.card.name,
          positionTitle: spread.positions[idx].title,
          imageUrl: dc.card.imageUrl,
          isUpright: true,
        })),
        aiResult: readingResult || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#caa96b]/40 bg-[#161424] text-[#caa96b] text-xs font-semibold uppercase tracking-wider shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>La Tirada Suprema · 10 Cartas</span>
        </div>
        <h1 className="gothic-title text-3xl sm:text-5xl text-[#f5efe6] tracking-wide drop-shadow-lg">
          Cruz Celta (10 Cartas) PRO
        </h1>
        <p className="gothic-ui-text text-base text-zinc-300">
          La lectura oracular más profunda del tarot occidental sobre el altar sagrado de piedra rúnica.
        </p>
      </div>

      {/* LOCKED FREEMIUM TEASER IF USER NOT SUBSCRIBED */}
      {isLocked && !isReadingStarted && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#caa96b] bg-[#10121d] p-8 sm:p-12 shadow-2xl text-center max-w-3xl mx-auto">
          <img
            src="/celtic-altar-bg.jpg"
            alt="Altar Celta de Tarot"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10121d] via-[#10121d]/80 to-[#10121d]/60 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-full border border-[#caa96b] bg-[#1a1728]/90 backdrop-blur-sm flex items-center justify-center mx-auto shadow-lg text-[#caa96b]">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Tirada Exclusiva de Plan Místico Pro
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                La <strong>Cruz Celta de 10 cartas</strong> está reservada para suscriptores Pro y usuarios con Pase Élite. Incluye interpretaciones ilimitadas, análisis cruzado de relaciones entre cartas y guardado en tu perfil.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/60 backdrop-blur-sm border border-zinc-800 text-xs text-zinc-400 max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sparkles className="w-4 h-4 text-[#caa96b]" />
                <span>Lo que obtienes en la Cruz Celta:</span>
              </div>
              <p>✦ 10 posiciones arcanas (obstáculo cruzado, inconsciente, entorno).</p>
              <p>✦ Interpretación avanzada con IA profunda de Google Gemini.</p>
              <p>✦ Guardado ilimitado en tu historial privado local.</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Prueba de Fuego $1 USD Button */}
              <button
                type="button"
                onClick={() => onOpenPricing('Prueba de Fuego ($1 USD)')}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-black font-extrabold text-sm hover:brightness-110 transition-all shadow-xl hover:scale-105 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>Prueba de Fuego ($1.00 USD)</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenPricing('Cruz Celta Completa (10 Cartas)')}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#caa96b]/20 hover:bg-[#caa96b]/30 border border-[#caa96b]/60 text-[#caa96b] font-bold text-sm transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Ver Planes Mensual / Vitalicio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION INPUT IF UNLOCKED AND NOT STARTED */}
      {!isLocked && !isReadingStarted && (
        <div className="max-w-xl mx-auto bg-[#121422] border border-[#caa96b]/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-2.5">
            <span className="text-zinc-400">Espacio sagrado personal</span>
            <div className="flex items-center gap-1.5 text-[#caa96b]">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-zinc-300">Consagrado para:</span>
              <strong className="text-white font-serif">{alias}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#caa96b] uppercase tracking-wider mb-2">
              Escribe tu pregunta o situación para la Cruz Celta
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ejemplo: ¿Qué fuerzas están operando en mi vida profesional y qué desenlace se aproxima?"
              className="w-full h-28 p-3.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-[#caa96b] focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleStartDraw}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#caa96b] via-[#dfc285] to-[#caa96b] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Barajar e Invocar la Cruz Celta (10 Cartas)</span>
          </button>
        </div>
      )}

      {/* SPREAD BOARD WITH THE 10 CARDS ORGANIZED IN CELTIC GEOMETRY */}
      {isReadingStarted && drawnCards.length === 10 && (
        <div className="space-y-8">
          {/* Top Bar with Question and Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs text-zinc-400">Consulta en la Cruz Celta:</span>
              <p className="text-sm font-serif font-semibold text-[#f5efe6]">
                "{question || 'Consulta general con la Cruz Celta'}"
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!allRevealed && (
                <button
                  onClick={handleRevealAll}
                  className="px-3.5 py-1.5 rounded-xl border border-[#caa96b]/50 text-[#caa96b] text-xs font-semibold hover:bg-[#caa96b]/10 transition-colors"
                >
                  Revelar todas las cartas
                </button>
              )}
              <button
                onClick={handleStartDraw}
                className="px-3.5 py-1.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nueva tirada</span>
              </button>
            </div>
          </div>

          {/* CELTIC CROSS GEOMETRIC BOARD:
              Left side: Central Cross (Cards 1 to 6)
              Right side: Vertical Staff / Pillar (Cards 7 to 10) */}
          <div className="relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#0d0f18]/85 p-4 sm:p-8 rounded-3xl border border-[#caa96b]/30 shadow-2xl">
            {/* Subtle Celtic Altar Texture Overlay */}
            <img
              src="/celtic-altar-bg.jpg"
              alt="Mesa sagrada del altar celta"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0f18]/60 to-[#0d0f18] pointer-events-none" />

            {/* LEFT / CENTER: THE MAIN CROSS (8 COLUMNS ON LARGE) */}
            <div className="relative z-10 lg:col-span-8 flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest text-[#caa96b] font-semibold mb-6">
                El Corazón de la Cruz
              </span>

              <div className="grid grid-cols-3 gap-3 sm:gap-6 items-center justify-items-center max-w-lg w-full">
                {/* ROW 1: TOP (CARD 5: LA CORONA) */}
                <div className="col-start-2 flex flex-col items-center">
                  <TarotCardView
                    card={drawnCards[4].card}
                    position={spread.positions[4]}
                    revealed={drawnCards[4].revealed}
                    onReveal={() => handleRevealCard(4)}
                    onInspect={onInspectCard}
                    size="md"
                  />
                </div>

                {/* ROW 2: LEFT (CARD 4: PASADO), CENTER (CARDS 1 & 2 OVERLAPPING), RIGHT (CARD 6: FUTURO) */}
                <div className="col-start-1 row-start-2 flex flex-col items-center">
                  <TarotCardView
                    card={drawnCards[3].card}
                    position={spread.positions[3]}
                    revealed={drawnCards[3].revealed}
                    onReveal={() => handleRevealCard(3)}
                    onInspect={onInspectCard}
                    size="md"
                  />
                </div>

                {/* CENTER: CARD 1 (PRESENT) & CARD 2 (OBSTACLE CROSSED OVER) */}
                <div className="col-start-2 row-start-2 relative w-36 h-60 flex items-center justify-center">
                  {/* Base Card: 1. Present */}
                  <div className="absolute inset-0">
                    <TarotCardView
                      card={drawnCards[0].card}
                      position={spread.positions[0]}
                      revealed={drawnCards[0].revealed}
                      onReveal={() => handleRevealCard(0)}
                      onInspect={onInspectCard}
                      size="md"
                    />
                  </div>

                  {/* Crossed Card: 2. Obstacle / Challenge (Rotated 90deg over the center) */}
                  <div className="absolute inset-0 z-20 pointer-events-auto">
                    <TarotCardView
                      card={drawnCards[1].card}
                      position={spread.positions[1]}
                      revealed={drawnCards[1].revealed}
                      onReveal={() => handleRevealCard(1)}
                      onInspect={onInspectCard}
                      isCrossed={true}
                      size="md"
                    />
                  </div>
                </div>

                {/* RIGHT: CARD 6 (NEAR FUTURE) */}
                <div className="col-start-3 row-start-2 flex flex-col items-center">
                  <TarotCardView
                    card={drawnCards[5].card}
                    position={spread.positions[5]}
                    revealed={drawnCards[5].revealed}
                    onReveal={() => handleRevealCard(5)}
                    onInspect={onInspectCard}
                    size="md"
                  />
                </div>

                {/* ROW 3: BOTTOM (CARD 3: LA RAÍZ INCONSCIENTE) */}
                <div className="col-start-2 row-start-3 flex flex-col items-center mt-2">
                  <TarotCardView
                    card={drawnCards[2].card}
                    position={spread.positions[2]}
                    revealed={drawnCards[2].revealed}
                    onReveal={() => handleRevealCard(2)}
                    onInspect={onInspectCard}
                    size="md"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: THE VERTICAL STAFF / PILLAR (4 COLUMNS ON LARGE) */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-zinc-800/80 pt-6 lg:pt-0 lg:pl-8 flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest text-[#caa96b] font-semibold mb-6">
                El Báculo / La Columna Ascendente
              </span>

              <div className="flex flex-col-reverse gap-4 items-center">
                {/* Card 7: Postura Interior */}
                <TarotCardView
                  card={drawnCards[6].card}
                  position={spread.positions[6]}
                  revealed={drawnCards[6].revealed}
                  onReveal={() => handleRevealCard(6)}
                  onInspect={onInspectCard}
                  size="md"
                />

                {/* Card 8: Entorno y Vínculos */}
                <TarotCardView
                  card={drawnCards[7].card}
                  position={spread.positions[7]}
                  revealed={drawnCards[7].revealed}
                  onReveal={() => handleRevealCard(7)}
                  onInspect={onInspectCard}
                  size="md"
                />

                {/* Card 9: Esperanzas y Temores */}
                <TarotCardView
                  card={drawnCards[8].card}
                  position={spread.positions[8]}
                  revealed={drawnCards[8].revealed}
                  onReveal={() => handleRevealCard(8)}
                  onInspect={onInspectCard}
                  size="md"
                />

                {/* Card 10: Culminación y Desenlace */}
                <div className="relative p-1 rounded-2xl bg-gradient-to-b from-[#caa96b]/50 to-transparent">
                  <TarotCardView
                    card={drawnCards[9].card}
                    position={spread.positions[9]}
                    revealed={drawnCards[9].revealed}
                    onReveal={() => handleRevealCard(9)}
                    onInspect={onInspectCard}
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DEEP AI INTERPRETATION PANEL */}
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#121422] border border-[#caa96b]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Header of AI Panel */}
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#caa96b]/20 text-[#caa96b]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Análisis Oracular Profundo con IA
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Cruz Celta · Relaciones e interpretaciones cruzadas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="px-3.5 py-1.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {savedSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Guardada en perfil!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar en historial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-tabs for Deep Analysis */}
              <div className="flex gap-2 border-b border-zinc-800 pb-2 overflow-x-auto text-xs font-medium">
                <button
                  onClick={() => setActiveTab('synthesis')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'synthesis'
                      ? 'bg-[#caa96b] text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Síntesis General
                </button>
                <button
                  onClick={() => setActiveTab('cross_analysis')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'cross_analysis'
                      ? 'bg-[#caa96b] text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>Análisis Cruzado de Relaciones</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-[#caa96b] text-[9px] font-bold">
                    PRO
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('card_by_card')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'card_by_card'
                      ? 'bg-[#caa96b] text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Desglose Carta por Carta (10)
                </button>
                <button
                  onClick={() => setActiveTab('live_agent')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'live_agent'
                      ? 'bg-[#caa96b] text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Agente Oracular en Vivo</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-[#caa96b] text-[9px] font-bold">
                    IA
                  </span>
                </button>
              </div>

              {isAnalyzing ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#caa96b] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-zinc-400 italic">
                    Conectando con la IA de El Umbral para tejer las 10 posiciones de la Cruz Celta...
                  </p>
                </div>
              ) : (
                readingResult && (
                  <div className="space-y-6">
                    {/* TAB 1: SÝNTHESIS */}
                    {activeTab === 'synthesis' && (
                      <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-[#0a0b12] border border-zinc-800 text-sm text-zinc-200 leading-relaxed">
                          <h4 className="font-serif text-[#caa96b] text-base font-semibold mb-2 flex items-center gap-2">
                            <Compass className="w-4 h-4" />
                            <span>La Visión Global del Oráculo</span>
                          </h4>
                          <p className="whitespace-pre-line">{readingResult.synthesis}</p>
                        </div>

                        {/* Obstacle Action Callout */}
                        <div className="p-4 rounded-xl bg-amber-950/30 border border-[#caa96b]/30 text-xs sm:text-sm text-zinc-200 space-y-1">
                          <strong className="text-[#caa96b] block font-serif text-sm">
                            ⚔️ Consejo Clave sobre el Desafío Central:
                          </strong>
                          <p>{readingResult.obstacleAction}</p>
                        </div>

                        {/* Affirmation */}
                        {readingResult.oracleAffirmation && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-[#171120] to-[#121526] border-l-4 border-[#caa96b] text-sm italic text-[#fae5b9]">
                            {readingResult.oracleAffirmation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: CROSS CARD DYNAMICS (EXPLICIT FEATURE FROM PRO PLAN) */}
                    {activeTab === 'cross_analysis' && (
                      <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-[#0e111d] border border-[#caa96b]/30 space-y-3">
                          <div className="flex items-center gap-2 text-[#caa96b]">
                            <Sparkles className="w-4 h-4" />
                            <h4 className="font-serif text-base font-bold">
                              Interacción y Polaridades entre las Cartas
                            </h4>
                          </div>
                          <p className="text-sm text-zinc-200 leading-relaxed">
                            {readingResult.crossCardDynamics}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="p-4 rounded-xl bg-[#11131e] border border-zinc-800">
                            <span className="text-[#caa96b] font-semibold block mb-1">
                              Eje Horizontal: Pasado → Presente → Futuro
                            </span>
                            <p className="text-zinc-300">
                              Muestra la transición de la inercia reciente ({drawnCards[3].card.name}) a través del núcleo presente ({drawnCards[0].card.name}) hacia la puerta que se abre ({drawnCards[5].card.name}).
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-[#11131e] border border-zinc-800">
                            <span className="text-[#caa96b] font-semibold block mb-1">
                              Eje Vertical: Raíz Oculta → Corona Elevada
                            </span>
                            <p className="text-zinc-300">
                              El puente entre lo que pulsa en el inconsciente ({drawnCards[2].card.name}) y lo que la mente lúcida aspira a construir ({drawnCards[4].card.name}).
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: CARD BY CARD */}
                    {activeTab === 'card_by_card' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {drawnCards.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-[#0c0e17] border border-zinc-800 hover:border-[#caa96b]/40 transition-colors flex gap-3 items-start"
                          >
                            <img
                              src={item.card.imageUrl}
                              alt={item.card.name}
                              className="w-12 h-20 rounded-md object-cover shrink-0 border border-[#caa96b]/30 cursor-pointer"
                              onClick={() => onInspectCard(item.card)}
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] text-[#caa96b] font-medium uppercase tracking-wider block truncate">
                                {spread.positions[idx].title}
                              </span>
                              <h5 className="font-serif text-sm font-bold text-white">
                                {item.card.name}
                              </h5>
                              <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                                {readingResult.positionInsights[idx]?.interpretation || item.card.core}
                              </p>
                              <p className="text-[11px] text-[#48b4b4] mt-1 italic">
                                ✦ {readingResult.positionInsights[idx]?.advice || item.card.prompt}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB 4: LIVE ORACLE AGENT STREAM */}
                    {activeTab === 'live_agent' && (
                      <OracleAgentStream
                        spreadType="Cruz Celta (10 Cartas)"
                        question={question || 'Orientación arquetípica sobre mi destino'}
                        cards={drawnCards.map((item, idx) => ({
                          positionName: spread.positions[idx]?.title || `Posición ${idx + 1}`,
                          cardName: item.card.name,
                          isReversed: item.card.upright === false,
                        }))}
                      />
                    )}
                  </div>
                )
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
