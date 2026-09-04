import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Zap,
  ShoppingBag,
  PlusCircle,
  Clock,
  User,
  LogOut,
  Bike,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('You have been logged out safely', 'info');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Determine role-based home link
  const getHomeLink = () => {
    if (role === 'ROLE_PARTNER') return '/partner/dashboard';
    if (role === 'ROLE_ADMIN') return '/admin/dashboard';
    if (role === 'ROLE_CUSTOMER') return '/home';
    return '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link to={getHomeLink()} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#00B373] text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-[#102A24] flex items-center gap-1 leading-none">
                  TVARIT
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00B373]"></span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight mt-0.5">
                  Fast · Local · Delivered
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Customer Navigation */}
            {role === 'ROLE_CUSTOMER' && (
              <>
                <Link
                  to="/home"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive('/home') ? 'text-[#00B373] bg-emerald-50' : 'text-slate-700 hover:text-[#00B373] hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> Request Items
                </Link>
                <Link
                  to="/orders"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive('/orders') ? 'text-[#00B373] bg-emerald-50' : 'text-slate-700 hover:text-[#00B373] hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4" /> My Orders
                </Link>
              </>
            )}

            {/* Partner Navigation */}
            {role === 'ROLE_PARTNER' && (
              <>
                <Link
                  to="/partner/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive('/partner/dashboard') ? 'text-[#00B373] bg-emerald-50' : 'text-slate-700 hover:text-[#00B373] hover:bg-slate-50'
                  }`}
                >
                  <Bike className="w-4 h-4" /> Partner Radar & Orders
                </Link>
                <Link
                  to="/partner/earnings"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive('/partner/earnings') ? 'text-[#00B373] bg-emerald-50' : 'text-slate-700 hover:text-[#00B373] hover:bg-slate-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" /> Earnings & Trips
                </Link>
              </>
            )}

            {/* Admin Navigation */}
            {role === 'ROLE_ADMIN' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive('/admin/dashboard') ? 'text-[#00B373] bg-emerald-50' : 'text-slate-700 hover:text-[#00B373] hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" /> Ops Console
                </Link>
              </>
            )}

            {/* Guest Navigation */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/"
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#00B373] transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/login?role=partner"
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#00B373] transition-colors flex items-center gap-1.5"
                >
                  <Bike className="w-4 h-4" /> Delivery Partner
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Shopping Cart Button: ONLY visible for Customer & Guests, NEVER for Partners */}
            {role !== 'ROLE_PARTNER' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl text-slate-700 hover:text-[#00B373] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                title="View Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#00B373] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold hidden lg:inline">Cart</span>
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {role === 'ROLE_PARTNER' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-[#00B373]"></span> Delivery Partner
                  </span>
                )}

                <Link
                  to={role === 'ROLE_PARTNER' ? '/partner/profile' : role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/profile'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-sm font-semibold transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#102A24] text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#00B373] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-[#00B373] hover:bg-[#009960] rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationDropdown />

            {role !== 'ROLE_PARTNER' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#00B373] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#102A24]">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email} ({role?.replace('ROLE_', '')})</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-600 px-2.5 py-1 bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </div>

              {role === 'ROLE_CUSTOMER' && (
                <>
                  <Link
                    to="/home"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Request Items
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Profile & Addresses
                  </Link>
                </>
              )}

              {role === 'ROLE_PARTNER' && (
                <>
                  <Link
                    to="/partner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Partner Radar & Orders
                  </Link>
                  <Link
                    to="/partner/earnings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Earnings & Trips
                  </Link>
                  <Link
                    to="/partner/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Partner Profile
                  </Link>
                </>
              )}

              {role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Admin Console
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl bg-[#00B373] text-sm font-bold text-white shadow-md shadow-emerald-500/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
