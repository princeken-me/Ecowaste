import React, { useState, useMemo } from 'react';
import { useWaste } from '../context/WasteContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Users, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Scale, 
  Coins, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Trash2, 
  Edit3, 
  UserX, 
  Bell, 
  Activity, 
  FileText, 
  ShoppingBag, 
  ChevronRight, 
  ArrowUpRight, 
  Check, 
  X, 
  RefreshCw,
  SlidersHorizontal,
  Building2,
  UserCheck
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

export default function AdminDashboardPage() {
  const { userProfile } = useAuth();
  const { 
    pickups, 
    usersList, 
    reports, 
    transactions, 
    activitiesFeed, 
    notificationsList,
    approveCollector, 
    updateUserRoleAdmin,
    deleteUserAdmin, 
    updatePickupAdmin, 
    deletePickupAdmin, 
    updateReportStatus, 
    deleteReportAdmin,
    markNotificationRead 
  } = useWaste();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, collectors, pickups, reports, activities

  // Filter States
  const [dateRange, setDateRange] = useState('all'); // all, today, week, month
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [pickupStatusFilter, setPickupStatusFilter] = useState('All');

  // Modal States
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [editingPickup, setEditingPickup] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Filter options
  const NIGERIA_STATES = ['All', 'Lagos State', 'FCT Abuja', 'Rivers State', 'Oyo State', 'Kano State', 'Enugu State'];
  const NIGERIA_CITIES = ['All', 'Lagos', 'Ikeja', 'Lekki', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'];

  // Filtered Pickups calculation
  const filteredPickups = useMemo(() => {
    return pickups.filter(p => {
      // Date filter
      if (dateRange !== 'all') {
        const pDate = new Date(p.createdAt || p.pickupDate);
        const now = new Date();
        if (dateRange === 'today') {
          if (pDate.toDateString() !== now.toDateString()) return false;
        } else if (dateRange === 'week') {
          const diffDays = (now.getTime() - pDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 7) return false;
        } else if (dateRange === 'month') {
          const diffDays = (now.getTime() - pDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 30) return false;
        }
      }

      // State & City filter
      if (selectedState !== 'All' && p.state && p.state !== selectedState) return false;
      if (selectedCity !== 'All' && p.city && p.city !== selectedCity) return false;

      // Status filter
      if (pickupStatusFilter !== 'All' && p.status !== pickupStatusFilter) return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchUser = p.userDisplayName?.toLowerCase().includes(q);
        const matchAddress = p.address?.toLowerCase().includes(q);
        const matchType = p.wasteType?.toLowerCase().includes(q);
        const matchId = p.id?.toLowerCase().includes(q);
        if (!matchUser && !matchAddress && !matchType && !matchId) return false;
      }

      return true;
    });
  }, [pickups, dateRange, selectedState, selectedCity, pickupStatusFilter, searchQuery]);

  // Filtered Users calculation
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
      if (selectedState !== 'All' && u.state && u.state !== selectedState) return false;
      if (selectedCity !== 'All' && u.city && u.city !== selectedCity) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = u.displayName?.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q);
        const matchPhone = u.phone?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }
      return true;
    });
  }, [usersList, userRoleFilter, selectedState, selectedCity, searchQuery]);

  // Pending collectors
  const pendingCollectors = useMemo(() => {
    return usersList.filter(u => u.role === 'Collector' && (u.approvalStatus === 'Pending' || !u.collectorApproved));
  }, [usersList]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (selectedState !== 'All' && r.state && r.state !== selectedState) return false;
      if (selectedCity !== 'All' && r.city && r.city !== selectedCity) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title?.toLowerCase().includes(q);
        const matchLoc = r.location?.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc) return false;
      }
      return true;
    });
  }, [reports, selectedState, selectedCity, searchQuery]);

  // Analytics Aggregates
  const stats = useMemo(() => {
    const totalUsers = usersList.length;
    const totalPickups = filteredPickups.length;
    const completedPickups = filteredPickups.filter(p => p.status === 'Completed').length;
    const pendingPickups = filteredPickups.filter(p => p.status === 'Pending' || p.status === 'Scheduled').length;
    
    const wasteCollectedKg = filteredPickups
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + (Number(p.weightKg) || Number(p.estimatedWeightKg) || 0), 0);

    const totalPointsIssued = transactions
      .filter(t => t.points > 0)
      .reduce((sum, t) => sum + t.points, 0);

    const nairaValueIssued = totalPointsIssued * 5;

    return {
      totalUsers,
      totalPickups,
      completedPickups,
      pendingPickups,
      wasteCollectedKg,
      totalPointsIssued,
      nairaValueIssued
    };
  }, [usersList, filteredPickups, transactions]);

  // Chart 1 Data: Waste Trends Line Chart
  const wasteTrendChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'PET Plastic Bottles (kg)',
        data: [420, 680, 950, 1200, 1650, 2100, 2850],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.35,
      },
      {
        label: 'E-Waste & Electronics (kg)',
        data: [150, 230, 310, 480, 620, 890, 1150],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true,
        tension: 0.35,
      },
      {
        label: 'Aluminium Cans & Metal (kg)',
        data: [200, 340, 510, 650, 810, 1100, 1420],
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35,
      }
    ]
  };

  // Chart 2 Data: Pickup Status Breakdown Doughnut
  const pickupStatusChartData = {
    labels: ['Completed', 'In Transit / Accepted', 'Pending / Scheduled', 'Cancelled'],
    datasets: [
      {
        data: [
          pickups.filter(p => p.status === 'Completed').length || 12,
          pickups.filter(p => p.status === 'Accepted' || p.status === 'In Transit').length || 4,
          pickups.filter(p => p.status === 'Pending' || p.status === 'Scheduled').length || 6,
          pickups.filter(p => p.status === 'Cancelled').length || 2
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // Chart 3 Data: Regional Diversion Bar Chart
  const regionalWasteChartData = {
    labels: ['Lagos State', 'FCT Abuja', 'Rivers State', 'Oyo State', 'Kano State'],
    datasets: [
      {
        label: 'Waste Diverted from Landfills (Tons)',
        data: [18.5, 9.2, 7.8, 5.4, 3.9],
        backgroundColor: '#047857',
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' } } }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' } }
    }
  };

  const unreadNotifs = notificationsList.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      
      {/* TOP HEADER COMMAND NAV */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">EcoWaste Admin Command</h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Live Firestore DB
                </span>
              </div>
              <p className="text-xs text-slate-400">Federal Environmental Operations & Analytics</p>
            </div>
          </div>

          {/* Quick Universal Search & Regional Filters */}
          <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search users, pickups, reports, or IDs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-700 rounded-lg text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Actions & Notifications Bell */}
          <div className="flex items-center gap-3">
            
            {/* Region Filter Selector */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {NIGERIA_STATES.map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
              </select>
            </div>

            {/* Notifications Toggle */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                title="System Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      Live Activity Alerts
                    </h3>
                    <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notificationsList.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => markNotificationRead(notif.id)}
                        className={`pt-2.5 pb-2 text-xs flex gap-3 cursor-pointer rounded-lg p-1 transition-colors ${notif.read ? 'opacity-70 bg-transparent' : 'bg-emerald-50/60 font-semibold'}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-slate-300' : 'bg-emerald-500'}`} />
                        <div>
                          <p className="font-bold text-slate-900">{notif.title}</p>
                          <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold hidden sm:inline">{userProfile?.displayName || 'National Admin'}</span>
            </div>

          </div>

        </div>
      </header>

      {/* DASHBOARD CONTAINER WITH SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col md:flex-row gap-6">

        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Management Modules
            </div>

            {[
              { id: 'overview', label: 'Dashboard & Analytics', icon: Activity, count: null },
              { id: 'users', label: 'All Registered Users', icon: Users, count: usersList.length },
              { id: 'collectors', label: 'Collector Approvals', icon: ShieldCheck, count: pendingCollectors.length, alert: pendingCollectors.length > 0 },
              { id: 'pickups', label: 'Pickup Requests', icon: Truck, count: pickups.length },
              { id: 'reports', label: 'Illegal Dumping Alerts', icon: AlertTriangle, count: reports.length, alert: reports.some(r => r.severity === 'Critical') },
              { id: 'activities', label: 'Live System Logs', icon: FileText, count: activitiesFeed.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                    tab.alert 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : activeTab === tab.id 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Global Filters Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              Global Scope Filter
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Time Period</label>
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Time Records</option>
                  <option value="today">Today Only</option>
                  <option value="week">Past 7 Days</option>
                  <option value="month">Past 30 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State / Territory</label>
                <select 
                  value={selectedState} 
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  {NIGERIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City Hub</label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  {NIGERIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 space-y-6">

          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">National Operations Dashboard</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time waste collection, collector dispatch & EcoRewards ledger</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Filtered:</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-lg">
                    {selectedState} • {selectedCity}
                  </span>
                </div>
              </div>

              {/* 6 ANALYTICS STATS CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Total Users */}
                <Card className="p-5 border-l-4 border-l-blue-500 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalUsers}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {usersList.filter(u => u.role === 'Resident').length} Residents, {usersList.filter(u => u.role === 'Collector').length} Collectors
                  </p>
                </Card>

                {/* Total Pickups */}
                <Card className="p-5 border-l-4 border-l-emerald-500 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pickups</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalPickups}</p>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +24% volume this month
                  </p>
                </Card>

                {/* Completed Pickups */}
                <Card className="p-5 border-l-4 border-l-teal-500 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Pickups</span>
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.completedPickups}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {stats.totalPickups > 0 ? Math.round((stats.completedPickups / stats.totalPickups) * 100) : 0}% completion efficiency
                  </p>
                </Card>

                {/* Pending Pickups */}
                <Card className="p-5 border-l-4 border-l-amber-500 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Pickups</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-amber-600">{stats.pendingPickups}</p>
                  <p className="text-[11px] text-amber-700 font-semibold">Requires collector assignment</p>
                </Card>

                {/* Waste Collected */}
                <Card className="p-5 border-l-4 border-l-indigo-500 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waste Collected</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Scale className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.wasteCollectedKg.toLocaleString()} <span className="text-sm font-bold text-slate-500">kg</span></p>
                  <p className="text-[11px] text-indigo-600 font-bold">≈ {(stats.wasteCollectedKg / 1000).toFixed(2)} Metric Tons diverted</p>
                </Card>

                {/* Rewards Issued */}
                <Card className="p-5 border-l-4 border-l-yellow-500 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rewards Issued</span>
                    <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
                      <Coins className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalPointsIssued.toLocaleString()} <span className="text-xs font-bold text-amber-600">Pts</span></p>
                  <p className="text-[11px] text-slate-500 font-medium">≈ ₦{stats.nairaValueIssued.toLocaleString()} NGN value paid</p>
                </Card>

              </div>

              {/* CHART.JS VISUALIZATIONS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Waste Trend Line Chart */}
                <Card className="p-6 bg-white col-span-1 lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Waste Recovery & Recycling Trends</h3>
                      <p className="text-xs text-slate-500">Monthly recovery volumes across major recyclable streams in Nigeria</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                      Chart.js Active
                    </span>
                  </div>
                  <div className="h-64">
                    <Line data={wasteTrendChartData} options={chartOptions} />
                  </div>
                </Card>

                {/* Pickup Status Breakdown Doughnut */}
                <Card className="p-6 bg-white space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Pickup Status Ratio</h3>
                    <p className="text-xs text-slate-500">Current state distribution of active pickups</p>
                  </div>
                  <div className="h-56 relative flex items-center justify-center">
                    <Doughnut data={pickupStatusChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </Card>

              </div>

              {/* Regional Diversion Bar Chart */}
              <Card className="p-6 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Regional Waste Diversion by State</h3>
                    <p className="text-xs text-slate-500">Tonnage collected and processed through circular hubs across Nigerian states</p>
                  </div>
                </div>
                <div className="h-60">
                  <Bar data={regionalWasteChartData} options={chartOptions} />
                </div>
              </Card>

              {/* LIVE SYSTEM ACTIVITY FEED */}
              <Card className="p-6 bg-white space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    Live System Activity Logs
                  </h3>
                  <span className="text-xs font-bold text-slate-400">Auto-updating</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {activitiesFeed.slice(0, 6).map(act => (
                    <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{act.icon}</span>
                        <div>
                          <p className="font-bold text-slate-900">{act.action}</p>
                          <p className="text-[11px] text-slate-400">Initiated by <span className="font-semibold text-slate-700">{act.user}</span></p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-lg">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Registered Platform Users</h2>
                  <p className="text-xs text-slate-500">Manage Residents, Collectors, and Commercial Business Accounts</p>
                </div>

                {/* Role Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl text-xs font-bold flex-wrap">
                  {['All', 'Resident', 'Collector', 'Business', 'Admin'].map(role => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        userRoleFilter === role ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {role === 'All' ? 'All Users' : `${role}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table Card */}
              <Card className="bg-white overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      placeholder="Search user name, email, phone..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Showing {filteredUsers.length} Users
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] uppercase font-black text-slate-500">
                        <th className="p-3.5">User Details</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Location</th>
                        <th className="p-3.5">EcoPoints</th>
                        <th className="p-3.5">Recycled</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(usr => (
                        <tr key={usr.uid} className="hover:bg-slate-50/80 transition-colors">
                          
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-700">
                                {usr.displayName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{usr.displayName}</p>
                                <p className="text-[10px] text-slate-400">{usr.email} • {usr.phone}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              usr.role === 'Admin' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                              usr.role === 'Collector' ? 'bg-amber-100 text-amber-800' :
                              usr.role === 'Business' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {usr.role === 'Admin' ? '🛡️ Admin' : usr.role}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-semibold text-slate-700">{usr.city}, {usr.state}</span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-emerald-600">{usr.ecoPoints || 0} Pts</span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-800">{usr.totalKgRecycled || 0} kg</span>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {usr.role === 'Collector' && !usr.collectorApproved && (
                                <Button 
                                  size="sm" 
                                  variant="primary" 
                                  className="text-[10px] py-1 px-2"
                                  onClick={() => approveCollector(usr.uid, 'Approved')}
                                >
                                  Approve
                                </Button>
                              )}
                              <button 
                                onClick={() => setViewingUser(usr)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                                title="View User Details"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete user ${usr.displayName}?`)) {
                                    deleteUserAdmin(usr.uid);
                                  }
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

            </div>
          )}

          {/* TAB 3: COLLECTOR APPROVALS */}
          {activeTab === 'collectors' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Collector Verification Queue</h2>
                <p className="text-xs text-slate-500">Review and approve independent waste collectors & recycling logistics agents</p>
              </div>

              {pendingCollectors.length === 0 ? (
                <Card className="p-8 text-center bg-white space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">All Collector Applications Reviewed</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">There are currently no pending collector verification requests in the queue.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingCollectors.map(col => (
                    <Card key={col.uid} className="p-5 bg-white space-y-4 border-l-4 border-l-amber-500 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-full">
                            Pending Verification
                          </span>
                          <h3 className="text-base font-black text-slate-900 mt-2">{col.displayName}</h3>
                          <p className="text-xs text-slate-500">{col.email} • {col.phone}</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                          <UserCheck className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                        <p><span className="font-bold text-slate-500">Vehicle Type:</span> <span className="font-semibold text-slate-800">{col.vehicleType || 'Light Mini-Truck'}</span></p>
                        <p><span className="font-bold text-slate-500">Operating Zone:</span> <span className="font-semibold text-slate-800">{col.city}, {col.state}</span></p>
                        <p><span className="font-bold text-slate-500">Registered:</span> <span className="font-semibold text-slate-800">{new Date(col.createdAt).toLocaleDateString()}</span></p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          variant="primary" 
                          icon={Check} 
                          className="flex-1 justify-center text-xs py-2"
                          onClick={() => approveCollector(col.uid, 'Approved')}
                        >
                          Approve Collector
                        </Button>
                        <Button 
                          variant="secondary" 
                          icon={X} 
                          className="flex-1 justify-center text-xs py-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                          onClick={() => approveCollector(col.uid, 'Rejected')}
                        >
                          Reject Request
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: PICKUP REQUESTS MANAGEMENT */}
          {activeTab === 'pickups' && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pickup Requests Management</h2>
                  <p className="text-xs text-slate-500">Manage, assign collectors, update status, and track pick-ups</p>
                </div>

                {/* Pickup Status Filter */}
                <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl text-xs font-bold">
                  {['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setPickupStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pickupStatusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Card */}
              <Card className="bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] uppercase font-black text-slate-500">
                        <th className="p-3.5">Pickup ID & User</th>
                        <th className="p-3.5">Waste Stream</th>
                        <th className="p-3.5">Weight</th>
                        <th className="p-3.5">Address</th>
                        <th className="p-3.5">Collector</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPickups.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          <td className="p-3.5">
                            <p className="font-black text-slate-900">{p.id}</p>
                            <p className="text-[10px] text-slate-500">{p.userDisplayName || 'Resident'} • {p.userPhone}</p>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-800">{p.wasteType}</span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-emerald-600">{p.weightKg || p.estimatedWeightKg || 10} kg</span>
                          </td>

                          <td className="p-3.5">
                            <span className="text-slate-700 block max-w-xs truncate">{p.address}, {p.city}</span>
                          </td>

                          <td className="p-3.5">
                            {p.collectorName ? (
                              <span className="font-bold text-slate-800">{p.collectorName}</span>
                            ) : (
                              <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                Unassigned
                              </span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              p.status === 'Accepted' || p.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              p.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {p.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => setEditingPickup(p)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                title="Edit Pickup / Assign Collector"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Delete pickup request #${p.id}?`)) {
                                    deletePickupAdmin(p.id);
                                  }
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                                title="Delete Pickup"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

            </div>
          )}

          {/* TAB 5: ILLEGAL DUMPING REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Illegal Dumping Reports (Environmental Hotline)</h2>
                <p className="text-xs text-slate-500">Public reports of illegal hazardous waste dumping & enforcement response</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map(rep => (
                  <Card key={rep.id} className="p-5 bg-white space-y-3 shadow-sm border-l-4 border-l-rose-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full ${
                            rep.severity === 'Critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rep.severity} Severity
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">Ref #{rep.id}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 mt-2">{rep.title}</h3>
                        <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          {rep.location}, {rep.city}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                      <p><span className="font-bold text-slate-500">Current Status:</span> <span className="font-bold text-slate-900">{rep.status}</span></p>
                      <p><span className="font-bold text-slate-500">Action Notes:</span> <span className="text-slate-700">{rep.notes || 'None logged.'}</span></p>
                      <p><span className="font-bold text-slate-500">Reported On:</span> <span className="text-slate-700">{rep.reportedAt}</span></p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button 
                        onClick={() => setEditingReport(rep)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Update Response Status
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Resolve and archive report #${rep.id}?`)) {
                            deleteReportAdmin(rep.id);
                          }
                        }}
                        className="text-xs font-bold text-slate-400 hover:text-rose-600"
                      >
                        Archive Report
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

            </div>
          )}

          {/* TAB 6: LIVE SYSTEM LOGS */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Audit & Activity Stream</h2>
                <p className="text-xs text-slate-500">Complete immutable audit trail of actions taken across EcoWaste Nigeria</p>
              </div>

              <Card className="p-6 bg-white space-y-4">
                <div className="divide-y divide-slate-100">
                  {activitiesFeed.map(act => (
                    <div key={act.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{act.icon}</span>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{act.action}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Actor: <span className="font-semibold text-slate-800">{act.user}</span> • Ref ID #{act.id}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2.5 py-1 rounded-xl">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

        </main>

      </div>

      {/* MODAL: EDIT PICKUP REQUEST */}
      {editingPickup && (
        <Modal 
          isOpen={!!editingPickup} 
          onClose={() => setEditingPickup(null)} 
          title={`Manage Pickup #${editingPickup.id}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pickup Status
              </label>
              <select 
                value={editingPickup.status} 
                onChange={(e) => setEditingPickup(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Accepted">Accepted / In Transit</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assign Registered Collector
              </label>
              <select 
                value={editingPickup.collectorName || ''} 
                onChange={(e) => {
                  const selName = e.target.value;
                  const colObj = usersList.find(u => u.displayName === selName);
                  setEditingPickup(prev => ({
                    ...prev,
                    collectorName: selName,
                    collectorId: colObj?.uid || 'demo-collector-789',
                    collectorPhone: colObj?.phone || '+234 809 987 6543'
                  }));
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="">-- Select Collector --</option>
                {usersList.filter(u => u.role === 'Collector').map(c => (
                  <option key={c.uid} value={c.displayName}>{c.displayName} ({c.city})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Verified Weight (kg)
              </label>
              <input 
                type="number" 
                value={editingPickup.weightKg || editingPickup.estimatedWeightKg || 10} 
                onChange={(e) => setEditingPickup(prev => ({ ...prev, weightKg: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <Button 
              variant="primary" 
              className="w-full justify-center text-xs py-2.5"
              onClick={() => {
                updatePickupAdmin(editingPickup.id, editingPickup);
                setEditingPickup(null);
              }}
            >
              Save Changes to Firestore
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL: EDIT DUMPING REPORT */}
      {editingReport && (
        <Modal 
          isOpen={!!editingReport} 
          onClose={() => setEditingReport(null)} 
          title={`Update Response #${editingReport.id}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Action Status
              </label>
              <select 
                value={editingReport.status} 
                onChange={(e) => setEditingReport(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Received">Received</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Dispatched Clearance Unit">Dispatched Clearance Unit</option>
                <option value="Resolved">Resolved & Cleared</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Enforcement / Dispatch Notes
              </label>
              <textarea 
                rows={3} 
                value={editingReport.notes || ''} 
                onChange={(e) => setEditingReport(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Log notes about dispatched LAWMA / NESREA task teams..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>

            <Button 
              variant="primary" 
              className="w-full justify-center text-xs py-2.5"
              onClick={() => {
                updateReportStatus(editingReport.id, editingReport.status, editingReport.notes);
                setEditingReport(null);
              }}
            >
              Update Enforcement Status
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL: VIEW USER DETAILS */}
      {viewingUser && (
        <Modal 
          isOpen={!!viewingUser} 
          onClose={() => setViewingUser(null)} 
          title={`User Profile: ${viewingUser.displayName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <p><span className="font-bold text-slate-500">Email:</span> {viewingUser.email}</p>
              <p><span className="font-bold text-slate-500">Phone:</span> {viewingUser.phone || 'N/A'}</p>
              <p><span className="font-bold text-slate-500">Current Role:</span> <span className="font-extrabold text-emerald-700">{viewingUser.role}</span></p>
              <p><span className="font-bold text-slate-500">Location:</span> {viewingUser.address ? `${viewingUser.address}, ` : ''}{viewingUser.city}, {viewingUser.state}</p>
              <p><span className="font-bold text-slate-500">EcoPoints:</span> {viewingUser.ecoPoints || 0} Pts</p>
              <p><span className="font-bold text-slate-500">Total Recycled:</span> {viewingUser.totalKgRecycled || 0} kg</p>
            </div>

            <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider">
                🛡️ Assign / Change User Role
              </label>
              <div className="flex gap-2">
                <select
                  value={viewingUser.role}
                  onChange={(e) => {
                    const newR = e.target.value;
                    updateUserRoleAdmin(viewingUser.uid, newR);
                    setViewingUser(prev => ({ ...prev, role: newR }));
                  }}
                  className="flex-1 p-2 bg-white border border-purple-300 rounded-lg font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Resident">Resident</option>
                  <option value="Business">Business</option>
                  <option value="Collector">Collector</option>
                  <option value="Recycler">Recycler</option>
                  <option value="Admin">Admin (System Director)</option>
                </select>
                {viewingUser.role !== 'Admin' && (
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-purple-700 hover:bg-purple-800 text-white shrink-0 py-1 px-3 text-xs"
                    onClick={() => {
                      updateUserRoleAdmin(viewingUser.uid, 'Admin');
                      setViewingUser(prev => ({ ...prev, role: 'Admin' }));
                    }}
                  >
                    Promote to Admin
                  </Button>
                )}
              </div>
            </div>

            <Button 
              variant="secondary" 
              className="w-full justify-center text-xs py-2 text-rose-600 border-rose-200 hover:bg-rose-50"
              onClick={() => {
                if (confirm(`Delete user ${viewingUser.displayName}?`)) {
                  deleteUserAdmin(viewingUser.uid);
                  setViewingUser(null);
                }
              }}
            >
              Delete User Account
            </Button>
          </div>
        </Modal>
      )}

    </div>
  );
}
