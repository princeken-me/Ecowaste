import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';
import { Recycle, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-slate-50 text-slate-900">
        <div className="max-w-md w-full text-center space-y-6">
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl mx-auto flex items-center justify-center font-black text-3xl shadow-lg shadow-emerald-600/10">
            <Recycle className="w-10 h-10 animate-spin-slow" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              404 Page Not Found
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Recycling Route Not Found
            </h1>
            <p className="text-sm text-slate-600">
              The page or resource you are looking for has been moved or recycled.
            </p>
          </div>

          <Card className="p-6 space-y-3 bg-white border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Quick Navigation Options:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                icon={Home}
                className="justify-center"
              >
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                icon={LayoutDashboard}
                className="justify-center"
              >
                My Dashboard
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </PageTransition>
  );
}
