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
  MessageSquare
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

  const availableCarsToAdd = allCars.filter(c => !cars.some(selected => selected.id === c.id));

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
        verdict: `Comparing ${cars.map(c => c.model).join(' vs ')} highlights key trade-offs between operating costs, high-speed stability, and overall interior room.`,
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

  if (cars.length === 0) {
    return (
      <div className="py-16 max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
          <ArrowLeftRight className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Manrope'] mb-2">No Vehicles in Comparison</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Select 2 to 4 cars from the Explore page or AI Finder to compare specifications, crash ratings, and running costs side-by-side.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {allCars.slice(0, 3).map((car) => (
            <button
              key={car.id}
              onClick={() => onAddCar(car)}
              className="px-4 py-2 bg-white hover:bg-emerald-500 hover:text-black border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-all"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] flex items-center gap-2.5 tracking-tight">
            <ArrowLeftRight className="w-6 h-6 text-[#ff5a1f]" />
            Side-by-Side Comparison
          </h2>
          <p className="text-xs text-[#556078] dark:text-[#9aa6c0]">
            Evaluating {cars.length} cars with detailed spec matrix & AI jury verdict.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Highlight Differences Toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none bg-white/70 dark:bg-slate-800/70 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#101624]/10 dark:border-white/10 shadow-sm">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded accent-[#ff5a1f]"
            />
            <span className="font-semibold text-xs">Highlight Differences</span>
          </label>

          {/* Add Car Dropdown */}
          {cars.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setShowAddDropdown(!showAddDropdown)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-[#101624]/10 dark:border-white/10 text-[#101624] dark:text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm"
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
              onClick={() => onAskAi(`Help me choose between ${cars.map(c => c.model).join(' and ')} based on my family needs`)}
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

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          {/* Header Row with Car Thumbnails */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 w-48 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                Specifications Matrix
              </th>
              {cars.map((car) => (
                <th key={car.id} className="p-4 w-64 align-top">
                  <div className="space-y-2">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <CarImage 
                        src={car.image} 
                        alt={`${car.brand} ${car.model}`}
                        brand={car.brand}
                        model={car.model}
                        bodyType={car.bodyType}
                        isEV={car.fuelTypes.includes('Electric')}
                      />
                      <button
                        onClick={() => onRemoveCar(car.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-500 text-white transition-colors cursor-pointer z-10"
                        title="Remove car"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">{car.brand}</div>
                      <div className="text-base font-bold text-slate-900 font-['Manrope']">{car.model}</div>
                      <div className="text-xs font-extrabold text-emerald-600 mt-0.5">
                        ₹{car.priceMinLakh}L – ₹{car.priceMaxLakh}L
                      </div>
                    </div>

                    <button
                      onClick={() => onViewCarDetails(car)}
                      className="w-full py-1.5 bg-[#F8FAFC] hover:bg-emerald-500 hover:text-black text-slate-800 text-[11px] font-bold rounded-lg transition-all text-center cursor-pointer"
                    >
                      Full Details
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {/* PRICING */}
            <tr className="bg-white/60">
              <td colSpan={cars.length + 1} className="p-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                1. Pricing & Segment
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Price Range (Ex-Showroom)</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 font-bold text-slate-900">₹{c.priceMinLakh} Lakh – ₹{c.priceMaxLakh} Lakh</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Body Category</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 text-slate-800">{c.bodyType}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Fuel Choices</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 font-semibold text-cyan-600">{c.fuelTypes.join(', ')}</td>
              ))}
            </tr>

            {/* PERFORMANCE & ENGINE */}
            <tr className="bg-white/60">
              <td colSpan={cars.length + 1} className="p-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                2. Engine & Performance
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Power Output (PS)</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 font-bold text-slate-900 text-sm">{c.specs.powerPS} PS</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Peak Torque (Nm)</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 font-semibold text-slate-800">{c.specs.torqueNM} Nm</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">0 to 100 km/h Acceleration</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 text-slate-800">{c.specs.acceleration0to100} seconds</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Available Transmissions</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 text-slate-800">{c.specs.transmission.join(', ')}</td>
              ))}
            </tr>

            {/* EFFICIENCY & RUNNING COST */}
            <tr className="bg-white/60">
              <td colSpan={cars.length + 1} className="p-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                3. Efficiency & Running Costs
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">ARAI Mileage / Range</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 font-bold text-emerald-600 text-sm">
                  {c.fuelTypes.includes('Electric') ? `${c.specs.rangeKm} km (Electric)` : `${c.specs.mileageKmPerLitreOrKWh} km/l`}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Est. Monthly Fuel/Energy (1200km)</td>
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
                  <td key={c.id} className="p-4 font-bold text-slate-900">
                    ₹{tco.monthlyFuelCost.toLocaleString('en-IN')}/mo
                  </td>
                );
              })}
            </tr>

            {/* SAFETY & ADAS */}
            <tr className="bg-white/60">
              <td colSpan={cars.length + 1} className="p-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                4. Safety & Crash Protection
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Crash Test Certification</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 font-bold text-emerald-600">
                  {c.safety.ratingStars} / 5 ★ ({c.safety.testingAgency})
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Standard Airbags</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 text-slate-800">{c.safety.airbagsCount} Airbags</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Level 2 Active ADAS</td>
              {cars.map(c => (
                <td key={c.id} className="p-4">
                  {c.safety.hasADAS ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold">Yes (Level {c.safety.adasLevel || 2})</span>
                  ) : (
                    <span className="text-slate-500">No</span>
                  )}
                </td>
              ))}
            </tr>

            {/* SPACE & PRACTICALITY */}
            <tr className="bg-white/60">
              <td colSpan={cars.length + 1} className="p-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                5. Space & Practicality
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Seating Capacity</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 font-bold text-slate-900">{c.specs.seatingCapacity} Seater</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Boot Space Volume</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 text-slate-800">{c.specs.bootSpaceLitres} Litres</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Ground Clearance</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 text-slate-800">{c.specs.groundClearanceMm} mm</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Sunroof Type</td>
              {cars.map(c => (
                <td key={c.id} className="p-4 text-slate-800">{c.features.sunroof}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-500">Ventilated Front Seats</td>
              {cars.map(c => (
                <td key={c.id} className="p-4">
                  {c.features.ventilatedSeats ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> No</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
