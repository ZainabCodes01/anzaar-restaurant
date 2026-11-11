import React from 'react';
import { MenuItem } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { Plus, Star, Clock, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { onImageErrorFallback, SVG_FOOD_PLACEHOLDER } from '../data/initialData.ts';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { setSelectedFoodItem, addToCart, favorites, toggleFavorite } = useApp();

  const isFavorited = favorites.includes(item.id);

  const handleCardClick = () => {
    setSelectedFoodItem(item);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If item has customizations, open detail modal so user can choose size/extras
    if (item.customizationOptionsJson) {
      setSelectedFoodItem(item);
    } else {
      addToCart(item, 1);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <motion.div
      id={`food-card-${item.id}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group relative bg-stone-900/90 rounded-2xl overflow-hidden border border-stone-800/80 hover:border-[#C5A059]/50 shadow-md hover:shadow-xl hover:shadow-black/60 transition-all cursor-pointer flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
        <img
          src={
            item.image ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
          }
          alt={item.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => onImageErrorFallback(e, SVG_FOOD_PLACEHOLDER)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

        {/* Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={`w-4 h-4 rounded-sm border flex items-center justify-center p-0.5 bg-stone-900/80 backdrop-blur-sm ${
              item.isVeg ? 'border-emerald-500' : 'border-red-500'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
          </span>

          {item.isPopular && (
            <span className="bg-[#D4AF37] text-stone-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider">
              Popular
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          id={`btn-fav-${item.id}`}
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-stone-900/70 backdrop-blur-md border border-stone-700/60 flex items-center justify-center text-stone-300 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-stone-300'
            }`}
          />
        </button>

        {/* Bottom meta over image: Prep time & Rating */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-stone-200">
          <div className="flex items-center gap-1 bg-stone-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-stone-800">
            <Clock className="w-3 h-3 text-[#C5A059]" />
            <span>{item.prepTimeMinutes || 25} mins</span>
          </div>

          <div className="flex items-center gap-1 bg-stone-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-stone-800 text-amber-300 font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating || '4.5'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-stone-100 text-base group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description || 'Prepared fresh with premium ingredients and signature spices.'}
          </p>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Price</span>
            <p className="text-base sm:text-lg font-extrabold text-stone-100 font-mono tracking-tight">
              Rs {item.price.toLocaleString()}
            </p>
          </div>

          <button
            id={`btn-add-cart-${item.id}`}
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-bold px-3 py-1.5 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all text-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
