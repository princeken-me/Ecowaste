import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  Search, 
  User, 
  Phone, 
  Calendar, 
  Weight, 
  Maximize2, 
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PickupMap({ 
  pickups = [], 
  selectedPickup = null, 
  onSelectPickup = () => {}, 
  onAcceptPickup = () => {}, 
  onCompletePickup = () => {},
  onSelectLocation = null,
  isPickerMode = false 
}) {
  const { userProfile } = useAuth();
  const isCollector = userProfile?.role === 'Collector';

  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [filterCity, setFilterCity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePin, setActivePin] = useState(selectedPickup);
  const [pickerCoords, setPickerCoords] = useState({ x: 50, y: 50 });

  // Filtered Pickups
  const filteredPickups = pickups.filter(item => {
    const matchesCity = filterCity === 'All' || item.city?.toLowerCase().includes(filterCity.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesSearch = !searchQuery || 
      item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wasteType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userDisplayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-500',
          border: 'border-amber-400',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          pulse: 'bg-amber-400'
        };
      case 'Accepted':
      case 'In Transit':
        return {
          bg: 'bg-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-400',
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
          pulse: 'bg-blue-400'
        };
      case 'Completed':
        return {
          bg: 'bg-emerald-600',
          text: 'text-emerald-600',
          border: 'border-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          pulse: 'bg-emerald-400'
        };
      default:
        return {
          bg: 'bg-slate-600',
          text: 'text-slate-600',
          border: 'border-slate-400',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
          pulse: 'bg-slate-400'
        };
    }
  };

  const handleCanvasClick = (e) => {
    if (!isPickerMode || !onSelectLocation) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPickerCoords({ x, y });
    onSelectLocation({ x, y });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-900 flex flex-col min-h-[500px]">
      
      {/* Top Map Control Bar */}
      <div className="relative z-20 bg-slate-900/90 backdrop-blur-md p-3 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address, LGA, resident name, or ID..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          
          {/* City Filter */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Cities (NG)</option>
            <option value="Lagos">Lagos State</option>
            <option value="Abuja">Abuja (FCT)</option>
            <option value="Ibadan">Ibadan (Oyo)</option>
            <option value="Port Harcourt">Port Harcourt</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending (Unassigned)</option>
            <option value="Accepted">Accepted / Dispatched</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Map Layer Toggle */}
          <button
            onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              mapType === 'satellite'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{mapType === 'satellite' ? 'Satellite' : 'Roadmap'}</span>
          </button>

        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div 
        onClick={handleCanvasClick}
        className={`relative flex-1 w-full min-h-[420px] overflow-hidden select-none cursor-crosshair ${
          mapType === 'satellite' ? 'bg-slate-950' : 'bg-slate-900'
        }`}
      >
        {/* Vector Google Maps Styling Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          {/* Simulated Roads & Grid Lines */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
              <pattern id="satellite-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={mapType === 'satellite' ? "url(#satellite-grid)" : "url(#grid)"} />

            {/* Major Highways & Arterials */}
            <path d="M-100,120 Q300,180 900,150" fill="none" stroke={mapType === 'satellite' ? '#047857' : '#334155'} strokeWidth="6" />
            <path d="M200,-50 Q250,300 300,600" fill="none" stroke={mapType === 'satellite' ? '#059669' : '#334155'} strokeWidth="5" />
            <path d="M-50,340 Q450,280 1000,420" fill="none" stroke={mapType === 'satellite' ? '#10b981' : '#475569'} strokeWidth="4" />
            
            {/* Water / Lagoon Visual (Lagos / PH Coastline Representation) */}
            <path d="M0,380 C150,350 350,420 500,390 C650,360 850,440 1000,400 L1000,600 L0,600 Z" fill={mapType === 'satellite' ? '#064e3b' : '#0f172a'} opacity="0.8" />
          </svg>
        </div>

        {/* Google Map Watermark & Scale Badge */}
        <div className="absolute bottom-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700/80 text-[10px] text-slate-300 font-bold flex items-center gap-2 pointer-events-none">
          <span className="text-emerald-400">Google Maps</span>
          <span className="text-slate-500">|</span>
          <span>EcoWaste Live Dispatch (NG)</span>
        </div>

        {/* Picker Mode Indicator */}
        {isPickerMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-emerald-400 flex items-center gap-2 animate-bounce">
            <MapPin className="w-4 h-4" /> Click map to select pickup location
          </div>
        )}

        {/* Selected Location Marker in Picker Mode */}
        {isPickerMode && (
          <div 
            className="absolute z-30 transform -translate-x-1/2 -translate-y-full transition-all duration-300"
            style={{ left: `${pickerCoords.x}%`, top: `${pickerCoords.y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl border-2 border-white animate-pulse">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="bg-slate-900 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap border border-emerald-500/40">
                Selected Coordinates ({pickerCoords.x}°, {pickerCoords.y}°)
              </span>
            </div>
          </div>
        )}

        {/* Render Pickup Map Pins */}
        {!isPickerMode && filteredPickups.map((item, index) => {
          const colors = getStatusColor(item.status);
          const isSelected = activePin?.id === item.id;

          // Compute deterministic coordinates on canvas based on item address/index
          const posX = item.coordinates?.x || 15 + ((index * 23 + (item.id.charCodeAt(item.id.length - 1) || 5) * 7) % 70);
          const posY = item.coordinates?.y || 20 + ((index * 19 + (item.id.charCodeAt(0) || 3) * 11) % 60);

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setActivePin(item);
                onSelectPickup(item);
              }}
              className="absolute z-20 group transform -translate-x-1/2 -translate-y-full transition-all duration-300 cursor-pointer"
              style={{ left: `${posX}%`, top: `${posY}%` }}
            >
              <div className="relative flex flex-col items-center">
                
                {/* Pulse Glow for Pending/In Transit */}
                {item.status !== 'Completed' && (
                  <span className={`absolute -inset-1 rounded-full ${colors.pulse} opacity-40 animate-ping`} />
                )}

                {/* Main Marker Pin */}
                <div className={`relative px-2.5 py-1.5 rounded-full ${colors.bg} text-white shadow-xl border-2 ${isSelected ? 'border-white scale-125 z-30 ring-4 ring-emerald-400/40' : 'border-slate-900 group-hover:scale-110'} transition-transform flex items-center gap-1.5`}>
                  {item.status === 'Completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : item.status === 'Accepted' ? (
                    <Truck className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px] font-bold tracking-tight">{item.estimatedWeightKg || item.weightKg || 10}kg</span>
                </div>

                {/* Address Label Pin Tag */}
                <div className="bg-slate-900/95 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700 shadow-md mt-1 whitespace-nowrap max-w-[130px] truncate">
                  {item.address?.split(',')[0] || item.city}
                </div>

              </div>
            </div>
          );
        })}

        {/* Selected Pickup Detail Popup Overlay */}
        <AnimatePresence>
          {activePin && !isPickerMode && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 text-white rounded-2xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusColor(activePin.status).badgeBg}`}>
                      {activePin.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{activePin.id}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{activePin.wasteType}</h4>
                </div>

                <button
                  onClick={() => setActivePin(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Preview if available */}
              {activePin.photoURL && (
                <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img src={activePin.photoURL} alt="Waste preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/80 rounded-xl p-3 border border-slate-700/50">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Estimated Weight</p>
                  <p className="font-bold text-emerald-400">{activePin.estimatedWeightKg || activePin.weightKg || 10} kg</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">EcoPoints Reward</p>
                  <p className="font-bold text-emerald-400">+{activePin.rewardPoints || 100} pts</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Pickup Schedule</p>
                  <p className="font-semibold text-slate-200">{activePin.pickupDate} ({activePin.timeSlot || 'Morning'})</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Resident Contact</p>
                  <p className="font-semibold text-slate-200">{activePin.userDisplayName || 'Eco Resident'}</p>
                </div>
              </div>

              {/* Address details */}
              <div className="text-xs space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Location Address
                </p>
                <p className="text-slate-200 font-medium leading-tight">{activePin.address}, {activePin.city}, {activePin.state}</p>
              </div>

              {/* Notes */}
              {activePin.notes && (
                <div className="text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                  <span className="font-bold text-slate-400">Notes: </span>{activePin.notes}
                </div>
              )}

              {/* Collector Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                {isCollector && activePin.status === 'Pending' && (
                  <button
                    onClick={() => {
                      onAcceptPickup(activePin.id);
                      setActivePin(prev => ({ ...prev, status: 'Accepted', collectorName: userProfile?.displayName }));
                    }}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
                  >
                    <Truck className="w-4 h-4" /> Accept Pickup Request
                  </button>
                )}

                {isCollector && activePin.status === 'Accepted' && (
                  <button
                    onClick={() => {
                      onCompletePickup(activePin.id);
                      setActivePin(prev => ({ ...prev, status: 'Completed' }));
                    }}
                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Completed & Transfer Points
                  </button>
                )}

                {activePin.userPhone && (
                  <a
                    href={`https://wa.me/${activePin.userPhone.replace(/[^00-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Resident
                  </a>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
