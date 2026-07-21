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

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${provider}/url`);
      if (!response.ok) {
        throw new Error(`Failed to initiate ${provider} authentication`);
      }
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Authentication endpoint did not return a valid url');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );

  const GithubIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col relative overflow-y-auto bg-dot-grid font-sans">
      
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

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-900"></div>
            </div>
            <span className="relative px-3 bg-slate-950 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Or Continue With
            </span>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="py-3 px-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-900/30 text-xs font-semibold text-slate-200 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleOAuth('github')}
              disabled={loading}
              className="py-3 px-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-900/30 text-xs font-semibold text-slate-200 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
            >
              <GithubIcon />
              <span>GitHub</span>
            </button>
          </div>

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
