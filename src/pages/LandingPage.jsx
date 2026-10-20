import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';

// High-impact AI generated assets
import heroWasteTruck from '../assets/images/hero_waste_truck_1785427245607.jpg';
import ecoHeroBanner from '../assets/images/eco_hero_banner_1785423795526.jpg';
import smartCollectorPickup from '../assets/images/smart_collector_pickup_1785423808497.jpg';
import wasteToRewards from '../assets/images/waste_to_rewards_1785423821969.jpg';
import circularMarketplace from '../assets/images/circular_marketplace_1785423832900.jpg';
import { 
  Recycle, 
  Truck, 
  Coins, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Leaf, 
  Zap, 
  BarChart3, 
  Users, 
  Award, 
  Trash2, 
  Smartphone, 
  Building2,
  Scan,
  Globe,
  TrendingUp,
  Flame,
  Star,
  ChevronRight,
  Shield,
  Layers,
  Search,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  // Waste Calculator State
  const [selectedCategory, setSelectedCategory] = useState('recyclable');
  const [weightKg, setWeightKg] = useState(25);

  const calculateRewards = () => {
    let ptsPerKg = 10;
    if (selectedCategory === 'e-waste') ptsPerKg = 25;
    if (selectedCategory === 'organic') ptsPerKg = 5;

    const totalPts = Math.round(weightKg * ptsPerKg);
    const cashValue = Math.round(totalPts * 5); // 1 point = ₦5
    const carbonOffset = (weightKg * 1.8).toFixed(1);

    return { totalPts, cashValue, carbonOffset };
  };

  const { totalPts, cashValue, carbonOffset } = calculateRewards();

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white overflow-hidden">
        
        {/* ========================================================= */}
        {/* HERO SECTION - FUTURISTIC ECO-TECH                        */}
        {/* ========================================================= */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-24 border-b border-emerald-100/60 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden">
          
          {/* Layered Animated Ambient Blobs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[20%] right-[-10%] w-[650px] h-[650px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }} 
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-teal-400/15 rounded-full blur-[120px] pointer-events-none" 
          />

          {/* Micro Grid Overlay Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column Text */}
              <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold tracking-wider uppercase backdrop-blur-md shadow-lg shadow-emerald-950/50"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Next-Gen Smart Recycling Network</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]"
                >
                  Turning Waste <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                    Into Wealth.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
                >
                  Nigeria's leading circular economy platform. Connect households, estates, and businesses with verified collectors, AI waste classification, and instant EcoPoints payouts for PET plastic, e-waste, metals, and organics.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
                >
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => navigate('/dashboard')}
                    icon={Truck}
                    className="w-full sm:w-auto text-base font-extrabold py-4 px-8 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-2xl shadow-xl shadow-emerald-500/25 border border-emerald-300/40"
                  >
                    Schedule Pickup
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/recycle')}
                    icon={Recycle}
                    className="w-full sm:w-auto text-base font-extrabold py-4 px-8 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 rounded-2xl backdrop-blur-md"
                  >
                    Start Recycling
                  </Button>
                </motion.div>

                {/* Trust Badges */}
                <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>LAWMA & AEPB Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Instant EcoPoints Cashout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>35 Nigerian Cities Covered</span>
                  </div>
                </div>

              </div>

              {/* Right Column: 3D Visual Showcase & Floating Glass Cards */}
              <div className="lg:col-span-6 relative">
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative mx-auto max-w-lg lg:max-w-none"
                >
                  {/* Main Hero Card Container */}
                  <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-900/60 backdrop-blur-xl p-3">
                    <img 
                      src={heroWasteTruck} 
                      alt="Smart Waste Collection Truck & Collectors in Nigeria"
                      referrerPolicy="no-referrer"
                      className="w-full h-[420px] sm:h-[480px] object-cover rounded-2xl brightness-95 contrast-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent rounded-2xl pointer-events-none" />
                    
                    {/* Floating Overlay Badge: Smart AI Scan */}
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md border border-emerald-400/40 rounded-2xl p-3 shadow-xl flex items-center gap-3 text-white"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                        <Scan className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-300">AI Material Scan</p>
                        <p className="text-[10px] text-slate-300">98.4% PET Confidence</p>
                      </div>
                    </motion.div>

                    {/* Floating Overlay Badge: Live Collector Dispatch */}
                    <motion.div 
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-8 right-6 bg-slate-900/90 backdrop-blur-md border border-emerald-400/40 rounded-2xl p-4 shadow-2xl text-white max-w-xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-sky-400" />
                          <span className="text-xs font-bold text-white">Collector Dispatch</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">Chidi Okonkwo is 1.2 km away from Ikoyi pickup point.</p>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full w-3/4 rounded-full" />
                      </div>
                    </motion.div>

                    {/* Floating EcoPoints Coin */}
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0], y: [0, -6, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-10 left-6 bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-2xl shadow-xl flex items-center gap-2 text-slate-950 font-black text-xs"
                    >
                      <Coins className="w-5 h-5 text-slate-950" />
                      <span>+250 EcoPoints Earned</span>
                    </motion.div>
                  </div>

                </motion.div>

              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* STATISTICS COUNTER BAR                                    */}
        {/* ========================================================= */}
        <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-14 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-emerald-400">50,000+</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pickup Requests</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-emerald-400">2 Million KG</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Waste Recycled</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-teal-400">150+</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Collectors</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-sky-400">35</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nigerian Cities</p>
              </div>

              <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-amber-400">98%</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Satisfaction</p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RECYCLING CALCULATOR INTERACTIVE WIDGET                   */}
        {/* ========================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Instant Calculator
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Calculate How Much You Can Earn Today
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Estimate your instant cash payout or airtime value based on waste category and total weight. Convert plastic, metal, cardboard, and e-waste into clean income.
              </p>
              
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600" /> Doorstep Weighing & Instant Payment
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600" /> Redeem for Bank Transfer, Airtime, or Power Bills
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-2xl">
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Select Waste Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'recyclable', label: 'PET Plastics', rate: '10 pts/kg', icon: Recycle },
                    { id: 'e-waste', label: 'E-Waste', rate: '25 pts/kg', icon: Smartphone },
                    { id: 'organic', label: 'Organic', rate: '5 pts/kg', icon: Leaf },
                  ].map(item => {
                    const Icon = item.icon;
                    const active = selectedCategory === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedCategory(item.id)}
                        className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                          active
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                            : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? 'text-slate-950' : 'text-emerald-400'}`} />
                        <span>{item.label}</span>
                        <span className={`text-[10px] ${active ? 'text-slate-900 font-black' : 'text-slate-400'}`}>{item.rate}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Estimated Weight (kg)
                  </label>
                  <span className="text-sm font-black text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-3 py-1 rounded-xl">
                    {weightKg} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Earnings Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">EcoPoints</span>
                  <span className="text-lg font-black text-white">{totalPts} pts</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Payout Value</span>
                  <span className="text-xl font-black text-emerald-400">₦{cashValue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">CO₂ Saved</span>
                  <span className="text-lg font-black text-sky-400">{carbonOffset} kg</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full justify-center py-3.5 text-base font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl"
                onClick={() => navigate('/recycle')}
                icon={ArrowRight}
              >
                Start Recycling & Claim Payout
              </Button>

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* VISUAL SECTIONS WITH HIGH QUALITY ARTWORK                 */}
        {/* ========================================================= */}
        <section className="py-20 bg-slate-100/60 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                Platform Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Designed for Households, Collectors & Recyclers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Pickup Scheduling */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={smartCollectorPickup} 
                    alt="Pickup Scheduling" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white p-2.5 rounded-2xl shadow-md">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-slate-900">On-Demand Pickup Scheduling</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Set your address, date, and preferred time slot. Doorstep collectors arrive with verified digital scales.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="w-full justify-between">
                    <span>Schedule Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* AI Waste Scanner */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={circularMarketplace} 
                    alt="AI Waste Classifier" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-teal-600 text-white p-2.5 rounded-2xl shadow-md">
                    <Scan className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-slate-900">AI Material Classification</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Upload a photo of your waste. Gemini AI instant vision detects material type, weight, and recyclability.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/recycle')} className="w-full justify-between">
                    <span>Try AI Classifier</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Eco Rewards */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={wasteToRewards} 
                    alt="Eco Rewards" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 p-2.5 rounded-2xl shadow-md">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-slate-900">EcoRewards Wallet</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Earn points on every recycled kg. Redeem for instant airtime, electricity units, or direct bank transfer.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="w-full justify-between">
                    <span>View Wallet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

            </div>

          </div>
        </section>

      </div>
    </PageTransition>
  );
}
