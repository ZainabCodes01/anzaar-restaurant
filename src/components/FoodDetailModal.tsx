import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CustomizationGroup, SelectedOption } from '../types.ts';
import {
  X,
  Star,
  Clock,
  Users,
  Plus,
  Minus,
  Check,
  Heart,
  MessageSquarePlus,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { onImageErrorFallback, SVG_FOOD_PLACEHOLDER } from '../data/initialData.ts';

export const FoodDetailModal: React.FC = () => {
  const {
    selectedFoodItem,
    setSelectedFoodItem,
    addToCart,
    favorites,
    toggleFavorite,
    setReviewModalItem,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  // Parse customization options JSON
  const customizationGroups: CustomizationGroup[] = useMemo(() => {
    if (!selectedFoodItem?.customizationOptionsJson) return [];
    try {
      return JSON.parse(selectedFoodItem.customizationOptionsJson);
    } catch {
      return [];
    }
  }, [selectedFoodItem]);

  // Set default options on item select (e.g. first choice for single-choice required groups)
  useEffect(() => {
    if (selectedFoodItem) {
      setQuantity(1);
      const defaults: SelectedOption[] = [];
      customizationGroups.forEach((group) => {
        if (group.type === 'single' && group.choices.length > 0) {
          defaults.push({
            groupTitle: group.title,
            choiceName: group.choices[0].name,
            choicePrice: group.choices[0].price,
          });
        }
      });
      setSelectedOptions(defaults);
    }
  }, [selectedFoodItem, customizationGroups]);

  if (!selectedFoodItem) return null;

  const isFavorited = favorites.includes(selectedFoodItem.id);

  const handleSingleSelect = (groupTitle: string, choiceName: string, choicePrice: number) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((o) => o.groupTitle !== groupTitle);
      return [...filtered, { groupTitle, choiceName, choicePrice }];
    });
  };

  const handleMultipleToggle = (groupTitle: string, choiceName: string, choicePrice: number) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o) => o.groupTitle === groupTitle && o.choiceName === choiceName);
      if (exists) {
        return prev.filter((o) => !(o.groupTitle === groupTitle && o.choiceName === choiceName));
      } else {
        return [...prev, { groupTitle, choiceName, choicePrice }];
      }
    });
  };

  const extrasTotal = selectedOptions.reduce((acc, curr) => acc + curr.choicePrice, 0);
  const unitPrice = selectedFoodItem.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(selectedFoodItem, quantity, selectedOptions);
    setSelectedFoodItem(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 text-stone-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header Image */}
          <div className="relative aspect-[16/9] w-full bg-stone-950 shrink-0">
            <img
              src={
                selectedFoodItem.image ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
              }
              alt={selectedFoodItem.name}
              referrerPolicy="no-referrer"
              onError={(e) => onImageErrorFallback(e, SVG_FOOD_PLACEHOLDER)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/40" />

            {/* Close Button */}
            <button
              id="btn-close-food-modal"
              onClick={() => setSelectedFoodItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700/60 flex items-center justify-center transition-transform active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(selectedFoodItem.id)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-stone-900/80 border border-stone-700/60 flex items-center justify-center text-stone-300 hover:text-red-500 transition-all"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-stone-300'
                }`}
              />
            </button>

            {/* Veg / Non-Veg Indicator */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-sm border flex items-center justify-center bg-stone-900/80 backdrop-blur-sm ${
                  selectedFoodItem.isVeg ? 'border-emerald-500' : 'border-red-500'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    selectedFoodItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-300 bg-stone-900/80 backdrop-blur-sm px-2 py-0.5 rounded">
                {selectedFoodItem.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>
          </div>

          {/* Scrollable Details Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 divide-y divide-stone-800/80">
            {/* Title & Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-serif">
                    {selectedFoodItem.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                    {selectedFoodItem.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-[#C5A059] font-medium block">Starting from</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-stone-100 font-mono">
                    Rs {selectedFoodItem.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Badges / Pill row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-stone-300">
                <div className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1.5 rounded-xl border border-stone-700/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-amber-300">{selectedFoodItem.rating || '4.5'}</span>
                  <span className="text-stone-400">({selectedFoodItem.reviewCount || 12} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1.5 rounded-xl border border-stone-700/60">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{selectedFoodItem.prepTimeMinutes || 25} mins prep</span>
                </div>

                <div className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1.5 rounded-xl border border-stone-700/60">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedFoodItem.portionSize || 'Serves 1-2'}</span>
                </div>
              </div>
            </div>

            {/* Ingredients & Freshness note */}
            {selectedFoodItem.ingredients && (
              <div className="pt-4 space-y-1.5">
                <h4 className="text-xs uppercase tracking-wider text-[#C5A059] font-bold">
                  Key Ingredients
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {selectedFoodItem.ingredients}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Prepared with 100% Halal prime meats and fresh local produce in Daska.</span>
                </div>
              </div>
            )}

            {/* Customization Options */}
            {customizationGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-stone-100 flex items-center gap-1.5">
                    <span>{group.title}</span>
                    {group.required && (
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-stone-400">
                    {group.type === 'single' ? 'Select 1' : 'Optional extras'}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.choices.map((choice, choiceIdx) => {
                    const isSelected = selectedOptions.some(
                      (o) => o.groupTitle === group.title && o.choiceName === choice.name
                    );

                    return (
                      <div
                        key={choiceIdx}
                        onClick={() => {
                          if (group.type === 'single') {
                            handleSingleSelect(group.title, choice.name, choice.price);
                          } else {
                            handleMultipleToggle(group.title, choice.name, choice.price);
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#C5A059]/15 border-[#C5A059] text-stone-100'
                            : 'bg-stone-800/50 border-stone-800 hover:border-stone-700 text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected
                                ? 'bg-[#C5A059] border-[#C5A059] text-stone-950'
                                : 'border-stone-600 bg-stone-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium">{choice.name}</span>
                        </div>

                        <span className="text-xs sm:text-sm font-semibold font-mono text-stone-300">
                          {choice.price > 0 ? `+Rs ${choice.price.toLocaleString()}` : 'Free'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Review Dish Prompt */}
            <div className="pt-4 flex items-center justify-between text-xs text-stone-400">
              <span>Have you tried this dish?</span>
              <button
                onClick={() => {
                  setReviewModalItem(selectedFoodItem);
                  setSelectedFoodItem(null);
                }}
                className="flex items-center gap-1 text-[#C5A059] hover:underline font-semibold"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4 shrink-0">
            {/* Quantity Selector */}
            <div className="flex items-center bg-stone-800/90 border border-stone-700/80 rounded-2xl p-1 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-700 active:scale-95 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm sm:text-base font-mono">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-700 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart with Total Price */}
            <button
              id="btn-confirm-add-cart"
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-stone-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-between text-sm sm:text-base"
            >
              <span>Add to Cart</span>
              <span className="font-mono bg-stone-950/15 px-2.5 py-1 rounded-xl">
                Rs {totalPrice.toLocaleString()}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
