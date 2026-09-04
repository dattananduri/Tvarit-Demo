import React from 'react';
import { Zap, Heart, Store, Bike, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#102A24] text-slate-300 pt-12 pb-8 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00B373] text-white flex items-center justify-center">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">TVARIT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hyperlocal on-demand delivery for Indian towns and cities. The customer simply lists their items, and our runners shop from nearby local stores.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-400">
              <Store className="w-3.5 h-3.5" /> 100% Zero-Warehouse Architecture
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/home" className="hover:text-[#00B373] transition-colors">Request Items</Link></li>
              <li><Link to="/order/create" className="hover:text-[#00B373] transition-colors">Create Order</Link></li>
              <li><Link to="/orders" className="hover:text-[#00B373] transition-colors">Track Status</Link></li>
              <li><Link to="/profile" className="hover:text-[#00B373] transition-colors">Saved Addresses</Link></li>
            </ul>
          </div>

          {/* Partner & Operations */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Ecosystem</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login?role=partner" className="hover:text-[#00B373] transition-colors flex items-center gap-1.5"><Bike className="w-3.5 h-3.5" /> Delivery Partner Portal</Link></li>
              <li><Link to="/partner/dashboard" className="hover:text-[#00B373] transition-colors">Partner Live Radar</Link></li>
              <li><Link to="/login?role=admin" className="hover:text-[#00B373] transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Admin Console</Link></li>
            </ul>
          </div>

          {/* Core Philosophy */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">How Tvarit Works</h4>
            <div className="bg-emerald-950/50 p-3 rounded-xl border border-emerald-900/50 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-emerald-300">Customer ➔ Partner ➔ Local Shop</p>
              <p className="text-[11px] text-slate-400">
                You never need to choose a shop. Your delivery runner visits any local neighborhood shop to pick up fresh items.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Tvarit Technologies. Fast. Local. Delivered.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Indian Local Commerce
          </div>
        </div>
      </div>
    </footer>
  );
};
