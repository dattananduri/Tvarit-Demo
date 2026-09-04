import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { customerService } from '../services/customerService';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Plus,
  Trash2,
  Home,
  Briefcase,
  Save,
  CheckCircle2
} from 'lucide-react';

export const CustomerProfile = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    title: 'Home',
    addressLine: '',
    locality: '',
    city: 'Mysore',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    const loadProfileAndAddresses = async () => {
      try {
        const profile = await customerService.getProfile();
        setName(profile.customerName);
        setEmail(profile.customerEmail);
        setPhone(profile.customerPhoneNumber || '');

        const addrList = await customerService.getAddresses();
        setAddresses(addrList);
      } catch (err) {
        // quiet
      }
    };
    loadProfileAndAddresses();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = {
        customerName: name,
        customerPhoneNumber: phone,
      };
      if (password) payload.password = password;

      const updated = await customerService.updateProfile(payload);
      updateUserState({ name: updated.customerName, phone: updated.customerPhoneNumber });
      setPassword('');
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.addressLine.trim()) {
      showToast('Please enter an address line', 'error');
      return;
    }

    try {
      const created = await customerService.addAddress(newAddr);
      setAddresses([...addresses, created]);
      setNewAddr({ title: 'Home', addressLine: '', locality: '', city: 'Mysore', pincode: '', isDefault: false });
      setIsAddingAddress(false);
      showToast('Address added successfully!', 'success');
    } catch (err) {
      showToast('Failed to add address: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await customerService.setDefaultAddress(addressId);
      const addrList = await customerService.getAddresses();
      setAddresses(addrList);
      showToast('Default delivery address updated!', 'success');
    } catch (err) {
      showToast('Failed to set default address: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      await customerService.deleteAddress(addressId);
      setAddresses(addresses.filter((a) => a.addressId !== addressId));
      showToast('Address removed', 'info');
    } catch (err) {
      showToast('Failed to delete address', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#102A24]">My Account & Addresses</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your customer profile and saved delivery locations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Edit Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#102A24]">Profile Information</h3>
              <p className="text-xs text-slate-500">Update your contact details</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Email (Read Only)</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
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
                Update Password <span className="text-slate-400 font-normal">(Leave blank to keep current)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B373] focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3 rounded-xl bg-[#00B373] hover:bg-[#009960] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </form>
        </div>

        {/* Addresses Section */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00B373] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#102A24]">Saved Addresses</h3>
                <p className="text-xs text-slate-500">Fast 1-click delivery targets</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00B373] text-xs font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add New
            </button>
          </div>

          {/* Add Address Form Accordion */}
          {isAddingAddress && (
            <form onSubmit={handleAddAddress} className="p-4 bg-[#F7FAF8] rounded-2xl border border-emerald-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                  <select
                    value={newAddr.title}
                    onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Address Line *</label>
                <input
                  type="text"
                  placeholder="Flat/House No, Building, Street"
                  value={newAddr.addressLine}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Locality / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. MG Road, Ward 4"
                    value={newAddr.locality}
                    onChange={(e) => setNewAddr({ ...newAddr, locality: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 570001"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#00B373] text-white text-xs font-bold shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Saved addresses list */}
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.addressId}
                className="p-4 rounded-2xl bg-[#F7FAF8] border border-slate-100 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-[#00B373] flex items-center justify-center shrink-0 mt-0.5">
                    {addr.title === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#102A24]">{addr.title}</h4>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#00B373]">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{addr.formattedAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(addr.addressId)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-600 hover:text-[#00B373] border border-slate-200 hover:border-emerald-300 text-[11px] font-bold transition-all"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.addressId)}
                    className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {addresses.length === 0 && !isAddingAddress && (
              <div className="text-center py-6 text-slate-400 text-xs">
                No saved addresses yet. Click "Add New" to save one.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
