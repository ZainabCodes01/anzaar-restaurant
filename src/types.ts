export interface CustomizationChoice {
  name: string;
  price: number;
}

export interface CustomizationGroup {
  title: string;
  type: 'single' | 'multiple';
  required?: boolean;
  choices: CustomizationChoice[];
}

export interface MenuItem {
  id: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  price: number; // in PKR
  image: string | null;
  isVeg: boolean | null;
  rating: string | null;
  reviewCount: number | null;
  prepTimeMinutes: number | null;
  portionSize: string | null;
  ingredients: string | null;
  isAvailable: boolean | null;
  isFeatured: boolean | null;
  isPopular: boolean | null;
  customizationOptionsJson: string | null;
  createdAt?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number | null;
  isActive: boolean | null;
  createdAt?: string | null;
}

export interface SelectedOption {
  groupTitle: string;
  choiceName: string;
  choicePrice: number;
}

export interface CartItem {
  id: string; // unique key in cart
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  menuItemId?: number | null;
  itemName: string;
  itemPrice: number;
  quantity: number;
  selectedOptionsJson?: string | null;
  itemTotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type OrderType = 'delivery' | 'takeout' | 'dine_in';

export interface Order {
  id: number;
  orderNumber: string;
  userId?: number | null;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number | null;
  discount: number | null;
  total: number;
  address?: string | null;
  area?: string | null;
  city?: string | null;
  deliveryInstructions?: string | null;
  tableNumber?: string | null;
  guestCount?: number | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  assignedStaffId?: number | null;
  estimatedMinutes?: number | null;
  createdAt?: string | null;
  items?: OrderItem[];
}

export interface UserProfile {
  id: number;
  uid: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'customer' | 'admin' | 'staff';
  createdAt?: string | null;
}

export interface UserAddress {
  id: number;
  userId: number;
  label: string;
  address: string;
  area: string;
  city: string;
  isDefault: boolean | null;
}

export interface Offer {
  id: number;
  title: string;
  description: string | null;
  discountPercent: number | null;
  fixedDiscount: number | null;
  promoCode: string;
  minOrderAmount: number | null;
  startDate: string | null;
  endDate: string | null;
  bannerImage: string | null;
  isActive: boolean | null;
}

export interface Review {
  id: number;
  menuItemId?: number | null;
  orderId?: number | null;
  userId?: number | null;
  customerName: string;
  rating: number;
  foodRating?: number | null;
  serviceRating?: number | null;
  deliveryRating?: number | null;
  comment?: string | null;
  isApproved: boolean | null;
  createdAt?: string | null;
}

export interface RestaurantSettings {
  id: number;
  name: string;
  logo: string | null;
  address: string;
  phone: string;
  openingHours: string | null;
  deliveryFee: number | null;
  minOrder: number | null;
  taxPercent: number | null;
  isOpen: boolean | null;
  description: string | null;
  socialLinksJson: string | null;
  deliveryAreasJson: string | null;
}

export interface DeliveryStaff {
  id: number;
  name: string;
  phone: string;
  isActive: boolean | null;
}

export interface AdminAnalytics {
  totalOrders: number;
  todayOrders: number;
  todayRevenue: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  dailyChartData: Array<{ day: string; sales: number }>;
  totalMenuItems: number;
  totalCategories: number;
}
