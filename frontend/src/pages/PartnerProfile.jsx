import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { partnerService } from '../services/partnerService';
import {
  Bike,
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Star,
  ShieldCheck,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

export const PartnerProfile = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await partnerService.getProfile();
        setProfile(data);
        setName(data.partnerName);
        setEmail(data.partnerEmail);
        setPhone(data.phoneNumber || '');
      } catch (err) {
        // quiet
      }
    };
    loadProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = {
        partnerName: name,
        phoneNumber: phone,
      };
      if (password) payload.password = password;

      const updated = await partnerService.updateProfile(payload);
      setProfile(updated);
      updateUserState({ name: updated.partnerName, phone: updated.phoneNumber });
      setPassword('');
      showToast('Partner profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#102A24]">Partner Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your partner identity and delivery vehicle credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Card Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#102A24]">Personal Details</h3>
              <p className="text-xs text-slate-500">Visible to customers upon order acceptance</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Partner Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Read Only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password <span className="text-slate-400 font-normal">(Leave blank to keep existing)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3 rounded-xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Partner Information
            </button>
          </form>
        </div>

        {/* Status Card on Right */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#102A24] text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00B373] text-white flex items-center justify-center font-black">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-white">Verified Partner Status</h4>
                <p className="text-xs text-emerald-400">Tvarit Runner Network</p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-emerald-900 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Rating:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {profile?.rating || 4.9} / 5.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Completed Orders:</span>
                <span className="font-bold text-white">{profile?.completedOrdersCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lifetime Earnings:</span>
                <span className="font-bold text-emerald-400">₹{profile?.totalEarnings?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
