import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Search,
} from 'lucide-react';
import { Car } from '../types';
import { InteractiveCar3D } from './InteractiveCar3D';
import { CarImage } from './CarImage';

export interface LandingPageProps {
  cars: Car[];
  onStartFinder: () => void;
  onExploreCars: () => void;
  onViewCarDetails: (car: Car) => void;
}

const BRANDS = [
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia',
  'Toyota', 'Honda', 'Skoda', 'Volkswagen', 'MG', 'Renault', 'Nissan'
];

const FEATURES = [
  {
    title: 'AI car finder',
    desc: 'Answer a few questions on budget, fuel, daily driving, gearbox, passengers and must-have features. Get cars picked for you.'
  },
  {
    title: 'Ranked recommendations',
    desc: 'Every car is scored against what you said matters, with AI notes on why it made your list.'
  },
  {
    title: '200+ car catalog',
    desc: 'Filter by brand, price, body type, fuel, transmission and NCAP safety rating.'
  },
  {
    title: 'Car details',
    desc: 'Specs, engine options, mileage, boot space, ground clearance, safety features, pros and cons, and variant prices.'
  },
  {
    title: 'Side-by-side comparison',
    desc: 'Dimensions, performance, fuel economy, safety and service costs, with a verdict on which car wins each category.'
  },
  {
    title: '5-year ownership studio',
    desc: 'Depreciation, fuel or charging for your monthly km, servicing, insurance renewals and resale value, added up.'
  },
  {
    title: 'AI car consultant',
    desc: 'Ask in plain words: "Compare Creta SX(O) vs Seltos GTX+" or "Best automatic under ₹15 Lakhs for Bangalore traffic."'
  },
  {
    title: 'Your account',
    desc: 'Save favourites and comparisons, and see your earlier answers again.'
  }
];

const STEPS = [
  {
    title: 'Tell us how you drive',
    desc: 'Set a budget and pick fuel, transmission, passenger count, daily driving and the features you cannot do without.'
  },
  {
    title: 'Get a ranked shortlist',
    desc: 'Each car is scored against your answers, then AI adds notes on why it fits.'
  },
  {
    title: 'Compare your finalists',
    desc: 'Put cars side by side on dimensions, performance, fuel economy, safety and service costs, with a verdict for each category.'
  },
  {
    title: 'Check what it costs to own',
    desc: 'Run the five-year studio on your monthly kilometres before you visit a showroom.'
  }
];

const OWNERSHIP_COSTS = [
  {
    title: 'Depreciation',
    desc: 'How much value the car loses each year, shown as a curve.'
  },
  {
    title: 'Fuel or charging',
    desc: 'Running cost based on the kilometres you drive each month.'
  },
  {
    title: 'Routine maintenance',
    desc: 'Servicing and upkeep costs over the five years.'
  },
  {
    title: 'Insurance renewals',
    desc: 'The premium for each year you keep the car.'
  },
  {
    title: 'Resale value',
    desc: 'The estimated price you could sell it for at the end.'
  }
];

const FAQS = [
  {
    q: 'How are cars ranked for me?',
    a: 'Each car gets a score from your answers, weighted by what you say matters most, such as budget, fuel, transmission and passenger count. The same answers always give the same ranking. AI then adds plain-language notes on why each car fits.'
  },
  {
    q: 'Is the on-road price exact?',
    a: 'No, it is an estimate. RTO charges, insurance and fees differ by state and by variant, so confirm the final figure with your dealer.'
  },
  {
    q: 'What does the mileage number mean?',
    a: 'ARAI figures come from standard test conditions, so daily driving usually returns less. Use them to compare cars with each other, and expect real numbers to vary with traffic, load and driving style.'
  },
  {
    q: 'Which cars are covered?',
    a: 'Over 200 models across hatchbacks, sedans, SUVs, MPVs and EVs. You can filter by brand, price range, fuel type, transmission and NCAP safety rating.'
  },
  {
    q: 'What can the AI consultant answer?',
    a: 'Ask in plain words, for example to compare two variants or to find the best automatic car under your budget for city traffic. It runs on Google Gemini and answers in real time.'
  },
  {
    q: 'What does an account give me?',
    a: 'You can save favourite cars and comparison sets, and look back at your earlier finder answers from your dashboard.'
  }
];

const BUDGET_BUCKETS = [
  { max: 8, name: 'Entry hatchbacks', examples: 'Alto K10, S-Presso and Tiago' },
  { max: 12, name: 'Premium hatchbacks and sub-4m SUVs', examples: 'Swift, Baleno, Punch and Exter' },
  { max: 18, name: 'Compact SUVs and sedans', examples: 'Creta, Seltos, Brezza and Verna' },
  { max: 30, name: 'Midsize SUVs and MPVs', examples: 'Harrier, XUV700 and Innova Hycross' },
  { max: 100, name: 'Premium SUVs and EVs', examples: 'Fortuner, Tucson and Carnival' }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  cars,
  onStartFinder,
  onExploreCars,
  onViewCarDetails,
}) => {
  // 3D Car selection: 0: Fortuner, 1: Creta, 2: Polo, 3: All 3 Models
  const [selectedCar3D, setSelectedCar3D] = useState<number>(3);

  // In-page mini wizard state
  const [step, setStep] = useState<number>(0);
  const [budget, setBudget] = useState<number>(12);
  const [fuel, setFuel] = useState<string>('Petrol');
  const [gear, setGear] = useState<string>('Manual');
  const [road, setRoad] = useState<string>('City traffic');
  const [passengers, setPassengers] = useState<string>('3–4');
  const [priority, setPriority] = useState<string>('Safety rating');

  // Search input state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mouse tracking for subtle ambient glow
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Intersection observer for scroll reveal animations
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
    document.querySelectorAll('.cs-rv').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Matching shortlist for mini-wizard results
  const matchingCars = useMemo(() => {
    if (!cars || !Array.isArray(cars)) return [];
    return cars
      .filter((c) => {
        const minP = c.priceMinLakh ?? 0;
        const maxP = c.priceMaxLakh ?? 100;
        return minP <= budget + 3 && maxP >= budget - 3;
      })
      .slice(0, 3);
  }, [cars, budget]);

  const activeBucket = useMemo(() => {
    return BUDGET_BUCKETS.find((b) => budget <= b.max) || BUDGET_BUCKETS[BUDGET_BUCKETS.length - 1];
  }, [budget]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onExploreCars();
    } else {
      onStartFinder();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#d9dfe8] dark:bg-[#0a1020] text-[#101624] dark:text-[#eef2fb] font-['Hanken_Grotesk',system-ui,sans-serif] overflow-x-hidden selection:bg-[#ff5a1f]/20 selection:text-[#ff5a1f]">
      {/* 3D Scene in background */}
      <InteractiveCar3D
        selectedCarIndex={selectedCar3D}
        onCarSelect={(idx) => setSelectedCar3D(idx)}
      />

      {/* Radial glow follower */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[560px] h-[560px] -ml-[280px] -mt-[280px] rounded-full bg-[#ff5a1f]/15 blur-[120px] pointer-events-none z-0 transition-transform duration-100 ease-out"
      />

      {/* Scoped CSS styles matching landigpage.html */}
      <style>{`
        .cs-font-display { font-family: 'Unbounded', sans-serif; }
        .cs-rv {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
          transition: clip-path 1.1s cubic-bezier(.7,0,.2,1) var(--d, 0s), opacity .4s var(--d, 0s);
        }
        .cs-rv.cs-in {
          opacity: 1;
          clip-path: inset(-20px -20px -20px -20px);
        }
        @keyframes cs-roll {
          from { left: -30px; }
          to { left: 70px; }
        }
        .cs-cue-dash::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 30px;
          background: #ff5a1f;
          animation: cs-roll 1.2s linear infinite;
        }
        @keyframes cs-marquee {
          to { transform: translateX(-50%); }
        }
        .cs-marquee-inner {
          display: inline-block;
          animation: cs-marquee 28s linear infinite;
          white-space: nowrap;
        }
        .cs-r2:hover {
          padding-left: 24px;
          background: linear-gradient(90deg, rgba(255,90,31,0.12), transparent);
        }
      `}</style>

      {/* Main Content */}
      <main id="top" className="relative z-10">
        {/* ── SECTION 1: HERO ── */}
        <section id="hero" className="min-h-screen px-[5vw] pt-[20vh] pb-[10vh] flex flex-col justify-center">
          <div className="max-w-4xl">
            <h1 className="cs-font-display font-extrabold text-[clamp(2.4rem,6.4vw,5.4rem)] leading-[1.02] tracking-tight text-[#101624] dark:text-[#eef2fb] mb-6">
              <span className="block overflow-hidden pb-1">
                <span className="inline-block transform animate-[fadeIn_0.8s_ease-out_forwards]">
                  The right car
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="inline-block text-[#ff5a1f] transform animate-[fadeIn_1.0s_ease-out_forwards]">
                  for Indian roads.
                </span>
              </span>
            </h1>

            <p className="cs-rv text-base sm:text-lg text-[#556078] dark:text-[#9aa6c0] max-w-2xl leading-relaxed mb-8" style={{ '--d': '0.3s' } as React.CSSProperties}>
              Search over 200 car models, answer four questions for a shortlist, or ask the AI consultant.
              Every car is checked for on-road price, ARAI mileage, Global and Bharat NCAP ratings and what it costs to own for five years.
            </p>

            {/* Quick Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="cs-rv flex items-center gap-2 max-w-xl p-2 rounded-full border border-[#101624]/16 dark:border-white/16 bg-white/70 dark:bg-[#0e162a]/70 backdrop-blur-xl shadow-lg focus-within:border-[#ff5a1f] focus-within:ring-2 focus-within:ring-[#ff5a1f]/30 transition-all mb-4"
              style={{ '--d': '0.5s' } as React.CSSProperties}
            >
              <Search className="w-5 h-5 text-[#556078] dark:text-[#9aa6c0] ml-3 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a car or ask a question (e.g. Creta vs Seltos)"
                className="w-full bg-transparent px-2 py-1.5 text-sm text-[#101624] dark:text-[#eef2fb] outline-none placeholder:text-[#556078]/70 dark:placeholder:text-[#9aa6c0]/70"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#101624] dark:bg-white text-white dark:text-[#101624] text-xs font-bold hover:scale-105 transition-all shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Popular quick chips */}
            <div className="cs-rv flex flex-wrap gap-2 mb-10" style={{ '--d': '0.65s' } as React.CSSProperties}>
              {[
                'Creta vs Seltos',
                'Best automatic under ₹15 Lakhs',
                'Safest compact SUV',
                'EV for city commute',
                '7-Seater family MPV'
              ].map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(chip);
                    onExploreCars();
                  }}
                  className="px-3.5 py-1.5 rounded-full border border-[#101624]/16 dark:border-white/16 bg-white/40 dark:bg-slate-900/40 text-xs text-[#556078] dark:text-[#9aa6c0] hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* CTA action buttons */}
            <div className="cs-rv flex flex-wrap gap-3 items-center" style={{ '--d': '0.8s' } as React.CSSProperties}>
              <button
                onClick={onStartFinder}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ff5a1f] text-white font-bold text-sm hover:scale-105 hover:shadow-[0_12px_32px_-6px_#ff5a1f] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Launch CarSuggest AI
              </button>
              <button
                onClick={onExploreCars}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#101624]/16 dark:border-white/16 bg-white/60 dark:bg-slate-900/60 font-semibold text-sm hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Browse 200+ Cars
              </button>
            </div>

            {/* Scroll cue indicator */}
            <div className="cs-rv flex items-center gap-3 mt-14 text-xs font-medium text-[#556078] dark:text-[#9aa6c0]" style={{ '--d': '1s' } as React.CSSProperties}>
              <i className="w-[70px] h-[2px] bg-[#101624]/16 dark:bg-white/16 relative overflow-hidden cs-cue-dash inline-block rounded-full" />
              <span>Scroll to drive &amp; explore</span>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: MARQUEE TICKER ── */}
        <div className="overflow-hidden py-4 border-y border-[#101624]/12 dark:border-white/12 bg-white/50 dark:bg-[#0e162a]/50 backdrop-blur-md">
          <div className="cs-marquee-inner flex items-center gap-8 cs-font-display text-sm font-semibold text-[#556078] dark:text-[#9aa6c0]">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={i} className="inline-flex items-center gap-3">
                <span>{brand}</span>
                <i className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f]" />
              </span>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: STATS STRIP ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#101624]/12 dark:border-white/12 bg-white/40 dark:bg-[#0e162a]/40 backdrop-blur-md">
          {[
            { val: '200+', label: 'Car models in the catalog' },
            { val: '5', label: 'Categories: hatchback, sedan, SUV, MPV & EV' },
            { val: '5 Years', label: 'Of ownership cost, worked out per car' },
            { val: 'NCAP', label: 'Safety ratings in filters and car details' }
          ].map((st, i) => (
            <div key={i} className="p-6 md:p-8 border-l first:border-l-0 border-[#101624]/12 dark:border-white/12">
              <div className="cs-font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[#101624] dark:text-[#eef2fb] mb-1">
                {st.val}
              </div>
              <div className="text-xs text-[#556078] dark:text-[#9aa6c0] leading-snug">
                {st.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION 4: FEATURES GRID (#fx) ── */}
        <section id="fx" className="min-h-screen px-[5vw] py-[14vh] flex flex-col justify-center">
          <div className="max-w-2xl md:ml-auto">
            <h2 className="cs-rv cs-font-display font-extrabold text-[clamp(1.8rem,4vw,3.2rem)] leading-tight text-[#101624] dark:text-[#eef2fb] mb-3">
              Everything car buyers in India argue about, settled.
            </h2>
            <p className="cs-rv text-sm md:text-base text-[#556078] dark:text-[#9aa6c0] mb-8">
              No sponsor placements, no dealer commissions, no phone calls. Just verified automotive data for Indian driving conditions.
            </p>

            <div className="border-t border-[#101624]/12 dark:border-white/12">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="cs-r2 cs-rv grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-2 md:gap-6 py-5 px-3 border-bottom border-b border-[#101624]/12 dark:border-white/12 transition-all cursor-pointer rounded-xl"
                  style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
                  onClick={onStartFinder}
                >
                  <h3 className="cs-font-display font-bold text-sm md:text-base text-[#101624] dark:text-[#eef2fb]">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[#556078] dark:text-[#9aa6c0] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: HOW IT WORKS (#how) ── */}
        <section id="how" className="min-h-screen px-[5vw] py-[14vh] flex flex-col justify-center">
          <div className="max-w-2xl">
            <h2 className="cs-rv cs-font-display font-extrabold text-[clamp(1.8rem,4vw,3.2rem)] leading-tight text-[#101624] dark:text-[#eef2fb] mb-8">
              From budget to shortlist in four steps.
            </h2>

            <ol className="border-t border-[#101624]/12 dark:border-white/12 list-none p-0 m-0">
              {STEPS.map((stepItem, i) => (
                <li
                  key={i}
                  className="cs-rv grid grid-cols-[3.2rem_1fr] gap-4 py-6 border-b border-[#101624]/12 dark:border-white/12"
                  style={{ '--d': `${i * 0.1}s` } as React.CSSProperties}
                >
                  <span className="cs-font-display font-black text-2xl text-[#ff5a1f]">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="cs-font-display font-bold text-sm md:text-base text-[#101624] dark:text-[#eef2fb] mb-1">
                      {stepItem.title}
                    </h3>
                    <p className="text-xs text-[#556078] dark:text-[#9aa6c0] leading-relaxed">
                      {stepItem.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SECTION 6: INTERACTIVE MINI WIZARD (#try) ── */}
        <section id="try" className="min-h-screen px-[5vw] py-[14vh] flex flex-col justify-center">
          <div className="max-w-xl md:ml-auto">
            <div className="cs-rv p-6 md:p-8 rounded-3xl border border-[#101624]/16 dark:border-white/16 bg-white/70 dark:bg-[#0e162a]/70 backdrop-blur-xl shadow-2xl">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs text-[#556078] dark:text-[#9aa6c0] mb-2 font-medium">
                <span>{step < 4 ? `Question ${step + 1} of 4` : 'Your Starting Point'}</span>
                <span className="text-[#ff5a1f] font-semibold">{Math.min(step + 1, 4) * 25}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#101624]/10 dark:bg-white/10 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#ff5a1f] rounded-full transition-all duration-300"
                  style={{ width: `${(Math.min(step + 1, 4) / 4) * 100}%` }}
                />
              </div>

              {/* STEP 0: Budget */}
              {step === 0 && (
                <div>
                  <h2 className="cs-font-display font-bold text-xl text-[#101624] dark:text-[#eef2fb] mb-4">
                    What is your budget?
                  </h2>
                  <div className="cs-font-display text-3xl font-extrabold text-[#101624] dark:text-[#eef2fb] mb-2">
                    ₹{budget} <small className="text-xs font-normal text-[#556078] dark:text-[#9aa6c0]">Lakhs ex-showroom</small>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="0.5"
                    value={budget}
                    onChange={(e) => setBudget(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#101624]/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff5a1f] my-4"
                  />
                  <p className="text-xs text-[#556078] dark:text-[#9aa6c0] leading-relaxed">
                    On-road, roughly <b className="text-[#101624] dark:text-[#eef2fb]">₹{(budget * 1.15).toFixed(1)} Lakhs</b>. RTO, insurance and fees vary by state.
                  </p>
                </div>
              )}

              {/* STEP 1: Fuel & Gearbox */}
              {step === 1 && (
                <div>
                  <h2 className="cs-font-display font-bold text-xl text-[#101624] dark:text-[#eef2fb] mb-4">
                    What should power it?
                  </h2>
                  <div className="text-xs text-[#556078] dark:text-[#9aa6c0] mb-2 font-semibold uppercase tracking-wider">Fuel Type</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFuel(f)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          fuel === f
                            ? 'bg-[#ff5a1f] text-white border border-[#ff5a1f]'
                            : 'border border-[#101624]/16 dark:border-white/16 text-[#101624] dark:text-[#eef2fb] hover:border-[#ff5a1f]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-[#556078] dark:text-[#9aa6c0] mb-2 font-semibold uppercase tracking-wider">Transmission</div>
                  <div className="flex flex-wrap gap-2">
                    {['Manual', 'Automatic'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGear(g)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          gear === g
                            ? 'bg-[#ff5a1f] text-white border border-[#ff5a1f]'
                            : 'border border-[#101624]/16 dark:border-white/16 text-[#101624] dark:text-[#eef2fb] hover:border-[#ff5a1f]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Roads & Passengers */}
              {step === 2 && (
                <div>
                  <h2 className="cs-font-display font-bold text-xl text-[#101624] dark:text-[#eef2fb] mb-4">
                    Where do you drive, and with whom?
                  </h2>
                  <div className="text-xs text-[#556078] dark:text-[#9aa6c0] mb-2 font-semibold uppercase tracking-wider">Driving Terrain</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['City traffic', 'Ghat roads', 'Highway runs', 'Rough roads'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRoad(r)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          road === r
                            ? 'bg-[#ff5a1f] text-white border border-[#ff5a1f]'
                            : 'border border-[#101624]/16 dark:border-white/16 text-[#101624] dark:text-[#eef2fb] hover:border-[#ff5a1f]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-[#556078] dark:text-[#9aa6c0] mb-2 font-semibold uppercase tracking-wider">Passenger Capacity</div>
                  <div className="flex flex-wrap gap-2">
                    {['1–2', '3–4', '5–7'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPassengers(p)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          passengers === p
                            ? 'bg-[#ff5a1f] text-white border border-[#ff5a1f]'
                            : 'border border-[#101624]/16 dark:border-white/16 text-[#101624] dark:text-[#eef2fb] hover:border-[#ff5a1f]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Priorities */}
              {step === 3 && (
                <div>
                  <h2 className="cs-font-display font-bold text-xl text-[#101624] dark:text-[#eef2fb] mb-4">
                    What matters most?
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Safety rating', 'Mileage', 'Comfort', 'Low running cost', 'Boot space'].map((pr) => (
                      <button
                        key={pr}
                        type="button"
                        onClick={() => setPriority(pr)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          priority === pr
                            ? 'bg-[#ff5a1f] text-white border border-[#ff5a1f]'
                            : 'border border-[#101624]/16 dark:border-white/16 text-[#101624] dark:text-[#eef2fb] hover:border-[#ff5a1f]'
                        }`}
                      >
                        {pr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Results preview */}
              {step === 4 && (
                <div>
                  <h2 className="cs-font-display font-bold text-xl text-[#101624] dark:text-[#eef2fb] mb-2">
                    Start your shortlist here
                  </h2>
                  <div className="cs-font-display font-extrabold text-lg text-[#ff5a1f] mb-2">
                    {activeBucket.name}
                  </div>
                  <p className="text-xs text-[#556078] dark:text-[#9aa6c0] leading-relaxed mb-4">
                    Models in this segment include {activeBucket.examples}. Built for {road.toLowerCase()} with {passengers} passengers, {fuel.toLowerCase()} and {gear.toLowerCase()} gearbox, scored on {priority.toLowerCase()} first.
                  </p>

                  {/* Matching cars preview */}
                  {matchingCars.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {matchingCars.map((car) => (
                        <div
                          key={car.id}
                          onClick={() => onViewCarDetails(car)}
                          className="p-2 rounded-xl border border-[#101624]/10 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 hover:border-[#ff5a1f]/50 cursor-pointer text-left transition-all"
                        >
                          <div className="h-14 rounded-lg overflow-hidden mb-1.5 bg-slate-200 dark:bg-slate-800">
                            <CarImage
                              src={car.image}
                              alt={car.name}
                              brand={car.brand}
                              model={car.model}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-[10px] font-bold text-[#ff5a1f] uppercase truncate">{car.brand}</div>
                          <div className="text-xs font-bold text-[#101624] dark:text-white truncate">{car.model}</div>
                          <div className="text-[10px] text-[#556078] dark:text-[#9aa6c0]">₹{car.priceMinLakh}L+</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#101624]/10 dark:border-white/10">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s === 4 ? 0 : s - 1))}
                    className="px-5 py-2 rounded-full border border-[#101624]/16 dark:border-white/16 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    {step === 4 ? 'Start over' : 'Back'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (step < 4) {
                      setStep((s) => s + 1);
                    } else {
                      onStartFinder();
                    }
                  }}
                  className="ml-auto px-6 py-2.5 rounded-full bg-[#101624] dark:bg-white text-white dark:text-[#101624] text-xs font-bold hover:scale-105 transition-all cursor-pointer"
                >
                  {step < 3 ? 'Next' : step === 3 ? 'Show my shortlist' : 'Open Full AI Finder'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: 5-YEAR OWNERSHIP STUDIO (#own) ── */}
        <section id="own" className="min-h-screen px-[5vw] py-[14vh] flex flex-col justify-center">
          <div className="max-w-2xl">
            <h2 className="cs-rv cs-font-display font-extrabold text-[clamp(1.8rem,4vw,3.2rem)] leading-tight text-[#101624] dark:text-[#eef2fb] mb-3">
              Know the real cost before you sign.
            </h2>
            <p className="cs-rv text-sm md:text-base text-[#556078] dark:text-[#9aa6c0] leading-relaxed mb-8">
              The sticker price is only the start. The 5-year ownership studio adds up what a car costs after you drive it home, so a cheaper car does not turn out dearer.
            </p>

            <div className="border-t border-[#101624]/12 dark:border-white/12">
              {OWNERSHIP_COSTS.map((cost, i) => (
                <div
                  key={i}
                  className="cs-r2 cs-rv grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-2 md:gap-6 py-5 px-3 border-b border-[#101624]/12 dark:border-white/12 transition-all cursor-pointer rounded-xl"
                  style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
                  onClick={onExploreCars}
                >
                  <h3 className="cs-font-display font-bold text-sm md:text-base text-[#101624] dark:text-[#eef2fb]">
                    {cost.title}
                  </h3>
                  <p className="text-xs text-[#556078] dark:text-[#9aa6c0] leading-relaxed">
                    {cost.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 8: FAQ ACCORDION (#faq) ── */}
        <section id="faq" className="min-h-screen px-[5vw] py-[14vh] flex flex-col justify-center">
          <div className="max-w-3xl">
            <h2 className="cs-rv cs-font-display font-extrabold text-[clamp(1.8rem,4vw,3.2rem)] leading-tight text-[#101624] dark:text-[#eef2fb] mb-8">
              Questions buyers ask first.
            </h2>

            <div className="cs-rv p-6 md:p-8 rounded-3xl border border-[#101624]/16 dark:border-white/16 bg-white/70 dark:bg-[#0e162a]/70 backdrop-blur-xl shadow-lg">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="py-4 border-b last:border-b-0 border-[#101624]/12 dark:border-white/12 group cursor-pointer"
                >
                  <summary className="flex items-center justify-between gap-4 cs-font-display font-bold text-sm md:text-base text-[#101624] dark:text-[#eef2fb] list-none select-none">
                    <span>{faq.q}</span>
                    <span className="text-[#ff5a1f] font-normal text-lg transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-xs md:text-sm text-[#556078] dark:text-[#9aa6c0] leading-relaxed mt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 9: FINAL CTA (#go) ── */}
        <section id="go" className="min-h-[70vh] px-[5vw] py-[14vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto">
          <div className="cs-rv">
            <h2 className="cs-font-display font-extrabold text-[clamp(2rem,5vw,4.4rem)] leading-tight text-[#101624] dark:text-[#eef2fb] mb-4">
              Your next car is one question away.
            </h2>
            <p className="text-sm md:text-base text-[#556078] dark:text-[#9aa6c0] max-w-xl mx-auto mb-8">
              Compare cars side by side, see five years of ownership cost, and save your shortlist to your account.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <button
                onClick={onStartFinder}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ff5a1f] text-white font-bold text-sm hover:scale-105 hover:shadow-[0_12px_32px_-6px_#ff5a1f] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Launch CarSuggest AI
              </button>
              <button
                onClick={onExploreCars}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#101624]/16 dark:border-white/16 bg-white/70 dark:bg-slate-900/70 font-semibold text-sm hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Browse 200+ Cars
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── FLOATING 3D CAR SWITCHER (.cs) ── */}
      <div
        className="fixed left-5 bottom-6 z-30 flex items-center gap-1 p-1.5 rounded-full border border-[#101624]/16 dark:border-white/16 bg-white/80 dark:bg-[#0e162a]/80 backdrop-blur-xl shadow-xl text-xs font-semibold"
        role="group"
        aria-label="Choose the car on the page"
      >
        {[
          { idx: 3, label: 'All 3 Models' },
          { idx: 0, label: 'Toyota Fortuner' },
          { idx: 1, label: 'Hyundai Creta' },
          { idx: 2, label: 'VW Polo' }
        ].map((carOpt) => (
          <button
            key={carOpt.idx}
            type="button"
            onClick={() => setSelectedCar3D(carOpt.idx)}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              selectedCar3D === carOpt.idx
                ? 'bg-[#ff5a1f] text-white shadow-sm'
                : 'text-[#556078] dark:text-[#9aa6c0] hover:text-[#101624] dark:hover:text-white'
            }`}
          >
            {carOpt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
