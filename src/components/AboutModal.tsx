import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  MapPin,
  Phone,
  Star,
  Clock,
  Navigation,
  Utensils,
  Bike,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { onImageErrorFallback, SVG_FOOD_PLACEHOLDER } from '../data/initialData.ts';

export const AboutModal: React.FC = () => {
  const { isAboutOpen, setIsAboutOpen, settings } = useApp();

  if (!isAboutOpen) return null;

  const restaurantAddress =
    settings?.address || 'College Rd, Jalalpur Ghumman, Daska, 51010, Pakistan';
  const restaurantPhone = settings?.phone || '+92 333 9612344';

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Anzaar Restaurant College Rd, Jalalpur Ghumman, Daska, 51010, Pakistan'
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-stone-900 border border-stone-800 text-stone-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="relative aspect-[16/8] w-full bg-stone-950 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
              alt="Anzaar Restaurant Ambience"
              referrerPolicy="no-referrer"
              onError={(e) => onImageErrorFallback(e, SVG_FOOD_PLACEHOLDER)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-950/60 to-black/30" />

            <button
              id="btn-close-about-modal"
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 text-stone-300 hover:text-white flex items-center justify-center border border-stone-700/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-5 right-5">
              <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold bg-stone-950/80 px-2.5 py-1 rounded-full border border-[#C5A059]/30">
                Premium Dining & Fast Food
              </span>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif mt-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Anzaar Restaurant
              </h2>
              <p className="text-xs text-stone-300 font-medium">
                College Rd, Jalalpur Ghumman, Daska, 51010, Pakistan
              </p>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-stone-800/80">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.5</span>
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5">163 Google Reviews</p>
              </div>

              <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800">
                <p className="text-sm font-bold text-stone-200">Rs 2k–8k</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Per Person</p>
              </div>

              <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800">
                <p className="text-sm font-bold text-emerald-400">Open Now</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Until 11:00 PM</p>
              </div>
            </div>

            {/* Available Services */}
            <div className="pt-4 space-y-2.5">
              <h4 className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                Available Dining Services
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-800 flex flex-col items-center gap-1.5 text-center">
                  <Utensils className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-semibold text-stone-200">Dine-in</span>
                  <span className="text-[10px] text-stone-400">Family hall & AC</span>
                </div>
                <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-800 flex flex-col items-center gap-1.5 text-center">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-semibold text-stone-200">Takeout</span>
                  <span className="text-[10px] text-stone-400">Quick pickup</span>
                </div>
                <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-800 flex flex-col items-center gap-1.5 text-center">
                  <Bike className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-semibold text-stone-200">No-Contact</span>
                  <span className="text-[10px] text-stone-400">Doorstep delivery</span>
                </div>
              </div>
            </div>

            {/* Story & Philosophy */}
            <div className="pt-4 space-y-2">
              <h4 className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                About Anzaar Restaurant
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Welcome to Anzaar Restaurant, Daska’s premier culinary destination where authentic traditional recipes meet contemporary flavors. From sizzling smoky BBQ skewers, aromatic biryani and karahi to signature crispy burgers and stone-baked pizzas, each dish is prepared using high quality Halal meats, pure ghee, and freshly ground spices.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-stone-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Halal Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fresh Daily Preparation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Family Seating Area</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Party & Catering Orders</span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  id="btn-call-about"
                  href={`tel:${restaurantPhone}`}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-stone-950 font-extrabold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all text-sm"
                >
                  <Phone className="w-4 h-4 fill-stone-950" />
                  <span>Call {restaurantPhone}</span>
                </a>

                <a
                  id="btn-directions-about"
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3 px-4 rounded-2xl border border-stone-700 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
                >
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>Get Directions</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Monday – Sunday: 11:00 AM – 11:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
