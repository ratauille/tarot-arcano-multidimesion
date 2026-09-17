import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Video, Sparkles, Copy, Check, Share2, Smartphone, Volume2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { TarotCard } from '../types';
import { drawUniqueCards, MAJOR_ARCANA } from '../data/tarotCards';
import { sound } from '../utils/sound';

interface ViralContentStudioProps {
  onClose?: () => void;
}

const PRESET_TOPICS = [
  '¿Qué le depara el destino a Shakira según la Cruz Celta?',
  '¿Qué pasará con el futuro de Elon Musk y la IA?',
  '¿Volverá mi ex? La verdad que no quieres admitir',
  '¿Por qué sientes este bloqueo financiero en 2026?',
  '¿Qué secreto oculta tu próxima pareja?',
];

export const ViralContentStudio: React.FC<ViralContentStudioProps> = () => {
  const [topic, setTopic] = useState(PRESET_TOPICS[0]);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>(() => drawUniqueCards(3));
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptData, setScriptData] = useState<{
    hook: string;
    voiceover: string;
    visualNotes: string;
    caption: string;
    cta: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleShuffleCards = () => {
    setSelectedCards(drawUniqueCards(3));
    sound.playFlip();
  };

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    sound.playChime();

    try {
      const res = await fetch('/api/tarot/social-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          celebrityOrTopic: topic,
          cards: selectedCards,
        }),
      });
      const data = await res.json();
      setScriptData(data);
    } catch {
      setScriptData({
        hook: `¿Qué le depara realmente el destino a ${topic}? Mira lo que reveló la Cruz Celta... 🔮`,
        voiceover: `Pusimos a prueba a la IA de El Umbral con una lectura de 10 cartas. En el centro aparece ${selectedCards[0]?.name}, señalando una encrucijada crítica. Lo que parecía un obstáculo con ${selectedCards[1]?.name} en realidad desatará el desenlace con ${selectedCards[2]?.name}.`,
        visualNotes: 'Primer plano a la carta real girando sobre el tapete místico con partículas doradas.',
        caption: `Lectura oracular de ${topic} con la Cruz Celta y cartas reales 🌙 #Tarot #CruzCelta #ElUmbral #Destino #Astrologia #ViralTarot`,
        cta: 'Haz tu lectura gratuita diaria de 3 cartas en el enlace de nuestro perfil.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Header Banner - Fase 2 Marketing Strategy */}
      <div className="bg-gradient-to-r from-[#0c242b] via-[#121424] to-[#1a1226] border border-[#3da9a9]/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#3da9a9]/40 bg-[#0c242b]/80 text-[#3da9a9] text-xs font-semibold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>Fase 2: Estrategia de Contenido y Tráfico Orgánico ($0 Costo)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Estudio Viral para TikTok, Reels y YouTube Shorts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            El nicho del tarot es <strong>visualmente magnético</strong>. Genera lecturas a casos hipotéticos o famosos ("¿Qué le depara a [Celebridad]?") y muestra el contraste hipnótico entre las cartas reales y la revelación de la IA.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONFIGURATION AND GENERATED SCRIPT (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#121422] border border-zinc-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#caa96b]" />
              <span>1. Configura el Caso o Celebridad</span>
            </h3>

            {/* Topic Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_TOPICS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTopic(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all text-left truncate max-w-full ${
                    topic === preset
                      ? 'bg-[#3da9a9] text-black font-semibold'
                      : 'bg-[#181a2b] text-zinc-300 hover:text-white border border-zinc-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                O escribe tu propio caso para el video:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ejemplo: ¿Qué pasará con Shakira y Piqué según la Cruz Celta?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-[#3da9a9] focus:outline-none"
              />
            </div>

            {/* Cards Preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-zinc-400">
                  Cartas clave para mostrar en el video:
                </label>
                <button
                  type="button"
                  onClick={handleShuffleCards}
                  className="text-xs text-[#caa96b] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Barajar otras
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {selectedCards.map((c, i) => (
                  <div
                    key={c.id}
                    className="p-2 rounded-xl bg-[#090a10] border border-zinc-800 flex items-center gap-2"
                  >
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="w-8 h-12 rounded object-cover border border-[#caa96b]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#caa96b] block">#{i + 1}</span>
                      <span className="text-xs font-serif font-semibold text-white truncate block">
                        {c.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3da9a9] via-[#56c6c6] to-[#3da9a9] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generar Guion Viral con IA</span>
                </>
              )}
            </button>
          </div>

          {/* SCRIPT RESULT */}
          {scriptData && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-[#121422] border border-[#3da9a9]/40 space-y-5"
            >
              {/* Hook (0-3s) */}
              <div className="p-4 rounded-xl bg-[#090a10] border border-[#caa96b]/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#caa96b] uppercase tracking-wider">
                    ⚡ Gancho Verbal de los Primeros 3 Segundos
                  </span>
                  <button
                    onClick={() => handleCopyText(scriptData.hook, 'hook')}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'hook' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-sm font-serif font-bold text-white italic">
                  "{scriptData.hook}"
                </p>
              </div>

              {/* Voiceover Script */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#3da9a9]" />
                    <span>Guion de Locución (30 - 45 Segundos)</span>
                  </span>
                  <button
                    onClick={() => handleCopyText(scriptData.voiceover, 'voiceover')}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'voiceover' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'voiceover' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-[#090a10] border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                  {scriptData.voiceover}
                </div>
              </div>

              {/* Visual notes */}
              {scriptData.visualNotes && (
                <div className="p-3 rounded-xl bg-[#161a29] text-xs text-zinc-300">
                  <strong className="text-[#caa96b] block mb-0.5">Indicación de Escena:</strong>
                  <span>{scriptData.visualNotes}</span>
                </div>
              )}

              {/* Caption with Hashtags */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">
                    Pie de foto / Caption para TikTok / Reels:
                  </span>
                  <button
                    onClick={() => handleCopyText(scriptData.caption, 'caption')}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'caption' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'caption' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-[#090a10] border border-zinc-800 text-xs text-zinc-400">
                  {scriptData.caption}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: 9:16 VERTICAL VIDEO MOCKUP PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-[#3da9a9] font-semibold mb-3 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Vista Previa 9:16 (TikTok / Reels / Shorts)</span>
          </span>

          {/* Aesthetic 9:16 Frame */}
          <div
            id="viral-video-card"
            className="w-[300px] h-[533px] rounded-[32px] border-4 border-zinc-700 bg-gradient-to-b from-[#07080d] via-[#10121d] to-[#08090f] shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden select-none"
          >
            {/* Background Mystic Aura */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#caa96b]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#3da9a9]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar of phone */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400 border-b border-zinc-800/80 pb-2">
              <span className="font-serif tracking-widest text-[#caa96b] font-bold">✦ EL UMBRAL</span>
              <span className="px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-500/30 text-[9px] font-bold">
                REC · LIVE
              </span>
            </div>

            {/* Center Area: Contrasting real card artwork & viral prompt */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-3 space-y-3">
              {/* Hook banner */}
              <div className="w-full bg-black/70 backdrop-blur-sm border border-[#caa96b]/40 rounded-xl p-2.5 text-center shadow-lg">
                <span className="text-[9px] uppercase tracking-widest text-[#caa96b] font-bold block mb-0.5">
                  CRUZ CELTA REVELA:
                </span>
                <p className="font-serif text-xs font-bold text-white line-clamp-2 leading-tight">
                  {scriptData?.hook || topic}
                </p>
              </div>

              {/* Cards spread in fan */}
              <div className="relative w-44 h-56 flex items-center justify-center">
                {selectedCards.map((c, i) => {
                  const rotations = [-14, 0, 14];
                  const xOffsets = [-32, 0, 32];
                  return (
                    <motion.div
                      key={c.id}
                      animate={{ rotate: rotations[i], x: xOffsets[i] }}
                      className="absolute w-28 h-44 rounded-lg overflow-hidden border-2 border-[#caa96b] shadow-2xl bg-black"
                    >
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Mystical Quote overlay */}
              <div className="w-full bg-[#12131f]/90 border border-zinc-800 rounded-xl p-2.5 text-center">
                <span className="text-[9px] text-[#3da9a9] font-medium block">
                  {selectedCards[0]?.name} · {selectedCards[1]?.name} · {selectedCards[2]?.name}
                </span>
                <p className="text-[10px] text-zinc-300 italic line-clamp-2 mt-0.5">
                  "{selectedCards[0]?.core}"
                </p>
              </div>
            </div>

            {/* Bottom: CTA */}
            <div className="relative z-10 pt-2 border-t border-zinc-800 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#caa96b] to-[#dfc285] text-black text-[10px] font-bold shadow-md">
                Tirada diaria gratis en el link de bio 👆
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 text-center mt-3 max-w-xs">
            Usa esta vista previa estética para tus grabaciones de pantalla, Instagram Stories o portadas de Reels.
          </p>
        </div>
      </div>
    </div>
  );
};
