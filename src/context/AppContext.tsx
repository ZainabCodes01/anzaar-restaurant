import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MenuItem,
  Category,
  CartItem,
  SelectedOption,
  UserProfile,
  RestaurantSettings,
  Offer,
} from '../types.ts';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_MENU_ITEMS,
  DEFAULT_SETTINGS,
  DEFAULT_OFFERS,
} from '../data/initialData.ts';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  activeTab: 'home' | 'menu' | 'orders' | 'profile' | 'favorites';
  setActiveTab: (tab: 'home' | 'menu' | 'orders' | 'profile' | 'favorites') => void;
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number, selectedOptions?: SelectedOption[]) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  activeOffer: Offer | null;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  discountAmount: number;
  deliveryFee: number;
  cartFinalTotal: number;
  favorites: number[];
  toggleFavorite: (menuItemId: number) => Promise<void>;
  settings: RestaurantSettings | null;
  refreshSettings: () => Promise<void>;
  categories: Category[];
  menuItems: MenuItem[];
  refreshMenu: () => Promise<void>;
  selectedFoodItem: MenuItem | null;
  setSelectedFoodItem: (item: MenuItem | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingOrderNumber: string | null;
  trackOrder: (orderNumber: string) => void;
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
  reviewModalItem: MenuItem | null;
  setReviewModalItem: (item: MenuItem | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  loginAsGuest: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('anzaar_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: 1,
      uid: 'guest_customer_daska',
      email: 'customer@daska.pk',
      name: 'Valued Customer',
      phone: '+92 333 1234567',
      role: 'customer',
    };
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('anzaar_admin_mode') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'orders' | 'profile' | 'favorites'>('home');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('anzaar_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [activeOffer, setActiveOffer] = useState<Offer | null>(DEFAULT_OFFERS[0] || null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [reviewModalItem, setReviewModalItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('anzaar_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('anzaar_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('anzaar_admin_mode', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const refreshMenu = async () => {
    try {
      const [catRes, menuRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/menu'),
      ]);
      if (catRes.ok) {
        const cats = await catRes.json();
        setCategories(cats);
      }
      if (menuRes.ok) {
        const items = await menuRes.json();
        setMenuItems(items);
      }
    } catch (err) {
      console.error('Failed to load menu data:', err);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/favorites?userId=${user.id}`);
      if (res.ok) {
        const favIds = await res.json();
        setFavorites(favIds);
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  useEffect(() => {
    refreshSettings();
    refreshMenu();
    loadFavorites();
  }, [user?.id]);

  const addToCart = (
    menuItem: MenuItem,
    quantity: number = 1,
    selectedOptions: SelectedOption[] = []
  ) => {
    const optionsKey = selectedOptions
      .map((o) => `${o.groupTitle}:${o.choiceName}`)
      .sort()
      .join('|');
    const cartItemId = `${menuItem.id}-${optionsKey}`;

    const extrasPrice = selectedOptions.reduce((sum, o) => sum + o.choicePrice, 0);
    const unitPrice = menuItem.price + extrasPrice;
    const totalPrice = unitPrice * quantity;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            menuItem,
            quantity,
            selectedOptions,
            unitPrice,
            totalPrice,
          },
        ];
      }
    });

    showToast(`Added "${menuItem.name}" to cart!`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setActiveOffer(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const deliveryFee = settings?.deliveryFee ?? 150;

  // Calculate discount
  let discountAmount = 0;
  if (activeOffer) {
    if (activeOffer.minOrderAmount && cartSubtotal < activeOffer.minOrderAmount) {
      discountAmount = 0;
    } else if (activeOffer.discountPercent && activeOffer.discountPercent > 0) {
      discountAmount = Math.round((cartSubtotal * activeOffer.discountPercent) / 100);
    } else if (activeOffer.fixedDiscount && activeOffer.fixedDiscount > 0) {
      discountAmount = Math.min(activeOffer.fixedDiscount, cartSubtotal);
    }
  }

  const cartFinalTotal = Math.max(0, cartSubtotal + (cart.length > 0 ? deliveryFee : 0) - discountAmount);

  const applyPromoCode = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    try {
      const res = await fetch('/api/offers');
      if (res.ok) {
        const offers: Offer[] = await res.json();
        const found = offers.find(
          (o) => o.promoCode.toUpperCase() === cleanCode && o.isActive
        );
        if (!found) {
          return { success: false, message: 'Invalid or expired promo code.' };
        }
        if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
          return {
            success: false,
            message: `Minimum order of Rs ${found.minOrderAmount.toLocaleString()} required for this coupon.`,
          };
        }
        setActiveOffer(found);
        return { success: true, message: `Promo code "${found.promoCode}" applied successfully!` };
      }
      return { success: false, message: 'Failed to validate promo code.' };
    } catch {
      return { success: false, message: 'Error applying promo code.' };
    }
  };

  const removePromoCode = () => {
    setActiveOffer(null);
    showToast('Promo code removed');
  };

  const toggleFavorite = async (menuItemId: number) => {
    if (!user) {
      showToast('Please sign in to save favorites', 'info');
      return;
    }
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, menuItemId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.favorited) {
          setFavorites((prev) => [...prev, menuItemId]);
          showToast('Added to favorites!');
        } else {
          setFavorites((prev) => prev.filter((id) => id !== menuItemId));
          showToast('Removed from favorites');
        }
      }
    } catch {
      showToast('Failed to update favorite', 'error');
    }
  };

  const trackOrder = (orderNumber: string) => {
    setTrackingOrderNumber(orderNumber);
    setIsTrackingOpen(true);
  };

  const loginAsGuest = () => {
    setUser({
      id: 1,
      uid: 'guest_customer_daska',
      email: 'customer@daska.pk',
      name: 'Valued Guest',
      phone: '+92 333 1234567',
      role: 'customer',
    });
    showToast('Logged in as Guest Customer');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
        setIsAdmin,
        activeTab,
        setActiveTab,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        activeOffer,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        deliveryFee,
        cartFinalTotal,
        favorites,
        toggleFavorite,
        settings,
        refreshSettings,
        categories,
        menuItems,
        refreshMenu,
        selectedFoodItem,
        setSelectedFoodItem,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingOrderNumber,
        trackOrder,
        isAboutOpen,
        setIsAboutOpen,
        reviewModalItem,
        setReviewModalItem,
        searchQuery,
        setSearchQuery,
        selectedCategorySlug,
        setSelectedCategorySlug,
        toast,
        showToast,
        loginAsGuest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
