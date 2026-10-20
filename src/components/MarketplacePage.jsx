import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWaste } from '../context/WasteContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Tag, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Upload, 
  X, 
  Building, 
  User, 
  Factory, 
  CheckCircle2, 
  Coins,
  Scale,
  ExternalLink,
  Info
} from 'lucide-react';

export default function MarketplacePage() {
  const { listings, createListing } = useWaste();
  const { userProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contactSellerModal, setContactSellerModal] = useState(null);
  const [selectedListingDetail, setSelectedListingDetail] = useState(null);

  // New Listing Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plastics',
    quantity: '',
    priceNaira: '',
    location: '',
    city: 'Lagos',
    state: 'Lagos State',
    description: '',
    phone: userProfile?.phone || ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Seller Contact message state
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const categories = ['All', 'Plastics', 'Metals', 'E-Waste', 'Paper & Packaging', 'Hazardous & Batteries'];
  const cities = ['All', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Kano'];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createListing(formData, photoFile);
      setSubmitting(false);
      setSuccessMsg('Listing posted successfully! You earned +75 EcoPoints bonus 🎉');
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setSuccessMsg('');
        setFormData({
          title: '',
          category: 'Plastics',
          quantity: '',
          priceNaira: '',
          location: '',
          city: 'Lagos',
          state: 'Lagos State',
          description: '',
          phone: userProfile?.phone || ''
        });
        setPhotoFile(null);
        setPhotoPreview(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || item.city === selectedCity;
    const matchesQuery = 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesQuery;
  });

  const getSellerBadge = (type) => {
    switch (type) {
      case 'Business':
        return { label: 'Verified Business', bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: Building };
      case 'Collector':
        return { label: 'Licensed Collector', bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: Factory };
      case 'Recycler':
        return { label: 'Recycling Plant', bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: Factory };
      default:
        return { label: 'Verified Resident', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: User };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Eco-Marketplace Nigeria
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Recycling Materials Exchange
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Connect directly with Nigerian residents, businesses, scrap aggregators, and certified recycling plants to buy or sell bulk recyclable waste.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            List Recyclable Bulk (+75 Pts)
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search materials (e.g. PET bottles, Aluminium, Lagos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-emerald-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Nigerian Cities' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Listings */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No recyclable listings found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or city filters, or be the first to post recyclable material for sale in this category!
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedCity('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => {
            const BadgeIcon = getSellerBadge(item.sellerType).icon;
            const badgeStyle = getSellerBadge(item.sellerType);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Item Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageURL}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                      {item.category}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${badgeStyle.bg}`}>
                      <BadgeIcon className="w-3 h-3" /> {badgeStyle.label}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-md">
                    ₦{item.priceNaira?.toLocaleString()}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Quantity</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <Scale className="w-3.5 h-3.5 text-emerald-600" /> {item.quantity}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Location</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {item.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seller Info & Action */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                        {item.sellerName?.charAt(0) || 'S'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.sellerName}</p>
                        <p className="text-[10px] text-slate-400">{item.city}, {item.state}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setContactSellerModal(item)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  +75 EcoPoints Bonus
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-2">Post Recyclable Bulk Listing</h2>
                <p className="text-xs text-slate-500 mt-1">
                  List your recyclable materials for scrap collectors, factories, and registered recyclers across Nigeria.
                </p>
              </div>

              {successMsg ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-extrabold text-base">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Listing Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sorted PET Clear Plastic Bottles (500 kg)"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Material Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                      >
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Quantity (kg / Tons / Units) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1.5 Tons or 500 kg"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Asking Price (₦ Naira) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 150000"
                        value={formData.priceNaira}
                        onChange={(e) => setFormData({ ...formData, priceNaira: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number for Inquiries *</label>
                      <input
                        type="text"
                        required
                        placeholder="+234 803 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pickup Address & Area *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Plot 15 Awolowo Road, Ikoyi"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City *</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value, state: `${e.target.value} State` })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        {cities.filter(c => c !== 'All').map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Upload Photo of Material</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 relative cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {photoPreview ? (
                        <div className="relative h-28 mx-auto w-40 rounded-xl overflow-hidden">
                          <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="py-2">
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <p className="font-bold text-slate-600 text-xs">Click to upload photo</p>
                          <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description / Condition Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Specify material cleanliness, bale density, or loading access details..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      {submitting ? 'Publishing to Firestore...' : 'Publish Listing & Claim 75 Points'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTACT SELLER MODAL */}
      <AnimatePresence>
        {contactSellerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => { setContactSellerModal(null); setContactSent(false); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                  {contactSellerModal.sellerName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{contactSellerModal.sellerName}</h3>
                  <p className="text-xs text-slate-500">{contactSellerModal.sellerType} • {contactSellerModal.city}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-800">{contactSellerModal.title}</p>
                <p className="text-slate-500">Asking Price: <span className="font-extrabold text-emerald-700">₦{contactSellerModal.priceNaira?.toLocaleString()}</span></p>
                <p className="text-slate-500">Quantity: <span className="font-bold text-slate-700">{contactSellerModal.quantity}</span></p>
              </div>

              {contactSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Message Sent to Seller!</p>
                  <p className="text-xs text-emerald-700">
                    The seller has been notified via EcoWaste SMS dispatch. They will call you back shortly at your registered line.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 text-xs mb-1">Your Offer / Inquiry Message</label>
                    <textarea
                      rows={3}
                      placeholder={`Hi ${contactSellerModal.sellerName}, I am interested in buying your ${contactSellerModal.title}. Can we arrange inspection?`}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${contactSellerModal.sellerPhone || '+2348031234567'}`}
                      className="py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800"
                    >
                      <Phone className="w-4 h-4" /> Call Seller
                    </a>

                    <button
                      onClick={() => setContactSent(true)}
                      className="py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500"
                    >
                      <MessageSquare className="w-4 h-4" /> Send Offer
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
