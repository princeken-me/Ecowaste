import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { Recycle, Menu, X, User, ChevronRight, Leaf, ShieldCheck, PhoneCall, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact & FAQ', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Emergency / Hotline Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> LAWMA & AEPB Certified Operational Partner
            </span>
            <span className="text-slate-500">|</span>
            <span>Serving Lagos, Abuja, Port Harcourt, Kano & Ibadan</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+2348003269278" className="hover:text-emerald-400 flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3 h-3 text-emerald-400" /> Hotline: +234 800-ECOWASTE
            </a>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 group-hover:bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 transition-all duration-300 transform group-hover:scale-105">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
              EcoWaste <span className="text-emerald-600">NG</span>
              <Leaf className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Nigeria Waste & Recycling</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {currentUser && (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive('/dashboard') ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/recycle"
                className={`text-sm font-semibold transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/recycle') ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Recycle className="w-4 h-4 text-emerald-600" />
                Recycle Waste
              </Link>
              {userProfile?.role === 'Admin' && (
                <Link
                  to="/admin"
                  className={`text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive('/admin') ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Admin Portal
                </Link>
              )}
              <Link
                to="/profile"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive('/profile') ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 transition-all">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    userProfile?.displayName?.charAt(0) || 'U'
                  )}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {userProfile?.displayName?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold leading-tight">
                    {userProfile?.role || 'Resident'}
                  </p>
                </div>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                icon={LogOut}
                className="text-slate-600 hover:text-rose-600 hover:border-rose-300"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <Link to="/dashboard">
              <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                Dashboard
              </span>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                {userProfile?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-base font-semibold transition-colors flex items-center gap-2 ${
                      isActive('/admin')
                        ? 'bg-purple-50 text-purple-800 font-bold'
                        : 'text-purple-700 hover:bg-purple-50'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    Admin Portal
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                    isActive('/profile')
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Profile & Settings
                </Link>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                      {userProfile?.photoURL ? (
                        <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        userProfile?.displayName?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{userProfile?.displayName || 'User'}</p>
                      <p className="text-xs text-emerald-700 font-semibold">{userProfile?.role || 'Resident'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                    {userProfile?.ecoPoints || 0} pts
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/profile');
                  }}
                  icon={Settings}
                >
                  My Profile
                </Button>
                <Button
                  variant="dark"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  icon={LogOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
