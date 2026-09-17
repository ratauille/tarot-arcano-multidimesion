import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Crown, RotateCcw, Save, CheckCircle2, ArrowRight } from 'lucide-react';
import { TarotCard, SpreadConfig, PlanType, AIReadingResult, SavedReading } from '../types';
import { drawUniqueCards } from '../data/tarotCards';
import { TarotCardView } from './TarotCardView';
import { sound } from '../utils/sound';

interface MysticCrossSpreadProps {
  spread: SpreadConfig;
  userPlan: PlanType;
  onOpenPricing: (targetSpread?: string) => void;
  onInspectCard: (card: TarotCard) => void;
  onSaveReading: (reading: Omit<SavedReading, 'id' | 'date'>) => void;
}

export const MysticCrossSpread: React.FC<MysticCrossSpreadProps> = ({
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
      onOpenPricing('Cruz Mística (7 Cartas)');
      return;
    }

    const cards = drawUniqueCards(7);
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

  const allRevealed = drawnCards.length === 7 && drawnCards.every((c) => c.revealed);

  useEffect(() => {
    if (allRevealed && !readingResult && !isAnalyzing) {
      setIsAnalyzing(true);
      fetch('/api/tarot/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim() || 'Alquimia interior con la Cruz Mística',
          spreadType: 'mystic_cross',
          cards: drawnCards.map((dc, i) => ({
            id: dc.card.id,
            name: dc.card.name,
            position: spread.positions[i]?.title,
            upright: true,
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
            synthesis: `El centro de tu alma acoge a ${drawnCards[0].card.name}, canalizando el don de recibir (${drawnCards[1].card.name}) con el deber de ofrendar (${drawnCards[2].card.name}). La guía superior (${drawnCards[4].card.name}) te muestra que el puente de transmutación (${drawnCards[5].card.name}) está listo para anclarse en tu destino despierto (${drawnCards[6].card.name}).`,
            crossCardDynamics: 'El equilibrio entre dar y recibir sostiene todo el templo de tu vida.',
            obstacleAction: 'Deja de cargar pesos que no te corresponden y permite que el arquetipo tutor te guíe.',
            oracleAffirmation: '"En el crisol del corazón, toda sombra se transmuta en oro espiritual."',
            positionInsights: drawnCards.map((c, i) => ({
              cardName: c.card.name,
              position: spread.positions[i]?.title,
              interpretation: `${c.card.name} actúa como guía en este punto: ${c.card.core}`,
              advice: c.card.prompt,
            })),
          });
          setIsAnalyzing(false);
        });
    }
  }, [allRevealed, drawnCards, question, spread, userPlan]);

  const handleSave = () => {
    if (drawnCards.length === 7) {
      onSaveReading({
        question: question || 'Cruz Mística',
        spreadId: 'mystic_cross',
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
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/40 bg-purple-950/40 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Exclusivo Pase Élite · 7 Cartas de Alquimia</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe6]">
          Cruz Mística
        </h1>
        <p className="text-sm text-zinc-400">
          El eje sagrado de transmutación personal. Resuelve dilemas éticos y profundos entre espíritu, tierra, dar y recibir.
        </p>
      </div>

      {isLocked && !isReadingStarted && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-purple-500/60 bg-gradient-to-br from-[#181126] via-[#100e1c] to-[#1a1228] p-8 sm:p-12 shadow-2xl text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full border border-purple-400 bg-[#211636] flex items-center justify-center mx-auto shadow-lg text-purple-300">
            <Crown className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Tirada Exclusiva del Pase Élite
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              La <strong>Cruz Mística de 7 cartas</strong> está reservada para portadores del Pase Élite Vitalicio ($49 USD).
            </p>
          </div>
          <button
            onClick={() => onOpenPricing('Cruz Mística (7 Cartas)')}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-xl inline-flex items-center gap-2"
          >
            <span>Desbloquear Pase Élite ($49 USD)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {!isLocked && !isReadingStarted && (
        <div className="max-w-xl mx-auto bg-[#131020] border border-purple-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
            Pregunta o dilema para la Cruz Mística
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ejemplo: ¿Qué debo liberar y qué debo cultivar para reencontrar mi paz?"
            className="w-full h-28 p-3.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-purple-400 focus:outline-none resize-none"
          />
          <button
            onClick={handleStartDraw}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Desplegar la Cruz Mística (7 Cartas)</span>
          </button>
        </div>
      )}

      {isReadingStarted && drawnCards.length === 7 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs text-zinc-400">Consulta Mística:</span>
              <p className="text-sm font-serif font-semibold text-[#f5efe6]">
                "{question || 'Cruz Mística'}"
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!allRevealed && (
                <button
                  onClick={handleRevealAll}
                  className="px-3.5 py-1.5 rounded-xl border border-purple-400/50 text-purple-300 text-xs font-semibold hover:bg-purple-900/30 transition-colors"
                >
                  Revelar todas
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

          {/* 7 Cards Layout (Cross shape) */}
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Top: Card 5 (Guía Superior) */}
            <TarotCardView
              card={drawnCards[4].card}
              position={spread.positions[4]}
              revealed={drawnCards[4].revealed}
              onReveal={() => handleRevealCard(4)}
              onInspect={onInspectCard}
              size="md"
            />

            {/* Horizontal Row: Card 2 (Recibes), Card 1 (Centro), Card 3 (Entregas) */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 items-center">
              <TarotCardView
                card={drawnCards[1].card}
                position={spread.positions[1]}
                revealed={drawnCards[1].revealed}
                onReveal={() => handleRevealCard(1)}
                onInspect={onInspectCard}
                size="md"
              />
              <TarotCardView
                card={drawnCards[0].card}
                position={spread.positions[0]}
                revealed={drawnCards[0].revealed}
                onReveal={() => handleRevealCard(0)}
                onInspect={onInspectCard}
                size="md"
              />
              <TarotCardView
                card={drawnCards[2].card}
                position={spread.positions[2]}
                revealed={drawnCards[2].revealed}
                onReveal={() => handleRevealCard(2)}
                onInspect={onInspectCard}
                size="md"
              />
            </div>

            {/* Bottom: Card 4 (Ancla Terrenal) */}
            <TarotCardView
              card={drawnCards[3].card}
              position={spread.positions[3]}
              revealed={drawnCards[3].revealed}
              onReveal={() => handleRevealCard(3)}
              onInspect={onInspectCard}
              size="md"
            />

            {/* Bridge & Destiny: Cards 6 & 7 */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-4 border-t border-purple-900/30 w-full max-w-lg">
              <TarotCardView
                card={drawnCards[5].card}
                position={spread.positions[5]}
                revealed={drawnCards[5].revealed}
                onReveal={() => handleRevealCard(5)}
                onInspect={onInspectCard}
                size="md"
              />
              <TarotCardView
                card={drawnCards[6].card}
                position={spread.positions[6]}
                revealed={drawnCards[6].revealed}
                onReveal={() => handleRevealCard(6)}
                onInspect={onInspectCard}
                size="md"
              />
            </div>
          </div>

          {/* AI Result */}
          {allRevealed && readingResult && (
            <div className="p-6 rounded-2xl bg-[#131024] border border-purple-500/40 space-y-4">
              <h4 className="font-serif text-lg font-bold text-purple-300">
                Alquimia de la Cruz Mística
              </h4>
              <p className="text-sm text-zinc-200 leading-relaxed">
                {readingResult.synthesis}
              </p>
              {readingResult.oracleAffirmation && (
                <p className="p-3 rounded-xl bg-purple-950/40 border-l-2 border-purple-400 text-xs italic text-purple-200">
                  {readingResult.oracleAffirmation}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
