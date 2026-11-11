import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CheckCircle, Clock, MapPin, ArrowRight, Home, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderConfirmationModalProps {
  orderNumber: string | null;
  orderData: any | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  orderNumber,
  orderData,
  onClose,
}) => {
  const { trackOrder, setActiveTab } = useApp();

  if (!orderNumber) return null;

  const handleTrack = () => {
    onClose();
    trackOrder(orderNumber);
  };

  const handleGoHome = () => {
    onClose();
    setActiveTab('home');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-stone-900 border border-[#C5A059]/40 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center"
        >
          {/* Decorative celebratory badge */}
          <div className="relative mb-5 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border border-emerald-500/50 shadow-xl">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
            <Sparkles className="w-4 h-4 text-[#D4AF37] absolute -top-1 -right-1 animate-bounce" />
          </div>

          <h2
            className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Order Confirmed!
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-sm leading-relaxed">
            Thank you for ordering from <span className="text-[#C5A059] font-semibold">Anzaar Restaurant</span>.
            Our kitchen in Daska is already preparing your fresh meal.
          </p>

          {/* Order ID Pill */}
          <div className="mt-4 px-4 py-2 bg-stone-950 rounded-2xl border border-stone-800 flex items-center gap-2">
            <span className="text-xs text-stone-400">Order Number:</span>
            <span className="text-sm font-extrabold font-mono text-[#D4AF37] tracking-wider">
              {orderNumber}
            </span>
          </div>

          {/* Estimated Time Card */}
          <div className="mt-6 w-full bg-stone-950/80 border border-stone-800 rounded-2xl p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#D4AF37] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                  Estimated Preparation
                </p>
                <p className="text-base font-bold text-stone-100">25 - 40 Minutes</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] text-stone-400">Total Bill</p>
              <p className="text-base font-mono font-extrabold text-stone-100">
                Rs {orderData?.total?.toLocaleString() || '1,450'}
              </p>
            </div>
          </div>

          {/* Visual Order Progress Pipeline */}
          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between text-[11px] font-semibold text-stone-400 px-1">
              <span className="text-emerald-400 font-bold">Received</span>
              <span>Preparing</span>
              <span>Ready</span>
              <span>Delivered</span>
            </div>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-[#D4AF37] w-1/4 h-full rounded-full transition-all" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 w-full flex flex-col sm:flex-row gap-3">
            <button
              id="btn-track-confirmed-order"
              onClick={handleTrack}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B38C35] text-stone-950 font-bold py-3 px-5 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Track Order Live</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              id="btn-back-home-confirmed"
              onClick={handleGoHome}
              className="sm:w-auto bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold py-3 px-5 rounded-2xl border border-stone-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
