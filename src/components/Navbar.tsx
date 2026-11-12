import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Car as CarIcon,
  Compass,
  ArrowLeftRight,
  Calculator,
  Heart,
  MessageSquare,
  Search,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onOpenFinder: () => void;
  onOpenChat?: () => void;
  onOpenAiChat?: () => void;
  onOpenFavorites?: () => void;
  compareCount?: number;
  favoritesCount?: number;
  savedCarsCount?: number;
  onOpenQuickSearch?: () => void;
  hasRecommendations?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenFinder,
  onOpenChat,
  onOpenAiChat,
  onOpenFavorites,
  compareCount = 0,
  favoritesCount,
  savedCarsCount,
  hasRecommendations = false
}) => {
  const { user, profile, signOut, openAuthModal, isConfigured } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const effectiveFavCount = favoritesCount ?? savedCarsCount ?? 0;
  const handleChatOpen = onOpenChat || onOpenAiChat || (() => {});

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = profile?.fullName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('discover')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/35 transition-all">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 font-['Manrope']">
                  Drive<span className="text-emerald-600">AI</span>
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[10px] font-bold rounded">
                  IN
                </span>
              </div>
              <p className="text-[10px] text-slate-600 -mt-0.5 hidden sm:block">India Car Buying Intelligence</p>
            </div>
          </button>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          {user && (
            <button
              id="nav-tab-dashboard"
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
              My Dashboard
            </button>
          )}

          <button
            id="nav-tab-discover"
            onClick={() => onSelectTab('discover')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Discover
          </button>

          {hasRecommendations && (
            <button
              id="nav-tab-recommendations"
              onClick={() => onSelectTab('recommendations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'recommendations'
                  ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              AI Matches
            </button>
          )}

          <button
            id="nav-tab-explore"
            onClick={() => onSelectTab('explore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'explore' || activeTab === 'cars'
                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Explore Cars
          </button>

          <button
            id="nav-tab-compare"
            onClick={() => onSelectTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Compare
            {compareCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500 text-black font-bold text-[10px] rounded-full">
                {compareCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-ownership"
            onClick={() => onSelectTab('ownership')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'ownership'
                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            5-Yr Ownership
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Supabase Auth Controls */}
          {!user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('sign-in')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 hover:text-slate-900 text-xs font-medium rounded-xl border border-slate-200 hover:border-emerald-500/40 transition-all cursor-pointer"
                aria-label="Sign In"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('sign-up')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Up</span>
              </button>
              {!isConfigured && (
                <button
                  onClick={() => openAuthModal('setup')}
                  className="hidden lg:flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                  title="Configure Supabase"
                >
                  <Database className="w-3 h-3 text-amber-600" />
                  Supabase Setup
                </button>
              )}
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-emerald-500/30 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 transition-all cursor-pointer"
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="w-7 h-7 rounded-lg object-cover border border-emerald-400/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-bold text-xs flex items-center justify-center">
                    {initial}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Supabase Cloud Synced
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSelectTab('dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      My Dashboard
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenFavorites) onOpenFavorites();
                        else onSelectTab('explore');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      Saved Shortlist ({effectiveFavCount})
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('compare');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-violet-500" />
                      Compare Queue ({compareCount})
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Cars Button */}
          <button
            id="nav-favorites-btn"
            onClick={onOpenFavorites || (() => onSelectTab('explore'))}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all relative cursor-pointer"
            title="Saved Cars"
            aria-label="View Saved Cars"
          >
            <Heart className={`w-4 h-4 ${effectiveFavCount > 0 ? 'text-rose-400 fill-rose-400' : ''}`} />
            {effectiveFavCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-slate-900 font-bold text-[10px] rounded-full flex items-center justify-center">
                {effectiveFavCount}
              </span>
            )}
          </button>

          {/* AI Advisor Chat Trigger */}
          <button
            id="nav-chat-btn"
            onClick={handleChatOpen}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-emerald-500/40 text-slate-800 hover:text-emerald-600 rounded-xl transition-all shadow-sm cursor-pointer"
            title="Ask AI"
            aria-label="Ask AI"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </button>

          {/* Primary CTA */}
          <button
            id="nav-primary-finder-cta"
            onClick={onOpenFinder}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Find My Car
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden border-t border-slate-200 bg-[#F1F5F9] px-2 py-1.5 flex items-center justify-around">
        {user && (
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] ${activeTab === 'dashboard' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            Dashboard
          </button>
        )}
        <button
          onClick={() => onSelectTab('discover')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] ${activeTab === 'discover' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          Discover
        </button>
        <button
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] ${activeTab === 'explore' || activeTab === 'cars' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}
        >
          <CarIcon className="w-4 h-4 mb-0.5" />
          Cars
        </button>
        <button
          onClick={onOpenFinder}
          className="flex flex-col items-center py-1 px-2.5 text-[10px] text-emerald-600 font-bold bg-emerald-500/15 rounded-lg border border-emerald-500/30"
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-emerald-600" />
          AI Finder
        </button>
        <button
          onClick={() => onSelectTab('compare')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] relative ${activeTab === 'compare' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}
        >
          <ArrowLeftRight className="w-4 h-4 mb-0.5" />
          Compare
          {compareCount > 0 && (
            <span className="absolute 0 top-0 right-1 w-3.5 h-3.5 bg-emerald-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
              {compareCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onSelectTab('ownership')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] ${activeTab === 'ownership' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}
        >
          <Calculator className="w-4 h-4 mb-0.5" />
          Ownership
        </button>
      </div>
    </header>
  );
};
