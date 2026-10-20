import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Leaf, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
                EcoWaste <span className="text-emerald-400">Nigeria</span>
                <Leaf className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Nigeria’s premier smart waste collection & circular economy platform. Connecting households, businesses, and certified recyclers for cleaner, healthier Nigerian cities.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" /> LAWMA & AEPB Compliant
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                Lagos • Abuja • Port Harcourt
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us & Impact</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Schedule Waste Pickup</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support & FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Eco Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Eco Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-emerald-400 cursor-pointer">Household Waste Pickup</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">PET & Plastic Recycling</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">E-Waste Safe Disposal</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">EcoRewards Airtime Payout</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Commercial Waste Management</span></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Nigeria HQ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>14 Commercial Avenue, Yaba, Lagos State</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+234 800-ECOWASTE (+234 800 326 9278)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@ecowaste.ng</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs text-slate-400 mb-2 font-medium">Get Eco Rewards Updates</p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to EcoWaste Nigeria Newsletter!'); }} className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Enter email..."
                  required
                  className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 w-full"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-2 text-xs font-bold transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EcoWaste Nigeria Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">LAWMA/AEPB Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
