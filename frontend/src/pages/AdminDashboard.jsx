import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { reviewService } from '../services/reviewService';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  Users,
  Bike,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  RefreshCw,
  Search,
  ChevronRight,
  Eye,
  Star,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // orders | partners | customers | reviews
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const [statsData, ordersData, partnersData, customersData, reviewsData] = await Promise.all([
        adminService.getStats(),
        adminService.getOrders(statusFilter || undefined),
        adminService.getPartners(),
        adminService.getCustomers(),
        reviewService.getAllReviews(),
      ]);
      setStats(statsData);
      setOrders(ordersData || []);
      setPartners(partnersData || []);
      setCustomers(customersData || []);
      setReviews(reviewsData || []);
    } catch (err) {
      if (!isSilent) {
        showToast('Error loading admin data: ' + (err.response?.data?.message || err.message), 'error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-[#00B373] border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'SHOPPING':
      case 'PICKED_UP':
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ACCEPTED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      o.orderId.toString().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.partnerName?.toLowerCase().includes(q) ||
      o.customerArea?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#00B373] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Connecting to Tvarit Operations Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00B373] text-xs font-bold mb-1 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Operations Headquarters
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102A24]">Tvarit Admin Portal</h1>
          <p className="text-xs text-slate-500">Live platform telemetry, fleet metrics, and dispatch operations</p>
        </div>

        <button
          onClick={() => fetchData(false)}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Console
        </button>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-black text-[#102A24] mt-1">{stats?.totalOrders || 0}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {stats?.activeOrders || 0} active now
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Platform Value</p>
            <p className="text-2xl font-black text-[#00B373] mt-1">₹{stats?.grossOrderValue?.toFixed(2) || '0.00'}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {stats?.completedOrders || 0} fulfilled runs
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Fleet</p>
            <p className="text-2xl font-black text-[#102A24] mt-1">{stats?.totalPartners || 0}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {stats?.onlinePartners || 0} partners online
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Bike className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Customers</p>
            <p className="text-2xl font-black text-[#102A24] mt-1">{stats?.totalCustomers || 0}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Across local town sectors</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Tabs */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-4">
        {/* Subnav & Filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#102A24] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Live Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'partners'
                  ? 'bg-[#102A24] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Delivery Partners ({partners.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#102A24] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Customers ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-[#102A24] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Customer Reviews ({reviews.length})</span>
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order, customer, area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B373]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
                >
                  <option value="">All Statuses</option>
                  <option value="CREATED">CREATED</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="SHOPPING">SHOPPING</option>
                  <option value="PICKED_UP">PICKED_UP</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Orders Table */}
        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAF8] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Area & Items</th>
                  <th className="px-6 py-3.5">Assigned Partner</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Created Time</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-black text-[#102A24]">
                      #{o.orderId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{o.customerName}</p>
                      <p className="text-[11px] text-slate-400">{o.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{o.customerArea || 'Local'}</p>
                      <p className="text-[11px] text-slate-500">
                        {o.items?.length || 0} items ({o.items?.map((i) => i.itemName).slice(0, 2).join(', ')}...)
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {o.partnerName ? (
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Bike className="w-3.5 h-3.5 text-[#00B373]" />
                          <span>{o.partnerName}</span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-medium italic">Pending Acceptance</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{o.grandTotal?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] border ${getStatusBadge(o.status)}`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(o.createdTime).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/orders/${o.orderId}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#00B373] text-slate-700 hover:text-white font-bold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-slate-400">
                      No orders match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Partners Table */}
        {activeTab === 'partners' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAF8] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Partner ID</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email & Phone</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Completed Runs</th>
                  <th className="px-6 py-3.5">Total Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map((p) => (
                  <tr key={p.partnerId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-[#102A24]">
                      #{p.partnerId}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {p.partnerName}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{p.partnerEmail}</p>
                      <p className="text-slate-400 text-[11px]">{p.phoneNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        p.isOnline ? 'bg-emerald-100 text-[#00B373]' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {p.isOnline ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-500">
                      ★ {p.rating || 4.9}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {p.completedOrdersCount || 0}
                    </td>
                    <td className="px-6 py-4 font-black text-[#00B373]">
                      ₹{p.totalEarnings?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Customers Table */}
        {activeTab === 'customers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAF8] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Customer ID</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Delivery Address</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.customerId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-[#102A24]">
                      #{c.customerId}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {c.customerName}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {c.customerEmail}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {c.customerPhoneNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {c.customerAddress || 'Saved addresses'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {c.createdTime ? new Date(c.createdTime).toLocaleDateString() : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Customer Reviews Table */}
        {activeTab === 'reviews' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAF8] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Review ID</th>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Customer Comment</th>
                  <th className="px-6 py-3.5">Submitted On</th>
                  <th className="px-6 py-3.5 text-right">View Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <tr key={r.reviewId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-[#102A24]">
                      #{r.reviewId}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#00B373]">
                      #{r.orderId}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {r.customerName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                        <span className="text-xs font-bold text-slate-800 ml-1">({r.rating}★)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 italic max-w-md">
                      "{r.comment}"
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(r.createdTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/orders/${r.orderId}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#00B373] text-slate-700 hover:text-white font-bold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Track
                      </Link>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-400">
                      No customer reviews submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
