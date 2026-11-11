import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Home, Utensils, Receipt, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartCount, cartFinalTotal, setIsCartOpen, isAdmin } = useApp();

  // If in admin mode, hide customer bottom bar
  if (isAdmin) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-md mx-auto px-4 pb-3">
        {/* Persistent Floating Cart Button */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="mb-2 pointer-events-auto"
            >
              <button
                id="btn-sticky-cart-bar"
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#A38035] text-stone-950 font-bold p-3.5 rounded-2xl shadow-xl shadow-black/40 flex items-center justify-between hover:brightness-105 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="bg-stone-950 text-[#D4AF37] text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center">
                    {cartCount}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs uppercase tracking-wider font-semibold opacity-90">Your Order</p>
                    <p className="text-base font-extrabold">Rs {cartFinalTotal.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm font-extrabold bg-stone-950/10 px-3 py-1.5 rounded-xl">
                  <span>View Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Bottom Tab Navigation */}
      <nav className="pointer-events-auto bg-stone-950/95 backdrop-blur-md border-t border-stone-800/80 px-2 py-2 flex items-center justify-around text-stone-400 max-w-lg mx-auto md:rounded-t-2xl shadow-2xl">
        <button
          id="tab-btn-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-[#D4AF37] font-semibold'
              : 'hover:text-stone-200 active:scale-95'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] tracking-tight">Home</span>
        </button>

        <button
          id="tab-btn-menu"
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'menu'
              ? 'text-[#D4AF37] font-semibold'
              : 'hover:text-stone-200 active:scale-95'
          }`}
        >
          <Utensils className={`w-5 h-5 ${activeTab === 'menu' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] tracking-tight">Menu</span>
        </button>

        <button
          id="tab-btn-orders"
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'text-[#D4AF37] font-semibold'
              : 'hover:text-stone-200 active:scale-95'
          }`}
        >
          <Receipt className={`w-5 h-5 ${activeTab === 'orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] tracking-tight">Orders</span>
        </button>

        <button
          id="tab-btn-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-[#D4AF37] font-semibold'
              : 'hover:text-stone-200 active:scale-95'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] tracking-tight">Profile</span>
        </button>
      </nav>
    </div>
  );
};
