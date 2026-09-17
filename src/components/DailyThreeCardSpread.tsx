import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Lock, RotateCcw, HelpCircle, Save, CheckCircle2 } from 'lucide-react';
import { TarotCard, SpreadConfig, PlanType, AIReadingResult, SavedReading } from '../types';
import { drawUniqueCards } from '../data/tarotCards';
import { TarotCardView } from './TarotCardView';
import { sound } from '../utils/sound';
import { useUserAlias } from '../utils/userAlias';

interface DailyThreeCardSpreadProps {
  spread: SpreadConfig;
  userPlan: PlanType;
  onOpenPricing: (targetSpread?: string) => void;
  onInspectCard: (card: TarotCard) => void;
  onSaveReading: (reading: Omit<SavedReading, 'id' | 'date'>) => void;
}

export const DailyThreeCardSpread: React.FC<DailyThreeCardSpreadProps> = ({
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
  const [hasUsedToday, setHasUsedToday] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { alias } = useUserAlias();

  // Check daily limit for freemium
  useEffect(() => {
    if (userPlan === 'freemium') {
      const todayKey = `el_umbral_daily_${new Date().toISOString().split('T')[0]}`;
      const used = localStorage.getItem(todayKey);
      if (used) {
        setHasUsedToday(true);
      }
    } else {
      setHasUsedToday(false);
    }
  }, [userPlan]);

  const handleStartDraw = async () => {
    const cards = drawUniqueCards(3);
    setDrawnCards(cards.map((card) => ({ card, revealed: false })));
    setIsReadingStarted(true);
    setReadingResult(null);
    setSavedSuccess(false);
    sound.playChime();

    // Mark daily used for freemium
    if (userPlan === 'freemium') {
      const todayKey = `el_umbral_daily_${new Date().toISOString().split('T')[0]}`;
      localStorage.setItem(todayKey, 'true');
      setHasUsedToday(true);
    }
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

  const allRevealed = drawnCards.length === 3 && drawnCards.every((c) => c.revealed);

  // Generate basic reading synthesis
  useEffect(() => {
    if (allRevealed && !readingResult && !isAnalyzing) {
      setIsAnalyzing(true);
      fetch('/api/tarot/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim() || 'Orientación general para mi día',
          spreadType: 'daily_3',
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
          // Curated fallback
          setReadingResult({
            synthesis: `El arco temporal de tu tirada une el pasado (${drawnCards[0].card.name}), tu presente activo (${drawnCards[1].card.name}) y la tendencia que se proyecta (${drawnCards[2].card.name}). La clave está en no repetir las inercias que te trajeron hasta aquí y abrazar la sabiduría de tu momento presente.`,
            crossCardDynamics: 'Existe una continuidad directa: lo que aprendiste recientemente abre la puerta a una resolución lúcida en el desenlace.',
            obstacleAction: 'Concéntrate en la verdad que ya conoces y evita postergar decisiones por apego a la comodidad.',
            oracleAffirmation: '"Honro de dónde vengo, habito quién soy hoy y elijo conscientemente mi próximo paso."',
            positionInsights: drawnCards.map((c, i) => ({
              cardName: c.card.name,
              position: spread.positions[i]?.title || `Posición ${i + 1}`,
              interpretation: `${c.card.name} en esta posición representa ${c.card.core}`,
              advice: c.card.prompt,
            })),
          });
          setIsAnalyzing(false);
        });
    }
  }, [allRevealed, drawnCards, question, spread, userPlan]);

  const handleSave = () => {
    if (drawnCards.length === 3) {
      onSaveReading({
        question: question || 'Orientación para mi día',
        alias,
        spreadId: 'daily_3',
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
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Top Description & Freemium Badge */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#caa96b]/30 bg-[#141624] text-[#caa96b] text-xs font-semibold uppercase tracking-wider shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Freemium · 1 Lectura Diaria Gratuita</span>
        </div>
        <h1 className="gothic-title text-3xl sm:text-5xl text-[#f5efe6] tracking-wide drop-shadow-lg">
          Tirada Diaria (3 Cartas)
        </h1>
        <p className="gothic-ui-text text-base text-zinc-300">
          Pasado, Presente y Futuro con imágenes reales del tarot Rider-Waite sobre el altar sagrado.
        </p>
      </div>

      {/* QUESTION INPUT / START BUTTON */}
      {!isReadingStarted ? (
        <div className="max-w-xl mx-auto bg-gray-950/85 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#caa96b] uppercase tracking-wider mb-2">
              Formula tu pregunta o dilema
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ejemplo: ¿Qué debo atender hoy en mi trabajo o en mis relaciones?"
              className="w-full h-24 p-3 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-[#caa96b] focus:outline-none resize-none"
            />
          </div>

          {hasUsedToday && userPlan === 'freemium' && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-[#caa96b]/40 text-xs text-[#caa96b] space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ya has utilizado tu lectura gratuita de 3 cartas de hoy.</span>
              </p>
              <p className="text-zinc-300">
                Puedes repetir una tirada de práctica o desbloquear la legendaria <strong>Cruz Celta de 10 cartas ilimitada</strong> en el Plan Místico Pro.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleStartDraw}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#caa96b] via-[#dfc285] to-[#caa96b] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg gothic-ui-text text-base tracking-wide"
            >
              <Sparkles className="w-4 h-4" />
              <span>Barajar y Sacar 3 Cartas</span>
            </button>

            {hasUsedToday && userPlan === 'freemium' && (
              <button
                onClick={() => onOpenPricing('Cruz Celta (10 Cartas)')}
                className="py-3 px-4 rounded-xl border border-[#caa96b] text-[#caa96b] hover:bg-[#caa96b]/10 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Desbloquear Cruz Celta Pro</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* SPREAD BOARD WITH THE 3 CARDS */
        <div className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs text-zinc-400">Tu consulta:</span>
              <p className="text-sm font-serif font-semibold text-[#f5efe6]">
                "{question || 'Orientación para mi día'}"
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!allRevealed && (
                <button
                  onClick={handleRevealAll}
                  className="px-3.5 py-1.5 rounded-xl border border-[#caa96b]/50 text-[#caa96b] text-xs font-semibold hover:bg-[#caa96b]/10 transition-colors"
                >
                  Revelar todas
                </button>
              )}
              <button
                onClick={handleStartDraw}
                className="px-3.5 py-1.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Barajar de nuevo</span>
              </button>
            </div>
          </div>

          {/* 3 Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            {drawnCards.map((item, idx) => (
              <div key={item.card.id} className="flex flex-col items-center">
                <TarotCardView
                  card={item.card}
                  position={spread.positions[idx]}
                  revealed={item.revealed}
                  onReveal={() => handleRevealCard(idx)}
                  onInspect={onInspectCard}
                  size="lg"
                />

                {item.revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center max-w-[220px]"
                  >
                    <p className="text-xs font-semibold text-[#caa96b] font-serif">
                      {item.card.name}
                    </p>
                    <p className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2">
                      {item.card.core}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* AI INTERPRETATION CARD */}
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#121422] border border-[#caa96b]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2 text-[#caa96b]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-bold text-white">
                    Interpretación de la Tirada
                  </h3>
                </div>

                {userPlan !== 'freemium' ? (
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
                        <span>Guardar en mi perfil</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#caa96b]" />
                    <span>Guardar en historial requiere Plan Pro</span>
                  </span>
                )}
              </div>

              {isAnalyzing ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#caa96b] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-zinc-400 italic">
                    La oráculo de El Umbral está tejiendo los significados de tus 3 cartas...
                  </p>
                </div>
              ) : (
                readingResult && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-[#090a10]/80 border border-zinc-800 leading-relaxed text-sm text-zinc-200">
                      <p className="font-serif text-[#caa96b] text-base font-semibold mb-2">
                        Síntesis Temporal:
                      </p>
                      <p>{readingResult.synthesis}</p>
                    </div>

                    {/* Affirmation quote */}
                    {readingResult.oracleAffirmation && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#171120] to-[#121526] border-l-4 border-[#caa96b] text-sm italic text-[#fae5b9]">
                        {readingResult.oracleAffirmation}
                      </div>
                    )}
                  </div>
                )
              )}

              {/* 🌟 GANCHO COMERCIAL (THE USER'S EXPLICIT MONETIZATION HOOK) 🌟 */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#caa96b] bg-gradient-to-br from-[#1b1526] via-[#10121d] to-[#171024] p-6 sm:p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-[#caa96b]/10 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#caa96b] text-black text-[10px] font-bold uppercase tracking-wider">
                      El Gancho Oracular
                    </span>
                    <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      ¿Sientes que 3 cartas solo arañan la superficie?
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                      Desbloquea la <strong>Tirada Celta Completa de 10 cartas</strong>: el corazón del asunto, la fuerza cruzada, la raíz oculta, el entorno y el análisis profundo con Inteligencia Artificial.
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onOpenPricing('Cruz Celta (10 Cartas)')}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#caa96b] via-[#dfc285] to-[#caa96b] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-105"
                    >
                      <span>Pasar a Plan Místico Pro ($9.99/mes)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
