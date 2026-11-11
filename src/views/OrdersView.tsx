import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Order } from '../types.ts';
import {
  Receipt,
  RotateCw,
  Clock,
  ArrowRight,
  CheckCircle2,
  Bike,
  ShoppingBag,
  Utensils,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrdersView: React.FC = () => {
  const { user, trackOrder, addToCart, setIsCartOpen, menuItems, showToast } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'previous'>('active');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // If user is logged in, fetch orders with their userId or all recent orders
      const url = user?.id ? `/api/orders?userId=${user.id}` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.status)
  );
  const pastOrders = orders.filter((o) =>
    ['delivered', 'cancelled'].includes(o.status)
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) {
      showToast('Cannot reorder empty order', 'info');
      return;
    }

    let addedCount = 0;
    order.items.forEach((item) => {
      // Find matching menuItem if available
      const found = menuItems.find((m) => m.id === item.menuItemId);
      if (found) {
        addToCart(found, item.quantity);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setIsCartOpen(true);
      showToast(`Added ${addedCount} items back to your cart!`);
    } else {
      showToast('Items from this order are currently unavailable', 'info');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Received', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'accepted':
      case 'preparing':
        return { label: 'Kitchen Preparing', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'ready':
        return { label: 'Order Ready', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'delivered':
        return { label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
      default:
        return { label: status, color: 'bg-stone-800 text-stone-300 border-stone-700' };
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Track active deliveries and re-order past favorites
          </p>
        </div>

        <button
          onClick={fetchOrders}
          title="Refresh orders"
          className="p-2.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-900 p-1.5 rounded-2xl border border-stone-800 max-w-sm">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-[#C5A059] text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>Active Orders</span>
          {activeOrders.length > 0 && (
            <span className="bg-stone-950 text-[#D4AF37] px-1.5 py-0.2 rounded-full text-[10px]">
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('previous')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'previous'
              ? 'bg-[#C5A059] text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>Past Orders</span>
          <span className="text-stone-500 text-[10px]">({pastOrders.length})</span>
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="bg-stone-900/60 rounded-3xl border border-stone-800 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mx-auto">
            <Receipt className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-200">
            {activeTab === 'active' ? 'No active orders right now' : 'No past orders found'}
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            {activeTab === 'active'
              ? 'When you order delicious burgers, pizza, or BBQ, your live tracking will show up here!'
              : 'You haven’t completed any orders yet. Try our delicious signature platters!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleString('en-PK', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Just now';

            return (
              <div
                key={order.id}
                className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 hover:border-stone-700 transition-all space-y-4 shadow-md"
              >
                {/* Order Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-[#D4AF37]">
                      {order.orderType === 'delivery' && <Bike className="w-5 h-5" />}
                      {order.orderType === 'takeout' && <ShoppingBag className="w-5 h-5" />}
                      {order.orderType === 'dine_in' && <Utensils className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base font-mono text-stone-100">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                          {order.orderType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{dateStr}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Items preview */}
                <div className="text-xs text-stone-300 space-y-1">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-stone-300">
                        {item.quantity}x {item.itemName}
                      </span>
                      <span className="font-mono text-stone-400">
                        Rs {item.itemTotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <p className="text-[11px] text-stone-500 italic">
                      + {order.items.length - 3} more items...
                    </p>
                  )}
                </div>

                {/* Footer with total & actions */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                      Total Bill
                    </span>
                    <span className="text-base sm:text-lg font-extrabold font-mono text-[#D4AF37]">
                      Rs {order.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-track-${order.orderNumber}`}
                      onClick={() => trackOrder(order.orderNumber)}
                      className="bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{order.status === 'delivered' ? 'View Details' : 'Track Live'}</span>
                    </button>

                    <button
                      id={`btn-reorder-${order.orderNumber}`}
                      onClick={() => handleReorder(order)}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
