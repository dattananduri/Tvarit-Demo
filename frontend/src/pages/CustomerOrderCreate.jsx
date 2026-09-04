import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { customerService } from '../services/customerService';
import { orderService } from '../services/orderService';
import { MockPaymentModal } from '../components/MockPaymentModal';
import {
  ShoppingBag,
  MapPin,
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Phone,
  MessageSquare,
  Home,
  Briefcase,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const CustomerOrderCreate = () => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [items, setItems] = useState(() => {
    const saved = sessionStorage.getItem('tvarit_checkout_items') || sessionStorage.getItem('tvarit_initial_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { itemName: '2 kg Rice', itemQuantity: 2, unit: 'kg', estimatedPrice: 120, notes: 'Sona Masoori' },
      { itemName: '1 packet Sugar', itemQuantity: 1, unit: 'packet', estimatedPrice: 45, notes: '' },
      { itemName: '2 Milk', itemQuantity: 2, unit: 'packet', estimatedPrice: 60, notes: 'Fresh blue pack' },
      { itemName: '1 Bread', itemQuantity: 1, unit: 'pack', estimatedPrice: 35, notes: 'Whole wheat' },
      { itemName: '12 Eggs', itemQuantity: 12, unit: 'units', estimatedPrice: 84, notes: '' },
    ];
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'Flat 402, Green Meadows, MG Road, Ward 4, Mysore');
  const [customerArea, setCustomerArea] = useState('MG Road');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 9876543210');
  const [partnerNotes, setPartnerNotes] = useState('Please check expiry date on milk and call upon arrival.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const addrs = await customerService.getAddresses();
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          setSelectedAddressId(defaultAddr.addressId);
          setDeliveryAddress(defaultAddr.formattedAddress);
          setCustomerArea(defaultAddr.locality || defaultAddr.city || 'Local Sector');
        }
      } catch (err) {
        // quiet fallback
      }
    };
    loadAddresses();
  }, []);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.addressId);
    setDeliveryAddress(addr.formattedAddress);
    setCustomerArea(addr.locality || addr.city || 'Local Sector');
  };

  const calculatedItemsTotal = items.reduce(
    (acc, curr) => acc + (curr.estimatedPrice || 40) * (curr.itemQuantity || 1),
    0
  );
  const grandTotal = calculatedItemsTotal + 25.0 + 5.0;

  const handleOpenPayment = () => {
    if (items.length === 0) {
      showToast('Please add items to your order', 'error');
      return;
    }
    if (!deliveryAddress.trim()) {
      showToast('Please enter a delivery address', 'error');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleConfirmOrder = async (paymentMethod) => {
    setIsPaymentModalOpen(false);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          itemName: i.itemName,
          itemQuantity: i.itemQuantity,
          unit: i.unit || 'units',
          estimatedPrice: i.estimatedPrice || 40,
          notes: i.notes || '',
        })),
        deliveryAddress: deliveryAddress.trim(),
        customerArea: customerArea.trim(),
        customerPhone: customerPhone.trim(),
        partnerNotes: partnerNotes.trim(),
        paymentMethod: paymentMethod || 'TEST_PAYMENT',
      };

      const response = await orderService.createOrder(orderPayload);
      sessionStorage.removeItem('tvarit_checkout_items');
      sessionStorage.removeItem('tvarit_initial_items');
      clearCart();

      showToast(`Order #${response.orderId} created successfully! Dispatching runner...`, 'success');
      navigate(`/orders/${response.orderId}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/home"
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-[#00B373] hover:border-emerald-200 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102A24]">Review & Place Order</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your items will be purchased from nearby local stores and delivered right away.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address & Partner Instructions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Address Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#102A24] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00B373]" /> Delivery Location
              </h3>
              <span className="text-xs font-bold text-[#00B373] bg-emerald-50 px-2.5 py-1 rounded-md">
                Hyperlocal Delivery
              </span>
            </div>

            {/* Saved Addresses Pills */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600">Saved Addresses:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.addressId}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        selectedAddressId === addr.addressId
                          ? 'border-[#00B373] bg-emerald-50/50 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-[#F7FAF8]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {addr.title === 'Home' ? (
                          <Home className="w-4 h-4 text-[#00B373]" />
                        ) : (
                          <Briefcase className="w-4 h-4 text-[#00B373]" />
                        )}
                        <span className="text-xs font-bold text-[#102A24]">{addr.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {addr.formattedAddress}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom address text area */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Delivery Address *
                </label>
                <textarea
                  rows="3"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House/Flat No, Apartment/Building, Street, Landmark, City, Pincode"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Locality / Area Name
                  </label>
                  <input
                    type="text"
                    value={customerArea}
                    onChange={(e) => setCustomerArea(e.target.value)}
                    placeholder="e.g. MG Road, Ward 4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Notes for Partner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-[#102A24] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00B373]" /> Instructions for Delivery Runner
            </h3>
            <p className="text-xs text-slate-500">
              Any special requests for your local runner while shopping or arriving at your house.
            </p>
            <textarea
              rows="2"
              value={partnerNotes}
              onChange={(e) => setPartnerNotes(e.target.value)}
              placeholder="e.g. Ring bell twice, 2nd floor, check freshness of vegetables..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Right Column: Shopping List & Bill Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-xl shadow-emerald-500/5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#00B373]" />
                <h3 className="font-extrabold text-base text-[#102A24]">Order Items ({items.length})</h3>
              </div>
              <Link to="/home" className="text-xs font-bold text-[#00B373] hover:underline">
                + Edit List
              </Link>
            </div>

            {/* Items list */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F7FAF8] border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-extrabold text-[#102A24]">{item.itemName}</p>
                    <p className="text-slate-500 text-[11px]">
                      {item.itemQuantity} {item.unit}
                      {item.notes ? ` · "${item.notes}"` : ''}
                    </p>
                  </div>
                  <span className="font-extrabold text-slate-800">
                    ₹{((item.estimatedPrice || 40) * (item.itemQuantity || 1)).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Subtotal (Estimated)</span>
                <span className="font-bold text-slate-800">₹{calculatedItemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery Runner Fee</span>
                <span className="font-bold text-[#00B373]">₹25.00</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Platform Convenience Fee</span>
                <span className="font-bold text-slate-800">₹5.00</span>
              </div>
              <div className="flex items-center justify-between text-base font-extrabold text-[#102A24] pt-3 border-t border-slate-100">
                <span>To Pay</span>
                <span className="text-xl font-black text-[#00B373]">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="button"
              onClick={handleOpenPayment}
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Confirm & Place Order (₹{grandTotal.toFixed(2)})</span>
            </button>

            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-[#00B373] shrink-0" />
              <span>Tvarit Assurance: 100% genuine local shop MRP rates.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mock / Razorpay Payment Modal */}
      <MockPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleConfirmOrder}
        amount={grandTotal}
        itemsCount={items.length}
      />
    </div>
  );
};
