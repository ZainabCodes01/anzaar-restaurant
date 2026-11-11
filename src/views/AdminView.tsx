import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  MenuItem,
  Category,
  Order,
  Offer,
  Review,
  DeliveryStaff,
  AdminAnalytics,
  OrderStatus,
} from '../types.ts';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Tag,
  Users,
  Settings,
  Star,
  Bike,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  RotateCw,
  Eye,
  LogOut,
  TrendingUp,
  AlertCircle,
  Save,
  Check,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const AdminView: React.FC = () => {
  const {
    setIsAdmin,
    settings,
    refreshSettings,
    categories,
    menuItems,
    refreshMenu,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'menu' | 'categories' | 'offers' | 'reviews' | 'staff' | 'settings'
  >('dashboard');

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [staff, setStaff] = useState<DeliveryStaff[]>([]);
  const [loading, setLoading] = useState(false);

  // Menu item modal state
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Category modal state
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // Offer modal state
  const [offerTitle, setOfferTitle] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerPercent, setOfferPercent] = useState(15);
  const [offerMinOrder, setOfferMinOrder] = useState(2000);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Delivery staff state
  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('+92 3');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Settings edit state
  const [editRestaurantName, setEditRestaurantName] = useState(settings?.name || 'Anzaar Restaurant');
  const [editPhone, setEditPhone] = useState(settings?.phone || '+92 333 9612344');
  const [editAddress, setEditAddress] = useState(settings?.address || 'College Rd, Jalalpur Ghumman, Daska');
  const [editDeliveryFee, setEditDeliveryFee] = useState(settings?.deliveryFee || 150);
  const [editIsOpen, setEditIsOpen] = useState(settings?.isOpen ?? true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, ordersRes, offersRes, reviewsRes, staffRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/orders'),
        fetch('/api/offers'),
        fetch('/api/reviews'),
        fetch('/api/delivery-staff'),
      ]);

      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (offersRes.ok) setOffers(await offersRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
      if (staffRes.ok) setStaff(await staffRes.json());
    } catch {
      showToast('Error syncing administrative data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Order #${orderId} status changed to ${newStatus}`);
        fetchAdminData();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem.price) return;

    try {
      const isEdit = !!editingItem.id;
      const url = isEdit ? `/api/menu/${editingItem.id}` : '/api/menu';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        showToast(`Menu item ${isEdit ? 'updated' : 'created'} successfully!`);
        setIsItemModalOpen(false);
        setEditingItem(null);
        refreshMenu();
      }
    } catch {
      showToast('Error saving food item', 'error');
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Item deleted');
        refreshMenu();
      }
    } catch {
      showToast('Failed to delete item', 'error');
    }
  };

  const handleToggleItemAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      if (res.ok) {
        refreshMenu();
        showToast(`Item is now ${!item.isAvailable ? 'Available' : 'Unavailable'}`);
      }
    } catch {
      showToast('Failed to toggle availability', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editRestaurantName,
          phone: editPhone,
          address: editAddress,
          deliveryFee: editDeliveryFee,
          isOpen: editIsOpen,
        }),
      });
      if (res.ok) {
        refreshSettings();
        showToast('Restaurant settings updated!');
      }
    } catch {
      showToast('Failed to save settings', 'error');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName.trim(),
          slug: categorySlug.trim() || categoryName.toLowerCase().replace(/\s+/g, '-'),
          sortOrder: categories.length + 1,
          isActive: true,
        }),
      });
      if (res.ok) {
        setIsCatModalOpen(false);
        setCategoryName('');
        setCategorySlug('');
        refreshMenu();
        showToast('Category created!');
      }
    } catch {
      showToast('Failed to create category', 'error');
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerCode.trim()) return;
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: offerTitle.trim() || `${offerPercent}% Off Special`,
          promoCode: offerCode.trim().toUpperCase(),
          discountPercent: offerPercent,
          minOrderAmount: offerMinOrder,
          isActive: true,
        }),
      });
      if (res.ok) {
        setIsOfferModalOpen(false);
        setOfferTitle('');
        setOfferCode('');
        fetchAdminData();
        showToast('Offer created successfully!');
      }
    } catch {
      showToast('Failed to create offer', 'error');
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;
    try {
      const res = await fetch('/api/delivery-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: staffName.trim(),
          phone: staffPhone.trim(),
          isActive: true,
        }),
      });
      if (res.ok) {
        setIsStaffModalOpen(false);
        setStaffName('');
        setStaffPhone('+92 3');
        fetchAdminData();
        showToast('Delivery driver registered!');
      }
    } catch {
      showToast('Failed to add driver', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Top Admin Navigation Header */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
              AZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide font-serif text-stone-100">
                  Anzaar Restaurant
                </span>
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Manager Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Daska, Pakistan • Cloud SQL Connected</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>

            <button
              id="btn-exit-admin"
              onClick={() => setIsAdmin(false)}
              className="flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-sm transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Customer App</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#C5A059] text-stone-950 shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-[#C5A059] text-stone-950 shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Live Orders ({orders.filter((o) => o.status !== 'delivered').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'menu'
                ? 'bg-[#C5A059] text-stone-950 shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu Items ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'categories'
                ? 'bg-[#C5A059] text-stone-950 shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'offers'
                ? 'bg-[#C5A059] text-stone-950 shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons & Offers ({offers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'staff'
                ? 'bg-[#C5A059] text-stone-950 shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Delivery Staff ({staff.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'reviews'
                ? 'bg-[#C5A059] text-stone-950 shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-[#C5A059] text-stone-950 shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Restaurant Config</span>
          </button>
        </div>

        {/* 1. TAB: DASHBOARD ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-900 rounded-3xl border border-stone-800 p-5 space-y-2">
                <span className="text-xs uppercase font-bold text-stone-400">Today&apos;s Revenue</span>
                <p className="text-2xl font-extrabold font-mono text-[#D4AF37]">
                  Rs {analytics?.todayRevenue?.toLocaleString() || '14,800'}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Daska live counter</span>
                </div>
              </div>

              <div className="bg-stone-900 rounded-3xl border border-stone-800 p-5 space-y-2">
                <span className="text-xs uppercase font-bold text-stone-400">Today&apos;s Orders</span>
                <p className="text-2xl font-extrabold font-mono text-stone-100">
                  {analytics?.todayOrders ?? orders.length}
                </p>
                <p className="text-[11px] text-stone-400">Dine-in, Takeout & Delivery</p>
              </div>

              <div className="bg-stone-900 rounded-3xl border border-stone-800 p-5 space-y-2">
                <span className="text-xs uppercase font-bold text-amber-400">Active Kitchen Queue</span>
                <p className="text-2xl font-extrabold font-mono text-amber-300">
                  {orders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)).length}
                </p>
                <p className="text-[11px] text-stone-400">Orders in prep</p>
              </div>

              <div className="bg-stone-900 rounded-3xl border border-stone-800 p-5 space-y-2">
                <span className="text-xs uppercase font-bold text-stone-400">Avg Ticket Value</span>
                <p className="text-2xl font-extrabold font-mono text-stone-100">
                  Rs {analytics?.averageOrderValue?.toLocaleString() || '2,450'}
                </p>
                <p className="text-[11px] text-stone-400">Per Customer Order</p>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-stone-100">Weekly Revenue Breakdown</h3>
                  <p className="text-xs text-stone-400">Daily sales in PKR across all dining channels</p>
                </div>
                <span className="text-xs text-[#D4AF37] font-semibold">Live PostgreSQL Analytics</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      analytics?.dailyChartData || [
                        { day: 'Mon', sales: 18500 },
                        { day: 'Tue', sales: 22000 },
                        { day: 'Wed', sales: 19400 },
                        { day: 'Thu', sales: 26800 },
                        { day: 'Fri', sales: 34500 },
                        { day: 'Sat', sales: 42000 },
                        { day: 'Sun', sales: 38900 },
                      ]
                    }
                  >
                    <XAxis dataKey="day" stroke="#78716c" fontSize={12} />
                    <YAxis stroke="#78716c" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1c1917',
                        borderColor: '#44403c',
                        borderRadius: '12px',
                        color: '#fafaf9',
                      }}
                    />
                    <Bar dataKey="sales" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: LIVE ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-100">Orders Management</h2>
                <p className="text-xs text-stone-400">Accept, dispatch, and fulfill customer requests</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-stone-900/60 rounded-3xl border border-stone-800 p-8 text-center text-stone-400 text-xs">
                No orders placed yet.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-extrabold text-stone-100 text-base">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold bg-[#C5A059]/20 text-[#D4AF37] px-2.5 py-0.5 rounded-full">
                          {ord.orderType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-stone-400">
                          {ord.customerName} ({ord.customerPhone})
                        </span>
                      </div>

                      <p className="text-xs text-stone-300">
                        {ord.orderType === 'dine_in'
                          ? `Table: ${ord.tableNumber || 'Main Hall'}, Guests: ${ord.guestCount || 2}`
                          : ord.orderType === 'takeout'
                          ? 'Self Takeout Pickup at Daska Counter'
                          : `Delivery: ${ord.address || ''}, ${ord.area || 'Daska'}`}
                      </p>

                      <div className="text-xs text-stone-400 flex flex-wrap gap-2">
                        {ord.items?.map((it, i) => (
                          <span key={i} className="bg-stone-800 px-2 py-0.5 rounded">
                            {it.quantity}x {it.itemName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2.5 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-stone-400">Total Bill</span>
                        <p className="text-lg font-extrabold font-mono text-[#D4AF37]">
                          Rs {ord.total.toLocaleString()}
                        </p>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-stone-400">Status:</label>
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className="bg-stone-800 border border-stone-700 rounded-xl text-xs px-3 py-1.5 text-stone-200 font-bold focus:border-[#C5A059]"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="preparing">Preparing in Kitchen</option>
                          <option value="ready">Ready for Dispatch</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered & Complete</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. TAB: MENU ITEMS MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-100">Dishes & Menu Catalog</h2>
                <p className="text-xs text-stone-400">Add dishes, set prices in PKR, and adjust availability</p>
              </div>

              <button
                id="btn-add-food-item"
                onClick={() => {
                  setEditingItem({
                    name: '',
                    price: 650,
                    categoryId: categories[0]?.id || 1,
                    description: '',
                    image: '',
                    isVeg: false,
                    isAvailable: true,
                    isPopular: false,
                    isFeatured: false,
                    prepTimeMinutes: 20,
                    portionSize: 'Serves 1',
                    ingredients: '',
                  });
                  setIsItemModalOpen(true);
                }}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-950 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-stone-100 truncate">{item.name}</h4>
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            item.isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                      <p className="text-xs font-mono font-bold text-[#D4AF37] mt-0.5">
                        Rs {item.price.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-stone-400 line-clamp-1 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleItemAvailability(item)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        item.isAvailable
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsItemModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-900/50 text-stone-400 hover:text-red-400"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TAB: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-100">Categories</h2>
                <p className="text-xs text-stone-400">Organize food offerings into searchable sections</p>
              </div>

              <button
                onClick={() => setIsCatModalOpen(true)}
                className="bg-[#C5A059] text-stone-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-1">
                  <p className="font-bold text-sm text-stone-100">{c.name}</p>
                  <p className="text-[11px] text-stone-400 font-mono">slug: {c.slug}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TAB: OFFERS & PROMO CODES */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-100">Discounts & Promo Codes</h2>
                <p className="text-xs text-stone-400">Create promotional vouchers for customers in Daska</p>
              </div>

              <button
                onClick={() => setIsOfferModalOpen(true)}
                className="bg-[#C5A059] text-stone-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offers.map((o) => (
                <div key={o.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-[#D4AF37] bg-stone-950 px-3 py-1 rounded-lg border border-[#C5A059]/40">
                      {o.promoCode}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {o.discountPercent ? `${o.discountPercent}% OFF` : `Rs ${o.fixedDiscount} OFF`}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-stone-200">{o.title}</p>
                  <p className="text-[11px] text-stone-400">
                    Min Order Amount: Rs {o.minOrderAmount?.toLocaleString() || '1,000'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB: DELIVERY STAFF */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-100">Delivery Riders</h2>
                <p className="text-xs text-stone-400">Assign drivers for local delivery across Daska</p>
              </div>

              <button
                onClick={() => setIsStaffModalOpen(true)}
                className="bg-[#C5A059] text-stone-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Driver</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {staff.map((s) => (
                <div key={s.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 text-[#D4AF37] flex items-center justify-center">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-100">{s.name}</p>
                    <p className="text-[11px] text-stone-400">{s.phone}</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">Active in Daska</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TAB: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-serif text-stone-100">Customer Reviews & Ratings</h2>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-200">{r.customerName}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-500">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 italic">&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. TAB: RESTAURANT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 max-w-2xl space-y-5">
            <h2 className="text-lg font-bold font-serif text-stone-100">Restaurant Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] text-stone-400">Restaurant Name</label>
                <input
                  type="text"
                  value={editRestaurantName}
                  onChange={(e) => setEditRestaurantName(e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone-400">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400">Delivery Fee (PKR)</label>
                  <input
                    type="number"
                    value={editDeliveryFee}
                    onChange={(e) => setEditDeliveryFee(parseInt(e.target.value, 10) || 150)}
                    className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-400">Address in Daska</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsOpen}
                    onChange={(e) => setEditIsOpen(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A059]"
                  />
                  <span className="text-sm font-semibold text-stone-200">
                    Restaurant Open for Online Orders
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: ADD/EDIT FOOD ITEM */}
      {isItemModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-xl w-full text-stone-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-bold text-base font-serif">
                {editingItem.id ? 'Edit Food Item' : 'New Food Item'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-stone-400">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smoky Beef Zinger"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone-400">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="650"
                    value={editingItem.price || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400">Category</label>
                  <select
                    value={editingItem.categoryId || categories[0]?.id || 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        categoryId: parseInt(e.target.value, 10),
                      })
                    }
                    className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-400">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editingItem.image || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Freshly prepared with artisanal sauce..."
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone-400">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={editingItem.prepTimeMinutes || 20}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        prepTimeMinutes: parseInt(e.target.value, 10),
                      })
                    }
                    className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400">Portion</label>
                  <input
                    type="text"
                    placeholder="Serves 1-2"
                    value={editingItem.portionSize || 'Serves 1'}
                    onChange={(e) => setEditingItem({ ...editingItem, portionSize: e.target.value })}
                    className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isVeg ?? false}
                    onChange={(e) => setEditingItem({ ...editingItem, isVeg: e.target.checked })}
                    className="rounded text-[#C5A059]"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPopular ?? false}
                    onChange={(e) => setEditingItem({ ...editingItem, isPopular: e.target.checked })}
                    className="rounded text-[#C5A059]"
                  />
                  <span>Popular Item</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured ?? false}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="rounded text-[#C5A059]"
                  />
                  <span>Featured Dish</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] text-stone-950 font-bold px-5 py-2 rounded-xl"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CATEGORY */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full text-stone-100 space-y-4">
            <h3 className="font-bold text-base font-serif">Add New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-stone-400">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seafood"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-400">Slug</label>
                <input
                  type="text"
                  placeholder="seafood"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] text-stone-950 font-bold px-4 py-1.5 rounded-xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROMO OFFER */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full text-stone-100 space-y-4">
            <h3 className="font-bold text-base font-serif">Create Coupon Code</h3>
            <form onSubmit={handleCreateOffer} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-stone-400">Coupon Title</label>
                <input
                  type="text"
                  placeholder="Weekend Feast Discount"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-400">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="WEEKEND20"
                  value={offerCode}
                  onChange={(e) => setOfferCode(e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-stone-400">Discount %</label>
                  <input
                    type="number"
                    value={offerPercent}
                    onChange={(e) => setOfferPercent(parseInt(e.target.value, 10) || 0)}
                    className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400">Min Order (PKR)</label>
                  <input
                    type="number"
                    value={offerMinOrder}
                    onChange={(e) => setOfferMinOrder(parseInt(e.target.value, 10) || 0)}
                    className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] text-stone-950 font-bold px-4 py-1.5 rounded-xl"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DRIVER */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full text-stone-100 space-y-4">
            <h3 className="font-bold text-base font-serif">Register Delivery Driver</h3>
            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-stone-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asim Raza"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-400">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+92 333 1234567"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] text-stone-950 font-bold px-4 py-1.5 rounded-xl"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
