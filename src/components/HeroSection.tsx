import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Fuel,
  Users,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  TrendingUp,
  Award,
  ChevronDown,
  MapPin,
  Car as CarIcon,
  Wallet,
  Gauge
} from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  type Variants
} from 'motion/react';
import { Car } from '../types';
import { CarImage } from './CarImage';

interface HeroSectionProps {
  onStartFinder: () => void;
  onExploreCars: () => void;
  onNaturalLanguageSearch: (query: string) => void;
  onSelectCategory: (category: string) => void;
  featuredCars: Car[];
  onViewCarDetails: (car: Car) => void;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' }
  }
};

const badgeGridVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.5 }
  }
};

const badgeItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const rotatingPhrases = [
  'right for you.',
  'safe for your family.',
  'within your budget.',
  'fuel-efficient for daily drives.'
];

const BUDGETS = [
  'Under ₹8 Lakh',
  '₹8 – 15 Lakh',
  '₹15 – 25 Lakh',
  '₹25 – 50 Lakh',
  '₹50 Lakh+'
];

const BODY_TYPES = [
  'Any Body Type',
  'Hatchback',
  'Sedan',
  'Compact SUV',
  'SUV',
  'MPV',
  'Coupe',
  'Convertible',
  'Supercar'
];

const FUELS = [
  'Any Fuel',
  'Petrol',
  'Diesel',
  'Electric',
  'Strong Hybrid',
  'CNG'
];

const USAGES = [
  'City Commute',
  'Highway Cruising',
  'Family Trips',
  'Off-Road Adventure'
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartFinder,
  onExploreCars,
  onNaturalLanguageSearch,
  onSelectCategory,
  featuredCars,
  onViewCarDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [bodyType, setBodyType] = useState(BODY_TYPES[0]);
  const [fuel, setFuel] = useState(FUELS[0]);
  const [usage, setUsage] = useState(USAGES[0]);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax: 3D scene drifts down + fades as you scroll away
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  // ---- Layered 3D mouse parallax (fintech hero style) ----
  // Each depth layer moves at a different intensity for real parallax depth.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 90, damping: 20 });
  const sy = useSpring(my, { stiffness: 90, damping: 20 });

  // Main card tilt (strongest)
  const rotateX = useSpring(useTransform(sy, [0, 1], [10, -10]), { stiffness: 160, damping: 22 });
  const rotateY = useSpring(useTransform(sx, [0, 1], [-12, 12]), { stiffness: 160, damping: 22 });

  // Depth layer translations: back layers drift opposite the mouse, front layers follow
  const backX = useTransform(sx, [0, 1], [18, -18]);
  const backY = useTransform(sy, [0, 1], [14, -14]);
  const midX = useTransform(sx, [0, 1], [10, -10]);
  const midY = useTransform(sy, [0, 1], [8, -8]);
  const frontX = useTransform(sx, [0, 1], [-16, 16]);
  const frontY = useTransform(sy, [0, 1], [-12, 12]);
  const chipX = useTransform(sx, [0, 1], [-24, 24]);
  const chipY = useTransform(sy, [0, 1], [-18, 18]);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleTiltLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  // Rotate headline phrase on an interval
  useEffect(() => {
    const t = setInterval(() => setPhraseIdx((i) => (i + 1) % rotatingPhrases.length), 3000);
    return () => clearInterval(t);
  }, []);

  const buildBookingQuery = () => {
    const parts: string[] = [];
    if (budget !== BUDGETS[0]) parts.push(`under ${budget.replace('Under ', '').split(' ').slice(0, 2).join(' ')}`);
    if (fuel !== FUELS[0]) parts.push(fuel === 'Any Fuel' ? '' : fuel === 'Strong Hybrid' ? 'strong hybrid' : fuel.toLowerCase());
    if (bodyType !== BODY_TYPES[0]) parts.push(`${bodyType} for ${usage.toLowerCase()}`);
    else parts.push(`for ${usage.toLowerCase()}`);
    return `Find me a ${parts.filter(Boolean).join(', ')} with good safety`;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNaturalLanguageSearch(buildBookingQuery());
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNaturalLanguageSearch(searchQuery.trim());
    }
  };

  const samplePrompts = [
    'Family 7-seater SUV under 20 Lakhs with high safety',
    'Automatic EV with 400km range for city commute',
    'High mileage hybrid car under 18 Lakhs'
  ];

  const nexon = featuredCars.find((c) => c.id === 'tata-nexon-ev');

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
      className="relative overflow-hidden pt-4 pb-14 lg:pb-20"
    >
      {/* ---- Fintech-style deep gradient background ---- */}
      <div className="absolute inset-0 -z-20 bg-[#F7F9FC]" />
      {/* Large glow orbs (breathing) */}
      <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full bg-emerald-600/15 blur-[140px] pointer-events-none -z-20">
        <motion.div
          animate={{ scale: [1, 1.22, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full rounded-full bg-emerald-500/20 blur-[140px]"
        />
      </div>
      <div className="absolute top-1/4 -right-40 w-[560px] h-[560px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none -z-20">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          className="w-full h-full rounded-full bg-cyan-400/15 blur-[130px]"
        />
      </div>
      <div className="absolute bottom-0 left-1/3 w-[480px] h-[320px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none -z-20">
        <motion.div
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          className="w-full h-full rounded-full bg-violet-500/15 blur-[120px]"
        />
      </div>
      {/* Subtle dotted grid texture */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)'
        }}
      />

      <motion.div style={{ y: sceneY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:min-h-[calc(100vh-140px)] pt-6 lg:pt-10">
          {/* Left Column: Messaging + Booking Panel */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 space-y-6"
          >
            {/* Supertag Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-emerald-400/30 backdrop-blur-xl text-emerald-600 text-xs font-semibold"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Next-Gen Automotive Recommendation Engine</span>
            </motion.div>

            {/* Main Headline with rotating phrase */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-slate-900 tracking-tight leading-[1.08] font-['Manrope']"
            >
              Find the car that’s <br className="hidden sm:inline" />
              <span className="relative inline-block align-bottom min-h-[1.15em] overflow-hidden">
                <motion.span
                  key={phraseIdx}
                  initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 animate-gradient-x bg-[length:200%_auto]"
                >
                  {rotatingPhrases[phraseIdx]}
                </motion.span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-600/95 max-w-xl font-normal leading-relaxed"
            >
              Tell us your budget, lifestyle, and priorities. DriveAI evaluates crash safety, real-world mileage, ownership costs, and features to recommend your perfect match.
            </motion.p>

            {/* ---- Glassmorphism Booking Panel ---- */}
            <motion.div variants={itemVariants} className="pt-1">
              <form
                onSubmit={handleBookingSubmit}
                className="glass-panel-glow rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xl shadow-black/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-600/90">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Personalise your search
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> AI-powered
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Budget', icon: Wallet, value: budget, set: setBudget, options: BUDGETS },
                    { label: 'Body Type', icon: CarIcon, value: bodyType, set: setBodyType, options: BODY_TYPES },
                    { label: 'Fuel', icon: Fuel, value: fuel, set: setFuel, options: FUELS },
                    { label: 'Usage', icon: MapPin, value: usage, set: setUsage, options: USAGES }
                  ].map((f) => (
                    <label
                      key={f.label}
                      className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/70 border border-slate-200 hover:border-emerald-400/40 focus-within:border-emerald-400/50 transition-all cursor-pointer"
                    >
                      <f.icon className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-500">{f.label}</span>
                        <span className="relative block">
                          <select
                            value={f.value}
                            onChange={(e) => f.set(e.target.value)}
                            className="w-full appearance-none bg-transparent border-none text-xs font-semibold text-slate-900 focus:outline-none pr-4 cursor-pointer"
                          >
                            {f.options.map((o) => (
                              <option key={o} value={o} className="bg-white text-slate-900">
                                {o}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze with AI
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onStartFinder}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-900 font-semibold text-sm rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                    Find My Car (AI Guided)
                  </button>
                </div>
              </form>

              {/* Free-text search + sample prompt chips */}
              <div className="mt-3.5">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-stretch gap-1.5 p-1.5 bg-slate-100/70 backdrop-blur-xl border border-slate-200 focus-within:border-emerald-500/40 rounded-2xl transition-all"
                >
                  <div className="flex-1 flex items-center pl-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <input
                      id="hero-ai-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="E.g. Safe automatic SUV for family under 16 Lakhs..."
                      className="w-full bg-transparent border-none text-sm text-slate-900 placeholder-slate-500 focus:outline-none py-2"
                    />
                  </div>
                  <button
                    id="hero-ai-search-btn"
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Search
                  </button>
                </form>

                <div className="flex items-center flex-wrap gap-1.5 pt-2.5">
                  <span className="text-[11px] text-slate-500 font-medium">Try:</span>
                  {samplePrompts.map((prompt, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + idx * 0.12, duration: 0.4 }}
                      onClick={() => {
                        setSearchQuery(prompt);
                        onNaturalLanguageSearch(prompt);
                      }}
                      className="text-[11px] text-slate-600 hover:text-emerald-600 bg-slate-100/80 hover:bg-white/[0.1] border border-slate-200 hover:border-emerald-500/30 px-2.5 py-1 rounded-lg backdrop-blur-md transition-all text-left truncate max-w-[280px] cursor-pointer"
                    >
                      “{prompt}”
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Trust Metrics Bar */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200"
            >
              <div>
                <div className="text-xl font-bold text-slate-900 font-['Manrope']">215+</div>
                <div className="text-xs text-slate-500">Verified Indian Models</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-600 font-['Manrope']">5-Star</div>
                <div className="text-xs text-slate-500">BNCAP Safety First</div>
              </div>
              <div>
                <div className="text-xl font-bold text-cyan-600 font-['Manrope']">5-Year</div>
                <div className="text-xs text-slate-500">TCO Cost Predictor</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Layered 3D Scene (fintech hero style) */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="lg:col-span-5 relative hidden md:block"
          >
            <div className="relative" style={{ perspective: 1400 }}>
              {/* Rotating conic gradient ring behind everything */}
              <motion.div
                style={{ x: backX, y: backY }}
                className="absolute -inset-10 -z-10 rounded-full"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-full rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,229,153,0.28) 12%, transparent 26%, rgba(0,240,255,0.2) 40%, transparent 55%, rgba(16,185,129,0.22) 70%, transparent 85%)',
                    filter: 'blur(50px)'
                  }}
                />
              </motion.div>

              {/* Main 3D floating card */}
              <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative will-change-transform"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative rounded-3xl glass-panel-glow p-4 border border-slate-200 shadow-2xl shadow-black/70 overflow-hidden group"
                >
                  {/* Featured Vehicle Image */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
                    <CarImage
                      src={nexon?.image}
                      alt="Tata Nexon.ev Electric SUV"
                      brand="Tata"
                      model="Nexon.ev"
                      bodyType="Compact SUV"
                      isEV={true}
                      className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-transparent to-transparent opacity-80 pointer-events-none" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-[11px] font-medium text-slate-100">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Top Rated Electric SUV
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <div className="text-xs font-semibold text-emerald-600 tracking-wide uppercase">Tata Nexon.ev</div>
                        <div className="text-lg font-bold text-slate-900 font-['Manrope'] drop-shadow">₹12.49 L – ₹17.19 L</div>
                      </div>
                      <button
                        onClick={() => {
                          if (nexon) onViewCarDetails(nexon);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-500 hover:text-black text-slate-900 text-xs font-medium rounded-lg backdrop-blur-md transition-all cursor-pointer"
                      >
                        View Specs
                      </button>
                    </div>
                  </div>

                  {/* Floating Live AI Cards */}
                  <motion.div
                    variants={badgeGridVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-2.5 mt-3"
                  >
                    <motion.div
                      variants={badgeItemVariants}
                      whileHover={{ y: -4 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 hover:border-emerald-500/30 backdrop-blur-md transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          Safety 5★ <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="text-[10px] text-slate-500">BNCAP Certified</div>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={badgeItemVariants}
                      whileHover={{ y: -4 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 hover:border-cyan-500/30 backdrop-blur-md transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          ₹1.1 / km <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                        </div>
                        <div className="text-[10px] text-slate-500">Ultra-low Running Cost</div>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={badgeItemVariants}
                      whileHover={{ y: -4 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 hover:border-amber-500/30 backdrop-blur-md transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">465 km Range</div>
                        <div className="text-[10px] text-slate-500">45 kWh Battery Pack</div>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={badgeItemVariants}
                      whileHover={{ y: -4 }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-400/30 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-bold text-emerald-600">96% MATCH</div>
                          <div className="text-[10px] text-slate-500">City Commuters</div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Floating chip: top-right (Range) - front depth layer */}
                <motion.div
                  style={{ x: frontX, y: frontY }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5, ease: 'easeOut' }}
                  className="absolute -right-4 md:-right-9 top-10 z-10"
                >
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F5F9]/80 backdrop-blur-xl border border-cyan-400/30 shadow-xl shadow-black/50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">465 km</div>
                      <div className="text-[10px] text-slate-500">Single Charge</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Floating chip: bottom-left (Safety) - mid depth */}
                <motion.div
                  style={{ x: midX, y: midY }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.25, duration: 0.5, ease: 'easeOut' }}
                  className="absolute -left-4 md:-left-9 bottom-24 z-10"
                >
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F5F9]/80 backdrop-blur-xl border border-emerald-400/30 shadow-xl shadow-black/50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">5★ BNCAP</div>
                      <div className="text-[10px] text-slate-500">Crash Safety</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Floating chip: far-left (TCO) - mid depth */}
                <motion.div
                  style={{ x: midX, y: midY }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.5, ease: 'easeOut' }}
                  className="absolute -left-2 md:-left-6 top-24 z-10 hidden sm:block"
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F5F9]/80 backdrop-blur-xl border border-violet-400/30 shadow-xl shadow-black/50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                      <Gauge className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">₹8.2L</div>
                      <div className="text-[10px] text-slate-500">5-Yr TCO Savings</div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Quick Category Discovery Pills */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
          }}
          className="mt-14 pt-8 border-t border-slate-200"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              Quick Segment Discovery
            </h2>
            <button
              onClick={onExploreCars}
              className="text-xs text-emerald-600 hover:text-emerald-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              Browse All Cars &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {[
              { label: 'Electric SUVs', filter: 'Electric', icon: Zap, count: '6 models' },
              { label: '5-Star Safety', filter: '5-Star', icon: ShieldCheck, count: '10+ models' },
              { label: 'Strong Hybrids', filter: 'Strong Hybrid', icon: Fuel, count: '27+ km/l' },
              { label: '7-Seater MPVs', filter: '7-Seater', icon: Users, count: 'Spacious' },
              { label: 'Under ₹12 Lakhs', filter: 'Under12L', icon: Award, count: 'Value Picks' },
              { label: 'Level 2 ADAS', filter: 'ADAS', icon: Sparkles, count: 'Smart Assist' }
            ].map((cat, idx) => (
              <motion.button
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: 'easeOut' }
                  }
                }}
                whileHover={{ y: -5, scale: 1.03 }}
                onClick={() => onSelectCategory(cat.filter)}
                className="p-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 hover:border-emerald-500/40 backdrop-blur-md text-left transition-all group cursor-pointer"
              >
                <cat.icon className="w-4 h-4 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 group-hover:text-slate-900">{cat.label}</div>
                <div className="text-[10px] text-slate-500">{cat.count}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
