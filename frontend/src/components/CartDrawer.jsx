import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Info,
  Store
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const deliveryFee = cartCount > 0 ? 25.0 : 0.0;
  const platformFee = cartCount > 0 ? 5.0 : 0.0;
  const grandTotal = cartTotal + deliveryFee + platformFee;

  const handleCheckout = () => {
    sessionStorage.setItem('tvarit_checkout_items', JSON.stringify(cartItems));
    setIsCartOpen(false);
    navigate('/order/create');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#F7FAF8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00B373] text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#102A24]">My Shopping Cart</h2>
                <p className="text-xs text-slate-500">{cartCount} items selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Body */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3 text-slate-400">
                <Store className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                <h3 className="font-extrabold text-base text-[#102A24]">Your cart is empty</h3>
                <p className="text-xs max-w-xs mx-auto">
                  Use Ask Tvarit AI, Snap & Shop, Voice, or the manual item builder to add items.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Items in List</span>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-rose-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#F7FAF8] border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <p className="font-black text-sm text-[#102A24]">{item.itemName}</p>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <span>Unit: <strong>{item.unit || 'units'}</strong></span>
                        <span>·</span>
                        <span>Est: <strong>₹{(item.estimatedPrice * item.itemQuantity).toFixed(0)}</strong></span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-emerald-700 italic mt-1">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.itemQuantity - 1)}
                          className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-slate-700"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-extrabold text-xs">{item.itemQuantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.itemQuantity + 1)}
                          className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-slate-700"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-[#F7FAF8] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Items Total</span>
                  <span className="font-bold text-slate-800">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Local Delivery Runner Fee</span>
                  <span className="font-bold text-[#00B373]">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tvarit Platform Fee</span>
                  <span className="font-bold text-slate-800">₹{platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#102A24] pt-2 border-t border-slate-200">
                  <span>Estimated Grand Total</span>
                  <span className="text-lg text-[#00B373]">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Requirement: Notice about local prices */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900 leading-tight">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Final price may vary slightly based on actual printed MRP / local shop bill receipts.
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-4 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
