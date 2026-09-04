import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Bot,
  Plus,
  Trash2,
  X,
  ArrowRight,
  ShoppingBag,
  Info,
  CheckCircle2,
  Send,
  Loader2
} from 'lucide-react';

const PRESET_PROMPTS = [
  'I want to make chicken biryani for 6 people',
  'Ingredients to bake a rich chocolate cake',
  'Masala dosa and chutney breakfast for 4',
  'Home cleaning and laundry essentials',
  'Cold, fever and cough home care kit',
];

export const AskTvaritModal = ({ isOpen, onClose }) => {
  const { addItems, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [editableItems, setEditableItems] = useState([]);

  if (!isOpen) return null;

  const handleSearch = async (queryText) => {
    const textToSearch = queryText || prompt;
    if (!textToSearch.trim()) return;

    setIsLoading(true);
    setResult(null);
    try {
      const data = await aiService.askTvarit(textToSearch);
      setResult(data);
      setEditableItems(data.items || []);
    } catch (err) {
      showToast('AI Assistant error: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (p) => {
    setPrompt(p);
    handleSearch(p);
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
      { itemName: 'Additional Item', itemQuantity: 1, unit: 'units', estimatedPrice: 40, notes: '' },
    ]);
  };

  const handleAddAllToCart = () => {
    if (editableItems.length === 0) {
      showToast('No items to add', 'error');
      return;
    }
    addItems(editableItems);
    showToast(`Added ${editableItems.length} items from Ask Tvarit to your Cart!`, 'success');
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
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00B373] text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#102A24]">Ask Tvarit AI Assistant</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#00B373] text-white">
                  Recipe & Need NLP
                </span>
              </div>
              <p className="text-xs text-slate-500">Tell us what you plan to make or need, and AI generates the shopping list.</p>
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Search Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Sparkles className="w-4 h-4 text-[#00B373] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. I want to make chicken biryani for 6 people..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-5 py-3 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Generate</span>
            </button>
          </form>

          {/* Quick Suggestions Chips */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Try quick prompt ideas:</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(p)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-semibold text-slate-700 hover:text-[#00B373] transition-all text-left"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* AI Result Card */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-[#00B373] rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 font-bold">Tvarit AI is analyzing recipe & quantities...</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-emerald-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                    result.isLiveAi ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {result.provider || (result.isLiveAi ? 'Gemini 1.5 Flash (Live AI)' : 'DEMO MODE')}
                  </span>
                  {result.confidence && (
                    <span className="text-[10px] text-slate-400 font-bold">{result.confidence}</span>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-[#102A24] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00B373]" /> {result.title}
                </h4>
                <p className="text-xs text-slate-500">{result.explanation}</p>
              </div>

              {/* Editable Items Checklist */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
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
                        Est. ₹{(item.estimatedPrice * item.itemQuantity).toFixed(0)} ({item.unit})
                      </p>
                    </div>

                    {/* Quantity Controls */}
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

        {/* Modal Footer */}
        {result && !isLoading && (
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
