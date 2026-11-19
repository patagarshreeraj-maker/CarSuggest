import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Sparkles, 
  ShieldCheck, 
  Fuel, 
  Zap, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  Award,
  TrendingUp,
  MessageSquare,
  Share2,
  Copy
} from 'lucide-react';
import { Car, AIComparisonResponse } from '../types';
import { calculateOwnershipCost } from '../lib/ownershipCalculator';
import { CarImage } from './CarImage';

interface ComparisonViewProps {
  cars: Car[];
  allCars: Car[];
  onRemoveCar: (carId: string) => void;
  onAddCar: (car: Car) => void;
  onViewCarDetails: (car: Car) => void;
  onAskAi: (prompt: string) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  cars,
  allCars,
  onRemoveCar,
  onAddCar,
  onViewCarDetails,
  onAskAi
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState(true);
  const [isGeneratingVerdict, setIsGeneratingVerdict] = useState(false);
  const [verdictData, setVerdictData] = useState<AIComparisonResponse | null>(null);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const availableCarsToAdd = allCars.filter(c => !cars.some(selected => selected.id === c.id));

  const handleShareWhatsApp = () => {
    if (cars.length === 0) return;
    const names = cars.map(c => `${c.brand} ${c.model}`).join(' vs ');
    const lines = [
      `🚗 *CarSuggest Comparison: ${names}*`,
      ``,
      ...cars.map(c => `• *${c.brand} ${c.model}*: ₹${c.priceMinLakh}L–${c.priceMaxLakh}L | ${c.safety.ratingStars || 5}★ Safety | ${c.specs.mileageKmPerLitreOrKWh} km/l | ${c.specs.powerPS} PS`),
      ``,
      `Compare real-world specs, safety & 5-year ownership on CarSuggest:`,
      window.location.origin
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyComparison = () => {
    if (cars.length === 0) return;
    const names = cars.map(c => `${c.brand} ${c.model}`).join(' vs ');
    const lines = [
      `CarSuggest Comparison: ${names}`,
      ...cars.map(c => `• ${c.brand} ${c.model}: ₹${c.priceMinLakh}L–${c.priceMaxLakh}L | ${c.safety.ratingStars || 5}★ Safety | ${c.specs.mileageKmPerLitreOrKWh} km/l`),
      `View on: ${window.location.href}`
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleGenerateVerdict = async () => {
    if (cars.length < 2) return;
    setIsGeneratingVerdict(true);
    try {
      const res = await fetch('/api/ai/compare-verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cars })
      });
      const data = await res.json();
      setVerdictData(data);
    } catch (err) {
      console.error('Failed to get comparison verdict:', err);
      // Fallback verdict
      setVerdictData({
        verdict: `Comparing ${cars.map(c => `${c.brand} ${c.model}`).join(' vs ')} highlights key trade-offs between operating costs, high-speed stability, and overall interior room for Indian families.`,
        bestOverallCarId: cars[0].id,
        bestMileageCarId: cars.reduce((prev, curr) => curr.specs.mileageKmPerLitreOrKWh > prev.specs.mileageKmPerLitreOrKWh ? curr : prev).id,
        bestPerformanceCarId: cars.reduce((prev, curr) => curr.specs.powerPS > prev.specs.powerPS ? curr : prev).id,
        bestValueForMoneyCarId: cars.reduce((prev, curr) => curr.priceMinLakh < prev.priceMinLakh ? curr : prev).id,
        bestFamilyCarId: cars.reduce((prev, curr) => curr.specs.seatingCapacity > prev.specs.seatingCapacity ? curr : prev).id,
        keyDifferentiators: [
          { category: 'Mileage & Energy', description: 'Strong disparity between electric/hybrid powertrains vs traditional petrol.', winnerCarId: cars[0].id },
          { category: 'Crash Safety & ADAS', description: 'Active radar vs passive airbag protection levels.', winnerCarId: cars[0].id }
        ],
        finalAdvice: 'Choose based on whether your regular monthly commute favors maximum fuel economy or long-distance highway comfort.'
      });
    } finally {
      setIsGeneratingVerdict(false);
    }
  };

  // Helper to determine if a spec differs across cars
  const checkDiff = (values: (string | number | boolean)[]) => {
    if (!highlightDifferences || values.length <= 1) return false;
    const first = JSON.stringify(values[0]);
    return values.some(v => JSON.stringify(v) !== first);
  };

  if (cars.length === 0) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-[#101624]/10 dark:border-white/10 flex items-center justify-center mx-auto text-[#ff5a1f] shadow-sm">
          <ArrowLeftRight className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] mb-2 tracking-tight">
            No Vehicles in Comparison
          </h2>
          <p className="text-sm text-[#556078] dark:text-[#9aa6c0] max-w-md mx-auto">
            Select 2 to 4 cars from the Browse page or AI Finder to compare specifications, crash ratings, and running costs side-by-side.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {allCars.slice(0, 3).map((car) => (
            <button
              key={car.id}
              onClick={() => onAddCar(car)}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 hover:border-[#ff5a1f] border border-[#101624]/10 dark:border-white/10 rounded-full text-xs font-bold text-[#101624] dark:text-white transition-all cursor-pointer shadow-sm"
            >
              + Add {car.brand} {car.model}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] flex items-center gap-2.5 tracking-tight">
            <ArrowLeftRight className="w-6 h-6 text-[#ff5a1f]" />
            Side-by-Side Comparison
          </h2>
          <p className="text-xs text-[#556078] dark:text-[#9aa6c0] mt-1">
            Evaluating {cars.length} cars with detailed spec matrix & AI jury verdict.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Highlight Differences Toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#101624]/10 dark:border-white/10 shadow-sm">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded accent-[#ff5a1f]"
            />
            <span className="font-semibold text-xs">Highlight Differences</span>
          </label>

          {/* Share on WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-sm"
            title="Share Comparison on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyComparison}
            className="p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-[#101624]/10 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-full transition-all cursor-pointer shadow-sm"
            title="Copy Specs Summary"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Add Car Dropdown */}
          {cars.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setShowAddDropdown(!showAddDropdown)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-[#101624]/10 dark:border-white/10 text-[#101624] dark:text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#ff5a1f]" />
                Add Car ({cars.length}/4)
              </button>

              {showAddDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-[#101624]/10 dark:border-white/10 rounded-2xl p-2 shadow-2xl z-30 max-h-64 overflow-y-auto space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Select Car to Compare</div>
                  {availableCarsToAdd.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onAddCar(c);
                        setShowAddDropdown(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-semibold">{c.brand} {c.model}</span>
                      <span className="text-[10px] text-[#ff5a1f] font-bold">₹{c.priceMinLakh}L</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Generate AI Verdict Button */}
          {cars.length >= 2 && (
            <button
              onClick={handleGenerateVerdict}
              disabled={isGeneratingVerdict}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#101624] dark:bg-[#eef2fb] hover:bg-black dark:hover:bg-white text-white dark:text-[#101624] font-bold text-xs rounded-full shadow-lg hover:shadow-[0_8px_20px_-4px_#ff5a1f] transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff5a1f]" />
              <span>{isGeneratingVerdict ? 'Analyzing...' : 'Generate AI Verdict'}</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Comparison Verdict Panel */}
      {verdictData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#101624] to-[#0a1020] text-white border border-[#ff5a1f]/35 shadow-xl shadow-[#ff5a1f]/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#ff5a1f] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>CarSuggest AI Comparison Verdict</span>
            </div>
            <button
              onClick={() => onAskAi(`Help me choose between ${cars.map(c => `${c.brand} ${c.model}`).join(' and ')} based on my family needs`)}
              className="text-xs text-[#ff5a1f] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Ask AI Follow-up &rarr;
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {verdictData.verdict}
          </p>

          {/* Category Winners Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { title: 'Best Overall Pick', carId: verdictData.bestOverallCarId, badgeColor: 'border-[#ff5a1f]/40 text-[#ff5a1f]' },
              { title: 'Best Mileage / EV', carId: verdictData.bestMileageCarId, badgeColor: 'border-cyan-400 text-cyan-400' },
              { title: 'Best Performance', carId: verdictData.bestPerformanceCarId, badgeColor: 'border-amber-400 text-amber-400' },
              { title: 'Best Value for Money', carId: verdictData.bestValueForMoneyCarId, badgeColor: 'border-emerald-400 text-emerald-400' }
            ].map((winner, idx) => {
              const winningCar = cars.find(c => c.id === winner.carId) || cars[0];
              return (
                <div key={idx} className={`p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border ${winner.badgeColor} space-y-1`}>
                  <div className="text-[10px] text-slate-400 font-semibold">{winner.title}</div>
                  <div className="text-sm font-bold text-white font-['Unbounded',sans-serif] truncate">
                    {winningCar.brand} {winningCar.model}
                  </div>
                  <div className="text-[10px] text-[#ff5a1f] font-bold">
                    ₹{winningCar.priceMinLakh}L onwards
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Advice */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
            <span className="font-bold text-[#ff5a1f]">Buying Recommendation: </span>
            {verdictData.finalAdvice}
          </div>
        </div>
      )}

      {/* Comparison Specifications Matrix Table */}
      <div className="overflow-x-auto rounded-3xl border border-[#101624]/10 dark:border-white/10 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left text-xs border-collapse min-w-[720px]">
          {/* Header Row with Car Thumbnails */}
          <thead>
            <tr className="border-b border-[#101624]/10 dark:border-white/10 bg-[#e8edf4]/70 dark:bg-slate-800/70">
              <th className="p-5 w-52 text-[#556078] dark:text-[#9aa6c0] font-bold uppercase tracking-wider text-[10px] font-['Unbounded',sans-serif] align-bottom">
                Specifications Matrix
              </th>
              {cars.map((car) => (
                <th key={car.id} className="p-4 sm:p-5 w-64 align-top">
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-[#101624]/10 dark:border-white/10 group">
                      <CarImage 
                        src={car.image} 
                        alt={`${car.brand} ${car.model}`}
                        brand={car.brand}
                        model={car.model}
                        bodyType={car.bodyType}
                        isEV={car.fuelTypes.includes('Electric')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => onRemoveCar(car.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-rose-500 text-white backdrop-blur-md transition-colors cursor-pointer z-10"
                        title="Remove car from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-[#ff5a1f] uppercase tracking-wider">{car.brand}</div>
                      <div className="text-base sm:text-lg font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] truncate">
                        {car.model}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#ff5a1f] font-['Unbounded',sans-serif] mt-0.5">
                        ₹{car.priceMinLakh}L – ₹{car.priceMaxLakh}L
                      </div>
                    </div>

                    <button
                      onClick={() => onViewCarDetails(car)}
                      className="w-full py-2 px-3 bg-[#101624] hover:bg-black dark:bg-[#eef2fb] dark:hover:bg-white text-white dark:text-[#101624] text-xs font-bold rounded-full transition-all text-center cursor-pointer shadow-sm hover:shadow-[0_6px_18px_-4px_#ff5a1f]"
                    >
                      Full Details
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#101624]/5 dark:divide-white/5">
            {/* PRICING & SEGMENT */}
            <tr className="bg-[#101624]/5 dark:bg-white/5">
              <td colSpan={cars.length + 1} className="py-2.5 px-5 text-[11px] font-bold uppercase tracking-wider text-[#ff5a1f] font-['Unbounded',sans-serif]">
                1. Pricing & Segment
              </td>
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Price Range (Ex-Showroom)</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => `${x.priceMinLakh}-${x.priceMaxLakh}`));
                return (
                  <td key={c.id} className={`p-4 font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] text-xs ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    ₹{c.priceMinLakh}L – ₹{c.priceMaxLakh}L
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Body Category</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.bodyType));
                return (
                  <td key={c.id} className={`p-4 font-bold text-[#101624] dark:text-slate-200 ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.bodyType}
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Fuel Choices</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.fuelTypes.join(',')));
                return (
                  <td key={c.id} className={`p-4 font-bold text-[#ff5a1f] ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.fuelTypes.join(', ')}
                  </td>
                );
              })}
            </tr>

            {/* PERFORMANCE & ENGINE */}
            <tr className="bg-[#101624]/5 dark:bg-white/5">
              <td colSpan={cars.length + 1} className="py-2.5 px-5 text-[11px] font-bold uppercase tracking-wider text-[#ff5a1f] font-['Unbounded',sans-serif]">
                2. Engine & Performance
              </td>
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Power Output (PS)</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.specs.powerPS));
                return (
                  <td key={c.id} className={`p-4 font-bold text-[#101624] dark:text-white text-sm font-['Unbounded',sans-serif] ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.specs.powerPS} PS
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Peak Torque (Nm)</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.specs.torqueNM));
                return (
                  <td key={c.id} className={`p-4 font-semibold text-[#101624] dark:text-slate-200 ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.specs.torqueNM} Nm
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">0 to 100 km/h Acceleration</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.specs.acceleration0to100));
                return (
                  <td key={c.id} className={`p-4 text-[#101624] dark:text-slate-200 ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.specs.acceleration0to100} seconds
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Available Transmissions</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.specs.transmission.join(',')));
                return (
                  <td key={c.id} className={`p-4 text-[#101624] dark:text-slate-200 ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.specs.transmission.join(', ')}
                  </td>
                );
              })}
            </tr>

            {/* EFFICIENCY & RUNNING COSTS */}
            <tr className="bg-[#101624]/5 dark:bg-white/5">
              <td colSpan={cars.length + 1} className="py-2.5 px-5 text-[11px] font-bold uppercase tracking-wider text-[#ff5a1f] font-['Unbounded',sans-serif]">
                3. Efficiency & Running Costs
              </td>
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">ARAI Mileage / Range</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.specs.mileageKmPerLitreOrKWh));
                return (
                  <td key={c.id} className={`p-4 font-bold text-[#ff5a1f] text-sm font-['Unbounded',sans-serif] ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.fuelTypes.includes('Electric') ? `${c.specs.rangeKm} km (EV)` : `${c.specs.mileageKmPerLitreOrKWh} km/l`}
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Est. Monthly Fuel/Power (1,200km)</td>
              {cars.map(c => {
                const tco = calculateOwnershipCost({
                  car: c,
                  selectedPriceLakh: c.priceMinLakh,
                  downPaymentPercent: 20,
                  loanTenureYears: 5,
                  interestRatePercent: 9.0,
                  monthlyDrivingKm: 1200
                });
                return (
                  <td key={c.id} className="p-4 font-bold text-[#101624] dark:text-white">
                    ₹{tco.monthlyFuelCost.toLocaleString('en-IN')}/mo
                  </td>
                );
              })}
            </tr>

            {/* SAFETY & CRASH PROTECTION */}
            <tr className="bg-[#101624]/5 dark:bg-white/5">
              <td colSpan={cars.length + 1} className="py-2.5 px-5 text-[11px] font-bold uppercase tracking-wider text-[#ff5a1f] font-['Unbounded',sans-serif]">
                4. Safety & Crash Protection
              </td>
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Crash Test Certification</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.safety.ratingStars));
                return (
                  <td key={c.id} className={`p-4 font-bold text-emerald-500 font-['Unbounded',sans-serif] ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.safety.ratingStars || 5}★ ({c.safety.testingAgency || 'BNCAP'})
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Standard Airbags</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.safety.airbagsCount));
                return (
                  <td key={c.id} className={`p-4 text-[#101624] dark:text-slate-200 font-semibold ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.safety.airbagsCount} Airbags
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Level 2 Active ADAS</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => !!x.safety.hasADAS));
                return (
                  <td key={c.id} className={`p-4 ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.safety.hasADAS ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Yes (Level {c.safety.adasLevel || 2})
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">No</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* SPACE & PRACTICALITY */}
            <tr className="bg-[#101624]/5 dark:bg-white/5">
              <td colSpan={cars.length + 1} className="py-2.5 px-5 text-[11px] font-bold uppercase tracking-wider text-[#ff5a1f] font-['Unbounded',sans-serif]">
                5. Space & Practicality
              </td>
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Seating Capacity</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.specs.seatingCapacity));
                return (
                  <td key={c.id} className={`p-4 font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.specs.seatingCapacity} Seater
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Boot Space Volume</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.specs.bootSpaceLitres));
                return (
                  <td key={c.id} className={`p-4 text-[#101624] dark:text-slate-200 font-semibold ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.specs.bootSpaceLitres} Litres
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Ground Clearance</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.specs.groundClearanceMm));
                return (
                  <td key={c.id} className={`p-4 text-[#101624] dark:text-slate-200 font-semibold ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.specs.groundClearanceMm} mm
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Sunroof Type</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => x.features.sunroof));
                return (
                  <td key={c.id} className={`p-4 text-[#101624] dark:text-slate-200 ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.features.sunroof}
                  </td>
                );
              })}
            </tr>
            <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-semibold text-[#556078] dark:text-[#9aa6c0]">Ventilated Front Seats</td>
              {cars.map(c => {
                const isDiff = checkDiff(cars.map(x => !!x.features.ventilatedSeats));
                return (
                  <td key={c.id} className={`p-4 ${isDiff ? 'bg-[#ff5a1f]/5 dark:bg-[#ff5a1f]/10' : ''}`}>
                    {c.features.ventilatedSeats ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
