import React from 'react';
import { 
  ShieldCheck, 
  Fuel, 
  Zap, 
  ArrowLeftRight, 
  Heart, 
  Sparkles,
  Camera,
  ArrowRight
} from 'lucide-react';
import { Car, MatchScoreBreakdown } from '../types';
import { CarImage } from './CarImage';

interface CarCardProps {
  car: Car;
  matchScore?: MatchScoreBreakdown;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  onViewDetails: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  matchScore,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onViewDetails
}) => {
  const isEV = car.fuelTypes.includes('Electric');
  const isHybrid = car.fuelTypes.includes('Strong Hybrid');
  const photoCount = car.galleryImages?.length || 1;

  return (
    <div className="group relative rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl border border-[#101624]/10 dark:border-white/10 hover:border-[#ff5a1f]/50 p-4 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-[#ff5a1f]/10 flex flex-col justify-between">
      <div>
        {/* Card Image Container */}
        <div 
          onClick={() => onViewDetails(car)}
          className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3.5 cursor-pointer"
        >
          <CarImage
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            brand={car.brand}
            model={car.model}
            bodyType={car.bodyType}
            isEV={isEV}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/15">
              {car.bodyType}
            </span>
            {isEV && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff5a1f]/20 text-[#ff5a1f] border border-[#ff5a1f]/30 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
                <Zap className="w-2.5 h-2.5" /> EV
              </span>
            )}
            {isHybrid && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold backdrop-blur-md">
                Hybrid
              </span>
            )}
          </div>

          {/* Top Right Action & Photo indicator */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {photoCount > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-slate-200 border border-white/15 flex items-center gap-1 shadow-sm">
                <Camera className="w-2.5 h-2.5 text-[#ff5a1f]" />
                {photoCount}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(car);
              }}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white hover:text-rose-500 border border-white/15 transition-all cursor-pointer"
              title={isFavorite ? 'Remove from Saved' : 'Save Car'}
              aria-label="Save car"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Match Score Badge (if available) */}
          {matchScore && (
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ff5a1f] text-white font-black text-[11px] shadow-lg shadow-[#ff5a1f]/40 font-['Unbounded',sans-serif]">
              <Sparkles className="w-3 h-3" />
              <span>{matchScore.overallScore}% MATCH</span>
            </div>
          )}

          {/* Safety Rating Pill */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white font-bold text-[10px] border border-white/15">
            <ShieldCheck className="w-3 h-3 text-[#ff5a1f]" />
            <span>{car.safety.ratingStars || car.safety.globalNcapStars || 5}★ {car.safety.testingAgency || car.safety.crashTestAgency || 'BNCAP'}</span>
          </div>
        </div>

        {/* Brand & Model Headline */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <div className="text-[10px] font-bold text-[#ff5a1f] tracking-wider uppercase">{car.brand}</div>
            <h3 className="text-base font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] group-hover:text-[#ff5a1f] transition-colors line-clamp-1">
              {car.model}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif]">
              ₹{car.priceMinLakh}L–{car.priceMaxLakh}L
            </div>
            <div className="text-[10px] text-slate-500">Ex-Showroom</div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
          {car.tagline}
        </p>

        {/* Key Specs Grid in CarSuggest panel styling */}
        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-[#e8edf4]/60 dark:bg-slate-800/60 border border-[#101624]/5 dark:border-white/5 text-center mb-3">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500">Mileage</div>
            <div className="text-xs font-bold text-[#101624] dark:text-[#eef2fb] truncate">
              {isEV ? `${car.specs.rangeKm} km` : `${car.specs.mileageKmPerLitreOrKWh} km/l`}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500">Power</div>
            <div className="text-xs font-bold text-[#101624] dark:text-[#eef2fb] truncate">
              {car.specs.powerPS} PS
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500">Seats</div>
            <div className="text-xs font-bold text-[#101624] dark:text-[#eef2fb] truncate">
              {car.specs.seatingCapacity} Seater
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-[#101624]/10 dark:border-white/10 flex items-center justify-between gap-2">
        {/* Quick Compare Checkbox */}
        <button
          type="button"
          onClick={() => onToggleCompare(car)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isCompared
              ? 'bg-[#ff5a1f]/15 text-[#ff5a1f] border border-[#ff5a1f]/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-[#101624] dark:hover:text-white bg-black/5 dark:bg-white/5'
          }`}
        >
          <ArrowLeftRight className="w-3 h-3" />
          <span>{isCompared ? 'In Compare' : 'Compare'}</span>
        </button>

        {/* View Details Primary Action */}
        <button
          type="button"
          onClick={() => onViewDetails(car)}
          className="flex-1 py-1.5 px-3 bg-[#101624] hover:bg-black dark:bg-[#eef2fb] dark:hover:bg-white text-white dark:text-[#101624] font-bold text-xs rounded-full transition-all text-center cursor-pointer shadow-sm hover:shadow-[0_8px_20px_-4px_#ff5a1f] flex items-center justify-center gap-1"
        >
          <span>Details</span>
          <ArrowRight className="w-3 h-3 text-[#ff5a1f]" />
        </button>
      </div>
    </div>
  );
};
