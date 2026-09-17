import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';

export interface OracleAgentCard {
  positionName: string;
  cardName: string;
  isReversed: boolean;
}

export interface OracleAgentProps {
  spreadType: string;
  question: string;
  cards: Array<OracleAgentCard>;
  className?: string;
}

export const OracleAgentStream: React.FC<OracleAgentProps> = ({
  spreadType,
  question,
  cards,
  className = '',
}) => {
  const [reading, setReading] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const consultOracle = async () => {
    if (!cards || cards.length === 0) return;
    setLoading(true);
    setErrorNotice(null);

    try {
      const res = await fetch('/api/oracle/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadType, question, cards }),
      });
      const data = await res.json();
      if (data.success && data.reading) {
        setReading(data.reading);
      } else {
        setErrorNotice(data.error || 'No se pudo canalizar la lectura.');
      }
    } catch (err) {
      console.error('Error al conectar con el agente oracular:', err);
      setErrorNotice('Error de conexión con el agente oracular.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!reading) return;
    navigator.clipboard.writeText(reading);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`mt-6 p-6 rounded-2xl bg-[#0f111a]/95 border border-amber-500/30 rune-glow transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
        <div>
          <h3 className="text-xl font-serif text-amber-300 flex items-center gap-2 font-medium">
            <span className="text-amber-400">✦</span> Agente Oracular en Tiempo Real
          </h3>
          <p className="text-sm text-gray-300 mt-1 font-light">
            Permite que la inteligencia arquetípica entrelace las posiciones de tu {spreadType}.
          </p>
        </div>

        {reading && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-zinc-800 text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={consultOracle}
          disabled={loading || cards.length === 0}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 hover:shadow-amber-500/20"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
              <span>Canalizando mensajes...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{reading ? 'Volver a Canalizar' : 'Revelar Interpretación Profunda'}</span>
            </>
          )}
        </button>
      </div>

      {errorNotice && (
        <p className="mt-3 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/40">
          {errorNotice}
        </p>
      )}

      {reading && (
        <div className="mt-6 p-5 sm:p-6 bg-black/50 rounded-xl border border-amber-500/20 text-gray-200 leading-relaxed font-serif text-sm sm:text-base whitespace-pre-line shadow-inner">
          {reading}
        </div>
      )}
    </div>
  );
};
