import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useWaste } from '../context/WasteContext';
import PageTransition from '../components/PageTransition';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import PickupMap from '../components/PickupMap';
import MarketplacePage from '../components/MarketplacePage';
import WalletPage from '../components/WalletPage';
import RecycleWastePage from './RecycleWastePage';
import { 
  Recycle, 
  Truck, 
  Coins, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Smartphone, 
  Building, 
  ShieldCheck, 
  FileText, 
  Plus, 
  ExternalLink, 
  Menu, 
  ChevronRight,
  Sparkles,
  Phone,
  Trash2,
  Share2,
  Image as ImageIcon,
  UserCheck,
  Search,
  Filter,
  Check,
  Loader2,
  Award,
  HelpCircle,
  Eye
} from 'lucide-react';

export default function DashboardPage() {
  const { userProfile, currentUser, isDemoMode } = useAuth();
  const { 
    pickups, 
    reports, 
    depots, 
    rewardsHistory, 
    createPickup, 
    acceptPickup, 
    completePickup, 
    cancelPickup, 
    createReport, 
    redeemPoints 
  } = useWaste();
  
  const isCollector = userProfile?.role === 'Collector';
  const [activeTab, setActiveTab] = useState(isCollector ? 'available' : 'overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedPickupReceipt, setSelectedPickupReceipt] = useState(null);

  // Filters for My Pickups
  const [pickupFilterStatus, setPickupFilterStatus] = useState('All');

  // Form State for New Pickup
  const [pickupForm, setPickupForm] = useState({
    wasteType: 'PET Plastics & Clear Bottles',
    category: 'recyclable',
    estimatedWeightKg: '15',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '10:00 AM - 12:00 PM',
    address: userProfile?.address || '14 Admiralty Way, Lekki Phase 1',
    city: userProfile?.city || 'Lagos',
    state: userProfile?.state || 'Lagos State',
    notes: 'Items packed in clear bags near main entrance gate.',
    coords: { x: 45, y: 40 }
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [pickupLoading, setPickupLoading] = useState(false);
  const [pickupSuccessMsg, setPickupSuccessMsg] = useState('');
  const [pickupErrorMsg, setPickupErrorMsg] = useState('');

  // Form State for Redemption
  const [rewardForm, setRewardForm] = useState({
    type: 'MTN Airtime Top-Up',
    points: 200,
    phoneOrAccount: userProfile?.phone || '+234 803 123 4567'
  });
  const [rewardMsg, setRewardMsg] = useState('');

  // Form State for Hazard Report
  const [reportForm, setReportForm] = useState({
    title: '',
    location: '',
    city: 'Lagos',
    severity: 'Medium',
    details: ''
  });
  const [reportMsg, setReportMsg] = useState('');

  // Handle Photo selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPickupErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setPickupLoading(true);
    setPickupSuccessMsg('');
    setPickupErrorMsg('');

    try {
      const created = await createPickup(pickupForm, photoFile);
      setPickupLoading(false);
      setPickupSuccessMsg(`Pickup #${created.id} scheduled successfully! Collector assigned on real-time map.`);
      
      // Reset photo
      setPhotoFile(null);
      setPhotoPreview('');
      
      setTimeout(() => {
        setActiveTab('history');
      }, 1200);
    } catch (err) {
      console.error(err);
      setPickupLoading(false);
      setPickupErrorMsg('Failed to schedule pickup. Please check your network connection.');
    }
  };

  const handleRedeemSubmit = (e) => {
    e.preventDefault();
    try {
      const pts = Number(rewardForm.points);
      const cashVal = `₦${(pts * 5).toLocaleString()}`;
      redeemPoints(rewardForm.type, pts, cashVal);
      setRewardMsg(`Successfully redeemed ${pts} EcoPoints for ${rewardForm.type} (${cashVal})!`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.location) return;
    createReport(reportForm);
    setReportMsg('Hazard report submitted! Dispatched to municipal clearance team.');
    setReportForm({ title: '', location: '', city: 'Lagos', severity: 'Medium', details: '' });
  };

  // Filtered Pickups for User
  const userPickups = pickups.filter(p => {
    if (isCollector) return p.collectorId === currentUser?.uid || p.status === 'Accepted';
    const isOwner = p.userId === currentUser?.uid || p.userId === 'demo-resident-123';
    if (!isOwner) return true; // show all for rich dashboard view
    return true;
  });

  const filteredUserPickups = userPickups.filter(p => {
    if (pickupFilterStatus === 'All') return true;
    return p.status === pickupFilterStatus;
  });

  // Collector Available Pickups
  const availablePickups = pickups.filter(p => p.status === 'Pending');

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white border-b border-slate-800 py-3.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Recycle className="w-5 h-5 animate-spin-slow" />
                </div>
                <h1 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>EcoWaste Operations</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Firestore Sync
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-slate-400">Account Role:</span>
                <span className="font-bold text-emerald-400">{userProfile?.role || 'Resident'}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800 text-emerald-300 font-bold">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>{userProfile?.ecoPoints || 450} Pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Main Container */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
          
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mobileOpen={mobileSidebarOpen}
            setMobileOpen={setMobileSidebarOpen}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-8">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-8 text-white shadow-xl border border-emerald-900/40">
                  <div className="relative z-10 max-w-2xl space-y-3">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      National Circular Economy Network
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-white">
                      Welcome back, {userProfile?.displayName || 'Eco Recycler'}!
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      You are actively helping clean up Nigerian cities while earning EcoPoints redeemable for Instant Bank Cash & Mobile Airtime.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      {!isCollector ? (
                        <Button
                          variant="primary"
                          onClick={() => setActiveTab('schedule')}
                          icon={Calendar}
                        >
                          Schedule Waste Pickup
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => setActiveTab('available')}
                          icon={Truck}
                        >
                          View Available Pickups ({availablePickups.length})
                        </Button>
                      )}
                      <Button
                        variant="dark"
                        onClick={() => setActiveTab('map')}
                        icon={MapPin}
                      >
                        Live Pickup Map
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Impact Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <Card className="p-5 space-y-2 border-emerald-100 bg-white">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">EcoPoints Balance</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Coins className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{userProfile?.ecoPoints || 450}</p>
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ≈ ₦{((userProfile?.ecoPoints || 450) * 5).toLocaleString()} Cash Value
                    </p>
                  </Card>

                  <Card className="p-5 space-y-2 border-slate-200 bg-white">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Recycled</span>
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Recycle className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{userProfile?.totalKgRecycled || 128} <span className="text-base font-normal text-slate-500">kg</span></p>
                    <p className="text-xs text-slate-500 font-medium">PET Plastics, Cans & E-Waste</p>
                  </Card>

                  <Card className="p-5 space-y-2 border-slate-200 bg-white">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Active Pickups</span>
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Truck className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">
                      {pickups.filter(p => p.status === 'Pending' || p.status === 'Accepted').length}
                    </p>
                    <p className="text-xs text-amber-700 font-semibold">Tracked on Real-Time Map</p>
                  </Card>

                  <Card className="p-5 space-y-2 border-slate-200 bg-white">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Depots Nearby</span>
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{depots.length}</p>
                    <p className="text-xs text-purple-700 font-semibold">Lagos, Abuja, PH & Ibadan</p>
                  </Card>

                </div>

                {/* Embedded Live Google Maps Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Live Regional Pickup Map</h3>
                      <p className="text-xs text-slate-500">Real-time coordinates of pickups, collectors & drop-off centers</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('map')} icon={ExternalLink}>
                      Fullscreen Map
                    </Button>
                  </div>

                  <PickupMap
                    pickups={pickups}
                    onAcceptPickup={acceptPickup}
                    onCompletePickup={completePickup}
                  />
                </div>

              </div>
            )}

            {/* 2. SCHEDULE PICKUP TAB */}
            {activeTab === 'schedule' && (
              <div className="max-w-3xl space-y-6">
                
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Schedule Waste Pickup</h2>
                  <p className="text-sm text-slate-500">
                    Book a door-step collection agent. Sorted recyclables earn higher EcoPoints!
                  </p>
                </div>

                <Card className="p-8 space-y-6 bg-white shadow-xl border-slate-200">
                  
                  {pickupSuccessMsg && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{pickupSuccessMsg}</span>
                    </div>
                  )}

                  {pickupErrorMsg && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>{pickupErrorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleScheduleSubmit} className="space-y-6">
                    
                    {/* Waste Category & Type Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Waste Type Category
                        </label>
                        <select
                          value={pickupForm.wasteType}
                          onChange={(e) => {
                            const val = e.target.value;
                            let cat = 'recyclable';
                            if (val.includes('E-Waste')) cat = 'e-waste';
                            if (val.includes('Organic')) cat = 'organic';
                            if (val.includes('Scrap')) cat = 'scrap';
                            setPickupForm(prev => ({ ...prev, wasteType: val, category: cat }));
                          }}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="PET Plastics & Clear Bottles">PET Plastics & Clear Drink Bottles (+10 pts/kg)</option>
                          <option value="Aluminium Beverage Cans">Aluminium Beverage Cans (+15 pts/kg)</option>
                          <option value="Paper & Packaging Cartons">Paper & Packaging Cartons (+8 pts/kg)</option>
                          <option value="E-Waste (Old Monitors, Printers, Cables)">E-Waste (Old Electronics & Computers) (+20 pts/kg)</option>
                          <option value="Household Organic Compost">Household Organic Waste</option>
                          <option value="Industrial Scrap Metals & Copper">Industrial Scrap Metals & Copper</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Estimated Weight (in Kilograms)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            required
                            value={pickupForm.estimatedWeightKg}
                            onChange={(e) => setPickupForm(prev => ({ ...prev, estimatedWeightKg: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kg</span>
                        </div>
                        <p className="text-[11px] text-emerald-600 font-bold mt-1">
                          Estimated Reward: +{Math.round((parseFloat(pickupForm.estimatedWeightKg) || 10) * (pickupForm.category === 'e-waste' ? 20 : 10))} EcoPoints
                        </p>
                      </div>
                    </div>

                    {/* Date and Time Slot */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Preferred Pickup Date
                        </label>
                        <input
                          type="date"
                          required
                          value={pickupForm.pickupDate}
                          onChange={(e) => setPickupForm(prev => ({ ...prev, pickupDate: e.target.value }))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Pickup Time Slot
                        </label>
                        <select
                          value={pickupForm.timeSlot}
                          onChange={(e) => setPickupForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                        >
                          <option value="08:00 AM - 10:00 AM">Morning (08:00 AM - 10:00 AM)</option>
                          <option value="10:00 AM - 12:00 PM">Mid-day (10:00 AM - 12:00 PM)</option>
                          <option value="12:00 PM - 02:00 PM">Afternoon (12:00 PM - 02:00 PM)</option>
                          <option value="02:00 PM - 04:00 PM">Late Afternoon (02:00 PM - 04:00 PM)</option>
                          <option value="04:00 PM - 06:00 PM">Evening (04:00 PM - 06:00 PM)</option>
                        </select>
                      </div>
                    </div>

                    {/* Address & City/State */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Pickup Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={pickupForm.address}
                        onChange={(e) => setPickupForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="14 Admiralty Way, Lekki Phase 1, Lagos"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          City / Local Govt (LGA)
                        </label>
                        <input
                          type="text"
                          required
                          value={pickupForm.city}
                          onChange={(e) => setPickupForm(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          State
                        </label>
                        <select
                          value={pickupForm.state}
                          onChange={(e) => setPickupForm(prev => ({ ...prev, state: e.target.value }))}
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

                    {/* Upload Waste Photo */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Upload Waste Photo (Firebase Storage)
                      </label>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <label className="flex-1 w-full border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/50">
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <span className="text-xs font-bold text-slate-700 block">Click or Drag & Drop Photo</span>
                          <span className="text-[10px] text-slate-400 block">Supports JPEG, PNG, WebP up to 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                        </label>

                        {photoPreview && (
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shrink-0">
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => { setPhotoFile(null); setPhotoPreview(''); }}
                              className="absolute top-1 right-1 bg-slate-900/80 text-white p-0.5 rounded-full"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Instructions / Gate Notes for Collector
                      </label>
                      <textarea
                        rows={2}
                        value={pickupForm.notes}
                        onChange={(e) => setPickupForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="e.g. Please call +234803... upon reaching main gate."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={pickupLoading}
                      className="w-full justify-center py-3.5 text-base"
                      icon={Calendar}
                    >
                      Confirm & Schedule Dispatch
                    </Button>

                  </form>
                </Card>

              </div>
            )}

            {/* 3. COLLECTOR AVAILABLE PICKUPS TAB */}
            {(activeTab === 'available' || (isCollector && activeTab === 'overview')) && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Truck className="w-6 h-6 text-emerald-600" /> Collector Dispatch Hub
                    </h2>
                    <p className="text-sm text-slate-500">Available unassigned pickup requests across your operating zone</p>
                  </div>
                  
                  <div className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                    {availablePickups.length} Open Requests
                  </div>
                </div>

                {availablePickups.length === 0 ? (
                  <Card className="p-12 text-center space-y-3 bg-white">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">All Pickups Dispatched!</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      There are currently no pending unassigned pickups in this region. Check back soon or view active dispatch map.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availablePickups.map((item) => (
                      <Card key={item.id} className="p-5 space-y-4 bg-white border-slate-200 hover:border-emerald-500 transition-all shadow-sm">
                        
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                              {item.status}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 mt-1">{item.wasteType}</h4>
                            <p className="text-xs text-slate-500 font-mono">ID: #{item.id}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-lg font-black text-emerald-600">{item.weightKg || item.estimatedWeightKg || 10} kg</span>
                            <p className="text-[10px] text-slate-400 font-bold">+{item.rewardPoints || 100} pts</p>
                          </div>
                        </div>

                        {/* Photo if available */}
                        {item.photoURL && (
                          <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-900">
                            <img src={item.photoURL} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {item.address}, {item.city}
                          </p>
                          <p className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Scheduled: {item.pickupDate} ({item.timeSlot || 'Morning'})
                          </p>
                          <p className="flex items-center gap-1.5 text-slate-500">
                            <User className="w-3.5 h-3.5 text-slate-400" /> Resident: {item.userDisplayName || 'Tunde Adebayo'}
                          </p>
                        </div>

                        {item.notes && (
                          <p className="text-xs text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                            "{item.notes}"
                          </p>
                        )}

                        <div className="pt-2 flex items-center gap-2">
                          <Button
                            variant="primary"
                            className="flex-1 justify-center text-xs"
                            icon={Truck}
                            onClick={() => acceptPickup(item.id)}
                          >
                            Accept & Claim Pickup
                          </Button>
                          
                          {item.userPhone && (
                            <a
                              href={`https://wa.me/${item.userPhone.replace(/[^00-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                              title="Contact Resident"
                            >
                              <Phone className="w-4 h-4 text-emerald-600" />
                            </a>
                          )}
                        </div>

                      </Card>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* 4. MY PICKUPS HISTORY & STATUS TAB */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pickup Requests & Status</h2>
                    <p className="text-sm text-slate-500">Track real-time collection progress, assigned agents & EcoPoints rewards</p>
                  </div>

                  {/* Filter Status Buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
                    {['All', 'Pending', 'Accepted', 'Completed'].map(st => (
                      <button
                        key={st}
                        onClick={() => setPickupFilterStatus(st)}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          pickupFilterStatus === st
                            ? 'bg-white text-slate-900 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredUserPickups.length === 0 ? (
                  <Card className="p-12 text-center space-y-3 bg-white">
                    <Recycle className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">No Pickups Found</h3>
                    <p className="text-xs text-slate-500">You haven't scheduled any pickups matching this filter yet.</p>
                    <Button variant="primary" onClick={() => setActiveTab('schedule')} icon={Plus}>
                      Schedule Your First Pickup
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredUserPickups.map((item) => {
                      const isCompleted = item.status === 'Completed';
                      const isAccepted = item.status === 'Accepted' || item.status === 'In Transit';

                      return (
                        <Card key={item.id} className="p-6 space-y-4 bg-white border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
                                isCompleted ? 'bg-emerald-600' : isAccepted ? 'bg-blue-600' : 'bg-amber-500 animate-pulse'
                              }`}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-bold text-slate-900">{item.wasteType}</h4>
                                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                                    isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                    isAccepted ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                    'bg-amber-100 text-amber-800 border-amber-300'
                                  }`}>
                                    {item.status}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">Reference: #{item.id}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                              <div>
                                <p className="text-slate-400 text-[10px] uppercase font-bold">Weight</p>
                                <p className="font-bold text-slate-900 text-base">{item.estimatedWeightKg || item.weightKg || 10} kg</p>
                              </div>
                              <div>
                                <p className="text-slate-400 text-[10px] uppercase font-bold">Reward</p>
                                <p className="font-bold text-emerald-600 text-base">+{item.rewardPoints || 100} pts</p>
                              </div>
                            </div>
                          </div>

                          {/* Real-time Status Timeline Progress */}
                          <div className="py-2">
                            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
                              <div className={`p-2 rounded-xl border ${
                                item.status ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 text-slate-400'
                              }`}>
                                1. Request Received
                              </div>
                              <div className={`p-2 rounded-xl border ${
                                isAccepted || isCompleted ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 text-slate-400'
                              }`}>
                                2. Agent Assigned
                              </div>
                              <div className={`p-2 rounded-xl border ${
                                isCompleted ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 text-slate-400'
                              }`}>
                                3. Collected & Points Awarded
                              </div>
                            </div>
                          </div>

                          {/* Pickup Information Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div>
                              <p className="text-slate-400 font-bold uppercase text-[10px]">Location Address</p>
                              <p className="font-medium text-slate-900">{item.address}, {item.city}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 font-bold uppercase text-[10px]">Schedule Window</p>
                              <p className="font-medium text-slate-900">{item.pickupDate} ({item.timeSlot || 'Morning'})</p>
                            </div>
                            <div>
                              <p className="text-slate-400 font-bold uppercase text-[10px]">Collection Agent</p>
                              <p className="font-bold text-emerald-700">{item.collectorName || item.agentName || 'Eco Collector Assigned'}</p>
                            </div>
                          </div>

                          {/* Image preview if present */}
                          {item.photoURL && (
                            <div className="flex items-center gap-3 bg-slate-100/60 p-2.5 rounded-xl border border-slate-200">
                              <img src={item.photoURL} alt="Waste photo" className="w-14 h-14 rounded-lg object-cover" />
                              <div className="text-xs">
                                <p className="font-bold text-slate-800">Uploaded Waste Photo</p>
                                <p className="text-[11px] text-slate-500">Stored in Firebase Storage bucket</p>
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                            {isCollector && item.status === 'Accepted' && (
                              <Button
                                variant="primary"
                                size="sm"
                                icon={CheckCircle2}
                                onClick={() => completePickup(item.id)}
                              >
                                Mark Completed & Transfer Points
                              </Button>
                            )}

                            {item.status === 'Pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-rose-600 hover:bg-rose-50"
                                onClick={() => cancelPickup(item.id)}
                              >
                                Cancel Request
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              icon={FileText}
                              onClick={() => setSelectedPickupReceipt(item)}
                            >
                              Digital Receipt
                            </Button>
                          </div>

                        </Card>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* 5. LIVE PICKUP MAP TAB */}
            {activeTab === 'map' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Google Dispatch Map</h2>
                  <p className="text-sm text-slate-500">Explore real-time pickup coordinates, regional density & assigned collector agents</p>
                </div>

                <PickupMap
                  pickups={pickups}
                  onAcceptPickup={acceptPickup}
                  onCompletePickup={completePickup}
                />
              </div>
            )}

            {/* 6. RECYCLING MARKETPLACE TAB */}
            {activeTab === 'marketplace' && (
              <MarketplacePage />
            )}

            {/* 7. ECO REWARDS WALLET TAB */}
            {activeTab === 'rewards' && (
              <WalletPage />
            )}

            {/* 7. DEPOTS TAB */}
            {activeTab === 'depots' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verified Recycling Depots</h2>
                  <p className="text-sm text-slate-500">Self drop-off facilities accepting bulk recyclables across Nigeria</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {depots.map((depot) => (
                    <Card key={depot.id} className="p-6 space-y-4 bg-white border-slate-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                            {depot.city}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1">{depot.name}</h4>
                        </div>
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>

                      <p className="text-xs text-slate-600">{depot.address}</p>
                      
                      <div className="pt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Accepted Materials:</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {depot.accepts.map((mat, i) => (
                            <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>{depot.hours}</span>
                        <a href={`tel:${depot.phone}`} className="text-emerald-600 font-bold hover:underline">
                          {depot.phone}
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 8. HAZARD REPORTS TAB */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Environmental Hazard Reporter</h2>
                  <p className="text-sm text-slate-500">Report illegal waste dumping sites or clogged drainage channels to authorities</p>
                </div>

                <Card className="p-6 space-y-4 bg-white">
                  <h4 className="text-base font-bold text-slate-900">Submit New Hazard Incident</h4>
                  
                  {reportMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
                      {reportMsg}
                    </div>
                  )}

                  <form onSubmit={handleReportSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Incident Title
                        </label>
                        <input
                          type="text"
                          required
                          value={reportForm.title}
                          onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Clogged Canal Waste Blocking Drainage"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Location Address & City
                        </label>
                        <input
                          type="text"
                          required
                          value={reportForm.location}
                          onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g. Oshodi Express Bus Stop, Lagos"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="primary" icon={AlertCircle} className="w-full justify-center">
                      Submit Incident to Municipal Enforcement
                    </Button>
                  </form>
                </Card>

                <div className="space-y-3">
                  <h4 className="text-base font-bold text-slate-900">Community Reported Incidents</h4>
                  {reports.map((rep) => (
                    <Card key={rep.id} className="p-4 bg-white border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                          {rep.severity} Severity
                        </span>
                        <h5 className="font-bold text-slate-900 mt-1 text-sm">{rep.title}</h5>
                        <p className="text-slate-500">{rep.location} • {rep.reportedAt}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          {rep.status}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 10. RECYCLE WASTE MODULE TAB */}
            {activeTab === 'recycle' && (
              <RecycleWastePage />
            )}

            {/* 9. PROFILE TAB ROUTE REDIRECT */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <Card className="p-8 text-center space-y-4 bg-white">
                  <UserCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900">Account Profile & Settings</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Manage your avatar photo, state, city, phone number, and NUBAN bank payout credentials.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/profile')}
                    icon={ExternalLink}
                  >
                    Open Full Profile Settings Page
                  </Button>
                </Card>
              </div>
            )}

          </main>
        </div>

        {/* Digital Receipt Modal */}
        <Modal
          isOpen={!!selectedPickupReceipt}
          onClose={() => setSelectedPickupReceipt(null)}
          title="EcoWaste Digital Collection Receipt"
        >
          {selectedPickupReceipt && (
            <div className="space-y-6 text-slate-900">
              <div className="text-center p-6 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mx-auto flex items-center justify-center">
                  <Recycle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black">Official Recycling Receipt</h3>
                <p className="text-xs text-emerald-300 font-mono">Reference ID: #{selectedPickupReceipt.id}</p>
              </div>

              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Material Category</span>
                  <span className="font-bold text-slate-900">{selectedPickupReceipt.wasteType}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Net Weight</span>
                  <span className="font-bold text-slate-900">{selectedPickupReceipt.weightKg || selectedPickupReceipt.estimatedWeightKg || 10} kg</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">EcoPoints Awarded</span>
                  <span className="font-black text-emerald-600 text-sm">+{selectedPickupReceipt.rewardPoints || 100} Points</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Location</span>
                  <span className="font-medium text-slate-900">{selectedPickupReceipt.address}, {selectedPickupReceipt.city}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Collection Date</span>
                  <span className="font-medium text-slate-900">{selectedPickupReceipt.pickupDate}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Certified Agent</span>
                  <span className="font-bold text-emerald-700">{selectedPickupReceipt.collectorName || 'Eco Collector Agent'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedPickupReceipt(null)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => window.print()} icon={Share2}>
                  Print Receipt
                </Button>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </PageTransition>
  );
}
