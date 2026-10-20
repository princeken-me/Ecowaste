import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  History, 
  Coins, 
  MapPin, 
  AlertTriangle, 
  User, 
  LogOut, 
  Truck,
  Building,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Factory,
  Home,
  Recycle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const isCollector = userProfile?.role === 'Collector';
  const isBusiness = userProfile?.role === 'Business';
  const isRecycler = userProfile?.role === 'Recycler';

  let navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'recycle', label: 'Recycle Waste', icon: Recycle, badge: 'AI Eco' },
    { id: 'schedule', label: 'Schedule Pickup', icon: CalendarPlus, badge: 'Quick' },
    { id: 'marketplace', label: 'Recycling Market', icon: Factory, badge: 'Trade' },
    { id: 'history', label: 'My Pickups', icon: History },
    { id: 'map', label: 'Live Pickup Map', icon: MapPin },
    { id: 'rewards', label: 'EcoRewards & Wallet', icon: Coins, badge: `${userProfile?.ecoPoints || 0} pts` },
    { id: 'depots', label: 'Recycling Depots', icon: MapPin },
    { id: 'reports', label: 'Hazard Reporter', icon: AlertTriangle },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  if (isCollector) {
    navItems = [
      { id: 'overview', label: 'Collector Dashboard', icon: LayoutDashboard },
      { id: 'available', label: 'Available Pickups', icon: Truck, badge: 'Active' },
      { id: 'marketplace', label: 'Recycling Market', icon: Factory, badge: 'Trade' },
      { id: 'history', label: 'Dispatch History', icon: History },
      { id: 'map', label: 'Live Route Map', icon: MapPin },
      { id: 'rewards', label: 'EcoRewards Wallet', icon: Coins, badge: `${userProfile?.ecoPoints || 0} pts` },
      { id: 'depots', label: 'Drop-off Depots', icon: MapPin },
      { id: 'profile', label: 'Profile & Settings', icon: User },
    ];
  }

  const getRoleBadge = () => {
    switch (userProfile?.role) {
      case 'Collector':
        return { label: 'Collector Agent', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40', icon: Truck };
      case 'Business':
        return { label: 'Commercial Member', color: 'bg-blue-500/20 text-blue-300 border-blue-400/40', icon: Building };
      case 'Recycler':
        return { label: 'Recycling Hub', color: 'bg-purple-500/20 text-purple-300 border-purple-400/40', icon: Factory };
      default:
        return { label: 'Resident Recycler', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40', icon: Home };
    }
  };

  const roleBadge = getRoleBadge();
  const RoleBadgeIcon = roleBadge.icon;

  const content = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200/80 w-64 p-4">
      {/* Sidebar User Header */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-extrabold text-emerald-300 text-base shrink-0 overflow-hidden">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              userProfile?.displayName?.charAt(0) || 'E'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{userProfile?.displayName || 'Eco Recycler'}</h4>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border mt-0.5 ${roleBadge.color}`}>
              <RoleBadgeIcon className="w-3 h-3" /> {roleBadge.label}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
          <span className="text-slate-300">EcoPoints</span>
          <span className="font-black text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-400/30">
            {userProfile?.ecoPoints || 0} pts
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Portal Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin Portal Shortcut */}
      <div className="mb-3">
        <Link
          to="/admin"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm text-xs font-bold border border-slate-800"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin Command Center</span>
          </div>
          <span className="text-[10px] uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black">
            Live
          </span>
        </Link>
      </div>

      {/* Recycling Impact Goal Progress */}
      <div className="mb-4 bg-slate-900 rounded-2xl p-4 text-white border border-slate-800">
        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-2">Monthly Target</p>
        <div className="h-2 bg-slate-800 rounded-full mb-2 overflow-hidden">
          <div className="h-full w-[72%] bg-emerald-500 rounded-full"></div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-emerald-400 font-bold">{userProfile?.totalKgRecycled || 128}kg Recycled</span>
          <span className="text-slate-400">72%</span>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-3 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-20 h-[calc(100vh-5rem)]">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-full h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
