import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { useToast } from '../context/ToastContext';
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  ChevronRight,
  Package,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

export const CustomerOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await customerService.getOrders();
        setOrders(data);
      } catch (err) {
        showToast('Error loading orders: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [showToast]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-[#00B373] border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'SHOPPING':
      case 'PICKED_UP':
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#00B373] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102A24]">My Orders</h1>
          <p className="text-xs text-slate-500 mt-1">Track and manage all your past and active orders</p>
        </div>
        <Link
          to="/order/create"
          className="px-5 py-2.5 rounded-xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> New Order Request
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#00B373] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#102A24]">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tell us what you need and our local runners will pick it up from nearby shops right away.
          </p>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00B373] text-white font-bold text-xs shadow-md"
          >
            Create Your First Order <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.orderId}
              to={`/orders/${order.orderId}`}
              className="block bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-base text-[#102A24] group-hover:text-[#00B373] transition-colors">
                      Order #{order.orderId}
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdTime).toLocaleString()}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 font-medium">Grand Total</span>
                  <p className="text-lg font-black text-[#102A24]">₹{order.grandTotal?.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">
                    Items ({order.items?.length || 0}):
                  </span>{' '}
                  <span className="text-slate-500">
                    {order.items?.map((i) => `${i.itemName} (${i.itemQuantity} ${i.unit})`).join(', ')}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#00B373] font-bold shrink-0">
                  <span>Track Details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
