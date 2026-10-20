import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 mb-4 animate-bounce">
          <Recycle className="w-8 h-8 animate-spin-slow" />
        </div>
        <p className="text-sm font-bold text-slate-900">Verifying session...</p>
        <p className="text-xs text-slate-500 mt-1">Authenticating with EcoWaste Portal</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && userProfile?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
