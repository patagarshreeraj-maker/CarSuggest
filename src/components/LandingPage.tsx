import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Fuel,
  ArrowUpRight,
  ChevronRight,
  Sliders,
  Check,
  Zap,
  Users,
  Map,
  Star,
  TrendingUp,
  IndianRupee,
  Car as CarIcon,
  Timer,
  Trophy,
  ChevronLeft,
  MousePointer2,
} from 'lucide-react';
import { Car } from '../types';
import { InteractiveCar3D } from './InteractiveCar3D';
import { CarImage } from './CarImage';

export interface LandingPageProps {
  cars: Car[];
  favoriteCarIds: string[];
  comparedCarIds: string[];
  onStartFinder: () => void;
  onExploreCars: () => void;
  onViewCarDetails: (car: Car) => void;
  onToggleFavorite: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
}

const CATEGORIES = [
  'Hatchbacks', 'Compact SUVs', 'Sedans', 'MPVs', 'Electric',
  'Strong Hybrid', 'CNG', 'Diesel', 'Petrol', 'Automatic', '5-Star Safety', 'Off-Road 4x4'
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI matchmaker',
    desc: 'Describe how you drive and who rides along. Get a ranked shortlist — not an endless spreadsheet.',
    color: '#ff5a1f',
    bg: 'rgba(255,90,31,0.1)'
  },
  {
    icon: IndianRupee,
    title: 'On-road price',
    desc: 'Ex-showroom to on-road in ₹ Lakhs, with state RTO, insurance and fees clearly laid out.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)'
  },
  {
    icon: ShieldCheck,
    title: 'NCAP safety',
    desc: 'Global NCAP and Bharat NCAP crash test ratings side by side, in plain honest language.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)'
  },
  {
    icon: Fuel,
    title: 'Real-world mileage',
    desc: 'ARAI lab claims next to what Indian owners actually see in bumper-to-bumper city traffic.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)'
  },
  {
    icon: Map,
    title: 'Road profiles',
    desc: 'City crawls, steep ghats, monsoon potholes and highway cruising scored per car.',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)'
  },
  {
    icon: TrendingUp,
    title: '5-Year ownership cost',
    desc: 'Fuel, service, insurance and resale depreciation mapped over the years you keep it.',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)'
  }
];

const ROAD_CONDITIONS = [
  { id: 'city', label: 'City traffic', emoji: '🏙️', hint: 'Light steering & automatic gearboxes' },
  { id: 'ghats', label: 'Ghat roads', emoji: '⛰️', hint: 'Hill-hold assist & instant torque' },
  { id: 'highway', label: 'Highway runs', emoji: '🛣️', hint: 'High-speed stability & cruise control' },
  { id: 'rough', label: 'Rough roads', emoji: '🌧️', hint: '190mm+ clearance & rugged suspension' }
];

const USE_CASES = [
  { id: 'family', label: 'Family trips', emoji: '👨‍👩‍👧‍👦' },
  { id: 'commute', label: 'Daily commute', emoji: '🏢' },
  { id: 'weekend', label: 'Weekend drives', emoji: '🏕️' },
  { id: 'highway', label: 'Highway warrior', emoji: '🚀' }
];

const STATS = [
  { value: 200, suffix: '+', label: 'Car Models', icon: CarIcon },
  { value: 28, suffix: '', label: 'Indian States', icon: Map },
  { value: 5, suffix: '-year', label: 'TCO Analysis', icon: Timer },
  { value: 98, suffix: '%', label: 'Accuracy', icon: Trophy }
];

const TRUST_BADGES = [
  'Bharat NCAP Ratings',
  'ARAI Certified Mileage',
  'RTO State-Wise Pricing',
  'Live Insurance Quotes',
  'Zero Dealer Bias'
];

// Hook: animated counter
function useCounter(target: number, duration = 1500, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

// Stat Card with animated counter
const StatCard: React.FC<{ stat: typeof STATS[0]; trigger: boolean }> = ({ stat, trigger }) => {
  const count = useCounter(stat.value, 1200, trigger);
  const Icon = stat.icon;
  return (
    <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md hover:border-[#ff5a1f]/40 transition-all group">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1" style={{ background: 'rgba(255,90,31,0.12)' }}>
        <Icon className="w-4.5 h-4.5 text-[#ff5a1f]" />
      </div>
      <div className="font-['Unbounded',sans-serif] font-black text-2xl text-[#101624] dark:text-white leading-none">
        {count}{stat.suffix}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">{stat.label}</div>
    </div>
  );
};

// Feature card with tilt effect
const FeatureCard: React.FC<{ feature: typeof FEATURES[0]; index: number }> = ({ feature, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 14;
    cardRef.current.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateZ(4px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cs-reveal p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-default group"
      style={{
        '--d': `${index * 0.07}s`,
        transitionProperty: 'border-color, box-shadow',
      } as React.CSSProperties}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        style={{ background: feature.bg }}
      >
        <Icon className="w-5 h-5" style={{ color: feature.color }} />
      </div>
      <h3 className="font-['Unbounded',sans-serif] font-semibold text-sm text-slate-900 dark:text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {feature.desc}
      </p>
    </div>
  );
};

// Typewriter component
const TYPEWRITER_WORDS = ['Indian roads.', 'Indian budgets.', 'Indian families.', 'Indian dreams.'];
const Typewriter: React.FC = () => {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = TYPEWRITER_WORDS[wordIdx];
    const speed = isDeleting ? 40 : 70;

    const timer = setTimeout(() => {
      if (!isDeleting && displayed === word) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && displayed === '') {
        setIsDeleting(false);
        setWordIdx((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
      } else {
        setDisplayed(isDeleting ? word.slice(0, displayed.length - 1) : word.slice(0, displayed.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, wordIdx]);

  return (
    <span className="text-[#ff5a1f] relative">
      {displayed}
      <span className="inline-block w-[2px] h-[0.85em] bg-[#ff5a1f] ml-0.5 align-middle animate-pulse" />
    </span>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({
  cars,
  onStartFinder,
  onExploreCars,
  onViewCarDetails
}) => {
  const [budgetLakh, setBudgetLakh] = useState<number>(12);
  const [activeRoads, setActiveRoads] = useState<string[]>(['city']);
  const [activeUseCases, setActiveUseCases] = useState<string[]>(['commute']);
  const [boostSpeed, setBoostSpeed] = useState<number>(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showDragHint, setShowDragHint] = useState(true);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for glowing ambient light
  useEffect(() => {
    const handlePointer = (e: PointerEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('pointermove', handlePointer);
    return () => window.removeEventListener('pointermove', handlePointer);
  }, []);

  // Intersection observer for section reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cs-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.cs-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Stats counter trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll progress bar + drag hint
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0);
      if (scrolled > 100) setShowDragHint(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getSegmentName = (val: number) => {
    if (val <= 8) return 'Entry & Commuter Hatchbacks';
    if (val <= 12) return 'Premium Hatchbacks & Sub-4m SUVs';
    if (val <= 18) return 'Compact SUVs & Family Sedans';
    if (val <= 30) return 'Midsize SUVs & 7-Seater MPVs';
    return 'Executive Sedans, Luxury SUVs & EVs';
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = parseFloat(e.target.value);
    setBudgetLakh(nextVal);
    setBoostSpeed((prev) => Math.max(prev + 1.2, 3.5));
    setCarouselIdx(0);
  };

  const toggleRoad = (roadId: string) => {
    setActiveRoads((prev) =>
      prev.includes(roadId) ? prev.filter((r) => r !== roadId) : [...prev, roadId]
    );
    setBoostSpeed((prev) => Math.max(prev + 2.0, 5.0));
  };

  const toggleUseCase = (id: string) => {
    setActiveUseCases((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const approximateOnRoad = (budgetLakh * 1.15).toFixed(1);
  const sliderPercentage = ((budgetLakh - 5) / (50 - 5)) * 100;

  // Matching cars from dataset
  const previewCars = useMemo(() => {
    if (!cars || !Array.isArray(cars)) return [];
    return cars
      .filter((c) => {
        const minP = c.priceMinLakh ?? 0;
        const maxP = c.priceMaxLakh ?? 100;
        return minP <= budgetLakh + 3 && maxP >= budgetLakh - 3;
      })
      .slice(0, 9);
  }, [cars, budgetLakh]);

  const visibleCars = previewCars.slice(carouselIdx, carouselIdx + 3);
  const canPrev = carouselIdx > 0;
  const canNext = carouselIdx + 3 < previewCars.length;

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#0a1020] text-[#101624] dark:text-[#eef2fb] font-['Hanken_Grotesk',sans-serif] selection:bg-[#ff5a1f]/20 selection:text-[#ff5a1f] overflow-x-hidden">
      {/* Scoped Styles */}
      <style>{`
        .cs-font-display { font-family: 'Unbounded', sans-serif; }
        @keyframes cs-dash-roll { from { transform: translateX(-30px); } to { transform: translateX(70px); } }
        .cs-dash::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 32px;
          background: #ff5a1f;
          animation: cs-dash-roll 1.2s linear infinite;
          will-change: transform;
        }
        @keyframes cs-marquee { to { transform: translateX(-50%); } }
        .cs-marquee-inner {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: cs-marquee 28s linear infinite;
        }
        .cs-marquee-inner:hover { animation-play-state: paused; }
        .cs-reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.65s cubic-bezier(.2,.8,.2,1) var(--d, 0s),
                      transform 0.65s cubic-bezier(.2,.8,.2,1) var(--d, 0s);
        }
        .cs-reveal.cs-in {
          opacity: 1;
          transform: translateY(0);
        }
        .cs-feature-row:hover {
          padding-left: 28px;
          background: linear-gradient(90deg, rgba(255,90,31,0.10), transparent);
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .cs-float { animation: float-y 3.5s ease-in-out infinite; }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .cs-spin { animation: spin-slow 12s linear infinite; }
        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }
        .cs-shimmer {
          overflow: hidden;
        }
        .cs-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,90,31,0.35), transparent);
          animation: shimmer 2.6s linear infinite;
          will-change: transform;
        }
        .btn-glow:hover {
          box-shadow: 0 0 0 4px rgba(255,90,31,0.18), 0 12px 32px -8px rgba(255,90,31,0.4);
        }
        .card-hover {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card-hover:hover {
          transform: translateY(-2px) scale(1.015);
          box-shadow: 0 12px 36px -8px rgba(0,0,0,0.12);
        }
      `}</style>

      {/* 3D WebGL Interactive Car */}
      <InteractiveCar3D boostSpeed={boostSpeed} />

      {/* Ambient Mouse Glow */}
      <div
        ref={glowRef}
        className="fixed left-0 top-0 w-[520px] h-[520px] -ml-[260px] -mt-[260px] rounded-full pointer-events-none z-0 opacity-[0.14]"
        style={{
          background: 'radial-gradient(circle, #ff5a1f 0%, transparent 68%)',
          willChange: 'transform'
        }}
      />

      {/* Decorative grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#101624 1px, transparent 1px), linear-gradient(90deg, #101624 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <main id="top" className="relative z-10">

        {/* ─────────────── SECTION 1: HERO ─────────────── */}
        <section id="hero" className="min-h-[92svh] px-[5vw] pt-24 md:pt-32 pb-16 flex flex-col justify-center max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className="cs-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md text-xs font-semibold text-slate-700 dark:text-slate-200 mb-6 shadow-sm"
              style={{ '--d': '0s' } as React.CSSProperties}
            >
              <span className="w-2 h-2 rounded-full bg-[#ff5a1f] animate-pulse" />
              <span>India's AI-powered Automotive Intelligence Engine</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#ff5a1f]/15 text-[#ff5a1f] text-[10px] font-bold">NEW</span>
            </div>

            {/* Headline with Typewriter */}
            <h1
              className="cs-reveal cs-font-display font-extrabold tracking-tight text-[clamp(2.3rem,6.2vw,5rem)] leading-[1.04] text-[#101624] dark:text-[#eef2fb] mb-5"
              style={{ '--d': '0.1s' } as React.CSSProperties}
            >
              The right car for
              <br />
              <Typewriter />
            </h1>

            {/* Subheadline */}
            <p
              className="cs-reveal text-[clamp(1rem,1.7vw,1.2rem)] text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-6"
              style={{ '--d': '0.3s' } as React.CSSProperties}
            >
              Tell us your budget, your roads and who rides along. CarSuggest weighs ex-showroom prices,
              ARAI mileage, Bharat NCAP ratings and 5-year ownership costs — then gives you a shortlist you can trust.
            </p>

            {/* Use-case quick picks */}
            <div
              className="cs-reveal flex flex-wrap gap-2 mb-7"
              style={{ '--d': '0.45s' } as React.CSSProperties}
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-center mr-1">I'm buying for:</span>
              {USE_CASES.map((uc) => (
                <button
                  key={uc.id}
                  onClick={() => toggleUseCase(uc.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    activeUseCases.includes(uc.id)
                      ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 text-[#ff5a1f] shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#ff5a1f]/40'
                  }`}
                >
                  <span>{uc.emoji}</span>
                  <span>{uc.label}</span>
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="cs-reveal flex flex-wrap items-center gap-3.5 mb-10"
              style={{ '--d': '0.55s' } as React.CSSProperties}
            >
              <button
                onClick={onStartFinder}
                className="btn-glow inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#101624] dark:bg-[#eef2fb] text-white dark:text-[#101624] font-bold text-sm hover:-translate-y-0.5 hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
              >
                <span className="cs-shimmer absolute inset-0 rounded-full" />
                <Sparkles className="w-4 h-4 text-[#ff5a1f] relative z-10" />
                <span className="relative z-10">Find my car</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </button>

              <a
                href="#fx"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-white/90 dark:hover:bg-slate-800 transition-all"
              >
                <span>See what it checks</span>
              </a>

              <button
                onClick={onExploreCars}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-slate-600 dark:text-slate-300 font-medium text-sm hover:text-[#ff5a1f] transition-all cursor-pointer"
              >
                <span>Browse 200+ models</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll cue */}
            <div
              className="cs-reveal flex items-center gap-3.5 text-xs text-slate-400 uppercase tracking-widest font-medium"
              style={{ '--d': '0.7s' } as React.CSSProperties}
            >
              <i className="cs-dash w-[70px] h-[2px] bg-slate-200 dark:bg-slate-700 relative overflow-hidden inline-block" />
              <span>Scroll to steer the 3D car</span>
            </div>
          </div>
        </section>

        {/* ─────────────── MARQUEE TICKER ─────────────── */}
        <div className="overflow-hidden whitespace-nowrap py-4 border-y border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
          <div className="cs-marquee-inner cs-font-display text-xs md:text-sm tracking-wide text-slate-500 dark:text-slate-400 font-medium uppercase">
            {[...CATEGORIES, ...CATEGORIES].map((cat, idx) => (
              <span key={idx} className="inline-flex items-center mx-5 gap-3 hover:text-[#ff5a1f] transition-colors cursor-default">
                <span>{cat}</span>
                <i className="inline-block w-2 h-2 rounded-full bg-[#ff5a1f]" />
              </span>
            ))}
          </div>
        </div>

        {/* ─────────────── SECTION 2: STATS ─────────────── */}
        <section ref={statsRef} className="px-[5vw] py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <StatCard key={i} stat={stat} trigger={statsVisible} />
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {TRUST_BADGES.map((badge, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              >
                <Check className="w-3 h-3 text-emerald-500" />
                {badge}
              </span>
            ))}
          </div>
        </section>

        {/* ─────────────── SECTION 3: FEATURES GRID ─────────────── */}
        <section id="fx" className="px-[5vw] py-[12vh] max-w-7xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff5a1f] mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Objective Evaluation</span>
            </div>
            <h2 className="cs-reveal cs-font-display font-extrabold text-[clamp(1.8rem,4vw,3rem)] leading-tight text-slate-900 dark:text-slate-100">
              Everything car buyers in India argue about, settled.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat, i) => (
              <FeatureCard key={i} feature={feat} index={i} />
            ))}
          </div>
        </section>

        {/* ─────────────── SECTION 4: INTERACTIVE BUDGET MATCHER ─────────────── */}
        <section id="try" className="px-[5vw] py-[12vh] max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-start">
            {/* Left: Controls */}
            <div className="cs-reveal" style={{ '--d': '0.1s' } as React.CSSProperties}>
              <div className="p-6 md:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ff5a1f] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Live Segment Matcher
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Real-time
                  </span>
                </div>

                <h2 className="cs-font-display font-bold text-xl md:text-2xl text-slate-900 dark:text-white mb-4">
                  What is your budget?
                </h2>

                {/* Budget Display */}
                <div className="cs-font-display font-black text-[clamp(2.6rem,5vw,3.8rem)] text-slate-900 dark:text-white leading-none tracking-tight flex items-baseline gap-2 mb-3">
                  <span className="tabular-nums transition-all duration-150">₹{budgetLakh.toFixed(1)}</span>
                  <small className="font-['Hanken_Grotesk'] text-xs font-medium text-slate-500 tracking-normal">Lakhs ex-showroom</small>
                </div>

                {/* Slider with track */}
                <div className="relative mb-5">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="0.5"
                    value={budgetLakh}
                    onChange={handleBudgetChange}
                    className="w-full accent-[#ff5a1f] h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer mb-2 relative z-10"
                    aria-label="Budget in Lakhs"
                  />
                  <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff5a1f] to-[#ff8c5a] transition-all duration-150 rounded-full"
                      style={{ width: `${sliderPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Price info cards */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                    <div className="text-[10px] text-slate-500 mb-0.5">On-road estimate</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">₹{approximateOnRoad}L</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#ff5a1f]/8 border border-[#ff5a1f]/20">
                    <div className="text-[10px] text-[#ff5a1f] mb-0.5">Market segment</div>
                    <div className="text-[11px] font-bold text-[#ff5a1f] leading-tight">{getSegmentName(budgetLakh)}</div>
                  </div>
                </div>

                {/* Road condition chips */}
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">Primary driving terrain:</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {ROAD_CONDITIONS.map((cond) => {
                    const isActive = activeRoads.includes(cond.id);
                    return (
                      <button
                        key={cond.id}
                        onClick={() => toggleRoad(cond.id)}
                        title={cond.hint}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          isActive
                            ? 'border-[#ff5a1f] bg-[#ff5a1f]/12 text-[#ff5a1f] shadow-sm shadow-[#ff5a1f]/15'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#ff5a1f]/40'
                        }`}
                      >
                        <span>{cond.emoji}</span>
                        {isActive && <Check className="w-3 h-3" />}
                        <span>{cond.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  onClick={onStartFinder}
                  className="btn-glow w-full py-3.5 rounded-full bg-[#101624] dark:bg-[#eef2fb] text-white dark:text-[#101624] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md relative overflow-hidden"
                >
                  <span className="cs-shimmer absolute inset-0" />
                  <Sparkles className="w-3.5 h-3.5 text-[#ff5a1f] relative z-10" />
                  <span className="relative z-10">Find exact matches for ₹{budgetLakh.toFixed(1)} Lakhs</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10" />
                </button>
              </div>
            </div>

            {/* Right: Live car preview carousel */}
            <div className="cs-reveal space-y-4" style={{ '--d': '0.25s' } as React.CSSProperties}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="cs-font-display font-bold text-sm text-slate-900 dark:text-white">
                    {previewCars.length} cars in this range
                  </h3>
                  <p className="text-xs text-slate-500">Updated as you move the slider</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 3))}
                    disabled={!canPrev}
                    className="p-1.5 rounded-full bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:border-[#ff5a1f]/50 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCarouselIdx(Math.min(previewCars.length - 3, carouselIdx + 3))}
                    disabled={!canNext}
                    className="p-1.5 rounded-full bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:border-[#ff5a1f]/50 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onExploreCars}
                    className="text-[11px] font-semibold text-[#ff5a1f] hover:underline flex items-center gap-0.5 cursor-pointer ml-1"
                  >
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Car Cards */}
              <div ref={carouselRef} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {visibleCars.length > 0 ? visibleCars.map((car) => (
                  <div
                    key={car.id}
                    onClick={() => onViewCarDetails(car)}
                    className="card-hover group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden hover:border-[#ff5a1f]/40 cursor-pointer"
                  >
                    <div className="w-full h-28 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                      <CarImage
                        src={car.image}
                        alt={car.name}
                        brand={car.brand}
                        model={car.model}
                        bodyType={car.bodyType}
                        isEV={car.fuelTypes?.includes('Electric')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {car.fuelTypes?.includes('Electric') && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 text-[9px] font-bold flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5" />EV
                        </span>
                      )}
                      {(car.safety?.ratingStars ?? 0) >= 5 && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-400 text-[9px] font-bold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5" />5★
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-[10px] font-bold text-[#ff5a1f] uppercase tracking-wide">{car.brand}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">{car.model}</div>
                      <div className="cs-font-display text-xs font-black text-slate-700 dark:text-slate-200 mt-1">
                        ₹{car.priceMinLakh}L – {car.priceMaxLakh}L
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                        <span>{car.bodyType}</span>
                        <span>·</span>
                        <span>{car.specs?.mileageKmPerLitreOrKWh} km/l</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 py-10 text-center text-sm text-slate-400">
                    Adjust the budget slider to see matching cars
                  </div>
                )}
              </div>

              {/* Pagination dots */}
              {previewCars.length > 3 && (
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {Array.from({ length: Math.ceil(previewCars.length / 3) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIdx(i * 3)}
                      className={`rounded-full transition-all cursor-pointer ${
                        Math.floor(carouselIdx / 3) === i
                          ? 'w-5 h-2 bg-[#ff5a1f]'
                          : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-[#ff5a1f]/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─────────────── SECTION 5: HOW IT WORKS ─────────────── */}
        <section className="px-[5vw] py-[10vh] max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff5a1f] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>How it works</span>
            </div>
            <h2 className="cs-reveal cs-font-display font-extrabold text-[clamp(1.6rem,3.5vw,2.6rem)] text-slate-900 dark:text-slate-100">
              From question to shortlist in 60 seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(33%-16px)] right-[calc(33%-16px)] h-px bg-gradient-to-r from-transparent via-[#ff5a1f]/30 to-transparent" />

            {[
              { step: '01', icon: Sliders, title: 'Set your parameters', desc: 'Budget, body type, fuel preference, road conditions and family size.' },
              { step: '02', icon: Sparkles, title: 'AI runs the numbers', desc: 'We score 200+ models on 40+ parameters: price, safety, mileage, TCO.' },
              { step: '03', icon: Trophy, title: 'Pick your shortlist', desc: 'Compare side-by-side, check on-road prices by state and book a test drive.' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="cs-reveal flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 relative"
                  style={{ '--d': `${i * 0.12}s` } as React.CSSProperties}
                >
                  <div className="cs-font-display text-[10px] font-black text-[#ff5a1f] tracking-widest mb-3">{item.step}</div>
                  <div className="w-12 h-12 rounded-2xl bg-[#ff5a1f]/10 flex items-center justify-center mb-4 cs-float" style={{ animationDelay: `${i * 0.4}s` }}>
                    <Icon className="w-6 h-6 text-[#ff5a1f]" />
                  </div>
                  <h3 className="cs-font-display font-bold text-sm text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────── SECTION 6: FINAL CTA ─────────────── */}
        <section id="go" className="min-h-[70svh] px-[5vw] py-[12vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto">
          <div className="cs-reveal relative max-w-2xl">
            {/* Decorative ring */}
            <div className="cs-spin absolute -inset-20 rounded-full border border-dashed border-[#ff5a1f]/10 pointer-events-none" />

            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff5a1f]/12 border border-[#ff5a1f]/25 text-xs font-bold text-[#ff5a1f] uppercase tracking-wider mb-5">
              <Star className="w-3.5 h-3.5" />
              Ready to upgrade?
            </span>

            <h2 className="cs-font-display font-extrabold text-[clamp(2rem,5vw,4rem)] leading-[1.08] text-slate-900 dark:text-slate-100 mb-5">
              Your next car is<br />one question away.
            </h2>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
              Built around Indian roads, Indian price brackets and Indian families.
              Zero dealer bias. Zero sponsored results.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <button
                onClick={onStartFinder}
                className="btn-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#101624] dark:bg-[#eef2fb] text-white dark:text-[#101624] font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-[#ff5a1f]/15 cursor-pointer relative overflow-hidden"
              >
                <span className="cs-shimmer absolute inset-0" />
                <Sparkles className="w-4 h-4 text-[#ff5a1f] relative z-10" />
                <span className="relative z-10">Launch CarSuggest AI</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </button>

              <button
                onClick={onExploreCars}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>Browse All Cars</span>
              </button>

              <a
                href="#top"
                className="inline-flex items-center gap-1.5 px-5 py-4 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm transition-all"
              >
                <span>Back to top</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust footer line */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              {['No registration required', 'No dealer commissions', '100% free to use'].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Landing page footer */}
      <footer className="relative z-10 py-8 px-[5vw] text-center border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-400">
        <p>© 2026 CarSuggest. Made for Indian roads with precision automotive intelligence.</p>
      </footer>
    </div>
  );
};
