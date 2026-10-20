import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useWaste } from '../context/WasteContext';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { 
  Recycle, 
  Upload, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Scale, 
  Trash2, 
  Zap, 
  Info,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Plastic', name: 'Plastic', points: '5 pts/kg', icon: '🥤', desc: 'PET bottles, containers, HDPE packaging' },
  { id: 'Paper', name: 'Paper', points: '4 pts/kg', icon: '📄', desc: 'Office paper, newspaper, books' },
  { id: 'Cardboard', name: 'Cardboard', points: '4 pts/kg', icon: '📦', desc: 'Corrugated cartons & packaging boxes' },
  { id: 'Glass', name: 'Glass', points: '6 pts/kg', icon: '🍾', desc: 'Bottles, jars, glass containers' },
  { id: 'Metal', name: 'Metal', points: '10 pts/kg', icon: '⚙️', desc: 'Iron, steel, copper scrap & food cans' },
  { id: 'Aluminum Cans', name: 'Aluminum Cans', points: '12 pts/kg', icon: '🥫', desc: 'Beverage cans & foil scrap' },
  { id: 'Electronics (E-Waste)', name: 'Electronics (E-Waste)', points: '20 pts/item', icon: '💻', desc: 'Computers, circuit boards, cables' },
  { id: 'Batteries', name: 'Batteries', points: '15 pts/item', icon: '🔋', desc: 'Inverter batteries, lithium cells' },
  { id: 'Organic Waste', name: 'Organic Waste', points: '3 pts/kg', icon: '🍏', desc: 'Compostable food waste & farm scrap' },
  { id: 'Textiles', name: 'Textiles', points: '5 pts/kg', icon: '👕', desc: 'Clothing scrap, fabric offcuts' },
  { id: 'Rubber', name: 'Rubber', points: '6 pts/kg', icon: '🛞', desc: 'Tyres, rubber mats & conveyor scrap' },
  { id: 'Used Cooking Oil', name: 'Used Cooking Oil', points: '8 pts/L', icon: '🛢️', desc: 'Vegetable & palm oil residue' }
];

export default function RecycleWastePage() {
  const navigate = useNavigate();
  const { userProfile, currentUser } = useAuth();
  const { submitRecyclingRequest, analyzeWasteImage } = useWaste();

  const [form, setForm] = useState({
    category: 'Plastic',
    wasteType: 'PET Clear Plastic Bottles',
    estimatedWeightKg: '15',
    quantity: '15 kg',
    pickupAddress: userProfile?.address || '14 Admiralty Way, Lekki Phase 1',
    landmark: 'Near Main Gate',
    preferredPickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredPickupTime: '10:00 AM - 12:00 PM',
    description: 'Rinsed clean plastic bottles packed in transparent sacks.',
    contactPhone: userProfile?.phone || '+234 803 123 4567',
    city: userProfile?.city || 'Lagos',
    state: userProfile?.state || 'Lagos State',
    gpsLocation: null
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle image upload and trigger AI analysis
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      alert('You can upload up to 5 images maximum.');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Generate previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);

    // Trigger simulated AI Analysis
    runAiScan(form.category);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const runAiScan = (category) => {
    setIsAiScanning(true);
    setTimeout(() => {
      const result = analyzeWasteImage(category);
      setAiResult(result);
      setIsAiScanning(false);
    }, 1200);
  };

  const applyAiValues = () => {
    if (!aiResult) return;
    setForm(prev => ({
      ...prev,
      wasteType: aiResult.detectedType,
      estimatedWeightKg: aiResult.estimatedWeightKg.toString(),
      quantity: `${aiResult.estimatedWeightKg} kg`,
      aiConfidence: aiResult.confidence,
      aiDetectedType: aiResult.detectedType
    }));
  };

  const detectGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setForm(prev => ({
          ...prev,
          gpsLocation: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
        }));
      },
      (err) => {
        setIsLocating(false);
        console.warn("GPS error:", err);
        setForm(prev => ({ ...prev, gpsLocation: '6.4531, 3.4721 (Lagos Central)' }));
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pickupAddress || !form.contactPhone) {
      setErrorMsg('Please enter a valid pickup address and contact phone number.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const req = await submitRecyclingRequest(form, images);
      setSubmittedRequest(req);
    } catch (err) {
      console.error("Submit recycling error:", err);
      setErrorMsg(err.message || 'Failed to submit recycling request.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCatObj = CATEGORIES.find(c => c.id === form.category);

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
            <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
                  <Recycle className="w-3.5 h-3.5" /> EcoWaste Recycling Module
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Recycle Waste & Earn EcoPoints
                </h1>
                <p className="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                  Submit recyclable materials for scheduled collection or sell on the Eco Marketplace. Powered by AI automated classification and instant point calculation.
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-xs text-slate-300">Reward Multiplier</span>
                <span className="text-xl font-extrabold text-emerald-300 flex items-center gap-1">
                  <Award className="w-5 h-5" /> Up to 20 pts/kg
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submittedRequest ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 text-center space-y-6 max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900">Recycling Request Submitted!</h2>
                  <p className="text-slate-600 mt-2 text-sm">
                    Request <span className="font-mono font-bold text-emerald-600">#{submittedRequest.id}</span> has been logged into Firestore. An Eco-Agent collector will be assigned for pickup on {submittedRequest.pickupDate}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-left space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Category:</span>
                    <span className="font-bold text-slate-900">{submittedRequest.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Estimated Weight:</span>
                    <span className="font-bold text-slate-900">{submittedRequest.estimatedWeightKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Est. EcoPoints Award:</span>
                    <span className="font-extrabold text-emerald-700">+{submittedRequest.pointsEarned} Points</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    onClick={() => setSubmittedRequest(null)}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Submit Another Request
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    View in Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Form */}
                <div className="lg:col-span-8 space-y-6">
                  <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6">
                    
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                        <span>Select Waste Category <span className="text-red-500">*</span></span>
                        {selectedCatObj && (
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Rate: {selectedCatObj.points}
                          </span>
                        )}
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {CATEGORIES.map(cat => (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => {
                              setForm(prev => ({ ...prev, category: cat.id, wasteType: `${cat.name} Recyclables` }));
                              runAiScan(cat.id);
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                              form.category === cat.id
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/50'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-2xl">{cat.icon}</span>
                              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                form.category === cat.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {cat.points}
                              </span>
                            </div>
                            <div className="mt-3">
                              <h4 className="text-xs font-bold truncate">{cat.name}</h4>
                              <p className={`text-[10px] truncate ${form.category === cat.id ? 'text-emerald-100' : 'text-slate-500'}`}>
                                {cat.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Weight & Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Estimated Weight (kg) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Scale className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="number"
                            min="1"
                            max="5000"
                            required
                            value={form.estimatedWeightKg}
                            onChange={(e) => setForm(prev => ({ ...prev, estimatedWeightKg: e.target.value, quantity: `${e.target.value} kg` }))}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-sm"
                            placeholder="e.g. 15"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Quantity / Volume Description
                        </label>
                        <input
                          type="text"
                          value={form.quantity}
                          onChange={(e) => setForm(prev => ({ ...prev, quantity: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900 text-sm"
                          placeholder="e.g. 3 large sacks or 24 bottles"
                        />
                      </div>
                    </div>

                    {/* Pickup Address & Landmark */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Pickup Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            required
                            value={form.pickupAddress}
                            onChange={(e) => setForm(prev => ({ ...prev, pickupAddress: e.target.value }))}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900 text-sm"
                            placeholder="House / Office Street address"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Nearest Landmark
                          </label>
                          <input
                            type="text"
                            value={form.landmark}
                            onChange={(e) => setForm(prev => ({ ...prev, landmark: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            placeholder="e.g. Opposite Mobil station"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            GPS Coordinates (Optional)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={form.gpsLocation || ''}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                              placeholder="Auto-detected GPS"
                            />
                            <button
                              type="button"
                              onClick={detectGpsLocation}
                              disabled={isLocating}
                              className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1 hover:bg-slate-800 shrink-0"
                            >
                              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
                              GPS
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preferred Date & Time Slot */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Preferred Pickup Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={form.preferredPickupDate}
                            onChange={(e) => setForm(prev => ({ ...prev, preferredPickupDate: e.target.value }))}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Preferred Pickup Time
                        </label>
                        <div className="relative">
                          <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                          <select
                            value={form.preferredPickupTime}
                            onChange={(e) => setForm(prev => ({ ...prev, preferredPickupTime: e.target.value }))}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-white"
                          >
                            <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                            <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                            <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                            <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Image Upload up to 5 */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Upload Photos (Up to 5)</span>
                        <span className="text-slate-400">{images.length}/5 photos</span>
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {imagePreviews.map((src, idx) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                            <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {images.length < 5 && (
                          <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30 aspect-square">
                            <Upload className="w-6 h-6 text-slate-400 mb-1" />
                            <span className="text-xs font-bold text-slate-600">Add Photo</span>
                            <span className="text-[10px] text-slate-400">PNG, JPG</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Description & Contact Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Contact Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="tel"
                            required
                            value={form.contactPhone}
                            onChange={(e) => setForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-sm"
                            placeholder="+234 803 123 4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Item Description & Sorting Notes
                        </label>
                        <input
                          type="text"
                          value={form.description}
                          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          placeholder="e.g. Transparent PET bottles, caps removed"
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 text-base font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-600/25"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Saving to Firestore...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Submit Recycling Request <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </div>

                {/* AI Waste Classification Card */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-700/80 sticky top-24">
                    
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-white">AI Waste Classifier</h3>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Gemini AI
                      </span>
                    </div>

                    {isAiScanning ? (
                      <div className="py-12 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                        <p className="text-xs font-bold text-slate-300">Scanning waste material features...</p>
                        <p className="text-[10px] text-slate-400">Analyzing density, transparency & material code</p>
                      </div>
                    ) : aiResult ? (
                      <div className="mt-4 space-y-4">
                        
                        {/* Detected Waste Type */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Detected Waste Type</span>
                          <p className="text-sm font-black text-emerald-300 mt-0.5">{aiResult.detectedType}</p>
                        </div>

                        {/* Recyclability & Confidence */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-[10px] font-bold text-slate-400 block">Status</span>
                            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Recyclable
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-[10px] font-bold text-slate-400 block">AI Confidence</span>
                            <span className="text-xs font-extrabold text-amber-300 mt-1 block">
                              {aiResult.confidence}% Match
                            </span>
                          </div>
                        </div>

                        {/* Confidence Progress Bar */}
                        <div>
                          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${aiResult.confidence}%` }} 
                            />
                          </div>
                        </div>

                        {/* Recommended Disposal Method */}
                        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs space-y-1">
                          <span className="font-bold text-emerald-300 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" /> Recommended Disposal Method
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {aiResult.recommendedDisposal}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={applyAiValues}
                          className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Auto-Fill Form with AI Detections
                        </button>
                      </div>
                    ) : (
                      <div className="py-8 text-center space-y-2">
                        <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                        <p className="text-xs text-slate-300 font-semibold">Upload photo or select category to run instant AI material classification.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
