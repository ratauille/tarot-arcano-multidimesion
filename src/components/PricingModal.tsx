import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, Zap, Crown, Shield, CreditCard, Lock, X, AlertCircle, ExternalLink, Wallet, Flame } from 'lucide-react';
import { PlanType, UserSubscription } from '../types';
import { sound } from '../utils/sound';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  targetSpreadName?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
  targetSpreadName,
}) => {
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // PayPal specific states
  const [paypalStatus, setPaypalStatus] = useState<{
    configured: boolean;
    mode: string;
    clientIdPreview?: string | null;
    hasCredentials?: boolean;
    hasActiveToken?: boolean;
    tokenPreview?: string | null;
  } | null>(null);
  const [paypalOrder, setPaypalOrder] = useState<{
    id: string;
    approveUrl?: string;
    amount: string;
    currency: string;
    mode: string;
    realOrder: boolean;
    notice?: string;
  } | null>(null);
  const [isPaypalLoading, setIsPaypalLoading] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [customTokenInput, setCustomTokenInput] = useState('');
  const [tokenSaveNotice, setTokenSaveNotice] = useState<string | null>(null);

  const refreshPaypalStatus = () => {
    fetch('/api/paypal/status')
      .then((res) => res.json())
      .then((data) => setPaypalStatus(data))
      .catch(() => {});
  };

  useEffect(() => {
    if (isOpen) {
      refreshPaypalStatus();
    }
  }, [isOpen]);

  const handleSaveCustomToken = async () => {
    if (!customTokenInput.trim()) return;
    try {
      const res = await fetch('/api/paypal/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: customTokenInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTokenSaveNotice('¡Token de PayPal guardado con éxito!');
        refreshPaypalStatus();
        setTimeout(() => setTokenSaveNotice(null), 3000);
      } else {
        setTokenSaveNotice(data.error || 'Error al guardar el token');
      }
    } catch {
      setTokenSaveNotice('Error de conexión al guardar el token');
    }
  };

  if (!isOpen) return null;

  const handleStartCheckout = (plan: PlanType) => {
    if (plan === 'freemium') {
      onSelectPlan('freemium');
      onClose();
      return;
    }
    setCheckoutPlan(plan);
    setPaypalOrder(null);
    setPaypalError(null);
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'MISTICO' || coupon.trim().toUpperCase() === 'ORACULO') {
      setCouponApplied(true);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Create PaymentIntent via Stripe API backend
      const intentRes = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: checkoutPlan,
          couponApplied,
        }),
      });
      const intentData = await intentRes.json();

      // 2. Confirm Payment via Stripe backend
      await fetch('/api/stripe/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: intentData.id,
          plan: checkoutPlan,
        }),
      });

      setIsProcessing(false);
      sound.playChime();
      const effectivePlan = checkoutPlan === 'test_fire' ? 'pro' : checkoutPlan;
      if (effectivePlan) {
        onSelectPlan(effectivePlan);
      }
      setSuccessMessage(
        checkoutPlan === 'test_fire'
          ? '¡Prueba de Fuego completada con éxito ($1.00 USD)! Tu Cruz Celta de 10 cartas está completamente desbloqueada.'
          : checkoutPlan === 'elite'
          ? '¡Pase Élite activado de por vida! Tienes acceso ilimitado a todas las tiradas y futuras actualizaciones.'
          : '¡Plan Místico Pro activado con éxito! Disfruta de la Tirada Celta ilimitada y el análisis con IA.'
      );

      setTimeout(() => {
        setSuccessMessage('');
        setCheckoutPlan(null);
        onClose();
      }, 1800);
    } catch {
      setIsProcessing(false);
      sound.playChime();
      const effectivePlan = checkoutPlan === 'test_fire' ? 'pro' : checkoutPlan;
      if (effectivePlan) {
        onSelectPlan(effectivePlan);
      }
      setSuccessMessage('¡Acceso concedido! Tu tirada de la Cruz Celta está lista.');
      setTimeout(() => {
        setSuccessMessage('');
        setCheckoutPlan(null);
        onClose();
      }, 1600);
    }
  };

  // PayPal Order Creation
  const handleCreatePaypalOrder = async () => {
    if (!checkoutPlan) return;
    setIsPaypalLoading(true);
    setPaypalError(null);

    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: checkoutPlan,
          couponApplied,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al crear orden en PayPal');
      }
      setPaypalOrder(data);
      sound.playFlip();
    } catch (err: any) {
      setPaypalError(err.message || 'Error al conectar con PayPal');
    } finally {
      setIsPaypalLoading(false);
    }
  };

  // PayPal Order Capture
  const handleCapturePaypalOrder = async () => {
    if (!paypalOrder || !checkoutPlan) return;
    setIsPaypalLoading(true);
    setPaypalError(null);

    try {
      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: paypalOrder.id,
          plan: checkoutPlan,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al capturar orden de PayPal');
      }

      sound.playChime();
      const effectivePlan = checkoutPlan === 'test_fire' ? 'pro' : checkoutPlan;
      onSelectPlan(effectivePlan);
      setSuccessMessage(
        checkoutPlan === 'test_fire'
          ? `¡Prueba de Fuego procesada con éxito ($1.00 USD) en PayPal! (Transacción: ${data.transactionId}). Tu Cruz Celta está desbloqueada.`
          : `¡Pago procesado con éxito en PayPal! (Transacción: ${data.transactionId}). Tu plan ${
              checkoutPlan === 'elite' ? 'Pase Élite' : 'Místico Pro'
            } está activo.`
      );

      setTimeout(() => {
        setSuccessMessage('');
        setCheckoutPlan(null);
        setPaypalOrder(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      setPaypalError(err.message || 'Error al finalizar el pago con PayPal');
    } finally {
      setIsPaypalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-[#0c0d16] border border-[#caa96b]/40 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-[#caa96b] hover:bg-[#caa96b] hover:text-black transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#caa96b]/30 bg-[#151726] text-[#caa96b] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estructura de Precios Oficial</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe6]">
            {targetSpreadName
              ? `Desbloquea la ${targetSpreadName}`
              : 'Elige tu Nivel de Profundidad Oracular'}
          </h2>

          <p className="text-sm text-zinc-400 mt-2">
            Desde tu lectura básica diaria gratuita hasta el análisis oracular ilimitado con Inteligencia Artificial y la legendaria Cruz Celta.
          </p>
        </div>

        {/* CHECKOUT STEP OVERLAY IF USER SELECTED A PLAN */}
        {checkoutPlan ? (
          <div className="max-w-lg mx-auto bg-[#131522] border border-[#caa96b]/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div>
                <span className="text-xs text-[#caa96b] uppercase tracking-wider font-semibold">
                  Pasarela de Pago Segura (Stripe & PayPal)
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  {checkoutPlan === 'test_fire'
                    ? 'Prueba de Fuego · Cruz Celta'
                    : checkoutPlan === 'pro'
                    ? 'Plan Místico Pro (Suscripción)'
                    : 'Pase Élite (Pago Único Vitalicio)'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-[#caa96b]">
                  {checkoutPlan === 'test_fire'
                    ? '$1.00'
                    : checkoutPlan === 'pro'
                    ? (couponApplied ? '$7.99' : '$9.99')
                    : (couponApplied ? '$39' : '$49')}
                </span>
                <span className="text-xs text-zinc-400 block">
                  {checkoutPlan === 'test_fire'
                    ? 'USD · Pago Único'
                    : checkoutPlan === 'pro'
                    ? 'USD / mes'
                    : 'USD (Lifetime)'}
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#090a10] border border-zinc-800 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#caa96b] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta (Stripe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'bg-[#0070ba] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="font-bold text-sm tracking-tight">P</span>
                <span>PayPal (Sandbox)</span>
              </button>
            </div>

            {/* PAYMENT METHOD 1: CARD FORM */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleConfirmPayment} className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Tarjeta de Crédito / Débito (Stripe / Lemon Squeezy)</span>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-[#caa96b] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Zap className="w-3 h-3" />
                    Rellenar prueba rápida
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Número de Tarjeta</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-[#caa96b] focus:outline-none"
                    />
                    <CreditCard className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Expiración</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-[#caa96b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:border-[#caa96b] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="pt-1">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">¿Tienes cupón de descuento?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Prueba: MISTICO"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:border-[#caa96b] focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-[#caa96b] hover:text-black text-xs font-medium transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> Descuento oracular aplicado con éxito (-20%).
                    </p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="p-3 rounded-xl bg-[#0a0b12] border border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
                  <Shield className="w-5 h-5 text-[#caa96b] shrink-0" />
                  <span className="text-[11px] leading-tight">
                    Encriptación bancaria SSL 256-bit. Conexión directa con Stripe & Lemon Squeezy.
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutPlan(null)}
                    className="w-1/3 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#caa96b] via-[#e2c58a] to-[#caa96b] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirmar y Desbloquear</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* PAYMENT METHOD 2: PAYPAL (OAUTH2 & ORDERS V2) */}
            {paymentMethod === 'paypal' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#002f5a]/30 border border-[#0070ba]/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0070ba] flex items-center justify-center text-white font-bold text-base shrink-0">
                    P
                  </div>
                  <div className="text-xs flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-semibold text-white">PayPal Checkout Oficial</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                        {paypalStatus?.mode === 'live' ? 'Live' : 'Sandbox v2'}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Conecta vía OAuth2 client_credentials con <code className="text-amber-200">api-m.sandbox.paypal.com</code> para generar tokens Bearer y autorizar pedidos.
                    </p>

                    {/* Token Status Badge */}
                    <div className="mt-2 pt-2 border-t border-[#0070ba]/30 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-zinc-400">Estado OAuth2:</span>
                        {paypalStatus?.hasActiveToken ? (
                          <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Token Activo ({paypalStatus.tokenPreview})
                          </span>
                        ) : paypalStatus?.hasCredentials ? (
                          <span className="text-sky-300 font-mono">Credenciales configuradas</span>
                        ) : (
                          <span className="text-amber-400 font-mono">Modo Sandbox Activo</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTokenInput(!showTokenInput)}
                        className="text-[10px] text-[#caa96b] hover:underline"
                      >
                        {showTokenInput ? 'Ocultar' : 'Pegar token Bearer'}
                      </button>
                    </div>

                    {/* Expandable Bearer Token Input */}
                    {showTokenInput && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-[#070913] border border-zinc-800 space-y-2">
                        <label className="block text-[10px] text-zinc-400">
                          Pega aquí tu <code className="text-amber-300">access_token</code> Bearer de PayPal:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="A21AAF..."
                            value={customTokenInput}
                            onChange={(e) => setCustomTokenInput(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white text-[10px] font-mono focus:border-[#caa96b] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSaveCustomToken}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0070ba] text-white text-[10px] font-semibold hover:bg-[#005ea6] transition-colors"
                          >
                            Guardar
                          </button>
                        </div>
                        {tokenSaveNotice && (
                          <p className="text-[10px] text-emerald-400">{tokenSaveNotice}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Coupon Code for PayPal */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">¿Tienes cupón de descuento?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Prueba: MISTICO"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#090a10] border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:border-[#caa96b] focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-[#caa96b] hover:text-black text-xs font-medium transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> Descuento oracular aplicado con éxito (-20%).
                    </p>
                  )}
                </div>

                {/* Order Status Display */}
                {paypalOrder ? (
                  <div className="p-3.5 rounded-xl bg-[#090b12] border border-emerald-500/40 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Orden PayPal Creada:</span>
                      <span className="font-mono text-emerald-300 font-semibold">{paypalOrder.id}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Total a Autorizar:</span>
                      <span className="font-bold text-[#caa96b] text-sm">
                        ${paypalOrder.amount} {paypalOrder.currency}
                      </span>
                    </div>

                    {paypalOrder.approveUrl && (
                      <a
                        href={paypalOrder.approveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="w-full py-2 px-3 rounded-lg bg-[#0070ba]/20 hover:bg-[#0070ba]/40 border border-[#0070ba]/50 text-sky-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Ventana PayPal Sandbox</span>
                      </a>
                    )}

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={handleCapturePaypalOrder}
                        disabled={isPaypalLoading}
                        className="flex-1 py-2.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
                      >
                        {isPaypalLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Completar y Capturar Orden</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={handleCreatePaypalOrder}
                      disabled={isPaypalLoading}
                      className="w-full py-3 rounded-xl bg-[#ffc439] hover:bg-[#f4b931] text-[#003087] font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isPaypalLoading ? (
                        <div className="w-4 h-4 border-2 border-[#003087] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="font-serif italic font-extrabold text-base">PayPal</span>
                          <span>
                            Pagar con PayPal ({checkoutPlan === 'test_fire' ? '$1.00' : checkoutPlan === 'pro' ? (couponApplied ? '$7.99' : '$9.99') : (couponApplied ? '$39' : '$49')} USD)
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-zinc-400 text-center mt-2">
                      Haz clic para generar la orden en PayPal y autorizar la transacción de forma segura.
                    </p>
                  </div>
                )}

                {paypalError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paypalError}</span>
                  </div>
                )}

                {/* Back button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutPlan(null);
                      setPaypalOrder(null);
                    }}
                    className="w-full py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Volver a opciones de planes
                  </button>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-medium text-center shadow-lg">
                {successMessage}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* PRUEBA DE FUEGO SPECIAL BANNER ($1.00 USD) */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-r from-[#0a1c15] via-[#0f291e] to-[#0a1c15] p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-inner shrink-0">
                  <Flame className="w-7 h-7 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Prueba de Fuego de Producción</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span>Cruz Celta Individual</span>
                    <span className="text-emerald-400 font-mono font-extrabold text-xl sm:text-2xl">$1.00 USD</span>
                  </h3>
                  <p className="text-xs text-zinc-300 max-w-xl mt-0.5">
                    Verifica el flujo real de pago (Stripe / PayPal) y la interpretación oracular completa de 10 cartas con IA sin compromiso de suscripción recurrente.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartCheckout('test_fire')}
                className="w-full md:w-auto shrink-0 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-black font-extrabold text-xs hover:brightness-110 shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Pagar $1 USD (Prueba de Fuego)</span>
              </button>
            </div>

            {/* THE 3 PRICING TIERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* PLAN 1: FREEMIUM */}
            <div
              className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                currentPlan === 'freemium'
                  ? 'border-[#caa96b]/60 bg-[#121422] shadow-xl'
                  : 'border-zinc-800 bg-[#0e101b] hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                    Plan Gratuito de Atracción
                  </span>
                  {currentPlan === 'freemium' && (
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-[#caa96b] font-medium">
                      Plan Actual
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-white">Freemium</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Para sintonizar diariamente con las energías esenciales y reflexionar sobre tu momento actual.
                </p>

                <div className="my-5 pb-5 border-b border-zinc-800">
                  <span className="font-serif text-4xl font-bold text-white">$0</span>
                  <span className="text-xs text-zinc-400 ml-1.5">Gratis para siempre</span>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                    <span><strong>1 lectura básica al día</strong> de 3 cartas (pasado, presente, futuro).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                    <span>Imágenes reales auténticas del tarot Rider-Waite en alta resolución.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                    <span>Significados de Luz y Sombra para cada arcano.</span>
                  </li>
                  <li className="flex items-start gap-2 text-zinc-500 line-through">
                    <span>Tirada Celta completa de 10 cartas</span>
                  </li>
                  <li className="flex items-start gap-2 text-zinc-500 line-through">
                    <span>Interpretación avanzada con IA profunda</span>
                  </li>
                  <li className="flex items-start gap-2 text-zinc-500 line-through">
                    <span>Guardar historial en perfil</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800/80">
                <button
                  onClick={() => handleStartCheckout('freemium')}
                  className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-semibold text-xs transition-colors"
                >
                  {currentPlan === 'freemium' ? 'Tu plan actual' : 'Usar Plan Gratuito'}
                </button>
              </div>
            </div>

            {/* PLAN 2: PLAN MÍSTICO PRO (POPULAR) */}
            <div
              className={`rounded-2xl p-6 flex flex-col justify-between border relative transition-all ${
                currentPlan === 'pro'
                  ? 'border-[#caa96b] bg-[#16182c] shadow-2xl'
                  : 'border-[#caa96b]/50 bg-[#121424] shadow-xl hover:border-[#caa96b]'
              }`}
            >
              {/* Top Highlight Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#caa96b] to-[#e2c58a] text-black text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Más Recomendado · Acceso Pro</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 mt-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#caa96b]">
                    Suscripción Mensual
                  </span>
                  {currentPlan === 'pro' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#caa96b]/20 text-[10px] text-[#caa96b] font-medium border border-[#caa96b]/40">
                      Activo
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <span>Plan Místico Pro</span>
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  La experiencia completa para quienes buscan orientación profunda, recurrente y sin restricciones.
                </p>

                <div className="my-5 pb-5 border-b border-[#caa96b]/20">
                  <span className="font-serif text-4xl font-bold text-[#caa96b]">$9.99</span>
                  <span className="text-xs text-zinc-400 ml-1.5">USD / mes</span>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-200">
                  <li className="flex items-start gap-2 font-medium text-white">
                    <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                    <span><strong>Lecturas ilimitadas de la Tirada Celta</strong> (10 cartas completas).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                    <span><strong>Interpretación avanzada de IA</strong> (síntesis psicológica, arquetípica y desenlace).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                    <span><strong>Análisis cruzado de relaciones entre cartas</strong> (cómo interactúan obstáculos y dones).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                    <span><strong>Guardar historial de lecturas</strong> en tu perfil personal privado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#caa96b] shrink-0 mt-0.5" />
                    <span>Lecturas sin límite diario.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#caa96b]/20">
                <button
                  onClick={() => handleStartCheckout('pro')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#caa96b] via-[#dfc285] to-[#caa96b] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{currentPlan === 'pro' ? 'Tu Plan Actual (Gestionar)' : 'Desbloquear Místico Pro ($9.99/mes)'}</span>
                </button>
              </div>
            </div>

            {/* PLAN 3: PASE ÉLITE (LIFETIME) */}
            <div
              className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                currentPlan === 'elite'
                  ? 'border-purple-400 bg-[#171328] shadow-2xl'
                  : 'border-purple-500/30 bg-[#120f20] hover:border-purple-400/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-purple-300">
                    Pago Único / Lifetime
                  </span>
                  {currentPlan === 'elite' && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-[10px] text-purple-200 font-medium border border-purple-500/40">
                      Élite Vitalicio
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <span>Pase Élite</span>
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Un solo pago. Acceso vitalicio a todas las tiradas arcanas existentes y futuras expansiones.
                </p>

                <div className="my-5 pb-5 border-b border-purple-500/20">
                  <span className="font-serif text-4xl font-bold text-purple-300">$49</span>
                  <span className="text-xs text-zinc-400 ml-1.5">USD (Pago Único · Para Siempre)</span>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-200">
                  <li className="flex items-start gap-2 font-medium text-white">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Acceso de por vida</strong> a todas las tiradas maestras sin suscripción mensual.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Cruz Celta Completa (10 cartas)</strong> con IA ilimitada.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Cruz Mística Sagrada (7 cartas)</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2 font-semibold text-purple-200">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Tirada Astrológica Planetaria (10 cartas)</strong> con correspondencias de Sol a Plutón.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Todas las futuras actualizaciones y nuevas barajas incluidas.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-500/20">
                <button
                  onClick={() => handleStartCheckout('elite')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{currentPlan === 'elite' ? 'Pase Vitalicio Activo' : 'Obtener Pase Élite ($49 Lifetime)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </motion.div>
    </div>
  );
};
