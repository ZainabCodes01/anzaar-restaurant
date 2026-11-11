import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { UserAddress, MenuItem } from '../types.ts';
import { FoodCard } from '../components/FoodCard.tsx';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Bell,
  HelpCircle,
  Info,
  Shield,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
  LogIn,
  LogOut,
  Edit2,
  Save,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    setUser,
    favorites,
    menuItems,
    settings,
    setIsAboutOpen,
    setActiveTab,
    showToast,
  } = useApp();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'profile' | 'addresses' | 'favorites' | 'notifications'>('profile');

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Valued Customer');
  const [editPhone, setEditPhone] = useState(user?.phone || '+92 333 9612344');
  const [editEmail, setEditEmail] = useState(user?.email || 'customer@daska.pk');

  // New address state
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddress, setNewAddress] = useState('');
  const [newArea, setNewArea] = useState('College Road');
  const [addingAddress, setAddingAddress] = useState(false);

  // Policy modal
  const [policyModal, setPolicyModal] = useState<string | null>(null);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/addresses?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchNotifications();
  }, [user?.id]);

  const handleSaveProfile = () => {
    if (user) {
      const updated = {
        ...user,
        name: editName,
        phone: editPhone,
        email: editEmail,
      };
      setUser(updated);
      setIsEditing(false);
      showToast('Profile updated successfully!');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim() || !user) return;

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          label: newLabel,
          address: newAddress.trim(),
          area: newArea,
          city: 'Daska',
          isDefault: addresses.length === 0,
        }),
      });

      if (res.ok) {
        setNewAddress('');
        setAddingAddress(false);
        fetchAddresses();
        showToast('Address saved!');
      }
    } catch {
      showToast('Failed to save address', 'error');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/addresses/${id}?userId=${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        showToast('Address removed');
      }
    } catch {
      showToast('Failed to delete address', 'error');
    }
  };

  const favoriteDishes = menuItems.filter((m) => favorites.includes(m.id));

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1
          className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          My Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Manage your contact details, delivery addresses, and preferences
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C6D2C] flex items-center justify-center text-stone-950 font-bold text-2xl shadow-lg shadow-black/40 shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-stone-100 font-serif">
                  {user?.name || 'Valued Customer'}
                </h2>
                <span className="text-[10px] uppercase font-extrabold bg-[#C5A059]/20 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                  Daska Member
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3 text-[#C5A059]" />
                <span>{user?.phone || '+92 333 9612344'}</span>
              </p>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3" />
                <span>{user?.email || 'customer@daska.pk'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Edit profile form drawer if open */}
        {isEditing && (
          <div className="mt-5 pt-5 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-stone-400">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl text-xs px-3 py-2 text-stone-100 focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-stone-400">Phone</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl text-xs px-3 py-2 text-stone-100 focus:border-[#C5A059]"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={handleSaveProfile}
                className="bg-[#C5A059] text-stone-950 font-bold py-2 px-4 rounded-xl text-xs hover:bg-[#D4AF37] transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveSection('profile')}
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeSection === 'profile'
              ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#D4AF37]'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Support & Help</span>
        </button>

        <button
          onClick={() => setActiveSection('addresses')}
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeSection === 'addresses'
              ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#D4AF37]'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('favorites')}
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeSection === 'favorites'
              ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#D4AF37]'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
          }`}
        >
          <Heart className="w-4 h-4 text-red-400" />
          <span>Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('notifications')}
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeSection === 'notifications'
              ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#D4AF37]'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts ({notifications.length})</span>
        </button>
      </div>

      {/* SECTION 1: Help, Support & About */}
      {activeSection === 'profile' && (
        <div className="space-y-4">
          {/* Quick Contact Box */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold font-serif text-stone-100">
              Customer Care & Direct Inquiries
            </h3>
            <p className="text-xs text-stone-400">
              Need assistance with an active order or party reservation in Daska? We are here to help!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${settings?.phone || '+923339612344'}`}
                className="bg-stone-800/80 hover:bg-stone-800 p-3.5 rounded-2xl border border-stone-700 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Direct Call</span>
                  <p className="text-sm font-bold text-stone-100">{settings?.phone || '+92 333 9612344'}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/923339612344?text=${encodeURIComponent('Hello Anzaar Restaurant! I would like to make an inquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-stone-800/80 hover:bg-stone-800 p-3.5 rounded-2xl border border-stone-700 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/15 text-green-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">WhatsApp Chat</span>
                  <p className="text-sm font-bold text-stone-100">+92 333 9612344</p>
                </div>
              </a>
            </div>
          </div>

          {/* About & Policies Shortcuts */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 divide-y divide-stone-800 overflow-hidden">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-[#C5A059]" />
                <div>
                  <p className="text-sm font-semibold text-stone-200">About Anzaar Restaurant</p>
                  <p className="text-xs text-stone-400">Ratings, address, Google Maps location & timings</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-500" />
            </button>

            <button
              onClick={() => setPolicyModal('terms')}
              className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-sm font-semibold text-stone-200">Terms of Service & Halal Guarantee</p>
                  <p className="text-xs text-stone-400">Food safety standard and ordering policies</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-500" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: Saved Addresses */}
      {activeSection === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-100 font-serif">Saved Delivery Addresses</h3>
            <button
              onClick={() => setAddingAddress(!addingAddress)}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {addingAddress && (
            <form onSubmit={handleAddAddress} className="bg-stone-900 border border-[#C5A059]/40 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs uppercase font-bold text-[#C5A059]">Add Delivery Location</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Home, Office, Farm)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-stone-800 border border-stone-700 rounded-xl text-xs px-3 py-2 text-stone-100"
                />
                <input
                  type="text"
                  placeholder="Area (e.g. College Rd, Model Town)"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="bg-stone-800 border border-stone-700 rounded-xl text-xs px-3 py-2 text-stone-100"
                />
              </div>
              <textarea
                required
                rows={2}
                placeholder="Full Street address, House number, landmarks in Daska"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs px-3 py-2 text-stone-100"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddingAddress(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] text-stone-950 font-bold px-4 py-1.5 rounded-xl text-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {addresses.length === 0 ? (
            <div className="bg-stone-900/60 rounded-3xl border border-stone-800 p-8 text-center text-stone-400 text-xs">
              No saved addresses yet. Add your home or workplace in Daska for 1-click checkout!
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-200">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-300 mt-1">{addr.address}</p>
                      <p className="text-[11px] text-stone-500">{addr.area}, Daska</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-stone-500 hover:text-red-400 p-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Favorites */}
      {activeSection === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-100 font-serif">Favorite Dishes</h3>
              <p className="text-xs text-stone-400">Your hand-picked favorite dishes from our menu</p>
            </div>
            {favoriteDishes.length > 0 && (
              <button
                onClick={() => setActiveTab('menu')}
                className="text-xs text-[#D4AF37] hover:underline"
              >
                Browse More
              </button>
            )}
          </div>

          {favoriteDishes.length === 0 ? (
            <div className="bg-stone-900/60 rounded-3xl border border-stone-800 p-10 text-center space-y-3">
              <Heart className="w-10 h-10 text-stone-600 mx-auto" />
              <h4 className="text-sm font-bold text-stone-200">No favorites yet</h4>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                Tap the heart icon on any burger, pizza, or BBQ platter to bookmark it here!
              </p>
              <button
                onClick={() => setActiveTab('menu')}
                className="mt-2 bg-[#C5A059] text-stone-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteDishes.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: Notifications */}
      {activeSection === 'notifications' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-100 font-serif">Order Updates & Offers</h3>
          <div className="bg-stone-900 rounded-3xl border border-stone-800 divide-y divide-stone-800 overflow-hidden">
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200">Welcome to Anzaar Restaurant Daska!</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Use coupon code ANZAAR15 on your order to save 15% on dining.
                </p>
                <span className="text-[10px] text-stone-500 mt-1 block">Today</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200">Live Kitchen Open</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  We are accepting Dine-in, Takeout, and No-contact delivery until 11:00 PM tonight.
                </p>
                <span className="text-[10px] text-stone-500 mt-1 block">Live</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Policies Modal */}
      {policyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-lg w-full text-stone-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-bold text-lg font-serif">Terms & Halal Guarantee</h3>
              <button
                onClick={() => setPolicyModal(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-stone-300 space-y-2 max-h-72 overflow-y-auto leading-relaxed">
              <p>
                <strong>1. 100% Halal Certified:</strong> All chicken, beef, mutton, and oils used across Anzaar Restaurant are sourced from certified Halal vendors in Punjab, Pakistan.
              </p>
              <p>
                <strong>2. Hygiene & Preparation:</strong> Our kitchen staff strictly complies with food safety and sanitary guidelines, ensuring high standards from preparation to packaging.
              </p>
              <p>
                <strong>3. Delivery Boundaries:</strong> Delivery services are centered around College Road, Jalalpur Ghumman, Model Town, Civil Lines, and adjacent Daska regions.
              </p>
            </div>
            <button
              onClick={() => setPolicyModal(null)}
              className="w-full bg-[#C5A059] text-stone-950 font-bold py-2.5 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
