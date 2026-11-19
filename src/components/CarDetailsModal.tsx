import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Fuel, 
  Zap, 
  ArrowLeftRight, 
  Heart, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  MessageSquare, 
  ChevronRight,
  ChevronLeft,
  Gauge,
  Sparkles,
  Users,
  Award,
  Layers,
  Wrench,
  Camera
} from 'lucide-react';
import { Car } from '../types';
import { calculateOwnershipCost } from '../lib/ownershipCalculator';
import { CarImage } from './CarImage';
import { EmiCalculatorWidget } from './EmiCalculatorWidget';

interface CarDetailsModalProps {
  car: Car | null;
  onClose: () => void;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  onAskAi: (carName: string) => void;
  onOpenFullOwnership: (car: Car) => void;
}

export const CarDetailsModal: React.FC<CarDetailsModalProps> = ({
  car,
  onClose,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onAskAi,
  onOpenFullOwnership
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'safety' | 'variants' | 'emi' | 'ownership'>('overview');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!car) return null;

  const isEV = car.fuelTypes.includes('Electric');
  const isHybrid = car.fuelTypes.includes('Strong Hybrid');
  const gallery = car.galleryImages && car.galleryImages.length > 0 ? car.galleryImages : [car.image];

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  // Quick TCO estimation
  const quickTCO = calculateOwnershipCost({
    car,
    selectedPriceLakh: car.priceMinLakh,
    downPaymentPercent: 20,
    loanTenureYears: 5,
    interestRatePercent: 9.0,
    monthlyDrivingKm: 1200
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#101624]/10 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#ff5a1f] uppercase tracking-wider">{car.brand}</span>
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">{car.bodyType}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif]">{car.model}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(car)}
              className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-200 text-slate-600 hover:text-rose-500 border border-slate-200 transition-all"
              title={isFavorite ? 'Remove from Saved' : 'Save Car'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => onToggleCompare(car)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isCompared
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600'
                  : 'bg-[#F8FAFC] hover:bg-slate-200 border-slate-200 text-slate-600'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Hero Media & Quick Metrics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-2.5">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                <CarImage
                  src={gallery[activeImageIdx] || car.image}
                  alt={`${car.brand} ${car.model}`}
                  brand={car.brand}
                  model={car.model}
                  bodyType={car.bodyType}
                  isEV={isEV}
                  className="transition-transform duration-500 group-hover:scale-102"
                />

                {/* Safety & ADAS Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-bold text-emerald-300 border border-white/10">
                    {car.safety.ratingStars}★ {car.safety.testingAgency} Safety
                  </span>
                  {car.safety.hasADAS && (
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-bold text-cyan-300 border border-white/10">
                      Level {car.safety.adasLevel || 2} ADAS
                    </span>
                  )}
                </div>

                {/* Photo Counter Pill */}
                {gallery.length > 1 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-lg text-[11px] font-semibold text-slate-100 border border-white/10 flex items-center gap-1.5">
                    <Camera className="w-3 h-3 text-emerald-600" />
                    <span>{activeImageIdx + 1} / {gallery.length}</span>
                  </div>
                )}

                {/* Next / Previous Navigation Arrows */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 sm:w-20 h-11 sm:h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImageIdx === idx ? 'border-emerald-400 ring-2 ring-emerald-400/20 scale-102' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Photo ${idx + 1}`} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Primary Highlights */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="text-xs text-slate-500 font-medium">Ex-Showroom Price Range</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Manrope']">
                  ₹{car.priceMinLakh}L – ₹{car.priceMaxLakh}L
                </div>
                <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 pt-1">
                  <Calculator className="w-3.5 h-3.5" />
                  Estimated Monthly EMI from ~₹{quickTCO.monthlyEMI.toLocaleString('en-IN')}/mo
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-500">Power Output</div>
                  <div className="text-sm font-bold text-slate-900 font-['Manrope']">{car.specs.powerPS} PS</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-500">Peak Torque</div>
                  <div className="text-sm font-bold text-slate-900 font-['Manrope']">{car.specs.torqueNM} Nm</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-500">{isEV ? 'Certified Range' : 'ARAI Mileage'}</div>
                  <div className="text-sm font-bold text-emerald-600 font-['Manrope']">
                    {isEV ? `${car.specs.rangeKm || 400} km` : `${car.specs.mileageKmPerLitreOrKWh} km/l`}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-500">Ground Clearance</div>
                  <div className="text-sm font-bold text-slate-900 font-['Manrope']">{car.specs.groundClearanceMm || car.specs.groundClearanceMM || 185} mm</div>
                </div>
              </div>

              {/* Quick Ask AI Trigger */}
              <button
                onClick={() => onAskAi(`${car.brand} ${car.model}`)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Ask DriveAI: Is this right for my family?
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#101624]/10 dark:border-white/10 gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Pros/Cons' },
              { id: 'specs', label: 'Engine & Dimensions' },
              { id: 'safety', label: 'Safety & ADAS Features' },
              { id: 'variants', label: `Variants (${car.variants.length})` },
              { id: 'emi', label: 'EMI Calculator' },
              { id: 'ownership', label: '5-Year Cost' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#ff5a1f] text-[#ff5a1f] bg-[#ff5a1f]/5 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {car.tagline}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pros */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strongest Advantages
                  </h4>
                  <ul className="text-xs text-slate-800 space-y-1.5">
                    {car.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-amber-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Keep in Mind (Compromises)
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    {car.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best Suited For Profile */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" /> Ideal Target Buyer Profile
                </h4>
                <div className="flex flex-wrap gap-2">
                  {car.bestSuitedFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-medium rounded-lg"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Technical Specifications */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase">Engine & Powertrain</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Engine / Motor</span>
                      <span className="font-semibold text-slate-900 text-right max-w-[200px]">{car.specs.engineDisplacement}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Max Power</span>
                      <span className="font-semibold text-slate-900">{car.specs.powerPS} PS</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Max Torque</span>
                      <span className="font-semibold text-slate-900">{car.specs.torqueNM} Nm</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">0 to 100 km/h</span>
                      <span className="font-semibold text-slate-900">{car.specs.acceleration0to100 ? `${car.specs.acceleration0to100} seconds` : 'Under 10.5 seconds'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Top Speed</span>
                      <span className="font-semibold text-slate-900">{car.specs.topSpeedKmH} km/h</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase">Capacity & Dimensions</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Seating Capacity</span>
                      <span className="font-semibold text-slate-900">{car.specs.seatingCapacity} Passengers</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Boot Luggage Space</span>
                      <span className="font-semibold text-slate-900">{car.specs.bootSpaceLitres} Litres</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Ground Clearance</span>
                      <span className="font-semibold text-slate-900">{car.specs.groundClearanceMm || car.specs.groundClearanceMM || 185} mm</span>
                    </div>
                    {isEV ? (
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Battery Capacity</span>
                        <span className="font-semibold text-slate-900">{car.specs.batteryCapacityKWh} kWh</span>
                      </div>
                    ) : (
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Fuel Tank Capacity</span>
                        <span className="font-semibold text-slate-900">{car.specs.fuelTankCapacityLitres} Litres</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Safety & ADAS */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {car.safety.ratingStars || car.safety.globalNcapStars || 5}-Star Certified Crash Test Rating
                    </div>
                    <div className="text-xs text-slate-500">Tested by {car.safety.testingAgency || car.safety.crashTestAgency || 'BNCAP'} (Adult & Child Occupant Safety)</div>
                  </div>
                </div>
                <div className="text-emerald-600 font-extrabold text-2xl font-['Manrope']">
                  {car.safety.ratingStars || car.safety.globalNcapStars || 5} / 5 ★
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase">Standard & Active Safety Equipment</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(car.safety.keySafetyFeatures || ['6 Airbags Standard', 'Electronic Stability Program (ESP)', 'Hill Hold Assist', 'ISOFIX Child Seat Anchors', 'ABS with EBD']).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 p-2 rounded-lg bg-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Variants */}
          {activeTab === 'variants' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Compare price, transmission and key inclusions across trims:
              </div>

              <div className="space-y-2.5">
                {car.variants.map((v, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 font-['Manrope']">{v.name}</span>
                        <span className="px-2 py-0.2 rounded bg-slate-800 text-[10px] text-slate-600">{v.fuel}</span>
                        <span className="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-600 text-[10px]">{v.transmission}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {v.keyFeatures.map((feat, i) => (
                          <span key={i} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-extrabold text-emerald-600 font-['Manrope']">
                        ₹{v.priceLakh.toFixed(2)} Lakhs
                      </div>
                      <div className="text-[10px] text-slate-500">Ex-Showroom</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EMI Calculator */}
          {activeTab === 'emi' && (
            <div className="space-y-4">
              <EmiCalculatorWidget
                initialPriceLakh={(car.priceMinLakh + car.priceMaxLakh) / 2}
                carName={`${car.brand} ${car.name}`}
              />
            </div>
          )}

          {/* TAB 6: Ownership */}
          {activeTab === 'ownership' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">Est. Monthly EMI</div>
                  <div className="text-base font-bold text-emerald-600 font-['Manrope']">₹{quickTCO.monthlyEMI.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">Monthly Fuel / Power</div>
                  <div className="text-base font-bold text-slate-900 font-['Manrope']">₹{quickTCO.monthlyFuelCost.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">Annual Maintenance</div>
                  <div className="text-base font-bold text-slate-900 font-['Manrope']">₹{car.ownership.avgAnnualMaintenance.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">Standard Warranty</div>
                  <div className="text-base font-bold text-slate-900 font-['Manrope']">{car.ownership.warrantyYears} Years</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#141924] to-[#121620] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Full 5-Year Total Cost of Ownership Calculator</div>
                  <div className="text-[11px] text-slate-500">Simulate loans, custom fuel prices, and EV vs Petrol cost savings.</div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenFullOwnership(car);
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
                >
                  Open 5-Yr TCO Studio &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
