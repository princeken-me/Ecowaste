import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';
import { Recycle, ShieldCheck, Target, Heart, Users, Globe, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1.5 rounded-full">
              About EcoWaste Nigeria
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Pioneering Nigeria’s Smart Circular Economy
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              We leverage digital logistics, doorstep truck scheduling, and financial incentive models to eliminate plastic pollution, e-waste hazards, and illegal dumpsites across Nigerian urban centers.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="space-y-4 p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To transform waste management in Nigeria from a logistical burden into a rewarding economic opportunity for every household, business, and community.
              </p>
            </Card>

            <Card className="space-y-4 p-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">UN SDG Alignment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Directly driving SDG 11 (Sustainable Cities), SDG 12 (Responsible Consumption & Production), and SDG 13 (Climate Action) across West Africa.
              </p>
            </Card>

            <Card className="space-y-4 p-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Municipal Partners</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Certified operating partners with LAWMA (Lagos State Waste Management Authority) and AEPB (Abuja Environmental Protection Board).
              </p>
            </Card>
          </div>

          {/* Impact Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-black">Empowering Over 30,000 Nigerian Citizens</h2>
              <p className="text-slate-300 text-sm">
                Through our EcoPoints reward program, households earn daily airtime top-ups and cash payouts by separating PET plastic bottles, aluminum, and old electronics at source.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-emerald-400">142T+</p>
                <p className="text-xs text-slate-400">Recycled Plastics</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-400">₦28M+</p>
                <p className="text-xs text-slate-400">Payouts to Citizens</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-400">450+</p>
                <p className="text-xs text-slate-400">Collector Agents</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-400">5 Cities</p>
                <p className="text-xs text-slate-400">Active Coverage</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">Ready to make a difference in your neighborhood?</h3>
            <Button size="lg" variant="primary" onClick={() => navigate('/register')} icon={ArrowRight}>
              Register as Household or Recycler
            </Button>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
