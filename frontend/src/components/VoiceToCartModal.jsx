import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Plus,
  Trash2,
  X,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const SAMPLE_VOICE_COMMANDS = [
  'I need two litres milk, one bread and twelve eggs',
  '5kg atta, 1 litre cooking oil and 2 packets maggi',
  'One kilo onions, half kilo tomatoes and coriander',
  'One packet sugar, two milk and butter',
];

export const VoiceToCartModal = ({ isOpen, onClose }) => {
  const { addItems, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [editableItems, setEditableItems] = useState([]);

  if (!isOpen) return null;

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser. Please use quick phrases or text.', 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        showToast('Microphone error: ' + event.error, 'error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      showToast('Microphone permission needed', 'error');
    }
  };

  const handleProcessTranscript = async (textToParse) => {
    const query = textToParse || transcript;
    if (!query.trim()) return;

    setIsProcessing(true);
    setResult(null);
    try {
      const data = await aiService.parseVoice(query);
      setResult(data);
      setEditableItems(data.items || []);
      showToast('Voice command parsed into structured items!', 'success');
    } catch (err) {
      showToast('Error parsing voice: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickSampleClick = (cmd) => {
    setTranscript(cmd);
    handleProcessTranscript(cmd);
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

  const handleAddAllToCart = () => {
    if (editableItems.length === 0) {
      showToast('No items to add', 'error');
      return;
    }
    addItems(editableItems);
    showToast(`Added ${editableItems.length} items from Voice to Cart!`, 'success');
    onClose();
    setIsCartOpen(true);
  };

  const calculatedTotal = editableItems.reduce(
    (acc, curr) => acc + (curr.estimatedPrice || 40) * (curr.itemQuantity || 1),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00B373] text-white flex items-center justify-center shadow-md">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#102A24]">Voice to Cart</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#00B373] text-white">
                  Speech AI
                </span>
              </div>
              <p className="text-xs text-slate-500">Speak your shopping list naturally to convert into cart items.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Big Microphone Tap Section */}
          <div className="bg-[#F7FAF8] rounded-3xl p-6 text-center border border-slate-200/80 space-y-4">
            <div className="relative inline-block">
              {isListening && (
                <span className="animate-ping absolute -inset-3 rounded-full bg-[#00B373] opacity-50"></span>
              )}
              <button
                type="button"
                onClick={startSpeechRecognition}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isListening
                    ? 'bg-rose-500 text-white ring-8 ring-rose-200 scale-105'
                    : 'bg-[#00B373] hover:bg-[#009960] text-white hover:scale-105 shadow-emerald-500/30'
                }`}
              >
                {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            <div>
              <p className="text-sm font-extrabold text-[#102A24]">
                {isListening ? 'Listening... Speak your list' : 'Tap to Start Speaking'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Example: "I need two litres milk, one bread and twelve eggs"
              </p>
            </div>

            {/* Transcript text box */}
            <div className="flex gap-2">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Or type voice text here..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B373]"
              />
              <button
                type="button"
                onClick={() => handleProcessTranscript()}
                disabled={isProcessing || !transcript.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#102A24] text-white font-bold text-xs hover:bg-emerald-950 transition-colors disabled:opacity-50"
              >
                Parse
              </button>
            </div>
          </div>

          {/* Quick Voice Demo Presets */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00B373]" /> 1-Click Voice Command Tests:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_VOICE_COMMANDS.map((cmd, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSampleClick(cmd)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left text-xs font-semibold text-slate-700 hover:text-[#00B373] transition-all"
                >
                  "{cmd}"
                </button>
              ))}
            </div>
          </div>

          {/* Processing Spinner */}
          {isProcessing && (
            <div className="py-8 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#00B373] animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-bold">Structuring spoken words into items & quantities...</p>
            </div>
          )}

          {/* Result: "I understood:" */}
          {result && !isProcessing && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-extrabold text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00B373]" /> I Understood:
                </h4>
                <p className="text-xs text-emerald-800 italic mt-0.5">"{result.transcript}"</p>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
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
            </div>
          )}
        </div>

        {/* Footer */}
        {result && !isProcessing && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">{editableItems.length} items parsed</span>
              <p className="text-base font-black text-[#102A24]">₹{calculatedTotal.toFixed(2)}</p>
            </div>

            <button
              type="button"
              onClick={handleAddAllToCart}
              disabled={editableItems.length === 0}
              className="px-6 py-3 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
