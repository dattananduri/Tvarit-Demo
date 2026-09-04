import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { AskTvaritModal } from '../components/AskTvaritModal';
import { VoiceToCartModal } from '../components/VoiceToCartModal';
import { SnapAndShopModal } from '../components/SnapAndShopModal';
import {
  Zap,
  ShoppingBag,
  Bike,
  Store,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Bot,
  Mic,
  Camera,
  HeartHandshake,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

export const LandingPage = () => {
  const { user, role, isAuthenticated, switchDemoAccount } = useAuth();
  const { addItem, addItems, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Modals state (For Customers & Guests)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);

  // Quick item builder on landing page
  const [quickItem, setQuickItem] = useState('');
  const [itemsList, setItemsList] = useState([
    { itemName: '2 kg Rice', itemQuantity: 2, unit: 'kg', estimatedPrice: 120, notes: '' },
    { itemName: '1 packet Sugar', itemQuantity: 1, unit: 'packet', estimatedPrice: 45, notes: '' },
    { itemName: '2 Milk', itemQuantity: 2, unit: 'packet', estimatedPrice: 60, notes: '' },
  ]);

  const handleAddQuickItem = (e) => {
    e.preventDefault();
    if (!quickItem.trim()) return;
    setItemsList([...itemsList, { itemName: quickItem.trim(), itemQuantity: 1, unit: 'unit', estimatedPrice: 40, notes: '' }]);
    setQuickItem('');
  };

  const handleRemoveItem = (index) => {
    setItemsList(itemsList.filter((_, i) => i !== index));
  };

  const handleStartOrder = () => {
    addItems(itemsList);
    showToast(`Added ${itemsList.length} items to your cart!`, 'success');
    setIsCartOpen(true);
  };

  const handleDemoQuickLogin = async (targetRole, path) => {
    try {
      await switchDemoAccount(targetRole);
      showToast(`Switched to demo ${targetRole.replace('ROLE_', '').toLowerCase()}`, 'success');
      navigate(path);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* If current user is already logged in as PARTNER, show dedicated Partner Hero Banner */}
      {role === 'ROLE_PARTNER' && (
        <section className="pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#102A24] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-900/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800">
                <Bike className="w-4 h-4" /> Logged in as Delivery Partner: {user?.name}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Ready to Earn? <br />
                <span className="text-[#00B373]">Open Your Partner Radar</span>
              </h2>
              <p className="text-sm text-slate-300">
                Accept incoming customer shopping runs from nearby local markets, check off items in the store, and earn ₹40 per completed delivery.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  to="/partner/dashboard"
                  className="px-6 py-3.5 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-black text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                >
                  <Bike className="w-5 h-5" /> Open Radar & Incoming Orders ➔
                </Link>
                <Link
                  to="/partner/earnings"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-white font-bold text-sm transition-all flex items-center gap-2"
                >
                  <TrendingUp className="w-5 h-5 text-emerald-400" /> View Earnings
                </Link>
              </div>
            </div>

            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#00B373] to-teal-400/20 flex items-center justify-center p-8 shrink-0 relative z-10 shadow-2xl">
              <Bike className="w-24 h-24 text-white" />
            </div>
          </div>
        </section>
      )}

      {/* Customer & Guest Hero Section */}
      {role !== 'ROLE_PARTNER' && (
        <section className="relative overflow-hidden pt-10 md:pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Main Headline & Subtitle */}
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-black text-[#00B373] uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 fill-[#00B373]" />
                Zero-Warehouse Hyperlocal Delivery Platform
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#102A24] tracking-tight leading-[1.05]">
                Need something? <br />
                <span className="text-[#00B373]">Just tell Tvarit.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Tell us what you need. A nearby delivery partner will find it, buy it locally from any neighborhood store or market of their choice, and bring it to you in 15–30 minutes.
              </p>
            </div>

            {/* 3 Prominent Hero Action Triggers: Ask Tvarit, Speak, Snap & Shop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {/* 1. Ask Tvarit AI */}
              <div
                onClick={() => setIsAiModalOpen(true)}
                className="group cursor-pointer bg-gradient-to-br from-[#102A24] to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B373]/20 rounded-full blur-2xl group-hover:bg-[#00B373]/30 transition-all pointer-events-none" />
                <div className="space-y-3 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#00B373] text-white flex items-center justify-center shadow-lg font-black">
                    <Bot className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black">Ask Tvarit AI</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "I want to make chicken biryani for 6 people" — AI generates exact recipe items & quantities.
                  </p>
                </div>
                <div className="pt-6 relative z-10 flex items-center justify-between text-xs font-extrabold text-emerald-300 group-hover:text-white transition-colors">
                  <span>Try AI Assistant ➔</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 2. Speak to Order */}
              <div
                onClick={() => setIsVoiceModalOpen(true)}
                className="group cursor-pointer bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#00B373] flex items-center justify-center shadow-lg font-black">
                    <Mic className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black">Speak to Order</h3>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    "I need two litres milk, one bread and twelve eggs" — Speeds right into structured cart items.
                  </p>
                </div>
                <div className="pt-6 relative z-10 flex items-center justify-between text-xs font-extrabold text-emerald-100 group-hover:text-white transition-colors">
                  <span>Tap Microphone & Speak ➔</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 3. Snap & Shop */}
              <div
                onClick={() => setIsSnapModalOpen(true)}
                className="group cursor-pointer bg-gradient-to-br from-teal-800 to-[#102A24] text-white rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#00B373] text-white flex items-center justify-center shadow-lg font-black">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black">Snap & Shop</h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 uppercase">
                      WOW Feature
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Upload a cake, cooked dish, or handwritten note — Vision AI identifies and extracts ingredients.
                  </p>
                </div>
                <div className="pt-6 relative z-10 flex items-center justify-between text-xs font-extrabold text-emerald-300 group-hover:text-white transition-colors">
                  <span>Upload or Pick Sample ➔</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Item List Builder on Landing Page */}
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#102A24]">Quick Custom Item Requester</h3>
                    <p className="text-[11px] text-slate-500">Type any item to add directly to your list</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#00B373]">
                  Instant Local Delivery
                </span>
              </div>

              <form onSubmit={handleAddQuickItem} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={quickItem}
                  onChange={(e) => setQuickItem(e.target.value)}
                  placeholder="e.g. 1 packet Amul butter, 6 Bananas, 2kg Atta..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white transition-all font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-[#00B373] text-white font-extrabold hover:bg-[#009960] transition-colors flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>

              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                {itemsList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#F7FAF8] border border-slate-100 text-xs font-semibold text-[#102A24]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#00B373] flex items-center justify-center text-[10px] font-black">
                        {idx + 1}
                      </span>
                      <span>{item.itemName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartOrder}
                className="w-full py-4 rounded-2xl bg-[#102A24] hover:bg-emerald-950 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <ShoppingBag className="w-4 h-4 text-[#00B373]" />
                <span>Add These {itemsList.length} Items to Cart ➔</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#00B373] uppercase tracking-wider">Simple & Intuitive</span>
          <h2 className="text-3xl font-black text-[#102A24] mt-1">How Tvarit Works</h2>
          <p className="text-sm text-slate-500 mt-2">
            No endless scrolling through catalogue menus. Just tell us what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center text-xl font-black mb-4">
              1
            </div>
            <h3 className="font-extrabold text-base text-[#102A24] mb-2">Tell Us What You Need</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Type, speak, or take a picture of items. No need to browse individual shop inventories.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center text-xl font-black mb-4">
              2
            </div>
            <h3 className="font-extrabold text-base text-[#102A24] mb-2">Nearby Partner Accepts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              An active delivery partner in your area receives your shopping list on their partner radar and accepts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center text-xl font-black mb-4">
              3
            </div>
            <h3 className="font-extrabold text-base text-[#102A24] mb-2">Partner Shops Locally</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The partner visits any reputable neighborhood store or mandi of their choice and checks off each purchased item.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center text-xl font-black mb-4">
              4
            </div>
            <h3 className="font-extrabold text-base text-[#102A24] mb-2">Delivered to Doorstep</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Items are checked, packed, and delivered directly to your doorstep in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Why Tvarit Section */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-[#00B373] uppercase tracking-wider">The Hyperlocal Advantage</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#102A24] mt-1 leading-tight">
                Why Tvarit Beats Centralized Dark Stores
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Warehouse-based quick commerce only works in mega-cities. In Tier-2, Tier-3 towns, local shops already carry fresh, affordable goods. Tvarit connects you to them with zero overhead.
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#00B373] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#102A24]">100% Shop Agnostic</h4>
                    <p className="text-xs text-slate-500">You don't worry about which store has what in stock. Your runner finds it locally.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#00B373] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#102A24]">Empowering Local Retailers</h4>
                    <p className="text-xs text-slate-500">Revenue goes to neighborhood mom-and-pop stores and local delivery runners.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#00B373] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#102A24]">Any Product, Any Brand</h4>
                    <p className="text-xs text-slate-500">Need specific local grains, fresh curd, or stationery? Just write it down.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture diagram card */}
            <div className="bg-[#102A24] text-white p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
                <span className="text-xs font-bold text-emerald-400">Tvarit Network Flow</span>
                <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">Decentralized</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-emerald-950/70 rounded-xl border border-emerald-800 flex items-center justify-between">
                  <span className="text-white font-bold">1. CUSTOMER</span>
                  <span className="text-emerald-400">Types / Speaks / Snaps</span>
                </div>
                <div className="text-center text-emerald-400 font-bold">↓</div>
                <div className="p-3 bg-emerald-950/70 rounded-xl border border-emerald-800 flex items-center justify-between">
                  <span className="text-white font-bold">2. DELIVERY PARTNER</span>
                  <span className="text-emerald-400">Accepts on radar</span>
                </div>
                <div className="text-center text-emerald-400 font-bold">↓</div>
                <div className="p-3 bg-emerald-950/70 rounded-xl border border-emerald-800 flex items-center justify-between">
                  <span className="text-white font-bold">3. LOCAL SHOP</span>
                  <span className="text-emerald-400">Partner buys items</span>
                </div>
                <div className="text-center text-emerald-400 font-bold">↓</div>
                <div className="p-3 bg-[#00B373] text-white font-bold rounded-xl flex items-center justify-between">
                  <span>4. DELIVERED</span>
                  <span>Direct to customer doorstep</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Quick-Login Accounts for Judges / Competition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-extrabold text-[#00B373] uppercase tracking-wider">Product Demo Station</span>
            <h3 className="text-2xl font-black text-[#102A24] mt-1">Experience All 3 Perspectives</h3>
            <p className="text-xs text-slate-600 mt-1">
              Click any role below to immediately test the end-to-end flow with pre-seeded data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Customer Demo */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#00B373]">Customer</span>
                  <span className="text-[11px] text-slate-400">rahul@tvarit.com</span>
                </div>
                <h4 className="font-bold text-sm text-[#102A24]">Rahul Sharma</h4>
                <p className="text-xs text-slate-500 mt-1">Create item lists, Ask Tvarit AI, Snap & Shop, and track orders.</p>
              </div>
              <button
                onClick={() => handleDemoQuickLogin('ROLE_CUSTOMER', '/home')}
                className="mt-4 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-[#00B373] text-[#00B373] hover:text-white font-bold text-xs transition-all"
              >
                Launch Customer Demo ➔
              </button>
            </div>

            {/* Partner Demo */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">Delivery Partner</span>
                  <span className="text-[11px] text-slate-400">vikram@tvarit.com</span>
                </div>
                <h4 className="font-bold text-sm text-[#102A24]">Vikram Singh (Rating 4.9⭐)</h4>
                <p className="text-xs text-slate-500 mt-1">Radar requests, interactive shopping checklist & delivery lifecycle.</p>
              </div>
              <button
                onClick={() => handleDemoQuickLogin('ROLE_PARTNER', '/partner/dashboard')}
                className="mt-4 w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white font-bold text-xs transition-all"
              >
                Launch Partner Demo ➔
              </button>
            </div>

            {/* Admin Demo */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Admin</span>
                  <span className="text-[11px] text-slate-400">admin@tvarit.com</span>
                </div>
                <h4 className="font-bold text-sm text-[#102A24]">Operations Control</h4>
                <p className="text-xs text-slate-500 mt-1">Live order dispatch metrics, gross sales, and fleet monitoring.</p>
              </div>
              <button
                onClick={() => handleDemoQuickLogin('ROLE_ADMIN', '/admin/dashboard')}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#102A24] text-slate-700 hover:text-white font-bold text-xs transition-all"
              >
                Launch Admin Console ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals for Customers & Guests */}
      <AskTvaritModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <VoiceToCartModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
      <SnapAndShopModal isOpen={isSnapModalOpen} onClose={() => setIsSnapModalOpen(false)} />
    </div>
  );
};
