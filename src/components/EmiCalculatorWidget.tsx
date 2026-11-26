import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface EmiCalculatorWidgetProps {
  initialPriceLakh?: number;
  carName?: string;
  className?: string;
  compact?: boolean;
}

interface BankRate {
  name: string;
  rate: number;
  tag: string;
}

const POPULAR_BANKS: BankRate[] = [
  { name: 'SBI Auto Loan', rate: 8.75, tag: 'Public Best' },
  { name: 'HDFC Bank', rate: 8.90, tag: 'Instant Disbursal' },
  { name: 'ICICI Bank', rate: 9.00, tag: 'Pre-Approved' },
  { name: 'PNB Auto', rate: 8.65, tag: 'Lowest Rate' }
];

export const EmiCalculatorWidget: React.FC<EmiCalculatorWidgetProps> = ({
  initialPriceLakh = 12.0,
  carName,
  className = '',
  compact = false
}) => {
  // States
  const [vehiclePriceLakh, setVehiclePriceLakh] = useState<number>(initialPriceLakh);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // 20% default
  const [tenureYears, setTenureYears] = useState<number>(5); // 5 years default (60 months)
  const [interestRate, setInterestRate] = useState<number>(8.75); // 8.75% default
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Exact Values in Rupees
  const vehiclePriceRupees = vehiclePriceLakh * 100000;
  const downPaymentRupees = (vehiclePriceRupees * downPaymentPercent) / 100;
  const principalLoanAmount = Math.max(0, vehiclePriceRupees - downPaymentRupees);
  const tenureMonths = tenureYears * 12;

  // Monthly EMI Calculation: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
  const { monthlyEmi, totalInterest, totalPayable, principalRatio, interestRatio } = useMemo(() => {
    if (principalLoanAmount <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0, principalRatio: 100, interestRatio: 0 };
    }

    const monthlyRate = interestRate / 12 / 100;
    const compoundFactor = Math.pow(1 + monthlyRate, tenureMonths);
    const emi = Math.round((principalLoanAmount * monthlyRate * compoundFactor) / (compoundFactor - 1));
    const totalRepayment = emi * tenureMonths;
    const interest = totalRepayment - principalLoanAmount;

    const pRatio = Math.round((principalLoanAmount / totalRepayment) * 100);
    const iRatio = 100 - pRatio;

    return {
      monthlyEmi: emi,
      totalInterest: Math.max(0, interest),
      totalPayable: totalRepayment + downPaymentRupees,
      principalRatio: pRatio,
      interestRatio: iRatio
    };
  }, [principalLoanAmount, interestRate, tenureMonths, downPaymentRupees]);

  // Recommended Gross Monthly Income (10% car EMI rule)
  const recommendedMonthlySalary = monthlyEmi * 10;

  // Year-by-year Amortization Schedule
  const amortizationSchedule = useMemo(() => {
    const schedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
    let currentBalance = principalLoanAmount;
    const monthlyRate = interestRate / 12 / 100;

    for (let yr = 1; yr <= tenureYears; yr++) {
      let yrPrincipal = 0;
      let yrInterest = 0;

      for (let m = 1; m <= 12; m++) {
        if (currentBalance <= 0) break;
        const interestForMonth = currentBalance * monthlyRate;
        const principalForMonth = Math.min(currentBalance, monthlyEmi - interestForMonth);
        yrInterest += interestForMonth;
        yrPrincipal += principalForMonth;
        currentBalance = Math.max(0, currentBalance - principalForMonth);
      }

      schedule.push({
        year: yr,
        principalPaid: Math.round(yrPrincipal),
        interestPaid: Math.round(yrInterest),
        balance: Math.round(currentBalance)
      });
    }

    return schedule;
  }, [principalLoanAmount, interestRate, tenureYears, monthlyEmi]);

  // Format currency helpers
  const formatRupees = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');
  const formatLakhs = (valRupees: number) => (valRupees / 100000).toFixed(2) + 'L';

  return (
    <div className={`p-5 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 text-[#ff5a1f] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] flex items-center gap-2">
              <span>Car Loan & EMI Calculator</span>
              {carName && <span className="text-xs font-normal text-slate-500 font-sans">for {carName}</span>}
            </h3>
            <p className="text-xs text-[#556078] dark:text-[#9aa6c0]">Current Indian bank interest rates & 5-year repayment schedule</p>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 text-[#ff5a1f] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Math</span>
        </div>
      </div>

      {/* Main Grid: Controls Left, Result Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6">
        {/* Left Column: Sliders & Controls */}
        <div className="space-y-5">
          {/* 1. Vehicle Price */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#556078] dark:text-[#9aa6c0]">Ex-Showroom Price</span>
              <span className="text-[#101624] dark:text-white font-bold font-['Unbounded',sans-serif] text-sm">
                {formatRupees(vehiclePriceRupees)} <small className="font-sans font-normal text-xs text-slate-500">({vehiclePriceLakh.toFixed(2)}L)</small>
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="60"
              step="0.25"
              value={vehiclePriceLakh}
              onChange={(e) => setVehiclePriceLakh(parseFloat(e.target.value))}
              className="w-full accent-[#ff5a1f] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
              <span>₹3 Lakhs</span>
              <span>₹30 Lakhs</span>
              <span>₹60 Lakhs</span>
            </div>
          </div>

          {/* 2. Down Payment */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#556078] dark:text-[#9aa6c0]">Down Payment ({downPaymentPercent}%)</span>
              <span className="text-[#ff5a1f] font-bold font-['Unbounded',sans-serif] text-sm">{formatRupees(downPaymentRupees)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff5a1f] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex items-center gap-1.5 mt-2.5">
              {[15, 20, 30, 50].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    downPaymentPercent === pct
                      ? 'border-[#ff5a1f] bg-[#ff5a1f]/15 text-[#ff5a1f]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <span className="text-[11px] font-semibold text-slate-500 ml-auto">Loan: {formatLakhs(principalLoanAmount)}</span>
            </div>
          </div>

          {/* 3. Loan Tenure */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#556078] dark:text-[#9aa6c0]">Loan Tenure</span>
              <span className="text-[#101624] dark:text-white font-bold font-['Unbounded',sans-serif] text-sm">
                {tenureYears} Years <small className="font-sans font-normal text-xs text-slate-500">({tenureMonths} mo)</small>
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff5a1f] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex items-center gap-1.5 mt-2.5">
              {[3, 4, 5, 7].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setTenureYears(yr)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    tenureYears === yr
                      ? 'border-[#ff5a1f] bg-[#ff5a1f]/15 text-[#ff5a1f]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {yr} Yrs
                </button>
              ))}
            </div>
          </div>

          {/* 4. Interest Rate & Bank Presets */}
          <div className="p-4 rounded-2xl bg-[#e8edf4]/50 dark:bg-slate-800/50 border border-[#101624]/5 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#556078] dark:text-[#9aa6c0]">Interest Rate (p.a.)</span>
              <span className="text-[#101624] dark:text-white font-bold font-['Unbounded',sans-serif] text-sm">{interestRate.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="14.0"
              step="0.05"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full accent-[#ff5a1f] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />

            {/* Popular Banks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {POPULAR_BANKS.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setInterestRate(b.rate)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    interestRate === b.rate
                      ? 'border-[#ff5a1f] bg-[#ff5a1f]/15 text-[#ff5a1f]'
                      : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:border-slate-400'
                  }`}
                >
                  <p className="text-[10px] text-slate-500 truncate font-medium">{b.name}</p>
                  <p className="text-xs font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif]">{b.rate}%</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Output Card & Visual Breakdown */}
        <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#e8edf4]/80 dark:bg-slate-800/80 border border-[#101624]/10 dark:border-white/10">
          <div>
            <span className="text-[11px] font-bold text-[#556078] dark:text-[#9aa6c0] uppercase tracking-wider">
              Estimated Monthly EMI
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#ff5a1f] font-['Unbounded',sans-serif] tracking-tight mt-1 mb-5">
              {formatRupees(monthlyEmi)}
              <span className="text-xs font-normal text-slate-500 font-sans tracking-normal ml-2">/ month</span>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 text-xs pb-5 border-b border-[#101624]/10 dark:border-white/10">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Principal Loan:</span>
                <span className="font-bold text-[#101624] dark:text-white">{formatRupees(principalLoanAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Total Interest:</span>
                <span className="font-bold text-[#ff5a1f]">{formatRupees(totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Down Payment:</span>
                <span className="font-bold text-[#101624] dark:text-white">{formatRupees(downPaymentRupees)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-800 dark:text-slate-100 pt-1.5 font-semibold">
                <span>Total Out-of-Pocket:</span>
                <span className="font-bold text-[#101624] dark:text-white font-['Unbounded',sans-serif] text-sm">{formatRupees(totalPayable)}</span>
              </div>
            </div>

            {/* Split Visual Progress Bar */}
            <div className="mt-5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#101624] dark:bg-white" />
                  Principal ({principalRatio}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f]" />
                  Interest ({interestRatio}%)
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                <div style={{ width: `${principalRatio}%` }} className="bg-[#101624] dark:bg-white h-full" />
                <div style={{ width: `${interestRatio}%` }} className="bg-[#ff5a1f] h-full" />
              </div>
            </div>
          </div>

          {/* Affordability Rule Advice */}
          <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#101624]/10 dark:border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-[#101624] dark:text-white mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff5a1f] shrink-0" />
              <span>Recommended Monthly Income</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              To keep car EMI within healthy financial limits (max 10% of monthly income), a gross salary of{' '}
              <b className="text-[#101624] dark:text-white font-bold">{formatRupees(recommendedMonthlySalary)}/mo</b> is ideal.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion: Year-by-Year Amortization Schedule */}
      {!compact && (
        <div className="mt-8 pt-5 border-t border-[#101624]/10 dark:border-white/10">
          <button
            onClick={() => setShowAmortization(!showAmortization)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff5a1f] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ff5a1f]" />
              <span>View {tenureYears}-Year Loan Repayment Schedule (Amortization)</span>
            </span>
            {showAmortization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAmortization && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Principal Paid</th>
                    <th className="py-2.5 px-3">Interest Paid</th>
                    <th className="py-2.5 px-3">Total Paid in Year</th>
                    <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {amortizationSchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                      <td className="py-2.5 px-3 text-[#101624] dark:text-white font-semibold">{formatRupees(row.principalPaid)}</td>
                      <td className="py-2.5 px-3 text-[#ff5a1f] font-semibold">{formatRupees(row.interestPaid)}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                        {formatRupees(row.principalPaid + row.interestPaid)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-500">{formatRupees(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
