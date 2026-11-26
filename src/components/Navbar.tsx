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
  Percent,
  MapPin,
  Zap,
  Sun,
  Moon
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
  onOpenEmiCalculator?: () => void;
  onOpenOnRoadPrice?: () => void;
  onOpenEvBreakEven?: () => void;
  onOpenAuthModal?: (view?: 'sign-in' | 'sign-up') => void;
  isDark?: boolean;
  onToggleDark?: () => void;
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
  hasRecommendations = false,
  onOpenEmiCalculator,
  onOpenOnRoadPrice,
  onOpenEvBreakEven,
  onOpenAuthModal,
  isDark = false,
  onToggleDark
}) => {
  const { user, signOut } = useAuth();
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

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#e8edf4]/85 dark:bg-[#0a1020]/85 backdrop-blur-xl border-b border-[#101624]/10 dark:border-white/10 transition-colors">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8 2xl:max-w-[1680px]">
        {/* Brand Logo matching CarSuggest style */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => onSelectTab('discover')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#101624] dark:bg-[#eef2fb] flex items-center justify-center text-white dark:text-[#101624] shadow-sm group-hover:scale-105 transition-transform">
              <CarIcon className="w-4 h-4 text-[#ff5a1f]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Unbounded',sans-serif] text-base font-bold tracking-tight text-[#101624] dark:text-[#eef2fb] sm:text-lg md:text-xl">
                Car<b className="text-[#ff5a1f]">Suggest</b>
              </span>
              <span className="hidden whitespace-nowrap rounded-full border border-[#ff5a1f]/25 bg-[#ff5a1f]/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#ff5a1f] sm:inline-block">
                INDIA
              </span>
            </div>
          </button>
        </div>

        {/* Center Navigation Links in Pill Strip */}
        <nav className="hidden shrink-0 items-center gap-0.5 rounded-full border border-[#101624]/10 bg-white/70 p-1 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60 xl:flex">
          {user && (
            <button
              id="nav-tab-dashboard"
              onClick={() => onSelectTab('dashboard')}
              className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#101624] text-white dark:bg-white dark:text-[#101624] shadow-sm'
                  : 'text-[#556078] dark:text-[#9aa6c0] hover:text-[#101624] dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#ff5a1f]" />
              Dashboard
            </button>
          )}

          <button
            id="nav-tab-discover"
            onClick={() => onSelectTab('discover')}
            className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-all ${
              activeTab === 'discover'
                ? 'bg-[#101624] text-white dark:bg-white dark:text-[#101624] shadow-sm'
                : 'text-[#556078] dark:text-[#9aa6c0] hover:text-[#101624] dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Discover
          </button>

          {hasRecommendations && (
            <button
              id="nav-tab-recommendations"
              onClick={() => onSelectTab('recommendations')}
              className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-[#101624] text-white dark:bg-white dark:text-[#101624] shadow-sm'
                  : 'text-[#556078] dark:text-[#9aa6c0] hover:text-[#101624] dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff5a1f]" />
              AI Matches
            </button>
          )}

          <button
            id="nav-tab-explore"
            onClick={() => onSelectTab('explore')}
            className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-all ${
              activeTab === 'explore' || activeTab === 'cars'
                ? 'bg-[#101624] text-white dark:bg-white dark:text-[#101624] shadow-sm'
                : 'text-[#556078] dark:text-[#9aa6c0] hover:text-[#101624] dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Browse Cars
          </button>

          <button
            id="nav-tab-compare"
            onClick={() => onSelectTab('compare')}
            className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-all ${
              activeTab === 'compare'
                ? 'bg-[#101624] text-white dark:bg-white dark:text-[#101624] shadow-sm'
                : 'text-[#556078] dark:text-[#9aa6c0] hover:text-[#101624] dark:hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Compare
            {compareCount > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff5a1f] px-1 text-[10px] font-bold leading-none text-white">
                {compareCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-ownership"
            onClick={() => onSelectTab('ownership')}
            className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-all ${
              activeTab === 'ownership'
                ? 'bg-[#101624] text-white dark:bg-white dark:text-[#101624] shadow-sm'
                : 'text-[#556078] dark:text-[#9aa6c0] hover:text-[#101624] dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Ownership
          </button>

          {onOpenEmiCalculator && (
            <button
              onClick={onOpenEmiCalculator}
              className="hidden h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-semibold text-[#556078] transition-all hover:bg-[#ff5a1f]/10 hover:text-[#ff5a1f] dark:text-[#9aa6c0] min-[1440px]:flex"
              title="Car Loan & EMI Calculator"
            >
              <Percent className="w-3.5 h-3.5 text-[#ff5a1f]" />
              <span className="hidden min-[1700px]:inline">EMI Calc</span>
            </button>
          )}

          {onOpenOnRoadPrice && (
            <button
              onClick={onOpenOnRoadPrice}
              className="hidden h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-semibold text-[#556078] transition-all hover:bg-[#ff5a1f]/10 hover:text-[#ff5a1f] dark:text-[#9aa6c0] min-[1440px]:flex"
              title="State-wise On-Road Price Estimator"
            >
              <MapPin className="w-3.5 h-3.5 text-[#ff5a1f]" />
              <span className="hidden min-[1700px]:inline">On-Road</span>
            </button>
          )}

          {onOpenEvBreakEven && (
            <button
              onClick={onOpenEvBreakEven}
              className="hidden h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-semibold text-[#556078] transition-all hover:bg-[#ff5a1f]/10 hover:text-[#ff5a1f] dark:text-[#9aa6c0] min-[1440px]:flex"
              title="EV vs Petrol Break-Even Simulator"
            >
              <Zap className="w-3.5 h-3.5 text-[#ff5a1f]" />
              <span className="hidden min-[1700px]:inline">EV Sim</span>
            </button>
          )}
        </nav>

        {/* Action Controls & Authentication */}
        <div className="flex shrink-0 items-center gap-1.5">
          {!user ? (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('sign-in') : undefined)}
                className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-semibold text-[#101624] transition-all hover:bg-black/5 dark:text-[#eef2fb] dark:hover:bg-white/10"
                aria-label="Sign In"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0 text-[#ff5a1f]" />
                <span className="hidden whitespace-nowrap md:inline">Sign In</span>
              </button>
              <button
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('sign-up') : undefined)}
                className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#101624]/15 bg-white/70 px-3 text-xs font-bold text-[#101624] transition-all hover:bg-white dark:border-white/15 dark:bg-slate-800 dark:text-[#eef2fb] dark:hover:bg-slate-700"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0 text-[#ff5a1f]" />
                <span className="hidden whitespace-nowrap md:inline">Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#101624]/15 bg-white/60 pl-2.5 pr-2 transition-all hover:bg-white dark:border-white/15 dark:bg-slate-800/60 dark:hover:bg-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-[#101624] dark:bg-white text-white dark:text-[#101624] font-bold text-xs flex items-center justify-center">
                  {initial}
                </div>
                <span className="text-xs font-semibold text-[#101624] dark:text-[#eef2fb] max-w-[100px] truncate hidden sm:inline">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-[#101624]/10 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-[#101624] dark:text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSelectTab('dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#ff5a1f]" />
                      My Dashboard
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenFavorites) onOpenFavorites();
                        else onSelectTab('explore');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      Saved Shortlist ({effectiveFavCount})
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('compare');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#ff5a1f]" />
                      Compare Queue ({compareCount})
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Cars Quick Pill */}
          <button
            id="nav-favorites-btn"
            onClick={onOpenFavorites || (() => onSelectTab('explore'))}
            className="relative inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-all hover:bg-black/5 hover:text-rose-500 dark:text-slate-300 dark:hover:bg-white/10"
            title="Saved Cars"
            aria-label="View Saved Cars"
          >
            <Heart className={`w-4 h-4 ${effectiveFavCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {effectiveFavCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                {effectiveFavCount}
              </span>
            )}
          </button>

          {/* AI Advisor Chat Button */}
          <button
            id="nav-chat-btn"
            onClick={handleChatOpen}
            className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-all hover:bg-black/5 hover:text-[#ff5a1f] dark:text-slate-300 dark:hover:bg-white/10"
            title="Ask AI"
            aria-label="Ask AI"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          {onToggleDark && (
            <button
              onClick={onToggleDark}
              className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-all hover:bg-black/5 hover:text-[#ff5a1f] dark:text-slate-300 dark:hover:bg-white/10"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Primary CTA Button matching the HTML CarSuggest style */}
          <button
            id="nav-primary-finder-cta"
            onClick={onOpenFinder}
            className="hidden h-9 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#101624] px-5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_#ff5a1f] dark:bg-[#eef2fb] dark:text-[#101624] sm:inline-flex"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff5a1f]" />
            Find My Car
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar in CarSuggest style */}
      <div className="flex items-center justify-around border-t border-[#101624]/10 bg-[#e8edf4]/95 px-2 py-1.5 backdrop-blur-md dark:border-white/10 dark:bg-[#0a1020]/95 xl:hidden">
        {user && (
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
              activeTab === 'dashboard' ? 'text-[#ff5a1f]' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            Dashboard
          </button>
        )}
        <button
          onClick={() => onSelectTab('discover')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
            activeTab === 'discover' ? 'text-[#ff5a1f]' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          Discover
        </button>
        <button
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
            activeTab === 'explore' || activeTab === 'cars' ? 'text-[#ff5a1f]' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <CarIcon className="w-4 h-4 mb-0.5" />
          Cars
        </button>
        <button
          onClick={onOpenFinder}
          className="flex flex-col items-center py-1 px-3 text-[10px] text-white font-bold bg-[#101624] rounded-full shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 mb-0.5 text-[#ff5a1f]" />
          Finder
        </button>
        <button
          onClick={() => onSelectTab('compare')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold relative ${
            activeTab === 'compare' ? 'text-[#ff5a1f]' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 mb-0.5" />
          Compare
          {compareCount > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-[#ff5a1f] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {compareCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onSelectTab('ownership')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
            activeTab === 'ownership' ? 'text-[#ff5a1f]' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Calculator className="w-4 h-4 mb-0.5" />
          Ownership
        </button>
      </div>
    </header>
  );
};
