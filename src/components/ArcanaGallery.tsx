import React, { useState } from 'react';
import { Sparkles, Search, Compass, Eye } from 'lucide-react';
import { MAJOR_ARCANA } from '../data/tarotCards';
import { TarotCard } from '../types';

interface ArcanaGalleryProps {
  onInspectCard: (card: TarotCard) => void;
}

export const ArcanaGallery: React.FC<ArcanaGalleryProps> = ({ onInspectCard }) => {
  const [filter, setFilter] = useState('');

  const filteredCards = MAJOR_ARCANA.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.core.toLowerCase().includes(filter.toLowerCase()) ||
      c.planetaryRuler?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section id="arcanos" className="py-16 sm:py-24 border-t border-zinc-800/80 bg-[#090a12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#caa96b] font-semibold">
              El Lenguaje del Mazo
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe6]">
              Los 22 Arcanos Mayores
            </h2>
            <p className="text-sm text-zinc-400">
              Pulsa cualquier carta para explorar sus correspondencias planetarias, potencial en luz, alerta en sombra y pregunta de autoindagación.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar por nombre o planeta..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121422] border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:border-[#caa96b] focus:outline-none"
            />
          </div>
        </div>

        {/* 22 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredCards.map((card) => (
            <button
              key={card.id}
              onClick={() => onInspectCard(card)}
              className="group p-2.5 rounded-xl bg-[#12131f] border border-zinc-800 hover:border-[#caa96b] transition-all flex flex-col text-left hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-[#caa96b]/20 mb-2 bg-black">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-1.5 rounded-full bg-[#caa96b] text-black shadow">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#caa96b] mb-0.5">
                <span className="font-serif font-bold">{card.number}</span>
                {card.planetaryRuler && (
                  <span className="text-[#48b4b4] truncate max-w-[70px]">{card.glyph} {card.planetaryRuler}</span>
                )}
              </div>

              <h4 className="font-serif text-xs font-bold text-white truncate">
                {card.name}
              </h4>
              <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5 leading-tight">
                {card.core}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
