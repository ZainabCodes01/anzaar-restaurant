import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { Navbar } from './components/Navbar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { FoodDetailModal } from './components/FoodDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderConfirmationModal } from './components/OrderConfirmationModal.tsx';
import { OrderTrackingModal } from './components/OrderTrackingModal.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { Toast } from './components/Toast.tsx';
import { HomeView } from './views/HomeView.tsx';
import { MenuView } from './views/MenuView.tsx';
import { OrdersView } from './views/OrdersView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { AdminView } from './views/AdminView.tsx';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  UtensilsCrossed,
  Heart,
  ShieldCheck,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    isAdmin,
    setIsAboutOpen,
    settings,
  } = useApp();

  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);
  const [confirmedOrderData, setConfirmedOrderData] = useState<any | null>(null);

  const handleOrderSuccess = (orderNumber: string, orderData: any) => {
    setConfirmedOrderNumber(orderNumber);
    setConfirmedOrderData(orderData);
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-[#C5A059] selection:text-stone-950">
        <Toast />
        <AdminView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-[#C5A059] selection:text-stone-950 flex flex-col">
      {/* Top Bar & Navbar */}
      <Navbar />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'menu' && <MenuView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900/90 border-t border-stone-800 text-stone-400 text-xs py-10 px-4 mt-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#8C6D2C] flex items-center justify-center text-stone-950 font-bold">
                <UtensilsCrossed className="w-4 h-4 text-stone-950" />
              </div>
              <span
                className="font-bold text-lg text-stone-100 font-serif tracking-wider"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {settings?.name || 'ANZAAR'}
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              Daska’s destination for gourmet burgers, live coal BBQ, artisanal pizzas, and rich Pakistani cuisine.
            </p>
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.5 Google Rating (163 Reviews)</span>
            </div>
          </div>

          {/* Col 2: Timings & Services */}
          <div className="space-y-2">
            <h4 className="text-stone-100 font-bold text-xs uppercase tracking-wider font-serif">
              Opening Hours & Dining
            </h4>
            <div className="space-y-1 text-stone-400 text-[11px]">
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Monday – Sunday: 11:00 AM – 11:00 PM</span>
              </p>
              <p className="text-emerald-400 font-medium">Open until 11:00 PM tonight</p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="bg-stone-800 px-2 py-0.5 rounded text-[10px] text-stone-300">Dine-in</span>
                <span className="bg-stone-800 px-2 py-0.5 rounded text-[10px] text-stone-300">Takeout</span>
                <span className="bg-stone-800 px-2 py-0.5 rounded text-[10px] text-stone-300">No-contact Delivery</span>
              </div>
            </div>
          </div>

          {/* Col 3: Location */}
          <div className="space-y-2">
            <h4 className="text-stone-100 font-bold text-xs uppercase tracking-wider font-serif">
              Location & Contact
            </h4>
            <div className="space-y-1.5 text-stone-400 text-[11px]">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{settings?.address || 'College Rd, Jalalpur Ghumman, Daska, 51010, Pakistan'}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <a href={`tel:${settings?.phone || '+923339612344'}`} className="hover:text-[#C5A059]">
                  {settings?.phone || '+92 333 9612344'}
                </a>
              </p>
            </div>
          </div>

          {/* Col 4: Trust */}
          <div className="space-y-2">
            <h4 className="text-stone-100 font-bold text-xs uppercase tracking-wider font-serif">
              Halal & Freshness
            </h4>
            <div className="space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Halal certified meats & premium spices</span>
              </div>
              <p className="text-stone-500">
                All prices are in Pakistani Rupees (PKR / Rs). Delivery throughout College Rd and Daska city limits.
              </p>
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                Learn More About Us →
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© {new Date().getFullYear()} Anzaar Restaurant Daska. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for Pakistan</span>
          </p>
        </div>
      </footer>

      {/* Mobile Floating Bottom Bar & Cart Indicator */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <FoodDetailModal />
      <CartDrawer />
      <CheckoutModal onOrderSuccess={handleOrderSuccess} />
      <OrderConfirmationModal
        orderNumber={confirmedOrderNumber}
        orderData={confirmedOrderData}
        onClose={() => setConfirmedOrderNumber(null)}
      />
      <OrderTrackingModal />
      <AboutModal />
      <ReviewModal />
      <Toast />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <MainAppContent />
    </AppProvider>
  );
}
