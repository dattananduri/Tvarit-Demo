import React from 'react';
import { MapPin, Navigation, Store, Bike, CheckCircle, Info } from 'lucide-react';

export const DeliveryMapVisualizer = ({ status, deliveryAddress, customerArea, partnerName }) => {
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const isShopping = status === 'SHOPPING';
  const isOutForDelivery = status === 'OUT_FOR_DELIVERY';
  const isDelivered = status === 'DELIVERED';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#00B373]" />
          <h3 className="text-sm font-bold text-[#102A24]">Local Route & Neighborhood View</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          {customerArea || 'Hyperlocal Sector'}
        </span>
      </div>

      {googleMapsKey ? (
        <div className="h-64 w-full">
          <iframe
            title="Delivery Map"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${encodeURIComponent(
              deliveryAddress || 'Mysore, Karnataka'
            )}`}
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        /* Graceful High-Quality Hyperlocal Route Vector Visualization */
        <div className="relative h-64 bg-[#F0F5F2] flex items-center justify-center overflow-hidden">
          {/* Simulated Street Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Main Connecting Route Vector */}
            <path
              d="M 60 180 Q 180 120, 240 140 T 420 80"
              fill="none"
              stroke="#00B373"
              strokeWidth="4"
              strokeDasharray="6,6"
              className="animate-pulse"
            />
          </svg>

          {/* Pin 1: Local Neighborhood Shop */}
          <div className="absolute left-12 bottom-12 flex flex-col items-center group cursor-pointer z-10">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-amber-100">
              <Store className="w-5 h-5" />
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-md bg-white shadow-xs text-[10px] font-bold text-slate-800 border border-slate-200">
              Local Grocery Store
            </div>
          </div>

          {/* Pin 2: Active Delivery Runner */}
          <div
            className={`absolute flex flex-col items-center transition-all duration-700 z-20 ${
              isShopping
                ? 'left-24 bottom-20'
                : isOutForDelivery
                ? 'left-1/2 top-1/3 -translate-x-1/2'
                : isDelivered
                ? 'right-16 top-16'
                : 'left-16 bottom-20'
            }`}
          >
            <div className="relative">
              <span className="animate-ping absolute -inset-1 rounded-full bg-[#00B373] opacity-60"></span>
              <div className="w-12 h-12 rounded-full bg-[#102A24] text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-300">
                <Bike className="w-6 h-6 text-[#00B373]" />
              </div>
            </div>
            <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-[#102A24] text-white shadow-md text-[10px] font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B373] animate-pulse"></span>
              {partnerName || 'Runner'} ({status.replace(/_/g, ' ')})
            </div>
          </div>

          {/* Pin 3: Customer Delivery Address */}
          <div className="absolute right-12 top-10 flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-2xl bg-[#00B373] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-100">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-md bg-white shadow-xs text-[10px] font-bold text-[#102A24] border border-slate-200 max-w-[140px] truncate text-center">
              {deliveryAddress || 'Your Doorstep'}
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-1.5 shadow-xs">
            <Info className="w-3.5 h-3.5 text-[#00B373]" />
            <span>Hyperlocal Shop-to-Doorstep Dispatch Network</span>
          </div>
        </div>
      )}
    </div>
  );
};
