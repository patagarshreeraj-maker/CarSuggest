import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import {
  Sparkles,
  Heart,
  ArrowLeftRight,
  Car as CarIcon,
  Wallet,
  ShieldCheck,
  Gauge,
  Trash2,
  ChevronRight,
  LayoutDashboard,
  TrendingUp,
  Clock,
  CalendarDays,
  Fuel,
  Users
} from 'lucide-react';
import { Car, ScoredCar, UserPreferences } from '../types';
import { CarImage } from './CarImage';

interface UserDashboardProps {
  favoriteCars: Car[];
  comparedCars: Car[];
  scoredCars: ScoredCar[];
  userPreferences: UserPreferences | null;
  onToggleFavorite: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  onViewCarDetails: (car: Car) => void;
  onStartFinder: () => void;
  onExploreCars: () => void;
  onOpenCompare: () => void;
  onViewRecommendations: () => void;
  onOpenOwnership: (car: Car) => void;
}

const statCardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.08, ease: 'easeOut' as const }
  })
};

export const UserDashboard: React.FC<UserDashboardProps> = ({
  favoriteCars,
  comparedCars,
  scoredCars,
  userPreferences,
  onToggleFavorite,
  onToggleCompare,
  onViewCarDetails,
  onStartFinder,
  onExploreCars,
  onOpenCompare,
  onViewRecommendations,
  onOpenOwnership
}) => {
  const { user } = useAuth();

  const fullName = user?.fullName || user?.email?.split('@')[0] || 'User';
  const firstName = fullName.split(' ')[0] || 'there';
  const email = user?.email;
  const avatarUrl = user?.avatarUrl;
  const memberSince = user?.createdAt ? new Date(user.createdAt) : undefined;

  const topMatches = scoredCars.slice(0, 3);
  const favIds = new Set(favoriteCars.map((c) => c.id));

  const formatDate = (d?: Date) => {
    if (!d) return null;
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const matchedIds = new Set(scoredCars.map((s) => s.car.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ---- Welcome Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-sm"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#ff5a1f]/10 blur-[100px] pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={firstName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#ff5a1f]/40 shadow-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#101624] dark:bg-white flex items-center justify-center text-white dark:text-[#101624] font-extrabold text-3xl border-2 border-[#ff5a1f]/40 shadow-lg">
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#ff5a1f]">
              <LayoutDashboard className="w-3.5 h-3.5" />
              CarSuggest Member Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] mt-1 tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-[#556078] dark:text-[#9aa6c0]">
              {email && <span className="flex items-center gap-1.5 truncate">{email}</span>}
              {memberSince && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#ff5a1f]" />
                  Member since {formatDate(memberSince)}
                </span>
              )}
              {userPreferences && (
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-[#ff5a1f]" />
                  ₹{userPreferences.budgetMinLakh}–{userPreferences.budgetMaxLakh}L · {userPreferences.primaryUsage}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onStartFinder}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#101624] dark:bg-[#eef2fb] hover:bg-black dark:hover:bg-white text-white dark:text-[#101624] font-bold text-xs rounded-full shadow-lg hover:shadow-[0_8px_20px_-4px_#ff5a1f] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
            New AI Search
          </button>
        </div>
      </motion.div>

      {/* ---- Quick Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          {
            label: 'Saved Cars',
            value: favoriteCars.length,
            icon: Heart,
            color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
            onClick: onExploreCars
          },
          {
            label: 'Compare Queue',
            value: comparedCars.length,
            icon: ArrowLeftRight,
            color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
            onClick: onOpenCompare
          },
          {
            label: 'AI Matches',
            value: scoredCars.length,
            icon: TrendingUp,
            color: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20',
            onClick: onViewRecommendations
          },
          {
            label: 'Top Match Score',
            value: topMatches.length > 0 ? `${Math.round(topMatches[0].scores.overallScore)}%` : '—',
            icon: Gauge,
            color: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
            onClick: onViewRecommendations
          }
        ].map((stat, i) => (
          <motion.button
            key={stat.label}
            custom={i}
            variants={statCardVariants}
            initial="hidden"
            animate="show"
            onClick={stat.onClick}
            className="glass-panel rounded-2xl p-4 text-left hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Manrope']">{stat.value}</div>
            <div className="text-[11px] text-slate-500 font-medium">{stat.label}</div>
          </motion.button>
        ))}
      </div>

      {/* ---- Main Grid ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Cars */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Saved Cars
              <span className="text-[10px] text-slate-500 font-medium normal-case">({favoriteCars.length})</span>
            </h2>
            {favoriteCars.length > 0 && (
              <button
                onClick={onExploreCars}
                className="text-[11px] text-emerald-600 hover:text-emerald-600 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                Browse all <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {favoriteCars.length === 0 ? (
            <div className="glass-panel rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400 mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No saved cars yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Tap the heart on any car to build your shortlist — it will appear here instantly.
              </p>
              <button
                onClick={onExploreCars}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Explore 215 Cars
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {favoriteCars.map((car, idx) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.06, ease: 'easeOut' }}
                  className="glass-panel rounded-2xl p-3 flex items-center gap-3 hover:border-slate-300 transition-all group"
                >
                  <div
                    className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
                    onClick={() => onViewCarDetails(car)}
                  >
                    <CarImage
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      brand={car.brand}
                      model={car.model}
                      bodyType={car.bodyType}
                      isEV={car.fuelTypes.includes('Electric')}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold text-emerald-600 uppercase">{car.brand}</div>
                    <div className="text-sm font-bold text-slate-900 truncate font-['Manrope']">{car.model}</div>
                    <div className="text-[11px] text-slate-500">
                      ₹{car.priceMinLakh}L – ₹{car.priceMaxLakh}L · {car.bodyType}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onToggleCompare(car)}
                      title={favIds.has(car.id) && comparedCars.some((c) => c.id === car.id) ? 'In compare queue' : 'Add to compare'}
                      className={`p-2 rounded-lg border transition-all cursor-pointer ${
                        comparedCars.some((c) => c.id === car.id)
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600'
                          : 'bg-slate-100/70 border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-500/40'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onViewCarDetails(car)}
                      className="p-2 rounded-lg bg-slate-100/70 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer"
                      title="View specs"
                    >
                      <CarIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleFavorite(car)}
                      className="p-2 rounded-lg bg-slate-100/70 border border-slate-200 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* AI Matches */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: 'easeOut' }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              My AI Matches
              <span className="text-[10px] text-slate-500 font-medium normal-case">({scoredCars.length})</span>
            </h2>
            {scoredCars.length > 0 && (
              <button
                onClick={onViewRecommendations}
                className="text-[11px] text-emerald-600 hover:text-emerald-600 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {topMatches.length === 0 ? (
            <div className="glass-panel rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No AI matches yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Run the AI Car Finder or type a natural-language prompt to get your personalized shortlist.
              </p>
              <button
                onClick={onStartFinder}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Start AI Finder
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {topMatches.map((match, idx) => {
                const car = match.car;
                const score = Math.round(match.scores.overallScore);
                return (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 + idx * 0.08, ease: 'easeOut' }}
                    className="glass-panel rounded-2xl p-3 flex items-center gap-3 hover:border-emerald-500/30 transition-all group"
                  >
                    <div
                      className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
                      onClick={() => onViewCarDetails(car)}
                    >
                      <CarImage
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        brand={car.brand}
                        model={car.model}
                        bodyType={car.bodyType}
                        isEV={car.fuelTypes.includes('Electric')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-bold text-emerald-600 uppercase">{car.brand}</div>
                      <div className="text-sm font-bold text-slate-900 truncate font-['Manrope']">{car.model}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + idx * 0.1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              score >= 85
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-300'
                                : score >= 70
                                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-300'
                                  : 'bg-gradient-to-r from-amber-500 to-amber-300'
                            }`}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 w-10 text-right">{score}%</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => onOpenOwnership(car)}
                        className="px-2.5 py-1.5 bg-slate-100/80 hover:bg-emerald-500/15 border border-slate-200 hover:border-emerald-500/40 text-slate-600 hover:text-emerald-600 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
                      >
                        5-Yr TCO
                      </button>
                      <button
                        onClick={() => onToggleFavorite(car)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          favIds.has(car.id)
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                            : 'bg-slate-100/70 border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-500/40'
                        }`}
                        title={favIds.has(car.id) ? 'Remove from saved' : 'Save car'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${favIds.has(car.id) ? 'fill-rose-400' : ''}`} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Preference summary */}
          {userPreferences && (
            <div className="glass-panel rounded-2xl p-4 mt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Your Preferences
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-3 h-3 text-emerald-600" /> ₹{userPreferences.budgetMinLakh}–{userPreferences.budgetMaxLakh} Lakh
                </span>
                <span className="flex items-center gap-1.5">
                  <Fuel className="w-3 h-3 text-emerald-600" /> {userPreferences.preferredFuel.join(' / ') || 'Any'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-emerald-600" /> {userPreferences.familySize} seats
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-emerald-600" /> {userPreferences.monthlyKm} km/mo
                </span>
              </div>
            </div>
          )}
        </motion.section>
      </div>

      {/* ---- Quick Actions ---- */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        {[
          {
            label: 'AI Car Finder',
            desc: 'Guided 5-step matching',
            icon: Sparkles,
            onClick: onStartFinder,
            accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/25 text-emerald-600'
          },
          {
            label: 'Explore All Cars',
            desc: '215 models, all brands',
            icon: CarIcon,
            onClick: onExploreCars,
            accent: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/25 text-cyan-600'
          },
          {
            label: 'Compare Cars',
            desc: `${comparedCars.length}/4 in queue`,
            icon: ArrowLeftRight,
            onClick: onOpenCompare,
            accent: 'from-violet-500/20 to-violet-500/5 border-violet-500/25 text-violet-600'
          },
          {
            label: 'Ownership Studio',
            desc: '5-year TCO planner',
            icon: Wallet,
            onClick: () => onOpenOwnership(favoriteCars[0] || topMatches[0]?.car || comparedCars[0]),
            accent: 'from-amber-500/20 to-amber-500/5 border-amber-500/25 text-amber-600'
          }
        ].map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`rounded-2xl p-4 bg-gradient-to-br border ${action.accent} hover:brightness-125 transition-all text-left cursor-pointer group`}
          >
            <action.icon className="w-5 h-5 mb-2.5 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-bold text-slate-900 font-['Manrope']">{action.label}</div>
            <div className="text-[11px] text-slate-500">{action.desc}</div>
          </button>
        ))}
      </motion.div>
    </div>
  );
};
