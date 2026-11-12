import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Database,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalView, 
    openAuthModal, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithOtp, 
    resetPassword,
    isConfigured 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authModalView === 'sign-in') {
        const { error } = await signInWithEmail(email, password);
        if (error) setErrorMsg(error.message);
      } else if (authModalView === 'sign-up') {
        if (!password || password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const { error, needsConfirmation } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error.message);
        } else if (needsConfirmation) {
          setSuccessMsg('Account created! Please check your email to confirm your account.');
        }
      } else if (authModalView === 'forgot-password') {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Password reset link sent! Check your inbox.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const { error } = await signInWithOtp(email);
      if (error) setErrorMsg(error.message);
      else setSuccessMsg('Magic link sent to your email!');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyConfigSnippet = () => {
    navigator.clipboard.writeText(`VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here`);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Background decorative glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Setup / Configuration Guidance View */}
          {!isConfigured || authModalView === 'setup' ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Manrope']">Connect Supabase</h3>
                  <p className="text-xs text-slate-500">Configure Auth & Cloud Database</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-3">
                <p className="font-semibold text-slate-800">
                  Supabase integration is fully built into DriveAI! To activate authentication and cloud sync:
                </p>
                <ol className="list-decimal pl-4 space-y-2 text-slate-600">
                  <li>
                    Create a free project at{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      supabase.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Open <b>Project Settings → API</b> and copy the Project URL and Anon Key.
                  </li>
                  <li>
                    Add them to your <code className="px-1.5 py-0.5 bg-slate-200 rounded text-emerald-700 font-mono text-[11px]">.env.local</code> file:
                  </li>
                </ol>

                <div className="relative mt-2 p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed">
                  <pre className="overflow-x-auto">
{`VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>`}
                  </pre>
                  <button
                    onClick={copyConfigSnippet}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[10px]"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-2 text-slate-500 text-[11px]">
                  💡 <i>A ready-to-run SQL schema file <code className="text-emerald-600 font-semibold">supabase/schema.sql</code> is included in your project root for table creation.</i>
                </div>
              </div>

              <button
                onClick={closeAuthModal}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Continue in Guest Mode
              </button>
            </div>
          ) : (
            /* Standard Auth Form */
            <div>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 mb-3 shadow-md shadow-emerald-500/10">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Manrope']">
                  {authModalView === 'sign-in' && 'Welcome Back'}
                  {authModalView === 'sign-up' && 'Create Your Account'}
                  {authModalView === 'forgot-password' && 'Reset Password'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {authModalView === 'sign-in' && 'Sign in to sync your shortlist, comparisons & saved cars.'}
                  {authModalView === 'sign-up' && 'Join DriveAI to get personalized recommendations and cloud sync.'}
                  {authModalView === 'forgot-password' && 'Enter your email to receive a password recovery link.'}
                </p>
              </div>

              {/* View Switcher Tabs */}
              {authModalView !== 'forgot-password' && (
                <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
                  <button
                    onClick={() => { openAuthModal('sign-in'); setErrorMsg(null); setSuccessMsg(null); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      authModalView === 'sign-in'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { openAuthModal('sign-up'); setErrorMsg(null); setSuccessMsg(null); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      authModalView === 'sign-up'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span className="leading-tight">{errorMsg}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                  <span className="leading-tight">{successMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {authModalView === 'sign-up' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {authModalView !== 'forgot-password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Password
                      </label>
                      {authModalView === 'sign-in' && (
                        <button
                          type="button"
                          onClick={() => { openAuthModal('forgot-password'); setErrorMsg(null); setSuccessMsg(null); }}
                          className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {authModalView === 'sign-in' && 'Sign In'}
                        {authModalView === 'sign-up' && 'Create Account'}
                        {authModalView === 'forgot-password' && 'Send Reset Link'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Magic Link Option */}
              {authModalView === 'sign-in' && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={handleMagicLink}
                    disabled={loading}
                    className="text-xs text-slate-600 hover:text-emerald-600 font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    Sign in with Magic Link instead
                  </button>
                </div>
              )}

              {/* Back to sign in for forgot password */}
              {authModalView === 'forgot-password' && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => { openAuthModal('sign-in'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
