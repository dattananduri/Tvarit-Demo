import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';
import { DeliveryMapVisualizer } from '../components/DeliveryMapVisualizer';
import {
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  Phone,
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bike,
  Store,
  Clock,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const CustomerOrderTracking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Review & Rating State
  const [existingReview, setExistingReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchOrder = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);

      if (data.status === 'DELIVERED') {
        const rev = await reviewService.getReviewForOrder(id);
        if (rev) {
          setExistingReview(rev);
        }
      }
    } catch (err) {
      if (!isSilent) {
        showToast('Error loading order details: ' + (err.response?.data?.message || err.message), 'error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchOrder();

    // Auto-poll live order status every 4 seconds while order is active
    const interval = setInterval(() => {
      fetchOrder(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order request?')) return;
    setIsCancelling(true);
    try {
      const updated = await orderService.cancelOrder(id);
      setOrder(updated);
      showToast('Order cancelled successfully', 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      showToast('Please select a star rating', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const savedReview = await reviewService.submitReview(id, {
        rating,
        comment: comment.trim() || 'Great delivery service!',
      });
      setExistingReview(savedReview);
      showToast('Thank you! Your review has been submitted.', 'success');
      fetchOrder(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#00B373] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Tracking order #{id}...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#102A24]">Order Not Found</h2>
        <p className="text-xs text-slate-500">We couldn't find details for order #{id}.</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00B373] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> View My Orders
        </Link>
      </div>
    );
  }

  const isCancellable = order.status === 'CREATED' || order.status === 'ACCEPTED';
  const purchasedItemsCount = order.items?.filter((i) => i.isPurchased).length || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            to="/orders"
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#00B373] hover:border-emerald-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#102A24]">Order #{order.orderId}</h1>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-[#00B373] border border-emerald-200 uppercase tracking-wider">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on {new Date(order.createdTime).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchOrder(false)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {isCancellable && (
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* 6-Step Order Status Timeline */}
      <OrderStatusTimeline status={order.status} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Partner Card + Map Visualizer + Review Component */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Partner Info Card */}
          {order.partnerId ? (
            <div className="bg-gradient-to-r from-[#102A24] to-emerald-950 text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Bike className="w-4 h-4" /> Assigned Delivery Partner
                </span>
                <span className="text-[11px] bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-200">
                  Local Runner
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#00B373] text-white flex items-center justify-center font-black text-lg shadow-md">
                    {order.partnerName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{order.partnerName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{order.partnerRating || 4.9} Partner Rating</span>
                    </div>
                  </div>
                </div>

                {order.partnerPhone && (
                  <a
                    href={`tel:${order.partnerPhone}`}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-300 transition-colors flex items-center gap-2 text-xs font-bold"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">{order.partnerPhone}</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-900">Broadcasting to Nearby Runners</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Your request is visible to available delivery partners in your area. A runner will accept shortly.
                </p>
              </div>
            </div>
          )}

          {/* Customer Rating / Review Component on Delivery Completion */}
          {order.status === 'DELIVERED' && (
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-lg shadow-emerald-500/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#102A24]">
                    {existingReview ? 'Your Delivery Feedback' : 'Rate Your Delivery Experience'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {existingReview
                      ? 'Thank you for supporting local shopping with Tvarit!'
                      : `How was your run with ${order.partnerName || 'your delivery partner'}?`}
                  </p>
                </div>
              </div>

              {existingReview ? (
                <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= existingReview.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-black text-slate-800 ml-1.5">
                      {existingReview.rating} / 5 Stars
                    </span>
                  </div>
                  {existingReview.comment && (
                    <p className="text-xs text-slate-700 italic">
                      "{existingReview.comment}"
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Reviewed on {new Date(existingReview.createdTime).toLocaleString()}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
                  {/* Interactive Star Picker */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-amber-600 ml-1">
                      {hoverRating || rating} Stars
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Feedback & Comments (Optional)
                    </label>
                    <textarea
                      rows="2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="e.g. Fresh items picked promptly, courteous runner!"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 rounded-xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Rating & Review</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Hyperlocal Route & Vector Map View */}
          <DeliveryMapVisualizer
            status={order.status}
            deliveryAddress={order.deliveryAddress}
            customerArea={order.customerArea}
            partnerName={order.partnerName}
          />
        </div>

        {/* Right Col: Shopping List & Item Progress */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#00B373]" />
                <h3 className="font-extrabold text-sm text-[#102A24]">Shopping List</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {purchasedItemsCount}/{order.items?.length || 0} items purchased
              </span>
            </div>

            {/* Checklist of Items */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 text-xs ${
                    item.isPurchased
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-[#F7FAF8] border-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {item.isPurchased ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00B373] fill-emerald-100" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                      )}
                    </div>
                    <div>
                      <p className={`font-extrabold ${item.isPurchased ? 'line-through text-slate-500' : 'text-[#102A24]'}`}>
                        {item.itemName}
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Qty: {item.itemQuantity} {item.unit}
                        {item.notes ? ` · "${item.notes}"` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700">
                    ₹{(item.itemPrice * item.itemQuantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery address details */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-[#00B373] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Delivering to:</span>
                  <p className="text-slate-500 mt-0.5">{order.deliveryAddress}</p>
                </div>
              </div>

              {order.partnerNotes && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                  <strong className="text-slate-800">Runner Notes:</strong> "{order.partnerNotes}"
                </div>
              )}
            </div>

            {/* Bill breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Total (Est.)</span>
                <span className="font-bold text-slate-800">₹{order.estimatedTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Runner Fee</span>
                <span className="font-bold text-[#00B373]">₹{order.deliveryFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Fee</span>
                <span className="font-bold text-slate-800">₹{order.platformFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#102A24] pt-2 border-t border-slate-100">
                <span>Grand Total</span>
                <span className="text-base text-[#00B373]">₹{order.grandTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
