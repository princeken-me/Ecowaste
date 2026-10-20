import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';
import { Recycle, Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccessMsg(`Password reset instructions have been sent to ${email}. Please check your inbox and spam folder.`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send password reset email. Please verify your address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-md w-full space-y-8">
          
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                <KeyRound className="w-6 h-6" />
              </div>
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Reset Your Password
            </h2>
            <p className="text-sm text-slate-500">
              Enter your registered EcoWaste email to receive a password recovery link
            </p>
          </div>

          <Card className="shadow-xl border-slate-200/80 p-8 space-y-6 bg-white">
            
            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-950">Reset Email Sent</p>
                  <p>{successMsg}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tunde@ecowaste.ng"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full justify-center py-3 text-base"
                icon={Mail}
              >
                Send Reset Password Link
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Remembered your password?</span>{' '}
              <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                Back to Sign In
              </Link>
            </div>

          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
