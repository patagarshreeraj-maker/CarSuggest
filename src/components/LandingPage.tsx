import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Compass,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  Gauge,
  Sliders,
  Check
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
  'Hatchbacks',
  'Compact SUVs',
  'Sedans',
  'MPVs',
  'Electric',
  'Strong Hybrid',
  'CNG',
  'Diesel',
  'Petrol',
  'Automatic',
  '5-Star Safety',
  'Off-Road 4x4'
];

const ARGUMENTS_SETTLED = [
  {
    title: 'AI matchmaker',
    desc: 'Describe how you drive and who rides along. Get a ranked shortlist instead of an endless spreadsheet of features.'
  },
  {
    title: 'On-road price',
    desc: 'Ex-showroom to on-road in ₹ Lakhs, with state RTO registration, insurance and municipal fees clearly laid out.'
  },
  {
    title: 'NCAP safety',
    desc: 'Global NCAP and Bharat NCAP crash test star ratings side by side, translated into plain, honest safety facts.'
  },
  {
    title: 'Real-world mileage',
    desc: 'ARAI lab claims placed next to what actual Indian owners realistically experience in bumper-to-bumper city traffic.'
  },
  {
    title: 'Indian road profiles',
    desc: 'City crawls, steep ghat curves, monsoonal potholes and expressway cruising speed stability scored per car.'
  },
  {
    title: '5-Year ownership cost',
    desc: 'Fuel/charging, routine service, insurance renewal and projected resale depreciation mapped over 5 years.'
  }
];

const ROAD_CONDITIONS = [
  { id: 'city', label: 'City traffic', hint: 'Bumper-to-bumper ease, light steering & automatic gearboxes' },
  { id: 'ghats', label: 'Ghat roads', hint: 'Hill-hold assist, rigid chassis & instant low-end torque' },
  { id: 'highway', label: 'Highway runs', hint: '100+ km/h stability, cruise control & sound insulation' },
  { id: 'rough', label: 'Rough roads', hint: '190mm+ ground clearance & rugged suspension dampening' }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  cars,
  onStartFinder,
  onExploreCars,
  onViewCarDetails
}) => {
  const [budgetLakh, setBudgetLakh] = useState<number>(12);
  const [activeRoads, setActiveRoads] = useState<string[]>(['city']);
  const [boostSpeed, setBoostSpeed] = useState<number>(0);
  const glowRef = useRef<HTMLDivElement | null>(null);

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
      { threshold: 0.15 }
    );

    document.querySelectorAll('.cs-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
  };

  const toggleRoad = (roadId: string) => {
    setActiveRoads((prev) =>
      prev.includes(roadId) ? prev.filter((r) => r !== roadId) : [...prev, roadId]
    );
    setBoostSpeed((prev) => Math.max(prev + 2.0, 5.0));
  };

  // Approximate on-road price in Lakhs
  const approximateOnRoad = (budgetLakh * 1.15).toFixed(1);
  const sliderPercentage = ((budgetLakh - 5) / (50 - 5)) * 100;

  // Real matching cars from dataset matching this price bracket (+- 3 Lakhs)
  const previewCars = useMemo(() => {
    if (!cars || !Array.isArray(cars)) return [];
    return cars
      .filter((c) => {
        const minP = c.priceMinLakh ?? 0;
        const maxP = c.priceMaxLakh ?? 100;
        return minP <= budgetLakh + 2.5 && maxP >= budgetLakh - 2.5;
      })
      .slice(0, 3);
  }, [cars, budgetLakh]);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#0a1020] text-[#101624] dark:text-[#eef2fb] font-['Hanken_Grotesk',sans-serif] selection:bg-[#ff5a1f]/20 selection:text-[#ff5a1f]">
      {/* Dynamic Scoped Inline Styles */}
      <style>{`
        :root {
          --car-bg: #e8edf4;
          --car-fg: #101624;
          --car-mut: #556078;
          --car-card: rgba(255, 255, 255, 0.68);
          --car-bd: rgba(16, 22, 36, 0.12);
          --car-acc: #ff5a1f;
        }
        .dark {
          --car-bg: #0a1020;
          --car-fg: #eef2fb;
          --car-mut: #9aa6c0;
          --car-card: rgba(14, 22, 42, 0.65);
          --car-bd: rgba(200, 215, 255, 0.14);
        }
        .cs-font-display {
          font-family: 'Unbounded', sans-serif;
        }
        .cs-line-wrap {
          display: block;
          overflow: visible;
          padding-bottom: 0.12em;
        }
        .cs-line-text {
          display: block;
          animation: cs-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes cs-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes cs-dash-roll {
          from { left: -30px; }
          to { left: 70px; }
        }
        .cs-dash-animation::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 32px;
          background: var(--car-acc, #ff5a1f);
          animation: cs-dash-roll 1.2s linear infinite;
        }
        @keyframes cs-marquee-scroll {
          to { transform: translateX(-50%); }
        }
        .cs-marquee-inner {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: cs-marquee-scroll 28s linear infinite;
        }
        .cs-reveal {
          opacity: 1;
        }
        .cs-feature-row:hover {
          padding-left: 28px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--car-acc, #ff5a1f) 14%, transparent), transparent);
        }
      `}</style>

      {/* 3D WebGL Three.js Interactive Car Scene */}
      <InteractiveCar3D boostSpeed={boostSpeed} />

      {/* Ambient Mouse Radial Glow */}
      <div
        ref={glowRef}
        className="fixed left-0 top-0 w-[540px] h-[540px] -ml-[270px] -mt-[270px] rounded-full pointer-events-none z-0 transition-opacity duration-300 opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--car-acc, #ff5a1f) 0%, transparent 68%)'
        }}
      />

      {/* Main Content Sections */}
      <main id="top" className="relative z-10">
        {/* SECTION 1: HERO */}
        <section id="hero" className="min-h-[90svh] px-[5vw] pt-28 md:pt-36 pb-16 flex flex-col justify-center max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md text-xs font-semibold text-slate-800 dark:text-slate-200 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#ff5a1f] animate-pulse" />
              <span>India's Automotive Intelligence Engine</span>
            </div>

            <h1 className="cs-font-display font-extrabold tracking-tight text-[clamp(2.3rem,6.4vw,5.2rem)] leading-[1.04] text-[#101624] dark:text-[#eef2fb] mb-5">
              <span className="cs-line-wrap">
                <span className="cs-line-text" style={{ '--d': '0.2s' } as React.CSSProperties}>
                  The right car
                </span>
              </span>
              <span className="cs-line-wrap">
                <span className="cs-line-text" style={{ '--d': '0.4s' } as React.CSSProperties}>
                  for Indian roads.
                </span>
              </span>
            </h1>

            <p
              className="cs-reveal text-[clamp(1.05rem,1.8vw,1.25rem)] text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-8"
              style={{ '--d': '0.8s' } as React.CSSProperties}
            >
              Tell us your budget, your roads and who rides along. CarSuggest weighs ex-showroom and
              on-road prices, ARAI mileage, Global and Bharat NCAP ratings and the real cost of owning
              each car, then gives you a ranked shortlist you can actually trust.
            </p>

            {/* CTAs */}
            <div
              className="cs-reveal flex flex-wrap items-center gap-3.5 mb-12"
              style={{ '--d': '1.0s' } as React.CSSProperties}
            >
              <button
                onClick={onStartFinder}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#101624] dark:bg-[#eef2fb] text-white dark:text-[#101624] font-bold text-sm hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#ff5a1f]/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
                <span>Find my car</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#fx"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-white/90 dark:hover:bg-slate-800 transition-all"
              >
                <span>See what it checks</span>
              </a>

              <button
                onClick={onExploreCars}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent text-slate-700 dark:text-slate-300 font-medium text-sm hover:text-[#ff5a1f] transition-all cursor-pointer"
              >
                <span>Browse 200+ models</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll Indicator Cue */}
            <div
              className="cs-reveal flex items-center gap-3.5 text-xs text-slate-500 font-medium tracking-wide uppercase"
              style={{ '--d': '1.2s' } as React.CSSProperties}
            >
              <i className="cs-dash-animation w-[70px] h-[2px] bg-slate-300 dark:bg-slate-700 relative overflow-hidden inline-block" />
              <span>Scroll to drive & steer the 3D car</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: MARQUEE TICKER */}
        <div className="overflow-hidden whitespace-nowrap py-4 border-y border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
          <div className="cs-marquee-inner cs-font-display text-xs md:text-sm tracking-wide text-slate-600 dark:text-slate-400 font-medium uppercase">
            {[...CATEGORIES, ...CATEGORIES].map((category, idx) => (
              <span key={idx} className="inline-flex items-center mx-5 gap-3">
                <span>{category}</span>
                <i className="inline-block w-2 h-2 rounded-full bg-[var(--car-acc,#ff5a1f)]" />
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 3: FEATURES / EVERYTHING SETTLED */}
        <section id="fx" className="min-h-[100svh] px-[5vw] py-[15vh] flex flex-col justify-center max-w-7xl mx-auto">
          <div className="md:ml-[min(44%,540px)]">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--car-acc,#ff5a1f)] mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Objective Evaluation</span>
            </div>

            <h2 className="cs-reveal cs-font-display font-extrabold text-[clamp(1.8rem,4vw,3.2rem)] leading-tight text-slate-900 dark:text-slate-100 mb-8">
              Everything car buyers in India argue about, settled.
            </h2>

            <div className="border-t border-slate-200 dark:border-slate-800">
              {ARGUMENTS_SETTLED.map((item, idx) => (
                <div
                  key={idx}
                  className="cs-reveal cs-feature-row grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-2 md:gap-7 py-5 px-3 border-b border-slate-200 dark:border-slate-800/80 transition-all rounded-xl"
                  style={{ '--d': `${idx * 0.08}s` } as React.CSSProperties}
                >
                  <h3 className="cs-font-display font-semibold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--car-acc,#ff5a1f)]" />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE BUDGET & ROAD SIMULATOR */}
        <section id="try" className="min-h-[100svh] px-[5vw] py-[15vh] flex flex-col justify-center max-w-7xl mx-auto">
          <div className="md:mr-[min(44%,540px)]">
            <div className="cs-reveal p-6 md:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-slate-900/5 max-w-xl">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--car-acc,#ff5a1f)] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Live Segment Matcher
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Ex-Showroom vs On-Road
                </span>
              </div>

              <h2 className="cs-font-display font-bold text-xl md:text-2xl text-slate-900 dark:text-white mb-4">
                What is your budget?
              </h2>

              <div className="cs-font-display font-black text-[clamp(2.4rem,5vw,3.6rem)] text-slate-900 dark:text-white leading-none tracking-tight flex items-baseline gap-2 mb-3">
                <span>{budgetLakh.toFixed(1)}</span>
                <small className="font-['Hanken_Grotesk'] text-xs font-medium text-slate-500 tracking-normal">
                  ₹ Lakhs ex-showroom
                </small>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="5"
                max="50"
                step="0.5"
                value={budgetLakh}
                onChange={handleBudgetChange}
                className="w-full accent-[var(--car-acc,#ff5a1f)] h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer mb-2"
                aria-label="Budget in Lakhs"
              />

              {/* Visual Track Fill */}
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-5">
                <div
                  className="h-full bg-[var(--car-acc,#ff5a1f)] transition-all duration-150 rounded-full"
                  style={{ width: `${sliderPercentage}%` }}
                />
              </div>

              {/* Live Estimates */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-5">
                <div className="flex items-center justify-between">
                  <span>Approx. on-road (with RTO & ins.):</span>
                  <b className="text-slate-900 dark:text-white font-bold">₹ {approximateOnRoad} Lakhs</b>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700/60">
                  <span>Target segment:</span>
                  <b className="text-[var(--car-acc,#ff5a1f)] font-semibold">{getSegmentName(budgetLakh)}</b>
                </div>
              </div>

              {/* Road Condition Chips */}
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Select your primary driving terrain:
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {ROAD_CONDITIONS.map((cond) => {
                  const isActive = activeRoads.includes(cond.id);
                  return (
                    <button
                      key={cond.id}
                      onClick={() => toggleRoad(cond.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'border-[var(--car-acc,#ff5a1f)] bg-[var(--car-acc,#ff5a1f)]/15 text-[var(--car-acc,#ff5a1f)] shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {isActive && <Check className="w-3 h-3 text-[var(--car-acc,#ff5a1f)]" />}
                      <span>{cond.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Real Cars in this Bracket Preview */}
              {previewCars.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500">
                    <span>Popular in this range ({previewCars.length}):</span>
                    <button
                      onClick={onExploreCars}
                      className="text-[var(--car-acc,#ff5a1f)] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View all</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {previewCars.map((car) => (
                      <div
                        key={car.id}
                        onClick={() => onViewCarDetails(car)}
                        className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-[var(--car-acc,#ff5a1f)]/50 transition-all cursor-pointer group"
                      >
                        <div className="w-full h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mb-1.5">
                          <CarImage
                            src={car.image}
                            alt={car.name}
                            brand={car.brand}
                            model={car.name}
                            bodyType={car.bodyType}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">
                          {car.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          ₹{car.priceMinLakh}L - ₹{car.priceMaxLakh}L
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-5">
                <button
                  onClick={onStartFinder}
                  className="w-full py-3 rounded-full bg-[#101624] dark:bg-[#eef2fb] text-white dark:text-[#101624] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--car-acc,#ff5a1f)]" />
                  <span>Find exact variants for ₹{budgetLakh.toFixed(1)} Lakhs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL LAUNCH CTA */}
        <section id="go" className="min-h-[90svh] px-[5vw] pt-[15vh] pb-[10vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto">
          <div className="cs-reveal max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--car-acc,#ff5a1f)]/15 border border-[var(--car-acc,#ff5a1f)]/30 text-xs font-bold text-[var(--car-acc,#ff5a1f)] uppercase tracking-wider mb-5">
              Ready to Upgrade?
            </span>

            <h2 className="cs-font-display font-extrabold text-[clamp(2rem,5vw,4.2rem)] leading-[1.08] text-slate-900 dark:text-slate-100 mb-5">
              Your next car is one question away.
            </h2>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
              Built around Indian roads, Indian price brackets and Indian families. No dealer pitch,
              no sponsor bias.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <button
                onClick={onStartFinder}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#101624] dark:bg-[#eef2fb] text-white dark:text-[#101624] font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-[#ff5a1f]/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
                <span>Launch CarSuggest AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCars}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>Browse All Cars</span>
              </button>

              <a
                href="#top"
                className="inline-flex items-center gap-1.5 px-6 py-4 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-all"
              >
                <span>Back to top</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-[5vw] text-center border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 CarSuggest. Made for Indian roads with precision automotive intelligence.</p>
      </footer>
    </div>
  );
};
