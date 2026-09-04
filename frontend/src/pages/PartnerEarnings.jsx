import React, { useState, useEffect } from 'react';
import { partnerService } from '../services/partnerService';
import { reviewService } from '../services/reviewService';
import { useToast } from '../context/ToastContext';
import {
  TrendingUp,
  PackageCheck,
  Star,
  Clock,
  ArrowUpRight,
  Bike,
  ShieldCheck,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

export const PartnerEarnings = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        const [profData, historyData, reviewsData] = await Promise.all([
          partnerService.getProfile(),
          partnerService.getOrderHistory(),
          reviewService.getPartnerReviews(),
        ]);
        setProfile(profData);
        setHistory(historyData || []);
        setReviews(reviewsData || []);
      } catch (err) {
        showToast('Error loading earnings: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setLoading(false);
      }
    };
    loadEarnings();
  }, [showToast]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#00B373] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading partner earnings...</p>
      </div>
    );
  }

  const deliveredOrders = history.filter((o) => o.status === 'DELIVERED');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#102A24]">Earnings & Trip History</h1>
        <p className="text-xs text-slate-500 mt-1">Track payouts, completed runs, and partner performance</p>
      </div>

      {/* Hero Earnings Banner */}
      <div className="bg-gradient-to-br from-[#102A24] via-emerald-950 to-[#102A24] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Total Lifetime Earnings</span>
            <p className="text-3xl sm:text-4xl font-black text-white">
              ₹{profile?.totalEarnings?.toFixed(2) || '0.00'}
            </p>
            <p className="text-[11px] text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00B373]" /> Daily automatic bank settlements
            </p>
          </div>

          <div className="space-y-1 sm:border-l sm:border-emerald-900/80 sm:pl-6">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Completed Trips</span>
            <p className="text-3xl sm:text-4xl font-black text-white">
              {profile?.completedOrdersCount || 0}
            </p>
            <p className="text-[11px] text-slate-300">100% On-time delivery rating</p>
          </div>

          <div className="space-y-1 sm:border-l sm:border-emerald-900/80 sm:pl-6">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Customer Rating</span>
            <p className="text-3xl sm:text-4xl font-black text-amber-400 flex items-center gap-2">
              <Star className="w-7 h-7 fill-amber-400 text-amber-400 inline" />
              <span>{profile?.rating || 4.9}</span>
            </p>
            <p className="text-[11px] text-slate-300">Top Tier Partner Status</p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <h3 className="font-black text-lg text-[#102A24]">Customer Reviews & Ratings</h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {reviews.length} Reviews
          </span>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No customer reviews received yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reviews.map((rev) => (
              <div
                key={rev.reviewId}
                className="p-4 rounded-2xl bg-[#F7FAF8] border border-slate-100 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.customerName}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                {rev.comment && (
                  <p className="text-slate-600 italic">"{rev.comment}"</p>
                )}
                <p className="text-[10px] text-slate-400">Order #{rev.orderId} · {new Date(rev.createdTime).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trips Roster */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-lg text-[#102A24]">Completed Deliveries</h3>
            <p className="text-xs text-slate-500">History of fulfilled customer shopping runs</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-[#00B373]">
            {deliveredOrders.length} Completed
          </span>
        </div>

        {deliveredOrders.length === 0 ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <Bike className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="text-sm font-semibold">No completed trips yet</p>
            <p className="text-xs">Accept and deliver available orders to start building your earnings.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deliveredOrders.map((order) => (
              <div
                key={order.orderId}
                className="p-4 rounded-2xl bg-[#F7FAF8] border border-slate-100 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00B373] flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#102A24]">Order #{order.orderId}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#00B373]">
                        Delivered
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.customerName} · {order.customerArea} · {order.items?.length || 0} items
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(order.createdTime).toLocaleDateString()} at {new Date(order.createdTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">Payout</span>
                  <p className="text-base font-black text-[#00B373]">+₹40.00</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
