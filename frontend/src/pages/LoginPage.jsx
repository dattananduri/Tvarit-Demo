import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Zap, User, Bike, ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'partner' ? 'partner' : searchParams.get('role') === 'admin' ? 'admin' : 'customer';

  const [activeTab, setActiveTab] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginCustomer, loginPartner, loginAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('expired')) {
      showToast('Your session has expired. Please sign in again.', 'info');
    }
  }, [searchParams, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'customer') {
        await loginCustomer(email, password);
        showToast('Welcome back to Tvarit!', 'success');
        navigate('/home');
      } else if (activeTab === 'partner') {
        await loginPartner(email, password);
        showToast('Partner online! Radar active.', 'success');
        navigate('/partner/dashboard');
      } else if (activeTab === 'admin') {
        await loginAdmin(email, password);
        showToast('Admin console authenticated.', 'success');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (role) => {
    if (role === 'customer') {
      setActiveTab('customer');
      setEmail('rahul@tvarit.com');
      setPassword('password123');
    } else if (role === 'partner') {
      setActiveTab('partner');
      setEmail('vikram@tvarit.com');
      setPassword('partner123');
    } else if (role === 'admin') {
      setActiveTab('admin');
      setEmail('admin@tvarit.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        {/* Card Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#00B373] text-white flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-black text-[#102A24]">TVARIT</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#102A24]">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">Select your account role to continue</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => { setActiveTab('customer'); setEmail(''); setPassword(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'customer'
                ? 'bg-white text-[#102A24] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Customer
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('partner'); setEmail(''); setPassword(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'partner'
                ? 'bg-white text-[#102A24] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> Partner
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setEmail(''); setPassword(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-white text-[#102A24] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          {/* Quick Demo Credentials Fill Button */}
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00B373]" />
              <span className="text-xs font-semibold text-emerald-950">
                Demo: {activeTab === 'customer' ? 'Rahul Sharma' : activeTab === 'partner' ? 'Vikram Singh' : 'Tvarit Admin'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFillDemo(activeTab)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#00B373] text-white hover:bg-[#009960] transition-colors"
            >
              1-Click Auto Fill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === 'customer'
                      ? 'rahul@tvarit.com'
                      : activeTab === 'partner'
                      ? 'vikram@tvarit.com'
                      : 'admin@tvarit.com'
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {activeTab !== 'admin' && (
            <div className="mt-6 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link
                to={`/register?role=${activeTab}`}
                className="font-bold text-[#00B373] hover:underline"
              >
                Register as a {activeTab}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
