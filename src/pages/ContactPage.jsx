import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Support',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', category: 'General Support', message: '' });
  };

  const faqs = [
    {
      q: 'How does doorstep waste pickup work in Lagos or Abuja?',
      a: 'Log into your EcoWaste portal, choose your waste type (household, PET plastics, or e-waste), select your address and date. A certified collection truck is dispatched to weigh and pick up your items.'
    },
    {
      q: 'How do I cash out my EcoPoints into Nigerian Airtime or Bank Account?',
      a: 'Go to the EcoRewards Wallet tab on your Dashboard. Select your preference (MTN, Airtel, Glo Airtime or NUBAN Bank Payout to Kuda, Access, GTB), enter your number or account details, and click Redeem.'
    },
    {
      q: 'What types of waste are eligible for recycling rewards?',
      a: 'PET plastic beverage bottles, aluminum cans, cardboard/carton packaging, e-waste (old phones, laptops, monitors), and scrap metal yield EcoPoints.'
    },
    {
      q: 'Are EcoWaste trucks compliant with LAWMA and AEPB regulations?',
      a: 'Yes, EcoWaste Nigeria operates under strict partnership guidelines and licensing with municipal waste management bodies including LAWMA in Lagos State and AEPB in FCT Abuja.'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1.5 rounded-full">
              Get in Touch
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Contact EcoWaste Support & Operations
            </h1>
            <p className="text-slate-600 text-sm">
              Have questions about pickup scheduling, enterprise partnerships, or EcoPoints rewards?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <Card className="p-8 space-y-6">
                <h3 className="text-xl font-extrabold text-slate-900">Send Us a Direct Message</h3>

                {submitted && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Thank you! Your inquiry has been sent to our Lagos support desk.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Chisom Eze"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+234 809 123 4567"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="chisom@example.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                      >
                        <option>General Support</option>
                        <option>Pickup Scheduling Help</option>
                        <option>EcoRewards / Bank Payout</option>
                        <option>Commercial / Corporate Waste Contract</option>
                        <option>Collector Agent Application</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe your request in detail..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full justify-center" icon={Send}>
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Offices & Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              
              <Card className="space-y-4 p-6 bg-slate-900 text-white">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" /> Operational Headquarters
                </h3>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="border-b border-slate-800 pb-3">
                    <p className="font-extrabold text-white text-sm">Lagos Hub & Innovation Depot</p>
                    <p>14 Commercial Avenue, Yaba, Lagos State, Nigeria</p>
                  </div>

                  <div className="border-b border-slate-800 pb-3">
                    <p className="font-extrabold text-white text-sm">Abuja Regional Operations</p>
                    <p>Plot 402, Constitution Avenue, Central Business District, Abuja (FCT)</p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Phone className="w-4 h-4" /> Toll-Free Hotline: +234 800-ECOWASTE (+234 800 326 9278)
                    </p>
                    <p className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-emerald-400" /> Email: support@ecowaste.ng
                    </p>
                  </div>
                </div>
              </Card>

              {/* FAQ Section */}
              <Card className="space-y-4 p-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600" /> Frequently Asked Questions
                </h3>

                <div className="space-y-2">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full text-left p-3 text-xs font-bold text-slate-900 flex justify-between items-center hover:bg-slate-50 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeFaq === idx ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                      </button>
                      {activeFaq === idx && (
                        <div className="p-3 bg-slate-50 text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
