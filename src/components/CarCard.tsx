import React from 'react';
import { 
  ShieldCheck, 
  Fuel, 
  Zap, 
  ArrowLeftRight, 
  Heart, 
  Users, 
  Gauge, 
  CheckCircle2,
  Sparkles,
  Camera
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
    <div className="group relative rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-500/40 p-4 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
      <div>
        {/* Card Image Container */}
        <div 
          onClick={() => onViewDetails(car)}
          className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-3.5 cursor-pointer"
        >
          <CarImage
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            brand={car.brand}
            model={car.model}
            bodyType={car.bodyType}
            isEV={isEV}
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-slate-100 border border-white/10">
              {car.bodyType}
            </span>
            {isEV && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-600 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> EV
              </span>
            )}
            {isHybrid && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 text-[10px] font-bold">
                Hybrid
              </span>
            )}
          </div>

          {/* Top Right Action & Photo indicator */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {photoCount > 1 && (
              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-semibold text-slate-200 border border-white/10 flex items-center gap-1 shadow-sm">
                <Camera className="w-2.5 h-2.5 text-emerald-600" />
                {photoCount} Photos
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(car);
              }}
              className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-slate-600 hover:text-rose-500 border border-slate-200 transition-all cursor-pointer"
              title={isFavorite ? 'Remove from Saved' : 'Save Car'}
              aria-label="Save car"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Match Score Badge (if available) */}
          {matchScore && (
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500 text-black font-extrabold text-xs shadow-md shadow-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              <span>{matchScore.overallScore}% MATCH</span>
            </div>
          )}

          {/* Safety Rating Pill */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-emerald-300 font-bold text-[10px] border border-white/10">
            <ShieldCheck className="w-3 h-3" />
            <span>{car.safety.ratingStars || car.safety.globalNcapStars || 5}★ {car.safety.testingAgency || car.safety.crashTestAgency || 'BNCAP'}</span>
          </div>
        </div>

        {/* Brand & Model Headline */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase">{car.brand}</div>
            <h3 className="text-lg font-bold text-slate-900 font-['Manrope'] group-hover:text-emerald-600 transition-colors">
              {car.model}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-slate-900 font-['Manrope']">
              ₹{car.priceMinLakh}L – ₹{car.priceMaxLakh}L
            </div>
            <div className="text-[10px] text-slate-500">Ex-Showroom</div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-500 line-clamp-1 mb-3">
          {car.tagline}
        </p>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-white border border-slate-200 text-center mb-3">
          <div>
            <div className="text-[10px] text-slate-500">Mileage/Range</div>
            <div className="text-xs font-bold text-slate-800 truncate">
              {isEV ? `${car.specs.rangeKm} km` : `${car.specs.mileageKmPerLitreOrKWh} km/l`}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Power</div>
            <div className="text-xs font-bold text-slate-800 truncate">
              {car.specs.powerPS} PS
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Seating</div>
            <div className="text-xs font-bold text-slate-800 truncate">
              {car.specs.seatingCapacity} Seater
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
        {/* Quick Compare Checkbox */}
        <button
          type="button"
          onClick={() => onToggleCompare(car)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isCompared
              ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
              : 'text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>

        {/* View Details Primary Action */}
        <button
          type="button"
          onClick={() => onViewDetails(car)}
          className="flex-1 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg transition-all text-center cursor-pointer shadow-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
