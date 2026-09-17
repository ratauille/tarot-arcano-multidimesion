import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, X, Trash2, Calendar, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { SavedReading, PlanType } from '../types';

interface SavedReadingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReadings: SavedReading[];
  onDeleteReading: (id: string) => void;
  userPlan: PlanType;
  onOpenPricing: () => void;
}

export const SavedReadingsModal: React.FC<SavedReadingsModalProps> = ({
  isOpen,
  onClose,
  savedReadings,
  onDeleteReading,
  userPlan,
  onOpenPricing,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-[#0e101c] border border-[#caa96b]/40 rounded-2xl shadow-2xl p-6 max-h-[85vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-[#caa96b] hover:bg-[#caa96b] hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
            <div className="p-2 rounded-xl bg-[#caa96b]/20 text-[#caa96b]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                Tu Historial de Lecturas Oraculares
              </h3>
              <p className="text-xs text-zinc-400">
                {savedReadings.length} lecturas guardadas en tu espacio privado local (sin registros ni rastreo)
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {savedReadings.length === 0 ? (
              <div className="py-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center mx-auto text-zinc-500">
                  <History className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-base font-bold text-white">
                  Aún no has guardado ninguna lectura
                </h4>
                <p className="text-xs text-zinc-400">
                  Al completar una Tirada Diaria, Cruz Celta o Astrológica, pulsa el botón <strong>"Guardar en mi perfil"</strong> para revisarla cuando lo desees.
                </p>
                {userPlan === 'freemium' && (
                  <div className="pt-2">
                    <button
                      onClick={onOpenPricing}
                      className="px-4 py-2 rounded-xl bg-[#caa96b] text-black text-xs font-bold hover:brightness-110"
                    >
                      Ver Planes Pro y Élite
                    </button>
                  </div>
                )}
              </div>
            ) : (
              savedReadings.map((reading) => (
                <div
                  key={reading.id}
                  className="p-4 rounded-xl bg-[#131525] border border-zinc-800 hover:border-[#caa96b]/40 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-[#caa96b] font-semibold uppercase tracking-wider">
                          {reading.spreadName}
                        </span>
                        {reading.alias && (
                          <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700/50">
                            {reading.alias}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-base font-bold text-white">
                        "{reading.question}"
                      </h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(reading.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={() => onDeleteReading(reading.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Eliminar del historial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cards drawn thumbnails */}
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {reading.cards.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#090a10] border border-zinc-800 shrink-0"
                      >
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-5 h-8 rounded object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-zinc-300 font-medium">
                          {c.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Synthesis excerpt */}
                  {reading.aiResult?.synthesis && (
                    <p className="text-xs text-zinc-300 bg-[#090a10] p-3 rounded-lg border border-zinc-800/80 line-clamp-3 italic">
                      "{reading.aiResult.synthesis}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
