import React, { useState } from 'react';
import { Calculator, Zap, Sparkles } from 'lucide-react';
import { Car, OwnershipCalculation } from '../types';
import { calculateOwnershipCost, compareOwnershipCosts } from '../lib/ownershipCalculator';

interface OwnershipStudioProps {
  initialCar: Car;
  allCars: Car[];
  onAskAi: (prompt: string) => void;
}

const LABEL = 'text-xs font-semibold text-[#556078] dark:text-[#9aa6c0]';
const MUTED = 'text-[#556078] dark:text-[#9aa6c0]';

export const OwnershipStudio: React.FC<OwnershipStudioProps> = ({
  initialCar,
  allCars,
  onAskAi
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>(initialCar.id);
  const [compareCarId, setCompareCarId] = useState<string>(
    initialCar.fuelTypes.includes('Electric') 
      ? (allCars.find(c => !c.fuelTypes.includes('Electric'))?.id || allCars[0].id)
      : (allCars.find(c => c.fuelTypes.includes('Electric'))?.id || allCars[1].id)
  );
  
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(5);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(9.0);
  const [monthlyDrivingKm, setMonthlyDrivingKm] = useState<number>(1200);
  const [fuelPricePerLitre, setFuelPricePerLitre] = useState<number>(96);
  const [electricityCostPerKWh, setElectricityCostPerKWh] = useState<number>(8.5);

  const selectedCar = allCars.find(c => c.id === selectedCarId) || initialCar;
  const compareCar = allCars.find(c => c.id === compareCarId);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const currentVariant = selectedCar.variants[selectedVariantIndex] || selectedCar.variants[0];

  const primaryTco: OwnershipCalculation = calculateOwnershipCost({
    car: selectedCar,
    selectedPriceLakh: currentVariant?.priceLakh || selectedCar.priceMinLakh,
    downPaymentPercent,
    loanTenureYears,
    interestRatePercent,
    monthlyDrivingKm,
    fuelPricePerLitre,
    electricityCostPerKWh
  });

  const comparison = compareCar ? compareOwnershipCosts(
    {
      car: selectedCar,
      selectedPriceLakh: currentVariant?.priceLakh || selectedCar.priceMinLakh,
      downPaymentPercent,
      loanTenureYears,
      interestRatePercent,
      monthlyDrivingKm,
      fuelPricePerLitre,
      electricityCostPerKWh
    },
    {
      car: compareCar,
      selectedPriceLakh: compareCar.priceMinLakh,
      downPaymentPercent,
      loanTenureYears,
      interestRatePercent,
      monthlyDrivingKm,
      fuelPricePerLitre,
      electricityCostPerKWh
    }
  ) : null;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] flex items-center gap-2.5 tracking-tight">
          <Calculator className="w-7 h-7 text-[#ff5a1f]" />
          5-Year Ownership Studio (TCO)
        </h2>
        <p className={`text-xs mt-1 ${MUTED}`}>
          True car costs go beyond showroom price. Calculate loan interest, RTO road taxes, insurance, fuel/EV electricity, and resale value recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Parameters & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-md space-y-5">
            <h3 className="text-sm font-bold text-[#101624] dark:text-white uppercase tracking-wider flex items-center gap-2 font-['Unbounded',sans-serif]">
              <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
              Configure Vehicle &amp; Loan
            </h3>

            {/* Vehicle Selection */}
            <div>
              <label className={`${LABEL} mb-1.5 block`}>Select Vehicle:</label>
              <select
                value={selectedCarId}
                onChange={(e) => {
                  setSelectedCarId(e.target.value);
                  setSelectedVariantIndex(0);
                }}
                className="w-full bg-white dark:bg-[#0f1728] border border-[#101624]/12 dark:border-white/12 rounded-xl px-3 py-2.5 text-xs text-[#101624] dark:text-white focus:outline-none focus:border-[#ff5a1f] transition-colors cursor-pointer"
              >
                {allCars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.brand} {c.model} (₹{c.priceMinLakh}L – ₹{c.priceMaxLakh}L)
                  </option>
                ))}
              </select>
            </div>

            {/* Variant Selection */}
            <div>
              <label className={`${LABEL} mb-1.5 block`}>Select Variant / Trim:</label>
              <select
                value={selectedVariantIndex}
                onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#0f1728] border border-[#101624]/12 dark:border-white/12 rounded-xl px-3 py-2.5 text-xs text-[#101624] dark:text-white focus:outline-none focus:border-[#ff5a1f] transition-colors cursor-pointer"
              >
                {selectedCar.variants.map((v, i) => (
                  <option key={i} value={i}>
                    {v.name} ({v.fuel} {v.transmission}) — ₹{v.priceLakh.toFixed(2)} Lakhs
                  </option>
                ))}
              </select>
            </div>

            {/* Down Payment % Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs">
                <span className={`${MUTED} font-medium`}>Down Payment ({downPaymentPercent}%):</span>
                <span className="font-bold text-[#ff5a1f] font-['Unbounded',sans-serif]">
                  ₹{primaryTco.downPaymentAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#ff5a1f] bg-[#101624]/12 dark:bg-white/12 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Loan Tenure Chips */}
            <div>
              <label className={`${LABEL} mb-1.5 block`}>Loan Tenure (Years):</label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 7].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setLoanTenureYears(yr)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      loanTenureYears === yr
                        ? 'bg-[#ff5a1f] text-white shadow-lg shadow-[#ff5a1f]/25'
                        : 'bg-white dark:bg-white/[0.06] text-[#556078] dark:text-[#9aa6c0] border border-[#101624]/12 dark:border-white/10 hover:border-[#ff5a1f]/40 hover:text-[#ff5a1f]'
                    }`}
                  >
                    {yr} Yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate & Monthly Km */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-[#556078] dark:text-[#9aa6c0]">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRatePercent}
                  onChange={(e) => setInterestRatePercent(Number(e.target.value))}
                  className="w-full bg-white dark:bg-white/[0.06] border border-[#101624]/12 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#101624] dark:text-white focus:outline-none focus:border-[#ff5a1f]/60 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#556078] dark:text-[#9aa6c0]">Monthly Usage (km)</label>
                <input
                  type="number"
                  step="100"
                  value={monthlyDrivingKm}
                  onChange={(e) => setMonthlyDrivingKm(Number(e.target.value))}
                  className="w-full bg-white dark:bg-white/[0.06] border border-[#101624]/12 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#101624] dark:text-white focus:outline-none focus:border-[#ff5a1f]/60 transition-colors"
                />
              </div>
            </div>

            {/* Energy Cost Parameters */}
            <div className="p-3 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.04] border border-[#101624]/10 dark:border-white/10 space-y-2">
              <div className="text-[11px] font-semibold text-[#101624] dark:text-[#eef2fb] uppercase tracking-wider">Fuel &amp; Energy Unit Cost</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#556078] dark:text-[#9aa6c0]">Petrol / Diesel (₹/L)</span>
                  <input
                    type="number"
                    value={fuelPricePerLitre}
                    onChange={(e) => setFuelPricePerLitre(Number(e.target.value))}
                    className="w-full bg-white dark:bg-white/[0.06] border border-[#101624]/12 dark:border-white/10 rounded-lg px-2.5 py-1 text-[#101624] dark:text-white text-xs mt-1 focus:outline-none focus:border-[#ff5a1f]/60 transition-colors"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#556078] dark:text-[#9aa6c0]">EV Power (₹/kWh)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={electricityCostPerKWh}
                    onChange={(e) => setElectricityCostPerKWh(Number(e.target.value))}
                    className="w-full bg-white dark:bg-white/[0.06] border border-[#101624]/12 dark:border-white/10 rounded-lg px-2.5 py-1 text-[#101624] dark:text-white text-xs mt-1 focus:outline-none focus:border-[#ff5a1f]/60 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Analysis & Visual TCO Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key KPI Hero Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-sm space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ff5a1f] font-['Unbounded',sans-serif]">
                Monthly EMI Outflow
              </div>
              <div className="text-2xl font-extrabold text-[#101624] dark:text-white font-['Unbounded',sans-serif] tracking-tight">
                ₹{primaryTco.monthlyEMI.toLocaleString('en-IN')}
              </div>
              <div className={`text-[10px] ${MUTED}`}>
                for {loanTenureYears * 12} months @ {interestRatePercent}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-sm space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ff5a1f] font-['Unbounded',sans-serif]">
                Monthly Fuel / Power
              </div>
              <div className="text-2xl font-extrabold text-[#101624] dark:text-white font-['Unbounded',sans-serif] tracking-tight">
                ₹{primaryTco.monthlyFuelCost.toLocaleString('en-IN')}
              </div>
              <div className={`text-[10px] ${MUTED}`}>
                for {monthlyDrivingKm} km/mo usage
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl border border-[#ff5a1f]/30 shadow-sm space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ff5a1f] font-['Unbounded',sans-serif]">
                5-Yr Net True Cost
              </div>
              <div className="text-2xl font-extrabold text-[#ff5a1f] font-['Unbounded',sans-serif] tracking-tight">
                ₹{(primaryTco.netCostOfOwnership / 100000).toFixed(2)} Lakhs
              </div>
              <div className={`text-[10px] ${MUTED}`}>
                After ~₹{(primaryTco.estimatedResaleValue / 100000).toFixed(2)}L resale
              </div>
            </div>
          </div>

          {/* Detailed 5-Year Ledger Table */}
          <div className="p-6 rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-md space-y-4">
            <h4 className="text-sm font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif]">
              5-Year Comprehensive Cost Breakdown Ledger
            </h4>

            <div className="space-y-1 text-xs">
              <div className="flex items-baseline justify-between gap-4 py-2 border-b border-[#101624]/8 dark:border-white/10">
                <span className={`${MUTED} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
                  Vehicle Ex-Showroom + On-Road (RTO Road Tax &amp; Reg.)
                </span>
                <span className="font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] whitespace-nowrap">
                  ₹{primaryTco.onRoadPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4 py-2 border-b border-[#101624]/8 dark:border-white/10">
                <span className={`${MUTED} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  5-Year Fuel / Electricity Energy Outlay ({monthlyDrivingKm * 12 * 5} km)
                </span>
                <span className="font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] whitespace-nowrap">
                  ₹{primaryTco.fiveYearFuelCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4 py-2 border-b border-[#101624]/8 dark:border-white/10">
                <span className={`${MUTED} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  5-Year Comprehensive Insurance Policies
                </span>
                <span className="font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] whitespace-nowrap">
                  ₹{primaryTco.fiveYearInsuranceCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4 py-2 border-b border-[#101624]/8 dark:border-white/10">
                <span className={`${MUTED} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  5-Year Scheduled Service &amp; Maintenance
                </span>
                <span className="font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] whitespace-nowrap">
                  ₹{primaryTco.fiveYearMaintenanceCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4 py-2 border-b border-[#101624]/8 dark:border-white/10">
                <span className={`${MUTED} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Total Bank Loan Interest Paid ({interestRatePercent}%)
                </span>
                <span className="font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] whitespace-nowrap">
                  ₹{primaryTco.totalInterestPaid.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4 px-3 py-2.5 rounded-xl bg-[#101624]/5 dark:bg-white/[0.06]">
                <span className="font-bold text-[#101624] dark:text-white">Total Cash Outflow Over 5 Years</span>
                <span className="font-extrabold text-[#101624] dark:text-white font-['Unbounded',sans-serif] text-sm whitespace-nowrap">
                  ₹{primaryTco.total5YearCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4 px-3 py-2 text-emerald-600 dark:text-emerald-400">
                <span className="font-semibold">(-) Estimated Year 5 Resale Value Recovery</span>
                <span className="font-bold font-['Unbounded',sans-serif] whitespace-nowrap">
                  - ₹{primaryTco.estimatedResaleValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* EV vs Petrol / Alternate Comparison */}
          {comparison && (
            <div className="p-6 rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-[11px] font-bold text-[#ff5a1f] uppercase tracking-[0.14em] flex items-center gap-1.5 font-['Unbounded',sans-serif]">
                  <Zap className="w-4 h-4" />
                  5-Year TCO Differential Analysis vs Alternate
                </div>
                <select
                  value={compareCarId}
                  onChange={(e) => setCompareCarId(e.target.value)}
                  className="bg-white dark:bg-[#0f1728] border border-[#101624]/12 dark:border-white/12 rounded-lg px-2.5 py-1 text-xs text-[#101624] dark:text-white focus:outline-none focus:border-[#ff5a1f] transition-colors cursor-pointer"
                >
                  {allCars.filter(c => c.id !== selectedCar.id).map((c) => (
                    <option key={c.id} value={c.id}>
                      vs {c.brand} {c.model} ({c.fuelTypes[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.04] border border-[#101624]/10 dark:border-white/10 space-y-2">
                <div className={`text-xs ${MUTED}`}>
                  {comparison.fuelSavings > 0 ? (
                    <span>
                      Driving the <strong className="text-emerald-600 dark:text-emerald-400">{selectedCar.model}</strong> saves you approx{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400 font-['Unbounded',sans-serif]">
                        ₹{comparison.fuelSavings.toLocaleString('en-IN')}
                      </strong>{' '}
                      in energy/fuel costs alone over 5 years ({monthlyDrivingKm * 60} total km).
                    </span>
                  ) : (
                    <span>
                      The alternate <strong className="text-cyan-600 dark:text-cyan-400">{compareCar?.model}</strong> yields approx{' '}
                      <strong className="text-cyan-600 dark:text-cyan-400 font-['Unbounded',sans-serif]">
                        ₹{Math.abs(comparison.fuelSavings).toLocaleString('en-IN')}
                      </strong>{' '}
                      fuel savings due to higher efficiency powertrain.
                    </span>
                  )}
                </div>

                <div className={`text-xs pt-1 border-t border-[#101624]/8 dark:border-white/10 ${MUTED}`}>
                  <span className="block pt-1">
                    Net 5-Year Cost Delta (including loan, maintenance &amp; resale):{' '}
                  </span>
                  <span className="font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif]">
                    ₹{Math.abs(comparison.netCostDifference).toLocaleString('en-IN')} {comparison.netCostDifference < 0 ? 'Cheaper Overall' : 'More Expensive Overall'}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  onAskAi(
                    `Compare the 5-year total cost of ownership of the ${selectedCar.brand} ${selectedCar.model} versus the ${compareCar?.brand} ${compareCar?.model}, including loan interest, fuel and resale.`
                  )
                }
                className="w-full py-3 rounded-full bg-[#101624] dark:bg-[#eef2fb] text-white dark:text-[#101624] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ff5a1f]" />
                Ask CarSuggest AI about this comparison
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
