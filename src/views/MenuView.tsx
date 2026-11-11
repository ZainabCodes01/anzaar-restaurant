import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FoodCard } from '../components/FoodCard.tsx';
import { Search, SlidersHorizontal, Utensils, X, ArrowUpDown, Sparkles } from 'lucide-react';

export const MenuView: React.FC = () => {
  const {
    categories,
    menuItems,
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setSelectedCategorySlug,
  } = useApp();

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating' | 'prep_time'>('popular');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg'>('all');

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    // Category filter
    if (selectedCategorySlug) {
      const activeCat = categories.find((c) => c.slug === selectedCategorySlug);
      if (activeCat) {
        result = result.filter((item) => item.categoryId === activeCat.id);
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.ingredients?.toLowerCase().includes(q)
      );
    }

    // Dietary filter
    if (dietaryFilter === 'veg') {
      result = result.filter((item) => item.isVeg === true);
    } else if (dietaryFilter === 'nonveg') {
      result = result.filter((item) => item.isVeg === false);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
    } else if (sortBy === 'prep_time') {
      result.sort((a, b) => (a.prepTimeMinutes || 30) - (b.prepTimeMinutes || 30));
    } else {
      // Default: popular / featured first
      result.sort((a, b) => ((b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)));
    }

    return result;
  }, [menuItems, categories, selectedCategorySlug, searchQuery, dietaryFilter, sortBy]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif tracking-wide"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Our Menu
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Carefully curated culinary specialties for Daska food lovers
          </p>
        </div>

        {/* Dietary toggle buttons */}
        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-2xl border border-stone-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              dietaryFilter === 'all'
                ? 'bg-[#C5A059] text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setDietaryFilter('veg')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Veg</span>
          </button>
          <button
            onClick={() => setDietaryFilter('nonveg')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
              dietaryFilter === 'nonveg'
                ? 'bg-red-700 text-white font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* Search & Sort Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="menu-search-input"
            type="text"
            placeholder="Search our dishes (e.g. Zinger, Tikka, Platter, Pepperoni)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-2xl text-xs sm:text-sm pl-10 pr-9 py-3 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-[#C5A059] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[170px] flex-1 sm:flex-initial">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-2xl text-xs pl-9 pr-3 py-3 text-stone-200 focus:outline-none focus:border-[#C5A059] appearance-none cursor-pointer"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated (Stars)</option>
              <option value="prep_time">Fastest Prep Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategorySlug(null)}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategorySlug === null
              ? 'bg-[#C5A059] text-stone-950 shadow-md font-bold'
              : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-700'
          }`}
        >
          All Categories ({menuItems.length})
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;
          const count = menuItems.filter((i) => i.categoryId === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#C5A059] text-stone-950 shadow-md font-bold'
                  : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-700'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Items Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-400 px-1">
        <span>
          Showing <strong className="text-stone-200">{filteredItems.length}</strong> delicious items
        </span>
        {(searchQuery || selectedCategorySlug || dietaryFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategorySlug(null);
              setDietaryFilter('all');
            }}
            className="text-[#D4AF37] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-stone-900/60 rounded-3xl border border-stone-800 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mx-auto">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-200">No dishes found</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            We couldn&apos;t find any item matching your criteria. Try clearing search keywords or choosing another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategorySlug(null);
              setDietaryFilter('all');
            }}
            className="mt-4 bg-[#C5A059] text-stone-950 font-bold px-5 py-2 rounded-xl text-xs"
          >
            View All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
