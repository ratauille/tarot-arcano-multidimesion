import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Compass, ShieldAlert, Sun, HelpCircle } from 'lucide-react';
import { TarotCard } from '../types';

interface CardInspectorModalProps {
  card: TarotCard | null;
  onClose: () => void;
}

export const CardInspectorModal: React.FC<CardInspectorModalProps> = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-[#11131e] border border-[#caa96b]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-[#caa96b] hover:bg-[#caa96b] hover:text-black transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left card artwork preview */}
          <div className="md:w-5/12 bg-black/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#caa96b]/20">
            <div className="relative w-44 h-72 rounded-xl overflow-hidden border-2 border-[#caa96b] shadow-2xl">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#caa96b]">
              <span className="font-serif text-base font-bold">{card.number}</span>
              <span>·</span>
              <span>{card.glyph}</span>
              {card.planetaryRuler && (
                <>
                  <span>·</span>
                  <span className="text-[#48b4b4] font-medium">Regente: {card.planetaryRuler}</span>
                </>
              )}
            </div>
          </div>

          {/* Right details */}
          <div className="md:w-7/12 p-6 overflow-y-auto space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#caa96b] font-medium">
                Arcano Mayor {card.number}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#f5efe6] mt-0.5">
                {card.name}
              </h3>
              <p className="text-sm text-zinc-300 mt-2 italic leading-relaxed">
                "{card.core}"
              </p>
            </div>

            {/* Light / Shadow Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#16201b]/80 border border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Sun className="w-3.5 h-3.5" />
                  <span>En Luz / Potencial</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {card.light}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#201518]/80 border border-rose-500/20">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>En Sombra / Alerta</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {card.shadow}
                </p>
              </div>
            </div>

            {/* Reflection question */}
            <div className="p-3.5 rounded-xl bg-[#171a2b] border border-[#caa96b]/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#caa96b]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pregunta de Autoindagación</span>
              </div>
              <p className="text-xs text-zinc-200 mt-1.5 font-medium leading-relaxed">
                {card.prompt}
              </p>
            </div>

            {card.element && (
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-800">
                <span>Elemento alquímico: <strong className="text-zinc-200">{card.element}</strong></span>
                {card.planetaryRuler && (
                  <span>Correspondencia: <strong className="text-[#48b4b4]">{card.planetaryRuler}</strong></span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
