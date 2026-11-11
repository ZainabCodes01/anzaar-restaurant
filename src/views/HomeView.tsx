import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FoodCard } from '../components/FoodCard.tsx';
import {
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Utensils,
  Bike,
  ShoppingBag,
  Flame,
  Percent,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { onImageErrorFallback, SVG_FOOD_PLACEHOLDER } from '../data/initialData.ts';

export const HomeView: React.FC = () => {
  const {
    categories,
    menuItems,
    setActiveTab,
    setSelectedCategorySlug,
    settings,
    setIsAboutOpen,
    activeOffer,
    applyPromoCode,
  } = useApp();

  const popularItems = menuItems.filter((item) => item.isPopular || item.isFeatured).slice(0, 6);
  const displayItems = popularItems.length > 0 ? popularItems : menuItems.slice(0, 6);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveTab('menu');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85"
            alt="Anzaar Signature Dishes"
            referrerPolicy="no-referrer"
            onError={(e) => onImageErrorFallback(e, SVG_FOOD_PLACEHOLDER)}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent sm:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40" />
        </div>

        <div className="relative p-6 sm:p-10 md:p-14 max-w-2xl text-stone-100 flex flex-col justify-center min-h-[380px] sm:min-h-[440px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Anzaar Restaurant • Daska</span>
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-100 font-serif leading-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Taste Something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059]">
              Special.
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base mt-3 max-w-lg leading-relaxed font-light">
            Freshly prepared meals, made for memorable moments. Indulge in artisanal burgers, live coal BBQ, stone-baked pizzas, and traditional rice platters.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <button
              id="btn-hero-order-now"
              onClick={() => setActiveTab('menu')}
              className="bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B38C35] text-stone-950 font-bold px-6 py-3.5 rounded-2xl shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              id="btn-hero-view-menu"
              onClick={() => setActiveTab('menu')}
              className="bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-semibold px-6 py-3.5 rounded-2xl border border-stone-700/80 backdrop-blur-sm active:scale-95 transition-all text-sm sm:text-base"
            >
              View Menu
            </button>
          </div>

          {/* Quick Stats Pill inside Hero */}
          <div className="mt-8 pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.5 ★</span>
              <span className="text-stone-400 font-normal">(163 reviews)</span>
            </div>
            <span className="text-stone-700">•</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Open until 11:00 PM</span>
            </div>
            <span className="text-stone-700">•</span>
            <span className="text-stone-300 font-mono">Rs 2,000–8,000 / person</span>
          </div>
        </div>
      </section>

      {/* 2. Restaurant Status Bar & Services */}
      <section className="bg-stone-900/90 rounded-2xl border border-stone-800 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-stone-100 text-sm">Open Now</span>
              <span className="text-xs text-stone-400">• Closes at 11:00 PM</span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C5A059]" />
              <span>College Rd, Jalalpur Ghumman, Daska, 51010</span>
            </p>
          </div>
        </div>

        {/* Services Badges */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl text-xs text-stone-200 border border-stone-700/60 whitespace-nowrap">
            <Utensils className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Dine-in</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl text-xs text-stone-200 border border-stone-700/60 whitespace-nowrap">
            <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Takeout</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl text-xs text-stone-200 border border-stone-700/60 whitespace-nowrap">
            <Bike className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>No-Contact Delivery</span>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Horizontal Scroll */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-100 flex items-center gap-2">
              <span>Explore Categories</span>
            </h2>
            <p className="text-xs text-stone-400">Discover flavors crafted with passion</p>
          </div>

          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveTab('menu');
            }}
            className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className="flex-shrink-0 bg-stone-900 hover:bg-stone-800/90 border border-stone-800 hover:border-[#C5A059]/40 p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-2 min-w-[95px] sm:min-w-[110px] group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-800 group-hover:bg-[#C5A059]/20 flex items-center justify-center text-stone-300 group-hover:text-[#D4AF37] group-hover:scale-110 transition-all">
                {cat.slug === 'burgers' && <Utensils className="w-6 h-6" />}
                {cat.slug === 'pizza' && <Sparkles className="w-6 h-6" />}
                {cat.slug === 'bbq' && <Flame className="w-6 h-6 text-amber-500" />}
                {cat.slug === 'rice' && <Utensils className="w-6 h-6 text-emerald-400" />}
                {cat.slug === 'drinks' && <Clock className="w-6 h-6 text-sky-400" />}
                {!['burgers', 'pizza', 'bbq', 'rice', 'drinks'].includes(cat.slug) && (
                  <Utensils className="w-6 h-6" />
                )}
              </div>
              <span className="text-xs font-semibold text-stone-200 group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Special Offer / Chef Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-stone-950 border border-[#C5A059]/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#C5A059]/10 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold tracking-wider bg-[#D4AF37] text-stone-950 px-2.5 py-0.5 rounded-full shadow-sm">
              <Percent className="w-3 h-3" />
              <span>Today&apos;s Special Offer</span>
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold font-serif text-stone-100"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Get 15% Off Your Feast
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Use promo code <span className="font-mono font-bold text-[#D4AF37] bg-stone-950 px-2 py-0.5 rounded border border-[#C5A059]/40">ANZAAR15</span> at checkout on orders over Rs 2,500.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                applyPromoCode('ANZAAR15');
                setActiveTab('menu');
              }}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#E5C158] text-stone-950 font-extrabold px-5 py-3 rounded-2xl shadow-md text-xs sm:text-sm transition-all"
            >
              Apply & Order
            </button>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="w-full sm:w-auto bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-4 py-3 rounded-2xl border border-stone-700 text-xs sm:text-sm transition-all"
            >
              About Restaurant
            </button>
          </div>
        </div>
      </section>

      {/* 5. Popular Items Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-100 flex items-center gap-2">
              <span>Customer Favorites</span>
            </h2>
            <p className="text-xs text-stone-400">Most ordered meals in Daska this week</p>
          </div>

          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>See Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};
