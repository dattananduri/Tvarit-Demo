import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { useToast } from '../context/ToastContext';
import { CreditCard, QrCode, Banknote, ShieldCheck, CheckCircle2, Lock, X, Sparkles } from 'lucide-react';

export const MockPaymentModal = ({ isOpen, onClose, onConfirm, amount, itemsCount }) => {
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState('TEST_PAYMENT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Preload payment mode details from backend
      paymentService.createPaymentOrder(amount)
        .then((data) => setPaymentConfig(data))
        .catch(() => setPaymentConfig({ mode: 'DEMO_PAYMENT', isLive: false }));
    }
  }, [isOpen, amount]);

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Create Payment Order on backend
      const orderData = await paymentService.createPaymentOrder(amount);

      if (orderData.isLive && window.Razorpay) {
        // Live Razorpay Checkout
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Tvarit Delivery',
          description: `Hyperlocal Order (${itemsCount} items)`,
          order_id: orderData.orderId,
          handler: async (response) => {
            const verification = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.verified) {
              showToast('Razorpay payment verified successfully!', 'success');
              onConfirm(selectedMethod, response.razorpay_payment_id);
            } else {
              showToast('Payment signature verification failed', 'error');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: 'Tvarit Customer',
            email: 'customer@tvarit.com',
            contact: '9876543210',
          },
          theme: {
            color: '#00B373',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setIsProcessing(false);
      } else {
        // Fast test/demo mode or cash mode
        setTimeout(() => {
          setIsProcessing(false);
          onConfirm(selectedMethod, orderData.orderId);
        }, 800);
      }
    } catch (err) {
      setIsProcessing(false);
      onConfirm(selectedMethod, 'demo_pay_fallback');
    }
  };

  const isRazorpayActive = paymentConfig?.isLive === true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center border border-emerald-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#102A24]">Confirm & Pay</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                isRazorpayActive ? 'bg-emerald-100 text-[#00B373]' : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}>
                {isRazorpayActive ? 'Razorpay Test' : 'Demo Payment Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500">Fast and secure local checkout</p>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="bg-[#F7FAF8] p-4 rounded-2xl border border-emerald-100 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Grand Total ({itemsCount} items)</span>
            <p className="text-2xl font-black text-[#102A24]">₹{amount?.toFixed(2)}</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#00B373] text-white">
            100% Guaranteed
          </span>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Payment Method</p>

          <label
            onClick={() => setSelectedMethod('TEST_PAYMENT')}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedMethod === 'TEST_PAYMENT'
                ? 'border-[#00B373] bg-emerald-50/60 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#102A24] text-white flex items-center justify-center text-xs font-bold">
                ⚡
              </div>
              <div>
                <p className="text-sm font-bold text-[#102A24]">
                  {isRazorpayActive ? 'Razorpay Test Payment' : 'Demo Test Payment'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isRazorpayActive ? 'Verified server-side signature' : 'Instant test payment simulation'}
                </p>
              </div>
            </div>
            <input
              type="radio"
              name="pay_method"
              checked={selectedMethod === 'TEST_PAYMENT'}
              onChange={() => setSelectedMethod('TEST_PAYMENT')}
              className="text-[#00B373] focus:ring-[#00B373]"
            />
          </label>

          <label
            onClick={() => setSelectedMethod('UPI')}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedMethod === 'UPI'
                ? 'border-[#00B373] bg-emerald-50/60 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#102A24]">UPI / QR Code</p>
                <p className="text-[11px] text-slate-500">GPay, PhonePe, Paytm</p>
              </div>
            </div>
            <input
              type="radio"
              name="pay_method"
              checked={selectedMethod === 'UPI'}
              onChange={() => setSelectedMethod('UPI')}
              className="text-[#00B373] focus:ring-[#00B373]"
            />
          </label>

          <label
            onClick={() => setSelectedMethod('CASH')}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedMethod === 'CASH'
                ? 'border-[#00B373] bg-emerald-50/60 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#102A24]">Cash on Delivery</p>
                <p className="text-[11px] text-slate-500">Pay delivery runner directly upon arrival</p>
              </div>
            </div>
            <input
              type="radio"
              name="pay_method"
              checked={selectedMethod === 'CASH'}
              onChange={() => setSelectedMethod('CASH')}
              className="text-[#00B373] focus:ring-[#00B373]"
            />
          </label>
        </div>

        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-2xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isProcessing ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Verifying & Dispatching Runner...
            </span>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Place Order & Dispatch Runner (₹{amount?.toFixed(2)})
            </>
          )}
        </button>
      </div>
    </div>
  );
};
