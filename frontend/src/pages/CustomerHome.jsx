import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { AskTvaritModal } from '../components/AskTvaritModal';
import { VoiceToCartModal } from '../components/VoiceToCartModal';
import { SnapAndShopModal } from '../components/SnapAndShopModal';
import {
  Sparkles,
  Bot,
  Mic,
  Camera,
  ShoppingBag,
  Plus,
  Trash2,
  ArrowRight,
  Store,
  ShieldCheck,
  Zap,
  Info,
  Clock
} from 'lucide-react';

const QUICK_ITEMS = [
  { name: 'Fresh Milk', unit: 'packet', price: 30 },
  { name: 'Whole Wheat Bread', unit: 'pack', price: 35 },
  { name: 'Farm Fresh Eggs (6 pcs)', unit: 'units', price: 42 },
  { name: 'Aashirvaad Atta (5kg)', unit: 'kg', price: 240 },
  { name: 'Sona Masoori Rice (5kg)', unit: 'kg', price: 300 },
  { name: 'Sunflower Oil (1L)', unit: 'litre', price: 140 },
  { name: 'Tata Salt (1kg)', unit: 'kg', price: 28 },
  { name: 'Amul Butter (100g)', unit: 'g', price: 55 },
];

export const CustomerHome = () => {
  const { addItem, addItems, cartCount, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);

  // Manual Item builder state
  const [manualItems, setManualItems] = useState([
    { itemName: '', itemQuantity: 1, unit: 'kg', estimatedPrice: 60, notes: '' },
  ]);

  const handleAddManualRow = () => {
    setManualItems([
      ...manualItems,
      { itemName: '', itemQuantity: 1, unit: 'units', estimatedPrice: 40, notes: '' },
    ]);
  };

  const handleUpdateManualItem = (index, field, value) => {
    const updated = [...manualItems];
    updated[index][field] = value;
    setManualItems(updated);
  };

  const handleRemoveManualRow = (index) => {
    if (manualItems.length === 1) {
      setManualItems([{ itemName: '', itemQuantity: 1, unit: 'units', estimatedPrice: 40, notes: '' }]);
      return;
    }
    setManualItems(manualItems.filter((_, i) => i !== index));
  };

  const handleAddQuickItem = (item) => {
    addItem({
      itemName: item.name,
      itemQuantity: 1,
      unit: item.unit,
      estimatedPrice: item.price,
      notes: '',
    });
    showToast(`Added ${item.name} to cart!`, 'success');
  };

  const handleAddManualToCart = (e) => {
    e.preventDefault();
    const validItems = manualItems.filter((i) => i.itemName.trim() !== '');
    if (validItems.length === 0) {
      showToast('Please enter at least one item name', 'error');
      return;
    }
    addItems(validItems);
    showToast(`Added ${validItems.length} items to your Cart!`, 'success');
    setManualItems([{ itemName: '', itemQuantity: 1, unit: 'units', estimatedPrice: 40, notes: '' }]);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-[#00B373] text-xs font-black uppercase tracking-wider border border-emerald-200">
          <Zap className="w-3.5 h-3.5 fill-[#00B373]" /> Zero-Warehouse Hyperlocal Delivery
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#102A24] tracking-tight leading-tight">
          Need something?<br />
          <span className="text-[#00B373]">Just tell Tvarit.</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tell us what you need. A nearby delivery partner will find it, buy it locally from any neighborhood shop, and bring it straight to your doorstep.
        </p>
      </div>

      {/* The 3 Core Entry Points: Ask Tvarit, Speak, Snap & Shop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Ask Tvarit */}
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
            <span>Open AI Assistant</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Voice to Cart */}
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
            <span>Tap Microphone & Speak</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Snap & Shop */}
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
            <span>Upload or Pick Sample</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Manual Item Builder & Quick Staples */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Custom Multi-Item Builder */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#102A24]">Build Your Shopping List</h2>
                <p className="text-xs text-slate-500">Type any item, brand, or local vegetable</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddManualRow}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00B373] font-bold text-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          <form onSubmit={handleAddManualToCart} className="space-y-3">
            {manualItems.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-slate-200/80 flex flex-wrap sm:flex-nowrap items-center gap-2.5 transition-all focus-within:border-[#00B373] focus-within:bg-white"
              >
                <div className="flex-1 min-w-[140px]">
                  <input
                    type="text"
                    placeholder="e.g. 2 kg Rice, 1 Bread, 12 Eggs"
                    value={item.itemName}
                    onChange={(e) => handleUpdateManualItem(index, 'itemName', e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#102A24] focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    value={item.itemQuantity}
                    onChange={(e) => handleUpdateManualItem(index, 'itemQuantity', parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs text-center font-extrabold"
                  />
                </div>

                <div className="w-24">
                  <select
                    value={item.unit}
                    onChange={(e) => handleUpdateManualItem(index, 'unit', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-medium text-slate-700"
                  >
                    <option value="kg">kg</option>
                    <option value="g">grams</option>
                    <option value="litre">litres</option>
                    <option value="packet">packet</option>
                    <option value="units">units</option>
                    <option value="pack">pack</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveManualRow(index)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <button
                type="button"
                onClick={handleAddManualRow}
                className="text-xs font-bold text-[#00B373] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> + Add Another Item
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Items to Cart</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Quick Daily Staples */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00B373]" />
            <h3 className="font-extrabold text-sm text-[#102A24]">Daily Town Essentials</h3>
          </div>
          <p className="text-xs text-slate-500">Tap to instantly add popular daily essentials</p>

          <div className="space-y-2">
            {QUICK_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#F7FAF8] hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-[#102A24]">{item.name}</p>
                  <p className="text-[11px] text-slate-400">Est. ₹{item.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddQuickItem(item)}
                  className="px-3 py-1 rounded-xl bg-white border border-emerald-200 hover:bg-[#00B373] hover:text-white text-[#00B373] font-bold text-xs shadow-2xs transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AskTvaritModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <VoiceToCartModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
      <SnapAndShopModal isOpen={isSnapModalOpen} onClose={() => setIsSnapModalOpen(false)} />
    </div>
  );
};
