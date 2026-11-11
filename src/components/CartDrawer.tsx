import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { onImageErrorFallback, SVG_FOOD_PLACEHOLDER } from '../data/initialData.ts';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartFinalTotal,
    activeOffer,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen,
    setActiveTab,
    showToast,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    const res = await applyPromoCode(promoInput);
    setPromoLoading(false);
    showToast(res.message, res.success ? 'success' : 'error');
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer container */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#D4AF37] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-100 font-serif">Shopping Cart</h3>
                  <p className="text-xs text-stone-400">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'} from Anzaar Restaurant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-red-400 px-2 py-1 rounded transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  id="btn-close-cart-drawer"
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-stone-200">Your cart is empty</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">
                  Explore Anzaar’s delicious menu of burgers, pizza, BBQ, and special platters in Daska.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('menu');
                  }}
                  className="mt-6 bg-[#C5A059] text-stone-950 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider hover:bg-[#D4AF37] transition-all"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-stone-800/60">
                {cart.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                    {/* Item Image */}
                    <img
                      src={
                        item.menuItem.image ||
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={item.menuItem.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageErrorFallback(e, SVG_FOOD_PLACEHOLDER)}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-950 shrink-0 border border-stone-800"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-stone-100 text-sm truncate">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-500 hover:text-red-400 transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customization Options Pills */}
                      {item.selectedOptions.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.selectedOptions.map((opt, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md border border-stone-700/50"
                            >
                              {opt.choiceName}{' '}
                              {opt.choicePrice > 0 && `(+Rs ${opt.choicePrice})`}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price & Quantity Adjuster */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="font-bold text-stone-200 text-sm font-mono">
                          Rs {item.totalPrice.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1.5 bg-stone-800 border border-stone-700/60 rounded-xl p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Form */}
                <div className="pt-4">
                  {activeOffer ? (
                    <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-xs font-bold text-emerald-300">
                            Code &quot;{activeOffer.promoCode}&quot; Applied!
                          </p>
                          <p className="text-[11px] text-emerald-400/80">
                            Saved Rs {discountAmount.toLocaleString()} on this order
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-xs text-stone-400 hover:text-white underline ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          placeholder="Promo code (e.g. ANZAAR15)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs pl-9 pr-3 py-2.5 text-stone-100 placeholder:text-stone-500 uppercase focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={promoLoading || !promoInput.trim()}
                        className="bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-[#D4AF37] font-bold px-4 py-2.5 rounded-xl text-xs border border-[#C5A059]/40 transition-colors"
                      >
                        {promoLoading ? 'Checking...' : 'Apply'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Free Delivery / Info hint */}
                <div className="pt-3 flex items-center gap-2 text-[11px] text-stone-400 bg-stone-950/50 p-2.5 rounded-xl border border-stone-800">
                  <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Standard delivery in Daska is Rs 150. Free delivery on orders over Rs 3,000!</span>
                </div>
              </div>
            )}

            {/* Cart Footer Summary */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 space-y-3">
                <div className="space-y-1.5 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Subtotal</span>
                    <span className="font-mono font-medium">Rs {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Delivery Fee</span>
                    <span className="font-mono font-medium">Rs {deliveryFee.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">-Rs {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-800 flex justify-between text-base font-extrabold text-stone-100">
                    <span>Total</span>
                    <span className="font-mono text-[#D4AF37]">
                      Rs {cartFinalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-proceed-checkout"
                  onClick={handleCheckoutClick}
                  className="w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B38C35] text-stone-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-between text-sm sm:text-base"
                >
                  <span>Proceed to Checkout</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>Rs {cartFinalTotal.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
