import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ShoppingBag,
  Search,
  User,
  MapPin,
  Utensils,
  ShieldAlert,
  Phone,
  Info,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    isAdmin,
    setIsAdmin,
    setIsAboutOpen,
    searchQuery,
    setSearchQuery,
    settings,
  } = useApp();

  const handleSearchClick = () => {
    setActiveTab('menu');
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-sm transition-all">
      {/* Top microbar with location and phone */}
      <div className="bg-stone-950 px-4 py-1.5 text-[11px] text-stone-400 border-b border-stone-800/60 hidden sm:flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="truncate">
            {settings?.address || 'College Rd, Jalalpur Ghumman, Daska, 51010, Pakistan'}
          </span>
          <span className="text-stone-600">|</span>
          <span className="text-emerald-400 font-medium">Open until 11 PM</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${settings?.phone || '+923339612344'}`}
            className="flex items-center gap-1.5 text-stone-300 hover:text-[#C5A059] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#C5A059]" />
            <span>{settings?.phone || '+92 333 9612344'}</span>
          </a>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center gap-1 text-stone-300 hover:text-[#C5A059] transition-colors"
          >
            <Info className="w-3 h-3" />
            <span>About</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div
          id="navbar-brand-button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8C6D2C] flex items-center justify-center text-stone-950 font-bold shadow-md shadow-black/40 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="font-bold text-lg md:text-xl tracking-wider uppercase text-stone-100 font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {settings?.name || 'ANZAAR'}
              </span>
              <span className="text-[10px] bg-[#C5A059]/20 text-[#D4AF37] px-1.5 py-0.5 rounded font-sans tracking-wide">
                DASKA
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Good Food. Great Moments.
            </p>
          </div>
        </div>

        {/* Search Bar on Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="navbar-search-input"
              type="text"
              placeholder="Search burgers, pizza, BBQ, biryani..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'menu') setActiveTab('menu');
              }}
              onFocus={handleSearchClick}
              className="w-full bg-stone-800/80 hover:bg-stone-800 text-stone-100 text-sm pl-10 pr-4 py-2 rounded-full border border-stone-700/70 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all placeholder:text-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search trigger button */}
          <button
            id="btn-nav-mobile-search"
            onClick={() => {
              setActiveTab('menu');
            }}
            aria-label="Search"
            className="md:hidden p-2 text-stone-300 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Admin Switcher Button */}
          <button
            id="btn-toggle-admin-mode"
            onClick={() => setIsAdmin(!isAdmin)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              isAdmin
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-600 hover:text-white'
            }`}
            title="Toggle between Customer App and Admin Dashboard"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdmin ? 'Staff Dashboard' : 'Staff Portal'}</span>
            <span className="sm:hidden">{isAdmin ? 'Admin' : 'Staff'}</span>
          </button>

          {/* Customer Profile Icon */}
          <button
            id="btn-nav-profile"
            onClick={() => setActiveTab('profile')}
            aria-label="Profile"
            className={`p-2 rounded-full border transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#C5A059]/20 text-[#D4AF37] border-[#C5A059]/40'
                : 'text-stone-300 border-transparent hover:bg-stone-800 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart Icon Button */}
          <button
            id="btn-nav-cart"
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            className="relative p-2 rounded-full text-stone-100 bg-[#C5A059]/15 hover:bg-[#C5A059]/25 border border-[#C5A059]/40 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-900 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
