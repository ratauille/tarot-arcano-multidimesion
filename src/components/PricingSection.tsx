import React from 'react';
import { Check, Sparkles, Zap, Crown, Shield, ArrowRight, HelpCircle } from 'lucide-react';
import { PlanType } from '../types';

interface PricingSectionProps {
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onOpenCheckout: (plan: PlanType) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  currentPlan,
  onSelectPlan,
  onOpenCheckout,
}) => {
  return (
    <section id="precios" className="py-16 sm:py-24 border-t border-zinc-800/80 bg-[#07080e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#caa96b]/30 bg-[#121422] text-[#caa96b] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estructura de Precios Oficial</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe6]">
            Diseñado para Acompañar tu Camino Oracular
          </h2>
          <p className="text-sm text-zinc-400">
            Comienza gratis con tu lectura diaria de 3 cartas y da el salto a la Tirada Celta con IA profunda cuando necesites respuestas mayores.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {/* FREEMIUM */}
          <div className="rounded-2xl p-7 border border-zinc-800 bg-[#0c0d16] flex flex-col justify-between hover:border-zinc-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Plan de Atracción
                </span>
                {currentPlan === 'freemium' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-[#caa96b] text-[10px] font-bold">
                    Activo
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">Freemium</h3>
              <p className="text-xs text-zinc-400 mt-1">
                La puerta de entrada: conecta diariamente con tu intuición y los 22 Arcanos.
              </p>

              <div className="my-6 pb-6 border-b border-zinc-800">
                <span className="font-serif text-4xl font-bold text-white">$0</span>
                <span className="text-xs text-zinc-400 ml-1.5">Gratis siempre</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                  <span><strong>1 lectura básica al día</strong> de 3 cartas (pasado, presente, futuro).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                  <span>Imágenes reales del tarot Rider-Waite en alta resolución.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                  <span>Significados completos de Luz, Sombra y preguntas de autoindagación.</span>
                </li>
                <li className="flex items-start gap-2 text-zinc-600 line-through">
                  <span>Tirada Celta de 10 cartas</span>
                </li>
                <li className="flex items-start gap-2 text-zinc-600 line-through">
                  <span>Análisis cruzado con Inteligencia Artificial</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800">
              <button
                onClick={() => onSelectPlan('freemium')}
                className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold"
              >
                {currentPlan === 'freemium' ? 'Tu Plan Actual' : 'Usar Freemium'}
              </button>
            </div>
          </div>

          {/* PLAN MÍSTICO PRO */}
          <div className="rounded-2xl p-7 border-2 border-[#caa96b] bg-gradient-to-b from-[#161828] to-[#0f111e] flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#caa96b] to-[#e2c58a] text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
              Recomendado · Más Elegido
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#caa96b]">
                  Suscripción Mensual
                </span>
                {currentPlan === 'pro' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#caa96b]/20 text-[#caa96b] text-[10px] font-bold border border-[#caa96b]/40">
                    Activo
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">Plan Místico Pro</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Para buscadores constantes que requieren claridad profunda sin límites de consulta.
              </p>

              <div className="my-6 pb-6 border-b border-[#caa96b]/20">
                <span className="font-serif text-4xl font-bold text-[#caa96b]">$9.99</span>
                <span className="text-xs text-zinc-400 ml-1.5">USD / mes</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-200">
                <li className="flex items-start gap-2 font-semibold text-white">
                  <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                  <span><strong>Lecturas ilimitadas de la Tirada Celta</strong> (10 cartas).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                  <span><strong>Interpretación avanzada de IA</strong> (síntesis psicológica y desenlace).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                  <span><strong>Análisis cruzado de relaciones entre cartas</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                  <span><strong>Guardar historial ilimitado</strong> en tu perfil privado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                  <span>Sin límites de consultas diarias.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#caa96b]/20">
              <button
                onClick={() => onOpenCheckout('pro')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#caa96b] via-[#dfc285] to-[#caa96b] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Suscribirme a Místico Pro ($9.99/mes)</span>
              </button>
            </div>
          </div>

          {/* PASE ÉLITE */}
          <div className="rounded-2xl p-7 border border-purple-500/40 bg-[#120f22] flex flex-col justify-between hover:border-purple-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-purple-300">
                  Pago Único / Lifetime
                </span>
                {currentPlan === 'elite' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-200 text-[10px] font-bold border border-purple-500/40">
                    Vitalicio
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-400" />
                <span>Pase Élite</span>
              </h3>
              <p className="text-xs text-zinc-300 mt-1">
                Un único pago hoy. Acceso vitalicio a todas las tiradas y futuras expansiones.
              </p>

              <div className="my-6 pb-6 border-b border-purple-500/20">
                <span className="font-serif text-4xl font-bold text-purple-300">$49</span>
                <span className="text-xs text-zinc-400 ml-1.5">USD (Pago Único Para Siempre)</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-200">
                <li className="flex items-start gap-2 font-semibold text-white">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Acceso de por vida a todas las tiradas</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Cruz Celta (10 cartas) ilimitada con IA profunda.</span>
                </li>
                <li className="flex items-start gap-2 font-medium text-purple-200">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Tirada Astrológica Planetaria (10 cartas)</strong> de Sol a Plutón.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Cruz Mística Sagrada (7 cartas).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Todas las futuras actualizaciones y barajas incluidas.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-purple-500/20">
              <button
                onClick={() => onOpenCheckout('elite')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Obtener Pase Élite ($49 Lifetime)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Commercial Roadmap Banner (Fase 1, 2, 3) */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-[#0e101a] border border-zinc-800 max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#caa96b] font-semibold block mb-2">
            🗺️ Ruta de Comercialización & Escalado
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-3">
            <div className="space-y-1.5 p-3 rounded-xl bg-[#090a10] border border-zinc-800">
              <strong className="text-white block font-serif text-sm">Fase 1: MVP Limpio</strong>
              <p className="text-zinc-400">
                Landing page limpia enfocada en la Tirada Celta con pasarela de pagos rápida (Stripe / Lemon Squeezy).
              </p>
            </div>
            <div className="space-y-1.5 p-3 rounded-xl bg-[#090a10] border border-zinc-800">
              <strong className="text-[#3da9a9] block font-serif text-sm">Fase 2: Tráfico Orgánico ($0)</strong>
              <p className="text-zinc-400">
                Videos virales para TikTok/Reels mostrando casos hipotéticos y famosos con contraste estético de cartas reales + IA.
              </p>
            </div>
            <div className="space-y-1.5 p-3 rounded-xl bg-[#090a10] border border-zinc-800">
              <strong className="text-purple-300 block font-serif text-sm">Fase 3: Curso + Mentoría</strong>
              <p className="text-zinc-400">
                Monetización avanzada tipo info-producto con guías herméticas y masterclasses de tarot arquetípico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
