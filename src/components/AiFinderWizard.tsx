import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Navigation, 
  Fuel, 
  ShieldCheck, 
  Sliders, 
  Gauge, 
  Wrench, 
  Tv, 
  Check,
  X
} from 'lucide-react';
import { UserPreferences, FuelType, DriveTerrain } from '../types';

interface AiFinderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: UserPreferences) => void;
  initialPreferences?: Partial<UserPreferences>;
}

export const AiFinderWizard: React.FC<AiFinderWizardProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPreferences
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [budgetMin, setBudgetMin] = useState<number>(initialPreferences?.budgetMinLakh || 8);
  const [budgetMax, setBudgetMax] = useState<number>(initialPreferences?.budgetMaxLakh || 18);
  const [familySize, setFamilySize] = useState<number>(initialPreferences?.familySize || 5);
  const [primaryUsage, setPrimaryUsage] = useState<DriveTerrain>(initialPreferences?.primaryUsage || 'City Commute');
  const [monthlyKm, setMonthlyKm] = useState<number>(initialPreferences?.monthlyKm || 1200);
  const [preferredFuel, setPreferredFuel] = useState<FuelType[]>(initialPreferences?.preferredFuel || ['Petrol', 'Electric', 'Strong Hybrid']);
  const [preferredTransmission, setPreferredTransmission] = useState<'Any' | 'Manual' | 'Automatic'>(initialPreferences?.preferredTransmission || 'Any');
  
  // Weights (1 to 5)
  const [priorities, setPriorities] = useState({
    safety: initialPreferences?.priorities?.safety || 5,
    mileage: initialPreferences?.priorities?.mileage || 4,
    performance: initialPreferences?.priorities?.performance || 3,
    comfortSpace: initialPreferences?.priorities?.comfortSpace || 4,
    lowMaintenance: initialPreferences?.priorities?.lowMaintenance || 4,
    featuresTech: initialPreferences?.priorities?.featuresTech || 4
  });

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit
      onSubmit({
        budgetMinLakh: budgetMin,
        budgetMaxLakh: budgetMax,
        familySize,
        primaryUsage,
        monthlyKm,
        preferredFuel,
        preferredBodyTypes: [],
        preferredTransmission,
        priorities
      });
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const budgetPresets = [
    { label: 'Under ₹10 Lakhs', min: 5, max: 10 },
    { label: '₹10 – 15 Lakhs', min: 10, max: 15 },
    { label: '₹15 – 22 Lakhs', min: 15, max: 22 },
    { label: '₹22 – 35 Lakhs', min: 22, max: 35 },
    { label: '₹35 Lakhs+', min: 35, max: 60 }
  ];

  const fuelOptions: FuelType[] = ['Electric', 'Strong Hybrid', 'Petrol', 'Diesel', 'CNG'];

  const toggleFuel = (fuel: FuelType) => {
    if (preferredFuel.includes(fuel)) {
      if (preferredFuel.length > 1) {
        setPreferredFuel(preferredFuel.filter(f => f !== fuel));
      }
    } else {
      setPreferredFuel([...preferredFuel, fuel]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Top Header & Progress Bar */}
        <div className="p-6 border-b border-slate-200 bg-white/60">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Manrope']">AI Car Finder</h3>
                <p className="text-xs text-slate-500">Step {step} of {totalSteps} — Finding your personal match</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
          {/* STEP 1: Budget */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 font-['Manrope'] mb-1">What's your total budget?</h4>
                <p className="text-xs text-slate-500">Select an approximate ex-showroom price bracket or customize the range.</p>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {budgetPresets.map((preset, idx) => {
                  const isSelected = budgetMin === preset.min && budgetMax === preset.max;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBudgetMin(preset.min);
                        setBudgetMax(preset.max);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-emerald-500/15 border-emerald-400 text-emerald-600 font-bold shadow-sm shadow-emerald-500/20' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{preset.label}</div>
                      <div className="text-[10px] text-slate-500">₹{preset.min}L - ₹{preset.max}L</div>
                    </button>
                  );
                })}
              </div>

              {/* Sliders */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Selected Range:</span>
                  <span className="text-base font-bold text-emerald-600 font-['Manrope']">
                    ₹{budgetMin} Lakhs — ₹{budgetMax} Lakhs
                  </span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 flex justify-between mb-1">
                    <span>Max Budget Ceiling: ₹{budgetMax} Lakhs</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="1"
                    value={budgetMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBudgetMax(val);
                      if (budgetMin >= val) setBudgetMin(Math.max(5, val - 3));
                    }}
                    className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Seating & Family */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 font-['Manrope'] mb-1">How many people travel with you?</h4>
                <p className="text-xs text-slate-500">We'll ensure adequate seating, shoulder room, and boot space.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    size: 2,
                    title: '1 to 2 People',
                    subtitle: 'Solo / Couple',
                    desc: 'Compact size, agile parking, maximum efficiency'
                  },
                  {
                    size: 5,
                    title: '4 to 5 People',
                    subtitle: 'Nuclear Family',
                    desc: 'Spacious 2nd row, 400L+ boot space for luggage'
                  },
                  {
                    size: 7,
                    title: '6 to 7 People',
                    subtitle: 'Large / Joint Family',
                    desc: 'Dedicated 3rd row seating or executive captain seats'
                  }
                ].map((item, idx) => {
                  const isSelected = familySize === item.size;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFamilySize(item.size)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Users className={`w-5 h-5 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-['Manrope']">{item.title}</div>
                      <div className="text-xs font-medium text-emerald-600/90 mb-1">{item.subtitle}</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Driving Pattern */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 font-['Manrope'] mb-1">Where do you drive most?</h4>
                <p className="text-xs text-slate-500">Calculates suspension setup, ground clearance, and powertrain suitability.</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'City Commute', label: 'City Traffic', desc: 'Bumper to bumper, parking, tight U-turns' },
                  { id: 'Highway Trips', label: 'Highway Cruising', desc: 'High-speed stability, overtaking punch, ADAS' },
                  { id: 'Mixed Daily', label: 'Mixed Daily', desc: '50% city office commute, 50% weekend getaways' },
                  { id: 'Rough Roads / Hills', label: 'Rough Roads / Hills', desc: 'High ground clearance, tough suspension, hill hold' }
                ].map((terrain, idx) => {
                  const isSelected = primaryUsage === terrain.id;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrimaryUsage(terrain.id as DriveTerrain)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-400 shadow-sm shadow-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 font-['Manrope'] mb-0.5">{terrain.label}</div>
                      <div className="text-[11px] text-slate-500">{terrain.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Monthly Distance */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Expected Monthly Driving:</span>
                  <span className="text-sm font-bold text-emerald-600">{monthlyKm} km / month</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="3500"
                  step="100"
                  value={monthlyKm}
                  onChange={(e) => setMonthlyKm(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Light (500km)</span>
                  <span>Average (1,200km)</span>
                  <span>Heavy (2,500km+)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Fuel & Transmission */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 font-['Manrope'] mb-1">Fuel & Transmission Preferences</h4>
                <p className="text-xs text-slate-500">Select any fuel types you are open to considering.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-2.5 block">Accepted Fuel Types:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fuelOptions.map((fuel) => {
                    const isSelected = preferredFuel.includes(fuel);
                    return (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => toggleFuel(fuel)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-400 text-emerald-600 font-semibold'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs">{fuel}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-2.5 block">Transmission Preference:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Any', 'Automatic', 'Manual'].map((trans) => (
                    <button
                      key={trans}
                      type="button"
                      onClick={() => setPreferredTransmission(trans as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        preferredTransmission === trans
                          ? 'bg-emerald-500/15 border-emerald-400 text-emerald-600'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {trans === 'Automatic' ? 'Automatic (AT/DCT/CVT)' : trans}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Priorities Weighting */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-slate-900 font-['Manrope'] mb-1">What matters most to you?</h4>
                <p className="text-xs text-slate-500">Rate the importance of each factor from 1 to 5 to tune the ranking formula.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'safety', label: 'Safety & Crash Rating (5-Star / ADAS)', icon: ShieldCheck },
                  { key: 'mileage', label: 'Fuel Economy & Running Cost', icon: Fuel },
                  { key: 'performance', label: 'Engine Power & Quick Acceleration', icon: Gauge },
                  { key: 'comfortSpace', label: 'Rear Seat Comfort & Boot Luggage', icon: Users },
                  { key: 'lowMaintenance', label: 'Low Service Cost & Reliability', icon: Wrench },
                  { key: 'featuresTech', label: 'Touchscreen, Sunroof & Tech', icon: Tv }
                ].map((item) => {
                  const val = priorities[item.key as keyof typeof priorities];
                  return (
                    <div key={item.key} className="p-3 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <item.icon className="w-3.5 h-3.5 text-emerald-600" />
                          {item.label}
                        </span>
                        <span className="text-emerald-600 font-bold">{val} / 5</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setPriorities({ ...priorities, [item.key]: star })}
                            className={`flex-1 py-1 text-[10px] font-bold rounded ${
                              star <= val ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                            }`}
                          >
                            {star}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                step === 1 
                  ? 'opacity-40 cursor-not-allowed text-slate-500' 
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <button
              type="button"
              id="finder-next-btn"
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <span>{step === totalSteps ? 'Calculate AI Recommendations' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
