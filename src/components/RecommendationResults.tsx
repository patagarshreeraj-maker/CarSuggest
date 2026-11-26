import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ShieldCheck, 
  Fuel, 
  ArrowLeftRight, 
  Calculator, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  MessageSquare, 
  Award
} from 'lucide-react';
import { ScoredCar, UserPreferences, AIRecommendationResponse } from '../types';
import { CarImage } from './CarImage';

interface RecommendationResultsProps {
  scoredCars: ScoredCar[];
  userPreferences: UserPreferences;
  aiExplanation: AIRecommendationResponse | null;
  isLoadingAi: boolean;
  onViewCarDetails: (car: ScoredCar['car']) => void;
  onCompareCars: (cars: ScoredCar['car'][]) => void;
  onOpenOwnership: (car: ScoredCar['car']) => void;
  onAskAiAboutCar: (carName: string) => void;
  onResetFinder: () => void;
}

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  scoredCars,
  userPreferences,
  aiExplanation,
  isLoadingAi,
  onViewCarDetails,
  onCompareCars,
  onOpenOwnership,
  onAskAiAboutCar,
  onResetFinder
}) => {
  useEffect(() => {
    // Fire celebratory confetti on recommendations reveal
    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff5a1f', '#ff9a5f', '#101624', '#ffffff']
      });
    } catch {
      // ignore in test/headless environments
    }
  }, []);

  if (!scoredCars || scoredCars.length === 0) return null;

  const topMatch = scoredCars[0];
  const runnerUps = scoredCars.slice(1, 4);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Banner & Filter Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-[#ff5a1f]/15 text-[#ff5a1f] border border-[#ff5a1f]/30 text-xs font-bold">
              AI Match Computation Complete
            </span>
          </div>
          <p className="text-xs text-[#556078] dark:text-[#9aa6c0]">
            Ranked based on your ₹{userPreferences.budgetMinLakh}L–₹{userPreferences.budgetMaxLakh}L budget, {userPreferences.familySize}-person family, and {userPreferences.primaryUsage.toLowerCase()} profile.
          </p>
        </div>

        <button
          onClick={onResetFinder}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#ff5a1f] text-xs font-bold border border-[#101624]/10 dark:border-white/10 transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#ff5a1f]" />
          <span>Refine Criteria</span>
        </button>
      </div>

      {/* #1 BEST MATCH SHOWCASE (Dominant Visual Hierarchy) */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#101624] via-[#0d131f] to-[#070b13] text-white border border-[#ff5a1f]/35 p-6 sm:p-9 shadow-2xl shadow-[#ff5a1f]/10 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5a1f]/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5a1f] text-white text-xs font-black tracking-wide uppercase shadow-lg shadow-[#ff5a1f]/30 font-['Unbounded',sans-serif]">
            <Award className="w-4 h-4" />
            TOP MATCH (#1 RANKED)
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Match Compatibility:</span>
            <span className="px-3 py-1 rounded-full bg-[#ff5a1f]/20 text-[#ff5a1f] border border-[#ff5a1f]/40 text-sm font-extrabold font-['Unbounded',sans-serif]">
              {topMatch.scores.overallScore}% AI MATCH
            </span>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Car Media & Key Stats */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group">
              <CarImage
                src={topMatch.car.image}
                alt={`${topMatch.car.brand} ${topMatch.car.model}`}
                brand={topMatch.car.brand}
                model={topMatch.car.model}
                bodyType={topMatch.car.bodyType}
                isEV={topMatch.car.fuelTypes.includes('Electric')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/15">
                  {topMatch.car.bodyType}
                </span>
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-[#ff5a1f] border border-[#ff5a1f]/30">
                  {topMatch.car.fuelTypes.join(' / ')}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-[#ff5a1f] font-bold uppercase tracking-wider">{topMatch.car.brand}</div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Unbounded',sans-serif]">{topMatch.car.model}</h2>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Starting Ex-Showroom</div>
                  <div className="text-xl sm:text-2xl font-bold text-white font-['Unbounded',sans-serif]">
                    ₹{topMatch.car.priceMinLakh}L – ₹{topMatch.car.priceMaxLakh}L
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Chips Row */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center backdrop-blur-md">
                <div className="text-[10px] text-slate-400">Efficiency / Range</div>
                <div className="text-sm font-bold text-[#ff5a1f] font-['Unbounded',sans-serif]">
                  {topMatch.car.fuelTypes.includes('Electric') 
                    ? `${topMatch.car.specs.rangeKm} km` 
                    : `${topMatch.car.specs.mileageKmPerLitreOrKWh} km/l`}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center backdrop-blur-md">
                <div className="text-[10px] text-slate-400">Safety Rating</div>
                <div className="text-sm font-bold text-white font-['Unbounded',sans-serif] flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff5a1f]" />
                  <span>{topMatch.car.safety.ratingStars}★ {topMatch.car.safety.testingAgency}</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center backdrop-blur-md">
                <div className="text-[10px] text-slate-400">Power Output</div>
                <div className="text-sm font-bold text-white font-['Unbounded',sans-serif]">
                  {topMatch.car.specs.powerPS} PS
                </div>
              </div>
            </div>
          </div>

          {/* Right: Multi-Factor Match Score Breakdown & AI Rationale */}
          <div className="lg:col-span-6 space-y-5">
            {/* Tagline */}
            <p className="text-sm text-slate-300 font-medium italic border-l-2 border-[#ff5a1f] pl-3">
              "{topMatch.car.tagline}"
            </p>

            {/* Score Breakdown Bars */}
            <div className="p-4 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#ff5a1f]" />
                Compatibility Breakdown
              </h4>

              <div className="space-y-2">
                {[
                  { label: 'Budget Fit', score: topMatch.scores.budgetScore },
                  { label: 'Safety & NCAP', score: topMatch.scores.safetyScore },
                  { label: 'Fuel / Energy Economy', score: topMatch.scores.mileageScore },
                  { label: 'Cabin & Seating Comfort', score: topMatch.scores.comfortSpaceScore },
                  { label: 'Performance & Drive', score: topMatch.scores.performanceScore },
                  { label: 'Reliability & Service Cost', score: topMatch.scores.maintenanceScore }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.label}</span>
                      <span className="font-bold text-[#ff5a1f] font-['Unbounded',sans-serif]">{item.score}%</span>
                    </div>
                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff5a1f] to-[#ff9a5f] rounded-full transition-all duration-700"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2 text-[#ff5a1f] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
                <span>AI Automotive Consultant Rationale</span>
                {isLoadingAi && <span className="text-[10px] text-slate-400 lowercase font-normal">(analyzing...)</span>}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {aiExplanation?.topPickReasoning || 
                 `The ${topMatch.car.brand} ${topMatch.car.model} best aligns with your ₹${userPreferences.budgetMinLakh}L–₹${userPreferences.budgetMaxLakh}L budget, satisfies your ${userPreferences.familySize}-person family cabin space, and provides best-in-class safety and road dynamics for Indian highway and city conditions.`}
              </p>

              {/* Specific User Advantages & Trade-offs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Key Strengths:
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                    {(aiExplanation?.prosForUser || topMatch.car.pros.slice(0, 2)).map((pro, i) => (
                      <li key={i} className="truncate">{pro}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Points to Consider:
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-0.5 list-disc list-inside">
                    {(aiExplanation?.tradeOffs || topMatch.car.cons.slice(0, 2)).map((con, i) => (
                      <li key={i} className="truncate">{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons for Top Car */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                id="top-car-view-specs-btn"
                onClick={() => onViewCarDetails(topMatch.car)}
                className="flex-1 py-3 px-5 bg-white text-[#101624] hover:bg-slate-100 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-lg hover:shadow-[0_8px_24px_-4px_#ff5a1f] transition-all cursor-pointer"
              >
                <span>View Full Specifications</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ff5a1f]" />
              </button>

              <button
                id="top-car-ownership-btn"
                onClick={() => onOpenOwnership(topMatch.car)}
                className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-full border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-[#ff5a1f]" />
                5-Yr TCO & EMI
              </button>

              <button
                id="top-car-ask-ai-btn"
                onClick={() => onAskAiAboutCar(`${topMatch.car.brand} ${topMatch.car.model}`)}
                className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-full border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#ff5a1f]" />
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOP ALTERNATIVES / RUNNER-UPS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
            Recommended Alternatives
          </h3>
          <button
            onClick={() => onCompareCars([topMatch.car, ...runnerUps.map(r => r.car)])}
            className="text-xs text-[#ff5a1f] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Compare Top 4 Side-by-Side &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {runnerUps.map((item, idx) => (
            <div
              key={item.car.id}
              className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 hover:border-[#ff5a1f]/40 p-4 space-y-3 transition-all group flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-[#ff5a1f]/10"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
                  <CarImage
                    src={item.car.image}
                    alt={`${item.car.brand} ${item.car.model}`}
                    brand={item.car.brand}
                    model={item.car.model}
                    bodyType={item.car.bodyType}
                    isEV={item.car.fuelTypes.includes('Electric')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-[#ff5a1f]/40 text-[#ff5a1f] font-bold text-[11px] font-['Unbounded',sans-serif] pointer-events-none z-10">
                    {item.scores.overallScore}% MATCH
                  </div>
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-[10px] text-white font-medium pointer-events-none z-10">
                    Rank #{idx + 2}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold text-[#ff5a1f] uppercase">{item.car.brand}</div>
                    <h4 className="text-base font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif]">{item.car.model}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif]">₹{item.car.priceMinLakh}L–{item.car.priceMaxLakh}L</div>
                    <div className="text-[10px] text-slate-500">{item.car.fuelTypes.join(', ')}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                  {item.car.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-[#101624]/10 dark:border-white/10 flex items-center gap-2">
                <button
                  onClick={() => onViewCarDetails(item.car)}
                  className="flex-1 py-2 px-3 bg-[#101624] hover:bg-black dark:bg-[#eef2fb] dark:hover:bg-white text-white dark:text-[#101624] text-xs font-bold rounded-full transition-all text-center cursor-pointer shadow-sm hover:shadow-[0_6px_18px_-4px_#ff5a1f]"
                >
                  View Details
                </button>
                <button
                  onClick={() => onCompareCars([topMatch.car, item.car])}
                  className="p-2 bg-black/5 dark:bg-white/10 hover:bg-[#ff5a1f]/15 hover:text-[#ff5a1f] text-slate-600 dark:text-slate-300 rounded-full transition-all cursor-pointer"
                  title="Compare with #1 Match"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
