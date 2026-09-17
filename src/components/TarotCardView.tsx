import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, Info } from 'lucide-react';
import { TarotCard, SpreadPosition } from '../types';
import { sound } from '../utils/sound';

interface TarotCardViewProps {
  card?: TarotCard;
  position?: SpreadPosition;
  revealed: boolean;
  onReveal?: () => void;
  onInspect?: (card: TarotCard) => void;
  isCrossed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  position,
  revealed,
  onReveal,
  onInspect,
  isCrossed = false,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-40 text-xs',
    md: 'w-36 h-60 text-sm',
    lg: 'w-48 h-80 text-base',
  }[size];

  const handleClick = () => {
    if (!revealed && onReveal) {
      sound.playFlip();
      onReveal();
    } else if (revealed && card && onInspect) {
      onInspect(card);
    }
  };

  return (
    <div className={`relative perspective-1000 select-none ${className}`}>
      {/* Position Header Tag if provided */}
      {position && (
        <div className="mb-1 text-center truncate px-1">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#caa96b] font-medium block truncate">
            {position.title.split('—')[0]}
          </span>
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`relative ${sizeClasses} cursor-pointer transition-transform duration-500 rounded-xl preserve-3d group ${
          isCrossed ? 'rotate-90 z-20 shadow-2xl' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `${revealed ? 'rotateY(180deg)' : 'rotateY(0deg)'} ${isCrossed ? 'rotate(90deg)' : ''}`,
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* BACK OF CARD */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl border border-[#caa96b]/40 bg-[#12131c] shadow-xl overflow-hidden backface-hidden flex flex-col items-center justify-between p-3"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full flex justify-between items-center text-[#caa96b]/40 text-[10px]">
            <span>✦</span>
            <span>EL UMBRAL</span>
            <span>✦</span>
          </div>

          <div className="relative flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#caa96b]/30 flex items-center justify-center relative">
              <div className="absolute inset-1 rounded-full border border-dashed border-[#caa96b]/20 animate-spin-slow" />
              <div className="text-2xl sm:text-3xl text-[#caa96b] font-serif">☉</div>
            </div>
            <p className="mt-2 text-[10px] text-[#caa96b]/70 tracking-widest uppercase text-center font-medium">
              Toca para revelar
            </p>
          </div>

          <div className="w-full flex justify-between items-center text-[#caa96b]/40 text-[10px]">
            <span>☾</span>
            <span className="tracking-widest">ORÁCULO</span>
            <span>☽</span>
          </div>
        </div>

        {/* FRONT OF CARD */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl border-2 border-[#caa96b] bg-[#0d0e17] shadow-2xl overflow-hidden backface-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {card && (
            <>
              {/* Top Banner with Number and Planetary Ruler */}
              <div className="bg-gradient-to-r from-[#17101c] via-[#1b1c2b] to-[#17101c] px-2 py-1 flex items-center justify-between border-b border-[#caa96b]/30 text-[11px] text-[#caa96b]">
                <span className="font-serif font-bold tracking-wider">{card.number}</span>
                {card.planetaryRuler && (
                  <span className="text-[10px] text-[#48b4b4] font-medium flex items-center gap-1">
                    <span>{card.glyph}</span>
                    <span className="hidden sm:inline">{card.planetaryRuler}</span>
                  </span>
                )}
              </div>

              {/* Card Image Area */}
              <div className="relative flex-1 bg-black/40 overflow-hidden flex items-center justify-center">
                {!imgError ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImgError(true)}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${card.fallbackGradient} flex flex-col items-center justify-center p-3 text-center`}
                  >
                    <span className="text-4xl text-[#caa96b] mb-2">{card.glyph}</span>
                    <span className="font-serif text-sm font-semibold text-[#f5efe6]">{card.name}</span>
                    <span className="text-[10px] text-zinc-300 mt-1 line-clamp-2">{card.core}</span>
                  </div>
                )}

                {/* Inspect overlay icon on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-1.5 rounded-full bg-[#caa96b] text-black text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Detalles</span>
                  </span>
                </div>
              </div>

              {/* Bottom Card Title */}
              <div className="bg-[#12131e] px-2 py-1.5 text-center border-t border-[#caa96b]/30">
                <p className="font-serif text-xs sm:text-sm font-semibold text-[#fae5b9] tracking-wide truncate">
                  {card.name}
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
