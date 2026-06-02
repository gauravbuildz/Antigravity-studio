'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, UserPlus, LogIn, AlertCircle, Check } from 'lucide-react';

export default function AuthGateway() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If user is already authenticated, skip authentication gateway
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('antigravity_token');
      if (token) {
        router.push('/workspace');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLogin) {
        // Success login
        localStorage.setItem('antigravity_token', data.token);
        localStorage.setItem('antigravity_user_email', data.user.email);
        router.push('/workspace');
      } else {
        // Success signup
        setSuccessMsg('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg(null);
          setPassword('');
        }, 1500);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col relative overflow-hidden bg-dot-grid font-sans">
      
      {/* Glow Backdrops */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[160px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-3 mb-8 select-none text-center">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-purple-400 rounded-full pulse-dot"></div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-200 to-indigo-300">
            AntiGravity Studio
          </h1>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            Generate breathtaking, production-ready landing pages with AI-driven visual layouts.
          </p>
        </div>

        {/* Authentication Box */}
        <div className="w-full max-w-md rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-8 shadow-2xl relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-40 pointer-events-none"></div>

          {/* Form Header */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-100">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isLogin ? 'Access your digital workspace' : 'Get started with our AI website builder'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200 text-xs flex items-start space-x-2.5 animate-slide-down">
              <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-250 text-xs flex items-start space-x-2.5 animate-slide-down">
              <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-450">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-900 p-3.5 pl-10 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-sans"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-455">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-900 p-3.5 pl-10 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-sans"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white flex items-center justify-center space-x-2 transition-all relative overflow-hidden mt-6 cursor-pointer ${
                loading
                  ? 'bg-indigo-700/80 generating-shimmer cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-650 hover:opacity-95 active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                </>
              )}
            </button>
          </form>

          {/* Form Switcher */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
