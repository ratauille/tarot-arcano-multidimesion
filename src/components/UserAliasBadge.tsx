import React, { useState } from 'react';
import { Shield, Sparkles, Edit3, Dices, Check, X } from 'lucide-react';
import { useUserAlias } from '../utils/userAlias';

export const UserAliasBadge: React.FC = () => {
  const { alias, updateAlias, regenerateAlias } = useUserAlias();
  const [isOpen, setIsOpen] = useState(false);
  const [tempAlias, setTempAlias] = useState(alias);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleOpen = () => {
    setTempAlias(alias);
    setIsOpen(true);
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempAlias.trim()) {
      updateAlias(tempAlias.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setIsOpen(false);
      }, 700);
    }
  };

  const handleRollRandom = () => {
    const fresh = regenerateAlias();
    setTempAlias(fresh);
  };

  return (
    <>
      {/* Clickable Badge */}
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#caa96b]/30 bg-[#121422]/90 hover:bg-[#1a1d2e] hover:border-[#caa96b]/60 transition-all text-xs text-zinc-300 group shadow-sm"
        title="Tu espacio privado local: sin correos ni datos personales"
      >
        <Shield className="w-3.5 h-3.5 text-[#caa96b] group-hover:scale-110 transition-transform" />
        <span className="font-serif text-white tracking-wide truncate max-w-[130px] sm:max-w-[170px]">
          {alias}
        </span>
        <Edit3 className="w-3 h-3 text-zinc-500 group-hover:text-[#caa96b] transition-colors" />
      </button>

      {/* Modal / Dialog for Private Alias Customization */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0e101a] border border-[#caa96b]/40 rounded-2xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-[#caa96b]/10 border border-[#caa96b]/30 text-[#caa96b]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Espacio Personal Privado</h3>
                <p className="text-xs text-zinc-400">Identificador local · Sin correos ni registros</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed my-3 bg-[#141624] p-3 rounded-xl border border-zinc-800">
              En <strong className="text-[#caa96b]">El Umbral</strong> valoramos tu intimidad. Todas tus tiradas, notas y reflexiones quedan consagradas a tu alias local y residen exclusivamente en tu navegador.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#caa96b] mb-1.5">
                  Tu Alias o Título Místico
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={40}
                    value={tempAlias}
                    onChange={(e) => setTempAlias(e.target.value)}
                    placeholder="Ej. Frankocheff, Oráculo del Roble..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090f] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-[#caa96b] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRollRandom}
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-zinc-800 hover:bg-[#caa96b] hover:text-black text-zinc-300 text-xs transition-colors flex items-center gap-1"
                    title="Generar nuevo título místico al azar"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">Aleatorio</span>
                  </button>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Alias actualizado en tu espacio sagrado</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 text-xs font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#caa96b] to-[#e0c489] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Guardar Alias</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
