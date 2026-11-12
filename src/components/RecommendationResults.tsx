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
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E599', '#00F0FF', '#ffffff', '#10B981']
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs font-bold">
              AI Match Ready
            </span>
            <span className="text-xs text-slate-500">
              Ranked from 24 vehicles based on your ₹{userPreferences.budgetMinLakh}L–₹{userPreferences.budgetMaxLakh}L budget & lifestyle
            </span>
          </div>
        </div>

        <button
          onClick={onResetFinder}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refine Preferences
        </button>
      </div>

      {/* #1 BEST MATCH SHOWCASE (Dominant Visual Hierarchy) */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#131923] via-[#0F131C] to-[#0A0D12] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500 text-black text-xs font-extrabold tracking-wide uppercase shadow-lg shadow-emerald-500/30">
            <Award className="w-4 h-4" />
            YOUR BEST MATCH (#1 RANKED)
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Match Confidence:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-400/40 text-sm font-extrabold font-['Manrope']">
              {topMatch.scores.overallScore}% AI MATCH
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Car Media & Key Stats */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <CarImage
                src={topMatch.car.image}
                alt={`${topMatch.car.brand} ${topMatch.car.model}`}
                brand={topMatch.car.brand}
                model={topMatch.car.model}
                bodyType={topMatch.car.bodyType}
                isEV={topMatch.car.fuelTypes.includes('Electric')}
                className="group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />

              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-semibold text-emerald-300 border border-white/10">
                  {topMatch.car.bodyType}
                </span>
                <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-semibold text-cyan-300 border border-white/10">
                  {topMatch.car.fuelTypes.join(' / ')}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">{topMatch.car.brand}</div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Manrope']">{topMatch.car.model}</h2>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Starting Ex-Showroom</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 font-['Manrope']">
                    ₹{topMatch.car.priceMinLakh}L – ₹{topMatch.car.priceMaxLakh}L
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Chips Row */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <div className="text-[11px] text-slate-500">Efficiency / Range</div>
                <div className="text-sm font-bold text-emerald-600 font-['Manrope']">
                  {topMatch.car.fuelTypes.includes('Electric') 
                    ? `${topMatch.car.specs.rangeKm} km Range` 
                    : `${topMatch.car.specs.mileageKmPerLitreOrKWh} km/l`}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <div className="text-[11px] text-slate-500">Crash Safety</div>
                <div className="text-sm font-bold text-emerald-600 font-['Manrope']">
                  {topMatch.car.safety.ratingStars}★ {topMatch.car.safety.testingAgency}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <div className="text-[11px] text-slate-500">Power Output</div>
                <div className="text-sm font-bold text-slate-900 font-['Manrope']">
                  {topMatch.car.specs.powerPS} PS
                </div>
              </div>
            </div>
          </div>

          {/* Right: Multi-Factor Match Score Breakdown & AI Rationale */}
          <div className="lg:col-span-6 space-y-5">
            {/* Tagline */}
            <p className="text-sm text-slate-600 font-medium italic border-l-2 border-emerald-400 pl-3">
              "{topMatch.car.tagline}"
            </p>

            {/* Score Breakdown Bars (As specified in PRD Section 10) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Multi-Factor Compatibility Analysis
              </h4>

              <div className="space-y-2">
                {[
                  { label: 'Budget Fit', score: topMatch.scores.budgetScore },
                  { label: 'Crash Safety & ADAS', score: topMatch.scores.safetyScore },
                  { label: 'Fuel / Energy Economy', score: topMatch.scores.mileageScore },
                  { label: 'Comfort & Seating Space', score: topMatch.scores.comfortSpaceScore },
                  { label: 'Performance & Drive', score: topMatch.scores.performanceScore },
                  { label: 'Low Maintenance & Reliability', score: topMatch.scores.maintenanceScore }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">{item.label}</span>
                      <span className="font-bold text-emerald-600 font-['Manrope']">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight Card (Section 11 in Design Doc) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-[#131B24] to-[#12161F] border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Automotive Consultant Insight</span>
                {isLoadingAi && <span className="text-[10px] text-slate-500 lowercase font-normal">(analyzing...)</span>}
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-normal">
                {aiExplanation?.topPickReasoning || 
                 `This vehicle is your strongest mathematical match because it falls comfortably within your ₹${userPreferences.budgetMinLakh}-${userPreferences.budgetMaxLakh}L budget, satisfies your ${userPreferences.familySize}-person family seating, and delivers segment-best safety and low operating costs for your ${userPreferences.monthlyKm} km monthly commute.`}
              </p>

              {/* Specific User Advantages & Trade-offs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Key Advantages:
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                    {(aiExplanation?.prosForUser || topMatch.car.pros.slice(0, 2)).map((pro, i) => (
                      <li key={i} className="truncate">{pro}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Trade-offs to Consider:
                  </div>
                  <ul className="text-[11px] text-slate-500 space-y-0.5 list-disc list-inside">
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
                className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <span>View Full Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="top-car-ownership-btn"
                onClick={() => onOpenOwnership(topMatch.car)}
                className="py-3 px-4 bg-white hover:bg-slate-200 text-slate-800 hover:text-slate-900 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                5-Yr TCO & EMI
              </button>

              <button
                id="top-car-ask-ai-btn"
                onClick={() => onAskAiAboutCar(`${topMatch.car.brand} ${topMatch.car.model}`)}
                className="py-3 px-4 bg-white hover:bg-slate-200 text-emerald-600 hover:text-emerald-700 font-semibold text-xs rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOP ALTERNATIVES / RUNNER-UPS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 font-['Manrope'] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Top Recommended Alternatives
          </h3>
          <button
            onClick={() => onCompareCars([topMatch.car, ...runnerUps.map(r => r.car)])}
            className="text-xs text-emerald-600 hover:text-emerald-600 font-semibold flex items-center gap-1"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Compare Top 4 Side-by-Side &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {runnerUps.map((item, idx) => (
            <div
              key={item.car.id}
              className="rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/40 p-4 space-y-3 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <CarImage
                    src={item.car.image}
                    alt={`${item.car.brand} ${item.car.model}`}
                    brand={item.car.brand}
                    model={item.car.model}
                    bodyType={item.car.bodyType}
                    isEV={item.car.fuelTypes.includes('Electric')}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-emerald-500/30 text-emerald-300 font-bold text-xs pointer-events-none z-10">
                    {item.scores.overallScore}% MATCH
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-200 pointer-events-none z-10">
                    Rank #{idx + 2}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-bold text-emerald-600 uppercase">{item.car.brand}</div>
                    <h4 className="text-base font-bold text-slate-900 font-['Manrope']">{item.car.model}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 font-['Manrope']">₹{item.car.priceMinLakh}L – ₹{item.car.priceMaxLakh}L</div>
                    <div className="text-[10px] text-slate-500">{item.car.fuelTypes.join(', ')}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                  {item.car.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => onViewCarDetails(item.car)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-emerald-500 hover:text-black text-slate-800 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => onCompareCars([topMatch.car, item.car])}
                  className="p-2 bg-white hover:bg-slate-200 text-slate-600 hover:text-emerald-600 border border-slate-200 rounded-lg transition-all"
                  title="Compare with #1 Match"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
