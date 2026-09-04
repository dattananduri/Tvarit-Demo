import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  X,
  ArrowRight,
  ShoppingBag,
  Info,
  CheckCircle2,
  Loader2,
  ScanLine
} from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    name: 'Chocolate Fudge Cake',
    filename: 'chocolate_cake.jpg',
    tag: 'Dish / Baking',
    icon: '🎂',
    imgUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Hyderabadi Dum Biryani',
    filename: 'chicken_biryani.jpg',
    tag: 'Recipe Dish',
    icon: '🍗',
    imgUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Handwritten Grocery Note',
    filename: 'handwritten_list.jpg',
    tag: 'OCR Paper List',
    icon: '📝',
    imgUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Crispy Masala Dosa',
    filename: 'masala_dosa.jpg',
    tag: 'Breakfast',
    icon: '🥞',
    imgUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=80',
  },
];

export const SnapAndShopModal = ({ isOpen, onClose }) => {
  const { addItems, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [filenameHint, setFilenameHint] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [editableItems, setEditableItems] = useState([]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilenameHint(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        triggerAnalysis(reader.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset) => {
    setImagePreview(preset.imgUrl);
    setFilenameHint(preset.filename);
    triggerAnalysis(preset.imgUrl, preset.filename);
  };

  const triggerAnalysis = async (imgData, hint) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const data = await aiService.snapAndShop(imgData, hint);
      setResult(data);
      setEditableItems(data.items || []);
      showToast(`AI identified: ${data.identifiedSubject}!`, 'success');
    } catch (err) {
      showToast('Vision AI error: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateItemQty = (index, delta) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      const newQty = Math.max(1, (updated[index].itemQuantity || 1) + delta);
      updated[index].itemQuantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setEditableItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomItem = () => {
    setEditableItems((prev) => [
      ...prev,
      { itemName: 'Extra Item', itemQuantity: 1, unit: 'units', estimatedPrice: 40, notes: '' },
    ]);
  };

  const handleAddAllToCart = () => {
    if (editableItems.length === 0) {
      showToast('No items to add', 'error');
      return;
    }
    addItems(editableItems);
    showToast(`Added ${editableItems.length} items from Snap & Shop to Cart!`, 'success');
    onClose();
    setIsCartOpen(true);
  };

  const calculatedTotal = editableItems.reduce(
    (acc, curr) => acc + (curr.estimatedPrice || 40) * (curr.itemQuantity || 1),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00B373] text-white flex items-center justify-center shadow-md">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#102A24]">Snap & Shop (Vision AI)</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#00B373] text-white">
                  Visual Deconstruction
                </span>
              </div>
              <p className="text-xs text-slate-500">Upload a dish, handwritten list, or product photo to extract ingredients.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Preset Sample Photos for Fast Competition Judging */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#00B373]" /> 1-Click Demo Samples (No upload needed):
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 rounded-2xl bg-[#F7FAF8] hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all group flex flex-col items-center text-center"
                >
                  <span className="text-2xl mb-1">{preset.icon}</span>
                  <p className="font-extrabold text-xs text-[#102A24] group-hover:text-[#00B373] line-clamp-1">
                    {preset.name}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5">{preset.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload / Camera Dropzone */}
          <div className="border-2 border-dashed border-slate-200 hover:border-[#00B373] rounded-3xl p-6 text-center bg-[#F7FAF8] transition-all relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#00B373] flex items-center justify-center mx-auto shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-extrabold text-[#102A24]">
                Upload or Take a Photo from Camera
              </p>
              <p className="text-xs text-slate-400">
                Supports JPG, PNG, WEBP · Cakes, cooked dishes, handwritten slips
              </p>
            </div>
          </div>

          {/* Vision AI Analysis Loading */}
          {isAnalyzing && (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-[#00B373] animate-spin mx-auto"></div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
                <ScanLine className="w-4 h-4 text-[#00B373] animate-pulse" />
                <span>Analyzing image pixels & deconstructing ingredients...</span>
              </div>
            </div>
          )}

          {/* Vision AI Result */}
          {result && !isAnalyzing && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      result.isLiveAi ? 'bg-[#00B373] text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {result.provider || (result.isLiveAi ? 'Live Vision AI' : 'DEMO MODE')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {result.confidence} confidence
                    </span>
                  </div>
                  <h4 className="font-black text-base text-[#102A24]">
                    {result.identifiedSubject}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Here's what Tvarit found: {editableItems.length} required shopping items.
                  </p>
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                  />
                )}
              </div>

              {/* Editable Checklist */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {editableItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditableItems((prev) => {
                            const u = [...prev];
                            u[idx].itemName = val;
                            return u;
                          });
                        }}
                        className="font-bold text-[#102A24] bg-transparent border-b border-dashed border-slate-300 focus:border-[#00B373] focus:outline-none w-full"
                      />
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Est. ₹{(item.itemPrice * item.itemQuantity).toFixed(0)} ({item.unit})
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(idx, -1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center shadow-2xs hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-extrabold text-xs">{item.itemQuantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(idx, 1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center shadow-2xs hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-300 hover:text-rose-500 p-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="font-bold text-[#00B373] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add another item
                </button>
                <span className="font-extrabold text-slate-700">
                  Est. Subtotal: ₹{calculatedTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-800">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{result.disclaimer}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {result && !isAnalyzing && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">{editableItems.length} items ready</span>
              <p className="text-base font-black text-[#102A24]">₹{calculatedTotal.toFixed(2)}</p>
            </div>

            <button
              type="button"
              onClick={handleAddAllToCart}
              disabled={editableItems.length === 0}
              className="px-6 py-3 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD ALL TO CART</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
