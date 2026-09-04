import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { partnerService } from '../services/partnerService';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Bike,
  Power,
  TrendingUp,
  PackageCheck,
  Star,
  Clock,
  MapPin,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const PartnerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [declinedOrderIds, setDeclinedOrderIds] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);

  const handleDeclineOrder = (orderId) => {
    setDeclinedOrderIds((prev) => [...prev, orderId]);
    showToast(`Order #${orderId} declined and dismissed from radar`, 'info');
  };

  const visibleAvailableOrders = availableOrders.filter((o) => !declinedOrderIds.includes(o.orderId));

  const fetchPartnerData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const [profData, availData, activeData] = await Promise.all([
        partnerService.getProfile(),
        partnerService.getAvailableOrders(),
        partnerService.getActiveOrders(),
      ]);

      setProfile(profData);
      setIsOnline(profData.isOnline ?? true);
      setAvailableOrders(availData || []);
      setActiveOrders(activeData || []);
    } catch (err) {
      if (!isSilent) {
        showToast('Error refreshing radar: ' + (err.response?.data?.message || err.message), 'error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPartnerData();

    // Auto-poll available orders radar every 4 seconds
    const interval = setInterval(() => {
      fetchPartnerData(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchPartnerData]);

  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    try {
      await partnerService.toggleStatus(nextState);
      setIsOnline(nextState);
      showToast(nextState ? 'You are now ONLINE. Radar active!' : 'You are now OFFLINE', nextState ? 'success' : 'info');
      fetchPartnerData(true);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAcceptOrder = async (orderId) => {
    if (!isOnline) {
      showToast('Please go ONLINE before accepting orders', 'error');
      return;
    }

    setAcceptingId(orderId);
    try {
      const accepted = await orderService.acceptOrder(orderId);
      showToast(`Accepted Order #${orderId}! Heading to local store.`, 'success');
      navigate(`/partner/orders/${orderId}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to accept order', 'error');
      fetchPartnerData(true);
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#00B373] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Connecting to Partner Radar...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Status + KPIs */}
      <div className="bg-[#102A24] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#00B373]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00B373] text-white flex items-center justify-center shadow-lg font-black text-xl">
              <Bike className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{profile?.partnerName || 'Partner'}</h1>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  ★ {profile?.rating || 4.9}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{profile?.phoneNumber || '+91 9811223344'}</span>
                <span>·</span>
                <span className="text-emerald-400">Local Delivery Network</span>
              </p>
            </div>
          </div>

          {/* Online / Offline Switch */}
          <div className="flex items-center gap-3 self-start sm:self-auto bg-emerald-950/80 p-2 rounded-2xl border border-emerald-800/80">
            <div className="text-right px-2">
              <p className="text-xs font-extrabold text-white leading-none">
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isOnline ? 'Receiving orders' : 'Radar paused'}
              </p>
            </div>
            <button
              onClick={handleToggleOnline}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm ${
                isOnline
                  ? 'bg-[#00B373] hover:bg-[#009960] text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-emerald-900/60">
          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/40 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Today's Earnings</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">
                ₹{profile?.totalEarnings?.toFixed(2) || '0.00'}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-[#00B373]" />
          </div>

          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/40 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Completed Trips</p>
              <p className="text-2xl font-black text-white mt-0.5">
                {profile?.completedOrdersCount || 0} orders
              </p>
            </div>
            <PackageCheck className="w-6 h-6 text-[#00B373]" />
          </div>

          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/40 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Partner Rating</p>
              <p className="text-2xl font-black text-amber-400 mt-0.5">
                {profile?.rating || 4.9} / 5.0
              </p>
            </div>
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
        </div>
      </div>

      {/* Active Order Spotlight Banner (if partner has an active order) */}
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <h2 className="text-base font-extrabold text-[#102A24]">
              Active Order in Progress ({activeOrders.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-lg shadow-emerald-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#102A24] text-white">
                      Order #{order.orderId}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-[#102A24]">
                    Customer: {order.customerName} ({order.customerArea})
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Shopping Items:</strong>{' '}
                    {order.items?.map((i) => `${i.itemName} (${i.itemQuantity} ${i.unit})`).join(', ')}
                  </p>
                </div>

                <Link
                  to={`/partner/orders/${order.orderId}`}
                  className="px-6 py-3.5 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Open Shopping Screen ➔</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Incoming Orders Radar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#102A24]">Incoming Order Requests</h2>
              <p className="text-xs text-slate-500">Nearby requests needing local shop pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#00B373]">
              {visibleAvailableOrders.length} Available
            </span>
            <button
              onClick={() => fetchPartnerData(false)}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Refresh radar"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {visibleAvailableOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
              <Bike className="w-8 h-8 stroke-1 animate-bounce" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">Radar Scanning for Requests...</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {isOnline
                ? "You are online and ready. New customer requests in your area will appear here automatically."
                : "You are currently offline. Turn on your online toggle above to receive delivery requests."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleAvailableOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-[#F7FAF8] rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#102A24] text-white">
                      Request #{order.orderId}
                    </span>
                    <span className="text-xs font-black text-[#00B373] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Est. Earning: ₹40.00
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00B373]" />
                      <strong>Customer Area:</strong> {order.customerArea || 'Nearby Sector'} · ~1.2 km
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Received {new Date(order.createdTime).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Items preview */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Shopping List ({order.items?.length || 0} items):
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1 pl-2">
                      {order.items?.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00B373]"></span>
                          <span><strong>{item.itemName}</strong> - {item.itemQuantity} {item.unit}</span>
                        </li>
                      ))}
                      {(order.items?.length || 0) > 4 && (
                        <li className="text-[11px] text-slate-400 pl-3">
                          +{order.items.length - 4} more items...
                        </li>
                      )}
                    </ul>
                  </div>

                  {order.partnerNotes && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 italic">
                      Note: "{order.partnerNotes}"
                    </p>
                  )}
                </div>

                {/* Accept / Decline Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDeclineOrder(order.orderId)}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptOrder(order.orderId)}
                    disabled={acceptingId === order.orderId}
                    className="flex-1 py-3 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACCEPT ORDER</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
