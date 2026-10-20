import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Mail, Phone, MapPin, ShieldCheck, Award, Save, CheckCircle2, Lock, Camera, Upload, AlertCircle, Loader2, Home, Building, Truck, Factory } from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, currentUser, updateProfileData, uploadProfilePhoto } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    phone: '',
    city: 'Lagos',
    state: 'Lagos State',
    address: '',
    role: 'Resident',
    bankName: '',
    accountNumber: ''
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state with user profile
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        city: userProfile.city || 'Lagos',
        state: userProfile.state || 'Lagos State',
        address: userProfile.address || '',
        role: userProfile.role || 'Resident',
        bankName: userProfile.bankName || 'Kuda Bank',
        accountNumber: userProfile.accountNumber || '2019948271'
      });
      setPhotoPreview(userProfile.photoURL || '');
    }
  }, [userProfile]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be under 5MB.');
      return;
    }

    setErrorMsg('');
    setIsUploadingPhoto(true);

    try {
      const downloadURL = await uploadProfilePhoto(file);
      if (downloadURL) {
        setPhotoPreview(downloadURL);
        setSavedMsg('Profile photo updated and saved to Firebase Storage!');
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMsg('');
    setErrorMsg('');

    try {
      await updateProfileData(profileForm);
      setSavedMsg('Profile details successfully saved in Firestore!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update profile data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'Business': return Building;
      case 'Collector': return Truck;
      case 'Recycler': return Factory;
      case 'Admin': return ShieldCheck;
      default: return Home;
    }
  };

  const RoleIcon = getRoleIcon(profileForm.role);

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account & Profile Settings</h1>
              <p className="text-sm text-slate-500">Manage your avatar, location details, role & payout settings</p>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold w-fit shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> EcoWaste Verified Member
            </div>
          </div>

          {/* User Profile Overview Header */}
          <Card className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 space-y-6 shadow-xl border-emerald-900/30">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              {/* Photo Upload Avatar Box */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-emerald-700/30 border-2 border-emerald-400/40 overflow-hidden flex items-center justify-center font-black text-emerald-300 text-3xl shrink-0 shadow-lg">
                  {photoPreview ? (
                    <img src={photoPreview} alt={profileForm.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{profileForm.displayName?.charAt(0) || 'E'}</span>
                  )}

                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                      <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
                    </div>
                  )}
                </div>

                <label className="absolute -bottom-2 -right-2 w-9 h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-110">
                  <Camera className="w-4.5 h-4.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center sm:text-left space-y-1 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-2xl font-black text-white">{profileForm.displayName || 'Eco Recycler'}</h3>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-md">
                    <RoleIcon className="w-3.5 h-3.5" /> {profileForm.role}
                  </span>
                </div>
                <p className="text-xs text-emerald-300 font-medium">{currentUser?.email || userProfile?.email}</p>
                <p className="text-[11px] text-slate-400">
                  Location: {profileForm.city}, {profileForm.state}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-400">EcoPoints Balance</p>
                <p className="text-xl font-black text-emerald-400">{userProfile?.ecoPoints || 450}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Recycled</p>
                <p className="text-xl font-black text-emerald-400">{userProfile?.totalKgRecycled || 128} kg</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Tier Status</p>
                <p className="text-xs font-extrabold text-amber-300 flex items-center justify-center gap-1 mt-1">
                  <Award className="w-3.5 h-3.5" /> Eco Ambassador
                </p>
              </div>
            </div>
          </Card>

          {/* Profile Form Card */}
          <Card className="space-y-6 bg-white p-8 shadow-sm">
            
            {savedMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{savedMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Account Role Dropdown / Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Type / Role
                </label>
                <select
                  value={profileForm.role}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Resident">Resident (Household Recycler)</option>
                  <option value="Business">Business (Commercial Enterprise / Hotel)</option>
                  <option value="Collector">Collector (Logistics / Truck Driver)</option>
                  <option value="Recycler">Recycler (Industrial Hub)</option>
                  <option value="Admin">Admin (System / Regulatory Supervisor)</option>
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number (WhatsApp)
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Pickup Address
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.address}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* State & City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City / LGA
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.city}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Lekki Phase 1, Ikeja, Garki"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <select
                    value={profileForm.state}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Lagos State">Lagos State</option>
                    <option value="FCT Abuja">Abuja (FCT)</option>
                    <option value="Rivers State">Rivers State (Port Harcourt)</option>
                    <option value="Oyo State">Oyo State (Ibadan)</option>
                    <option value="Kano State">Kano State</option>
                    <option value="Ogun State">Ogun State</option>
                  </select>
                </div>
              </div>

              {/* Bank Account Details */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" /> Bank Payout Account (NUBAN)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.bankName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bankName: e.target.value }))}
                      placeholder="e.g. Kuda Bank, GTBank, Access"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      10-Digit Account Number
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={profileForm.accountNumber}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                      placeholder="2019948271"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" isLoading={isSaving} icon={Save}>
                  Save Profile Changes
                </Button>
              </div>

            </form>

          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
