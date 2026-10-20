import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWaste } from '../context/WasteContext';
import { useAuth } from '../context/AuthContext';
import { 
  Coins, 
  TrendingUp, 
  Award, 
  History, 
  Share2, 
  Copy, 
  Check, 
  Gift, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trophy, 
  Sparkles, 
  Smartphone, 
  Building2, 
  Zap, 
  CheckCircle2, 
  Scale, 
  Users, 
  Flame,
  FileText,
  Search,
  Filter
} from 'lucide-react';

export default function WalletPage() {
  const { 
    transactions, 
    pickups, 
    rewardsHistory, 
    leaderboard, 
    achievements, 
    redeemPoints, 
    claimReferralCode 
  } = useWaste();
  
  const { userProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // overview, transactions, history, achievements, leaderboard
  const [copiedRef, setCopiedRef] = useState(false);
  const [inputRefCode, setInputRefCode] = useState('');
  const [refClaiming, setRefClaiming] = useState(false);
  const [refMsg, setRefMsg] = useState('');

  // Cashout / Redemption Modal State
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState('');
  const [redeemError, setRedeemError] = useState('');

  const currentPoints = userProfile?.ecoPoints || 450;
  const nairaEquivalent = currentPoints * 5; // 1 EcoPoint = ₦5
  const userKg = userProfile?.totalKgRecycled || 128;
  const userRefCode = `ECO-REF-${userProfile?.displayName?.split(' ')[0]?.toUpperCase() || 'ADEBAYO'}-99`;

  const availableRedemptions = [
    { id: 'red-1', title: 'Airtime Recharge (MTN / Airtel / Glo)', points: 200, valueText: '₦1,000 Airtime', icon: Smartphone, color: 'bg-amber-500' },
    { id: 'red-[2]', title: 'Instant Bank Transfer (Kuda / GTBank / Zenith)', points: 500, valueText: '₦2,500 Cash', icon: Building2, color: 'bg-emerald-600' },
    { id: 'red-3', title: 'Ikeja / Eko Electricity Token', points: 400, valueText: '₦2,000 Power Token', icon: Zap, color: 'bg-blue-600' },
    { id: 'red-4', title: 'Shoprite & SPAR Grocery Voucher', points: 1000, valueText: '₦5,000 Voucher', icon: Gift, color: 'bg-purple-600' },
  ];

  const handleCopyRef = () => {
    navigator.clipboard.writeText(userRefCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleClaimReferral = async (e) => {
    e.preventDefault();
    if (!inputRefCode.trim()) return;
    setRefClaiming(true);
    setRefMsg('');
    try {
      await claimReferralCode(inputRefCode);
      setRefClaiming(false);
      setRefMsg('Referral code claimed! +150 EcoPoints added to your wallet 🎉');
      setInputRefCode('');
    } catch (err) {
      setRefClaiming(false);
      setRefMsg(err.message || 'Invalid or expired referral code.');
    }
  };

  const handleRedeemSubmit = async (reward) => {
    setRedeeming(true);
    setRedeemError('');
    setRedeemSuccess('');
    try {
      await redeemPoints(reward.title, reward.points, reward.valueText);
      setRedeeming(false);
      setRedeemSuccess(`Successfully redeemed ${reward.valueText}! Funds will reflect in your line/bank shortly.`);
      setTimeout(() => {
        setIsRedeemModalOpen(false);
        setRedeemSuccess('');
      }, 2000);
    } catch (err) {
      setRedeeming(false);
      setRedeemError(err.message || 'Failed to redeem points.');
    }
  };

  return (
    <div className="space-y-6">
      {/* WALLET BALANCE HEADER & BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Points & Cash Card */}
          <div className="md:col-span-2 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Coins className="w-3.5 h-3.5 text-emerald-400" /> EcoRewards Naira Wallet
            </span>

            <div className="flex flex-wrap items-baseline gap-4">
              <div>
                <p className="text-xs text-slate-400 font-medium">Available Balance</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {currentPoints.toLocaleString()}
                  </span>
                  <span className="text-emerald-400 font-extrabold text-sm">EcoPoints</span>
                </div>
              </div>

              <div className="pl-4 border-l border-slate-700/80">
                <p className="text-xs text-slate-400 font-medium">Estimated Value</p>
                <p className="text-2xl font-black text-emerald-300 mt-1">
                  ₦{nairaEquivalent.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Earn EcoPoints for recycling, pickups, and inviting friends. Redeem directly for Cash Transfer, Airtime, or Utility Tokens.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-3 justify-center md:items-end">
            <button
              onClick={() => setIsRedeemModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 stroke-[2.5]" /> Cash Out EcoPoints
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                <Scale className="w-3.5 h-3.5" /> {userKg}kg Recycled
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Flame className="w-3.5 h-3.5" /> {(userKg * 2.5).toFixed(0)}kg CO₂ Saved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* REFERRAL SYSTEM BANNER */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Invite Friends & Earn +150 EcoPoints</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Share your unique referral code with friends and family in Nigeria. You both earn +150 EcoPoints (₦750 value) when they sign up!
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-sm text-slate-800 tracking-wider">
              {userRefCode}
            </div>
            <button
              onClick={handleCopyRef}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedRef ? 'Copied!' : 'Copy Code'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Join me on EcoWaste Nigeria to recycle and earn cash! Use my code ${userRefCode} for bonus points.`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share WhatsApp
            </a>
          </div>
        </div>

        {/* Claim Code Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 mb-1">Have a friend's referral code?</h4>
          <p className="text-[11px] text-slate-500 mb-3">Enter referral code below to claim instant +150 EcoPoints.</p>

          {refMsg && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {refMsg}
            </div>
          )}

          <form onSubmit={handleClaimReferral} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. ECO-REF-ADEBAYO-99"
              value={inputRefCode}
              onChange={(e) => setInputRefCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-mono bg-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={refClaiming}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              {refClaiming ? 'Claiming...' : 'Claim Points'}
            </button>
          </form>
        </div>
      </div>

      {/* WALLET TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: 'Wallet Transactions', icon: History },
          { id: 'history', label: 'Pickup & Sales History', icon: FileText },
          { id: 'achievements', label: 'Eco Achievements', icon: Award },
          { id: 'leaderboard', label: 'Nigeria Leaderboard', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TRANSACTIONS LEDGER */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Points & Cash Activity</h3>
            <span className="text-xs text-slate-400">Real-time Firestore Synchronized</span>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map((txn) => {
              const isPositive = txn.points > 0;
              return (
                <div key={txn.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
                      isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{txn.type}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{txn.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-black text-sm ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? `+${txn.points}` : txn.points} EcoPoints
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PICKUP & SALES HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Waste Pickup & Marketplace Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Waste Category</th>
                  <th className="p-3">Weight / Qty</th>
                  <th className="p-3">Reward Points</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {pickups.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-3">{p.wasteType}</td>
                    <td className="p-3 font-bold">{p.weightKg || p.estimatedWeightKg} kg</td>
                    <td className="p-3 font-bold text-emerald-600">+{p.rewardPoints} pts</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{p.pickupDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS & BADGES */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-2xl flex items-center justify-center shrink-0">
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">{ach.title}</h4>
                    {ach.unlocked && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ach.desc}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Progress</span>
                    <span className="text-emerald-700">{ach.progress}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Top Eco Champions in Nigeria</h3>
              <p className="text-xs text-slate-500">Ranked by total kg waste diverted and EcoPoints earned this month</p>
            </div>
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>

          <div className="divide-y divide-slate-100">
            {leaderboard.map((item) => (
              <div key={item.rank} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    item.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    item.rank === 2 ? 'bg-slate-200 text-slate-700' :
                    item.rank === 3 ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-500'
                  }`}>
                    #{item.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-slate-900 text-sm">{item.name}</p>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{item.city} • {item.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-emerald-700 text-sm">{item.ecoPoints.toLocaleString()} pts</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">{item.kgRecycled} kg recycled</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CASHOUT / REDEMPTION MODAL */}
      <AnimatePresence>
        {isRedeemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => { setIsRedeemModalOpen(false); setRedeemError(''); setRedeemSuccess(''); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                ✕
              </button>

              <div className="mb-6">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Wallet Cashout
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-2">Redeem EcoPoints</h2>
                <p className="text-xs text-slate-500 mt-1">
                  You have <span className="font-extrabold text-emerald-700">{currentPoints} EcoPoints</span> (₦{nairaEquivalent.toLocaleString()} value).
                </p>
              </div>

              {redeemSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center mb-4 text-xs font-bold">
                  {redeemSuccess}
                </div>
              )}

              {redeemError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-center mb-4 text-xs font-bold">
                  {redeemError}
                </div>
              )}

              <div className="space-y-3">
                {availableRedemptions.map((reward) => {
                  const Icon = reward.icon;
                  const canAfford = currentPoints >= reward.points;
                  return (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        canAfford ? 'border-slate-200 hover:border-emerald-500 bg-white' : 'border-slate-100 bg-slate-50 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${reward.color} text-white flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">{reward.title}</h4>
                          <p className="text-[11px] font-bold text-emerald-600">{reward.valueText}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRedeemSubmit(reward)}
                        disabled={!canAfford || redeeming}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                          canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {reward.points} pts
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
