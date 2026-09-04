import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import {
  ShoppingBag,
  ArrowLeft,
  CheckSquare,
  Square,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Store,
  Bike,
  PackageCheck,
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const PartnerShoppingScreen = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (err) {
      showToast('Error loading order: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleToggleItemPurchased = async (itemId, currentPurchased) => {
    try {
      const nextState = !currentPurchased;
      const updated = await orderService.updateItemPurchased(id, itemId, nextState);
      setOrder(updated);
      showToast(nextState ? 'Item checked off shopping list' : 'Item unchecked', 'info');
    } catch (err) {
      showToast('Failed to update item status: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleTransitionStatus = async (nextStatus) => {
    setIsUpdating(true);
    try {
      const updated = await orderService.updateStatus(id, nextStatus);
      setOrder(updated);

      if (nextStatus === 'SHOPPING') {
        showToast('Shopping session started! Check off items as you buy.', 'success');
      } else if (nextStatus === 'PICKED_UP') {
        showToast('Items picked up & packed! Ready for delivery.', 'success');
      } else if (nextStatus === 'OUT_FOR_DELIVERY') {
        showToast('On the way to customer doorstep!', 'success');
      } else if (nextStatus === 'DELIVERED') {
        showToast('Order delivered successfully! +₹40 added to your earnings.', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Status transition failed', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#00B373] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading shopping screen...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link to="/partner/dashboard" className="inline-block px-4 py-2 bg-[#00B373] text-white text-xs font-bold rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const purchasedCount = order.items?.filter((i) => i.isPurchased).length || 0;
  const totalCount = order.items?.length || 0;
  const allPurchased = totalCount > 0 && purchasedCount === totalCount;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3.5">
          <Link
            to="/partner/dashboard"
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#00B373] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-[#102A24]">Shopping List #{order.orderId}</h1>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#00B373] uppercase">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Customer: <strong>{order.customerName}</strong> ({order.customerArea})
            </p>
          </div>
        </div>

        {order.customerPhone && (
          <a
            href={`tel:${order.customerPhone}`}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-[#00B373] border border-emerald-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call Customer</span>
          </a>
        )}
      </div>

      {/* Philosophy banner: Partner visits any shop */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-950">
        <Store className="w-5 h-5 text-[#00B373] shrink-0" />
        <div>
          <span className="font-extrabold">Hyperlocal Flexibility: </span>
          <span>You can visit <strong>any reputable local shop or market</strong> of your choice in the area to purchase these items.</span>
        </div>
      </div>

      {/* Core Interactive Shopping Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00B373] text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#102A24]">Local Shop Items Checklist</h2>
              <p className="text-xs text-slate-500">Tap an item to mark as purchased while in the store</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              allPurchased ? 'bg-emerald-100 text-[#00B373]' : 'bg-slate-100 text-slate-800'
            }`}>
              {purchasedCount} / {totalCount} items purchased ({totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#00B373] h-full transition-all duration-500 rounded-full"
            style={{ width: `${totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0}%` }}
          ></div>
        </div>

        {/* Items Checklist Cards */}
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div
              key={item.itemId}
              onClick={() => handleToggleItemPurchased(item.itemId, item.isPurchased)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                item.isPurchased
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                  : 'bg-[#F7FAF8] border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="text-[#00B373]">
                  {item.isPurchased ? (
                    <CheckSquare className="w-6 h-6 fill-[#00B373] text-white" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-extrabold ${item.isPurchased ? 'line-through text-slate-500' : 'text-[#102A24]'}`}>
                    {item.itemName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quantity: <strong>{item.itemQuantity} {item.unit}</strong>
                  </p>
                  {item.notes && (
                    <p className="text-[11px] text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block mt-1">
                      Note: "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-700">
                  Est. ₹{(item.itemPrice * item.itemQuantity).toFixed(0)}
                </span>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {item.isPurchased ? 'PURCHASED' : 'PENDING'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Location & Partner Notes */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-[#00B373] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Destination:</strong> {order.deliveryAddress}
            </div>
          </div>
          {order.partnerNotes && (
            <p className="text-slate-600 pl-6 italic">
              <strong>Customer Instructions:</strong> "{order.partnerNotes}"
            </p>
          )}
        </div>

        {/* Big Sequential Action Progression Buttons */}
        <div className="pt-4 border-t border-slate-100">
          {order.status === 'ACCEPTED' && (
            <button
              onClick={() => handleTransitionStatus('SHOPPING')}
              disabled={isUpdating}
              className="w-full py-4 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-black text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5" />
              <span>1. Arrived at Store · Start Shopping</span>
            </button>
          )}

          {order.status === 'SHOPPING' && (
            <button
              onClick={() => handleTransitionStatus('PICKED_UP')}
              disabled={isUpdating}
              className="w-full py-4 rounded-2xl bg-[#102A24] hover:bg-emerald-950 text-white font-black text-base shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-5 h-5 text-[#00B373]" />
              <span>2. Items Picked Up & Packed</span>
            </button>
          )}

          {order.status === 'PICKED_UP' && (
            <button
              onClick={() => handleTransitionStatus('OUT_FOR_DELIVERY')}
              disabled={isUpdating}
              className="w-full py-4 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-black text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Bike className="w-5 h-5" />
              <span>3. Start Delivery to Customer</span>
            </button>
          )}

          {order.status === 'OUT_FOR_DELIVERY' && (
            <button
              onClick={() => handleTransitionStatus('DELIVERED')}
              disabled={isUpdating}
              className="w-full py-4 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-black text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>4. Handover Order · Mark Delivered (+₹40.00)</span>
            </button>
          )}

          {order.status === 'DELIVERED' && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#00B373] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-[#102A24]">Order Successfully Delivered!</h3>
              <p className="text-xs text-emerald-800">
                You earned <strong>₹40.00</strong> for this run. Your wallet balance has been updated.
              </p>
              <Link
                to="/partner/dashboard"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#102A24] text-white text-xs font-bold"
              >
                Back to Partner Radar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
