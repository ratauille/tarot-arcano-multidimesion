import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Crown, Lock, RotateCcw, Save, CheckCircle2, Moon, Sun, ArrowRight } from 'lucide-react';
import { TarotCard, SpreadConfig, PlanType, AIReadingResult, SavedReading } from '../types';
import { drawUniqueCards } from '../data/tarotCards';
import { TarotCardView } from './TarotCardView';
import { sound } from '../utils/sound';

interface AstrologicalSpreadProps {
  spread: SpreadConfig;
  userPlan: PlanType;
  onOpenPricing: (targetSpread?: string) => void;
  onInspectCard: (card: TarotCard) => void;
  onSaveReading: (reading: Omit<SavedReading, 'id' | 'date'>) => void;
}

export const AstrologicalSpread: React.FC<AstrologicalSpreadProps> = ({
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
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isLocked = userPlan !== 'elite';

  const handleStartDraw = () => {
    if (isLocked) {
      onOpenPricing('Tirada Astrológica Planetaria (10 Planetas)');
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

  useEffect(() => {
    if (allRevealed && !readingResult && !isAnalyzing) {
      setIsAnalyzing(true);
      fetch('/api/tarot/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim() || 'Mapa oracular de mis 10 energías planetarias',
          spreadType: 'astrological',
          cards: drawnCards.map((dc, i) => ({
            id: dc.card.id,
            name: dc.card.name,
            position: spread.positions[i]?.title || `Planeta ${i + 1}`,
            upright: true,
            planetaryRuler: spread.positions[i]?.title.split('—')[0].trim(),
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
          setReadingResult({
            synthesis: `Tu carta natal arquetípica revela una alineación singular: El Sol en tu tirada (${drawnCards[0].card.name}) ilumina tu vocación consciente, mientras la Luna (${drawnCards[1].card.name}) demanda contención en tu mundo íntimo. El trígono entre Mercurio y Júpiter (${drawnCards[2].card.name} y ${drawnCards[5].card.name}) favorece proyectos de gran escala, pero la lección kármica de Saturno (${drawnCards[6].card.name}) exige paciencia y estructura.`,
            crossCardDynamics: `La tensión entre Marte (${drawnCards[4].card.name}) y Venus (${drawnCards[3].card.name}) pide equilibrar tu impulso de conquista con la ternura en tus relaciones. Plutón (${drawnCards[9].card.name}) actúa como el transmutador definitivo de toda la carta.`,
            obstacleAction: 'Usa la sabiduría de Saturno para edificar límites firmes sin volverte inaccesible.',
            oracleAffirmation: '"Como es arriba, es abajo: las estrellas inclinan, pero mi consciencia soberana decide."',
            positionInsights: drawnCards.map((c, i) => ({
              cardName: c.card.name,
              position: spread.positions[i]?.title,
              interpretation: `Bajo la regencia de este planeta, ${c.card.name} manifiesta: ${c.card.core}`,
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
        question: question || 'Tirada Astrológica Planetaria',
        spreadId: 'astrological',
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
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/40 bg-purple-950/40 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Exclusivo Pase Élite · 10 Fuerzas Planetarias</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe6]">
          Tirada Astrológica Planetaria
        </h1>
        <p className="text-sm text-zinc-400">
          Correspondencias directas de Sol a Plutón (Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón). Mapea cada aspecto de tu destino.
        </p>
      </div>

      {/* LOCKED IF NOT ELITE */}
      {isLocked && !isReadingStarted && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-purple-500/60 bg-gradient-to-br from-[#181126] via-[#100e1c] to-[#1a1228] p-8 sm:p-12 shadow-2xl text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full border border-purple-400 bg-[#211636] flex items-center justify-center mx-auto shadow-lg text-purple-300">
            <Crown className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Tirada Exclusiva del Pase Élite Vitalicio
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              La <strong>Tirada Astrológica Planetaria</strong> integra las 10 cartas maestras con la tabla de regencias celestes (de Sol a Plutón). Requiere el <strong>Pase Élite ($49 USD pago único de por vida)</strong>.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onOpenPricing('Tirada Astrológica Planetaria')}
              className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Desbloquear Pase Élite ($49 USD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* INPUT IF UNLOCKED */}
      {!isLocked && !isReadingStarted && (
        <div className="max-w-xl mx-auto bg-[#131020] border border-purple-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
              Pregunta para tu mapa astrológico-oracular
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ejemplo: ¿Cómo están alineadas mis energías en amor, dinero, vocación y karma?"
              className="w-full h-28 p-3.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-purple-400 focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleStartDraw}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Invocar las 10 Regencias Planetarias</span>
          </button>
        </div>
      )}

      {/* SPREAD BOARD */}
      {isReadingStarted && drawnCards.length === 10 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs text-zinc-400">Consulta Planetaria:</span>
              <p className="text-sm font-serif font-semibold text-[#f5efe6]">
                "{question || 'Mapa de 10 Regencias Planetarias'}"
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!allRevealed && (
                <button
                  onClick={handleRevealAll}
                  className="px-3.5 py-1.5 rounded-xl border border-purple-400/50 text-purple-300 text-xs font-semibold hover:bg-purple-900/30 transition-colors"
                >
                  Revelar todos los planetas
                </button>
              )}
              <button
                onClick={handleStartDraw}
                className="px-3.5 py-1.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nueva lectura</span>
              </button>
            </div>
          </div>

          {/* Planetary Grid (5 x 2 or responsive) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
            {drawnCards.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <TarotCardView
                  card={item.card}
                  position={spread.positions[idx]}
                  revealed={item.revealed}
                  onReveal={() => handleRevealCard(idx)}
                  onInspect={onInspectCard}
                  size="md"
                />

                {item.revealed && (
                  <div className="mt-2 text-center max-w-[150px]">
                    <span className="text-xs font-serif font-bold text-purple-300 block truncate">
                      {item.card.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block truncate">
                      {spread.positions[idx].title.split('—')[1] || ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Reading */}
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#120f22] border border-purple-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2 text-purple-300">
                  <Crown className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-bold text-white">
                    Interpretación Astrológica con IA
                  </h3>
                </div>

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
              </div>

              {isAnalyzing ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-zinc-400 italic">
                    La oráculo está calculando los aspectos entre los 10 planetas...
                  </p>
                </div>
              ) : (
                readingResult && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-[#090812] border border-zinc-800 text-sm text-zinc-200 leading-relaxed">
                      <h4 className="font-serif text-purple-300 text-base font-semibold mb-2">
                        Síntesis del Mandala Planetario:
                      </h4>
                      <p className="whitespace-pre-line">{readingResult.synthesis}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs sm:text-sm text-zinc-200">
                      <strong className="text-purple-300 block mb-1">
                        ✦ Dinámica Cruzada Celestial:
                      </strong>
                      <p>{readingResult.crossCardDynamics}</p>
                    </div>

                    {readingResult.oracleAffirmation && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#170e24] to-[#120f26] border-l-4 border-purple-400 text-sm italic text-purple-200">
                        {readingResult.oracleAffirmation}
                      </div>
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
