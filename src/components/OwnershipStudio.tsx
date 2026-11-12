import React, { useState } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  TrendingDown, 
  Zap, 
  Fuel, 
  ShieldCheck, 
  Wrench, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Car, OwnershipCalculation } from '../types';
import { calculateOwnershipCost, compareOwnershipCosts } from '../lib/ownershipCalculator';

interface OwnershipStudioProps {
  initialCar: Car;
  allCars: Car[];
  onAskAi: (prompt: string) => void;
}

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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Manrope'] flex items-center gap-2.5">
          <Calculator className="w-7 h-7 text-emerald-600" />
          5-Year Total Cost of Ownership (TCO) Studio
        </h2>
        <p className="text-xs text-slate-500">
          True car costs go beyond showroom price. Calculate loan interest, RTO road taxes, insurance, fuel/EV electricity, and resale value recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Parameters & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Configure Vehicle & Loan
            </h3>

            {/* Vehicle Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Select Vehicle:</label>
              <select
                value={selectedCarId}
                onChange={(e) => {
                  setSelectedCarId(e.target.value);
                  setSelectedVariantIndex(0);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500/50"
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
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Select Variant / Trim:</label>
              <select
                value={selectedVariantIndex}
                onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500/50"
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
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Down Payment ({downPaymentPercent}%):</span>
                <span className="font-bold text-emerald-600 font-['Manrope']">
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
                className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Loan Tenure Chips */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Loan Tenure (Years):</label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 7].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setLoanTenureYears(yr)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      loanTenureYears === yr
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
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
                <label className="text-[11px] text-slate-500">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRatePercent}
                  onChange={(e) => setInterestRatePercent(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500">Monthly Usage (km)</label>
                <input
                  type="number"
                  step="100"
                  value={monthlyDrivingKm}
                  onChange={(e) => setMonthlyDrivingKm(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Energy Cost Parameters */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="text-[11px] font-semibold text-slate-600">Fuel & Energy Unit Cost</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500">Petrol / Diesel (₹/L)</span>
                  <input
                    type="number"
                    value={fuelPricePerLitre}
                    onChange={(e) => setFuelPricePerLitre(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1 text-slate-900 text-xs mt-1"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">EV Power (₹/kWh)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={electricityCostPerKWh}
                    onChange={(e) => setElectricityCostPerKWh(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1 text-slate-900 text-xs mt-1"
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
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141B26] to-[#10141C] border border-emerald-500/30 space-y-1">
              <div className="text-[11px] font-bold uppercase text-emerald-600">Monthly EMI Outflow</div>
              <div className="text-2xl font-extrabold text-slate-900 font-['Manrope']">
                ₹{primaryTco.monthlyEMI.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500">for {loanTenureYears * 12} months @ {interestRatePercent}%</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141B26] to-[#10141C] border border-cyan-500/30 space-y-1">
              <div className="text-[11px] font-bold uppercase text-cyan-600">Monthly Fuel / Power</div>
              <div className="text-2xl font-extrabold text-slate-900 font-['Manrope']">
                ₹{primaryTco.monthlyFuelCost.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500">for {monthlyDrivingKm} km/mo usage</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141B26] to-[#10141C] border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase text-slate-600">5-Yr Net True Cost</div>
              <div className="text-2xl font-extrabold text-emerald-600 font-['Manrope']">
                ₹{(primaryTco.netCostOfOwnership / 100000).toFixed(2)} Lakhs
              </div>
              <div className="text-[10px] text-slate-500">After ~₹{(primaryTco.estimatedResaleValue / 100000).toFixed(2)}L resale</div>
            </div>
          </div>

          {/* Detailed 5-Year Ledger Table */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 font-['Manrope']">
              5-Year Comprehensive Cost Breakdown Ledger
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Vehicle Ex-Showroom + On-Road (RTO Road Tax & Reg.)
                </span>
                <span className="font-bold text-slate-900 font-['Manrope']">
                  ₹{primaryTco.onRoadPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  5-Year Fuel / Electricity Energy Outlay ({monthlyDrivingKm * 12 * 5} km)
                </span>
                <span className="font-bold text-slate-900 font-['Manrope']">
                  ₹{primaryTco.fiveYearFuelCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  5-Year Comprehensive Insurance Policies
                </span>
                <span className="font-bold text-slate-900 font-['Manrope']">
                  ₹{primaryTco.fiveYearInsuranceCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  5-Year Scheduled Service & Maintenance
                </span>
                <span className="font-bold text-slate-900 font-['Manrope']">
                  ₹{primaryTco.fiveYearMaintenanceCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Total Bank Loan Interest Paid ({interestRatePercent}%)
                </span>
                <span className="font-bold text-slate-900 font-['Manrope']">
                  ₹{primaryTco.totalInterestPaid.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-200 bg-white p-2 rounded-xl">
                <span className="font-bold text-slate-800">Total Cash Outflow Over 5 Years</span>
                <span className="font-extrabold text-slate-900 font-['Manrope'] text-sm">
                  ₹{primaryTco.total5YearCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 text-emerald-600">
                <span className="font-semibold">(-) Estimated Year 5 Resale Value Recovery</span>
                <span className="font-bold font-['Manrope']">
                  - ₹{primaryTco.estimatedResaleValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* EV vs Petrol / Alternate Comparison (Section 15 in PRD) */}
          {comparison && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-[#10151E] to-[#121824] border border-emerald-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  5-Year TCO Differential Analysis vs Alternate
                </div>
                <select
                  value={compareCarId}
                  onChange={(e) => setCompareCarId(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                >
                  {allCars.filter(c => c.id !== selectedCar.id).map((c) => (
                    <option key={c.id} value={c.id}>
                      vs {c.brand} {c.model} ({c.fuelTypes[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                <div className="text-xs text-slate-600">
                  {comparison.fuelSavings > 0 ? (
                    <span>
                      Driving the <strong className="text-emerald-600">{selectedCar.model}</strong> saves you approx{' '}
                      <strong className="text-emerald-600 font-['Manrope']">
                        ₹{comparison.fuelSavings.toLocaleString('en-IN')}
                      </strong>{' '}
                      in energy/fuel costs alone over 5 years ({monthlyDrivingKm * 60} total km).
                    </span>
                  ) : (
                    <span>
                      The alternate <strong className="text-cyan-600">{compareCar?.model}</strong> yields approx{' '}
                      <strong className="text-cyan-600 font-['Manrope']">
                        ₹{Math.abs(comparison.fuelSavings).toLocaleString('en-IN')}
                      </strong>{' '}
                      fuel savings due to higher efficiency powertrain.
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 pt-1">
                  Net 5-Year Cost Delta (including loan, maintenance & resale):{' '}
                  <span className="font-bold text-slate-900 font-['Manrope']">
                    ₹{Math.abs(comparison.netCostDifference).toLocaleString('en-IN')} {comparison.netCostDifference < 0 ? 'Cheaper Overall' : 'More Expensive Overall'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
