import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Order } from '../types.ts';
import {
  X,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Bike,
  ChefHat,
  PackageCheck,
  RotateCw,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    trackingOrderNumber,
    settings,
    showToast,
  } = useApp();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async () => {
    if (!trackingOrderNumber) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${trackingOrderNumber}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        showToast('Could not load order tracking details', 'error');
      }
    } catch {
      showToast('Network error fetching order', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isTrackingOpen && trackingOrderNumber) {
      fetchOrderDetails();
      // Poll every 10 seconds for real-time order status
      const interval = setInterval(fetchOrderDetails, 10000);
      return () => clearInterval(interval);
    }
  }, [isTrackingOpen, trackingOrderNumber]);

  if (!isTrackingOpen) return null;

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Receipt, desc: 'We have received your order' },
    { key: 'preparing', label: 'Kitchen Preparing', icon: ChefHat, desc: 'Chef is cooking your meal fresh' },
    { key: 'ready', label: 'Order Ready', icon: PackageCheck, desc: 'Packed and waiting for pickup/dispatch' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, desc: 'Rider is en route in Daska' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Enjoy your meal!' },
  ];

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'accepted':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'assigned':
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order?.status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-stone-900 border border-stone-800 text-stone-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Top Header */}
          <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#D4AF37] flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-stone-100">Live Order Tracking</h3>
                <p className="text-xs text-stone-400 font-mono">
                  Order #{trackingOrderNumber || 'AZ-1024'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrderDetails}
                title="Refresh Status"
                className={`p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 ${
                  loading ? 'animate-spin text-[#D4AF37]' : ''
                }`}
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                id="btn-close-tracking-modal"
                onClick={() => setIsTrackingOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tracking Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Status Hero Card */}
            <div className="bg-gradient-to-br from-stone-950 to-stone-900 border border-[#C5A059]/30 rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#D4AF37] text-stone-950 px-2.5 py-0.5 rounded-full">
                    {order?.status?.replace(/_/g, ' ') || 'Preparing'}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold font-serif text-stone-100 mt-2">
                    {order?.status === 'delivered'
                      ? 'Meal Delivered'
                      : order?.status === 'out_for_delivery'
                      ? 'Rider is on the way!'
                      : 'Preparing your meal'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    {order?.orderType === 'dine_in'
                      ? `Serving to Table ${order.tableNumber || ''}`
                      : order?.orderType === 'takeout'
                      ? 'Ready for self-pickup at counter'
                      : `Delivering to ${order?.area || 'Daska'}`}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#D4AF37] justify-end">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-semibold">Estimated</span>
                  </div>
                  <p className="text-2xl font-extrabold font-mono text-stone-100 mt-0.5">
                    {order?.status === 'delivered' ? '0 min' : `${order?.estimatedMinutes || 25}m`}
                  </p>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="mt-6 space-y-4">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const StepIcon = step.icon;

                  return (
                    <div key={idx} className="flex items-start gap-3 relative">
                      {idx < steps.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-6 -ml-px ${
                            idx < currentStepIdx ? 'bg-[#D4AF37]' : 'bg-stone-800'
                          }`}
                        />
                      )}

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isDone
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-stone-950 shadow-md'
                            : 'bg-stone-800 border-stone-700 text-stone-500'
                        } ${isCurrent ? 'ring-4 ring-[#D4AF37]/20 scale-110' : ''}`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>

                      <div className="pt-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs sm:text-sm font-bold ${
                              isDone ? 'text-stone-100' : 'text-stone-500'
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] text-[#D4AF37] font-semibold animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Restaurant Direct Contact & Location Card */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-200">{settings?.name || 'Anzaar Restaurant'}</p>
                  <p className="text-[11px] text-stone-400 line-clamp-1">
                    {settings?.address || 'College Rd, Jalalpur Ghumman, Daska'}
                  </p>
                </div>
              </div>

              <a
                id="btn-call-restaurant-track"
                href={`tel:${settings?.phone || '+923339612344'}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Restaurant</span>
              </a>
            </div>

            {/* Order Items Breakdown */}
            {order?.items && order.items.length > 0 && (
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                  Ordered Items ({order.items.length})
                </h5>

                <div className="divide-y divide-stone-800/80 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-stone-200">
                          {item.quantity}x {item.itemName}
                        </p>
                      </div>
                      <span className="font-mono text-stone-300">
                        Rs {item.itemTotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-800/80 space-y-1 text-xs text-stone-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-300">Rs {order.subtotal.toLocaleString()}</span>
                  </div>
                  {order.deliveryFee ? (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-mono text-stone-300">Rs {order.deliveryFee.toLocaleString()}</span>
                    </div>
                  ) : null}
                  {order.discount ? (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span className="font-mono">-Rs {order.discount.toLocaleString()}</span>
                    </div>
                  ) : null}
                  <div className="pt-2 border-t border-stone-800 flex justify-between font-extrabold text-sm text-stone-100">
                    <span>Total Bill</span>
                    <span className="font-mono text-[#D4AF37]">Rs {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
