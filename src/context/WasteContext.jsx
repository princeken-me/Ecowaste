import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const WasteContext = createContext();

export function useWaste() {
  return useContext(WasteContext);
}

const INITIAL_PICKUPS = [
  {
    id: 'ECO-NG-9041',
    userId: 'demo-resident-123',
    userDisplayName: 'Tunde Adebayo',
    userPhone: '+234 803 123 4567',
    wasteType: 'PET Plastics & Clear Bottles',
    category: 'recyclable',
    weightKg: 18,
    estimatedWeightKg: 18,
    pickupDate: '2026-07-30',
    timeSlot: '10:00 AM - 12:00 PM',
    address: '24 Awolowo Road, Ikoyi, Lagos',
    city: 'Lagos',
    state: 'Lagos State',
    status: 'Pending',
    collectorId: null,
    collectorName: null,
    collectorPhone: null,
    rewardPoints: 180,
    costNaira: 0,
    createdAt: new Date().toISOString(),
    notes: 'Please call before arriving. Sorted clear plastic bottles.',
    photoURL: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80',
    coordinates: { x: 42, y: 35 }
  },
  {
    id: 'ECO-NG-8832',
    userId: 'demo-business-456',
    userDisplayName: 'Radisson Blu Lekki',
    userPhone: '+234 809 111 2233',
    wasteType: 'E-Waste (Old Monitors & Computer Power Cables)',
    category: 'e-waste',
    weightKg: 25,
    estimatedWeightKg: 25,
    pickupDate: '2026-07-29',
    timeSlot: '02:00 PM - 04:00 PM',
    address: 'Plot 10 Ozumba Mbadiwe Ave, Victoria Island, Lagos',
    city: 'Lagos',
    state: 'Lagos State',
    status: 'Accepted',
    collectorId: 'demo-collector-789',
    collectorName: 'Chidi Okonkwo (Eco-Agent)',
    collectorPhone: '+234 809 987 6543',
    rewardPoints: 500,
    costNaira: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    notes: '2 desktop towers and circuit boards in loading bay.',
    photoURL: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
    coordinates: { x: 62, y: 48 }
  },
  {
    id: 'ECO-NG-8120',
    userId: 'demo-resident-123',
    userDisplayName: 'Tunde Adebayo',
    userPhone: '+234 803 123 4567',
    wasteType: 'Aluminium Beverage Cans',
    category: 'recyclable',
    weightKg: 35,
    estimatedWeightKg: 35,
    pickupDate: '2026-07-20',
    timeSlot: '08:00 AM - 10:00 AM',
    address: '14 Admiralty Way, Lekki Phase 1, Lagos',
    city: 'Lagos',
    state: 'Lagos State',
    status: 'Completed',
    collectorId: 'demo-collector-789',
    collectorName: 'Chidi Okonkwo (Eco-Agent)',
    collectorPhone: '+234 809 987 6543',
    rewardPoints: 350,
    costNaira: 0,
    createdAt: '2026-07-19T11:00:00Z',
    notes: 'Green bin by the main front gate.',
    photoURL: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=400&q=80',
    coordinates: { x: 75, y: 30 }
  }
];

const INITIAL_LISTINGS = [
  {
    id: 'MKT-101',
    title: 'Baled Clear PET Plastic Bottles (2.5 Tons)',
    category: 'Plastics',
    quantity: '2,500 kg',
    quantityValue: 2500,
    priceNaira: 350000,
    sellerId: 'demo-business-456',
    sellerName: 'Radisson Blu Recycling Unit',
    sellerPhone: '+234 809 111 2233',
    sellerType: 'Business',
    location: 'Victoria Island, Lagos',
    city: 'Lagos',
    state: 'Lagos State',
    imageURL: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    description: 'Clean, sorted and baled transparent PET drinking bottles. Ready for immediate pickup with forklift loading bay access.',
    status: 'Active',
    createdAt: '2026-07-28T14:00:00Z'
  },
  {
    id: 'MKT-102',
    title: 'High-Purity Crushed Aluminium Beverage Cans',
    category: 'Metals',
    quantity: '800 kg',
    quantityValue: 800,
    priceNaira: 280000,
    sellerId: 'demo-collector-789',
    sellerName: 'Chidi Okonkwo (Eco-Agent Hub)',
    sellerPhone: '+234 809 987 6543',
    sellerType: 'Collector',
    location: 'Trans-Amadi Industrial Layout, Port Harcourt',
    city: 'Port Harcourt',
    state: 'Rivers State',
    imageURL: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    description: 'Compacted aluminum cans batch. Magnets passed, zero ferrous contamination. Ideal for smelting foundries.',
    status: 'Active',
    createdAt: '2026-07-27T09:30:00Z'
  },
  {
    id: 'MKT-103',
    title: 'Sorted Computer E-Waste & Motherboards',
    category: 'E-Waste',
    quantity: '150 Units',
    quantityValue: 150,
    priceNaira: 450000,
    sellerId: 'demo-business-789',
    sellerName: 'Ikeja Tech Recyclers',
    sellerPhone: '+234 802 333 4455',
    sellerType: 'Business',
    location: 'Computer Village, Ikeja, Lagos',
    city: 'Lagos',
    state: 'Lagos State',
    imageURL: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    description: 'Decommissioned server power boards, RAM sticks, and CPU chips rich in precious metals for urban mining.',
    status: 'Active',
    createdAt: '2026-07-26T16:20:00Z'
  },
  {
    id: 'MKT-104',
    title: 'Clean Heavy Corrugated Packaging Boxes',
    category: 'Paper & Packaging',
    quantity: '1.2 Tons',
    quantityValue: 1200,
    priceNaira: 95000,
    sellerId: 'demo-resident-123',
    sellerName: 'Tunde Adebayo',
    sellerPhone: '+234 803 123 4567',
    sellerType: 'Resident',
    location: 'Central Business District, Abuja',
    city: 'Abuja',
    state: 'FCT Abuja',
    imageURL: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    description: 'Flattened carton boxes from warehouse shipments. Dry, bundled, and stored indoors.',
    status: 'Active',
    createdAt: '2026-07-25T11:15:00Z'
  },
  {
    id: 'MKT-105',
    title: 'Used Inverter Lead-Acid Batteries (40 Units)',
    category: 'Hazardous & Batteries',
    quantity: '40 Batteries',
    quantityValue: 40,
    priceNaira: 220000,
    sellerId: 'demo-business-999',
    sellerName: 'Oyo Solar & Energy Hub',
    sellerPhone: '+234 813 555 6677',
    sellerType: 'Business',
    location: 'Bodija Market, Ibadan',
    city: 'Ibadan',
    state: 'Oyo State',
    imageURL: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    description: 'Discharged 200Ah solar batteries suitable for lead smelting and battery refurbishment hubs.',
    status: 'Active',
    createdAt: '2026-07-24T10:00:00Z'
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-901',
    type: 'Pickup Completion Reward',
    description: 'Earned 350 EcoPoints for 35kg Aluminium Cans collection',
    points: 350,
    nairaValue: 1750,
    category: 'pickup',
    date: '2026-07-20T11:30:00Z'
  },
  {
    id: 'TXN-880',
    type: 'Airtime Cashout (MTN)',
    description: 'Redeemed 200 EcoPoints for ₦1,000 Airtime top-up',
    points: -200,
    nairaValue: -1000,
    category: 'redemption',
    date: '2026-07-22T14:10:00Z'
  },
  {
    id: 'TXN-750',
    type: 'Marketplace Listing Bonus',
    description: 'Earned 75 EcoPoints for posting PET bottle listing',
    points: 75,
    nairaValue: 375,
    category: 'marketplace',
    date: '2026-07-25T09:00:00Z'
  },
  {
    id: 'TXN-710',
    type: 'Friend Referral Bonus',
    description: 'Referral bonus from resident registration (#ECO-REF-8821)',
    points: 150,
    nairaValue: 750,
    category: 'referral',
    date: '2026-07-27T16:45:00Z'
  }
];

const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Chidi Okonkwo (Eco-Agent)', city: 'Port Harcourt', kgRecycled: 2450, ecoPoints: 4900, badge: '👑 Master Recycler', role: 'Collector' },
  { rank: 2, name: 'Radisson Blu Lekki', city: 'Lagos', kgRecycled: 1890, ecoPoints: 3780, badge: '🏢 Corporate Eco-Star', role: 'Business' },
  { rank: 3, name: 'Tunde Adebayo', city: 'Lagos', kgRecycled: 1280, ecoPoints: 2560, badge: '🌟 Community Champion', role: 'Resident' },
  { rank: 4, name: 'Amina Bello', city: 'Abuja', kgRecycled: 950, ecoPoints: 1900, badge: '⚡ Green Pioneer', role: 'Resident' },
  { rank: 5, name: 'Oyo Circular Hub', city: 'Ibadan', kgRecycled: 820, ecoPoints: 1640, badge: '♻️ Zero Waste Pro', role: 'Business' },
  { rank: 6, name: 'Emeka Nwosu', city: 'Enugu', kgRecycled: 670, ecoPoints: 1340, badge: '🌱 Eco Warrior', role: 'Resident' },
];

const INITIAL_REPORTS = [
  {
    id: 'REP-101',
    title: 'Overflowing Plastic Waste at Bus Stop',
    location: 'Oshodi Interchange, Lagos',
    city: 'Lagos',
    state: 'Lagos State',
    status: 'Under Investigation',
    severity: 'High',
    reportedAt: '2026-07-27',
    upvotes: 24,
    notes: 'Municipal LAWMA team notified for dispatch.',
    reportedBy: 'Tunde Adebayo'
  },
  {
    id: 'REP-102',
    title: 'Illegal Chemical Container Dumping',
    location: 'Trans-Amadi Industrial Layout, Port Harcourt',
    city: 'Port Harcourt',
    state: 'Rivers State',
    status: 'Dispatched Clearance Unit',
    severity: 'Critical',
    reportedAt: '2026-07-26',
    upvotes: 41,
    notes: 'NESREA regional hazmat team en route.',
    reportedBy: 'Chidi Okonkwo'
  },
  {
    id: 'REP-103',
    title: 'Tyre & Electronic Waste Heap on Highway',
    location: 'Ibadan Expressway, Bodija',
    city: 'Ibadan',
    state: 'Oyo State',
    status: 'Received',
    severity: 'Medium',
    reportedAt: '2026-07-28',
    upvotes: 12,
    notes: 'Pending inspection team allocation.',
    reportedBy: 'Amina Bello'
  }
];

const INITIAL_USERS = [
  {
    uid: 'demo-resident-123',
    displayName: 'Tunde Adebayo',
    email: 'tunde.adebayo@gmail.com',
    role: 'Resident',
    phone: '+234 803 123 4567',
    city: 'Lagos',
    state: 'Lagos State',
    address: '24 Awolowo Road, Ikoyi',
    ecoPoints: 450,
    totalKgRecycled: 128,
    createdAt: '2026-06-15T10:00:00Z',
    status: 'Active'
  },
  {
    uid: 'demo-business-456',
    displayName: 'Radisson Blu Lekki',
    email: 'eco.facility@radisson.ng',
    role: 'Business',
    phone: '+234 809 111 2233',
    city: 'Lagos',
    state: 'Lagos State',
    address: 'Plot 10 Ozumba Mbadiwe Ave, Victoria Island',
    ecoPoints: 1200,
    totalKgRecycled: 1890,
    createdAt: '2026-05-20T14:30:00Z',
    status: 'Active'
  },
  {
    uid: 'demo-collector-789',
    displayName: 'Chidi Okonkwo (Eco-Agent)',
    email: 'chidi.collector@ecowaste.ng',
    role: 'Collector',
    phone: '+234 809 987 6543',
    city: 'Port Harcourt',
    state: 'Rivers State',
    address: '45 Aba Road, Garrison',
    ecoPoints: 4900,
    totalKgRecycled: 2450,
    approvalStatus: 'Approved',
    collectorApproved: true,
    vehicleType: 'Tricycle / Keke Cargo',
    createdAt: '2026-04-10T08:15:00Z',
    status: 'Active'
  },
  {
    uid: 'demo-collector-101',
    displayName: 'Gabriel Nnamdi',
    email: 'gabriel.n@greenlogistics.ng',
    role: 'Collector',
    phone: '+234 812 345 6789',
    city: 'Lagos',
    state: 'Lagos State',
    address: '18 Allen Avenue, Ikeja',
    ecoPoints: 150,
    totalKgRecycled: 80,
    approvalStatus: 'Pending',
    collectorApproved: false,
    vehicleType: 'Light Mini-Truck (2 Tons)',
    createdAt: '2026-07-28T09:20:00Z',
    status: 'Active'
  },
  {
    uid: 'demo-collector-102',
    displayName: 'Fatimah Usman',
    email: 'fatimah.usman@kanorecycles.org',
    role: 'Collector',
    phone: '+234 806 789 0123',
    city: 'Kano',
    state: 'Kano State',
    address: 'Sabon Gari Industrial Zone',
    ecoPoints: 0,
    totalKgRecycled: 0,
    approvalStatus: 'Pending',
    collectorApproved: false,
    vehicleType: 'Cargo Van',
    createdAt: '2026-07-29T11:00:00Z',
    status: 'Active'
  },
  {
    uid: 'demo-resident-104',
    displayName: 'Amina Bello',
    email: 'amina.bello@fct.gov.ng',
    role: 'Resident',
    phone: '+234 802 222 3344',
    city: 'Abuja',
    state: 'FCT Abuja',
    address: 'Plot 402 Constitution Ave, Central Business District',
    ecoPoints: 1900,
    totalKgRecycled: 950,
    createdAt: '2026-06-01T12:00:00Z',
    status: 'Active'
  },
  {
    uid: 'demo-business-105',
    displayName: 'Oyo Circular Economy Hub',
    email: 'contact@oyocircular.org',
    role: 'Business',
    phone: '+234 805 555 6677',
    city: 'Ibadan',
    state: 'Oyo State',
    address: 'Bodija Market Ring Road',
    ecoPoints: 1640,
    totalKgRecycled: 820,
    createdAt: '2026-05-10T16:00:00Z',
    status: 'Active'
  },
  {
    uid: 'demo-admin-001',
    displayName: 'Aisha Bello (National Admin)',
    email: 'admin@ecowaste.ng',
    role: 'Admin',
    phone: '+234 800 000 9999',
    city: 'Abuja',
    state: 'FCT Abuja',
    address: 'Ministry of Environment, Federal Secretariat, Abuja',
    ecoPoints: 10000,
    totalKgRecycled: 5000,
    createdAt: '2026-01-01T08:00:00Z',
    status: 'Active'
  }
];

const RECYCLING_RATES = {
  'Plastic': 5,
  'Paper': 4,
  'Cardboard': 4,
  'Glass': 6,
  'Metal': 10,
  'Aluminum Cans': 12,
  'Electronics (E-Waste)': 20,
  'Batteries': 15,
  'Organic Waste': 3,
  'Textiles': 5,
  'Rubber': 6,
  'Used Cooking Oil': 8
};

const INITIAL_RECYCLING_CENTERS = [
  {
    id: 'CENTER-1',
    name: 'EcoWaste Hub Lekki Circular Depot',
    address: 'Plot 12, Freedom Way, Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos State',
    phone: '+234 1 234 5678',
    accepts: ['Plastic', 'Aluminum Cans', 'Paper', 'Electronics (E-Waste)', 'Glass'],
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    distanceKm: 2.4,
    approved: true,
    lat: 6.452,
    lng: 3.473
  },
  {
    id: 'CENTER-2',
    name: 'EcoWaste Ikeja Urban Mining Depot',
    address: '8 Allen Avenue, Ikeja',
    city: 'Lagos',
    state: 'Lagos State',
    phone: '+234 1 345 6789',
    accepts: ['Metal', 'Plastic', 'Batteries', 'Electronics (E-Waste)', 'Used Cooking Oil'],
    hours: 'Mon - Sun: 7:00 AM - 7:00 PM',
    distanceKm: 4.8,
    approved: true,
    lat: 6.601,
    lng: 3.351
  },
  {
    id: 'CENTER-3',
    name: 'Abuja Central Green Resource Recovery Center',
    address: 'Plot 402, Constitution Avenue, CBD',
    city: 'Abuja',
    state: 'FCT Abuja',
    phone: '+234 9 876 5432',
    accepts: ['Organic Waste', 'Cardboard', 'Electronics (E-Waste)', 'Batteries', 'Textiles'],
    hours: 'Mon - Sat: 8:30 AM - 5:30 PM',
    distanceKm: 5.1,
    approved: true,
    lat: 9.057,
    lng: 7.495
  },
  {
    id: 'CENTER-4',
    name: 'Port Harcourt Circular Industrial Depot',
    address: '45 Aba Road, Garrison',
    city: 'Port Harcourt',
    state: 'Rivers State',
    phone: '+234 84 990 123',
    accepts: ['Metal', 'Plastic', 'Rubber', 'Batteries'],
    hours: 'Mon - Sat: 8:00 AM - 5:00 PM',
    distanceKm: 3.2,
    approved: true,
    lat: 4.815,
    lng: 7.049
  },
  {
    id: 'CENTER-5',
    name: 'Ibadan Bodija Bio & Metal Materials Center',
    address: 'Bodija Market Ring Road',
    city: 'Ibadan',
    state: 'Oyo State',
    phone: '+234 805 555 6677',
    accepts: ['Organic Waste', 'Glass', 'Cardboard', 'Used Cooking Oil'],
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    distanceKm: 6.0,
    approved: true,
    lat: 7.422,
    lng: 3.896
  }
];

const INITIAL_RECYCLING_REQUESTS = [
  {
    id: 'REC-NG-701',
    userId: 'demo-resident-123',
    userDisplayName: 'Tunde Adebayo',
    userPhone: '+234 803 123 4567',
    category: 'Plastic',
    wasteType: 'PET Clear Plastic Bottles',
    estimatedWeightKg: 24,
    actualWeightKg: 24,
    quantity: '24 kg (approx 600 bottles)',
    pickupAddress: '24 Awolowo Road, Ikoyi',
    landmark: 'Opposite Mobil Filling Station',
    pickupDate: '2026-07-29',
    pickupTime: '10:00 AM - 12:00 PM',
    city: 'Lagos',
    state: 'Lagos State',
    description: 'Rinsed PET plastic bottles packed in 3 heavy transparent sacks.',
    images: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'],
    status: 'Completed',
    collectorId: 'demo-collector-789',
    collectorName: 'Chidi Okonkwo (Eco-Agent)',
    pointsEarned: 120,
    createdAt: '2026-07-28T09:00:00Z',
    aiConfidence: 97.4,
    aiDetectedType: 'PET Type 1 Polyethylene Terephthalate'
  },
  {
    id: 'REC-NG-702',
    userId: 'demo-business-456',
    userDisplayName: 'Radisson Blu Lekki',
    userPhone: '+234 809 111 2233',
    category: 'Electronics (E-Waste)',
    wasteType: 'Old Server Monitors & Cables',
    estimatedWeightKg: 35,
    actualWeightKg: null,
    quantity: '5 Monitors & 10 Cables',
    pickupAddress: 'Plot 10 Ozumba Mbadiwe Ave, Victoria Island',
    landmark: 'Near Main Security Gate',
    pickupDate: '2026-07-31',
    pickupTime: '02:00 PM - 04:00 PM',
    city: 'Lagos',
    state: 'Lagos State',
    description: 'Decommissioned CRT monitors, server rack cables, and power units.',
    images: ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80'],
    status: 'Pending',
    collectorId: null,
    collectorName: null,
    pointsEarned: 300,
    createdAt: '2026-07-30T06:30:00Z',
    aiConfidence: 94.8,
    aiDetectedType: 'E-Waste / Circuitry Component'
  },
  {
    id: 'REC-NG-703',
    userId: 'demo-resident-104',
    userDisplayName: 'Amina Bello',
    userPhone: '+234 802 222 3344',
    category: 'Aluminum Cans',
    wasteType: 'Crushed Aluminium Soda Cans',
    estimatedWeightKg: 15,
    actualWeightKg: 15,
    quantity: '15 kg',
    pickupAddress: 'Plot 402 Constitution Ave, CBD',
    landmark: 'Behind Federal Secretariat',
    pickupDate: '2026-07-27',
    pickupTime: '09:00 AM - 11:00 AM',
    city: 'Abuja',
    state: 'FCT Abuja',
    description: 'Crushed aluminium beverage cans ready in cardboard carton.',
    images: ['https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80'],
    status: 'Completed',
    collectorId: 'demo-collector-789',
    collectorName: 'Chidi Okonkwo (Eco-Agent)',
    pointsEarned: 180,
    createdAt: '2026-07-26T14:15:00Z',
    aiConfidence: 98.2,
    aiDetectedType: 'Aluminium Can Metal Alloy'
  }
];

export function WasteProvider({ children }) {
  const { currentUser, userProfile, updateProfileData } = useAuth();

  const [pickups, setPickups] = useState(() => {
    const saved = localStorage.getItem('ecowaste_pickups');
    return saved ? JSON.parse(saved) : INITIAL_PICKUPS;
  });

  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('ecowaste_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ecowaste_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [recyclingRequests, setRecyclingRequests] = useState(() => {
    const saved = localStorage.getItem('ecowaste_recycling_requests');
    return saved ? JSON.parse(saved) : INITIAL_RECYCLING_REQUESTS;
  });

  const [recyclingCenters, setRecyclingCenters] = useState(() => {
    const saved = localStorage.getItem('ecowaste_recycling_centers');
    return saved ? JSON.parse(saved) : INITIAL_RECYCLING_CENTERS;
  });

  const [favoriteListings, setFavoriteListings] = useState(() => {
    const saved = localStorage.getItem('ecowaste_favorite_listings');
    return saved ? JSON.parse(saved) : ['MKT-101', 'MKT-103'];
  });

  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);
  const rewardsHistory = transactions;
  const depots = recyclingCenters;

  // Real-Time Listener for Recycling Requests
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'recyclingRequests'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreReqs = [];
        snapshot.forEach((docSnap) => {
          firestoreReqs.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (firestoreReqs.length > 0) {
          setRecyclingRequests(prev => {
            const map = new Map();
            INITIAL_RECYCLING_REQUESTS.forEach(r => map.set(r.id, r));
            firestoreReqs.forEach(r => map.set(r.id, r));
            return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          });
        }
      }, (err) => {
        console.warn("Firestore recyclingRequests listener warning:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore recyclingRequests error:", e);
    }
  }, []);

  // Real-Time Listener for Recycling Centers
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'recyclingCenters'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreCenters = [];
        snapshot.forEach((docSnap) => {
          firestoreCenters.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (firestoreCenters.length > 0) {
          setRecyclingCenters(prev => {
            const map = new Map();
            INITIAL_RECYCLING_CENTERS.forEach(c => map.set(c.id, c));
            firestoreCenters.forEach(c => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn("Firestore recyclingCenters listener warning:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore recyclingCenters error:", e);
    }
  }, []);

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem('ecowaste_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ecowaste_recycling_requests', JSON.stringify(recyclingRequests));
  }, [recyclingRequests]);

  useEffect(() => {
    localStorage.setItem('ecowaste_recycling_centers', JSON.stringify(recyclingCenters));
  }, [recyclingCenters]);

  useEffect(() => {
    localStorage.setItem('ecowaste_favorite_listings', JSON.stringify(favoriteListings));
  }, [favoriteListings]);

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('ecowaste_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('ecowaste_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [activitiesFeed, setActivitiesFeed] = useState(() => {
    const saved = localStorage.getItem('ecowaste_activities');
    return saved ? JSON.parse(saved) : [
      { id: 'ACT-1', timestamp: '5 mins ago', user: 'Tunde Adebayo', action: 'Scheduled 18kg PET bottle pickup in Lekki Phase 1', type: 'pickup', icon: '🚚' },
      { id: 'ACT-2', timestamp: '18 mins ago', user: 'Gabriel Nnamdi', action: 'Applied for Collector verification (Ikeja Zone)', type: 'collector', icon: '🛡️' },
      { id: 'ACT-3', timestamp: '1 hour ago', user: 'Chidi Okonkwo', action: 'Completed 25kg E-Waste pickup for Radisson Blu Lekki', type: 'pickup', icon: '✅' },
      { id: 'ACT-4', timestamp: '2 hours ago', user: 'NESREA Hazmat Unit', action: 'Dispatched response team to illegal chemical dump in Trans-Amadi', type: 'report', icon: '🚨' },
      { id: 'ACT-5', timestamp: '4 hours ago', user: 'Radisson Blu Lekki', action: 'Listed 2,500kg baled PET plastic on Eco Marketplace', type: 'marketplace', icon: '📦' },
      { id: 'ACT-6', timestamp: '5 hours ago', user: 'Amina Bello', action: 'Redeemed 200 EcoPoints for ₦1,000 MTN Airtime', type: 'reward', icon: '💰' }
    ];
  });

  const [notificationsList, setNotificationsList] = useState(() => {
    const saved = localStorage.getItem('ecowaste_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'NOTIF-1', title: 'Pending Collector Verification', message: 'Gabriel Nnamdi applied for Collector verification in Ikeja, Lagos.', date: '18 mins ago', read: false, type: 'approval' },
      { id: 'NOTIF-2', title: 'Critical Hazmat Dump Reported', message: 'Illegal chemical dumping reported in Trans-Amadi, Port Harcourt.', date: '1 hour ago', read: false, type: 'hazard' },
      { id: 'NOTIF-3', title: 'High Volume Pickup Scheduled', message: 'Radisson Blu requested 500kg carton recycling pickup.', date: '3 hours ago', read: true, type: 'pickup' },
      { id: 'NOTIF-4', title: 'System Security Audit Passed', message: 'Firestore security rules & ABAC data policies verified.', date: '1 day ago', read: true, type: 'system' }
    ];
  });

  // Real-Time Firestore Listener for Users
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'users'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreUsers = [];
        snapshot.forEach((docSnap) => {
          firestoreUsers.push({ uid: docSnap.id, ...docSnap.data() });
        });

        if (firestoreUsers.length > 0) {
          setUsersList(prev => {
            const map = new Map();
            INITIAL_USERS.forEach(u => map.set(u.uid, u));
            firestoreUsers.forEach(u => map.set(u.uid, u));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn("Firestore users snapshot listener warning:", err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore users listener error:", e);
    }
  }, []);

  // Real-Time Firestore Listener for Reports
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'reports'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreReports = [];
        snapshot.forEach((docSnap) => {
          firestoreReports.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (firestoreReports.length > 0) {
          setReports(prev => {
            const map = new Map();
            INITIAL_REPORTS.forEach(r => map.set(r.id, r));
            firestoreReports.forEach(r => map.set(r.id, r));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn("Firestore reports snapshot listener warning:", err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore reports listener error:", e);
    }
  }, []);

  // Sync usersList to local storage
  useEffect(() => {
    localStorage.setItem('ecowaste_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('ecowaste_activities', JSON.stringify(activitiesFeed));
  }, [activitiesFeed]);

  useEffect(() => {
    localStorage.setItem('ecowaste_notifications', JSON.stringify(notificationsList));
  }, [notificationsList]);

  // Real-Time Firestore Listener for Pickups
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'pickups'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreList = [];
        snapshot.forEach((docSnap) => {
          firestoreList.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (firestoreList.length > 0) {
          setPickups(prev => {
            const map = new Map();
            INITIAL_PICKUPS.forEach(p => map.set(p.id, p));
            firestoreList.forEach(p => map.set(p.id, p));
            return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          });
        }
      }, (err) => {
        console.warn("Firestore pickups snapshot listener warning:", err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore setup warning:", e);
    }
  }, []);

  // Real-Time Firestore Listener for Marketplace Listings
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'listings'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreListings = [];
        snapshot.forEach((docSnap) => {
          firestoreListings.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (firestoreListings.length > 0) {
          setListings(prev => {
            const map = new Map();
            INITIAL_LISTINGS.forEach(l => map.set(l.id, l));
            firestoreListings.forEach(l => map.set(l.id, l));
            return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          });
        }
      }, (err) => {
        console.warn("Firestore listings snapshot listener warning:", err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore listings setup warning:", e);
    }
  }, []);

  // Real-Time Firestore Listener for Transactions
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'transactions'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreTxns = [];
        snapshot.forEach((docSnap) => {
          firestoreTxns.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (firestoreTxns.length > 0) {
          setTransactions(prev => {
            const map = new Map();
            INITIAL_TRANSACTIONS.forEach(t => map.set(t.id, t));
            firestoreTxns.forEach(t => map.set(t.id, t));
            return Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
          });
        }
      }, (err) => {
        console.warn("Firestore transactions snapshot listener warning:", err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore txns setup warning:", e);
    }
  }, []);

  // Local Storage persistence
  useEffect(() => {
    localStorage.setItem('ecowaste_pickups', JSON.stringify(pickups));
  }, [pickups]);

  useEffect(() => {
    localStorage.setItem('ecowaste_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('ecowaste_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ecowaste_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('ecowaste_rewards', JSON.stringify(rewardsHistory));
  }, [rewardsHistory]);

  // Upload Photo helper to Storage with base64 fallback
  const uploadWastePhoto = async (file, prefixId) => {
    if (!file) return '';
    if (storage && currentUser) {
      try {
        const storageRef = ref(storage, `waste_photos/${prefixId}_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.warn("Firebase storage upload notice, fallback to data URL:", err);
      }
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Schedule a new pickup (Resident / Business)
  const createPickup = async (pickupData, photoFile = null) => {
    const docId = `ECO-NG-${Math.floor(1000 + Math.random() * 9000)}`;
    const weight = parseFloat(pickupData.estimatedWeightKg || pickupData.weightKg) || 10;
    
    let photoURL = '';
    if (photoFile) {
      photoURL = await uploadWastePhoto(photoFile, docId);
    } else if (pickupData.photoURL) {
      photoURL = pickupData.photoURL;
    }

    let earnedPoints = Math.round(weight * 10);
    if (pickupData.category === 'e-waste' || pickupData.wasteType?.toLowerCase().includes('e-waste')) {
      earnedPoints = Math.round(weight * 20);
    }

    const coordX = pickupData.coords?.x || (20 + (Math.random() * 60));
    const coordY = pickupData.coords?.y || (20 + (Math.random() * 55));

    const newPickup = {
      id: docId,
      userId: currentUser?.uid || 'demo-resident-123',
      userDisplayName: currentUser?.displayName || userProfile?.displayName || 'Eco Resident',
      userPhone: userProfile?.phone || pickupData.phone || '+234 803 123 4567',
      wasteType: pickupData.wasteType || 'PET Plastic Bottles',
      category: pickupData.category || 'recyclable',
      weightKg: weight,
      estimatedWeightKg: weight,
      pickupDate: pickupData.pickupDate || new Date().toISOString().split('T')[0],
      timeSlot: pickupData.timeSlot || '10:00 AM - 12:00 PM',
      address: pickupData.address || '14 Admiralty Way, Lekki Phase 1',
      city: pickupData.city || 'Lagos',
      state: pickupData.state || 'Lagos State',
      photoURL: photoURL || '',
      notes: pickupData.notes || '',
      status: 'Pending',
      collectorId: null,
      collectorName: null,
      collectorPhone: null,
      rewardPoints: earnedPoints,
      coordinates: { x: Math.round(coordX), y: Math.round(coordY) },
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, 'pickups', docId), newPickup);
      } catch (err) {
        console.warn("Firestore setDoc pickup warning:", err);
      }
    }

    setPickups(prev => [newPickup, ...prev]);

    return newPickup;
  };

  // Create Marketplace Listing
  const createListing = async (listingData, photoFile = null) => {
    const docId = `MKT-${Math.floor(100 + Math.random() * 900)}`;
    
    let imageURL = listingData.imageURL || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80';
    if (photoFile) {
      const uploaded = await uploadWastePhoto(photoFile, docId);
      if (uploaded) imageURL = uploaded;
    }

    const price = parseFloat(listingData.priceNaira) || 50000;

    const newListing = {
      id: docId,
      title: listingData.title || 'Recyclable Plastic Bulk Sale',
      category: listingData.category || 'Plastics',
      quantity: listingData.quantity || '500 kg',
      quantityValue: parseFloat(listingData.quantity) || 500,
      priceNaira: price,
      sellerId: currentUser?.uid || 'demo-resident-123',
      sellerName: userProfile?.displayName || 'Eco Recycler',
      sellerPhone: userProfile?.phone || listingData.phone || '+234 803 123 4567',
      sellerType: userProfile?.role || 'Resident',
      location: listingData.location || 'Admiralty Way, Lekki Phase 1',
      city: listingData.city || 'Lagos',
      state: listingData.state || 'Lagos State',
      imageURL: imageURL,
      description: listingData.description || 'Quality sorted materials available for immediate collection.',
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, 'listings', docId), newListing);
      } catch (err) {
        console.warn("Firestore listing save error:", err);
      }
    }

    setListings(prev => [newListing, ...prev]);

    // Award +75 EcoPoints listing bonus
    const listingBonus = 75;
    const bonusTxn = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser?.uid || 'demo-resident-123',
      type: 'Marketplace Listing Bonus',
      description: `Earned +75 EcoPoints for listing "${newListing.title}"`,
      points: listingBonus,
      nairaValue: listingBonus * 5,
      category: 'marketplace',
      date: new Date().toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, 'transactions', bonusTxn.id), bonusTxn);
      } catch (err) {
        console.warn("Firestore transaction error:", err);
      }
    }

    setTransactions(prev => [bonusTxn, ...prev]);

    updateProfileData({
      ecoPoints: (userProfile?.ecoPoints || 0) + listingBonus
    });

    return newListing;
  };

  // Accept Pickup (Collector Role)
  const acceptPickup = async (pickupId) => {
    const updateData = {
      status: 'Accepted',
      collectorId: currentUser?.uid || 'demo-collector-789',
      collectorName: userProfile?.displayName || 'Chidi Okonkwo (Eco-Agent)',
      collectorPhone: userProfile?.phone || '+234 809 987 6543',
      acceptedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await updateDoc(doc(db, 'pickups', pickupId), updateData);
      } catch (err) {
        console.warn("Firestore acceptPickup update error:", err);
      }
    }

    setPickups(prev => prev.map(p => p.id === pickupId ? { ...p, ...updateData } : p));
  };

  // Complete Pickup (Collector Role)
  const completePickup = async (pickupId) => {
    const target = pickups.find(p => p.id === pickupId);
    const updateData = {
      status: 'Completed',
      completedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await updateDoc(doc(db, 'pickups', pickupId), updateData);
      } catch (err) {
        console.warn("Firestore completePickup update error:", err);
      }
    }

    setPickups(prev => prev.map(p => p.id === pickupId ? { ...p, ...updateData } : p));

    // Award points & log transaction
    if (target) {
      const pointsToAdd = target.rewardPoints || 100;
      const weightToAdd = target.weightKg || target.estimatedWeightKg || 10;
      
      const newTxn = {
        id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
        userId: target.userId || currentUser?.uid || 'demo-resident-123',
        type: 'Pickup Completion Reward',
        description: `Earned ${pointsToAdd} EcoPoints for ${weightToAdd}kg ${target.wasteType} pickup`,
        points: pointsToAdd,
        nairaValue: pointsToAdd * 5,
        category: 'pickup',
        date: new Date().toISOString()
      };

      if (db) {
        try {
          await setDoc(doc(db, 'transactions', newTxn.id), newTxn);
        } catch (err) {
          console.warn("Firestore transaction log error:", err);
        }
      }

      setTransactions(prev => [newTxn, ...prev]);

      updateProfileData({
        ecoPoints: (userProfile?.ecoPoints || 0) + pointsToAdd,
        totalKgRecycled: (userProfile?.totalKgRecycled || 0) + weightToAdd
      });
    }
  };

  // Claim Friend Referral Code
  const claimReferralCode = async (refCode) => {
    const pointsEarned = 150;
    const refTxn = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser?.uid || 'demo-resident-123',
      type: 'Friend Referral Bonus',
      description: `Claimed 150 EcoPoints with referral code ${refCode.toUpperCase()}`,
      points: pointsEarned,
      nairaValue: pointsEarned * 5,
      category: 'referral',
      date: new Date().toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, 'transactions', refTxn.id), refTxn);
      } catch (err) {
        console.warn("Firestore referral txn error:", err);
      }
    }

    setTransactions(prev => [refTxn, ...prev]);

    updateProfileData({
      ecoPoints: (userProfile?.ecoPoints || 0) + pointsEarned
    });

    return refTxn;
  };

  // Cancel pickup
  const cancelPickup = async (pickupId) => {
    const updateData = { status: 'Cancelled' };
    if (db) {
      try {
        await updateDoc(doc(db, 'pickups', pickupId), updateData);
      } catch (err) {
        console.warn("Firestore cancelPickup error:", err);
      }
    }
    setPickups(prev => prev.map(p => p.id === pickupId ? { ...p, status: 'Cancelled' } : p));
  };

  // Create Hazard Report
  const createReport = (reportData) => {
    const created = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Received',
      upvotes: 1,
      reportedAt: new Date().toISOString().split('T')[0],
      ...reportData
    };
    setReports(prev => [created, ...prev]);
    return created;
  };

  // Redeem EcoPoints
  const redeemPoints = async (rewardTitle, pointsNeeded, valueText) => {
    const currentPoints = userProfile?.ecoPoints || 0;
    if (currentPoints < pointsNeeded) {
      throw new Error(`Insufficient EcoPoints. You have ${currentPoints} points, but need ${pointsNeeded}.`);
    }

    const newRedemption = {
      id: `REW-${Math.floor(100 + Math.random() * 900)}`,
      type: rewardTitle,
      amount: valueText,
      pointsUsed: pointsNeeded,
      date: new Date().toISOString().split('T')[0]
    };

    const redTxn = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser?.uid || 'demo-resident-123',
      type: `Cashout: ${rewardTitle}`,
      description: `Redeemed ${pointsNeeded} EcoPoints for ${valueText}`,
      points: -pointsNeeded,
      nairaValue: -(pointsNeeded * 5),
      category: 'redemption',
      date: new Date().toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, 'transactions', redTxn.id), redTxn);
      } catch (err) {
        console.warn("Firestore redemption txn error:", err);
      }
    }

    setTransactions(prev => [redTxn, ...prev]);
    setRewardsHistory(prev => [newRedemption, ...prev]);

    updateProfileData({
      ecoPoints: currentPoints - pointsNeeded
    });

    return newRedemption;
  };

  // AI Waste Classification Simulation Helper
  const analyzeWasteImage = (categoryHint = 'Plastic') => {
    const aiDatabase = {
      'Plastic': {
        detectedType: 'PET Clear Polyethylene Bottles (Type 1)',
        estimatedWeight: '4.5 kg',
        estimatedWeightKg: 4.5,
        isRecyclable: true,
        confidence: 97.4,
        recommendedDisposal: 'Rinse thoroughly, flatten bottles, and bundle in transparent polyethylene sacks for collector pickup.',
        pointsPerKg: 5
      },
      'Paper': {
        detectedType: 'Clean White Office Paper & Document Scrap',
        estimatedWeight: '12.0 kg',
        estimatedWeightKg: 12.0,
        isRecyclable: true,
        confidence: 96.1,
        recommendedDisposal: 'Remove metal paperclips, keep completely dry, and stack in cardboard boxes.',
        pointsPerKg: 4
      },
      'Cardboard': {
        detectedType: 'Corrugated Heavy Packaging Boxes',
        estimatedWeight: '18.5 kg',
        estimatedWeightKg: 18.5,
        isRecyclable: true,
        confidence: 98.2,
        recommendedDisposal: 'Flatten all boxes, tie with twine or tape into bundles for bulk compaction.',
        pointsPerKg: 4
      },
      'Glass': {
        detectedType: 'Clear Amber Beverage & Food Containers',
        estimatedWeight: '8.0 kg',
        estimatedWeightKg: 8.0,
        isRecyclable: true,
        confidence: 95.8,
        recommendedDisposal: 'Separate by color, remove metal caps, and pack in padded crates to avoid breakage.',
        pointsPerKg: 6
      },
      'Metal': {
        detectedType: 'Ferrous Scrap Metal & Steel Food Cans',
        estimatedWeight: '15.0 kg',
        estimatedWeightKg: 15.0,
        isRecyclable: true,
        confidence: 94.6,
        recommendedDisposal: 'Rinse out food residue, compress cans, and place in heavy-duty collection bin.',
        pointsPerKg: 10
      },
      'Aluminum Cans': {
        detectedType: 'Pure High-Grade Aluminium Beverage Cans',
        estimatedWeight: '10.0 kg',
        estimatedWeightKg: 10.0,
        isRecyclable: true,
        confidence: 99.1,
        recommendedDisposal: 'Crush flat to conserve space. Ready for high-yield smelting recycling.',
        pointsPerKg: 12
      },
      'Electronics (E-Waste)': {
        detectedType: 'Computer PCB Circuit Boards & Power Supply Units',
        estimatedWeight: '6.0 kg',
        estimatedWeightKg: 6.0,
        isRecyclable: true,
        confidence: 93.7,
        recommendedDisposal: 'Do not dismantle components. Store in static-free dry boxes for urban mining recovery.',
        pointsPerKg: 20
      },
      'Batteries': {
        detectedType: 'Lead-Acid & Lithium-Ion Rechargeable Cells',
        estimatedWeight: '20.0 kg',
        estimatedWeightKg: 20.0,
        isRecyclable: true,
        confidence: 98.9,
        recommendedDisposal: 'HAZMAT WARNING: Tape battery terminals, do not puncture, and submit directly to authorized depot.',
        pointsPerKg: 15
      },
      'Organic Waste': {
        detectedType: 'Compostable Food & Agricultural Scrap',
        estimatedWeight: '25.0 kg',
        estimatedWeightKg: 25.0,
        isRecyclable: true,
        confidence: 92.3,
        recommendedDisposal: 'Place in aerated organic bin for high-efficiency vermicomposting and biogas generation.',
        pointsPerKg: 3
      },
      'Textiles': {
        detectedType: 'Cotton & Synthetic Fabric Clothing Scrap',
        estimatedWeight: '14.0 kg',
        estimatedWeightKg: 14.0,
        isRecyclable: true,
        confidence: 91.5,
        recommendedDisposal: 'Ensure clean and dry. Suitable for industrial rag wiping or eco-fiber insulation.',
        pointsPerKg: 5
      },
      'Rubber': {
        detectedType: 'Vulcanized Automobile Tyre Rubber Scrap',
        estimatedWeight: '30.0 kg',
        estimatedWeightKg: 30.0,
        isRecyclable: true,
        confidence: 96.0,
        recommendedDisposal: 'Stack neatly for shredding into asphalt bitumen modifier and rubber playground tiles.',
        pointsPerKg: 6
      },
      'Used Cooking Oil': {
        detectedType: 'Filtered Vegetable & Palm Oil Residue',
        estimatedWeight: '15.0 L',
        estimatedWeightKg: 15.0,
        isRecyclable: true,
        confidence: 97.0,
        recommendedDisposal: 'Pour into sealed jerrycan containers for biodiesel refining.',
        pointsPerKg: 8
      }
    };

    return aiDatabase[categoryHint] || aiDatabase['Plastic'];
  };

  // Submit Recycling Request
  const submitRecyclingRequest = async (formData, imageFiles = []) => {
    const docId = `REC-NG-${Math.floor(1000 + Math.random() * 9000)}`;
    const estWeight = parseFloat(formData.estimatedWeightKg) || 10;
    const catRate = RECYCLING_RATES[formData.category] || 5;
    const estPoints = Math.round(estWeight * catRate);

    const uploadedImages = [];
    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < Math.min(imageFiles.length, 5); i++) {
        const file = imageFiles[i];
        if (typeof file === 'string') {
          uploadedImages.push(file);
        } else {
          const url = await uploadWastePhoto(file, `${docId}_${i}`);
          if (url) uploadedImages.push(url);
        }
      }
    }

    if (uploadedImages.length === 0) {
      uploadedImages.push('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80');
    }

    const newRequest = {
      id: docId,
      userId: currentUser?.uid || 'demo-resident-123',
      userDisplayName: currentUser?.displayName || userProfile?.displayName || 'Eco Resident',
      userPhone: formData.contactPhone || userProfile?.phone || '+234 803 123 4567',
      category: formData.category || 'Plastic',
      wasteType: formData.wasteType || `${formData.category} Recyclable`,
      estimatedWeightKg: estWeight,
      actualWeightKg: null,
      quantity: formData.quantity || `${estWeight} kg`,
      pickupAddress: formData.pickupAddress || '14 Admiralty Way, Lekki Phase 1',
      landmark: formData.landmark || '',
      pickupDate: formData.preferredPickupDate || new Date().toISOString().split('T')[0],
      pickupTime: formData.preferredPickupTime || '10:00 AM - 12:00 PM',
      city: formData.city || userProfile?.city || 'Lagos',
      state: formData.state || userProfile?.state || 'Lagos State',
      description: formData.description || '',
      gpsLocation: formData.gpsLocation || null,
      images: uploadedImages,
      status: 'Pending',
      collectorId: null,
      collectorName: null,
      pointsEarned: estPoints,
      createdAt: new Date().toISOString(),
      aiConfidence: formData.aiConfidence || 96.5,
      aiDetectedType: formData.aiDetectedType || `${formData.category} Verified Recyclable`
    };

    if (db) {
      try {
        await setDoc(doc(db, 'recyclingRequests', docId), newRequest);
      } catch (err) {
        console.warn("Firestore setDoc recyclingRequest warning:", err);
      }
    }

    setRecyclingRequests(prev => [newRequest, ...prev]);

    // Log Activity
    addSystemActivity(
      currentUser?.displayName || 'Eco Recycler',
      `Submitted ${estWeight}kg ${formData.category} recycling request in ${newRequest.city}`,
      'pickup',
      '♻️'
    );

    return newRequest;
  };

  // Complete Recycling Collection (Collector Role)
  const completeRecyclingCollection = async (requestId, verifiedWeightKg, proofPhotoFile = null) => {
    const target = recyclingRequests.find(r => r.id === requestId);
    const weight = parseFloat(verifiedWeightKg) || target?.estimatedWeightKg || 10;
    const catRate = RECYCLING_RATES[target?.category] || 5;
    const pointsAwarded = Math.round(weight * catRate);

    let proofPhotoURL = target?.images?.[0] || '';
    if (proofPhotoFile) {
      const url = await uploadWastePhoto(proofPhotoFile, `PROOF_${requestId}`);
      if (url) proofPhotoURL = url;
    }

    const updateData = {
      status: 'Completed',
      actualWeightKg: weight,
      collectorId: currentUser?.uid || 'demo-collector-789',
      collectorName: userProfile?.displayName || 'Chidi Okonkwo (Eco-Agent)',
      pointsEarned: pointsAwarded,
      proofPhotoURL,
      completedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await updateDoc(doc(db, 'recyclingRequests', requestId), updateData);
      } catch (err) {
        console.warn("Firestore recycling collection update warning:", err);
      }
    }

    setRecyclingRequests(prev => prev.map(r => r.id === requestId ? { ...r, ...updateData } : r));

    // Award Eco Points to Resident/Business
    if (target) {
      const rewardTxn = {
        id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
        userId: target.userId || currentUser?.uid || 'demo-resident-123',
        type: 'Recycling Collection Reward',
        description: `Earned +${pointsAwarded} EcoPoints for recycling ${weight}kg ${target.category}`,
        points: pointsAwarded,
        nairaValue: pointsAwarded * 5,
        category: 'pickup',
        date: new Date().toISOString()
      };

      if (db) {
        try {
          await setDoc(doc(db, 'transactions', rewardTxn.id), rewardTxn);
        } catch (err) {
          console.warn("Firestore reward transaction warning:", err);
        }
      }

      setTransactions(prev => [rewardTxn, ...prev]);

      updateProfileData({
        ecoPoints: (userProfile?.ecoPoints || 0) + pointsAwarded,
        totalKgRecycled: (userProfile?.totalKgRecycled || 0) + weight
      });
    }
  };

  // Toggle Favorite Listing
  const toggleFavoriteListing = async (listingId) => {
    let updated;
    if (favoriteListings.includes(listingId)) {
      updated = favoriteListings.filter(id => id !== listingId);
    } else {
      updated = [...favoriteListings, listingId];
    }
    setFavoriteListings(updated);

    if (db && currentUser) {
      try {
        await setDoc(doc(db, 'favoriteListings', currentUser.uid), { listings: updated }, { merge: true });
      } catch (err) {
        console.warn("Firestore favorite error:", err);
      }
    }
  };

  // Admin Approve Recycling Center
  const approveRecyclingCenter = async (centerId) => {
    if (db) {
      try {
        await updateDoc(doc(db, 'recyclingCenters', centerId), { approved: true });
      } catch (err) {
        console.warn("Firestore approve center error:", err);
      }
    }
    setRecyclingCenters(prev => prev.map(c => c.id === centerId ? { ...c, approved: true } : c));
  };

  // Admin Create Recycling Center
  const createRecyclingCenter = async (centerData) => {
    const docId = `CENTER-${Math.floor(100 + Math.random() * 900)}`;
    const newCenter = {
      id: docId,
      name: centerData.name,
      address: centerData.address,
      city: centerData.city || 'Lagos',
      state: centerData.state || 'Lagos State',
      phone: centerData.phone || '+234 800 000 0000',
      accepts: centerData.accepts || ['Plastic', 'Paper', 'Metal'],
      hours: centerData.hours || 'Mon - Sat: 8:00 AM - 6:00 PM',
      distanceKm: centerData.distanceKm || 3.5,
      approved: true,
      lat: centerData.lat || 6.524,
      lng: centerData.lng || 3.379
    };

    if (db) {
      try {
        await setDoc(doc(db, 'recyclingCenters', docId), newCenter);
      } catch (err) {
        console.warn("Firestore setDoc center error:", err);
      }
    }

    setRecyclingCenters(prev => [...prev, newCenter]);
    return newCenter;
  };
  const approveCollector = async (uid, status = 'Approved') => {
    const isApp = status === 'Approved';
    const updateData = {
      approvalStatus: status,
      collectorApproved: isApp,
      updatedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await updateDoc(doc(db, 'users', uid), updateData);
      } catch (err) {
        console.warn("Firestore approveCollector error:", err);
      }
    }

    setUsersList(prev => prev.map(u => u.uid === uid ? { ...u, ...updateData } : u));
    
    const userObj = usersList.find(u => u.uid === uid);
    addSystemActivity('System Admin', `Updated Collector status for ${userObj?.displayName || uid} to ${status}`, 'collector', isApp ? '🛡️' : '⚠️');
  };

  const updateUserRoleAdmin = async (uid, newRole) => {
    const updateData = {
      role: newRole,
      updatedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await updateDoc(doc(db, 'users', uid), updateData);
      } catch (err) {
        console.warn("Firestore updateUserRoleAdmin error:", err);
      }
    }

    setUsersList(prev => prev.map(u => u.uid === uid ? { ...u, ...updateData } : u));
    
    const userObj = usersList.find(u => u.uid === uid);
    addSystemActivity('System Admin', `Changed account role for ${userObj?.displayName || uid} to "${newRole}"`, 'user', '👑');
  };

  const deleteUserAdmin = async (uid) => {
    if (db) {
      try {
        await updateDoc(doc(db, 'users', uid), { status: 'Deleted', deletedAt: new Date().toISOString() });
      } catch (err) {
        console.warn("Firestore deleteUserAdmin error:", err);
      }
    }
    setUsersList(prev => prev.filter(u => u.uid !== uid));
    addSystemActivity('System Admin', `Deleted user account #${uid.slice(0, 8)}`, 'user', '🗑️');
  };

  const updatePickupAdmin = async (pickupId, updateFields) => {
    if (db) {
      try {
        await updateDoc(doc(db, 'pickups', pickupId), updateFields);
      } catch (err) {
        console.warn("Firestore updatePickupAdmin error:", err);
      }
    }
    setPickups(prev => prev.map(p => p.id === pickupId ? { ...p, ...updateFields } : p));
    addSystemActivity('System Admin', `Updated Pickup request #${pickupId}`, 'pickup', '✏️');
  };

  const deletePickupAdmin = async (pickupId) => {
    if (db) {
      try {
        await updateDoc(doc(db, 'pickups', pickupId), { status: 'Cancelled', deletedByAdmin: true });
      } catch (err) {
        console.warn("Firestore deletePickupAdmin error:", err);
      }
    }
    setPickups(prev => prev.filter(p => p.id !== pickupId));
    addSystemActivity('System Admin', `Deleted pickup request #${pickupId}`, 'pickup', '🗑️');
  };

  const updateReportStatus = async (reportId, newStatus, notes) => {
    const updateData = {
      status: newStatus,
      ...(notes ? { notes } : {}),
      updatedAt: new Date().toISOString()
    };
    if (db) {
      try {
        await updateDoc(doc(db, 'reports', reportId), updateData);
      } catch (err) {
        console.warn("Firestore updateReportStatus error:", err);
      }
    }
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, ...updateData } : r));
    addSystemActivity('System Admin', `Updated dumping report #${reportId} to "${newStatus}"`, 'report', '🚨');
  };

  const deleteReportAdmin = async (reportId) => {
    if (db) {
      try {
        await updateDoc(doc(db, 'reports', reportId), { status: 'Resolved' });
      } catch (err) {
        console.warn("Firestore deleteReportAdmin error:", err);
      }
    }
    setReports(prev => prev.filter(r => r.id !== reportId));
    addSystemActivity('System Admin', `Resolved hazard report #${reportId}`, 'report', '✅');
  };

  const addSystemActivity = (user, action, type = 'system', icon = '⚡') => {
    const newAct = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      user,
      action,
      type,
      icon
    };
    setActivitiesFeed(prev => [newAct, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Calculate dynamic user achievements
  const userKg = userProfile?.totalKgRecycled || 128;
  const userPts = userProfile?.ecoPoints || 450;

  const achievements = [
    { id: 'ach-1', title: 'Eco Starter', desc: 'Completed your first waste pickup request', icon: '🌱', unlocked: true, progress: '1/1' },
    { id: 'ach-2', title: 'Plastic Crusher', desc: 'Recycled over 50kg of PET plastic bottles', icon: '🥤', unlocked: userKg >= 50, progress: `${Math.min(userKg, 50)}/50 kg` },
    { id: 'ach-3', title: '100kg Century Club', desc: 'Diverted 100+ kg of waste from Nigerian landfills', icon: '🏅', unlocked: userKg >= 100, progress: `${Math.min(userKg, 100)}/100 kg` },
    { id: 'ach-4', title: 'Green Merchant', desc: 'Posted a recyclable batch on Eco Marketplace', icon: '📦', unlocked: listings.some(l => l.sellerId === currentUser?.uid || l.sellerId === 'demo-resident-123'), progress: 'Done' },
    { id: 'ach-5', title: 'Naira Eco Wallet Pro', desc: 'Earned 500+ EcoPoints total in your wallet', icon: '💰', unlocked: userPts >= 500, progress: `${Math.min(userPts, 500)}/500 pts` },
    { id: 'ach-6', title: 'Eco Ambassador', desc: 'Referred a friend to EcoWaste Nigeria', icon: '📢', unlocked: transactions.some(t => t.category === 'referral'), progress: '1 Referred' },
  ];

  const value = {
    pickups,
    listings,
    transactions,
    reports,
    depots,
    recyclingRequests,
    recyclingCenters,
    favoriteListings,
    RECYCLING_RATES,
    rewardsHistory,
    leaderboard,
    achievements,
    usersList,
    activitiesFeed,
    notificationsList,
    createPickup,
    createListing,
    acceptPickup,
    completePickup,
    cancelPickup,
    claimReferralCode,
    createReport,
    redeemPoints,
    approveCollector,
    updateUserRoleAdmin,
    deleteUserAdmin,
    updatePickupAdmin,
    deletePickupAdmin,
    updateReportStatus,
    deleteReportAdmin,
    addSystemActivity,
    markNotificationRead,
    analyzeWasteImage,
    submitRecyclingRequest,
    completeRecyclingCollection,
    toggleFavoriteListing,
    approveRecyclingCenter,
    createRecyclingCenter
  };

  return (
    <WasteContext.Provider value={value}>
      {children}
    </WasteContext.Provider>
  );
}
