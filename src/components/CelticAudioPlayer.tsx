import React, { useState, useRef, useEffect } from 'react';

export const CelticAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Enlace a pista ambiental mística/celta libre de derechos
  // Usamos la URL provista con fallback automático al archivo local garantizado
  const [currentSrc, setCurrentSrc] = useState<string>(
    '/celtic-mystical-fantasy-112166.mp3'
  );

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((e) => {
            console.log('Audio play blocked by browser or network:', e);
            // Intentar con la pista local de respaldo
            if (currentSrc !== '/celtic-mystical-fantasy-112166.mp3') {
              setCurrentSrc('/celtic-mystical-fantasy-112166.mp3');
              setTimeout(() => {
                audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
              }, 100);
            }
          });
      }
    }
  };

  const handleAudioError = () => {
    // Si la URL externa falla por restricciones CORS/CDN, conmutar inmediatamente a local
    if (currentSrc !== '/celtic-mystical-fantasy-112166.mp3') {
      console.info('Conmutando a pista ambiental celta local...');
      setCurrentSrc('/celtic-mystical-fantasy-112166.mp3');
    }
  };

  return (
    <div className="flex items-center gap-2 bg-[#0f111a]/85 border border-amber-500/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg hover:border-amber-500/50 transition-all">
      <audio
        ref={audioRef}
        src={currentSrc}
        loop
        preload="auto"
        onError={handleAudioError}
      />

      <button
        type="button"
        onClick={togglePlay}
        className="flex items-center gap-2 text-xs font-serif text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
        title={isPlaying ? 'Silenciar atmósfera' : 'Reproducir música mística celta'}
      >
        <span className={`text-base select-none ${isPlaying ? 'animate-pulse text-amber-400' : 'text-gray-400'}`}>
          {isPlaying ? '🔊' : '🔇'}
        </span>
        <span className="hidden sm:inline gothic-ui-text tracking-wider text-xs">
          {isPlaying ? 'Atmósfera Celta: Activa' : 'Música Mística'}
        </span>
      </button>
    </div>
  );
};
