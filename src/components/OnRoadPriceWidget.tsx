import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  Fuel,
  Zap
} from 'lucide-react';
import { INDIAN_STATES, calculateOnRoadPrice, OnRoadPriceBreakdown } from '../lib/onRoadPriceCalculator';

interface OnRoadPriceWidgetProps {
  initialPriceLakh?: number;
  initialFuelType?: string;
  carName?: string;
  className?: string;
}

export const OnRoadPriceWidget: React.FC<OnRoadPriceWidgetProps> = ({
  initialPriceLakh = 12.0,
  initialFuelType = 'Petrol',
  carName,
  className = ''
}) => {
  const [priceLakh, setPriceLakh] = useState<number>(initialPriceLakh);
  const [selectedStateCode, setSelectedStateCode] = useState<string>('DL');
  const [selectedFuel, setSelectedFuel] = useState<string>(initialFuelType);
  const [includeAccessories, setIncludeAccessories] = useState<boolean>(false);

  const breakdown: OnRoadPriceBreakdown = useMemo(() => {
    return calculateOnRoadPrice({
      exShowroomLakh: priceLakh,
      stateCode: selectedStateCode,
      fuelType: selectedFuel,
      includeAccessories
    });
  }, [priceLakh, selectedStateCode, selectedFuel, includeAccessories]);

  // Comparison across other major states for the same car
  const stateComparisons = useMemo(() => {
    const statesToCompare = ['DL', 'MH', 'KA', 'UP', 'GJ'];
    return statesToCompare.map((code) =>
      calculateOnRoadPrice({
        exShowroomLakh: priceLakh,
        stateCode: code,
        fuelType: selectedFuel,
        includeAccessories
      })
    );
  }, [priceLakh, selectedFuel, includeAccessories]);

  const formatRupees = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className={`p-5 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 text-[#ff5a1f] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] flex items-center gap-2">
              <span>State-Wise On-Road Price Estimator</span>
              {carName && <span className="text-xs font-normal text-slate-500 font-sans">for {carName}</span>}
            </h3>
            <p className="text-xs text-[#556078] dark:text-[#9aa6c0]">
              Accurate state RTO registration taxes, FASTag, insurance & TCS calculations
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 text-[#ff5a1f] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>2025-2026 RTO Slabs</span>
        </div>
      </div>

      {/* Main Grid: Controls Left, Price Breakdown Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Left Column: State, Fuel & Price Selectors */}
        <div className="space-y-4">
          {/* State Selector */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
            <label className="text-xs font-semibold text-[#556078] dark:text-[#9aa6c0] mb-1.5 block">
              Registration State / RTO Jurisdiction:
            </label>
            <select
              value={selectedStateCode}
              onChange={(e) => setSelectedStateCode(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-[#101624]/15 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#101624] dark:text-white font-semibold focus:outline-none focus:border-[#ff5a1f] cursor-pointer"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Category Selector */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
            <label className="text-xs font-semibold text-[#556078] dark:text-[#9aa6c0] mb-2 block">
              Powertrain / Fuel Type:
            </label>
            <div className="flex flex-wrap gap-2">
              {['Petrol', 'Diesel', 'Electric', 'Strong Hybrid', 'CNG'].map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setSelectedFuel(fuel)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedFuel === fuel
                      ? 'border-[#ff5a1f] bg-[#ff5a1f]/15 text-[#ff5a1f]'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {fuel === 'Electric' && <Zap className="w-3 h-3 inline mr-1 text-[#ff5a1f]" />}
                  <span>{fuel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ex-Showroom Slider */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#556078] dark:text-[#9aa6c0]">Ex-Showroom Price</span>
              <span className="text-[#101624] dark:text-white font-bold font-['Unbounded',sans-serif] text-sm">
                {formatRupees(breakdown.exShowroomRupees)} <small className="font-sans font-normal text-xs text-slate-500">({priceLakh.toFixed(2)}L)</small>
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="60"
              step="0.25"
              value={priceLakh}
              onChange={(e) => setPriceLakh(parseFloat(e.target.value))}
              className="w-full accent-[#ff5a1f] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
              <span>₹3L</span>
              <span>₹15L</span>
              <span>₹30L</span>
              <span>₹60L</span>
            </div>
          </div>

          {/* Accessories Checkbox */}
          <label className="flex items-center gap-2 text-xs text-[#556078] dark:text-[#9aa6c0] cursor-pointer select-none px-1">
            <input
              type="checkbox"
              checked={includeAccessories}
              onChange={(e) => setIncludeAccessories(e.target.checked)}
              className="rounded accent-[#ff5a1f]"
            />
            <span>Include basic dealer essential kit & accessory pack (~₹15,000)</span>
          </label>
        </div>

        {/* Right Column: Price Breakdown Card */}
        <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#e8edf4]/80 dark:bg-slate-800/80 border border-[#101624]/10 dark:border-white/10">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#556078] dark:text-[#9aa6c0] uppercase tracking-wider">
                Total On-Road Price ({breakdown.stateCode})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[10px] font-bold text-[#101624] dark:text-white">
                {breakdown.fuelCategory}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-[#ff5a1f] font-['Unbounded',sans-serif] tracking-tight mt-1 mb-5">
              {formatRupees(breakdown.totalOnRoadRupees)}
              <span className="text-xs font-normal text-slate-500 font-sans tracking-normal ml-2">
                (~{breakdown.totalOnRoadLakh} Lakhs)
              </span>
            </div>

            {/* Itemized Cost Breakdown */}
            <div className="space-y-3 text-xs pb-5 border-b border-[#101624]/10 dark:border-white/10">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>1. Ex-Showroom:</span>
                <span className="font-bold text-[#101624] dark:text-white">{formatRupees(breakdown.exShowroomRupees)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>2. State RTO Tax ({breakdown.rtoRatePercent}%):</span>
                  {breakdown.rtoRatePercent === 0 && (
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-600 text-[9px] font-bold rounded">
                      WAIVED
                    </span>
                  )}
                </span>
                <span className={`font-bold ${breakdown.rtoAmountRupees === 0 ? 'text-emerald-500' : 'text-[#ff5a1f]'}`}>
                  {breakdown.rtoAmountRupees === 0 ? '₹0 (0% Tax)' : formatRupees(breakdown.rtoAmountRupees)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>3. Insurance (1-Yr OD + 3-Yr TP + GST):</span>
                <span className="font-bold text-[#101624] dark:text-white">{formatRupees(breakdown.insuranceAmountRupees)}</span>
              </div>

              {breakdown.tcsAmountRupees > 0 && (
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <span>4. TCS (1% on &gt;₹10L):</span>
                  </span>
                  <span className="font-bold text-amber-600">{formatRupees(breakdown.tcsAmountRupees)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>5. RTO Reg, Smart Card & FASTag:</span>
                <span className="font-bold text-[#101624] dark:text-white">{formatRupees(breakdown.fastagAndRegFees)}</span>
              </div>
            </div>
          </div>

          {/* State Specific Savings or Exemption Badge */}
          {breakdown.savingsNote && (
            <div className="mt-5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#101624]/10 dark:border-white/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {breakdown.savingsNote}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* State Comparison Strip */}
      <div className="mt-8 pt-5 border-t border-[#101624]/10 dark:border-white/10">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#101624] dark:text-white">
          <span>Compare On-Road Price in Other Major States:</span>
          <span className="text-[11px] font-normal text-slate-500">Same Ex-Showroom & Powertrain</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {stateComparisons.map((item) => {
            const isCurrent = item.stateCode === selectedStateCode;
            return (
              <button
                key={item.stateCode}
                onClick={() => setSelectedStateCode(item.stateCode)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  <span>{item.stateName.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400">{item.rtoRatePercent}% RTO</span>
                </div>
                <div className="text-xs font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif]">
                  ₹{item.totalOnRoadLakh}L
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
