import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { OrderType } from '../types.ts';
import {
  X,
  Bike,
  ShoppingBag,
  Utensils,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  onOrderSuccess: (orderNumber: string, orderData: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onOrderSuccess }) => {
  const {
    cart,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartSubtotal,
    deliveryFee: defaultDeliveryFee,
    discountAmount,
    activeOffer,
    user,
    settings,
    showToast,
  } = useApp();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+92 333 ');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('College Road');
  const [city, setCity] = useState('Daska');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [guestCount, setGuestCount] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'cash_at_restaurant'>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isCheckoutOpen) return null;

  // For dine-in or takeout, delivery fee is Rs 0
  const effectiveDeliveryFee = orderType === 'delivery' ? defaultDeliveryFee : 0;
  const effectiveTotal = Math.max(0, cartSubtotal + effectiveDeliveryFee - discountAmount);

  const deliveryAreas = [
    'College Road',
    'Jalalpur Ghumman',
    'Model Town Daska',
    'Civil Lines',
    'Kashmir Road',
    'Main Bazaar Daska',
    'Sambrial Road',
    'Pasrur Road',
    'Canal View Daska',
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setFormError('Please provide a valid Pakistani phone number (e.g., +92 333 1234567).');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setFormError('Please enter your delivery street address.');
      return;
    }

    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setFormError('Please enter your table number.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id || null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        orderType,
        status: 'pending',
        subtotal: cartSubtotal,
        deliveryFee: effectiveDeliveryFee,
        discount: discountAmount,
        total: effectiveTotal,
        address: orderType === 'delivery' ? address.trim() : null,
        area: orderType === 'delivery' ? area : null,
        city: orderType === 'delivery' ? city : 'Daska',
        deliveryInstructions: deliveryInstructions.trim() || null,
        tableNumber: orderType === 'dine_in' ? tableNumber.trim() : null,
        guestCount: orderType === 'dine_in' ? guestCount : null,
        paymentMethod: orderType === 'delivery' ? paymentMethod : 'cash_at_restaurant',
        paymentStatus: 'pending',
        estimatedMinutes: orderType === 'delivery' ? 35 : 20,
      };

      const itemsPayload = cart.map((item) => ({
        menuItemId: item.menuItem.id,
        itemName: item.menuItem.name,
        itemPrice: item.unitPrice,
        quantity: item.quantity,
        selectedOptionsJson: JSON.stringify(item.selectedOptions),
        itemTotal: item.totalPrice,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: orderPayload,
          items: itemsPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('Server rejected order placement');
      }

      const createdOrder = await res.json();
      clearCart();
      setIsCheckoutOpen(false);
      onOrderSuccess(createdOrder.orderNumber, createdOrder);
      showToast(`Order #${createdOrder.orderNumber} placed successfully!`);
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setFormError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-xl bg-stone-900 border border-stone-800 text-stone-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-100">Checkout</h3>
              <p className="text-xs text-stone-400">Anzaar Restaurant, Daska</p>
            </div>
            <button
              id="btn-close-checkout"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handlePlaceOrder} className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
            {/* Form Error Banner */}
            {formError && (
              <div className="bg-red-950/70 border border-red-800 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            {/* 1. Order Type Tabs */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                Select Order Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="checkout-type-delivery"
                  onClick={() => {
                    setOrderType('delivery');
                    setPaymentMethod('cod');
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                    orderType === 'delivery'
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-stone-100 shadow-sm'
                      : 'bg-stone-800/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <Bike className={`w-5 h-5 ${orderType === 'delivery' ? 'text-[#D4AF37]' : ''}`} />
                  <span>Delivery</span>
                  <span className="text-[10px] text-stone-400 font-normal">30-40 min</span>
                </button>

                <button
                  type="button"
                  id="checkout-type-takeout"
                  onClick={() => {
                    setOrderType('takeout');
                    setPaymentMethod('cash_at_restaurant');
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                    orderType === 'takeout'
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-stone-100 shadow-sm'
                      : 'bg-stone-800/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <ShoppingBag className={`w-5 h-5 ${orderType === 'takeout' ? 'text-[#D4AF37]' : ''}`} />
                  <span>Takeout</span>
                  <span className="text-[10px] text-stone-400 font-normal">15-25 min</span>
                </button>

                <button
                  type="button"
                  id="checkout-type-dinein"
                  onClick={() => {
                    setOrderType('dine_in');
                    setPaymentMethod('cash_at_restaurant');
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                    orderType === 'dine_in'
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-stone-100 shadow-sm'
                      : 'bg-stone-800/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <Utensils className={`w-5 h-5 ${orderType === 'dine_in' ? 'text-[#D4AF37]' : ''}`} />
                  <span>Dine-In</span>
                  <span className="text-[10px] text-stone-400 font-normal">Table service</span>
                </button>
              </div>
            </div>

            {/* 2. Customer Info */}
            <div className="space-y-3 pt-2">
              <label className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                Customer Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="input-customer-name"
                      type="text"
                      required
                      placeholder="e.g. Usman Tariq"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs sm:text-sm pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">Phone Number (Pakistan)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="input-customer-phone"
                      type="tel"
                      required
                      placeholder="+92 333 1234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs sm:text-sm pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Delivery Details (if delivery) */}
            {orderType === 'delivery' && (
              <div className="space-y-3 pt-2">
                <label className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                  Delivery Address in Daska
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400">Area / Sector</label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs sm:text-sm px-3 py-2.5 text-stone-100 focus:outline-none focus:border-[#C5A059]"
                    >
                      {deliveryAreas.map((a, i) => (
                        <option key={i} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400">City</label>
                    <input
                      type="text"
                      disabled
                      value={city}
                      className="w-full bg-stone-800/50 border border-stone-700/50 rounded-xl text-xs sm:text-sm px-3 py-2.5 text-stone-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">Street Address / House No.</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <textarea
                      id="input-delivery-address"
                      required
                      rows={2}
                      placeholder="e.g. House 14, St 2, Near Shell Pump, College Road"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs sm:text-sm pl-9 pr-3 py-2 text-stone-100 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Please ring bell twice or leave at gate"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs px-3 py-2 text-stone-100 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            )}

            {/* 3B. Dine-in Details */}
            {orderType === 'dine_in' && (
              <div className="space-y-3 pt-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                <label className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                  Dine-In Table Information
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400">Table Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Table 6"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs sm:text-sm px-3 py-2 text-stone-100 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400">Number of Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs sm:text-sm px-3 py-2 text-stone-100 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Payment Method */}
            <div className="space-y-2 pt-2">
              <label className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                Payment Method
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-[#C5A059] bg-[#C5A059]/10 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-stone-100">
                        {orderType === 'delivery' ? 'Cash on Delivery (COD)' : 'Cash at Restaurant counter'}
                      </p>
                      <p className="text-[11px] text-stone-400">Pay in PKR upon receiving your meal</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                </label>

                {/* Coming Soon online payments info */}
                <div className="p-3 rounded-xl border border-stone-800 bg-stone-950/40 text-stone-400 text-xs flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-stone-500" />
                    <span>JazzCash / EasyPaisa / Credit Card</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-stone-800 text-stone-400 px-2 py-0.5 rounded">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Complete Order Summary */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2 text-xs text-stone-300">
              <h4 className="font-bold text-stone-200 text-sm mb-1 font-serif">Order Summary</h4>
              <div className="flex justify-between">
                <span className="text-stone-400">Items Subtotal ({cart.length} items)</span>
                <span className="font-mono">Rs {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Delivery Fee</span>
                <span className="font-mono">
                  {effectiveDeliveryFee > 0 ? `Rs ${effectiveDeliveryFee}` : 'FREE'}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount ({activeOffer?.promoCode})</span>
                  <span className="font-mono">-Rs {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-800 flex justify-between text-base font-extrabold text-stone-100">
                <span>Total Amount to Pay</span>
                <span className="font-mono text-[#D4AF37]">
                  Rs {effectiveTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              id="btn-confirm-place-order"
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B38C35] text-stone-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-xl hover:brightness-105 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-between text-sm sm:text-base"
            >
              <span>{submitting ? 'Placing Order...' : 'Place Order Now'}</span>
              <span className="font-mono">Rs {effectiveTotal.toLocaleString()}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
