import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants
} from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Fuel,
  Wallet,
  ArrowLeftRight,
  Check,
  Minus,
  Plus,
  Users,
  Gauge,
  Calculator
} from 'lucide-react';
import { Car, ScoredCar, UserPreferences } from '../types';
import { calculateRecommendations } from '../lib/recommendationEngine';
import { BrandMarquee } from './BrandMarquee';
import { CarCard } from './CarCard';
import { CarImage } from './CarImage';

/* ------------------------------------------------------------------ */
/* Motion tokens                                                       */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const revealUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }
};

const PHRASES = [
  'right for your family.',
  'safe on Indian roads.',
  'cheap to run each month.',
  'easy to park in the city.'
];

/* A sample buyer profile used to show real scores on the page. */
const SAMPLE_PREFS: UserPreferences = {
  budgetMinLakh: 12,
  budgetMaxLakh: 18,
  familySize: 5,
  primaryUsage: 'City Commute',
  monthlyKm: 1200,
  preferredFuel: ['Petrol', 'Electric', 'Strong Hybrid'],
  preferredBodyTypes: [],
  preferredTransmission: 'Any',
  priorities: {
    safety: 5,
    mileage: 4,
    performance: 3,
    comfortSpace: 5,
    lowMaintenance: 4,
    featuresTech: 4
  }
};

const BENEFITS = [
  {
    icon: Wallet,
    title: 'Matched to your budget',
    body: 'Set a band and see only the models you can actually buy, including the variant that fits it.'
  },
  {
    icon: ShieldCheck,
    title: 'Safety carries real weight',
    body: 'BNCAP star ratings, airbag counts and ADAS levels feed the score instead of sitting in a spec sheet.'
  },
  {
    icon: Fuel,
    title: 'Running cost, not just sticker price',
    body: 'Fuel or charging, insurance, servicing and resale over five years, converted into one monthly figure.'
  },
  {
    icon: ArrowLeftRight,
    title: 'Four cars in one table',
    body: 'Specs, scores and ownership cost side by side, so the decision takes one screen instead of four visits.'
  }
];

const STEPS = [
  {
    icon: Users,
    title: 'Tell us how you drive',
    body: 'Budget, family size, daily distance and what matters most. Five short steps, about a minute.'
  },
  {
    icon: Gauge,
    title: 'We score the whole market',
    body: 'Every model in the catalogue is weighted on budget fit, crash safety, efficiency, space and running cost.'
  },
  {
    icon: Calculator,
    title: 'Shortlist, compare, book a drive',
    body: 'You get three picks with the reasoning, a full comparison table and a five year cost breakdown.'
  }
];

const FAQS = [
  {
    q: 'How does DriveAI score a car for me?',
    a: 'Six factors are weighted against the priorities you set: budget fit, crash safety, mileage or electric range, cabin space, performance and maintenance cost. Safety at weight five counts roughly five times as much as performance at weight one.'
  },
  {
    q: 'Where do the specifications come from?',
    a: 'Each model is stored with its published India specification: price band, engine or battery, ARAI mileage or range, seating, boot space, airbag count and BNCAP result. The score is computed from those numbers, never from a dealer pitch.'
  },
  {
    q: 'Will the shortlist be the same for everyone?',
    a: 'No. Two buyers with the same budget can get different top picks, because a family of six in Pune and a solo commuter in Bengaluru weigh safety, space and running cost differently.'
  },
  {
    q: 'How many cars can I compare at once?',
    a: 'Four. The table lines up price, specs, safety equipment and the five year cost of ownership, and it keeps the last four you added.'
  },
  {
    q: 'What goes into the five year ownership cost?',
    a: 'On road price, loan interest and EMI, fuel or charging for your monthly distance, insurance, periodic servicing and the resale value you can expect at the end of the period.'
  },
  {
    q: 'Do I need an account to use it?',
    a: 'You can browse and run the finder without signing in. An account keeps your saved cars, your comparison queue and your last set of preferences on this device and on any other.'
  }
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className
}) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-80px' }}
    variants={{
      hidden: { opacity: 0, y: 32 },
      show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: EASE } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const Magnetic: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 240, damping: 18 });
  const y = useSpring(0, { stiffness: 240, damping: 18 });

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Counter: React.FC<{ to: number; suffix?: string; duration?: number }> = ({
  to,
  suffix = '',
  duration = 1.4
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
};

const TweenNumber: React.FC<{ value: number }> = ({ value }) => {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);

  useEffect(() => {
    const from = displayRef.current;
    if (reduce || from === value) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let frame = 0;
    const apply = (next: number) => {
      displayRef.current = next;
      setDisplay(next);
    };
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 450);
      const eased = 1 - Math.pow(1 - t, 3);
      apply(Math.round(from + (value - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // Guarantees the final number even when animation frames are throttled
    const fallback = setTimeout(() => apply(value), 600);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [value, reduce]);

  return <>{display}</>;
};

const ScoreRing: React.FC<{ value: number; size?: number; live?: boolean }> = ({
  value,
  size = 68,
  live = false
}) => {
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  const target = circumference * (1 - value / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={5} />
        {live ? (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#059669"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: target }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        ) : (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#059669"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: target }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-semibold leading-none text-slate-900">
          {live ? <TweenNumber value={value} /> : value}
        </span>
        <span className="text-xs font-medium text-slate-500">match</span>
      </div>
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; value: number; delay?: number; live?: boolean }> = ({
  label,
  value,
  delay = 0,
  live = false
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span className="text-xs font-semibold text-slate-900">
        {live ? <TweenNumber value={value} /> : value}
      </span>
    </div>
    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
      {live ? (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="h-full w-full origin-left rounded-full bg-emerald-600"
        />
      ) : (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: value / 100 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay, ease: EASE }}
          className="h-full w-full origin-left rounded-full bg-emerald-600"
        />
      )}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const HeroScene: React.FC<{
  entry: ScoredCar;
  budgetMax: number;
  carsInBudget: number;
  onBudgetChange: (value: number) => void;
  onView: () => void;
}> = ({ entry, budgetMax, carsInBudget, onBudgetChange, onView }) => {
  const reduce = useReducedMotion();
  const car = entry.car;
  const score = entry.scores.overallScore;
  const budgetPct = ((budgetMax - 8) / 52) * 100;
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 90, damping: 20 });
  const sy = useSpring(my, { stiffness: 90, damping: 20 });
  const rotateX = useSpring(useTransform(sy, [0, 1], [9, -9]), { stiffness: 150, damping: 22 });
  const rotateY = useSpring(useTransform(sx, [0, 1], [-10, 10]), { stiffness: 150, damping: 22 });
  const chipX = useTransform(sx, [0, 1], [-14, 14]);
  const chipY = useTransform(sy, [0, 1], [-10, 10]);
  const backX = useTransform(sx, [0, 1], [12, -12]);
  const leftChipX = useTransform(sx, [0, 1], [10, -10]);

  const isEV = car.fuelTypes.includes('Electric');
  const efficiency = isEV ? `${car.specs.rangeKm} km range` : `${car.specs.mileageKmPerLitreOrKWh} km/l`;

  return (
    <div
      className="relative mx-auto w-full max-w-sm"
      style={{ perspective: 1300 }}
      onMouseMove={(e) => {
        if (reduce) return;
        if ((e.target as HTMLElement).closest('input[type="range"]')) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {/* Rotating dashed orbit */}
      <motion.div
        style={{ x: backX }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute -inset-6 rounded-full border border-dashed border-emerald-600/25"
      />
      <motion.div
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute -inset-12 rounded-full border border-slate-900/[0.06]"
      />

      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative">
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10"
        >
          <motion.div
            key={car.id}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100"
          >
            <CarImage
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              brand={car.brand}
              model={car.model}
              bodyType={car.bodyType}
              isEV={isEV}
              className="transition-transform duration-700 hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-white/15 bg-black/50 px-2 py-1 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-white">Top match for this budget</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-300">{car.brand}</div>
                <div className="text-lg font-semibold leading-tight text-white">{car.model}</div>
                <div className="text-xs font-medium text-white/80">
                  ₹{car.priceMinLakh}L to ₹{car.priceMaxLakh}L
                </div>
              </div>
              <button
                onClick={onView}
                className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-900 transition-colors duration-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Specs
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {car.safety.ratingStars ?? car.safety.globalNcapStars ?? 5} star {car.safety.testingAgency || 'BNCAP'}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {isEV ? <Sparkles className="h-4 w-4 text-cyan-600" /> : <Fuel className="h-4 w-4 text-cyan-600" />}
                {efficiency}
              </div>
            </div>
            <ScoreRing value={score} live />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="hero-budget" className="text-xs font-medium text-slate-600">
                Budget ceiling
              </label>
              <span className="text-sm font-semibold text-slate-900">
                ₹<TweenNumber value={budgetMax} /> lakh
              </span>
            </div>
            <input
              id="hero-budget"
              type="range"
              min={8}
              max={60}
              step={1}
              value={budgetMax}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              aria-label="Budget ceiling in lakhs"
              aria-valuetext={`₹${budgetMax} lakh`}
              className="budget-range mt-3 w-full"
              style={{
                background: `linear-gradient(to right, #059669 0%, #059669 ${budgetPct}%, #E2E8F0 ${budgetPct}%, #E2E8F0 100%)`
              }}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>₹8L</span>
              <span>{carsInBudget} models inside</span>
              <span>₹60L</span>
            </div>

            <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
              <ScoreBar label="Budget fit" value={entry.scores.budgetScore} live />
              <ScoreBar label="Safety" value={entry.scores.safetyScore} live />
            </div>
          </div>
        </motion.div>

        {/* Floating chips */}
        <motion.div
          style={{ x: chipX, y: chipY }}
          className="absolute -top-10 right-2 hidden sm:block"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -9, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-xl shadow-slate-900/10 backdrop-blur"
          >
            <Wallet className="h-4 w-4 text-emerald-600" />
            <div>
              <div className="text-xs font-semibold text-slate-900">Monthly cost</div>
              <div className="text-xs text-slate-500">EMI, fuel, insurance</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ x: leftChipX }}
          className="absolute -bottom-10 left-2 hidden sm:block"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-xl shadow-slate-900/10 backdrop-blur"
          >
            <ArrowLeftRight className="h-4 w-4 text-cyan-600" />
            <div>
              <div className="text-xs font-semibold text-slate-900">Side by side</div>
              <div className="text-xs text-slate-500">Up to four cars</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Hero: React.FC<{
  cars: Car[];
  models: number;
  brands: number;
  onStartFinder: () => void;
  onExploreCars: () => void;
  onViewCarDetails: (car: Car) => void;
}> = ({ cars, models, brands, onStartFinder, onExploreCars, onViewCarDetails }) => {
  const [phrase, setPhrase] = useState(0);
  const [budgetMax, setBudgetMax] = useState(18);
  const reduce = useReducedMotion();

  // Live re-score as the budget slider moves
  const heroEntry = useMemo(() => {
    const prefs: UserPreferences = {
      ...SAMPLE_PREFS,
      budgetMinLakh: 5,
      budgetMaxLakh: budgetMax
    };
    return calculateRecommendations(prefs, cars)[0];
  }, [budgetMax, cars]);

  const carsInBudget = useMemo(
    () => cars.filter((car) => car.priceMinLakh <= budgetMax).length,
    [cars, budgetMax]
  );
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  useEffect(() => {
    const timer = setInterval(() => setPhrase((i) => (i + 1) % PHRASES.length), 3400);
    return () => clearInterval(timer);
  }, []);

  if (!heroEntry) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Flat surface plus texture and soft light */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[#F7F9FC]" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.10) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)'
        }}
      />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-32 -top-24 -z-10 h-80 w-80 rounded-full bg-emerald-300/40 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="pointer-events-none absolute -right-24 top-24 -z-10 h-72 w-72 rounded-full bg-cyan-200/50 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-white/80 px-3 py-1 backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700">A scored shortlist, not another list of cars</span>
            </motion.div>

            <h1 className="heading-1 mt-6 max-w-[680px] text-slate-900">
              <span className="sr-only">Find the car that is right for your family.</span>
              <span aria-hidden="true">
                {['Find', 'the', 'car', 'that', 'is'].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.65, delay: 0.06 * i, ease: EASE }}
                    className="mr-2 inline-block bg-gradient-to-r from-black to-[#666666] bg-clip-text text-transparent"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span aria-hidden="true" className="mt-1 block min-h-[1.15em]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={phrase}
                    initial={{ y: 28, opacity: 0, filter: 'blur(8px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -28, opacity: 0, filter: 'blur(8px)' }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="inline-block text-emerald-600"
                  >
                    {PHRASES[phrase]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
              className="body-3 mt-6 max-w-[680px]"
            >
              Tell DriveAI your budget, your family and how you actually drive. Every model on the Indian market is
              weighted on crash safety, real mileage, cabin space and five year running cost, then the three that fit
              rise to the top.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44, ease: EASE }}
              className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
            >
              <Magnetic>
                <button
                  onClick={onStartFinder}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  Find my car with AI
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <button
                onClick={onExploreCars}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-base font-semibold text-slate-700 transition-colors duration-300 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Browse all {models} cars
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 grid max-w-[680px] grid-cols-3 gap-4 border-t border-slate-200 pt-6"
            >
              {[
                { value: models, suffix: '', label: 'models scored' },
                { value: brands, suffix: '', label: 'brands covered' },
                { value: 5, suffix: ' yr', label: 'cost of ownership' }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-semibold text-slate-900">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div style={{ y: sceneY }} className="lg:col-span-6 xl:col-span-5">
            <HeroScene
              entry={heroEntry}
              budgetMax={budgetMax}
              carsInBudget={carsInBudget}
              onBudgetChange={setBudgetMax}
              onView={() => onViewCarDetails(heroEntry.car)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Tagline reveal                                                      */
/* ------------------------------------------------------------------ */

const RevealWord: React.FC<{ word: string; progress: MotionValue<number>; range: [number, number]; reduce: boolean }> = ({
  word,
  progress,
  range,
  reduce
}) => {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className="mr-3 inline-block">
      {word}
    </motion.span>
  );
};

const TaglineReveal: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.55'] });

  const words =
    'Car buying in India runs on guesswork, showroom pressure and one friend who swears by his own car. DriveAI replaces all three with a scored shortlist built around your budget and your family.'.split(
      ' '
    );

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-white">
      <div ref={ref} className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <Reveal>
          <p className="eyebrow">The whole idea</p>
        </Reveal>
        <p className="heading-2 mt-6 max-w-[680px] text-slate-900">
          {words.map((word, i) => (
            <RevealWord
              key={`${word}-${i}`}
              word={word}
              progress={scrollYProgress}
              range={[i / words.length, Math.min(1, (i + 1.6) / words.length)]}
              reduce={reduce}
            />
          ))}
        </p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

const Benefits: React.FC = () => (
  <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
    <Reveal className="max-w-3xl">
      <p className="eyebrow">What the score buys you</p>
      <h2 className="heading-2 mt-4 text-slate-900">Four questions a spec sheet never answers</h2>
      <p className="body-3 mt-4 max-w-[680px]">
        Every section of DriveAI exists to remove one decision you would otherwise make on a hunch.
      </p>
    </Reveal>

    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {BENEFITS.map((benefit, i) => (
        <motion.div
          key={benefit.title}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0, y: 32 },
            show: { opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.08, ease: EASE } }
          }}
          whileHover={{ y: -4 }}
          className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-emerald-600/40"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6 group-hover:scale-105">
              <benefit.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400">0{i + 1}</span>
          </div>
          <h3 className="title-2 mt-6 text-slate-900">{benefit.title}</h3>
          <p className="body-6 mt-2">{benefit.body}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const HowItWorks: React.FC = () => (
  <section className="border-y border-slate-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="max-w-3xl">
        <p className="eyebrow">How it works</p>
        <h2 className="heading-2 mt-4 text-slate-900">One minute in, a shortlist out</h2>
      </Reveal>

      <div className="relative mt-12">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: EASE }}
          className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-slate-200 md:block"
        />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.15 + i * 0.15, ease: EASE } }
              }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-[#F7F9FC] text-sm font-semibold text-emerald-700"
              >
                {i + 1}
              </motion.div>
              <h3 className="title-2 mt-6 text-slate-900">{step.title}</h3>
              <p className="body-6 mt-2 max-w-sm">{step.body}</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                <step.icon className="h-4 w-4" />
                Step {i + 1} of 3
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const MatchDemo: React.FC<{
  ranked: { car: Car; scores: ReturnType<typeof calculateRecommendations>[number]['scores'] }[];
  onViewCarDetails: (car: Car) => void;
  onStartFinder: () => void;
}> = ({ ranked, onViewCarDetails, onStartFinder }) => {
  const top = ranked[0];
  if (!top) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">The match engine</p>
          <h2 className="heading-2 mt-4 text-slate-900">The score is arithmetic, not opinion</h2>
          <p className="body-3 mt-4 max-w-[680px]">
            This is a live result from the same engine the finder uses. The profile below is a buyer with a fifteen
            lakh budget, five seats to fill and safety set to the highest weight.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['₹12L to ₹18L budget', 'Family of five', 'City commute', 'Safety first'].map((chip) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                {chip}
              </motion.span>
            ))}
          </div>
          <button
            onClick={onStartFinder}
            className="group mt-8 inline-flex items-center gap-2 text-base font-semibold text-emerald-700 transition-colors duration-300 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Score it with my own profile
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Best match</div>
                <div className="heading-4 mt-1 text-slate-900">
                  {top.car.brand} {top.car.model}
                </div>
                <div className="text-xs text-slate-500">
                  ₹{top.car.priceMinLakh}L to ₹{top.car.priceMaxLakh}L · {top.car.bodyType}
                </div>
              </div>
              <ScoreRing value={top.scores.overallScore} size={78} />
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 sm:aspect-auto">
                <CarImage
                  src={top.car.image}
                  alt={`${top.car.brand} ${top.car.model}`}
                  brand={top.car.brand}
                  model={top.car.model}
                  bodyType={top.car.bodyType}
                  isEV={top.car.fuelTypes.includes('Electric')}
                />
              </div>
              <div className="space-y-4">
                <ScoreBar label="Budget fit" value={top.scores.budgetScore} delay={0.2} />
                <ScoreBar label="Safety" value={top.scores.safetyScore} delay={0.3} />
                <ScoreBar label="Running cost" value={top.scores.mileageScore} delay={0.4} />
                <ScoreBar label="Cabin space" value={top.scores.comfortSpaceScore} delay={0.5} />
                <ScoreBar label="Maintenance" value={top.scores.maintenanceScore} delay={0.6} />
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Next in line</span>
                <button
                  onClick={() => onViewCarDetails(top.car)}
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition-colors duration-300 hover:text-emerald-700"
                >
                  Open full specs
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {ranked.slice(1, 3).map((entry, i) => (
                  <motion.button
                    key={entry.car.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 * i, ease: EASE }}
                    onClick={() => onViewCarDetails(entry.car)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-left transition-colors duration-300 hover:bg-slate-100"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                      <span className="text-xs text-slate-400">#{i + 2}</span>
                      {entry.car.brand} {entry.car.model}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">{entry.scores.overallScore}% match</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Featured: React.FC<{
  picks: { car: Car; label: string }[];
  ranked: ReturnType<typeof calculateRecommendations>;
  favoriteCarIds: string[];
  comparedCarIds: string[];
  onToggleFavorite: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  onViewCarDetails: (car: Car) => void;
  onExploreCars: () => void;
}> = ({ picks, ranked, favoriteCarIds, comparedCarIds, onToggleFavorite, onToggleCompare, onViewCarDetails, onExploreCars }) => (
  <section className="border-y border-slate-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">From the catalogue</p>
          <h2 className="heading-2 mt-4 text-slate-900">Three cars worth a closer look</h2>
          <p className="body-3 mt-4">
            Picked by the numbers, not by a sponsorship: the strongest crash rating, the longest electric range and the
            roomiest cabin for the money.
          </p>
        </div>
        <button
          onClick={onExploreCars}
          className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-[#F7F9FC] px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:border-emerald-600/40 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          See every model
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {picks.map(({ car, label }, i) => (
          <motion.div
            key={car.id}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: { opacity: 0, y: 36 },
              show: { opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.1, ease: EASE } }
            }}
            className="flex flex-col"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {label}
            </div>
            <div className="h-full">
              <CarCard
                car={car}
                matchScore={ranked.find((entry) => entry.car.id === car.id)?.scores}
                isFavorite={favoriteCarIds.includes(car.id)}
                isCompared={comparedCarIds.includes(car.id)}
                onToggleFavorite={onToggleFavorite}
                onToggleCompare={onToggleCompare}
                onViewDetails={onViewCarDetails}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Coverage: React.FC<{ models: number; brands: number; fiveStar: number; electric: number }> = ({
  models,
  brands,
  fiveStar,
  electric
}) => (
  <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
      <Reveal className="lg:col-span-5">
        <p className="eyebrow">Coverage</p>
        <h2 className="heading-2 mt-4 text-slate-900">The whole market, not a paid shelf</h2>
        <p className="body-3 mt-4 max-w-[680px]">
          From a hatchback under eight lakh to a three crore luxury SUV, the catalogue keeps every brand sold in India
          in one scoring model.
        </p>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 lg:col-span-7">
        {[
          { value: models, label: 'models in the catalogue' },
          { value: brands, label: 'brands on sale in India' },
          { value: fiveStar, label: 'models with a five star rating' },
          { value: electric, label: 'electric models with range data' }
        ].map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-emerald-600/40">
              <div className="heading-3 text-slate-900">
                <Counter to={stat.value} />
              </div>
              <div className="mt-2 text-sm text-slate-500">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Questions</p>
          <h2 className="heading-2 mt-4 text-slate-900">Asked before the first test drive</h2>
        </Reveal>

        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <span className="title-3 text-slate-900">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500"
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </motion.span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="body-6 max-w-[680px] pb-6 pr-10">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FinalCta: React.FC<{ models: number; onStartFinder: () => void; onExploreCars: () => void }> = ({
  models,
  onStartFinder,
  onExploreCars
}) => {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-emerald-700 px-6 py-16 text-center sm:px-12">
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.3, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-emerald-400/40 blur-[90px]"
          />
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-[100px]"
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Start here</p>
            <h2 className="heading-2 mt-4 text-white">Stop guessing. Start with your budget.</h2>
            <p className="mx-auto mt-4 max-w-[680px] text-base font-medium text-emerald-50">
              Five questions, {models} models scored, three that fit. No account needed to see the result.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <button
                  onClick={onStartFinder}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-emerald-800 transition-all duration-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700 active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  Open the AI car finder
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <button
                onClick={onExploreCars}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-white/90 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Browse the catalogue
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-emerald-100">
              <Check className="h-3.5 w-3.5" />
              Free to use, no credit card, no dealer referral
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface LandingPageProps {
  cars: Car[];
  favoriteCarIds: string[];
  comparedCarIds: string[];
  onStartFinder: () => void;
  onExploreCars: () => void;
  onViewCarDetails: (car: Car) => void;
  onToggleFavorite: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  cars,
  favoriteCarIds,
  comparedCarIds,
  onStartFinder,
  onExploreCars,
  onViewCarDetails,
  onToggleFavorite,
  onToggleCompare
}) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  const ranked = useMemo(() => calculateRecommendations(SAMPLE_PREFS, cars), [cars]);

  const stats = useMemo(() => {
    const brands = new Set(cars.map((car) => car.brand));
    const fiveStar = cars.filter(
      (car) => car.safety.ratingStars === 5 || car.safety.globalNcapStars === 5
    ).length;
    const electric = cars.filter(
      (car) => car.fuelTypes.includes('Electric') && Boolean(car.specs.rangeKm)
    ).length;
    return { models: cars.length, brands: brands.size, fiveStar, electric };
  }, [cars]);

  const picks = useMemo(() => {
    const seen = new Set<string>();
    const add = (car: Car | undefined, label: string) => {
      if (!car || seen.has(car.id)) return null;
      seen.add(car.id);
      return { car, label };
    };

    const safest = [...cars].sort(
      (a, b) =>
        (b.safety.ratingStars ?? 0) - (a.safety.ratingStars ?? 0) || a.priceMinLakh - b.priceMinLakh
    )[0];
    const ev = [...cars]
      .filter((car) => car.fuelTypes.includes('Electric'))
      .sort((a, b) => (b.specs.rangeKm ?? 0) - (a.specs.rangeKm ?? 0))[0];
    const family = [...cars]
      .filter((car) => car.specs.seatingCapacity >= 7)
      .sort((a, b) => a.priceMinLakh - b.priceMinLakh)[0];

    return [
      add(safest, 'Strongest crash rating'),
      add(ev, 'Longest electric range'),
      add(family, 'Most room for the money')
    ].filter((item): item is { car: Car; label: string } => item !== null);
  }, [cars]);

  const heroEntry = ranked[0];

  if (!heroEntry) return null;

  return (
    <div className="relative">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-emerald-600"
        aria-hidden
      />

      <Hero
        cars={cars}
        models={stats.models}
        brands={stats.brands}
        onStartFinder={onStartFinder}
        onExploreCars={onExploreCars}
        onViewCarDetails={onViewCarDetails}
      />

      <BrandMarquee />

      <TaglineReveal />

      <Benefits />

      <HowItWorks />

      <MatchDemo ranked={ranked} onViewCarDetails={onViewCarDetails} onStartFinder={onStartFinder} />

      <Featured
        picks={picks}
        ranked={ranked}
        favoriteCarIds={favoriteCarIds}
        comparedCarIds={comparedCarIds}
        onToggleFavorite={onToggleFavorite}
        onToggleCompare={onToggleCompare}
        onViewCarDetails={onViewCarDetails}
        onExploreCars={onExploreCars}
      />

      <Coverage
        models={stats.models}
        brands={stats.brands}
        fiveStar={stats.fiveStar}
        electric={stats.electric}
      />

      <Faq />

      <FinalCta models={stats.models} onStartFinder={onStartFinder} onExploreCars={onExploreCars} />
    </div>
  );
};

export default LandingPage;
