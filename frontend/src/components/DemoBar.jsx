import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Bike, ShieldCheck } from 'lucide-react';

export const DemoBar = () => {
  const { user, role, switchDemoAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSwitch = async (targetRole) => {
    try {
      await switchDemoAccount(targetRole);
      if (targetRole === 'ROLE_CUSTOMER') {
        showToast('Switched to Customer Demo (Rahul Sharma)', 'success');
        navigate('/home');
      } else if (targetRole === 'ROLE_PARTNER') {
        showToast('Switched to Delivery Partner Demo (Vikram Singh)', 'success');
        navigate('/partner/dashboard');
      } else if (targetRole === 'ROLE_ADMIN') {
        showToast('Switched to Admin Demo Portal', 'success');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      showToast('Error switching demo account: ' + err.message, 'error');
    }
  };

  return (
    <div className="bg-[#102A24] text-white px-4 py-1.5 text-xs border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B373] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00B373]"></span>
          </span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Demo Switcher:
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Active: <strong className="text-white">{user?.name || 'Guest'}</strong> ({role ? role.replace('ROLE_', '') : 'None'})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleSwitch('ROLE_CUSTOMER')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              role === 'ROLE_CUSTOMER'
                ? 'bg-[#00B373] text-white shadow-sm'
                : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            <User className="w-3 h-3" /> Customer
          </button>
          <button
            onClick={() => handleSwitch('ROLE_PARTNER')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              role === 'ROLE_PARTNER'
                ? 'bg-[#00B373] text-white shadow-sm'
                : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            <Bike className="w-3 h-3" /> Partner
          </button>
          <button
            onClick={() => handleSwitch('ROLE_ADMIN')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              role === 'ROLE_ADMIN'
                ? 'bg-[#00B373] text-white shadow-sm'
                : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            <ShieldCheck className="w-3 h-3" /> Admin
          </button>
        </div>
      </div>
    </div>
  );
};
