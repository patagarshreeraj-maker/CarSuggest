import React, { useState, useMemo } from 'react';
import {
  Zap,
  Fuel,
  Sparkles,
  CheckCircle2,
  Sliders
} from 'lucide-react';

interface EvBreakEvenSimulatorProps {
  className?: string;
  initialEvPriceLakh?: number;
  initialIcePriceLakh?: number;
  evName?: string;
  iceName?: string;
}

export const EvBreakEvenSimulator: React.FC<EvBreakEvenSimulatorProps> = ({
  className = '',
  initialEvPriceLakh = 14.5,
  initialIcePriceLakh = 11.5,
  evName = 'Electric Vehicle (EV)',
  iceName = 'Petrol / Diesel Car'
}) => {
  // Inputs
  const [evPriceLakh, setEvPriceLakh] = useState<number>(initialEvPriceLakh);
  const [icePriceLakh, setIcePriceLakh] = useState<number>(initialIcePriceLakh);
  const [monthlyKm, setMonthlyKm] = useState<number>(1400); // 1,400 km/mo avg
  const [petrolPrice, setPetrolPrice] = useState<number>(96); // ₹96 / L
  const [electricityCostKwh, setElectricityCostKwh] = useState<number>(8.5); // ₹8.5 / kWh
  const [iceMileageKmpl, setIceMileageKmpl] = useState<number>(14.0); // 14 km/l real world
  const [evEfficiencyKwhPer100Km, setEvEfficiencyKwhPer100Km] = useState<number>(14.0); // 14 kWh/100km (~7.1 km/kWh)

  // Math Calculations
  const {
    pricePremiumRupees,
    petrolCostPerKm,
    evCostPerKm,
    savingsPerKm,
    monthlyPetrolCost,
    monthlyEvCost,
    monthlySavings,
    annualSavings,
    breakEvenKm,
    breakEvenMonths,
    breakEvenYears,
    fiveYearNetSavings
  } = useMemo(() => {
    const evRupees = evPriceLakh * 100000;
    const iceRupees = icePriceLakh * 100000;
    const premium = Math.max(0, evRupees - iceRupees);

    // Running costs per KM
    const pCostKm = petrolPrice / iceMileageKmpl;
    const evKmPerKwh = 100 / evEfficiencyKwhPer100Km;
    const eCostKm = electricityCostKwh / evKmPerKwh;
    const savingKm = Math.max(0.1, pCostKm - eCostKm);

    // Monthly & Annual Savings
    const mPetrol = monthlyKm * pCostKm;
    const mEv = monthlyKm * eCostKm;
    const mSaving = mPetrol - mEv;
    const aSaving = mSaving * 12;

    // Break-even
    const beKm = savingKm > 0 ? Math.round(premium / savingKm) : 0;
    const beMonths = mSaving > 0 ? Math.round(premium / mSaving) : 0;
    const beYears = parseFloat((beMonths / 12).toFixed(1));

    // 5-Year Net Financial Benefit (5-yr savings minus EV premium)
    const fiveYearSavings = aSaving * 5;
    const net5Yr = fiveYearSavings - premium;

    return {
      pricePremiumRupees: premium,
      petrolCostPerKm: parseFloat(pCostKm.toFixed(2)),
      evCostPerKm: parseFloat(eCostKm.toFixed(2)),
      savingsPerKm: parseFloat(savingKm.toFixed(2)),
      monthlyPetrolCost: Math.round(mPetrol),
      monthlyEvCost: Math.round(mEv),
      monthlySavings: Math.round(mSaving),
      annualSavings: Math.round(aSaving),
      breakEvenKm: beKm,
      breakEvenMonths: beMonths,
      breakEvenYears: beYears,
      fiveYearNetSavings: Math.round(net5Yr)
    };
  }, [
    evPriceLakh,
    icePriceLakh,
    monthlyKm,
    petrolPrice,
    electricityCostKwh,
    iceMileageKmpl,
    evEfficiencyKwhPer100Km
  ]);

  const formatRupees = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className={`p-5 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 text-[#ff5a1f] flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] flex items-center gap-2">
              <span>EV vs Petrol Break-Even Simulator</span>
            </h3>
            <p className="text-xs text-[#556078] dark:text-[#9aa6c0]">
              Discover exactly when the extra price tag of an EV pays for itself through fuel savings
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 text-[#ff5a1f] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World Math</span>
        </div>
      </div>

      {/* Main Grid: Controls Left, Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Left Column: Sliders */}
        <div className="space-y-4">
          {/* Monthly Driving Distance */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#556078] dark:text-[#9aa6c0]">Monthly Driving Distance</span>
              <span className="text-[#101624] dark:text-white font-bold font-['Unbounded',sans-serif] text-sm">
                {monthlyKm.toLocaleString('en-IN')} km/mo <small className="font-sans font-normal text-xs text-slate-500">({Math.round(monthlyKm / 30)} km/day)</small>
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="4000"
              step="100"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff5a1f] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
              <span>500 km</span>
              <span>1,500 km</span>
              <span>2,500 km</span>
              <span>4,000 km</span>
            </div>
          </div>

          {/* EV Price vs Petrol Car Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
              <div className="text-[11px] font-semibold text-[#556078] dark:text-[#9aa6c0] mb-1">
                {evName} Price
              </div>
              <div className="text-base font-bold text-[#ff5a1f] font-['Unbounded',sans-serif] mb-2">
                ₹{evPriceLakh.toFixed(2)}L
              </div>
              <input
                type="range"
                min="7"
                max="35"
                step="0.5"
                value={evPriceLakh}
                onChange={(e) => setEvPriceLakh(parseFloat(e.target.value))}
                className="w-full accent-[#ff5a1f] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
              <div className="text-[11px] font-semibold text-[#556078] dark:text-[#9aa6c0] mb-1">
                {iceName} Price
              </div>
              <div className="text-base font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] mb-2">
                ₹{icePriceLakh.toFixed(2)}L
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="0.5"
                value={icePriceLakh}
                onChange={(e) => setIcePriceLakh(parseFloat(e.target.value))}
                className="w-full accent-slate-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Running Cost Variables */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5 space-y-3 text-xs">
            <div className="font-bold text-[#101624] dark:text-white">Fuel & Electricity Presets:</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">Petrol Price (₹/L):</label>
                <input
                  type="number"
                  value={petrolPrice}
                  onChange={(e) => setPetrolPrice(parseFloat(e.target.value) || 96)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Power Tariff (₹/kWh):</label>
                <input
                  type="number"
                  value={electricityCostKwh}
                  onChange={(e) => setElectricityCostKwh(parseFloat(e.target.value) || 8.5)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Break-Even Highlight Verdict */}
        <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#e8edf4]/80 dark:bg-slate-800/80 border border-[#101624]/10 dark:border-white/10">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span>Time to Break-Even</span>
              <span className="text-[#ff5a1f]">{monthlyKm} km/month</span>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-[#ff5a1f] font-['Unbounded',sans-serif] tracking-tight mb-2">
              {breakEvenYears} <span className="text-xl sm:text-2xl font-normal text-slate-500 font-sans">Years</span>
            </div>

            <p className="text-xs text-[#556078] dark:text-[#9aa6c0] font-medium mb-5">
              At {monthlyKm} km/mo, you will recover the {formatRupees(pricePremiumRupees)} EV premium after driving <b>{breakEvenKm.toLocaleString('en-IN')} km</b> ({breakEvenMonths} months).
            </p>

            {/* Side-by-side Cost / KM */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#101624]/10 dark:border-white/10 text-center mb-5">
              <div>
                <div className="text-[10px] text-slate-400 font-medium">EV Running Cost</div>
                <div className="text-lg font-bold text-emerald-500 font-['Unbounded',sans-serif]">
                  ₹{evCostPerKm} <small className="text-[10px] font-sans font-normal text-slate-500">/ km</small>
                </div>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Petrol Running Cost</div>
                <div className="text-lg font-bold text-rose-500 font-['Unbounded',sans-serif]">
                  ₹{petrolCostPerKm} <small className="text-[10px] font-sans font-normal text-slate-500">/ km</small>
                </div>
              </div>
            </div>

            {/* Savings Metrics List */}
            <div className="space-y-2 text-xs pb-4 border-b border-[#101624]/10 dark:border-white/10">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Monthly Fuel Bill Savings:</span>
                <span className="font-bold text-emerald-500 font-['Unbounded',sans-serif]">{formatRupees(monthlySavings)} / mo</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Annual Fuel Savings:</span>
                <span className="font-bold text-emerald-500 font-['Unbounded',sans-serif]">{formatRupees(annualSavings)} / yr</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Initial EV Price Premium:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupees(pricePremiumRupees)}</span>
              </div>
            </div>
          </div>

          {/* 5-Year Pocket Impact */}
          <div className="mt-5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#101624]/10 dark:border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-[#101624] dark:text-white mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>5-Year Net Pocket Impact:</span>
            </div>
            <div className="text-xl font-bold text-emerald-500 font-['Unbounded',sans-serif]">
              {fiveYearNetSavings >= 0 ? `+${formatRupees(fiveYearNetSavings)} Saved` : `-${formatRupees(Math.abs(fiveYearNetSavings))}`}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {fiveYearNetSavings >= 0
                ? 'Your high monthly mileage makes an EV a clear financial winner.'
                : 'For lower monthly running, a petrol or hybrid car may be more cost-effective.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
